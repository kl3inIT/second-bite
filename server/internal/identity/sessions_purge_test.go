package identity

import (
	"testing"

	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/platform/platformtest"
)

// The daily purge deletes every account's sessions past their end, and keeps
// the live ones (SEC-167).
func TestPurgeExpiredSessions(t *testing.T) {
	t.Parallel()

	pool := platformtest.StartPostgres(t)
	s := newDeletionService(t, pool)
	gone := signedIn(t, s, "gone."+uuid.NewString()[:8]+"@example.com")
	back := signedIn(t, s, "back."+uuid.NewString()[:8]+"@example.com")

	if _, err := pool.Exec(t.Context(),
		`UPDATE identity_sessions SET expires_at = now() - interval '1 hour' WHERE account_id = $1`, gone.Account.ID); err != nil {
		t.Fatal(err)
	}

	for range 2 {
		if err := s.PurgeExpiredSessions(t.Context()); err != nil {
			t.Fatal(err)
		}
	}

	for who, want := range map[uuid.UUID]int{gone.Account.ID: 0, back.Account.ID: 1} {
		var n int
		if err := pool.QueryRow(t.Context(), `SELECT count(*) FROM identity_sessions WHERE account_id = $1`, who).Scan(&n); err != nil {
			t.Fatal(err)
		}

		if n != want {
			t.Errorf("account %s keeps %d sessions, want %d", who, n, want)
		}
	}
}
