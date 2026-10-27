package platform_test

import (
	"maps"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"github.com/kl3inIT/second-bite/server/internal/platform"
)

func TestLoadConfig(t *testing.T) {
	t.Parallel()

	secrets := t.TempDir()
	if err := os.WriteFile(filepath.Join(secrets, "SECONDBITE_DATABASE_PASSWORD"), []byte("from-file\n"), 0o600); err != nil {
		t.Fatal(err)
	}

	base := map[string]string{
		"SECONDBITE_DATABASE_URL": "postgres://secondbite@localhost:5432/secondbite",
		"SECONDBITE_SECRETS_DIR":  secrets,
	}

	tests := []struct {
		name    string
		env     map[string]string
		wantErr string
		check   func(t *testing.T, cfg platform.Config)
	}{
		{
			name: "defaults and the secret from its file",
			check: func(t *testing.T, cfg platform.Config) {
				t.Helper()

				if cfg.HTTPAddr != ":8080" || cfg.LogFormat != "json" || cfg.Database.MaxConns != 25 {
					t.Errorf("defaults %+v", cfg)
				}

				if cfg.Database.Password != "from-file" {
					t.Errorf("password not read from the secrets directory")
				}
			},
		},
		{
			name: "the variable when no file exists",
			env: map[string]string{
				"SECONDBITE_SECRETS_DIR":       t.TempDir(),
				"SECONDBITE_DATABASE_PASSWORD": "from-env",
			},
			check: func(t *testing.T, cfg platform.Config) {
				t.Helper()

				if cfg.Database.Password != "from-env" {
					t.Errorf("password not read from the variable")
				}
			},
		},
		{name: "missing URL", env: map[string]string{"SECONDBITE_DATABASE_URL": ""}, wantErr: "SECONDBITE_DATABASE_URL is required"},
		{name: "password in the URL", env: map[string]string{"SECONDBITE_DATABASE_URL": "postgres://u:p@h/db"}, wantErr: "must not hold the password"}, //nolint:gosec // a fake URL, to prove a password in it is refused
		{name: "missing secret", env: map[string]string{"SECONDBITE_SECRETS_DIR": t.TempDir()}, wantErr: "secret SECONDBITE_DATABASE_PASSWORD is required"},
		{name: "unknown log format", env: map[string]string{"SECONDBITE_LOG_FORMAT": "xml"}, wantErr: "SECONDBITE_LOG_FORMAT"},
		{name: "unknown log level", env: map[string]string{"SECONDBITE_LOG_LEVEL": "loud"}, wantErr: "SECONDBITE_LOG_LEVEL"},
		{name: "pool size not a number", env: map[string]string{"SECONDBITE_DATABASE_MAX_CONNS": "many"}, wantErr: "SECONDBITE_DATABASE_MAX_CONNS"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()

			env := maps.Clone(base)
			maps.Copy(env, tt.env)

			cfg, err := platform.LoadConfig(func(k string) string { return env[k] })

			if tt.wantErr != "" {
				if err == nil || !strings.Contains(err.Error(), tt.wantErr) {
					t.Fatalf("error %v, want one containing %q", err, tt.wantErr)
				}

				return
			}

			if err != nil {
				t.Fatal(err)
			}

			tt.check(t, cfg)
		})
	}
}
