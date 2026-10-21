package offer

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"

	"github.com/kl3inIT/second-bite/server/internal/offer/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/seller"
)

// One page of search: 20 offers unless asked otherwise, at most 50.
const (
	defaultFound = 20
	maxFound     = 50
)

// Sort is the order search answers in. Too Good To Go sorts by relevance,
// distance, price and rating; there are no ratings yet, and surplus is also
// sorted by how far it is below its original price.
type Sort string

// The orders of search.
const (
	SortRelevance  Sort = "relevance"
	SortDistance   Sort = "distance"
	SortEndingSoon Sort = "ending_soon"
	SortPrice      Sort = "price"
	SortDiscount   Sort = "discount"
)

// Point is a place on the map.
type Point struct {
	Latitude  float64
	Longitude float64
}

// Query is what a customer searches by; a zero field does not filter.
type Query struct {
	Near *Point
	// RadiusKm around Near; the settings' default when zero, and never more
	// than their maximum.
	RadiusKm int
	Words    string
	Kinds    []Kind
	// MinPriceVND and MaxPriceVND bound the price of one unit.
	MinPriceVND int64
	MaxPriceVND int64
	// CollectFrom and CollectTo keep offers whose window overlaps them; both
	// at one moment keep what can be collected then.
	CollectFrom *time.Time
	CollectTo   *time.Time
	SellerID    *uuid.UUID
	// AvailableOnly leaves out what has sold out, which is otherwise shown.
	AvailableOnly bool
	// Sort, when empty: relevance with words, distance with a point, ending
	// soon otherwise.
	Sort   Sort
	Limit  int
	Offset int
}

// Found is an offer as search answers it, with what customers see of its
// seller and, when the search had a point, how far it is.
type Found struct {
	Offer
	Seller         seller.Public
	DistanceMeters *float64
}

// Search finds the offers customers may order or see sold out: on sale, the
// window not over, the seller active. Filters apply before the order and the
// page.
func (s *Service) Search(ctx context.Context, q Query) ([]Found, error) {
	params, err := s.searchParams(ctx, q)
	if err != nil {
		return nil, err
	}

	rows, err := s.queries.SearchOffers(ctx, params)
	if err != nil {
		return nil, fmt.Errorf("searching offers: %w", err)
	}

	ids := make([]uuid.UUID, 0, len(rows))
	for _, r := range rows {
		ids = append(ids, r.SellerID)
	}

	sellers, err := s.sellers.Publics(ctx, ids)
	if err != nil {
		return nil, err
	}

	found := make([]Found, 0, len(rows))

	for _, r := range rows {
		// A seller blocked since the search began is left out.
		pub, ok := sellers[r.SellerID]
		if !ok {
			continue
		}

		f := Found{Offer: s.fromRow(searchedRow(r)), Seller: pub}
		if q.Near != nil {
			f.DistanceMeters = &r.DistanceM
		}

		found = append(found, f)
	}

	return found, nil
}

func (s *Service) searchParams(ctx context.Context, q Query) (db.SearchOffersParams, error) {
	if !q.valid() {
		return db.SearchOffersParams{}, ErrSearchInvalid
	}

	set, err := s.settings(ctx)
	if err != nil {
		return db.SearchOffersParams{}, err
	}

	blocked, err := s.sellers.Blocked(ctx)
	if err != nil {
		return db.SearchOffersParams{}, err
	}

	radius := q.RadiusKm
	if radius <= 0 {
		radius = set.DefaultRadiusKm
	}

	kinds := make([]string, 0, len(q.Kinds))
	for _, k := range q.Kinds {
		kinds = append(kinds, string(k))
	}

	p := db.SearchOffersParams{
		Query: searchQuery(q.Words), ExcludedSellers: blocked, RadiusM: float64(min(radius, set.MaxRadiusKm)) * 1000,
		Kinds: kinds, CollectFrom: q.CollectFrom, CollectTo: q.CollectTo, AvailableOnly: q.AvailableOnly,
		Sort:    string(q.order()),
		MaxRows: int32(min(q.limit(), maxFound)), SkipRows: int32(max(q.Offset, 0)), //nolint:gosec // bounded above
	}

	if q.Near != nil {
		p.Latitude = pgtype.Float8{Float64: q.Near.Latitude, Valid: true}
		p.Longitude = pgtype.Float8{Float64: q.Near.Longitude, Valid: true}
	}

	if q.MinPriceVND > 0 {
		p.MinPrice = pgtype.Int8{Int64: q.MinPriceVND, Valid: true}
	}

	if q.MaxPriceVND > 0 {
		p.MaxPrice = pgtype.Int8{Int64: q.MaxPriceVND, Valid: true}
	}

	if q.SellerID != nil {
		p.SellerID = uuid.NullUUID{UUID: *q.SellerID, Valid: true}
	}

	return p, nil
}

// valid refuses a point off the map, a time range that ends before it
// starts, a price range whose lowest is above its highest, an unknown kind or
// order, and an order by distance from no point.
func (q Query) valid() bool {
	if !q.rangesValid() {
		return false
	}

	for _, k := range q.Kinds {
		if !knownKind(k) {
			return false
		}
	}

	switch q.Sort {
	case "", SortRelevance, SortEndingSoon, SortPrice, SortDiscount:
		return true
	case SortDistance:
		return q.Near != nil
	default:
		return false
	}
}

// rangesValid tells whether the point is on the map and each range starts no
// later than it ends.
func (q Query) rangesValid() bool {
	pointOff := q.Near != nil &&
		(q.Near.Latitude < -90 || q.Near.Latitude > 90 || q.Near.Longitude < -180 || q.Near.Longitude > 180)
	timesBackwards := q.CollectFrom != nil && q.CollectTo != nil && q.CollectTo.Before(*q.CollectFrom)
	pricesBackwards := q.MinPriceVND > 0 && q.MaxPriceVND > 0 && q.MinPriceVND > q.MaxPriceVND

	return !pointOff && !timesBackwards && !pricesBackwards
}

// order is the sort asked for, or the default for what was searched.
func (q Query) order() Sort {
	switch {
	case q.Sort != "":
		return q.Sort
	case searchQuery(q.Words) != "":
		return SortRelevance
	case q.Near != nil:
		return SortDistance
	default:
		return SortEndingSoon
	}
}

// limit is the page's size, 20 when none is asked.
func (q Query) limit() int {
	if q.Limit <= 0 {
		return defaultFound
	}

	return q.Limit
}

func searchedRow(r db.SearchOffersRow) db.GetOfferRow {
	return db.GetOfferRow{
		ID: r.ID, SellerID: r.SellerID, PostedBy: r.PostedBy, State: r.State, Name: r.Name, Description: r.Description,
		Kind: r.Kind, Unit: r.Unit, Units: r.Units, UnitsLeft: r.UnitsLeft, PriceVnd: r.PriceVnd,
		OriginalPriceVnd: r.OriginalPriceVnd, WeightGrams: r.WeightGrams, PhotoID: r.PhotoID, MorePhotoIds: r.MorePhotoIds,
		WindowStart: r.WindowStart, WindowEnd: r.WindowEnd, Latitude: r.Latitude, Longitude: r.Longitude,
		Address: r.Address, CreatedAt: r.CreatedAt, UpdatedAt: r.UpdatedAt, WithdrawnAt: r.WithdrawnAt,
		SellerName: r.SellerName,
	}
}
