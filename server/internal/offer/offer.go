// Package offer holds the surplus sellers post: what it is, its units and
// price against the original price, the window it is collected in and where.
// The rules come from the products read for SEC-11: Open Food Network for
// units and prices kept on the offer and copied by orders, Too Good To Go for
// the price against a retail value and the kinds, Umi Feeds for a window with
// a start and an end, foodsharing for reading expiry from the window in every
// query.
package offer

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/kl3inIT/second-bite/server/internal/audit"
	"github.com/kl3inIT/second-bite/server/internal/file"
	"github.com/kl3inIT/second-bite/server/internal/offer/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/seller"
)

// maxListed bounds one page of a seller's offers.
const maxListed = 100

// Status is where an offer stands for a customer. Only on_sale and withdrawn
// are stored; sold out and closed are read from the units left and the
// window, so nothing waits for a job.
type Status string

// The statuses of an offer.
const (
	StatusOnSale    Status = "on_sale"
	StatusSoldOut   Status = "sold_out"
	StatusClosed    Status = "closed"
	StatusWithdrawn Status = "withdrawn"
)

// Offer is surplus a seller posted.
type Offer struct {
	ID       uuid.UUID
	SellerID uuid.UUID
	Status   Status
	Details
	UnitsLeft       int
	DiscountPercent int
	// CollectionPoint is copied from the seller when the offer is posted.
	CollectionPoint seller.CollectionPoint
	CreatedAt       time.Time
	UpdatedAt       time.Time
	WithdrawnAt     *time.Time
	// sellerName is copied with the collection point, for search.
	sellerName string
}

// searchText is what search finds an offer by.
func (o Offer) searchText() string {
	return searchVector(field{o.Name, 'A'}, field{o.sellerName, 'B'}, field{o.Description, 'C'})
}

// Service is the module's published API.
type Service struct {
	pool    *pgxpool.Pool
	queries *db.Queries
	sellers *seller.Service
	files   *file.Service
	events  *platform.Events
	trail   *audit.Service
	logger  *slog.Logger
	now     func() time.Time
}

// NewService assembles the module.
func NewService(
	pool *pgxpool.Pool, sellers *seller.Service, files *file.Service, events *platform.Events, trail *audit.Service,
	logger *slog.Logger,
) *Service {
	return &Service{
		pool: pool, queries: db.New(pool), sellers: sellers, files: files, events: events, trail: trail, logger: logger,
		now: time.Now,
	}
}

// Post puts an offer on sale for a seller the caller owns or works for, at
// the seller's collection point. Its photo is one the caller uploaded, or one
// an earlier offer of the same seller uses, which is how staff post again.
func (s *Service) Post(ctx context.Context, sellerID uuid.UUID, d Details) (Offer, error) {
	caller, err := platform.RequireCaller(ctx)
	if err != nil {
		return Offer{}, err
	}

	publisher, err := s.sellers.Publishing(ctx, sellerID, caller.AccountID)
	if err != nil {
		return Offer{}, err
	}

	d, err = d.normalized()
	if err != nil {
		return Offer{}, err
	}

	set, err := s.settings(ctx)
	if err != nil {
		return Offer{}, err
	}

	if err := checkDiscount(d.PriceVND, d.OriginalPriceVND, set); err != nil {
		return Offer{}, err
	}

	if err := checkWindow(d.WindowStart, d.WindowEnd, s.now(), set); err != nil {
		return Offer{}, err
	}

	if err := s.usePhoto(ctx, sellerID, d.PhotoID, caller.AccountID); err != nil {
		return Offer{}, err
	}

	id, err := s.queries.InsertOffer(ctx, db.InsertOfferParams{
		SellerID: sellerID, PostedBy: caller.AccountID, Name: d.Name, Description: d.Description,
		Kind: string(d.Kind), Unit: d.Unit, Units: int32(d.Units), //nolint:gosec // at most 999
		PriceVnd: d.PriceVND, OriginalPriceVnd: d.OriginalPriceVND, WeightGrams: weight(d.WeightGrams),
		PhotoID: d.PhotoID, WindowStart: d.WindowStart, WindowEnd: d.WindowEnd,
		Latitude: publisher.Latitude, Longitude: publisher.Longitude, Address: publisher.Address,
		SellerName: publisher.Name, SearchVector: Offer{Details: d, sellerName: publisher.Name}.searchText(),
	})
	if err != nil {
		return Offer{}, fmt.Errorf("storing the offer: %w", err)
	}

	s.logger.InfoContext(ctx, "offer posted",
		slog.String("event", "offer.offer.posted"),
		slog.String("offer_id", id.String()),
		slog.String("seller_id", sellerID.String()),
		slog.String("account_id", caller.AccountID.String()),
	)

	return s.read(ctx, id)
}

