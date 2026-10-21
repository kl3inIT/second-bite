package platform

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/riverqueue/river"
	"github.com/riverqueue/river/riverdriver/riverpgxv5"
	"github.com/riverqueue/river/rivermigrate"
)

// Event is a fact one module tells the others, named by its stable key: the
// publishing module and the fact in lower case, such as
// identity.account_deleted (docs/conventions.md › Events between modules). It
// carries identifiers only.
type Event interface {
	EventKey() string
}

// Events carries events between modules through River on PostgreSQL, as a
// transactional outbox: Publish writes an event in the transaction that made
// the change, as one job per listener, and each listener runs after the
// commit in a transaction of its own, retried until it succeeds.
type Events struct {
	client *river.Client[pgx.Tx]
	logger *slog.Logger
	// listeners by event key, registered when the service is assembled and
	// read by the jobs once it runs.
	listeners map[string][]listener
}

type listener struct {
	name   string
	handle func(ctx context.Context, payload json.RawMessage) error
}

// eventJob carries one event to one listener. River binds one worker to a
// kind, and an event can have several listeners, so every event travels as
// this one kind with its key and its listener named inside.
type eventJob struct {
	Event    string          `json:"event"`
	Listener string          `json:"listener"`
	Payload  json.RawMessage `json:"payload"`
}

func (eventJob) Kind() string { return "platform.event" }

// eventWorkers bounds how many listeners run at once in one instance.
const eventWorkers = 10

// eventTimeout bounds one listener's run; River retries it after.
const eventTimeout = time.Minute

// NewEvents prepares the outbox on pool. The listeners run once Start is
// called; until then, and in the command-line commands, Publish only writes.
func NewEvents(pool *pgxpool.Pool, logger *slog.Logger) (*Events, error) {
	e := &Events{logger: logger, listeners: map[string][]listener{}}

	workers := river.NewWorkers()
	river.AddWorker(workers, &eventWorker{events: e})

	client, err := river.NewClient(riverpgxv5.New(pool), &river.Config{
		Queues:     map[string]river.QueueConfig{river.QueueDefault: {MaxWorkers: eventWorkers}},
		Workers:    workers,
		JobTimeout: eventTimeout,
		// River's own lines are about its machinery; the listeners log what
		// they do with the fields of docs/conventions.md › Logging.
		Logger: slog.New(warnOnly{logger.Handler()}),
	})
	if err != nil {
		return nil, fmt.Errorf("creating the event client: %w", err)
	}

	e.client = client

	return e, nil
}

// Listen registers handle for the events of key under name, which must stay
// the same while jobs carrying it may exist. handle must be idempotent: an
// event can be delivered again.
func Listen[E Event](e *Events, name string, handle func(context.Context, E) error) {
	var zero E

	key := zero.EventKey()
	e.listeners[key] = append(e.listeners[key], listener{
		name: name,
		handle: func(ctx context.Context, payload json.RawMessage) error {
			var event E
			if err := json.Unmarshal(payload, &event); err != nil {
				return fmt.Errorf("reading the event: %w", err)
			}

			return handle(ctx, event)
		},
	})
}

// Publish writes event in tx for each of its listeners. When tx rolls back,
// nothing is published.
func Publish[E Event](ctx context.Context, tx pgx.Tx, e *Events, event E) error {
	payload, err := json.Marshal(event)
	if err != nil {
		return fmt.Errorf("writing the event: %w", err)
	}

	key := event.EventKey()
	for _, l := range e.listeners[key] {
		if _, err := e.client.InsertTx(ctx, tx, eventJob{Event: key, Listener: l.name, Payload: payload}, nil); err != nil {
			return fmt.Errorf("publishing %s to %s: %w", key, l.name, err)
		}
	}

	return nil
}

// Start runs the listeners until Stop.
func (e *Events) Start(ctx context.Context) error {
	if err := e.client.Start(ctx); err != nil {
		return fmt.Errorf("starting the event listeners: %w", err)
	}

	return nil
}

// Stop lets the listeners that are running finish, within ctx.
func (e *Events) Stop(ctx context.Context) error {
	if err := e.client.Stop(ctx); err != nil {
		return fmt.Errorf("stopping the event listeners: %w", err)
	}

	return nil
}

type eventWorker struct {
	river.WorkerDefaults[eventJob]

	events *Events
}

func (w *eventWorker) Work(ctx context.Context, job *river.Job[eventJob]) error {
	for _, l := range w.events.listeners[job.Args.Event] {
		if l.name != job.Args.Listener {
			continue
		}

		if err := l.handle(ctx, job.Args.Payload); err != nil {
			w.events.logger.WarnContext(ctx, "event listener failed",
				slog.String("event", "platform.event.failed"),
				slog.String("event_key", job.Args.Event),
				slog.String("listener", job.Args.Listener),
				slog.Int("attempt", job.Attempt),
				slog.String("error_type", fmt.Sprintf("%T", err)),
			)

			return err
		}

		return nil
	}

	// A listener renamed or removed while its jobs waited: retrying cannot
	// help.
	return river.JobCancel(fmt.Errorf("no listener %q for %s", job.Args.Listener, job.Args.Event))
}

// migrateEventsLock is the session lock one instance holds while it applies
// River's migrations.
const migrateEventsLock = "SELECT pg_advisory_lock(hashtextextended('platform:river-migrate', 0))"

// MigrateEvents applies River's own migrations for the outbox, each in the
// transaction River gives it, while a PostgreSQL session lock lets only one
// instance migrate at a time; a River upgrade brings its schema with it.
func MigrateEvents(ctx context.Context, pool *pgxpool.Pool, logger *slog.Logger) (err error) {
	migrator, err := rivermigrate.New(riverpgxv5.New(pool), nil)
	if err != nil {
		return fmt.Errorf("creating the event migrator: %w", err)
	}

	conn, err := pool.Acquire(ctx)
	if err != nil {
		return fmt.Errorf("acquiring a connection for the event migrations: %w", err)
	}
	defer conn.Release()

	if _, err := conn.Exec(ctx, migrateEventsLock); err != nil {
		return fmt.Errorf("locking the event migrations: %w", err)
	}

	defer func() {
		_, unlockErr := conn.Exec(context.WithoutCancel(ctx),
			"SELECT pg_advisory_unlock(hashtextextended('platform:river-migrate', 0))")
		if unlockErr != nil {
			err = errors.Join(err, fmt.Errorf("unlocking the event migrations: %w", unlockErr))
		}
	}()

	res, err := migrator.Migrate(ctx, rivermigrate.DirectionUp, nil)
	if err != nil {
		return fmt.Errorf("applying the event migrations: %w", err)
	}

	logger.InfoContext(ctx, "event schema migrated",
		slog.String("event", "platform.event_schema.migrated"),
		slog.Int("applied", len(res.Versions)),
	)

	return nil
}

// warnOnly passes a handler only the records of warning level and above.
type warnOnly struct{ slog.Handler }

func (h warnOnly) Enabled(ctx context.Context, level slog.Level) bool {
	return level >= slog.LevelWarn && h.Handler.Enabled(ctx, level)
}
