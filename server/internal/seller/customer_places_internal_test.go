package seller

import (
	"net/http"
	"net/http/httptest"
	"strconv"
	"sync/atomic"
	"testing"
	"time"

	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/platform/platformtest"
)

// A customer's place search answers anyone, signed in or not; each client
// address makes placesPerAddress searches in ten minutes, an answer already
// kept costing none, and another address keeps its own.
func TestCustomerPlacesAreBoundedPerAddress(t *testing.T) {
	t.Parallel()

	var asked atomic.Int32

	photon := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		asked.Add(1)

		_, _ = w.Write([]byte(`{"features":[]}`))
	}))
	t.Cleanup(photon.Close)

	logger := platformtest.Logger()
	s := &Service{
		logger:          logger,
		places:          placeSearch{client: photon.Client(), baseURL: photon.URL},
		lookups:         platform.NewLimiter(lookupsPerAccount, lookupWindow),
		placesByAddress: platform.NewLimiter(placesPerAddress, time.Minute),
		placeResults:    newLookupCache[[]Place](time.Hour),
	}

	mux := http.NewServeMux()
	RegisterOperations(platform.NewAPI(mux), s)

	server := httptest.NewServer(platform.NewHandler(mux, logger))
	t.Cleanup(server.Close)

	search := func(from, words string) int {
		t.Helper()

		req, err := http.NewRequestWithContext(t.Context(), http.MethodGet, server.URL+"/places?q="+words, nil)
		if err != nil {
			t.Fatal(err)
		}

		req.Header.Set("X-Forwarded-For", from)

		resp, err := server.Client().Do(req)
		if err != nil {
			t.Fatal(err)
		}

		_ = resp.Body.Close()

		return resp.StatusCode
	}

	const customer, neighbour = "203.0.113.20", "203.0.113.21"

	for i := range placesPerAddress {
		if status := search(customer, "viet+hung+"+strconv.Itoa(i)); status != http.StatusOK {
			t.Fatalf("search %d without signing in: %d, want 200", i+1, status)
		}
	}

	if status := search(customer, "long+bien"); status != http.StatusTooManyRequests {
		t.Errorf("a search past the address's searches: %d, want 429", status)
	}

	if status := search(customer, "viet+hung+0"); status != http.StatusOK {
		t.Errorf("a search already kept, past the address's searches: %d, want 200", status)
	}

	if status := search(neighbour, "long+bien"); status != http.StatusOK {
		t.Errorf("another address: %d, want 200", status)
	}

	if got := asked.Load(); got != placesPerAddress+1 {
		t.Errorf("Photon was asked %d times, want %d", got, placesPerAddress+1)
	}
}
