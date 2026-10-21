// Package order holds what customers order: units of one seller's offers,
// collected at the counter within one window. The rules are in
// the SEC-15 design: an order is confirmed when it is placed, as in Too Good
// To Go, Karrot and Open Food Network; expiry is read from the window in every
// query, as offer reads closed.
package order

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/kl3inIT/second-bite/server/internal/offer"
	"github.com/kl3inIT/second-bite/server/internal/order/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/seller"
)

// Status is where an order stands. expired is read from the window's end and
// never stored.
type Status string

// The statuses of an order.
const (
	StatusConfirmed Status = "confirmed"
	StatusReady     Status = "ready"
	StatusCollected Status = "collected"
	StatusCancelled Status = "cancelled"
	StatusRefused   Status = "refused"
	StatusExpired   Status = "expired"
)

// open tells whether an order is still to be collected.
func (s Status) open() bool { return s == StatusConfirmed || s == StatusReady }

// RefuseReason is why staff did not hand an order over.
type RefuseReason string

// The reasons to refuse an order. The first two are about the food at the
// counter; the others are the pilot's: no answer on the phone, no show, too
// late, out of food.
const (
	RefuseNotSuitable RefuseReason = "not_suitable"
	RefuseWrongItems  RefuseReason = "wrong_items"
	RefuseNoAnswer    RefuseReason = "no_answer"
	RefuseNoShow      RefuseReason = "no_show"
	RefuseLate        RefuseReason = "late"
	RefuseSoldOut     RefuseReason = "sold_out"
	RefuseOther       RefuseReason = "other"
)

// valid tells whether staff may give r.
func (r RefuseReason) valid() bool {
	switch r {
	case RefuseNotSuitable, RefuseWrongItems, RefuseNoAnswer, RefuseNoShow, RefuseLate, RefuseSoldOut, RefuseOther:
		return true
	}

	return false
}

// foodKept tells whether the food of an order refused for r is still fit to
// sell: the customer did not come, so its units go back to the offer.
func (r RefuseReason) foodKept() bool {
	return r == RefuseNoAnswer || r == RefuseNoShow || r == RefuseLate
}

// vietnam is the pilot's time zone, which keeps no daylight saving time.
var vietnam = time.FixedZone("Asia/Ho_Chi_Minh", 7*60*60)

// Order is a customer's order.
type Order struct {
	ID     uuid.UUID
	Number int64
	// CustomerID is the account that placed the order; none when it was
	// placed without signing in.
	CustomerID uuid.NullUUID
	Contact    Contact
	SellerID   uuid.UUID
	// CheckoutID is shared by the orders placed together from one cart.
	CheckoutID uuid.UUID
	SellerName string
	// CollectionPoint is copied from the offers when ordered.
	CollectionPoint seller.CollectionPoint
	Status          Status
	Lines           []Line
	TotalVND        int64
	WindowStart     time.Time
	WindowEnd       time.Time
	CreatedAt       time.Time
	ReadyAt         *time.Time
	CollectedAt     *time.Time
	CancelledAt     *time.Time
	RefusedAt       *time.Time
	CancelReason    string
	RefuseReason    RefuseReason
	RefuseNote      string
	// Review is the customer's rating, none until they rate the collected order.
	Review *Review
	// Access proves the order is theirs to whoever placed it, set only for
	// them.
	Access string
	// access is the order's stored access, whoever reads it.
	access string
}

// Number is how people read an order's number aloud and search for it.
func Number(n int64) string { return fmt.Sprintf("SB-%d", n) }

// Line is the units of one offer in an order, with what was copied from it.
type Line struct {
	OfferID          uuid.UUID
	Name             string
	Unit             string
	PriceVND         int64
	OriginalPriceVND int64
	PhotoID          uuid.UUID
	Units            int
}

// Service is the module's published API.
type Service struct {
	pool    *pgxpool.Pool
	queries *db.Queries
	offers  *offer.Service
	sellers *seller.Service
	logger  *slog.Logger
	now     func() time.Time
}

// NewService assembles the module.
func NewService(pool *pgxpool.Pool, offers *offer.Service, sellers *seller.Service, logger *slog.Logger) *Service {
	return &Service{pool: pool, queries: db.New(pool), offers: offers, sellers: sellers, logger: logger, now: time.Now}
}

// Get returns an order to its customer, signed in or holding its access, to
// the seller's people and to admins; its access only to its customer.
func (s *Service) Get(ctx context.Context, id uuid.UUID, access string) (Order, error) {
	o, err := s.read(ctx, id)
	if err != nil {
		return Order{}, err
	}

	if s.isCustomer(ctx, o, access) {
		return s.shown(o, true), nil
	}

	if _, signedIn := platform.CallerFrom(ctx); !signedIn {
		return Order{}, ErrNotFound
	}

	if _, err := s.sellers.Get(ctx, o.SellerID); err != nil {
		return Order{}, ErrNotFound
	}

	return o, nil
}

// isCustomer tells whether the reader placed o: signed in to its account, or
// holding its access.
func (s *Service) isCustomer(ctx context.Context, o Order, access string) bool {
	caller, signedIn := platform.CallerFrom(ctx)

	return (signedIn && o.CustomerID.Valid && o.CustomerID.UUID == caller.AccountID) || o.accessMatches(access)
}

// Which narrows a customer's orders: those still to collect, or those ended.
type Which string

// The customer's lists.
const (
	WhichAll   Which = ""
	WhichOpen  Which = "open"
	WhichEnded Which = "ended"
)

