package seller_test

import (
	"context"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/kl3inIT/second-bite/server/internal/identity"
	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/platform/platformtest"
	"github.com/kl3inIT/second-bite/server/internal/seller"
)

// TestDeletedAccountIsForgotten delivers identity's AccountDeletedEvent
// through the outbox, twice as a retry would (SEC-37): the account's
// memberships are gone, the seller it owned is blocked with no one named as
// having blocked it, and a seller it only staffed keeps its status.
func TestDeletedAccountIsForgotten(t *testing.T) {
	t.Parallel()

	pool := platformtest.StartPostgres(t)
	f := newFixture(t, pool)

	leaving := f.as(t, "leaving", platform.RoleCustomer)
	other := f.as(t, "other", platform.RoleCustomer)
	admin := f.as(t, "admin", platform.RoleAdmin)

	owned, err := f.sellers.Open(leaving, shop)
	if err != nil {
		t.Fatal(err)
	}

	staffed, err := f.sellers.Open(other, shop)
	if err != nil {
		t.Fatal(err)
	}

	if _, err := f.sellers.AddStaff(other, staffed.ID, f.mail("leaving")); err != nil {
		t.Fatal(err)
	}

	if err := f.sellers.Follow(leaving, staffed.ID); err != nil {
		t.Fatal(err)
	}

	caller, _ := platform.CallerFrom(leaving)
	events := startEvents(t, pool, f.sellers)

	for range 2 {
		if err := pgx.BeginFunc(t.Context(), pool, func(tx pgx.Tx) error {
			return platform.Publish(t.Context(), tx, events, identity.AccountDeletedEvent{AccountID: caller.AccountID})
		}); err != nil {
			t.Fatal(err)
		}
	}

	waitStatus(admin, t, f.sellers, owned.ID, seller.StatusBlocked)
	checkForgotten(t, pool, caller.AccountID, owned.ID)

	if s, err := f.sellers.Get(admin, staffed.ID); err != nil || s.Status != seller.StatusActive {
		t.Errorf("the seller the account only staffed: %+v, %v; want active", s.Status, err)
	}
}

func startEvents(t *testing.T, pool *pgxpool.Pool, sellers *seller.Service) *platform.Events {
	t.Helper()

	events, err := platform.NewEvents(pool, platformtest.Logger())
	if err != nil {
		t.Fatal(err)
	}

	seller.RegisterListeners(events, sellers)

	if err := events.Start(t.Context()); err != nil {
		t.Fatal(err)
	}

	t.Cleanup(func() {
		stopCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		if err := events.Stop(stopCtx); err != nil {
			t.Error(err)
		}
	})

	return events
}

// waitStatus waits up to fifteen seconds, the time the listener gets, for the
// seller to reach status.
func waitStatus(admin context.Context, t *testing.T, sellers *seller.Service, id uuid.UUID, status seller.Status) {
	t.Helper()

	deadline := time.Now().Add(15 * time.Second)

	for {
		s, err := sellers.Get(admin, id)
		if err != nil {
			t.Fatal(err)
		}

		if s.Status == status {
			return
		}

		if time.Now().After(deadline) {
			t.Fatalf("the seller is %s, want %s", s.Status, status)
		}

		time.Sleep(100 * time.Millisecond)
	}
}

// checkForgotten checks that no membership or favourite of the account
// remains and that the seller it owned names no one as having blocked it.
func checkForgotten(t *testing.T, pool *pgxpool.Pool, accountID, ownedID uuid.UUID) {
	t.Helper()

	var (
		memberships  int
		follows      int
		blockedByOne bool
	)

	if err := pool.QueryRow(t.Context(),
		`SELECT (SELECT count(*) FROM seller_members WHERE account_id = $1),
		        (SELECT count(*) FROM seller_follows WHERE account_id = $1),
		        (SELECT status_changed_by IS NOT NULL FROM seller_sellers WHERE id = $2)`,
		accountID, ownedID,
	).Scan(&memberships, &follows, &blockedByOne); err != nil {
		t.Fatal(err)
	}

	if memberships != 0 {
		t.Errorf("%d memberships of the deleted account remain", memberships)
	}

	if follows != 0 {
		t.Errorf("%d favourites of the deleted account remain", follows)
	}

	if blockedByOne {
		t.Error("the seller left without an owner names someone as having blocked it")
	}
}

// TestOwnerToldWithoutEmail blocks a seller while no email provider is
// chosen (SEC-75): the job that tells the owner ends rather than retrying.
func TestOwnerToldWithoutEmail(t *testing.T) {
	t.Parallel()

	pool := platformtest.StartPostgres(t)
	f := newFixture(t, pool)

	seller.RegisterListeners(f.events, f.sellers)

	if err := f.events.Start(t.Context()); err != nil {
		t.Fatal(err)
	}

	t.Cleanup(func() {
		stopCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		if err := f.events.Stop(stopCtx); err != nil {
			t.Error(err)
		}
	})

	s, err := f.sellers.Open(f.as(t, "owner", platform.RoleCustomer), shop)
	if err != nil {
		t.Fatal(err)
	}

	if _, err := f.sellers.Block(f.as(t, "admin", platform.RoleAdmin), s.ID, blockReason); err != nil {
		t.Fatal(err)
	}

	deadline := time.Now().Add(15 * time.Second)

	for {
		var state string

		err := pool.QueryRow(t.Context(), `SELECT state FROM river_job
			WHERE args->>'listener' = 'seller.tell_owner' AND args->'payload'->>'sellerId' = $1::text`, s.ID).Scan(&state)

		switch {
		case err == nil && state == "completed":
			return
		case time.Now().After(deadline):
			t.Fatalf("the job is %q (%v) after 15 seconds, want completed", state, err)
		}

		time.Sleep(100 * time.Millisecond)
	}
}
