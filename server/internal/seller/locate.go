package seller

import (
	"context"
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"

	"github.com/kl3inIT/second-bite/server/internal/platform"
)

const (
	// nominatimURL is OpenStreetMap's public geocoder: no key, one request a second, and a User-Agent that says who
	// asks (its usage policy). A pilot with a few sellers opening stores stays far under that.
	nominatimURL     = "https://nominatim.openstreetmap.org"
	nominatimTimeout = 5 * time.Second
	userAgent        = "SecondBite/1.0 (+https://secondbite.vadan.app)"
)

// geocoder turns a point into the address people write there.
type geocoder struct {
	client  *http.Client
	baseURL string
	// pace keeps to Nominatim's one request a second; nil in tests.
	pace *pacer
}

func newGeocoder() geocoder {
	return geocoder{client: &http.Client{Timeout: nominatimTimeout}, baseURL: nominatimURL, pace: &pacer{every: nominatimEvery}}
}

// reverse is the address at a point, as a seller would write it: house number and street, then the ward, the
// district and the city. It is empty when the service knows nothing there.
func (g geocoder) reverse(ctx context.Context, latitude, longitude float64) (string, error) {
	query := url.Values{
		"format": {"jsonv2"}, "zoom": {"18"}, "addressdetails": {"1"}, "accept-language": {"vi"},
		"lat": {strconv.FormatFloat(latitude, 'f', 6, 64)},
		"lon": {strconv.FormatFloat(longitude, 'f', 6, 64)},
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, g.baseURL+"/reverse?"+query.Encode(), nil)
	if err != nil {
		return "", fmt.Errorf("building the geocoder request: %w", err)
	}

	req.Header.Set("User-Agent", userAgent)

	if err := g.pace.wait(ctx); err != nil {
		return "", fmt.Errorf("waiting for the geocoder's turn: %w", err)
	}

	resp, err := g.client.Do(req)
	if err != nil {
		return "", fmt.Errorf("asking the geocoder: %w", err)
	}
	defer func() { _ = resp.Body.Close() }()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("the geocoder answered %d", resp.StatusCode)
	}

	var found struct {
		DisplayName string            `json:"display_name"`
		Address     map[string]string `json:"address"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&found); err != nil {
		return "", fmt.Errorf("reading the geocoder's answer: %w", err)
	}

	return written(found.Address, found.DisplayName), nil
}

// wardKeys are where OpenStreetMap puts a ward or a commune, which Vietnam's addresses name between the street and
// the city since districts were abolished in July 2025: "Phường Phú Diễn" as a suburb, "Xã Bát Tràng" as a city
// district. The same keys also hold named places inside a ward (Kẻ Diễn, a quarter of Phú Diễn), so a ward is the
// first one named as a ward; only when none is does the first one stand for it.
var wardKeys = []string{"suburb", "city_district", "town", "village", "county", "district", "quarter", "neighbourhood"}

// wardPrefixes are how a ward, a commune or a special zone is named.
var wardPrefixes = []string{"Phường ", "Xã ", "Thị trấn ", "Đặc khu "}

// written puts the parts of an address in the order Vietnamese write them: the street, the ward, the city. A point
// with none of them keeps the service's own line, without the country and the postcode it ends with.
func written(parts map[string]string, display string) string {
	street := strings.TrimSpace(parts["house_number"] + " " + parts["road"])
	line := []string{street, ward(parts)}

	for _, key := range []string{"city", "state", "province"} {
		if parts[key] != "" {
			line = append(line, parts[key])
			break
		}
	}

	var kept []string

	for _, part := range line {
		if part != "" {
			kept = append(kept, part)
		}
	}

	if len(kept) > 0 {
		return strings.Join(kept, ", ")
	}

	pieces := strings.Split(display, ", ")
	if len(pieces) > 2 { // drop "Việt Nam" and the postcode
		pieces = pieces[:len(pieces)-2]
	}

	return strings.Join(pieces, ", ")
}

// ward is the ward or commune among the parts of an address, or the first place that stands for one.
func ward(parts map[string]string) string {
	for _, key := range wardKeys {
		for _, prefix := range wardPrefixes {
			if strings.HasPrefix(parts[key], prefix) {
				return parts[key]
			}
		}
	}

	for _, key := range wardKeys {
		if parts[key] != "" {
			return parts[key]
		}
	}

	return ""
}

// AddressAt is the address at a point, for the form that opens a store: the caller must be signed in, so the
// public geocoder is not an open door. A point it cannot name, or a geocoder that does not answer, gives an empty
// address, and the person writes it themselves.
func (s *Service) AddressAt(ctx context.Context, latitude, longitude float64) (string, error) {
	caller, err := platform.RequireCaller(ctx)
	if err != nil {
		return "", err
	}

	// About a metre apart is the same point.
	key := strconv.FormatFloat(latitude, 'f', 5, 64) + "," + strconv.FormatFloat(longitude, 'f', 5, 64)
	if address, ok := s.addresses.get(key); ok {
		return address, nil
	}

	if err := s.lookups.Take(caller.AccountID.String()); err != nil {
		return "", err
	}

	address, err := s.geocoder.reverse(ctx, latitude, longitude)
	if err != nil {
		s.logger.WarnContext(ctx, "address not found",
			slog.String("event", "seller.address.not_found"),
			slog.String("error", lookupFailure(err)),
		)

		return "", nil
	}

	s.addresses.put(key, address)

	return address, nil
}
