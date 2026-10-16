package main

import (
	"bytes"
	"context"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"io"
	"maps"
	"net"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/testcontainers/testcontainers-go"
	"github.com/testcontainers/testcontainers-go/modules/postgres"
	"github.com/testcontainers/testcontainers-go/wait"
)

// The images of local development and of every test.
const (
	postgisImage = "postgis/postgis:18-3.6"
	mailpitImage = "axllent/mailpit:v1.31.4"
)

const operatorEmail = "operator@example.com"

// service is one run of the assembled service against its database and
// Mailpit, which catches every email it sends.
type service struct {
	base    string
	dsn     string
	mailpit string
}

// TestService runs the assembled service against PostgreSQL with PostGIS and
// Mailpit in containers, configured through its own administrative commands
// as a fresh installation is: email first, then the first operator.
func TestService(t *testing.T) {
	t.Parallel()

	svc, stop := startService(t)

	checks := map[string]func(*testing.T, service){
		"migrations applied":                                      checkMigrated,
		"probes answer and carry a request id":                    checkProbes,
		"a well-formed request id from the caller is kept":        checkCallerRequestID,
		"the contract is served":                                  checkContractServed,
		"an unknown route is a problem":                           checkUnknownRoute,
		"another method on a known route is a problem with Allow": checkMethodNotAllowed,
		"sign in with an emailed code, then sign out":             checkSignInAndOut,
		"a wrong code spends a guess and the fifth ends the code": checkWrongCodes,
		"a second code within a minute is refused with a wait":    checkCodeCooldown,
		"a code works once":                                       checkCodeWorksOnce,
		"an unknown or malformed token is refused with 401":       checkInvalidToken,
		"only operators read the email settings":                  checkOperatorOnly,
		"a new code ends the earlier one":                         checkNewCodeEndsEarlier,
	}

	// The checks run in parallel with one another; this group returns when
	// they all have, before the checks that change shared settings.
	t.Run("while running", func(t *testing.T) {
		for name, check := range checks {
			t.Run(name, func(t *testing.T) {
				t.Parallel()
				check(t, svc)
			})
		}
	})

	t.Run("a stored SMTP password follows only its server", func(t *testing.T) { //nolint:paralleltest // it changes the email settings the other checks send with
		checkSMTPPasswordFollowsServer(t, svc)
	})

	// Cleanups run after the checks, and before the containers'.
	t.Cleanup(func() {
		if err := stop(); err != nil {
			t.Errorf("run returned %v after its context ended, want nil", err)
		}
	})
}

// startService starts the containers, configures email and the first operator
// with the administrative commands, starts the service on a free port and waits
// until it is ready. stop ends it and reports how run returned.
func startService(t *testing.T) (service, func() error) {
	t.Helper()

	ctx := t.Context()
	dsn, env := startPostgres(t)
	smtpAddr, mailpitURL := startMailpit(t)

	addr := freeAddr(t)
	env["SECONDBITE_HTTP_ADDR"] = addr
	getenv := func(k string) string { return env[k] }

	smtpHost, smtpPort, err := net.SplitHostPort(smtpAddr)
	if err != nil {
		t.Fatal(err)
	}

	admin := [][]string{
		{
			"email", "configure", "-provider", "smtp", "-sender-address", "no-reply@secondbite.test",
			"-smtp-host", smtpHost, "-smtp-port", smtpPort, "-smtp-security", "none",
		},
		{"operator", "grant", operatorEmail},
	}
	for _, args := range admin {
		if err := run(ctx, args, getenv, strings.NewReader(""), io.Discard); err != nil {
			t.Fatalf("secondbite %s: %v", strings.Join(args, " "), err)
		}
	}

	runCtx, cancel := context.WithCancel(context.WithoutCancel(ctx))
	done := make(chan error, 1)

	go func() { done <- run(runCtx, []string{"serve"}, getenv, strings.NewReader(""), io.Discard) }()

	svc := service{base: "http://" + addr, dsn: dsn, mailpit: mailpitURL}
	waitReady(t, svc.base+"/readyz", done)

	stop := func() error {
		cancel()

		select {
		case err := <-done:
			return err
		case <-time.After(30 * time.Second):
			return context.DeadlineExceeded
		}
	}

	return svc, stop
}

