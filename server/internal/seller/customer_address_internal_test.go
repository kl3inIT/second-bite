package seller

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strconv"
	"sync/atomic"
	"testing"
	"time"

	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/platform/platformtest"
)

// The address at a customer's point answers anyone, signed in or not, kept
// once known; it counts against the client address's place searches.
func TestCustomerAddressIsKeptAndBoundedPerAddress(t *testing.T) {
	t.Parallel()

	var asked atomic.Int32

	nominatim := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		asked.Add(1)

		_, _ = w.Write([]byte(`{"display_name":"Phố Hoa Lâm","address":{"road":"Phố Hoa Lâm","suburb":"Phường Việt Hưng","city":"Hà Nội"}}`))
	}))
	t.Cleanup(nominatim.Close)

	logger := platformtest.Logger()
	s := &Service{
		logger:          logger,
		geocoder:        geocoder{client: nominatim.Client(), baseURL: nominatim.URL},
		lookups:         platform.NewLimiter(lookupsPerAccount, lookupWindow),
		placesByAddress: platform.NewLimiter(2, time.Minute),
		addresses:       newLookupCache[string](time.Hour),
	}

	mux := http.NewServeMux()
	RegisterOperations(platform.NewAPI(mux), s)

	server := httptest.NewServer(platform.NewHandler(mux, logger))
	t.Cleanup(server.Close)

	at := func(latitude float64) (int, string) {
		t.Helper()

		url := server.URL + "/places/at?latitude=" + strconv.FormatFloat(latitude, 'f', -1, 64) + "&longitude=105.896"

		req, err := http.NewRequestWithContext(t.Context(), http.MethodGet, url, nil)
		if err != nil {
			t.Fatal(err)
		}

		req.Header.Set("X-Forwarded-For", "203.0.113.30")

		resp, err := server.Client().Do(req)
		if err != nil {
			t.Fatal(err)
		}
		defer func() { _ = resp.Body.Close() }()

		var body struct {
			Address string `json:"address"`
		}

		_ = json.NewDecoder(resp.Body).Decode(&body)

		return resp.StatusCode, body.Address
	}

	for range 3 {
		if status, address := at(21.054); status != http.StatusOK || address == "" {
			t.Fatalf("the same point without signing in: %d %q", status, address)
		}
	}

	if status, _ := at(21.055); status != http.StatusOK {
		t.Fatalf("a second point: %d", status)
	}

	if status, _ := at(21.056); status != http.StatusTooManyRequests {
		t.Errorf("a third point past the address's lookups: %d, want 429", status)
	}

	if got := asked.Load(); got != 2 {
		t.Errorf("the geocoder was asked %d times for two points, want 2", got)
	}
}
