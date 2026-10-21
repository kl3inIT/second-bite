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
}

func newGeocoder() geocoder {
	return geocoder{client: &http.Client{Timeout: nominatimTimeout}, baseURL: nominatimURL}
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

// written puts the parts of an address in the order Vietnamese write them. A point with none of them keeps the
// service's own line, without the country and the postcode it ends with.
func written(parts map[string]string, display string) string {
	street := strings.TrimSpace(parts["house_number"] + " " + parts["road"])
	line := []string{street}

	for _, keys := range [][]string{
		{"quarter", "suburb", "neighbourhood", "village"},
		{"city_district", "district", "county", "town"},
		{"city", "state", "province"},
	} {
		for _, key := range keys {
			if parts[key] != "" {
				line = append(line, parts[key])
				break
			}
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

// AddressAt is the address at a point, for the form that opens a store: the caller must be signed in, so the
// public geocoder is not an open door. A point it cannot name, or a geocoder that does not answer, gives an empty
// address, and the person writes it themselves.
func (s *Service) AddressAt(ctx context.Context, latitude, longitude float64) (string, error) {
	if _, err := platform.RequireCaller(ctx); err != nil {
		return "", err
	}

	address, err := s.geocoder.reverse(ctx, latitude, longitude)
	if err != nil {
		s.logger.WarnContext(ctx, "address not found",
			slog.String("event", "seller.address.not_found"),
			slog.String("error", err.Error()),
		)

		return "", nil
	}

	return address, nil
}
