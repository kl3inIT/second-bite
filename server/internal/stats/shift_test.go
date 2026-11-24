package stats

import (
	"errors"
	"strings"
	"testing"
	"time"

	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/offer"
	"github.com/kl3inIT/second-bite/server/internal/order"
)

// TestParseShifts keeps the shifts that follow the rules and refuses the
// rest: one to six, a name of 1 to 40 characters, hours from 00:00 to 24:00
// that start before they end, in order and without overlap.
func TestParseShifts(t *testing.T) {
	t.Parallel()

	if got, err := ParseShifts(nil); err != nil || len(got) != 3 || got[0].Name != "Ca sáng" || got[2].Until != "24:00" {
		t.Fatalf("no shifts gave %v, %v; want the three defaults", got, err)
	}

	got, err := ParseShifts([]string{"06:30-11:00, Ca  sớm ", "11:00-14:00,Trưa", "20:00-24:00,Đêm"})
	if err != nil || len(got) != 3 || got[0].Name != "Ca  sớm" || got[0].From != "06:30" || got[1].From != "11:00" {
		t.Fatalf("shifts read as %v, %v; touching ends and a gap are allowed", got, err)
	}

	tooMany := []string{"00:00-01:00,a", "01:00-02:00,b", "02:00-03:00,c", "03:00-04:00,d", "04:00-05:00,e", "05:00-06:00,f", "06:00-07:00,g"}

	refused := map[string][]string{
		"seven shifts":        tooMany,
		"no comma":            {"06:00-12:00"},
		"no dash":             {"06:00,Ca"},
		"an empty name":       {"06:00-12:00, "},
		"a long name":         {"06:00-12:00," + strings.Repeat("a", 41)},
		"a control in name":   {"06:00-12:00,Ca\tb"},
		"an hour of 25":       {"06:00-25:00,Ca"},
		"ending before start": {"12:00-06:00,Ca"},
		"empty span":          {"12:00-12:00,Ca"},
		"24:00 as a start":    {"24:00-24:00,Ca"},
		"overlap":             {"06:00-12:00,a", "11:59-18:00,b"},
		"out of order":        {"12:00-18:00,a", "06:00-12:00,b"},
		"minutes of 60":       {"06:60-12:00,Ca"},
	}

	for name, values := range refused {
		if _, err := ParseShifts(values); !errors.Is(err, ErrShiftsInvalid) {
			t.Errorf("%s: got %v, want ErrShiftsInvalid", name, err)
		}
	}
}

// TestShiftHolds puts an instant in the shift holding its time of day in
// Vietnam, the end excluded, whatever zone the instant is in.
func TestShiftHolds(t *testing.T) {
	t.Parallel()

	noon := DefaultShifts()[1] // 12:00–18:00

	at := func(h, m int) time.Time { return time.Date(2026, 11, 22, h, m, 0, 0, vietnam) }

	for _, c := range []struct {
		when time.Time
		want bool
	}{
		{at(11, 59), false},
		{at(12, 0), true},
		{at(17, 59), true},
		{at(18, 0), false},
		{at(12, 0).UTC(), true}, // 05:00 UTC is noon in Vietnam
	} {
		if got := noon.holds(c.when); got != c.want {
			t.Errorf("%s in %s–%s: got %t, want %t", c.when.In(vietnam).Format("15:04"), noon.From, noon.Until, got, c.want)
		}
	}

	if night := DefaultShifts()[2]; !night.holds(at(23, 59)) || night.holds(at(0, 0)) {
		t.Error("the night shift holds 23:59 and not midnight's start")
	}
}

var (
	pho, bun = uuid.MustParse("00000000-0000-0000-0000-0000000000a1"), uuid.MustParse("00000000-0000-0000-0000-0000000000a2")
	day      = time.Date(2026, 11, 22, 0, 0, 0, 0, time.UTC)
)

func shiftOrder(number int64, store uuid.UUID, hour, minute int, status order.Status, units ...int) order.Order {
	start := time.Date(2026, 11, 22, hour, minute, 0, 0, vietnam)

	lines := make([]order.Line, len(units))
	for i, u := range units {
		lines[i] = order.Line{Name: "Món", Units: u}
	}

	return order.Order{
		Number: number, SellerID: store, SellerName: "Quán", Contact: order.Contact{Name: "Khách", Phone: "0912345678"},
		Status: status, Lines: lines, WindowStart: start, WindowEnd: start.Add(2 * time.Hour), CreatedAt: start.Add(-time.Hour),
	}
}