// startPostgres starts PostGIS and returns its URL and the service's
// environment for it, the password in a secret file.
func startPostgres(t *testing.T) (string, map[string]string) {
	t.Helper()

	ctx := t.Context()

	pg, err := postgres.Run(ctx, postgisImage,
		postgres.WithDatabase("secondbite"),
		postgres.WithUsername("secondbite"),
		postgres.WithPassword("test-only"),
		postgres.BasicWaitStrategies(),
	)
	testcontainers.CleanupContainer(t, pg)

	if err != nil {
		t.Fatal(err)
	}

	host, err := pg.Host(ctx)
	if err != nil {
		t.Fatal(err)
	}

	port, err := pg.MappedPort(ctx, "5432/tcp")
	if err != nil {
		t.Fatal(err)
	}

	dsn, err := pg.ConnectionString(ctx, "sslmode=disable")
	if err != nil {
		t.Fatal(err)
	}

	secrets := t.TempDir()
	writeSecret(t, secrets, "SECONDBITE_DATABASE_PASSWORD", "test-only")
	writeSecret(t, secrets, "SECONDBITE_EMAIL_SETTINGS_KEY", randomKey(t))
	writeSecret(t, secrets, "SECONDBITE_SIGN_IN_CODE_KEY", randomKey(t))

	return dsn, map[string]string{
		"SECONDBITE_DATABASE_URL": "postgres://secondbite@" + net.JoinHostPort(host, port.Port()) + "/secondbite?sslmode=disable",
		"SECONDBITE_SECRETS_DIR":  secrets,
		"SECONDBITE_LOG_LEVEL":    "debug",
	}
}

// startMailpit starts Mailpit and returns its SMTP address and its API's URL.
func startMailpit(t *testing.T) (string, string) {
	t.Helper()

	ctx := t.Context()

	c, err := testcontainers.Run(ctx, mailpitImage,
		testcontainers.WithExposedPorts("1025/tcp", "8025/tcp"),
		testcontainers.WithWaitStrategy(wait.ForHTTP("/livez").WithPort("8025/tcp")),
	)
	testcontainers.CleanupContainer(t, c)

	if err != nil {
		t.Fatal(err)
	}

	smtp, err := c.PortEndpoint(ctx, "1025/tcp", "")
	if err != nil {
		t.Fatal(err)
	}

	api, err := c.PortEndpoint(ctx, "8025/tcp", "http")
	if err != nil {
		t.Fatal(err)
	}

	return smtp, api
}

func writeSecret(t *testing.T, dir, name, value string) {
	t.Helper()

	if err := os.WriteFile(filepath.Join(dir, name), []byte(value+"\n"), 0o600); err != nil {
		t.Fatal(err)
	}
}

func randomKey(t *testing.T) string {
	t.Helper()

	key := make([]byte, 32)
	if _, err := rand.Read(key); err != nil {
		t.Fatal(err)
	}

	return base64.StdEncoding.EncodeToString(key)
}

func checkMigrated(t *testing.T, svc service) {
	t.Helper()

	conn, err := pgx.Connect(t.Context(), svc.dsn)
	if err != nil {
		t.Fatal(err)
	}

	defer func() {
		if err := conn.Close(context.WithoutCancel(t.Context())); err != nil {
			t.Error(err)
		}
	}()

	var version string
	if err := conn.QueryRow(t.Context(), "SELECT postgis_version()").Scan(&version); err != nil {
		t.Fatalf("PostGIS is not enabled: %v", err)
	}
}

// execSQL runs one statement against the service's database, for a check that
// must move time.
func execSQL(t *testing.T, svc service, sql string, args ...any) {
	t.Helper()

	conn, err := pgx.Connect(t.Context(), svc.dsn)
	if err != nil {
		t.Fatal(err)
	}

	defer func() {
		if err := conn.Close(context.WithoutCancel(t.Context())); err != nil {
			t.Error(err)
		}
	}()

	if _, err := conn.Exec(t.Context(), sql, args...); err != nil {
		t.Fatal(err)
	}
}

func checkProbes(t *testing.T, svc service) {
	t.Helper()

	for _, path := range []string{"/livez", "/readyz"} {
		resp := send(t, http.MethodGet, svc.base+path, nil, nil)
		if resp.status != http.StatusNoContent {
			t.Errorf("%s: status %d, want 204", path, resp.status)
		}

		if resp.header.Get("X-Request-Id") == "" {
			t.Errorf("%s: no X-Request-Id", path)
		}
	}
}

func checkCallerRequestID(t *testing.T, svc service) {
	t.Helper()

	resp := send(t, http.MethodGet, svc.base+"/livez", http.Header{"X-Request-Id": {"proxy-abc.123"}}, nil)
	if got := resp.header.Get("X-Request-Id"); got != "proxy-abc.123" {
		t.Errorf("X-Request-Id %q, want the caller's", got)
	}

	resp = send(t, http.MethodGet, svc.base+"/livez", http.Header{"X-Request-Id": {"not allowed!"}}, nil)
	if got := resp.header.Get("X-Request-Id"); got == "not allowed!" || got == "" {
		t.Errorf("X-Request-Id %q, want a new identifier", got)
	}
}

