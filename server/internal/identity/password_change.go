package identity

import (
	"context"
	"fmt"
	"log/slog"

	"github.com/jackc/pgx/v5"

	"github.com/kl3inIT/second-bite/server/internal/identity/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// ChangePassword replaces the password of the caller's account, for an account
// made with a username, when the current password is typed right (SEC-208). The
// account has no address to email a code to, so the current password is the
// only proof. The new password follows the rules of a registration and is
// judged first, as it costs no try; a wrong current password counts with the
// username's tries to sign in, so a stolen session cannot be used to guess it.
// The account's other sessions end with the change; the one asking stays.
func (s *Service) ChangePassword(ctx context.Context, current, next string) error {
	caller, err := platform.RequireCaller(ctx)
	if err != nil {
		return err
	}

	account, err := s.Account(ctx, caller.AccountID)
	if err != nil {
		return err
	}

	if account.Username == "" {
		return ErrNoPassword
	}

	if err := checkPassword(next, account.Username); err != nil {
		return err
	}

	if err := s.confirmPassword(ctx, account, current); err != nil {
		return err
	}

	hash, err := s.hash(ctx, next)
	if err != nil {
		return err
	}

	err = pgx.BeginFunc(ctx, s.pool, func(tx pgx.Tx) error {
		q := s.queries.WithTx(tx)

		if err := q.UpdatePasswordHash(ctx, db.UpdatePasswordHashParams{PasswordHash: hash, ID: account.ID}); err != nil {
			return fmt.Errorf("replacing the password: %w", err)
		}

		if err := q.DeleteOtherSessions(ctx, db.DeleteOtherSessionsParams{AccountID: account.ID, ID: caller.SessionID}); err != nil {
			return fmt.Errorf("ending the other sessions: %w", err)
		}

		return nil
	})
	if err != nil {
		return err
	}

	s.logger.InfoContext(ctx, "password changed",
		slog.String("event", "identity.password.changed"),
		slog.String("account_id", account.ID.String()),
	)

	return nil
}
