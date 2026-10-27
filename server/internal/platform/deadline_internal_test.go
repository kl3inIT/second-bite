package platform

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

// A request's work ends when its answer could no longer be written; a live
// socket keeps its context (SEC-159).
func TestWithDeadline(t *testing.T) {
	t.Parallel()

	for _, tc := range []struct {
		name    string
		upgrade string
		want    bool
	}{
		{name: "a request", want: true},
		{name: "a live socket", upgrade: "websocket", want: false},
	} {
		t.Run(tc.name, func(t *testing.T) {
			t.Parallel()

			var (
				deadline time.Time
				has      bool
			)

			h := withDeadline(http.HandlerFunc(func(_ http.ResponseWriter, r *http.Request) {
				deadline, has = r.Context().Deadline()
			}))

			r := httptest.NewRequestWithContext(t.Context(), http.MethodGet, "/orders", nil)
			if tc.upgrade != "" {
				r.Header.Set("Upgrade", tc.upgrade)
			}

			start := time.Now()

			h.ServeHTTP(httptest.NewRecorder(), r)

			if has != tc.want {
				t.Fatalf("deadline set: %v, want %v", has, tc.want)
			}

			if has && (deadline.Before(start.Add(writeTimeout-time.Second)) || deadline.After(start.Add(writeTimeout+time.Second))) {
				t.Errorf("deadline %s after the start, want about %s", deadline.Sub(start), writeTimeout)
			}
		})
	}
}
