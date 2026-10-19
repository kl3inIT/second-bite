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

// cookieLifetime is how long a browser keeps the session cookie: 400 days,
// the most browsers allow (RFC 6265bis). The session's own end, 30 days after
// its last use, is the server's; a cookie that outlives it is ignored. The
// cookie is not set again each time the session's end moves, because pages the
// web renders on its server cannot pass a new cookie on to the browser.
const cookieLifetime = 400 * 24 * time.Hour

// Authenticate puts the caller of a request in its context. The session token
// comes from "Authorization: Bearer <token>", or, without that header, from
// the session cookie the web keeps.
//
// A request with neither goes on anonymously. A Bearer token that is unknown,
// ended or malformed is refused with 401, so a client learns at once that it
// must sign in again; a cookie from an ended session is ignored instead, so a
// page goes on as it would without one. A change of state signed in by the
// cookie must come from our own origin (Sec-Fetch-Site and Origin, Go's
// CrossOriginProtection), since a browser sends the cookie whatever page asks.
func (s *Service) Authenticate(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		token, fromCookie, ok := sessionToken(r)
		if !ok {
			platform.WriteFailure(w, r, ErrSessionInvalid)

			return
		}

		if token == "" {
			next.ServeHTTP(w, r)

			return
		}

		if fromCookie {
			if err := s.crossOrigin.Check(r); err != nil {
				platform.WriteFailure(w, r, platform.ErrCrossOriginRefused)

				return
			}
		}

		caller, err := s.findCaller(r.Context(), token)

		switch {
		case err == nil:
			next.ServeHTTP(w, r.WithContext(platform.WithCaller(r.Context(), caller)))
		case fromCookie && errors.Is(err, ErrSessionInvalid):
			next.ServeHTTP(w, r)
		default:
			s.refuseSession(w, r, err)
		}
	})
}

// sessionToken returns the request's session token and whether it came from
// the cookie. The Bearer header wins over the cookie; ok is false when the
// header is malformed.
func sessionToken(r *http.Request) (token string, fromCookie, ok bool) {
	if header := r.Header.Get("Authorization"); header != "" {
		scheme, token, found := strings.Cut(header, " ")
		if !found || !strings.EqualFold(scheme, "Bearer") || token == "" {
			return "", false, false
		}

		return token, false, true
	}

	if c, err := r.Cookie(platform.SessionCookie); err == nil && c.Value != "" {
		return c.Value, true, true
	}

	return "", false, true
}

func (s *Service) refuseSession(w http.ResponseWriter, r *http.Request, err error) {
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
}

// sessionCookie carries a session token to the browser: the web's
// JavaScript cannot read it, it travels only over HTTPS, and other sites'
// pages do not send it with their forms (SameSite=Lax). Its path is "/" so
// that the web's server receives it with every page (design of SEC-29).
func sessionCookie(token string) http.Cookie {
	return http.Cookie{
		Name: platform.SessionCookie, Value: token, Path: "/", MaxAge: int(cookieLifetime / time.Second),
		HttpOnly: true, Secure: true, SameSite: http.SameSiteLaxMode,
	}
}

// clearedCookie tells the browser to forget the session cookie.
func clearedCookie() http.Cookie {
	return http.Cookie{
		Name: platform.SessionCookie, Path: "/", MaxAge: -1,
		HttpOnly: true, Secure: true, SameSite: http.SameSiteLaxMode,
	}
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
