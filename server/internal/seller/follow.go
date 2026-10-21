package seller

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/seller/internal/db"
)

// Follow makes an active seller one of the caller's favourites (SEC-109);
// ErrNotFound for a seller pending, rejected, blocked or unknown. Following
// again changes nothing.
func (s *Service) Follow(ctx context.Context, sellerID uuid.UUID) error {
	caller, err := platform.RequireCaller(ctx)
	if err != nil {
		return err
	}

	if _, err := s.PublicOf(ctx, sellerID); err != nil {
		return err
	}

	if err := s.queries.InsertFollow(ctx, db.InsertFollowParams{AccountID: caller.AccountID, SellerID: sellerID}); err != nil {
		return fmt.Errorf("following the seller: %w", err)
	}

	return nil
}

// Unfollow removes a seller from the caller's favourites, whatever the
// seller's status; a seller not followed is left as it is.
func (s *Service) Unfollow(ctx context.Context, sellerID uuid.UUID) error {
	caller, err := platform.RequireCaller(ctx)
	if err != nil {
		return err
	}

	if err := s.queries.DeleteFollow(ctx, db.DeleteFollowParams{AccountID: caller.AccountID, SellerID: sellerID}); err != nil {
		return fmt.Errorf("unfollowing the seller: %w", err)
	}

	return nil
}

// Followed returns the active sellers the caller follows, the latest
// followed first; one blocked since drops out.
func (s *Service) Followed(ctx context.Context) ([]Public, error) {
	caller, err := platform.RequireCaller(ctx)
	if err != nil {
		return nil, err
	}

	rows, err := s.queries.FollowedSellers(ctx, caller.AccountID)
	if err != nil {
		return nil, fmt.Errorf("reading the followed sellers: %w", err)
	}

	sellers := make([]Public, 0, len(rows))
	for _, r := range rows {
		sellers = append(sellers, publicFromRow(db.ActiveSellersRow(r)))
	}

	return sellers, nil
}
