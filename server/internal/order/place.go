package order

import (
	"cmp"
	"context"
	"errors"
	"fmt"
	"slices"
	"time"
	"unicode/utf8"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"

	"github.com/kl3inIT/second-bite/server/internal/offer"
	"github.com/kl3inIT/second-bite/server/internal/order/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// maxLines bounds an order; a cart holds one seller's few dishes.
const maxLines = 10

// Wanted is what a customer asks of one offer.
type Wanted struct {
	OfferID uuid.UUID
	Units   int
}

// Place orders units of one seller's offers for contact, confirmed at once,
// for the caller's account when someone is signed in. The units are taken
// from each offer in the order's transaction, so when one offer has too few
// nothing is taken. The same key from the same customer, or without an account
// from the same phone number, returns the order it placed first, so a second
// tap orders nothing more. The orders of one cart share checkout, a new one
// when it is nil. The order comes back with its access, which proves it is
// theirs without signing in.
func (s *Service) Place(ctx context.Context, key string, checkout uuid.UUID, contact Contact, wanted []Wanted) (Order, error) {
	caller, signedIn := platform.CallerFrom(ctx)
	customer := uuid.NullUUID{UUID: caller.AccountID, Valid: signedIn}

	if n := utf8.RuneCountInString(key); n < 1 || n > 255 {
		return Order{}, ErrIdempotencyKeyInvalid
	}

	if err := s.placedByAddress.TakeFor(ctx); err != nil {
		return Order{}, err
	}

	contact, err := contact.normalized()
	if err != nil {
		return Order{}, err
	}

	if id, err := s.queries.OrderOfKey(ctx, db.OrderOfKeyParams{
		CustomerID: customer, IdempotencyKey: key, CustomerPhone: contact.Phone,
	}); err == nil {
		return s.placed(ctx, id)
	} else if !errors.Is(err, pgx.ErrNoRows) {
		return Order{}, fmt.Errorf("reading an earlier order: %w", err)
	}

	if err := checkWanted(wanted); err != nil {
		return Order{}, err
	}

	// Offers are taken in one order of identifiers, so two carts sharing
	// offers never wait on each other's rows.
	wanted = slices.SortedFunc(slices.Values(wanted), func(a, b Wanted) int { return cmp.Compare(a.OfferID.String(), b.OfferID.String()) })

	var id uuid.UUID

	err = pgx.BeginFunc(ctx, s.pool, func(tx pgx.Tx) error {
		id, err = s.place(ctx, tx, customer, cmp.Or(checkout, uuid.New()), contact, key, wanted)

		return err
	})

	var pgErr *pgconn.PgError
	if errors.As(err, &pgErr) && pgErr.Code == uniqueViolation {
		// The same key arrived twice at once; the first order stands.
		earlier, err := s.queries.OrderOfKey(ctx, db.OrderOfKeyParams{
			CustomerID: customer, IdempotencyKey: key, CustomerPhone: contact.Phone,
		})
		if err != nil {
			return Order{}, fmt.Errorf("reading the order placed with the key: %w", err)
		}

		return s.placed(ctx, earlier)
	}

	if err != nil {
		return Order{}, err
	}

	s.logged(ctx, "order placed", "order.order.placed", id, caller)

	return s.placed(ctx, id)
}

// placed is an order as whoever placed it sees it, with its access.
func (s *Service) placed(ctx context.Context, id uuid.UUID) (Order, error) {
	o, err := s.read(ctx, id)
	if err != nil {
		return Order{}, err
	}

	return s.readBy(ctx, s.shown(o, true), SideCustomer)
}

// takeFailure is an offer's failure to give units, as the order module says it.
func takeFailure(err error) error {
	switch {
	case errors.Is(err, offer.ErrSoldOut):
		return ErrOfferSoldOut
	case errors.Is(err, offer.ErrUnavailable), errors.Is(err, offer.ErrNotFound):
		return ErrOfferUnavailable
	}

	return err
}

// place takes the units and writes the order inside tx.
func (s *Service) place(
	ctx context.Context, tx pgx.Tx, customer uuid.NullUUID, checkout uuid.UUID, contact Contact, key string,
	wanted []Wanted,
) (uuid.UUID, error) {
	taken := make([]offer.Taken, 0, len(wanted))

	for _, w := range wanted {
		t, err := s.offers.Take(ctx, tx, w.OfferID, w.Units)
		if err != nil {
			return uuid.Nil, takeFailure(err)
		}

		taken = append(taken, t)
	}

	start, end, err := s.sharedWindow(taken)
	if err != nil {
		return uuid.Nil, err
	}

	first := taken[0]

	active, err := s.sellers.IsActiveIn(ctx, tx, first.SellerID)
	if err != nil {
		return uuid.Nil, err
	}

	if !active {
		return uuid.Nil, ErrOfferUnavailable
	}

	var total int64
	for i, t := range taken {
		total += t.PriceVND * int64(wanted[i].Units)
	}

	q := s.queries.WithTx(tx)

	id, err := q.InsertOrder(ctx, db.InsertOrderParams{
		CustomerID: customer, CustomerName: contact.Name, CustomerPhone: contact.Phone,
		SellerID: first.SellerID, CheckoutID: checkout, SellerName: first.SellerName,
		Latitude: first.CollectionPoint.Latitude, Longitude: first.CollectionPoint.Longitude, Address: first.CollectionPoint.Address,
		WindowStart: start, WindowEnd: end, TotalVnd: total, IdempotencyKey: key, ZaloConsentAt: s.consentAt(contact),
	})
	if err != nil {
		return uuid.Nil, fmt.Errorf("storing the order: %w", err)
	}

	for i, t := range taken {
		if err := q.InsertLine(ctx, db.InsertLineParams{
			OrderID: id, OfferID: t.OfferID, Name: t.Name, Unit: t.Unit, PriceVnd: t.PriceVND,
			OriginalPriceVnd: t.OriginalPriceVND, PhotoID: t.PhotoID, Units: int32(wanted[i].Units), //nolint:gosec // at most 999
		}); err != nil {
			return uuid.Nil, fmt.Errorf("storing the order's lines: %w", err)
		}
	}

	if err := q.InsertEvent(ctx, db.InsertEventParams{OrderID: id, Kind: "placed", ActorID: customer}); err != nil {
		return uuid.Nil, fmt.Errorf("recording the order: %w", err)
	}

	return id, s.announcePlaced(ctx, tx, q, id)
}

// announcePlaced tells the sockets following the seller's orders, and the
// seller's people by push, of a new order.
func (s *Service) announcePlaced(ctx context.Context, tx pgx.Tx, q *db.Queries, id uuid.UUID) error {
	placed, err := s.readIn(ctx, q, id)
	if err != nil {
		return err
	}

	if err := notifyOrder(ctx, tx, id, placed.SellerID, StatusConfirmed); err != nil {
		return err
	}

	return s.pushPlaced(ctx, tx, placed)
}

// consentAt is when the customer agreed to Zalo, none when they did not.
func (s *Service) consentAt(c Contact) *time.Time {
	if !c.ByZalo {
		return nil
	}

	now := s.now()

	return &now
}

// sharedWindow is the time every taken offer is collected in, still to come;
// the offers all belong to one seller.
func (s *Service) sharedWindow(taken []offer.Taken) (time.Time, time.Time, error) {
	start, end := taken[0].WindowStart, taken[0].WindowEnd

	for _, t := range taken[1:] {
		if t.SellerID != taken[0].SellerID {
			return time.Time{}, time.Time{}, ErrLinesInvalid
		}

		start, end = later(start, t.WindowStart), earlier(end, t.WindowEnd)
	}

	if !end.After(start) || !end.After(s.now()) {
		return time.Time{}, time.Time{}, ErrWindowsDoNotMeet
	}

	return start, end, nil
}

// checkWanted holds a cart to one to ten different offers, each at least one
// unit.
func checkWanted(wanted []Wanted) error {
	if len(wanted) < 1 || len(wanted) > maxLines {
		return ErrLinesInvalid
	}

	seen := make(map[uuid.UUID]bool, len(wanted))

	for _, w := range wanted {
		if w.Units < 1 || w.Units > 999 || seen[w.OfferID] {
			return ErrLinesInvalid
		}

		seen[w.OfferID] = true
	}

	return nil
}

func later(a, b time.Time) time.Time {
	if b.After(a) {
		return b
	}

	return a
}

func earlier(a, b time.Time) time.Time {
	if b.Before(a) {
		return b
	}

	return a
}
