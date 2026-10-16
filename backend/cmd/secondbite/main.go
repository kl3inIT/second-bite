// Command secondbite runs the Second Bite backend: it migrates the database,
// then serves the HTTP API until it receives SIGINT or SIGTERM.
package main

import (
	"context"
	"fmt"
	"io"
	"net"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/danielgtaylor/huma/v2"

	"github.com/kl3inIT/second-bite/backend/internal/platform"
	"github.com/kl3inIT/second-bite/backend/migrations"
)

func main() {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	err := run(ctx, os.Getenv, os.Stdout)

	stop()

	if err != nil {
		fmt.Fprintln(os.Stderr, "secondbite:", err)
		os.Exit(1)
	}
}

// run assembles and runs the service. It takes its environment and output as
// arguments, so a test runs the whole service in-process.
func run(ctx context.Context, getenv func(string) string, stdout io.Writer) error {
	cfg, err := platform.LoadConfig(getenv)
	if err != nil {
		return fmt.Errorf("configuration: %w", err)
	}

	logger := platform.NewLogger(stdout, cfg)

	pool, err := platform.OpenDatabase(ctx, cfg.Database)
	if err != nil {
		return err
	}
	defer pool.Close()

	if err := platform.Migrate(ctx, pool, migrations.FS, logger); err != nil {
		return err
	}

	mux := http.NewServeMux()
	registerOperations(platform.NewAPI(mux))
	platform.RegisterHealth(mux, pool)

	var lc net.ListenConfig

	ln, err := lc.Listen(ctx, "tcp", cfg.HTTPAddr)
	if err != nil {
		return fmt.Errorf("listening on %s: %w", cfg.HTTPAddr, err)
	}

	return platform.Serve(ctx, ln, platform.NewHandler(mux, logger), logger)
}

// registerOperations registers the operations of every module on api. The
// OpenAPI document in api/openapi.yaml is generated from what it registers.
func registerOperations(_ huma.API) {}
