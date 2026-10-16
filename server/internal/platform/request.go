package platform

import (
	"context"
	"crypto/rand"
	"log/slog"
	"net/http"
	"regexp"
	"runtime/debug"
	"time"
)

const requestIDHeader = "X-Request-Id"

var requestIDPattern = regexp.MustCompile(`^[A-Za-z0-9._-]{1,64}$`)

type requestKey struct{}

// requestInfo is what the platform remembers about one request: its
// identifier, and the code of the failure it answered, for the access log.
type requestInfo struct {
	id        string
	errorCode string
	logger    *slog.Logger
}

// RequestID returns the identifier of the request ctx belongs to, or "".
func RequestID(ctx context.Context) string {
	if info, ok := ctx.Value(requestKey{}).(*requestInfo); ok {
		return info.id
	}

	return ""
}

func requestLogger(ctx context.Context) *slog.Logger {
	if info, ok := ctx.Value(requestKey{}).(*requestInfo); ok {
		return info.logger
	}

	return nil
}

func setErrorCode(ctx context.Context, code string) {
	if info, ok := ctx.Value(requestKey{}).(*requestInfo); ok {
		info.errorCode = code
	}
}

// statusRecorder remembers the status a handler wrote.
type statusRecorder struct {
	http.ResponseWriter

	status int
}

func (r *statusRecorder) WriteHeader(status int) {
	if r.status == 0 {
		r.status = status
	}

	r.ResponseWriter.WriteHeader(status)
}

func (r *statusRecorder) Write(b []byte) (int, error) {
	if r.status == 0 {
		r.status = http.StatusOK
	}

	return r.ResponseWriter.Write(b)
}

// Unwrap lets http.ResponseController reach the underlying writer.
func (r *statusRecorder) Unwrap() http.ResponseWriter { return r.ResponseWriter }

// withRequest gives every request an identifier, returned in X-Request-Id and
// logged as request_id; recovers a panic into a 500 problem; and logs one
// access record when the request ends. An identifier sent by the caller is
// kept when it is well formed, so a proxy's identifier follows the request.
func withRequest(logger *slog.Logger, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		id := r.Header.Get(requestIDHeader)
		if !requestIDPattern.MatchString(id) {
			id = rand.Text()
		}

		info := &requestInfo{id: id, logger: logger}
		r = r.WithContext(context.WithValue(r.Context(), requestKey{}, info))

		w.Header().Set(requestIDHeader, id)

		rec := &statusRecorder{ResponseWriter: w}

		defer func() {
			if v := recover(); v != nil {
				if v == http.ErrAbortHandler { //nolint:errorlint // the sentinel is compared as net/http does
					panic(v)
				}

				info.errorCode = CodeInternalFailure
				logger.ErrorContext(r.Context(), "request panicked",
					slog.String("event", "platform.request.panicked"),
					slog.String("error_code", CodeInternalFailure),
					slog.Any("panic", v),
					slog.String("stack", string(debug.Stack())),
				)

				if rec.status == 0 {
					writeProblem(rec, newProblem(http.StatusInternalServerError, CodeInternalFailure,
						http.StatusText(http.StatusInternalServerError), internalDetail, id))
				}
			}

			logAccess(r, logger, rec.status, info.errorCode, time.Since(start))
		}()

		next.ServeHTTP(rec, r)
	})
}

func logAccess(r *http.Request, logger *slog.Logger, status int, errorCode string, d time.Duration) {
	route := r.Pattern
	if route == "" {
		route = "unmatched"
	}

	level := slog.LevelInfo
	if route == routeLive || route == routeReady {
		level = slog.LevelDebug
	}

	attrs := []slog.Attr{
		slog.String("event", "platform.request.completed"),
		slog.String("method", r.Method),
		slog.String("route", route),
		slog.Int("status", status),
		slog.Int64("duration_ms", d.Milliseconds()),
	}
	if errorCode != "" {
		attrs = append(attrs, slog.String("error_code", errorCode))
	}

	logger.LogAttrs(r.Context(), level, "request completed", attrs...)
}

// discardWriter records the status and headers of a response and drops its body.
type discardWriter struct {
	header http.Header
	status int
}

func (d *discardWriter) Header() http.Header         { return d.header }
func (d *discardWriter) Write(b []byte) (int, error) { return len(b), nil }
func (d *discardWriter) WriteHeader(status int)      { d.status = status }

// withUnmatched answers a request no route matches with a problem instead of
// the mux's plain text: 404 for an unknown path, 405 with Allow for a known
// path and another method.
func withUnmatched(mux *http.ServeMux) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		h, pattern := mux.Handler(r)
		if pattern != "" {
			mux.ServeHTTP(w, r)

			return
		}

		probe := &discardWriter{header: http.Header{}}
		h.ServeHTTP(probe, r)

		status, code := http.StatusNotFound, CodeRouteNotFound
		if probe.status == http.StatusMethodNotAllowed {
			status, code = http.StatusMethodNotAllowed, CodeMethodNotAllowed

			w.Header().Set("Allow", probe.header.Get("Allow"))
		}

		setErrorCode(r.Context(), code)
		writeProblem(w, newProblem(status, code, http.StatusText(status), "", RequestID(r.Context())))
	})
}
