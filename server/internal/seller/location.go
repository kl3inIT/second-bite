package seller

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

// servedArea is the box a seller's point must fall in: Hanoi, where the pilot
// and the beta run (docs/vision.md), with a margin of about three kilometres
// beyond the city's edge. The web's map is held to the same box (SEC-66).
var servedArea = struct{ south, west, north, east float64 }{
	south: 20.53, west: 105.25, north: 21.42, east: 106.06,
}

// served says whether a point falls in the served area.
func served(latitude, longitude float64) bool {
	return latitude >= servedArea.south && latitude <= servedArea.north &&
		longitude >= servedArea.west && longitude <= servedArea.east
}

// LocationChangedEvent tells that a seller's collection point moved: its pin,
// its written address or both. It carries the identifier only; a listener
// reads the point as it stands through CollectionPointOf.
type LocationChangedEvent struct {
	SellerID uuid.UUID `json:"sellerId"`
}

// EventKey names the event where it is stored, delivered and logged.
func (LocationChangedEvent) EventKey() string { return "seller.location_changed" }

// CollectionPointOf returns where a seller's offers are collected, as it
// stands, for the modules that copy it; ErrNotFound for an unknown seller.
func (s *Service) CollectionPointOf(ctx context.Context, id uuid.UUID) (CollectionPoint, error) {
	row, err := s.queries.GetSeller(ctx, id)
	if errors.Is(err, pgx.ErrNoRows) {
		return CollectionPoint{}, ErrNotFound
	}

	if err != nil {
		return CollectionPoint{}, fmt.Errorf("reading the seller: %w", err)
	}

	return CollectionPoint{Latitude: row.Latitude, Longitude: row.Longitude, Address: row.Address}, nil
}