// Get returns an offer: to anyone while it is on sale or sold out, its window
// open and its seller active, otherwise only to its seller's people and
// admins.
func (s *Service) Get(ctx context.Context, id uuid.UUID) (Offer, error) {
	o, err := s.read(ctx, id)
	if err != nil {
		return Offer{}, err
	}

	if o.Status == StatusOnSale || o.Status == StatusSoldOut {
		active, err := s.sellers.Publics(ctx, []uuid.UUID{o.SellerID})
		if err != nil {
			return Offer{}, err
		}

		if _, ok := active[o.SellerID]; ok {
			return o, nil
		}
	}

	if _, err := platform.RequireCaller(ctx); err != nil {
		return Offer{}, ErrNotFound
	}

	if _, err := s.sellers.Get(ctx, o.SellerID); err != nil {
		return Offer{}, ErrNotFound
	}

	return o, nil
}

// OfSeller lists a seller's offers, newest first, to its people and admins;
// status, when set, keeps those in it. Staff post again from this list.
func (s *Service) OfSeller(ctx context.Context, sellerID uuid.UUID, status Status, limit, offset int) ([]Offer, error) {
	if _, err := s.sellers.Get(ctx, sellerID); err != nil {
		return nil, err
	}

	rows, err := s.queries.SellerOffers(ctx, db.SellerOffersParams{
		SellerID: sellerID, Status: string(status),
		MaxRows: int32(min(max(limit, 1), maxListed)), SkipRows: int32(max(offset, 0)), //nolint:gosec // bounded above
	})
	if err != nil {
		return nil, fmt.Errorf("listing the seller's offers: %w", err)
	}

	offers := make([]Offer, 0, len(rows))
	for _, r := range rows {
		offers = append(offers, s.fromRow(db.GetOfferRow(r)))
	}

	return offers, nil
}

// Change is a change to an offer; a nil field stays as it is.
type Change struct {
	Name             *string
	Description      *string
	Kind             *Kind
	Unit             *string
	Units            *int
	PriceVND         *int64
	OriginalPriceVND *int64
	WeightGrams      *int
	PhotoID          *uuid.UUID
	WindowStart      *time.Time
	WindowEnd        *time.Time
}

// Change changes an offer of a seller the caller publishes for. Before any
// unit is ordered everything may change; once units are ordered, only the
// description, the photo, the units (never below the units ordered) and the
// window, since an order keeps the price and the name it was placed at (Open
// Food Network copies them onto the order line), and follows the window: a
// change of it is published, and `order` moves the orders still to collect.
// Nothing changes once the window is over or the offer is withdrawn.
func (s *Service) Change(ctx context.Context, id uuid.UUID, c Change) (Offer, error) {
	caller, err := platform.RequireCaller(ctx)
	if err != nil {
		return Offer{}, err
	}

	current, err := s.read(ctx, id)
	if err != nil {
		return Offer{}, err
	}

	if _, err := s.sellers.Publishing(ctx, current.SellerID, caller.AccountID); errors.Is(err, seller.ErrNotFound) {
		return Offer{}, ErrNotFound
	} else if err != nil {
		return Offer{}, err
	}

	set, err := s.settings(ctx)
	if err != nil {
		return Offer{}, err
	}

	err = pgx.BeginFunc(ctx, s.pool, func(tx pgx.Tx) error {
		return s.changeIn(ctx, tx, id, c, set, caller.AccountID)
	})
	if err != nil {
		return Offer{}, err
	}

	s.logger.InfoContext(ctx, "offer changed",
		slog.String("event", "offer.offer.changed"),
		slog.String("offer_id", id.String()),
		slog.String("account_id", caller.AccountID.String()),
	)

	return s.read(ctx, id)
}