func checkContractServed(t *testing.T, svc service) {
	t.Helper()

	if resp := send(t, http.MethodGet, svc.base+"/openapi.json", nil, nil); resp.status != http.StatusOK {
		t.Errorf("status %d, want 200", resp.status)
	}
}

func checkUnknownRoute(t *testing.T, svc service) {
	t.Helper()

	resp := send(t, http.MethodGet, svc.base+"/nothing-here", nil, nil)
	p := resp.problem(t, http.StatusNotFound)

	if p.Code != "PLATFORM_ROUTE_NOT_FOUND" || p.Type != "urn:secondbite:failure:platform-route-not-found" {
		t.Errorf("problem %+v", p)
	}

	if p.RequestID == "" || p.RequestID != resp.header.Get("X-Request-Id") {
		t.Errorf("requestId %q, header %q", p.RequestID, resp.header.Get("X-Request-Id"))
	}
}

func checkMethodNotAllowed(t *testing.T, svc service) {
	t.Helper()

	resp := send(t, http.MethodPost, svc.base+"/livez", nil, nil)

	if p := resp.problem(t, http.StatusMethodNotAllowed); p.Code != "PLATFORM_METHOD_NOT_ALLOWED" {
		t.Errorf("code %q", p.Code)
	}

	if !strings.Contains(resp.header.Get("Allow"), http.MethodGet) {
		t.Errorf("Allow %q", resp.header.Get("Allow"))
	}
}

type response struct {
	status int
	header http.Header
	body   []byte
}

type problem struct {
	Type      string `json:"type"`
	Status    int    `json:"status"`
	Code      string `json:"code"`
	RequestID string `json:"requestId"`
}

func (r response) problem(t *testing.T, status int) problem {
	t.Helper()

	if r.status != status {
		t.Fatalf("status %d, want %d; body %s", r.status, status, r.body)
	}

	if ct := r.header.Get("Content-Type"); ct != "application/problem+json" {
		t.Fatalf("Content-Type %q, want application/problem+json", ct)
	}

	var p problem
	if err := json.Unmarshal(r.body, &p); err != nil {
		t.Fatal(err)
	}

	if p.Status != status {
		t.Errorf("problem status %d, want %d", p.Status, status)
	}

	return p
}

// decode reads a successful JSON answer into out.
func (r response) decode(t *testing.T, status int, out any) {
	t.Helper()

	if r.status != status {
		t.Fatalf("status %d, want %d; body %s", r.status, status, r.body)
	}

	if err := json.Unmarshal(r.body, out); err != nil {
		t.Fatal(err)
	}
}

// send sends a request with an optional JSON body.
func send(t *testing.T, method, url string, header http.Header, body any) response {
	t.Helper()

	var reader io.Reader

	if body != nil {
		b, err := json.Marshal(body)
		if err != nil {
			t.Fatal(err)
		}

		reader = bytes.NewReader(b)
	}

	req, err := http.NewRequestWithContext(t.Context(), method, url, reader)
	if err != nil {
		t.Fatal(err)
	}

	maps.Copy(req.Header, header)

	if body != nil {
		req.Header.Set("Content-Type", "application/json")
	}

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		t.Fatal(err)
	}

	defer func() {
		if err := resp.Body.Close(); err != nil {
			t.Error(err)
		}
	}()

	raw, err := io.ReadAll(resp.Body)
	if err != nil {
		t.Fatal(err)
	}

	return response{status: resp.StatusCode, header: resp.Header, body: raw}
}

// freeAddr returns a loopback address with a port nobody listens on.
func freeAddr(t *testing.T) string {
	t.Helper()

	var lc net.ListenConfig

	ln, err := lc.Listen(t.Context(), "tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatal(err)
	}

	addr := ln.Addr().String()
	if err := ln.Close(); err != nil {
		t.Fatal(err)
	}

	return addr
}

// waitReady polls url until it answers 204, failing if the service stops first.
func waitReady(t *testing.T, url string, done <-chan error) {
	t.Helper()

	deadline := time.Now().Add(30 * time.Second)

	for time.Now().Before(deadline) {
		select {
		case err := <-done:
			t.Fatalf("the service stopped before it was ready: %v", err)
		case <-time.After(100 * time.Millisecond):
		}

		req, err := http.NewRequestWithContext(t.Context(), http.MethodGet, url, nil)
		if err != nil {
			t.Fatal(err)
		}

		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			continue
		}

		if err := resp.Body.Close(); err != nil {
			t.Fatal(err)
		}

		if resp.StatusCode == http.StatusNoContent {
			return
		}
	}

	t.Fatal("the service was not ready within 30 seconds")
}
