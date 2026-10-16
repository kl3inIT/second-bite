// Package platform holds the technical code that knows no module: configuration,
// logging, the database pool and migrations, the HTTP server and the mapping of
// failures to RFC 9457 problems.
package platform

import (
	"encoding/base64"
	"errors"
	"fmt"
	"log/slog"
	"os"
	"strconv"
	"strings"
	"time"
)

// Config is the service's configuration, read once at startup from variables
// prefixed SECONDBITE_. Secrets are read from files under the secrets directory.
type Config struct {
	HTTPAddr  string
	LogFormat string
	LogLevel  slog.Level
	Database  DatabaseConfig
}

// DatabaseConfig configures the PostgreSQL pool. The password is a secret and
// never part of the URL.
type DatabaseConfig struct {
	URL               string
	Password          string
	MaxConns          int32
	MaxConnLifetime   time.Duration
	AcquireTimeout    time.Duration
	HealthCheckPeriod time.Duration
}

const (
	defaultSecretsDir = "/run/secrets"
	logFormatJSON     = "json"
	logFormatText     = "text"
	keyLength         = 32
)

// LoadConfig reads the configuration through getenv, so tests pass their own
// environment instead of changing the process's. It fails closed: a missing
// required value or a malformed one stops the service.
func LoadConfig(getenv func(string) string) (Config, error) {
	var errs []error

	cfg := Config{
		HTTPAddr:  valueOr(getenv("SECONDBITE_HTTP_ADDR"), ":8080"),
		LogFormat: valueOr(getenv("SECONDBITE_LOG_FORMAT"), logFormatJSON),
		Database: DatabaseConfig{
			URL:               getenv("SECONDBITE_DATABASE_URL"),
			MaxConns:          10,
			MaxConnLifetime:   30 * time.Minute,
			AcquireTimeout:    5 * time.Second,
			HealthCheckPeriod: time.Minute,
		},
	}

	if cfg.LogFormat != logFormatJSON && cfg.LogFormat != logFormatText {
		errs = append(errs, fmt.Errorf("SECONDBITE_LOG_FORMAT must be %q or %q", logFormatJSON, logFormatText))
	}

	if err := cfg.LogLevel.UnmarshalText([]byte(valueOr(getenv("SECONDBITE_LOG_LEVEL"), "info"))); err != nil {
		errs = append(errs, fmt.Errorf("SECONDBITE_LOG_LEVEL: %w", err))
	}

	if cfg.Database.URL == "" {
		errs = append(errs, errors.New("SECONDBITE_DATABASE_URL is required"))
	} else if strings.Contains(cfg.Database.URL, "password=") || hasURLPassword(cfg.Database.URL) {
		errs = append(errs, errors.New("SECONDBITE_DATABASE_URL must not hold the password; use the secret SECONDBITE_DATABASE_PASSWORD"))
	}

	if v := getenv("SECONDBITE_DATABASE_MAX_CONNS"); v != "" {
		n, err := strconv.ParseInt(v, 10, 32)
		if err != nil || n < 1 {
			errs = append(errs, errors.New("SECONDBITE_DATABASE_MAX_CONNS must be a positive integer"))
		}

		cfg.Database.MaxConns = int32(n)
	}

	password, err := ReadSecret(getenv, "SECONDBITE_DATABASE_PASSWORD")
	if err != nil {
		errs = append(errs, err)
	}

	cfg.Database.Password = password

	return cfg, errors.Join(errs...)
}

// ReadKey reads a secret key of 32 bytes, written in standard base64 (as
// `openssl rand -base64 32` prints it), the way ReadSecret reads a secret.
func ReadKey(getenv func(string) string, name string) ([]byte, error) {
	encoded, err := ReadSecret(getenv, name)
	if err != nil {
		return nil, err
	}

	key, err := base64.StdEncoding.DecodeString(encoded)
	if err != nil || len(key) != keyLength {
		return nil, fmt.Errorf("secret %s must be %d bytes in standard base64", name, keyLength)
	}

	return key, nil
}

// ReadSecret reads a secret from the file named after its variable in the
// secrets directory, as deployed environments mount it. Only when that file
// does not exist does it fall back to the variable itself, which local
// development uses.
func ReadSecret(getenv func(string) string, name string) (string, error) {
	dir := valueOr(getenv("SECONDBITE_SECRETS_DIR"), defaultSecretsDir)

	b, err := readFileIn(dir, name)
	switch {
	case err == nil:
		return strings.TrimSpace(string(b)), nil
	case errors.Is(err, os.ErrNotExist):
		if v := getenv(name); v != "" {
			return v, nil
		}

		return "", fmt.Errorf("secret %s is required", name)
	default:
		return "", fmt.Errorf("reading secret %s: %w", name, err)
	}
}

// readFileIn reads name inside dir; os.Root refuses a name that would leave dir.
func readFileIn(dir, name string) ([]byte, error) {
	root, err := os.OpenRoot(dir)
	if err != nil {
		return nil, err
	}

	b, err := root.ReadFile(name)

	return b, errors.Join(err, root.Close())
}

func hasURLPassword(url string) bool {
	rest, ok := strings.CutPrefix(url, "postgres://")
	if !ok {
		rest, ok = strings.CutPrefix(url, "postgresql://")
	}

	if !ok {
		return false
	}

	userinfo, _, found := strings.Cut(rest, "@")

	return found && strings.Contains(userinfo, ":")
}

func valueOr(v, fallback string) string {
	if v == "" {
		return fallback
	}

	return v
}