// changeIn applies c to the offer in tx, which locks it first, and tells the
// other modules when the window of an offer with orders moved.
func (s *Service) changeIn(
	ctx context.Context, tx pgx.Tx, id uuid.UUID, c Change, set Settings, accountID uuid.UUID,
) error {
	q := s.queries.WithTx(tx)

	row, err := q.LockOffer(ctx, id)
	if err != nil {
		return fmt.Errorf("locking the offer: %w", err)
	}

	o := s.fromRow(db.GetOfferRow(row))
	if o.Status == StatusWithdrawn || o.Status == StatusClosed {
		return ErrChangeNotAllowed
	}

	next, err := s.applyChange(ctx, o, c, set, accountID)
	if err != nil {
		return err
	}

	ordered := o.Units - o.UnitsLeft

	if err := q.UpdateOffer(ctx, db.UpdateOfferParams{
		ID: id, Name: next.Name, Description: next.Description, Kind: string(next.Kind), Unit: next.Unit,
		Units: int32(next.Units), UnitsLeft: int32(next.Units - ordered), //nolint:gosec // at most 999
		PriceVnd: next.PriceVND, OriginalPriceVnd: next.OriginalPriceVND, WeightGrams: weight(next.WeightGrams),
		PhotoID: next.PhotoID, WindowStart: next.WindowStart, WindowEnd: next.WindowEnd,
		SearchVector: Offer{Details: next, sellerName: o.sellerName}.searchText(),
	}); err != nil {
		return err
	}

	// The orders placed on the offer follow its window.
	if ordered > 0 && (c.WindowStart != nil || c.WindowEnd != nil) {
		return platform.Publish(ctx, tx, s.events, WindowChangedEvent{OfferID: id})
	}

	return nil
}

// touchesWhatOrdersKeep tells whether c changes what an order keeps from its
// offer: everything but the description, the photo, the units and the window,
// which orders follow.
func (c Change) touchesWhatOrdersKeep() bool {
	return c.Name != nil || c.Kind != nil || c.Unit != nil || c.PriceVND != nil || c.OriginalPriceVND != nil ||
		c.WeightGrams != nil
}

// WindowChangedEvent tells the other modules that an offer with orders has a
// new collection window, which they read from the offer.
type WindowChangedEvent struct {
	OfferID uuid.UUID `json:"offerId"`
}

// EventKey names the event where it is stored, delivered and logged.
func (WindowChangedEvent) EventKey() string { return "offer.window_changed" }

// Window is when an offer is collected.
type Window struct {
	Start, End time.Time
}

// WindowsOf returns the collection windows of offers, whatever their status;
// an offer that does not exist is left out. It is for modules that follow an
// offer's window, not for people.
func (s *Service) WindowsOf(ctx context.Context, ids []uuid.UUID) (map[uuid.UUID]Window, error) {
	rows, err := s.queries.WindowsOf(ctx, ids)
	if err != nil {
		return nil, fmt.Errorf("reading the offers' windows: %w", err)
	}

	windows := make(map[uuid.UUID]Window, len(rows))
	for _, r := range rows {
		windows[r.ID] = Window{Start: r.WindowStart, End: r.WindowEnd}
	}

	return windows, nil
}

// appliedTo returns d with every field c sets replaced.
func (c Change) appliedTo(d Details) Details {
	replace(&d.Name, c.Name)
	replace(&d.Description, c.Description)
	replace(&d.Kind, c.Kind)
	replace(&d.Unit, c.Unit)
	replace(&d.Units, c.Units)
	replace(&d.PriceVND, c.PriceVND)
	replace(&d.OriginalPriceVND, c.OriginalPriceVND)
	replace(&d.PhotoID, c.PhotoID)
	replace(&d.WindowStart, c.WindowStart)
	replace(&d.WindowEnd, c.WindowEnd)

	if c.WeightGrams != nil {
		d.WeightGrams = c.WeightGrams
	}

	return d
}

// applyChange returns the offer's details once c is applied, checking what
// the change touches against its orders and the settings.
func (s *Service) applyChange(ctx context.Context, o Offer, c Change, set Settings, accountID uuid.UUID) (Details, error) {
	ordered := o.Units - o.UnitsLeft

	// What an order keeps stays once units are ordered.
	if ordered > 0 && c.touchesWhatOrdersKeep() {
		return Details{}, ErrChangeNotAllowed
	}

	next, err := c.appliedTo(o.Details).normalized()
	if err != nil {
		return Details{}, err
	}

	if next.Units < ordered {
		return Details{}, ErrChangeNotAllowed
	}

	// Rules the settings hold are checked on what changes, so an offer
	// posted under earlier settings keeps what it had.
	if c.PriceVND != nil || c.OriginalPriceVND != nil {
		if err := checkDiscount(next.PriceVND, next.OriginalPriceVND, set); err != nil {
			return Details{}, err
		}
	}

	if c.WindowStart != nil || c.WindowEnd != nil {
		if err := checkWindow(next.WindowStart, next.WindowEnd, s.now(), set); err != nil {
			return Details{}, err
		}
	}

	if next.PhotoID != o.PhotoID {
		if err := s.usePhoto(ctx, o.SellerID, next.PhotoID, accountID); err != nil {
			return Details{}, err
		}
	}

	return next, nil
}

