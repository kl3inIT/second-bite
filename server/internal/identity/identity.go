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

	"github.com/kl3inIT/second-bite/server/internal/audit"
	"github.com/kl3inIT/second-bite/server/internal/identity/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/notification"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// Limits of sign-in, taken from BeyondPilot's running values and Ory Kratos's
// defaults (five guesses per code).
const (
	codeLifetime = 15 * time.Minute
	codeAttempts = 5
	codeCooldown = time.Minute
	codesPerHour = 10
	// A person needs one deletion code, a second if the first is lost; few
	// enough that a stolen session asking for them achieves nothing (SEC-126).
	deletionCodesPerHour = 3
	wrongGuessesInHour   = 15
	wrongGuessesInDay    = 30
	sessionLifetime      = 30 * 24 * time.Hour
	sessionTouchEvery    = time.Hour
	maxEmailLength       = 254
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
	events  *platform.Events
	// trail forgets the account's name in the audit when it is deleted.
	trail   *audit.Service
	codeKey []byte
	logger  *slog.Logger
	// crossOrigin refuses changes signed in by the cookie from other origins.
	crossOrigin *http.CrossOriginProtection
	// google verifies Google's ID tokens; nil when Google is off.
	google *google
	// codesByAddress bounds the codes one address asks for, whatever the email
	// addresses, so a script cannot spend the provider's quota (SEC-160).
	codesByAddress *platform.Limiter
}

// codesPerAddress codes may be asked for from one address in limitWindow:
// enough for the people behind one mall's Wi-Fi, too few for a script (SEC-160).
const (
	codesPerAddress = 30
	limitWindow     = 10 * time.Minute
)

// NewService assembles the module.
func NewService(
	pool *pgxpool.Pool, email *notification.Service, events *platform.Events, trail *audit.Service, cfg Config,
	logger *slog.Logger,
) (*Service, error) {
	if len(cfg.CodeKey) != 32 {
		return nil, errors.New("the sign-in code key must be 32 bytes")
	}

	s := &Service{
		pool: pool, queries: db.New(pool), email: email, events: events, trail: trail, codeKey: cfg.CodeKey,
		logger:         logger,
		crossOrigin:    http.NewCrossOriginProtection(),
		codesByAddress: platform.NewLimiter(codesPerAddress, limitWindow),
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
// added for. Its owner signs in with an emailed code like anyone else. It is
// refused while the address is unproven (giveByAddress).
func (s *Service) EnsureAccount(ctx context.Context, email string) (Account, error) {
	return s.giveByAddress(ctx, email, func(_ pgx.Tx, q *db.Queries, email string) (Account, error) {
		row, err := q.UpsertAccount(ctx, email)
		if err != nil {
			return Account{}, fmt.Errorf("finding the account: %w", err)
		}

		return Account{ID: row.ID, Email: row.Email, Role: platform.Role(row.Role), DisplayName: row.DisplayName}, nil
	})
}

// giveByAddress finds or changes the account of email with find, unless the
// account holds a Google link Google does not vouch for: then the address is
// unproven, since a stranger may have linked it before its owner arrived, and
// a role or a seller membership given by address would reach them (design of
// SEC-29, decision 4, and SEC-39). It is refused instead; the owner's emailed
// code removes such links, after which it succeeds. Nothing here ends anyone's
// sessions, so whoever gives by address cannot sign someone out. The address
// stays locked meanwhile, so a Google sign-in cannot link it halfway through.
func (s *Service) giveByAddress(
	ctx context.Context, email string, find func(pgx.Tx, *db.Queries, string) (Account, error),
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

		unproven, err := q.HasUntrustedLogin(ctx, email)
		if err != nil {
			return fmt.Errorf("checking the address's links: %w", err)
		}

		if unproven {
			return ErrAddressUnproven
		}

		account, err = find(tx, q, email)

		return err
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
