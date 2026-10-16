package seller

import (
	"context"
	"fmt"
	"log/slog"

	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/seller/internal/db"
)

// maxListed bounds one page of the admins' list.
const maxListed = 100

// ByStatus lists sellers in a status, oldest first, for admins.
func (s *Service) ByStatus(ctx context.Context, status Status, limit, offset int) ([]Seller, error) {
	if _, err := platform.RequireAdmin(ctx); err != nil {
		return nil, err
	}

	rows, err := s.queries.SellersByStatus(ctx, db.SellersByStatusParams{
		Status: string(status), MaxRows: int32(min(max(limit, 1), maxListed)), SkipRows: int32(max(offset, 0)), //nolint:gosec // bounded above
	})
	if err != nil {
		return nil, fmt.Errorf("listing the sellers: %w", err)
	}

	sellers := make([]Seller, 0, len(rows))
	for _, r := range rows {
		sellers = append(sellers, fromRow(db.GetSellerRow(r), ""))
	}

	return sellers, nil
}

// Activate lets a seller publish; it also lifts a block.
func (s *Service) Activate(ctx context.Context, id uuid.UUID) (Seller, error) {
	return s.setStatus(ctx, id, StatusActive)
}

// Block stops a seller from publishing.
func (s *Service) Block(ctx context.Context, id uuid.UUID) (Seller, error) {
	return s.setStatus(ctx, id, StatusBlocked)
}

func (s *Service) setStatus(ctx context.Context, id uuid.UUID, status Status) (Seller, error) {
	caller, err := platform.RequireAdmin(ctx)
	if err != nil {
		return Seller{}, err
	}

	changed, err := s.queries.SetStatus(ctx, db.SetStatusParams{
		ID: id, Status: string(status), ChangedBy: uuid.NullUUID{UUID: caller.AccountID, Valid: true},
	})
	if err != nil {
		return Seller{}, fmt.Errorf("setting the status: %w", err)
	}

	if changed == 0 {
		return Seller{}, ErrNotFound
	}

	s.logger.InfoContext(ctx, "seller status set",
		slog.String("event", "seller.status."+string(status)),
		slog.String("seller_id", id.String()),
		slog.String("by_account_id", caller.AccountID.String()),
	)

	return s.Get(ctx, id)
}
