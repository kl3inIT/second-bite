package identity

import (
	"context"
	"errors"
	"testing"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/kl3inIT/second-bite/server/internal/identity/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/notification"
	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/platform/platformtest"
)

// TestDeleteAccount checks the deletion's rules below the HTTP flow of
// cmd/secondbite (SEC-37): a code sent to another address deletes nothing,
// and a deletion takes the account's sessions, Google links and codes with
// it and publishes AccountDeletedEvent in its transaction.
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

	id, code = deletionChallenge(t, s, leave.Account.Email)
	if err := s.DeleteAccount(callerCtx(t, leave), id, code); err != nil {
		t.Fatal(err)
	}

	var accounts, sessions, logins, codes, jobs int
	if err := pool.QueryRow(t.Context(), `SELECT
		(SELECT count(*) FROM identity_accounts WHERE id = $1),
		(SELECT count(*) FROM identity_sessions WHERE account_id = $1),
		(SELECT count(*) FROM identity_external_logins WHERE account_id = $1),
		(SELECT count(*) FROM identity_sign_in_challenges WHERE email = $2),
		(SELECT count(*) FROM river_job WHERE args->>'event' = 'identity.account_deleted')`,
		leave.Account.ID, leave.Account.Email,
	).Scan(&accounts, &sessions, &logins, &codes, &jobs); err != nil {
		t.Fatal(err)
	}

	if accounts+sessions+logins+codes != 0 {
		t.Errorf("left: %d accounts, %d sessions, %d links, %d codes", accounts, sessions, logins, codes)
	}

	if jobs != 1 {
		t.Errorf("%d jobs carry the event to its one listener, want 1", jobs)
	}

	if _, err := s.Account(t.Context(), keep.Account.ID); err != nil {
		t.Errorf("the other account went too: %v", err)
	}
}

func newDeletionService(t *testing.T, pool *pgxpool.Pool) *Service {
	t.Helper()

	notifications, err := notification.NewService(pool, notification.Config{SettingsKey: make([]byte, 32)}, platformtest.Logger())
	if err != nil {
		t.Fatal(err)
	}

	events, err := platform.NewEvents(pool, platformtest.Logger())
	if err != nil {
		t.Fatal(err)
	}

	// One listener, so the event is written once; it never runs here.
	platform.Listen(events, "test.deleted", func(_ context.Context, _ AccountDeletedEvent) error { return nil })

	s, err := NewService(pool, notifications, events, Config{CodeKey: make([]byte, 32)}, platformtest.Logger())
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
