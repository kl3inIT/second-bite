package platform_test

import (
	"context"
	"errors"
	"slices"
	"sync"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"

	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/platform/platformtest"
)

type thingDone struct {
	ID uuid.UUID `json:"id"`
}

func (thingDone) EventKey() string { return "test.thing_done" }

// heard collects what a listener was told.
type heard struct {
	mu  sync.Mutex
	ids []uuid.UUID
}

func (h *heard) listen(_ context.Context, e thingDone) error {
	h.mu.Lock()
	defer h.mu.Unlock()

	h.ids = append(h.ids, e.ID)

	return nil
}

func (h *heard) got() []uuid.UUID {
	h.mu.Lock()
	defer h.mu.Unlock()

	return append([]uuid.UUID(nil), h.ids...)
}

// waitFor polls until cond holds, for at most ten seconds.
func waitFor(t *testing.T, cond func() bool) {
	t.Helper()

	deadline := time.Now().Add(10 * time.Second)
	for !cond() {
		if time.Now().After(deadline) {
			t.Fatal("the condition did not hold within ten seconds")
		}

		time.Sleep(50 * time.Millisecond)
	}
}

func TestEvents(t *testing.T) {
	t.Parallel()

	pool := platformtest.StartPostgres(t)
	ctx := t.Context()

	events, err := platform.NewEvents(pool, platformtest.Logger())
	if err != nil {
		t.Fatal(err)
	}

	var first, second heard

	platform.Listen(events, "test.first", first.listen)
	platform.Listen(events, "test.second", second.listen)

	if err := events.Start(ctx); err != nil {
		t.Fatal(err)
	}

	t.Cleanup(func() {
		stopCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		if err := events.Stop(stopCtx); err != nil {
			t.Error(err)
		}
	})

	t.Run("reaches every listener once the change commits", func(t *testing.T) {
		t.Parallel()

		id := uuid.New()

		err := pgx.BeginFunc(ctx, pool, func(tx pgx.Tx) error {
			return platform.Publish(ctx, tx, events, thingDone{ID: id})
		})
		if err != nil {
			t.Fatal(err)
		}

		waitFor(t, func() bool { return slices.Contains(first.got(), id) && slices.Contains(second.got(), id) })
	})

	t.Run("publishes nothing when the change rolls back", func(t *testing.T) {
		t.Parallel()

		id := uuid.New()
		errRolledBack := errors.New("rolled back")

		err := pgx.BeginFunc(ctx, pool, func(tx pgx.Tx) error {
			if err := platform.Publish(ctx, tx, events, thingDone{ID: id}); err != nil {
				return err
			}

			return errRolledBack
		})
		if !errors.Is(err, errRolledBack) {
			t.Fatalf("got %v, want the rollback", err)
		}

		var jobs int
		if err := pool.QueryRow(ctx,
			`SELECT count(*) FROM river_job WHERE args->>'payload' LIKE '%' || $1 || '%'`, id.String(),
		).Scan(&jobs); err != nil {
			t.Fatal(err)
		}

		if jobs != 0 {
			t.Errorf("%d jobs were written for a change that rolled back", jobs)
		}

		if slices.Contains(first.got(), id) {
			t.Error("a listener heard an event that was rolled back")
		}
	})
}
