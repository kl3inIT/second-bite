// Package platformtest starts what a module's tests need: PostgreSQL with
// PostGIS in a container, migrated as the service migrates it.
package platformtest

import (
	"log/slog"
	"testing"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/testcontainers/testcontainers-go"
	"github.com/testcontainers/testcontainers-go/modules/postgres"

	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/migrations"
)

// PostgisImage is the image of local development and of every test.
const PostgisImage = "postgis/postgis:18-3.6"

// StartPostgres starts PostgreSQL with PostGIS, applies the migrations and
// returns a pool on it; both end with the test.
func StartPostgres(t *testing.T) *pgxpool.Pool {
	t.Helper()

	ctx := t.Context()

	pg, err := postgres.Run(ctx, PostgisImage,
		postgres.WithDatabase("secondbite"),
		postgres.WithUsername("secondbite"),
		postgres.WithPassword("test-only"),
		postgres.BasicWaitStrategies(),
	)
	testcontainers.CleanupContainer(t, pg)

	if err != nil {
		t.Fatal(err)
	}

	dsn, err := pg.ConnectionString(ctx, "sslmode=disable")
	if err != nil {
		t.Fatal(err)
	}

	pool, err := pgxpool.New(ctx, dsn)
	if err != nil {
		t.Fatal(err)
	}

	t.Cleanup(pool.Close)

	if err := platform.Migrate(ctx, pool, migrations.FS, Logger()); err != nil {
		t.Fatal(err)
	}

	return pool
}

// Logger discards what a test does not read.
func Logger() *slog.Logger {
	return slog.New(slog.DiscardHandler)
}
