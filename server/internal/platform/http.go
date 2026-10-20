package platform

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net"
	"net/http"
	"slices"
	"time"

	"github.com/danielgtaylor/huma/v2"
	"github.com/danielgtaylor/huma/v2/adapters/humago"
	"github.com/jackc/pgx/v5/pgxpool"
)

const (
	routeLive  = "GET /livez"
	routeReady = "GET /readyz"

	readyTimeout    = 2 * time.Second
	shutdownTimeout = 20 * time.Second
)

// NewAPI returns the huma API on mux, whose OpenAPI 3.1 document is generated
// from the operations the modules register. Every error it answers goes
// through the one problem mapping.
func NewAPI(mux *http.ServeMux) huma.API {
	installErrorMapping()

	config := huma.DefaultConfig("Second Bite API", "0.1.0")
	config.Info.Description = "The API of Second Bite, a non-profit marketplace for food surplus."
	// No $schema member in bodies and no Link header: the contract is the
	// OpenAPI document, not a schema link per response.
	config.CreateHooks = nil
	config.Components.SecuritySchemes = map[string]*huma.SecurityScheme{
		SecurityBearer: {Type: "http", Scheme: "bearer", Description: "A session token from POST /auth/sessions."},
		SecurityCookie: {
			Type: "apiKey", In: "cookie", Name: SessionCookie,
			Description: "The web's session, set by signing in with \"session\": \"cookie\".",
		},
	}

	return humago.New(mux, config)
}

// RegisterHealth adds the probes: /livez answers while the process runs,
// /readyz while the database answers too.
func RegisterHealth(mux *http.ServeMux, pool *pgxpool.Pool) {
	mux.HandleFunc(routeLive, func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusNoContent)
	})

	mux.HandleFunc(routeReady, func(w http.ResponseWriter, r *http.Request) {
		ctx, cancel := context.WithTimeout(r.Context(), readyTimeout)
		defer cancel()

		if err := pool.Ping(ctx); err != nil {
			setErrorCode(r.Context(), CodeDatabaseUnavailable)
			w.Header().Set("Retry-After", "5")
			writeProblem(w, platformProblem(r.Context(), http.StatusServiceUnavailable, CodeDatabaseUnavailable))

			return
		}

		w.WriteHeader(http.StatusNoContent)
	})
}

// NewHandler wraps mux with the request identifier, panic recovery, the access
// log and problems for unmatched routes. Each of wraps, such as the module that
// authenticates callers, runs inside those, in order, before the mux.
func NewHandler(mux *http.ServeMux, logger *slog.Logger, wraps ...func(http.Handler) http.Handler) http.Handler {
	h := withUnmatched(mux)
	for _, wrap := range slices.Backward(wraps) {
		h = wrap(h)
	}

	return withRequest(logger, h)
}

// Serve runs the HTTP server on ln until ctx is cancelled, then stops taking
// requests and lets those in flight finish within the shutdown timeout.
func Serve(ctx context.Context, ln net.Listener, handler http.Handler, logger *slog.Logger) error {
	srv := &http.Server{
		Handler:           handler,
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       15 * time.Second,
		WriteTimeout:      30 * time.Second,
		IdleTimeout:       60 * time.Second,
		ErrorLog:          slog.NewLogLogger(logger.Handler(), slog.LevelWarn),
		BaseContext:       func(net.Listener) context.Context { return context.WithoutCancel(ctx) },
	}

	errc := make(chan error, 1)

	go func() { errc <- srv.Serve(ln) }()

	logger.InfoContext(ctx, "server started",
		slog.String("event", "platform.server.started"),
		slog.String("addr", ln.Addr().String()),
	)

	select {
	case err := <-errc:
		return fmt.Errorf("serving HTTP: %w", err)
	case <-ctx.Done():
	}

	logger.InfoContext(ctx, "server stopping",
		slog.String("event", "platform.server.stopping"),
	)

	shutdownCtx, cancel := context.WithTimeout(context.WithoutCancel(ctx), shutdownTimeout)
	defer cancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		return fmt.Errorf("shutting down HTTP: %w", err)
	}

	if err := <-errc; !errors.Is(err, http.ErrServerClosed) {
		return fmt.Errorf("serving HTTP: %w", err)
	}

	return nil
}
