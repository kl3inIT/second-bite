package platform_test

import (
	"testing"

	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// evening and night bound the range most cases read.
const (
	evening = "17:30"
	night   = "21:15"
)

func TestParseClock(t *testing.T) {
	t.Parallel()

	for _, c := range []struct {
		from, until string
		ok          bool
	}{
		{"", "", true},
		{evening, night, true},
		{"00:00", "24:00", true},
		{"06:00", "06:01", true},
		{evening, "", false},
		{"", night, false},
		{night, evening, false},
		{evening, evening, false},
		{"24:00", "24:00", false},
		{"7:30", night, false},
		{"17:60", night, false},
		{evening, "24:01", false},
	} {
		clock, ok := platform.ParseClock(c.from, c.until)
		if ok != c.ok {
			t.Errorf("ParseClock(%q, %q) ok = %v, want %v", c.from, c.until, ok, c.ok)
		}

		from, until := clock.Bounds()
		if ok && (from.Valid != !clock.IsZero() || from.String != c.from || until.String != c.until) {
			t.Errorf("ParseClock(%q, %q) bounds %v %v", c.from, c.until, from, until)
		}
	}
}
