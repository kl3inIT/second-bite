// Package identity knows who is signed in: accounts, the codes emailed to
// sign in, and sessions. It puts the caller of each request in the request's
// context for every other module (platform.CallerFrom).
package identity

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
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
	// GoogleClientIDs are the OAuth client IDs whose Google ID tokens are
	// accepted, the web's first; without any, Google is off.
	GoogleClientIDs []string
}

// Account is a person who has signed in at least once.
type Account struct {
	ID    uuid.UUID
	Email string
	Role  platform.Role
	// DisplayName is empty until Google gives one or the person sets it.
	DisplayName string
}

// Service is the module's published API.
type Service struct {
	pool    *pgxpool.Pool
	queries *db.Queries
	email   *notification.Service
	codeKey []byte
	logger  *slog.Logger
	// crossOrigin refuses changes signed in by the cookie from other origins.
	crossOrigin *http.CrossOriginProtection
	// google verifies Google's ID tokens; nil when Google is off.
	google *google
}

// NewService assembles the module.
func NewService(pool *pgxpool.Pool, email *notification.Service, cfg Config, logger *slog.Logger) (*Service, error) {
	if len(cfg.CodeKey) != 32 {
		return nil, errors.New("the sign-in code key must be 32 bytes")
	}

	s := &Service{
		pool: pool, queries: db.New(pool), email: email, codeKey: cfg.CodeKey, logger: logger,
		crossOrigin: http.NewCrossOriginProtection(),
	}
	if len(cfg.GoogleClientIDs) > 0 {
		s.google = newGoogle(cfg.GoogleClientIDs, remoteGoogleKeys())
	}

	return s, nil
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

	return Account{ID: row.ID, Email: row.Email, Role: platform.Role(row.Role), DisplayName: row.DisplayName}, nil
}

// Accounts returns the accounts of ids that exist, keyed by id.
func (s *Service) Accounts(ctx context.Context, ids []uuid.UUID) (map[uuid.UUID]Account, error) {
	rows, err := s.queries.GetAccounts(ctx, ids)
	if err != nil {
		return nil, fmt.Errorf("reading the accounts: %w", err)
	}

	accounts := make(map[uuid.UUID]Account, len(rows))
	for _, r := range rows {
		accounts[r.ID] = Account{ID: r.ID, Email: r.Email, Role: platform.Role(r.Role), DisplayName: r.DisplayName}
	}

	return accounts, nil
}

// EnsureAccount returns the account of email, creating it when the address
// has never signed in, as Open Food Network creates the user a manager is
// added for. Its owner signs in with an emailed code like anyone else. The
// account is about to be given something by its address, so the links Google
// does not vouch for are removed first (giveByAddress).
func (s *Service) EnsureAccount(ctx context.Context, email string) (Account, error) {
	return s.giveByAddress(ctx, email, func(q *db.Queries, email string) (Account, error) {
		row, err := q.UpsertAccount(ctx, email)
		if err != nil {
			return Account{}, fmt.Errorf("finding the account: %w", err)
		}

		return Account{ID: row.ID, Email: row.Email, Role: platform.Role(row.Role), DisplayName: row.DisplayName}, nil
	})
}

// GrantRole gives the account of email the role, creating the account when
// the address has never signed in. Only the command line calls it: the first
// admin exists before anyone can sign in to name one.
func (s *Service) GrantRole(ctx context.Context, email string, role platform.Role) (Account, error) {
	a, err := s.giveByAddress(ctx, email, func(q *db.Queries, email string) (Account, error) {
		row, err := q.GrantRole(ctx, db.GrantRoleParams{Email: email, Role: string(role)})
		if err != nil {
			return Account{}, fmt.Errorf("granting the role: %w", err)
		}

		return Account{ID: row.ID, Email: row.Email, Role: platform.Role(row.Role), DisplayName: row.DisplayName}, nil
	})
	if err != nil {
		return Account{}, err
	}

	s.logger.InfoContext(ctx, "role granted",
		slog.String("event", "identity.role.granted"),
		slog.String("account_id", a.ID.String()),
		slog.String("role", string(a.Role)),
	)

	return a, nil
}

// giveByAddress finds or changes the account of email with find, then removes
// the account's links that Google does not vouch for and their sessions. A
// role or a seller membership given by address must reach the address's owner,
// not whoever linked a Google account to it first (design of SEC-29, decision
// 4, and SEC-39). The address stays locked meanwhile, so a Google sign-in
// cannot link it halfway through.
func (s *Service) giveByAddress(
	ctx context.Context, email string, find func(*db.Queries, string) (Account, error),
) (Account, error) {
	email, err := normalizeEmail(email)
	if err != nil {
		return Account{}, err
	}

	var account Account

	err = pgx.BeginFunc(ctx, s.pool, func(tx pgx.Tx) error {
		q := s.queries.WithTx(tx)

		if err := q.LockEmail(ctx, email); err != nil {
			return fmt.Errorf("locking the address: %w", err)
		}

		if account, err = find(q, email); err != nil {
			return err
		}

		return s.dropUntrustedLogins(ctx, q, account.ID)
	})
	if err != nil {
		return Account{}, err
	}

	return account, nil
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
