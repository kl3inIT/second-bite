package offer

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/offer/internal/db"
)

// PostDay is what one seller posted for one collection day, for the admin's
// report (SEC-80).
type PostDay struct {
	// Day is the collection day in Vietnam, as midnight UTC of that date.
	Day      time.Time
	SellerID uuid.UUID
	Offers   int
	Units    int
}

// PostDays counts the offers and units posted whose window starts in
// [since, until), per collection day and seller; one seller's only when
// sellerID is set. Every offer counts, whatever became of it.
func (s *Service) PostDays(ctx context.Context, since, until time.Time, sellerID *uuid.UUID) ([]PostDay, error) {
	params := db.PostDaysParams{Since: since, Until: until}
	if sellerID != nil {
		params.SellerID = uuid.NullUUID{UUID: *sellerID, Valid: true}
	}

	rows, err := s.queries.PostDays(ctx, params)
	if err != nil {
		return nil, fmt.Errorf("counting the offers posted: %w", err)
	}

	days := make([]PostDay, len(rows))
	for i, r := range rows {
		days[i] = PostDay{Day: r.Day.Time, SellerID: r.SellerID, Offers: int(r.Offers), Units: int(r.Units)}
	}

	return days, nil
}

// SellersOf answers the seller of each offer among ids; an unknown offer is
// left out.
func (s *Service) SellersOf(ctx context.Context, ids []uuid.UUID) (map[uuid.UUID]uuid.UUID, error) {
	rows, err := s.queries.SellersOfOffers(ctx, ids)
	if err != nil {
		return nil, fmt.Errorf("reading the offers' sellers: %w", err)
	}

	sellers := make(map[uuid.UUID]uuid.UUID, len(rows))
	for _, r := range rows {
		sellers[r.ID] = r.SellerID
	}

	return sellers, nil
}
