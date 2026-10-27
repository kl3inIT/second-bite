package order_test

import (
	"context"
	"fmt"
	"sync"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/kl3inIT/second-bite/server/internal/order"
	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/platform/platformtest"
)

// More orders at once than the pool has connections: placing and cancelling
// each hold one connection for their transaction and must not wait for a second
// one, or every request waits for ever once the pool is full. CI froze this way
// with four connections, and the server would with ten (SEC-128).
func TestOrdersAtOnceDoNotStarveThePool(t *testing.T) {
	t.Parallel()

	const connections, customers = 2, 6

	shared := platformtest.StartPostgres(t)

	cfg := shared.Config().Copy()
	cfg.MaxConns = connections

	pool, err := pgxpool.NewWithConfig(t.Context(), cfg)
	if err != nil {
		t.Fatal(err)
	}

	t.Cleanup(pool.Close)

	f := newFixture(t, pool)
	owner := f.as(t, "owner", platform.RoleCustomer)
	shop := f.shop(owner, t, "La Paris")
	croissant := f.post(owner, t, shop, "Croissant", customers, 20_000, time.Now())

	// Each customer's account exists before the race, so the race is only the
	// orders'.
	accounts := make([]uuid.UUID, customers)
	for i := range accounts {
		a, err := f.accounts.EnsureAccount(t.Context(), fmt.Sprintf("%s.customer%d@example.com", f.prefix, i))
		if err != nil {
			t.Fatal(err)
		}

		accounts[i] = a.ID
	}

	// A frozen pool waits for ever; the deadline turns it into a failure.
	all := func(what string, do func(ctx context.Context, i int) error) {
		t.Helper()

		var wg sync.WaitGroup

		errs := make([]error, customers)

		for i := range customers {
			wg.Go(func() {
				caller := platform.Caller{AccountID: accounts[i], SessionID: uuid.New(), Role: platform.RoleCustomer}

				ctx, cancel := context.WithTimeout(platform.WithCaller(t.Context(), caller), 20*time.Second)
				defer cancel()

				errs[i] = do(ctx, i)
			})
		}

		wg.Wait()

		for i, err := range errs {
			if err != nil {
				t.Fatalf("%s for customer %d: %v", what, i, err)
			}
		}
	}

	placed := make([]uuid.UUID, customers)

	all("placing", func(ctx context.Context, i int) error {
		o, err := f.orders.Place(ctx, key(), uuid.Nil, someone, []order.Wanted{{OfferID: croissant.ID, Units: 1}})
		placed[i] = o.ID

		return err
	})

	if got := f.unitsLeft(owner, t, croissant.ID); got != 0 {
		t.Errorf("croissants left after %d orders: %d", customers, got)
	}

	// Cancelling goes through the same locked transition as marking ready,
	// handing over and refusing, which reads the order's lines inside it.
	all("cancelling", func(ctx context.Context, i int) error {
		_, err := f.orders.Cancel(ctx, placed[i], "", "")

		return err
	})

	if got := f.unitsLeft(owner, t, croissant.ID); got != customers {
		t.Errorf("croissants back after the cancellations: %d, want %d", got, customers)
	}
}
