package seller

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

// feature is a Photon feature at a point with the given parts of its address.
func feature(lng, lat float64, name, house, street, district string) photonFeature {
	var f photonFeature

	f.Geometry.Coordinates = []float64{lng, lat}
	f.Properties.Name, f.Properties.HouseNumber, f.Properties.Street = name, house, street
	f.Properties.District, f.Properties.City = district, "Hà Nội"

	return f
}

func TestPlaces(t *testing.T) {
	t.Parallel()

	const hoaLam, vietHung = "Phố Hoa Lâm", "Việt Hưng"

	for name, tc := range map[string]struct {
		features []photonFeature
		number   string
		want     []string
	}{
		"a street, with the house number typed first": {
			features: []photonFeature{feature(105.896, 21.054, hoaLam, "", "", vietHung)},
			number:   "12",
			want:     []string{"12 Phố Hoa Lâm, Việt Hưng, Hà Nội"},
		},
		"a place keeps its own house number and its name": {
			features: []photonFeature{
				feature(105.896, 21.056, "TASCO Mall", "7-9", "Đường Nguyễn Văn Linh", vietHung),
			},
			number: "12",
			want:   []string{"TASCO Mall, 7-9 Đường Nguyễn Văn Linh, Việt Hưng, Hà Nội"},
		},
		"repeats once, outside Hanoi never, at most five": {
			features: []photonFeature{
				feature(105.896, 21.054, hoaLam, "", "", vietHung),
				feature(105.897, 21.055, hoaLam, "", "", vietHung),
				feature(106.680, 20.860, "Phố Hoa Lâm", "", "", "Hải Phòng"),
				feature(105.81, 21.01, "Ngõ 1", "", "", "Láng"),
				feature(105.81, 21.01, "Ngõ 2", "", "", "Láng"),
				feature(105.81, 21.01, "Ngõ 3", "", "", "Láng"),
				feature(105.81, 21.01, "Ngõ 4", "", "", "Láng"),
				feature(105.81, 21.01, "Ngõ 5", "", "", "Láng"),
			},
			want: []string{
				"Phố Hoa Lâm, Việt Hưng, Hà Nội",
				"Ngõ 1, Láng, Hà Nội", "Ngõ 2, Láng, Hà Nội", "Ngõ 3, Láng, Hà Nội", "Ngõ 4, Láng, Hà Nội",
			},
		},
	} {
		t.Run(name, func(t *testing.T) {
			t.Parallel()

			got := places(tc.features, tc.number)
			if len(got) != len(tc.want) {
				t.Fatalf("places = %v, want %v", got, tc.want)
			}

			for i, p := range got {
				if p.Address != tc.want[i] {
					t.Errorf("place %d = %q, want %q", i, p.Address, tc.want[i])
				}
			}
		})
	}
}

func TestLeadingNumber(t *testing.T) {
	t.Parallel()

	for words, want := range map[string]string{
		"12 pho hoa lam": "12", " 12A ngõ 5": "12A", "pho hoa lam": "", "12": "", "ngõ 68 phú diễn": "",
	} {
		if got := leadingNumber(words); got != want {
			t.Errorf("leadingNumber(%q) = %q, want %q", words, got, want)
		}
	}
}

func TestSearchAsksInHanoiWithAUserAgent(t *testing.T) {
	t.Parallel()

	var agent, bbox, q string

	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		agent, bbox, q = r.Header.Get("User-Agent"), r.URL.Query().Get("bbox"), r.URL.Query().Get("q")
		_, _ = w.Write([]byte(`{"features":[{"geometry":{"coordinates":[105.896,21.054]},` +
			`"properties":{"name":"Phố Hoa Lâm","district":"Việt Hưng","city":"Hà Nội"}}]}`))
	}))
	t.Cleanup(server.Close)

	got, err := placeSearch{client: server.Client(), baseURL: server.URL}.search(t.Context(), "12 pho hoa lam")
	if err != nil || len(got) != 1 || got[0].Address != "12 Phố Hoa Lâm, Việt Hưng, Hà Nội" || got[0].Latitude != 21.054 {
		t.Fatalf("search = %v, %v", got, err)
	}

	if agent != userAgent || bbox != "105.25,20.53,106.06,21.42" || q != "12 pho hoa lam" {
		t.Errorf("asked with agent %q, bbox %q and q %q", agent, bbox, q)
	}
}

func TestSearchFailsOnAnErrorStatus(t *testing.T) {
	t.Parallel()

	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusServiceUnavailable)
	}))
	t.Cleanup(server.Close)

	if _, err := (placeSearch{client: server.Client(), baseURL: server.URL}).search(t.Context(), "hoa lam"); err == nil {
		t.Error("a 503 was read as places")
	}
}
