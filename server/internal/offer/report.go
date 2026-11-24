package offer

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/offer/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/platform"
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
// [since, until), and in clock's part of the day, per collection day and
// seller; one seller's only when sellerID is set. Every offer counts,
// whatever became of it.
func (s *Service) PostDays(ctx context.Context, since, until time.Time, sellerID *uuid.UUID, clock platform.Clock) ([]PostDay, error) {
	params := db.PostDaysParams{Since: since, Until: until}

	params.TimeFrom, params.TimeUntil = clock.Bounds()
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

// WeightsOf answers the weight in grams of a unit of each offer among ids
// that gives one; an offer without a weight, or unknown, is left out.
func (s *Service) WeightsOf(ctx context.Context, ids []uuid.UUID) (map[uuid.UUID]int, error) {
	rows, err := s.queries.WeightsOfOffers(ctx, ids)
	if err != nil {
		return nil, fmt.Errorf("reading the offers' weights: %w", err)
	}

	weights := make(map[uuid.UUID]int, len(rows))
	for _, r := range rows {
		weights[r.ID] = int(r.WeightGrams)
	}

	return weights, nil
}

// Post is an offer as the admin's analysis reads it.
type Post struct {
	ID, SellerID     uuid.UUID
	SellerName, Name string
	Unit             string
	Kind             Kind
	Units, UnitsLeft int
	// PriceVND and OriginalPriceVND give its discount; 0 is food given away.
	PriceVND, OriginalPriceVND int64
	PostedAt                   time.Time
	// WindowStart and WindowEnd are when it is collected.
	WindowStart, WindowEnd time.Time
	// Ended is true once it is closed, withdrawn or its window is over.
	Ended bool
}

// PostsBetween answers the offers whose window starts in [since, until), and
// in clock's part of the day; one seller's only when sellerID is set.
func (s *Service) PostsBetween(ctx context.Context, since, until time.Time, sellerID *uuid.UUID, clock platform.Clock) ([]Post, error) {
	params := db.PostsBetweenParams{Since: since, Until: until}

	params.TimeFrom, params.TimeUntil = clock.Bounds()
	if sellerID != nil {
		params.SellerID = uuid.NullUUID{UUID: *sellerID, Valid: true}
	}

	rows, err := s.queries.PostsBetween(ctx, params)
	if err != nil {
		return nil, fmt.Errorf("reading the offers posted: %w", err)
	}

	posts := make([]Post, len(rows))
	for i, r := range rows {
		posts[i] = Post{
			ID: r.ID, SellerID: r.SellerID, SellerName: r.SellerName, Name: r.Name, Unit: r.Unit, Kind: Kind(r.Kind),
			Units: int(r.Units), UnitsLeft: int(r.UnitsLeft), PriceVND: r.PriceVnd, OriginalPriceVND: r.OriginalPriceVnd,
			PostedAt: r.CreatedAt, WindowStart: r.WindowStart, WindowEnd: r.WindowEnd, Ended: r.Ended,
		}
	}

	return posts, nil
}
