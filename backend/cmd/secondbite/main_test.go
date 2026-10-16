package main

import (
	"context"
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
)

// postgisImage is the image of local development and of every test.
const postgisImage = "postgis/postgis:18-3.6"

// service is one run of the assembled service against its database.
type service struct {
	base string
	dsn  string
}

// TestService runs the assembled service against PostgreSQL with PostGIS in a
// container: it migrates, serves its probes and contract, answers problems,
// and stops cleanly when its context ends.
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
	}

	t.Run("while running", func(t *testing.T) {
		t.Parallel()

		for name, check := range checks {
			t.Run(name, func(t *testing.T) {
				t.Parallel()
				check(t, svc)
			})
		}
	})

	// Cleanups run after the parallel checks, and before the container's.
	t.Cleanup(func() {
		if err := stop(); err != nil {
			t.Errorf("run returned %v after its context ended, want nil", err)
		}
	})
}

// startService starts a container and the service on a free port, waits until
// it is ready, and returns a function that stops it and reports how run ended.
func startService(t *testing.T) (service, func() error) {
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
	if err := os.WriteFile(filepath.Join(secrets, "SECONDBITE_DATABASE_PASSWORD"), []byte("test-only\n"), 0o600); err != nil {
		t.Fatal(err)
	}

	addr := freeAddr(t)
	env := map[string]string{
		"SECONDBITE_HTTP_ADDR":    addr,
		"SECONDBITE_DATABASE_URL": "postgres://secondbite@" + net.JoinHostPort(host, port.Port()) + "/secondbite?sslmode=disable",
		"SECONDBITE_SECRETS_DIR":  secrets,
		"SECONDBITE_LOG_LEVEL":    "debug",
	}

	runCtx, cancel := context.WithCancel(context.WithoutCancel(ctx))
	done := make(chan error, 1)

	go func() { done <- run(runCtx, func(k string) string { return env[k] }, io.Discard) }()

	svc := service{base: "http://" + addr, dsn: dsn}
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

func checkProbes(t *testing.T, svc service) {
	t.Helper()

	for _, path := range []string{"/livez", "/readyz"} {
		resp := send(t, http.MethodGet, svc.base+path, nil)
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

	resp := send(t, http.MethodGet, svc.base+"/livez", http.Header{"X-Request-Id": {"proxy-abc.123"}})
	if got := resp.header.Get("X-Request-Id"); got != "proxy-abc.123" {
		t.Errorf("X-Request-Id %q, want the caller's", got)
	}

	resp = send(t, http.MethodGet, svc.base+"/livez", http.Header{"X-Request-Id": {"not allowed!"}})
	if got := resp.header.Get("X-Request-Id"); got == "not allowed!" || got == "" {
		t.Errorf("X-Request-Id %q, want a new identifier", got)
	}
}

func checkContractServed(t *testing.T, svc service) {
	t.Helper()

	if resp := send(t, http.MethodGet, svc.base+"/openapi.json", nil); resp.status != http.StatusOK {
		t.Errorf("status %d, want 200", resp.status)
	}
}

func checkUnknownRoute(t *testing.T, svc service) {
	t.Helper()

	resp := send(t, http.MethodGet, svc.base+"/nothing-here", nil)
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

	resp := send(t, http.MethodPost, svc.base+"/livez", nil)

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
		t.Fatalf("status %d, want %d", r.status, status)
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

func send(t *testing.T, method, url string, header http.Header) response {
	t.Helper()

	req, err := http.NewRequestWithContext(t.Context(), method, url, nil)
	if err != nil {
		t.Fatal(err)
	}

	maps.Copy(req.Header, header)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		t.Fatal(err)
	}
	defer func() {
		if err := resp.Body.Close(); err != nil {
			t.Error(err)
		}
	}()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		t.Fatal(err)
	}

	return response{status: resp.StatusCode, header: resp.Header, body: body}
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
