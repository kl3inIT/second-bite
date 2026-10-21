package seller

import (
	"context"
	"fmt"
	"log/slog"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"

	"github.com/kl3inIT/second-bite/server/internal/identity"
	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/seller/internal/db"
)

// RegisterListeners makes the module follow the events of the modules it
// depends on.
func RegisterListeners(events *platform.Events, s *Service) {
	platform.Listen(events, "seller.forget_account", s.forgetAccount)
	platform.Listen(events, "seller.tell_owner", s.tellOwner)
}

// ownerlessReason is what a seller blocked for want of an owner says to admins.
const ownerlessReason = "Chủ cửa hàng đã xoá tài khoản"

// forgetAccount removes a deleted account's memberships and favourites. A
// seller it owned would be left without an owner, so it is blocked: it stops
// showing and publishing until admins decide what becomes of it (SEC-37).
// Running it again changes nothing more.
func (s *Service) forgetAccount(ctx context.Context, e identity.AccountDeletedEvent) error {
	var memberships, follows, blocked int64

	err := pgx.BeginFunc(ctx, s.pool, func(tx pgx.Tx) error {
		q := s.queries.WithTx(tx)

		owned, err := q.SellersOwnedBy(ctx, e.AccountID)
		if err != nil {
			return fmt.Errorf("reading the sellers the account owned: %w", err)
		}

		if memberships, err = q.DeleteMembershipsOf(ctx, e.AccountID); err != nil {
			return fmt.Errorf("removing the account's memberships: %w", err)
		}

		if follows, err = q.DeleteFollowsOf(ctx, e.AccountID); err != nil {
			return fmt.Errorf("removing the account's favourites: %w", err)
		}

		if len(owned) > 0 {
			if blocked, err = q.BlockOwnerless(ctx, db.BlockOwnerlessParams{
				Ids: owned, Reason: pgtype.Text{String: ownerlessReason, Valid: true},
			}); err != nil {
				return fmt.Errorf("blocking the sellers left without an owner: %w", err)
			}
		}

		if blocked > 0 {
			return recordStatusDay(ctx, q)
		}

		return nil
	})
	if err != nil {
		return err
	}

	s.logger.InfoContext(ctx, "deleted account forgotten",
		slog.String("event", "seller.account.forgotten"),
		slog.String("account_id", e.AccountID.String()),
		slog.Int64("memberships", memberships),
		slog.Int64("follows", follows),
		slog.Int64("sellers_blocked", blocked),
	)

	return nil
}
