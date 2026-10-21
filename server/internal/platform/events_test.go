package platform_test

import (
	"context"
	"errors"
	"log/slog"
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

// thingRetried goes to a listener that fails the first time it hears an event.
type thingRetried struct {
	ID uuid.UUID `json:"id"`
}

func (thingRetried) EventKey() string { return "test.thing_retried" }

// errNotYet is a listener's first, passing failure.
var errNotYet = errors.New("not yet")

// flaky fails the first time it hears an event, then hears it.
type flaky struct {
	mu    sync.Mutex
	tried map[uuid.UUID]int
	heard heard
}

func (f *flaky) listen(ctx context.Context, e thingRetried) error {
	f.mu.Lock()
	f.tried[e.ID]++
	first := f.tried[e.ID] == 1
	f.mu.Unlock()

	if first {
		return errNotYet
	}

	return f.heard.listen(ctx, thingDone(e))
}

func (f *flaky) attempts(id uuid.UUID) int {
	f.mu.Lock()
	defer f.mu.Unlock()

	return f.tried[id]
}

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

	retried := &flaky{tried: map[uuid.UUID]int{}}

	platform.Listen(events, "test.first", first.listen)
	platform.Listen(events, "test.second", second.listen)
	platform.Listen(events, "test.flaky", retried.listen)

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

	t.Run("tries a failing listener again until it hears the event", func(t *testing.T) {
		t.Parallel()

		id := uuid.New()

		err := pgx.BeginFunc(ctx, pool, func(tx pgx.Tx) error {
			return platform.Publish(ctx, tx, events, thingRetried{ID: id})
		})
		if err != nil {
			t.Fatal(err)
		}

		// River's first retry comes about a second after the failure.
		waitFor(t, func() bool { return slices.Contains(retried.heard.got(), id) })

		if got := retried.attempts(id); got != 2 {
			t.Errorf("the listener was tried %d times, want 2", got)
		}
	})
}

// recorded keeps the records a logger was given.
type recorded struct {
	mu      sync.Mutex
	records []slog.Record
}

func (r *recorded) Enabled(context.Context, slog.Level) bool { return true }

func (r *recorded) Handle(_ context.Context, record slog.Record) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	r.records = append(r.records, record.Clone())

	return nil
}

func (r *recorded) WithAttrs([]slog.Attr) slog.Handler { return r }

func (r *recorded) WithGroup(string) slog.Handler { return r }

// events names the event field of each record, in order.
func (r *recorded) events() []string {
	r.mu.Lock()
	defer r.mu.Unlock()

	var names []string

	for _, record := range r.records {
		record.Attrs(func(a slog.Attr) bool {
			if a.Key == "event" {
				names = append(names, a.Value.String())
			}

			return true
		})
	}

	return names
}

// An instance of the old version, during a rolling deploy, can take a job for a
// listener only the new version has: the job waits to be retried rather than
// being cancelled for good (SEC-70).
func TestEventsRetryAJobForAListenerThisInstanceLacks(t *testing.T) {
	t.Parallel()

	pool := platformtest.StartPostgres(t)
	ctx := t.Context()

	// The new version publishes to a listener the old one does not have.
	newer, err := platform.NewEvents(pool, platformtest.Logger())
	if err != nil {
		t.Fatal(err)
	}

	platform.Listen(newer, "test.newer", (&heard{}).listen)

	log := &recorded{}

	older, err := platform.NewEvents(pool, slog.New(log))
	if err != nil {
		t.Fatal(err)
	}

	if err := older.Start(ctx); err != nil {
		t.Fatal(err)
	}

	t.Cleanup(func() {
		stopCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		if err := older.Stop(stopCtx); err != nil {
			t.Error(err)
		}
	})

	id := uuid.New()

	err = pgx.BeginFunc(ctx, pool, func(tx pgx.Tx) error {
		return platform.Publish(ctx, tx, newer, thingDone{ID: id})
	})
	if err != nil {
		t.Fatal(err)
	}

	var state string

	waitFor(t, func() bool {
		err := pool.QueryRow(ctx,
			`SELECT state FROM river_job WHERE args->>'listener' = 'test.newer' AND args->>'payload' LIKE '%' || $1 || '%'`,
			id.String(),
		).Scan(&state)

		return err == nil && state != "available" && state != "running"
	})

	if state != "retryable" {
		t.Errorf("the job is %s, want retryable", state)
	}

	if !slices.Contains(log.events(), "platform.event.unheard") {
		t.Errorf("logged %v, want platform.event.unheard", log.events())
	}
}

// slow holds a listener until the test lets it go, and says whether it finished
// or was cut short.
type slow struct {
	started  chan struct{}
	release  chan struct{}
	finished chan error
}

func (s *slow) listen(ctx context.Context, _ thingDone) error {
	close(s.started)

	select {
	case <-s.release:
		s.finished <- nil

		return nil
	case <-ctx.Done():
		s.finished <- ctx.Err()

		return ctx.Err()
	}
}

// The service's context is cancelled by the shutdown signal before it calls
// Stop: a listener running then still finishes within Stop's time (SEC-70).
func TestEventsLetARunningListenerFinishWhenTheStartContextEnds(t *testing.T) {
	t.Parallel()

	pool := platformtest.StartPostgres(t)

	events, err := platform.NewEvents(pool, platformtest.Logger())
	if err != nil {
		t.Fatal(err)
	}

	listener := &slow{started: make(chan struct{}), release: make(chan struct{}), finished: make(chan error, 1)}
	platform.Listen(events, "test.slow", listener.listen)

	startCtx, signal := context.WithCancel(t.Context())
	if err := events.Start(startCtx); err != nil {
		t.Fatal(err)
	}

	err = pgx.BeginFunc(t.Context(), pool, func(tx pgx.Tx) error {
		return platform.Publish(t.Context(), tx, events, thingDone{ID: uuid.New()})
	})
	if err != nil {
		t.Fatal(err)
	}

	select {
	case <-listener.started:
	case <-time.After(10 * time.Second):
		t.Fatal("the listener did not start within ten seconds")
	}

	signal()

	stopped := make(chan error, 1)

	go func() {
		stopCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		stopped <- events.Stop(stopCtx)
	}()

	// The listener is still running: the cancelled start context did not cut it.
	select {
	case err := <-listener.finished:
		t.Fatalf("the listener ended with %v before it was let go", err)
	case <-time.After(500 * time.Millisecond):
	}

	close(listener.release)

	if err := <-listener.finished; err != nil {
		t.Errorf("the listener ended with %v, want it to finish", err)
	}

	if err := <-stopped; err != nil {
		t.Error(err)
	}
}