// Withdraw takes an offer off sale for good; it keeps its row and leaves
// every customer's read. Its seller's owner or staff may, even when the
// seller has been blocked. Withdrawing again changes nothing.
func (s *Service) Withdraw(ctx context.Context, id uuid.UUID) (Offer, error) {
	caller, err := platform.RequireCaller(ctx)
	if err != nil {
		return Offer{}, err
	}

	o, err := s.read(ctx, id)
	if err != nil {
		return Offer{}, err
	}

	member, err := s.sellers.Get(ctx, o.SellerID)
	if err != nil || member.MyRole == "" {
		return Offer{}, ErrNotFound
	}

	switch o.Status {
	case StatusWithdrawn:
		return o, nil
	case StatusClosed:
		return Offer{}, ErrChangeNotAllowed
	case StatusOnSale, StatusSoldOut:
	}

	if err := s.queries.WithdrawOffer(ctx, id); err != nil {
		return Offer{}, fmt.Errorf("withdrawing the offer: %w", err)
	}

	s.logger.InfoContext(ctx, "offer withdrawn",
		slog.String("event", "offer.offer.withdrawn"),
		slog.String("offer_id", id.String()),
		slog.String("account_id", caller.AccountID.String()),
	)

	return s.read(ctx, id)
}

// usePhoto lets an offer of a seller show a photo: one an earlier offer of
// the seller already shows, or one the caller uploaded, which file then
// keeps.
func (s *Service) usePhoto(ctx context.Context, sellerID, photoID, accountID uuid.UUID) error {
	used, err := s.queries.SellerUsesPhoto(ctx, db.SellerUsesPhotoParams{SellerID: sellerID, PhotoID: photoID})
	if err != nil {
		return fmt.Errorf("reading the seller's photos: %w", err)
	}

	if used {
		return nil
	}

	return s.files.Claim(ctx, photoID, accountID)
}

func (s *Service) read(ctx context.Context, id uuid.UUID) (Offer, error) {
	row, err := s.queries.GetOffer(ctx, id)
	if errors.Is(err, pgx.ErrNoRows) {
		return Offer{}, ErrNotFound
	}

	if err != nil {
		return Offer{}, fmt.Errorf("reading the offer: %w", err)
	}

	return s.fromRow(row), nil
}

func (s *Service) fromRow(r db.GetOfferRow) Offer {
	o := Offer{
		ID: r.ID, SellerID: r.SellerID,
		Name: r.Name, Description: r.Description, Kind: Kind(r.Kind), Unit: r.Unit, Units: int(r.Units),
		PriceVND: r.PriceVnd, OriginalPriceVND: r.OriginalPriceVnd, PhotoID: r.PhotoID,
		WindowStart: r.WindowStart, WindowEnd: r.WindowEnd,
		UnitsLeft:       int(r.UnitsLeft),
		DiscountPercent: discountPercent(r.PriceVnd, r.OriginalPriceVnd),
		CollectionPoint: seller.CollectionPoint{Latitude: r.Latitude, Longitude: r.Longitude, Address: r.Address},
		CreatedAt:       r.CreatedAt, UpdatedAt: r.UpdatedAt, WithdrawnAt: r.WithdrawnAt,
		sellerName: r.SellerName,
	}

	if r.WeightGrams.Valid {
		g := int(r.WeightGrams.Int32)
		o.WeightGrams = &g
	}

	switch {
	case r.State == string(StatusWithdrawn):
		o.Status = StatusWithdrawn
	case !r.WindowEnd.After(s.now()):
		o.Status = StatusClosed
	case r.UnitsLeft == 0:
		o.Status = StatusSoldOut
	default:
		o.Status = StatusOnSale
	}

	return o
}

func weight(g *int) pgtype.Int4 {
	if g == nil {
		return pgtype.Int4{}
	}

	return pgtype.Int4{Int32: int32(*g), Valid: true} //nolint:gosec // at most 100,000
}

func replace[T any](dst, v *T) {
	if v != nil {
		*dst = *v
	}
}
