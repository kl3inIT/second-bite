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

	if _, err := f.sellers.Activate(admin, staffed.ID); err != nil {
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

// checkForgotten checks that no membership of the account remains and that
// the seller it owned names no one as having blocked it.
func checkForgotten(t *testing.T, pool *pgxpool.Pool, accountID, ownedID uuid.UUID) {
	t.Helper()

	var (
		memberships  int
		blockedByOne bool
	)

	if err := pool.QueryRow(t.Context(),
		`SELECT (SELECT count(*) FROM seller_members WHERE account_id = $1),
		        (SELECT status_changed_by IS NOT NULL FROM seller_sellers WHERE id = $2)`,
		accountID, ownedID,
	).Scan(&memberships, &blockedByOne); err != nil {
		t.Fatal(err)
	}

	if memberships != 0 {
		t.Errorf("%d memberships of the deleted account remain", memberships)
	}

	if blockedByOne {
		t.Error("the seller left without an owner names someone as having blocked it")
	}
}