// twoShiftDays builds the report of two days from eight orders and the posts
// of the first: the morning, the afternoon with an order of each ending, the
// night, and one before every shift.
func twoShiftDays() ShiftReport {
	f := ShiftFilter{Since: day, Until: day.AddDate(0, 0, 1), Shifts: DefaultShifts()}

	orders := []order.Order{
		shiftOrder(1, pho, 11, 59, order.StatusCollected, 2),   // morning
		shiftOrder(2, pho, 12, 0, order.StatusCollected, 1, 2), // afternoon, 3 portions
		shiftOrder(3, bun, 12, 30, order.StatusRefused, 1),     // afternoon, not collected
		shiftOrder(4, bun, 13, 0, order.StatusExpired, 2),      // afternoon, not collected
		shiftOrder(5, bun, 14, 0, order.StatusCancelled, 4),    // afternoon, in neither
		shiftOrder(6, bun, 15, 0, order.StatusConfirmed, 5),    // afternoon, still open
		shiftOrder(7, pho, 23, 59, order.StatusCollected, 1),   // night
		shiftOrder(8, pho, 3, 0, order.StatusCollected, 1),     // before every shift: the day alone
	}

	posts := []offer.PostDay{{Day: day, SellerID: pho, Units: 10}, {Day: day, SellerID: bun, Units: 7}}
	byShift := [][]offer.PostDay{
		{{Day: day, SellerID: pho, Units: 3}},
		{{Day: day, SellerID: pho, Units: 5}, {Day: day, SellerID: bun, Units: 7}},
		{{Day: day, SellerID: pho, Units: 1}},
	}

	return buildShiftReport(f, orders, posts, byShift)
}

// TestBuildShiftReportNumbers adds the right statuses and posts to the day
// and to each shift, an order in a gap being in its day alone.
func TestBuildShiftReportNumbers(t *testing.T) {
	t.Parallel()

	r := twoShiftDays()

	if len(r.Days) != 2 || !r.Days[0].Day.Equal(day) {
		t.Fatalf("days %v, want the two of the range", r.Days)
	}

	d := r.Days[0]

	if got, want := d.Summary, (ShiftSummary{Stores: 2, UnitsPosted: 17, Orders: 8, UnitsCollected: 2 + 3 + 1 + 1, UnitsNotCollected: 3}); got != want {
		t.Errorf("the day: %+v, want %+v", got, want)
	}

	want := []ShiftSummary{
		{Stores: 1, UnitsPosted: 3, Orders: 1, UnitsCollected: 2},
		{Stores: 2, UnitsPosted: 12, Orders: 5, UnitsCollected: 3, UnitsNotCollected: 3},
		{Stores: 1, UnitsPosted: 1, Orders: 1, UnitsCollected: 1},
	}
	for i, w := range want {
		if got := d.Shifts[i].Summary; got != w {
			t.Errorf("%s: %+v, want %+v", d.Shifts[i].Name, got, w)
		}
	}

	if r.Totals.Orders != 8 || r.Totals.Stores != 2 || r.Totals.UnitsPosted != 17 {
		t.Errorf("totals %+v, want the day's, the second day being empty", r.Totals)
	}
}

// TestBuildShiftReportOrders lists a shift's orders by window and writes
// their dishes; a day without orders has empty shifts.
func TestBuildShiftReportOrders(t *testing.T) {
	t.Parallel()

	r := twoShiftDays()
	afternoon := r.Days[0].Shifts[1].Orders

	if len(afternoon) != 5 || afternoon[0].Number != 2 || afternoon[4].Number != 6 {
		t.Fatalf("the afternoon lists %d orders by window, want 5 from 2 to 6", len(afternoon))
	}

	if got := afternoon[0].Dishes; got != "Món, Món ×2" {
		t.Errorf("dishes written %q, want a ×2 on a line of two portions", got)
	}

	if len(r.Days[1].Shifts[0].Orders) != 0 || r.Days[1].Summary != (ShiftSummary{}) {
		t.Error("a day without orders has empty shifts and a summary of zeroes")
	}
}
