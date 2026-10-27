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
	// schedules by name, run by the periodic jobs once the service runs.
	schedules map[string]func(context.Context) error
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

// scheduleJob is one run of a schedule, which names what to run.
type scheduleJob struct {
	Name string `json:"name"`
}

func (scheduleJob) Kind() string { return "platform.schedule" }

// eventWorkers bounds how many listeners run at once in one instance; each
// takes a connection of the pool the requests use while it runs (SEC-161).
const eventWorkers = 4

// eventTimeout bounds one listener's run; River retries it after.
const eventTimeout = time.Minute

// NewEvents prepares the outbox on pool. The listeners run once Start is
// called; until then, and in the command-line commands, Publish only writes.
func NewEvents(pool *pgxpool.Pool, logger *slog.Logger) (*Events, error) {
	e := &Events{logger: logger, listeners: map[string][]listener{}, schedules: map[string]func(context.Context) error{}}

	workers := river.NewWorkers()
	river.AddWorker(workers, &eventWorker{events: e})
	river.AddWorker(workers, &scheduleWorker{events: e})

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

// Every runs run on the schedule of every, under name, which must stay the same
// while jobs carrying it may exist. River's leader, one among the instances,
// enqueues each run, so an instance's run is never doubled by another's; a run
// that fails is not retried, since the next one comes soon, and run must be
// idempotent. Like the listeners, schedules are registered when the service is
// assembled and run only in serve.
func (e *Events) Every(name string, every time.Duration, run func(context.Context) error) {
	e.schedules[name] = run

	e.client.PeriodicJobs().Add(river.NewPeriodicJob(
		river.PeriodicInterval(every),
		func() (river.JobArgs, *river.InsertOpts) {
			return scheduleJob{Name: name}, &river.InsertOpts{MaxAttempts: 1}
		},
		&river.PeriodicJobOpts{ID: name, RunOnStart: true},
	))
}

// Publish writes event in tx for each of its listeners. When tx rolls back,
// nothing is published.
func Publish[E Event](ctx context.Context, tx pgx.Tx, e *Events, event E) error {
	return publish(ctx, tx, e, event, nil)
}

// PublishAfter writes event in tx for each of its listeners, to run once delay
// has passed. A publisher writes it besides Publish to deliver the event again
// later, sweeping up what a request still running when it was published wrote
// after the first delivery (SEC-126); the listeners being idempotent, the
// second run changes only that.
func PublishAfter[E Event](ctx context.Context, tx pgx.Tx, e *Events, event E, delay time.Duration) error {
	return publish(ctx, tx, e, event, &river.InsertOpts{ScheduledAt: time.Now().Add(delay)})
}

func publish[E Event](ctx context.Context, tx pgx.Tx, e *Events, event E, opts *river.InsertOpts) error {
	payload, err := json.Marshal(event)
	if err != nil {
		return fmt.Errorf("writing the event: %w", err)
	}

	key := event.EventKey()
	for _, l := range e.listeners[key] {
		if _, err := e.client.InsertTx(ctx, tx, eventJob{Event: key, Listener: l.name, Payload: payload}, opts); err != nil {
			return fmt.Errorf("publishing %s to %s: %w", key, l.name, err)
		}
	}

	return nil
}

// Start runs the listeners until Stop. Cancelling ctx does not stop them:
// River takes a cancelled start context as a hard stop that cancels the jobs
// running, so a shutdown signal would cut a listener short before Stop gave it
// time to finish (SEC-70). Stop alone ends them.
func (e *Events) Start(ctx context.Context) error {
	if err := e.client.Start(context.WithoutCancel(ctx)); err != nil {
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
			w.events.failed(ctx, job, "platform.event.failed", err)

			return err
		}

		return nil
	}

	// No listener of that name here. During a rolling deploy an instance of
	// the old version can take a job published for a listener only the new
	// version has: the job is retried, so an instance that knows the listener
	// takes it, rather than cancelled for good (SEC-70). A listener truly
	// renamed or removed runs out of attempts and is logged as discarded.
	err := fmt.Errorf("%w: %q for %s", errNoListener, job.Args.Listener, job.Args.Event)
	w.events.failed(ctx, job, "platform.event.unheard", err)

	return err
}

// errNoListener is the failure of a job whose listener this instance does not
// have.
var errNoListener = errors.New("no listener")

// failed logs a listener's job that did not succeed. While River will try it
// again the record is a warning; on its last attempt the job is discarded and
// the event is lost to that listener, which account deletion relies on to
// forget a person's data, so the record is an error to alert on (SEC-70). The
// error's text is never logged, since it can carry personal data or a third
// party's words (docs/conventions.md › Logging): its type and its code are.
func (e *Events) failed(ctx context.Context, job *river.Job[eventJob], event string, err error) {
	level, message := slog.LevelWarn, "event listener failed"
	if job.Attempt >= job.MaxAttempts {
		level, message, event = slog.LevelError, "event listener gave up; the event is discarded", "platform.event.discarded"
	}

	attrs := []slog.Attr{
		slog.String("event", event),
		slog.String("event_key", job.Args.Event),
		slog.String("listener", job.Args.Listener),
		slog.Int("attempt", job.Attempt),
		slog.Int("max_attempts", job.MaxAttempts),
		slog.String("error_type", rootType(err)),
	}

	if failure, ok := errors.AsType[*FailureError](err); ok {
		attrs = append(attrs, slog.String("error_code", failure.Code))
	}

	e.logger.LogAttrs(ctx, level, message, attrs...)
}

// rootType names the type of the innermost error err wraps, which says more
// than the wrapper's *fmt.wrapError.
func rootType(err error) string {
	for {
		next := errors.Unwrap(err)
		if next == nil {
			return fmt.Sprintf("%T", err)
		}

		err = next
	}
}

type scheduleWorker struct {
	river.WorkerDefaults[scheduleJob]

	events *Events
}

func (w *scheduleWorker) Work(ctx context.Context, job *river.Job[scheduleJob]) error {
	run, ok := w.events.schedules[job.Args.Name]
	if !ok {
		// A schedule renamed or removed while its job waited.
		return river.JobCancel(fmt.Errorf("no schedule %q", job.Args.Name))
	}

	if err := run(ctx); err != nil {
		w.events.logger.WarnContext(ctx, "schedule failed",
			slog.String("event", "platform.schedule.failed"),
			slog.String("schedule", job.Args.Name),
			slog.String("error_type", fmt.Sprintf("%T", err)),
		)

		return err
	}

	return nil
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
