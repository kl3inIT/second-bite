// Command secondbite runs the Second Bite backend.
//
//	secondbite serve                      migrate the database, then serve the API
//	secondbite admin grant EMAIL          make the account of EMAIL an admin
//	secondbite admin revoke EMAIL         make the admin EMAIL a customer again
//	secondbite email configure [flags]    choose who delivers email
//	secondbite health                     exit 0 when the local server is ready
//
// Granting an admin and configuring email are the administrative commands of
// a fresh installation: the first admin and the first email provider exist
// before anyone can sign in.
package main

import (
	"context"
	"errors"
	"fmt"
	"io"
	"log/slog"
	"net"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/danielgtaylor/huma/v2"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/kl3inIT/second-bite/server/internal/audit"
	"github.com/kl3inIT/second-bite/server/internal/file"
	"github.com/kl3inIT/second-bite/server/internal/identity"
	"github.com/kl3inIT/second-bite/server/internal/notification"
	"github.com/kl3inIT/second-bite/server/internal/offer"
	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/seller"
	"github.com/kl3inIT/second-bite/server/migrations"
)

const usage = `usage:
  secondbite serve
  secondbite admin grant EMAIL
  secondbite admin revoke EMAIL
  secondbite email configure [flags]   (secondbite email configure -h lists them)
  secondbite health`

var errUsage = errors.New(usage)

func main() {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	err := run(ctx, os.Args[1:], os.Getenv, os.Stdin, os.Stdout)

	stop()

	if err != nil {
		fmt.Fprintln(os.Stderr, "secondbite:", err)
		os.Exit(1)
	}
}

// run takes its arguments, environment and streams as parameters, so a test
// runs the whole service in-process.
func run(ctx context.Context, args []string, getenv func(string) string, stdin io.Reader, stdout io.Writer) error {
	if len(args) == 0 {
		return errUsage
	}

	// health needs no database: the container's health check runs it beside a
	// serving process, in an image that has no shell or HTTP client.
	if args[0] == "health" {
		return health(ctx, args[1:], getenv)
	}

	app, err := assemble(ctx, getenv, stdout)
	if err != nil {
		return err
	}
	defer app.pool.Close()

	switch command, rest := args[0], args[1:]; command {
	case "serve":
		if len(rest) != 0 {
			return errUsage
		}

		return app.serve(ctx)
	case "admin":
		return runAdmin(ctx, app.identity, rest, stdout)
	case "email":
		if len(rest) == 0 || rest[0] != "configure" {
			return errUsage
		}

		return configureEmail(ctx, app.notification, rest[1:], stdin, stdout)
	default:
		return errUsage
	}
}

// app is the assembled service.
type app struct {
	cfg          platform.Config
	logger       *slog.Logger
	pool         *pgxpool.Pool
	events       *platform.Events
	audit        *audit.Service
	notification *notification.Service
	identity     *identity.Service
	file         *file.Service
	seller       *seller.Service
	offer        *offer.Service
}

// assemble reads the configuration, opens and migrates the database, and
// builds the modules. Every command runs against a migrated database.
func assemble(ctx context.Context, getenv func(string) string, stdout io.Writer) (*app, error) {
	cfg, err := platform.LoadConfig(getenv)
	if err != nil {
		return nil, fmt.Errorf("configuration: %w", err)
	}

	settingsKey, err := platform.ReadKey(getenv, "SECONDBITE_EMAIL_SETTINGS_KEY")
	if err != nil {
		return nil, fmt.Errorf("configuration: %w", err)
	}

	codeKey, err := platform.ReadKey(getenv, "SECONDBITE_SIGN_IN_CODE_KEY")
	if err != nil {
		return nil, fmt.Errorf("configuration: %w", err)
	}

	logger := platform.NewLogger(stdout, cfg)

	pool, err := platform.OpenDatabase(ctx, cfg.Database)
	if err != nil {
		return nil, err
	}

	a, err := func() (*app, error) {
		if err := platform.Migrate(ctx, pool, migrations.FS, logger); err != nil {
			return nil, err
		}

		events, err := platform.NewEvents(pool, logger)
		if err != nil {
			return nil, err
		}

		trail := audit.NewService(pool, logger)

		notifications, err := notification.NewService(pool, trail, notification.Config{SettingsKey: settingsKey}, logger)
		if err != nil {
			return nil, err
		}

		identities, err := identity.NewService(pool, notifications, events, trail, identity.Config{
			CodeKey: codeKey, GoogleClientIDs: listOf(getenv("SECONDBITE_GOOGLE_CLIENT_IDS")),
		}, logger)
		if err != nil {
			return nil, err
		}

		fileCfg, err := fileConfig(getenv)
		if err != nil {
			return nil, fmt.Errorf("configuration: %w", err)
		}

		files, err := file.NewService(ctx, pool, fileCfg, logger)
		if err != nil {
			return nil, fmt.Errorf("configuration: file store: %w", err)
		}

		sellers := seller.NewService(pool, identities, files, notifications, events, trail, logger)
		offers := offer.NewService(pool, sellers, files, trail, logger)

		// The listeners are known before anything publishes; they run only in
		// serve.
		file.RegisterListeners(events, files)
		seller.RegisterListeners(events, sellers)

		return &app{
			cfg: cfg, logger: logger, pool: pool, events: events, audit: trail, notification: notifications, identity: identities,
			file: files, seller: sellers, offer: offers,
		}, nil
	}()
	if err != nil {
		pool.Close()

		return nil, err
	}

	return a, nil
}

