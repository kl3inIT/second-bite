package seller

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestWritten(t *testing.T) {
	t.Parallel()

	const road, hanoi = "road", "Hà Nội"

	for name, tc := range map[string]struct {
		parts   map[string]string
		display string
		want    string
	}{
		"a ward, not the quarter inside it": {
			parts: map[string]string{
				road: "Ngõ 68 Đường Phú Diễn", "quarter": "Kẻ Diễn", "suburb": "Phường Phú Diễn",
				"city": hanoi, "country": "Việt Nam",
			},
			want: "Ngõ 68 Đường Phú Diễn, Phường Phú Diễn, Hà Nội",
		},
		"a house in the old quarter": {
			parts: map[string]string{
				"house_number": "79", road: "Phố Đinh Tiên Hoàng", "quarter": "Khu phố cổ",
				"suburb": "Phường Hoàn Kiếm", "city": hanoi,
			},
			want: "79 Phố Đinh Tiên Hoàng, Phường Hoàn Kiếm, Hà Nội",
		},
		"a commune given as a city district, under hamlets": {
			parts: map[string]string{
				road: "Đường Bát Tràng", "residential": "Gốm Bát Tràng", "hamlet": "Thôn 1",
				"city_district": "Xã Bát Tràng", "city": hanoi,
			},
			want: "Đường Bát Tràng, Xã Bát Tràng, Hà Nội",
		},
		"a place without a ward's name stands for it": {
			parts: map[string]string{road: "Đường Láng", "suburb": "Láng Thượng", "state": hanoi},
			want:  "Đường Láng, Láng Thượng, Hà Nội",
		},
		"only the service's line": {
			display: "Tòa nhà A, Khu đô thị, 100000, Việt Nam",
			want:    "Tòa nhà A, Khu đô thị",
		},
	} {
		t.Run(name, func(t *testing.T) {
			t.Parallel()

			if got := written(tc.parts, tc.display); got != tc.want {
				t.Errorf("written = %q, want %q", got, tc.want)
			}
		})
	}
}

func TestReverseAsksWithAUserAgent(t *testing.T) {
	t.Parallel()

	var agent, lat string

	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		agent, lat = r.Header.Get("User-Agent"), r.URL.Query().Get("lat")
		_, _ = w.Write([]byte(`{"display_name":"x","address":{"road":"Đường Láng","city":"Hà Nội"}}`))
	}))
	t.Cleanup(server.Close)

	got, err := geocoder{client: server.Client(), baseURL: server.URL}.reverse(t.Context(), 21.0367, 105.7818)
	if err != nil || got != "Đường Láng, Hà Nội" {
		t.Fatalf("reverse = %q, %v", got, err)
	}

	if agent != userAgent || lat != "21.036700" {
		t.Errorf("asked with agent %q and lat %q", agent, lat)
	}
}

func TestReverseFailsOnAnErrorStatus(t *testing.T) {
	t.Parallel()

	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusTooManyRequests)
	}))
	t.Cleanup(server.Close)

	if _, err := (geocoder{client: server.Client(), baseURL: server.URL}).reverse(t.Context(), 21, 105); err == nil {
		t.Error("a 429 was read as an address")
	}
}
