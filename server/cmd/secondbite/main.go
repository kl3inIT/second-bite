// Command secondbite runs the Second Bite backend.
//
//	secondbite serve                      migrate the database, then serve the API
//	secondbite admin grant EMAIL       make the account of EMAIL an admin
//	secondbite email configure [flags]    choose who delivers email
//
// The last two are the administrative commands of a fresh installation: the
// first admin and the first email provider exist before anyone can sign in.
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
	"syscall"

	"github.com/danielgtaylor/huma/v2"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/kl3inIT/second-bite/server/internal/file"
	"github.com/kl3inIT/second-bite/server/internal/identity"
	"github.com/kl3inIT/second-bite/server/internal/notification"
	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/seller"
	"github.com/kl3inIT/second-bite/server/migrations"
)

const usage = `usage:
  secondbite serve
  secondbite admin grant EMAIL
  secondbite email configure [flags]   (secondbite email configure -h lists them)`

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
		if len(rest) != 2 || rest[0] != "grant" {
			return errUsage
		}

		a, err := app.identity.GrantRole(ctx, rest[1], platform.RoleAdmin)
		if err != nil {
			return err
		}

		_, err = fmt.Fprintf(stdout, "%s is an admin\n", a.Email)

		return err
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
	notification *notification.Service
	identity     *identity.Service
	file         *file.Service
	seller       *seller.Service
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

		notifications, err := notification.NewService(pool, notification.Config{SettingsKey: settingsKey}, logger)
		if err != nil {
			return nil, err
		}

		identities, err := identity.NewService(pool, notifications, identity.Config{CodeKey: codeKey}, logger)
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

		sellers := seller.NewService(pool, identities, files, logger)

		return &app{
			cfg: cfg, logger: logger, pool: pool, notification: notifications, identity: identities, file: files, seller: sellers,
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

	return platform.Serve(ctx, ln, platform.NewHandler(mux, a.logger, a.identity.Authenticate), a.logger)
}

// registerOperations registers the operations of every module on api. The
// OpenAPI document in api/openapi.yaml is generated from what it registers.
func registerOperations(api huma.API, a *app) {
	identity.RegisterOperations(api, a.identity)
	notification.RegisterOperations(api, a.notification)
	file.RegisterOperations(api, a.file)
	seller.RegisterOperations(api, a.seller)
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