func (a *app) serve(ctx context.Context) error {
	mux := http.NewServeMux()
	registerOperations(platform.NewAPI(mux), a)
	platform.RegisterHealth(mux, a.pool)

	var lc net.ListenConfig

	ln, err := lc.Listen(ctx, "tcp", a.cfg.HTTPAddr)
	if err != nil {
		return fmt.Errorf("listening on %s: %w", a.cfg.HTTPAddr, err)
	}

	if err := a.events.Start(ctx); err != nil {
		return err
	}

	serveErr := platform.Serve(ctx, ln, platform.NewHandler(mux, a.logger, a.identity.Authenticate), a.logger)

	// The listeners stop after the requests that may publish, with time to
	// finish what they run; what is left runs at the next start.
	stopCtx, cancel := context.WithTimeout(context.WithoutCancel(ctx), eventsStopTimeout)
	defer cancel()

	return errors.Join(serveErr, a.events.Stop(stopCtx))
}

// eventsStopTimeout bounds how long serve waits for running listeners.
const eventsStopTimeout = 10 * time.Second

// registerOperations registers the operations of every module on api. The
// OpenAPI document in api/openapi.yaml is generated from what it registers.
func registerOperations(api huma.API, a *app) {
	identity.RegisterOperations(api, a.identity)
	file.RegisterOperations(api, a.file)
	seller.RegisterOperations(api, a.seller)
	offer.RegisterOperations(api, a.offer)

	// Every admin operation is registered on one group, so the contract test
	// finds them all under its prefix (SEC-75).
	admin := platform.NewAdminGroup(api)
	identity.RegisterAdminOperations(admin, a.identity)
	notification.RegisterAdminOperations(admin, a.notification)
	seller.RegisterAdminOperations(admin, a.seller)
	offer.RegisterAdminOperations(admin, a.offer)
	audit.RegisterAdminOperations(admin, a.audit)
}

// fileConfig reads where files are kept: SECONDBITE_FILE_STORE (postgres by
// default, or s3) and, when SECONDBITE_S3_BUCKET is set, the S3-compatible
// store, its secret key read from the secrets directory.
func fileConfig(getenv func(string) string) (file.Config, error) {
	cfg := file.Config{
		Store: file.Store(getenv("SECONDBITE_FILE_STORE")),
		S3: file.S3Config{
			Endpoint:    getenv("SECONDBITE_S3_ENDPOINT"),
			Region:      getenv("SECONDBITE_S3_REGION"),
			Bucket:      getenv("SECONDBITE_S3_BUCKET"),
			AccessKeyID: getenv("SECONDBITE_S3_ACCESS_KEY_ID"),
			PathStyle:   getenv("SECONDBITE_S3_PATH_STYLE") != "false",
		},
	}

	if cfg.S3.Bucket == "" {
		return cfg, nil
	}

	if cfg.S3.Region == "" {
		cfg.S3.Region = "us-east-1"
	}

	if cfg.S3.AccessKeyID == "" {
		return file.Config{}, errors.New("SECONDBITE_S3_ACCESS_KEY_ID is required with SECONDBITE_S3_BUCKET")
	}

	secret, err := platform.ReadSecret(getenv, "SECONDBITE_S3_SECRET_ACCESS_KEY")
	if err != nil {
		return file.Config{}, err
	}

	cfg.S3.SecretAccessKey = secret

	return cfg, nil
}

// listOf splits a comma-separated setting into its non-empty, trimmed parts.
func listOf(setting string) []string {
	var parts []string

	for part := range strings.SplitSeq(setting, ",") {
		if part = strings.TrimSpace(part); part != "" {
			parts = append(parts, part)
		}
	}

	return parts
}

// health asks the server on this host's SECONDBITE_HTTP_ADDR whether it is
// ready, as Docker's health check does.
func health(ctx context.Context, args []string, getenv func(string) string) error {
	if len(args) != 0 {
		return errUsage
	}

	host, port, err := net.SplitHostPort(getenv("SECONDBITE_HTTP_ADDR"))
	if err != nil {
		host, port = "", "8080"
	}

	if host == "" {
		host = "127.0.0.1"
	}

	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, "http://"+net.JoinHostPort(host, port)+"/readyz", nil)
	if err != nil {
		return err
	}

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return fmt.Errorf("health: %w", err)
	}

	if err := res.Body.Close(); err != nil {
		return fmt.Errorf("health: %w", err)
	}

	// /readyz answers 204 No Content when ready.
	if res.StatusCode < 200 || res.StatusCode > 299 {
		return fmt.Errorf("health: /readyz answered %s", res.Status)
	}

	return nil
}
