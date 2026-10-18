package main

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestHealth(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name    string
		status  int
		wantErr bool
	}{
		{name: "ready", status: http.StatusNoContent},
		{name: "not ready", status: http.StatusServiceUnavailable, wantErr: true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()

			srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				if r.URL.Path != "/readyz" {
					http.NotFound(w, r)

					return
				}

				w.WriteHeader(tt.status)
			}))
			t.Cleanup(srv.Close)

			addr := strings.TrimPrefix(srv.URL, "http://")
			getenv := func(name string) string {
				if name == "SECONDBITE_HTTP_ADDR" {
					return addr
				}

				return ""
			}

			err := run(t.Context(), []string{"health"}, getenv, nil, nil)
			if (err != nil) != tt.wantErr {
				t.Fatalf("health = %v, want error %v", err, tt.wantErr)
			}
		})
	}
}
