package platform

import (
	"context"
	"errors"
	"fmt"
	"io/fs"
	"log/slog"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jackc/pgx/v5/stdlib"
	"github.com/pressly/goose/v3"
	"github.com/pressly/goose/v3/lock"
)

// OpenDatabase opens the PostgreSQL pool with an explicit size, connection
// lifetime and acquisition timeout, and checks that the database answers.
func OpenDatabase(ctx context.Context, cfg DatabaseConfig) (*pgxpool.Pool, error) {
	pcfg, err := pgxpool.ParseConfig(cfg.URL)
	if err != nil {
		return nil, fmt.Errorf("parsing SECONDBITE_DATABASE_URL: %w", err)
	}

	pcfg.ConnConfig.Password = cfg.Password
	pcfg.MaxConns = cfg.MaxConns
	pcfg.MaxConnLifetime = cfg.MaxConnLifetime
	pcfg.HealthCheckPeriod = cfg.HealthCheckPeriod

	// pgxpool has no acquisition timeout of its own; every acquisition is
	// bounded by its caller's context, and the first ping by this one.
	pingCtx, cancel := context.WithTimeout(ctx, cfg.AcquireTimeout)
	defer cancel()

	pool, err := pgxpool.NewWithConfig(ctx, pcfg)
	if err != nil {
		return nil, fmt.Errorf("opening the database pool: %w", err)
	}

	if err := pool.Ping(pingCtx); err != nil {
		pool.Close()

		return nil, fmt.Errorf("reaching the database: %w", err)
	}

	return pool, nil
}

// Migrate applies the pending migrations of fsys. A PostgreSQL session lock
// lets only one instance migrate at a time, so several instances can start
// together.
func Migrate(ctx context.Context, pool *pgxpool.Pool, fsys fs.FS, logger *slog.Logger) (err error) {
	db := stdlib.OpenDBFromPool(pool)
	defer func() { err = errors.Join(err, db.Close()) }()

	locker, err := lock.NewPostgresSessionLocker()
	if err != nil {
		return fmt.Errorf("creating the migration lock: %w", err)
	}

	provider, err := goose.NewProvider(goose.DialectPostgres, db, fsys, goose.WithSessionLocker(locker))
	if err != nil {
		return fmt.Errorf("reading the migrations: %w", err)
	}

	start := time.Now()

	results, err := provider.Up(ctx)
	if err != nil {
		return fmt.Errorf("applying the migrations: %w", err)
	}

	version, err := provider.GetDBVersion(ctx)
	if err != nil {
		return fmt.Errorf("reading the schema version: %w", err)
	}

	logger.InfoContext(ctx, "database schema migrated",
		slog.String("event", "platform.schema.migrated"),
		slog.Int("applied", len(results)),
		slog.Int64("version", version),
		slog.Int64("duration_ms", time.Since(start).Milliseconds()),
	)

	return nil
}
