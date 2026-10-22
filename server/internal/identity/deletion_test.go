package identity

import (
	"context"
	"errors"
	"testing"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/kl3inIT/second-bite/server/internal/audit"
	"github.com/kl3inIT/second-bite/server/internal/identity/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/notification"
	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/platform/platformtest"
)

// TestDeleteAccount checks the deletion's rules below the HTTP flow of
// cmd/secondbite (SEC-37): a code sent to another address deletes nothing,
// and a deletion takes the account's sessions, Google links and codes with
// it and publishes AccountDeletedEvent in its transaction, twice: at once and
// two minutes later.
func TestDeleteAccount(t *testing.T) {
	t.Parallel()

	pool := platformtest.StartPostgres(t)
	s := newDeletionService(t, pool)

	keep := signedIn(t, s, "keep."+uuid.NewString()[:8]+"@example.com")
	leave := signedIn(t, s, "leave."+uuid.NewString()[:8]+"@example.com")

	if err := s.queries.InsertExternalLogin(t.Context(), db.InsertExternalLoginParams{
		AccountID: leave.Account.ID, Provider: "google", Subject: "sub-" + uuid.NewString(),
		LinkedEmail: leave.Account.Email, EmailTrusted: true,
	}); err != nil {
		t.Fatal(err)
	}

	// The code of leave's address cannot delete keep's account.
	id, code := deletionChallenge(t, s, leave.Account.Email)
	if err := s.DeleteAccount(callerCtx(t, keep), id, code); !errors.Is(err, ErrChallengeGone) {
		t.Fatalf("deleting with another address's code: %v, want ErrChallengeGone", err)
	}

	// What the audit says leave did, and what was done to leave's account,
	// keeps its identifier and loses its address; keep's stays (SEC-75).
	if _, err := pool.Exec(t.Context(), `INSERT INTO audit_events
		(action, actor_id, actor_label, resource_type, resource_id, resource_label) VALUES
		('seller.block', $1, $2, 'seller', $5, 'Bếp Cô Ba'),
		('admin.grant', $3, $4, 'account', $1::text, $2),
		('admin.grant', $1, $2, 'account', $3::text, $4)`,
		leave.Account.ID, leave.Account.Email, keep.Account.ID, keep.Account.Email, uuid.NewString(),
	); err != nil {
		t.Fatal(err)
	}

	id, code = deletionChallenge(t, s, leave.Account.Email)
	if err := s.DeleteAccount(callerCtx(t, leave), id, code); err != nil {
		t.Fatal(err)
	}

	checkAuditForgot(t, pool, leave.Account, keep.Account)

	var accounts, sessions, logins, codes, jobs int

	var apart float64
	if err := pool.QueryRow(t.Context(), `SELECT
		(SELECT count(*) FROM identity_accounts WHERE id = $1),
		(SELECT count(*) FROM identity_sessions WHERE account_id = $1),
		(SELECT count(*) FROM identity_external_logins WHERE account_id = $1),
		(SELECT count(*) FROM identity_sign_in_challenges WHERE email = $2),
		(SELECT count(*) FROM river_job WHERE args->>'event' = 'identity.account_deleted'),
		(SELECT coalesce(extract(epoch FROM max(scheduled_at) - min(scheduled_at)), 0)::float8
			FROM river_job WHERE args->>'event' = 'identity.account_deleted')`,
		leave.Account.ID, leave.Account.Email,
	).Scan(&accounts, &sessions, &logins, &codes, &jobs, &apart); err != nil {
		t.Fatal(err)
	}

	if accounts+sessions+logins+codes != 0 {
		t.Errorf("left: %d accounts, %d sessions, %d links, %d codes", accounts, sessions, logins, codes)
	}

	// Delivered at once and again two minutes later, for what a request
	// still running wrote after the first delivery (SEC-126).
	if jobs != 2 || apart < 115 || apart > 125 {
		t.Errorf("%d jobs carry the event to its one listener, %.0f s apart; want 2, about 120 s apart", jobs, apart)
	}

	if _, err := s.Account(t.Context(), keep.Account.ID); err != nil {
		t.Errorf("the other account went too: %v", err)
	}
}

// checkAuditForgot checks that no audit event names gone any more, that each
// still carries its identifier, and that what names kept is unchanged.
func checkAuditForgot(t *testing.T, pool *pgxpool.Pool, gone, kept Account) {
	t.Helper()

	var naming, byGone, onGone, keptNamed int
	if err := pool.QueryRow(t.Context(), `SELECT
		(SELECT count(*) FROM audit_events WHERE actor_label = $2 OR resource_label = $2),
		(SELECT count(*) FROM audit_events WHERE actor_id = $1),
		(SELECT count(*) FROM audit_events WHERE resource_type = 'account' AND resource_id = $1::text),
		(SELECT count(*) FROM audit_events WHERE actor_label = $3 OR resource_label = $3)`,
		gone.ID, gone.Email, kept.Email,
	).Scan(&naming, &byGone, &onGone, &keptNamed); err != nil {
		t.Fatal(err)
	}

	if naming != 0 || byGone != 2 || onGone != 1 || keptNamed != 2 {
		t.Errorf("audit: %d events name the deleted account (want 0), %d by it (want 2), %d on it (want 1), %d name the other (want 2)",
			naming, byGone, onGone, keptNamed)
	}
}

func newDeletionService(t *testing.T, pool *pgxpool.Pool) *Service {
	t.Helper()

	notifications, err := notification.NewService(pool, audit.NewService(pool, platformtest.Logger()), notification.Config{SettingsKey: make([]byte, 32)}, platformtest.Logger())
	if err != nil {
		t.Fatal(err)
	}

	events, err := platform.NewEvents(pool, platformtest.Logger())
	if err != nil {
		t.Fatal(err)
	}

	// One listener, so the event is written once; it never runs here.
	platform.Listen(events, "test.deleted", func(_ context.Context, _ AccountDeletedEvent) error { return nil })

	s, err := NewService(pool, notifications, events, audit.NewService(pool, platformtest.Logger()), Config{CodeKey: make([]byte, 32)}, platformtest.Logger())
	if err != nil {
		t.Fatal(err)
	}

	return s
}

// signedIn opens a session for a new account of email with a code stored
// directly, as no email is sent here.
func signedIn(t *testing.T, s *Service, email string) Session {
	t.Helper()

	id, code := challengeOf(t, s, email, purposeSignIn)

	session, err := s.SignIn(t.Context(), id, code)
	if err != nil {
		t.Fatal(err)
	}

	return session
}

func deletionChallenge(t *testing.T, s *Service, email string) (uuid.UUID, string) {
	t.Helper()

	return challengeOf(t, s, email, purposeDeleteAccount)
}

func challengeOf(t *testing.T, s *Service, email string, purpose codePurpose) (uuid.UUID, string) {
	t.Helper()

	id := uuid.New()

	const code = "654321"

	if _, err := s.queries.InsertChallenge(t.Context(), db.InsertChallengeParams{
		ID: id, Email: email, CodeHash: s.codeHash(id, code), Purpose: string(purpose), LifetimeSeconds: 60,
	}); err != nil {
		t.Fatal(err)
	}

	return id, code
}

func callerCtx(t *testing.T, session Session) context.Context {
	t.Helper()

	return platform.WithCaller(t.Context(), platform.Caller{
		AccountID: session.Account.ID, SessionID: uuid.New(), Role: session.Account.Role,
	})
}
