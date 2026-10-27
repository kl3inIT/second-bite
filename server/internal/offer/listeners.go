package offer

import (
	"context"
	"errors"
	"fmt"
	"log/slog"

	"github.com/kl3inIT/second-bite/server/internal/offer/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/seller"
)

// RegisterListeners makes the module follow the events of the modules it
// depends on.
func RegisterListeners(events *platform.Events, s *Service) {
	platform.Listen(events, "offer.follow_seller_location", s.FollowSellerLocation)
}

// FollowSellerLocation copies a seller's moved collection point onto its
// offers still on sale (SEC-66): the point is read as it stands, so the same
// event delivered twice, or two moves delivered out of order, end on the
// seller's current point. Offers withdrawn or ended keep what they copied.
func (s *Service) FollowSellerLocation(ctx context.Context, e seller.LocationChangedEvent) error {
	point, err := s.sellers.CollectionPointOf(ctx, e.SellerID)
	if errors.Is(err, seller.ErrNotFound) {
		return nil
	}

	if err != nil {
		return err
	}

	moved, err := s.queries.MoveSellerOffers(ctx, db.MoveSellerOffersParams{
		SellerID: e.SellerID, Latitude: point.Latitude, Longitude: point.Longitude, Address: point.Address,
	})
	if err != nil {
		return fmt.Errorf("moving the seller's offers: %w", err)
	}

	s.logger.InfoContext(ctx, "offers followed their seller's location",
		slog.String("event", "offer.offers.location_followed"),
		slog.String("seller_id", e.SellerID.String()),
		slog.Int64("offers_moved", moved),
	)

	return nil
}