// maxListed bounds one page of a customer's orders.
const maxListed = 50

// Mine lists the caller's orders, newest first; only those of checkout when
// it is not nil.
func (s *Service) Mine(ctx context.Context, which Which, checkout uuid.UUID, limit, offset int) ([]Order, error) {
	caller, err := platform.RequireCaller(ctx)
	if err != nil {
		return nil, err
	}

	rows, err := s.queries.CustomerOrders(ctx, db.CustomerOrdersParams{
		CustomerID: uuid.NullUUID{UUID: caller.AccountID, Valid: true}, Which: string(which),
		CheckoutID: uuid.NullUUID{UUID: checkout, Valid: checkout != uuid.Nil},
		MaxRows:    int32(min(max(limit, 1), maxListed)), SkipRows: int32(max(offset, 0)), //nolint:gosec // bounded above
	})
	if err != nil {
		return nil, fmt.Errorf("listing the customer's orders: %w", err)
	}

	orders := make([]Order, 0, len(rows))
	for _, r := range rows {
		orders = append(orders, s.fromRow(db.GetOrderRow(r)))
	}

	if err := s.withLines(ctx, orders); err != nil {
		return nil, err
	}

	if err := s.withReviews(ctx, orders); err != nil {
		return nil, err
	}

	for i := range orders {
		orders[i] = s.shown(orders[i], true)
	}

	return orders, nil
}

// OfSeller lists a seller's orders whose window starts on day, in Vietnam
// time, to its people and admins.
func (s *Service) OfSeller(ctx context.Context, sellerID uuid.UUID, day time.Time) ([]Order, error) {
	if _, err := s.sellers.Get(ctx, sellerID); err != nil {
		return nil, err
	}

	y, m, d := day.In(vietnam).Date()
	start := time.Date(y, m, d, 0, 0, 0, 0, vietnam)

	rows, err := s.queries.SellerOrders(ctx, db.SellerOrdersParams{SellerID: sellerID, DayStart: start, DayEnd: start.AddDate(0, 0, 1)})
	if err != nil {
		return nil, fmt.Errorf("listing the seller's orders: %w", err)
	}

	orders := make([]Order, 0, len(rows))
	for _, r := range rows {
		orders = append(orders, s.fromRow(db.GetOrderRow(r)))
	}

	if err := s.withLines(ctx, orders); err != nil {
		return nil, err
	}

	if err := s.withReviews(ctx, orders); err != nil {
		return nil, err
	}

	return orders, nil
}

// Today is the day a seller's list shows when none is asked for.
func (s *Service) Today() time.Time { return s.now().In(vietnam) }

// read returns an order with its lines, as stored.
func (s *Service) read(ctx context.Context, id uuid.UUID) (Order, error) {
	row, err := s.queries.GetOrder(ctx, id)
	if errors.Is(err, pgx.ErrNoRows) {
		return Order{}, ErrNotFound
	}

	if err != nil {
		return Order{}, fmt.Errorf("reading the order: %w", err)
	}

	orders := []Order{s.fromRow(row)}
	if err := s.withLines(ctx, orders); err != nil {
		return Order{}, err
	}

	if err := s.withReviews(ctx, orders); err != nil {
		return Order{}, err
	}

	return orders[0], nil
}

// withLines reads the lines of orders in one query.
func (s *Service) withLines(ctx context.Context, orders []Order) error {
	if len(orders) == 0 {
		return nil
	}

	ids := make([]uuid.UUID, len(orders))
	at := make(map[uuid.UUID]int, len(orders))

	for i, o := range orders {
		ids[i], at[o.ID] = o.ID, i
	}

	rows, err := s.queries.LinesOf(ctx, ids)
	if err != nil {
		return fmt.Errorf("reading the orders' lines: %w", err)
	}

	for _, r := range rows {
		i := at[r.OrderID]
		orders[i].Lines = append(orders[i].Lines, Line{
			OfferID: r.OfferID, Name: r.Name, Unit: r.Unit, PriceVND: r.PriceVnd, OriginalPriceVND: r.OriginalPriceVnd,
			PhotoID: r.PhotoID, Units: int(r.Units),
		})
	}

	return nil
}

// shown is what a reader may see of o: to its customer, also its access.
func (s *Service) shown(o Order, customer bool) Order {
	if customer {
		o.Access = o.access
	}

	return o
}

func (s *Service) fromRow(r db.GetOrderRow) Order {
	o := Order{
		ID: r.ID, Number: r.Number.Int64, CustomerID: r.CustomerID,
		Contact:  Contact{Name: r.CustomerName, Phone: r.CustomerPhone},
		SellerID: r.SellerID, CheckoutID: r.CheckoutID, SellerName: r.SellerName,
		CollectionPoint: seller.CollectionPoint{Latitude: r.Latitude, Longitude: r.Longitude, Address: r.Address},
		Status:          Status(r.State), TotalVND: r.TotalVnd, WindowStart: r.WindowStart, WindowEnd: r.WindowEnd,
		CreatedAt: r.CreatedAt, ReadyAt: r.ReadyAt, CollectedAt: r.CollectedAt, CancelledAt: r.CancelledAt,
		RefusedAt: r.RefusedAt, CancelReason: r.CancelReason, RefuseReason: RefuseReason(r.RefuseReason.String),
		RefuseNote: r.RefuseNote, access: r.Access,
	}

	if o.Status.open() && !o.WindowEnd.After(s.now()) {
		o.Status = StatusExpired
	}

	return o
}
