package offer_test

import (
	"context"
	"sync"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/kl3inIT/second-bite/server/internal/offer"
	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/platform/platformtest"
)

// More posts changed at once than the pool has connections, each to a photo it
// did not show: the change reads and claims the photo in its own transaction,
// never on a second connection while it holds one, or every change waits for
// ever once the pool is full (SEC-128, SEC-159).
func TestChangesAtOnceDoNotStarveThePool(t *testing.T) {
	t.Parallel()

	const connections, posts = 2, 6

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
	sellerID := f.activeSeller(owner, t)

	ids := make([]uuid.UUID, posts)
	photos := make([]uuid.UUID, posts)

	for i := range ids {
		o, err := f.offers.Post(owner, sellerID, bread(f.photo(owner, t)))
		if err != nil {
			t.Fatal(err)
		}

		ids[i], photos[i] = o.ID, f.photo(owner, t)
	}

	var wg sync.WaitGroup

	errs := make([]error, posts)

	for i := range ids {
		wg.Go(func() {
			// A frozen pool waits for ever; the deadline turns it into a failure.
			ctx, cancel := context.WithTimeout(owner, 20*time.Second)
			defer cancel()

			_, errs[i] = f.offers.Change(ctx, ids[i], offer.Change{PhotoID: &photos[i]})
		})
	}

	wg.Wait()

	for i, err := range errs {
		if err != nil {
			t.Fatalf("changing post %d's photo: %v", i, err)
		}
	}
}
