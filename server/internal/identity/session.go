package identity

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"strings"
	"time"

	"github.com/jackc/pgx/v5"

	"github.com/kl3inIT/second-bite/server/internal/identity/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// Authenticate reads the session token of a request from
// "Authorization: Bearer <token>" and puts its caller in the request's
// context. A request without the header goes on anonymously; a request with a
// token that is unknown, ended or malformed is refused with 401, so a client
// learns at once that it must sign in again.
func (s *Service) Authenticate(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		header := r.Header.Get("Authorization")
		if header == "" {
			next.ServeHTTP(w, r)

			return
		}

		scheme, token, ok := strings.Cut(header, " ")
		if !ok || !strings.EqualFold(scheme, "Bearer") || token == "" {
			platform.WriteFailure(w, r, ErrSessionInvalid)

			return
		}

		caller, err := s.findCaller(r.Context(), token)
		if err != nil {
			if f, isFailure := platform.AsFailure(err); isFailure {
				platform.WriteFailure(w, r, f)

				return
			}

			s.logger.ErrorContext(r.Context(), "session check failed",
				slog.String("event", "identity.session.check_failed"),
				slog.String("error_code", ErrSessionUnavailable.Code),
				slog.String("error", err.Error()),
			)
			platform.WriteFailure(w, r, ErrSessionUnavailable)

			return
		}

		next.ServeHTTP(w, r.WithContext(platform.WithCaller(r.Context(), caller)))
	})
}

func (s *Service) findCaller(ctx context.Context, token string) (platform.Caller, error) {
	row, err := s.queries.FindSession(ctx, tokenHash(token))
	if errors.Is(err, pgx.ErrNoRows) {
		return platform.Caller{}, ErrSessionInvalid
	}

	if err != nil {
		return platform.Caller{}, fmt.Errorf("finding the session: %w", err)
	}

	// A session lasts 30 days from its last use; the end moves at most once
	// an hour, so a busy client does not write on every request.
	if time.Since(row.LastSeenAt) > sessionTouchEvery {
		if err := s.queries.TouchSession(ctx, db.TouchSessionParams{
			ID: row.ID, LifetimeSeconds: int32(sessionLifetime / time.Second),
		}); err != nil {
			return platform.Caller{}, fmt.Errorf("extending the session: %w", err)
		}
	}

	return platform.Caller{AccountID: row.AccountID, SessionID: row.ID, Role: platform.Role(row.Role)}, nil
}

// SignOut ends the caller's session.
func (s *Service) SignOut(ctx context.Context) error {
	caller, err := platform.RequireCaller(ctx)
	if err != nil {
		return err
	}

	if err := s.queries.DeleteSession(ctx, caller.SessionID); err != nil {
		return fmt.Errorf("ending the session: %w", err)
	}

	s.logger.InfoContext(ctx, "signed out",
		slog.String("event", "identity.session.ended"),
		slog.String("account_id", caller.AccountID.String()),
	)

	return nil
}
