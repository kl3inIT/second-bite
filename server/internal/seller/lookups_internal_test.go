package seller

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"net/url"
	"strings"
	"sync/atomic"
	"testing"
	"time"

	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/platform/platformtest"
)

// An address lookup asks the geocoder once for a point, keeps the answer, and
// refuses an account past its lookups; a failure's log names no URL (SEC-160).
func TestLookupsAreBoundedAndKept(t *testing.T) {
	t.Parallel()

	var asked atomic.Int32

	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		asked.Add(1)

		_, _ = w.Write([]byte(`{"display_name":"Tasco Mall","address":{"road":"Ngô Gia Tự","city":"Hà Nội"}}`))
	}))
	t.Cleanup(server.Close)

	s := &Service{
		logger:    platformtest.Logger(),
		geocoder:  geocoder{client: server.Client(), baseURL: server.URL},
		lookups:   platform.NewLimiter(2, time.Minute),
		addresses: newLookupCache[string](time.Hour),
	}
	ctx := platform.WithCaller(t.Context(), platform.Caller{AccountID: uuid.New(), Role: platform.RoleCustomer})

	for range 3 {
		if address, err := s.AddressAt(ctx, 21.0565, 105.8964); err != nil || address == "" {
			t.Fatalf("the same point: %q, %v", address, err)
		}
	}

	if _, err := s.AddressAt(ctx, 21.0366, 105.7818); err != nil {
		t.Fatalf("a second point: %v", err)
	}

	if got := asked.Load(); got != 2 {
		t.Errorf("the geocoder was asked %d times for two points, want 2", got)
	}

	if _, err := s.AddressAt(ctx, 21.0201, 105.8301); !errors.Is(err, platform.ErrTooManyRequests) {
		t.Errorf("a third point past the account's lookups: %v, want ErrTooManyRequests", err)
	}

	failed := &url.Error{Op: "Get", URL: "https://nominatim.openstreetmap.org/reverse?lat=21.0565", Err: errors.New("timeout")}
	if logged := lookupFailure(failed); strings.Contains(logged, "nominatim") || strings.Contains(logged, "21.0565") {
		t.Errorf("the logged failure %q carries the URL", logged)
	}
}
