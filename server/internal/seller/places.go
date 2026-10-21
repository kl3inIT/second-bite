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
	// photonURL is komoot's public Photon, a search-as-you-type geocoder over OpenStreetMap: no key, fair use, and
	// a User-Agent that says who asks. Typing is answered in Vietnamese with or without its marks.
	photonURL     = "https://photon.komoot.io"
	photonTimeout = 4 * time.Second
	// placesLimit is how many suggestions a query gets; a phone shows five without scrolling.
	placesLimit = 5
)

// Place is a suggestion for a store's address: the address as people write it and where it is.
type Place struct {
	Address   string
	Latitude  float64
	Longitude float64
}

// placeSearch suggests places in Hanoi for what someone types.
type placeSearch struct {
	client  *http.Client
	baseURL string
}

func newPlaceSearch() placeSearch {
	return placeSearch{client: &http.Client{Timeout: photonTimeout}, baseURL: photonURL}
}

// photonFeature is one place Photon answers, with the parts of its address.
type photonFeature struct {
	Geometry struct {
		Coordinates []float64 `json:"coordinates"`
	} `json:"geometry"`
	Properties struct {
		Name        string `json:"name"`
		HouseNumber string `json:"housenumber"`
		Street      string `json:"street"`
		District    string `json:"district"`
		Locality    string `json:"locality"`
		City        string `json:"city"`
	} `json:"properties"`
}

// search is up to five places in Hanoi's box for the words typed, each once.
func (p placeSearch) search(ctx context.Context, words string) ([]Place, error) {
	box := servedArea
	query := url.Values{
		"q":     {words},
		"limit": {strconv.Itoa(placesLimit * 2)}, // twice as many, as some repeat an address already given
		"bbox": {strings.Join([]string{
			ftoa(box.west), ftoa(box.south), ftoa(box.east), ftoa(box.north),
		}, ",")},
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, p.baseURL+"/api/?"+query.Encode(), nil)
	if err != nil {
		return nil, fmt.Errorf("building the place search request: %w", err)
	}

	req.Header.Set("User-Agent", userAgent)

	resp, err := p.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("asking the place search: %w", err)
	}
	defer func() { _ = resp.Body.Close() }()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("the place search answered %d", resp.StatusCode)
	}

	var found struct {
		Features []photonFeature `json:"features"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&found); err != nil {
		return nil, fmt.Errorf("reading the place search's answer: %w", err)
	}

	return places(found.Features, leadingNumber(words)), nil
}

// places turns Photon's features into suggestions inside Hanoi, without repeats, at most five. A house number the
// person typed first goes before a street that has none, since OpenStreetMap knows few house numbers in Vietnam.
func places(features []photonFeature, number string) []Place {
	seen := map[string]bool{}
	out := []Place{}

	for _, f := range features {
		if len(f.Geometry.Coordinates) != 2 {
			continue
		}

		lng, lat := f.Geometry.Coordinates[0], f.Geometry.Coordinates[1]
		if !served(lat, lng) {
			continue
		}

		address := placeAddress(f, number)
		if address == "" || seen[address] {
			continue
		}

		seen[address] = true

		out = append(out, Place{Address: address, Latitude: lat, Longitude: lng})
		if len(out) == placesLimit {
			break
		}
	}

	return out
}

// placeAddress writes a feature as people write an address: the place's name when it is not the street, the house
// number and the street, the ward, the city.
func placeAddress(f photonFeature, number string) string {
	p := f.Properties
	street, house := p.Street, p.HouseNumber

	if street == "" { // the feature is the street itself
		street, p.Name = p.Name, ""
	}

	if house == "" && street != "" {
		house = number
	}

	parts := []string{}
	if p.Name != "" && p.Name != street {
		parts = append(parts, p.Name)
	}

	parts = append(parts, strings.TrimSpace(house+" "+street))

	ward := p.District
	if ward == "" {
		ward = p.Locality
	}

	parts = append(parts, ward, p.City)

	var kept []string

	for _, part := range parts {
		if part != "" {
			kept = append(kept, part)
		}
	}

	return strings.Join(kept, ", ")
}

// leadingNumber is the house number typed before the street, such as "12" or "12A" in "12A pho hoa lam".
func leadingNumber(words string) string {
	first, _, found := strings.Cut(strings.TrimSpace(words), " ")
	if !found || first == "" || first[0] < '0' || first[0] > '9' {
		return ""
	}

	return first
}

func ftoa(f float64) string { return strconv.FormatFloat(f, 'f', -1, 64) }

// Places suggests where a store is from the words of its address, for the forms that pin a store: the caller must
// be signed in, so the public search is not an open door. A search that does not answer gives no suggestions, and
// the person writes the address and pins it on the map.
func (s *Service) Places(ctx context.Context, words string) ([]Place, error) {
	if _, err := platform.RequireCaller(ctx); err != nil {
		return nil, err
	}

	found, err := s.places.search(ctx, words)
	if err != nil {
		s.logger.WarnContext(ctx, "places not found",
			slog.String("event", "seller.places.not_found"),
			slog.String("error", err.Error()),
		)

		return []Place{}, nil
	}

	return found, nil
}
