package offer

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"

	"github.com/kl3inIT/second-bite/server/internal/offer/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/seller"
)

// Taken is what an order copies from an offer when it takes its units: the
// name, the unit and the prices it was ordered at, and where and when it is
// collected, as Open Food Network copies them onto an order line.
type Taken struct {
	OfferID          uuid.UUID
	SellerID         uuid.UUID
	SellerName       string
	CollectionPoint  seller.CollectionPoint
	Name             string
	Unit             string
	PriceVND         int64
	OriginalPriceVND int64
	PhotoID          uuid.UUID
	WindowStart      time.Time
	WindowEnd        time.Time
}

// Take takes units of an offer inside tx, the transaction of the order that
// takes them, so the order and the units hold together or not at all. Only an
// offer on sale whose window is not over gives units, and only those it has
// left: when two orders want the last unit, one gets it and the other gets
// ErrSoldOut. ErrUnavailable answers an offer withdrawn or closed.
func (s *Service) Take(ctx context.Context, tx pgx.Tx, offerID uuid.UUID, units int) (Taken, error) {
	q := s.queries.WithTx(tx)

	row, err := q.TakeUnits(ctx, db.TakeUnitsParams{ID: offerID, Units: int32(units)}) //nolint:gosec // an order line holds at most 999
	if errors.Is(err, pgx.ErrNoRows) {
		return Taken{}, s.whyNotTaken(ctx, q, offerID)
	}

	if err != nil {
		return Taken{}, fmt.Errorf("taking the offer's units: %w", err)
	}

	return Taken{
		OfferID: row.ID, SellerID: row.SellerID, SellerName: row.SellerName,
		CollectionPoint: seller.CollectionPoint{Latitude: row.Latitude, Longitude: row.Longitude, Address: row.Address},
		Name:            row.Name, Unit: row.Unit, PriceVND: row.PriceVnd, OriginalPriceVND: row.OriginalPriceVnd,
		PhotoID: row.PhotoID, WindowStart: row.WindowStart, WindowEnd: row.WindowEnd,
	}, nil
}

// whyNotTaken tells why an offer gave no units: it does not exist, it is
// withdrawn or closed, or it has too few left.
func (s *Service) whyNotTaken(ctx context.Context, q *db.Queries, offerID uuid.UUID) error {
	row, err := q.GetOffer(ctx, offerID)
	if errors.Is(err, pgx.ErrNoRows) {
		return ErrNotFound
	}

	if err != nil {
		return fmt.Errorf("reading the offer: %w", err)
	}

	switch s.fromRow(row).Status {
	case StatusWithdrawn, StatusClosed:
		return ErrUnavailable
	case StatusOnSale, StatusSoldOut:
	}

	return ErrSoldOut
}

// Return gives back units an order took, inside tx, the transaction that
// cancels the order; an offer never has more units left than it was posted
// with.
func (s *Service) Return(ctx context.Context, tx pgx.Tx, offerID uuid.UUID, units int) error {
	if err := s.queries.WithTx(tx).ReturnUnits(ctx, db.ReturnUnitsParams{ID: offerID, Units: int32(units)}); err != nil { //nolint:gosec // an order line holds at most 999
		return fmt.Errorf("returning the offer's units: %w", err)
	}

	return nil
}
