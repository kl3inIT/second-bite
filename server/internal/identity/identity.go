// Package identity knows who is signed in: accounts, the codes emailed to
// sign in, and sessions. It puts the caller of each request in the request's
// context for every other module (platform.CallerFrom).
package identity

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net/mail"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/kl3inIT/second-bite/server/internal/identity/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/notification"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// Limits of sign-in, taken from BeyondPilot's running values and Ory Kratos's
// defaults (five guesses per code).
const (
	codeLifetime       = 15 * time.Minute
	codeAttempts       = 5
	codeCooldown       = time.Minute
	codesPerHour       = 10
	wrongGuessesInHour = 15
	wrongGuessesInDay  = 30
	sessionLifetime    = 30 * 24 * time.Hour
	sessionTouchEvery  = time.Hour
	maxEmailLength     = 254
)

// Config is what the module needs from the environment.
type Config struct {
	// CodeKey keys the HMAC that stores sign-in codes: 32 bytes. Without it a
	// copy of the database would let six digits be tried offline.
	CodeKey []byte
}

// Account is a person who has signed in at least once.
type Account struct {
	ID    uuid.UUID
	Email string
	Role  platform.Role
}

// Service is the module's published API.
type Service struct {
	pool    *pgxpool.Pool
	queries *db.Queries
	email   *notification.Service
	codeKey []byte
	logger  *slog.Logger
}

// NewService assembles the module.
func NewService(pool *pgxpool.Pool, email *notification.Service, cfg Config, logger *slog.Logger) (*Service, error) {
	if len(cfg.CodeKey) != 32 {
		return nil, errors.New("the sign-in code key must be 32 bytes")
	}

	return &Service{pool: pool, queries: db.New(pool), email: email, codeKey: cfg.CodeKey, logger: logger}, nil
}

// Account returns the account id.
func (s *Service) Account(ctx context.Context, id uuid.UUID) (Account, error) {
	row, err := s.queries.GetAccount(ctx, id)
	if errors.Is(err, pgx.ErrNoRows) {
		return Account{}, ErrAccountNotFound
	}

	if err != nil {
		return Account{}, fmt.Errorf("reading the account: %w", err)
	}

	return Account{ID: row.ID, Email: row.Email, Role: platform.Role(row.Role)}, nil
}

// GrantRole gives the account of email the role, creating the account when
// the address has never signed in. Only the command line calls it: the first
// operator exists before anyone can sign in to name one.
func (s *Service) GrantRole(ctx context.Context, email string, role platform.Role) (Account, error) {
	email, err := normalizeEmail(email)
	if err != nil {
		return Account{}, err
	}

	row, err := s.queries.GrantRole(ctx, db.GrantRoleParams{Email: email, Role: string(role)})
	if err != nil {
		return Account{}, fmt.Errorf("granting the role: %w", err)
	}

	s.logger.InfoContext(ctx, "role granted",
		slog.String("event", "identity.role.granted"),
		slog.String("account_id", row.ID.String()),
		slog.String("role", row.Role),
	)

	return Account{ID: row.ID, Email: row.Email, Role: platform.Role(row.Role)}, nil
}

// normalizeEmail accepts one plain address and returns it in lower case, the
// form every table keys on.
func normalizeEmail(raw string) (string, error) {
	email := strings.TrimSpace(raw)
	if len(email) > maxEmailLength {
		return "", ErrEmailInvalid
	}

	a, err := mail.ParseAddress(email)
	if err != nil || a.Address != email || a.Name != "" {
		return "", ErrEmailInvalid
	}

	return strings.ToLower(email), nil
}
