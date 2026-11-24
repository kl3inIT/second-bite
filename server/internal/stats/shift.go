package stats

import (
	"cmp"
	"context"
	"fmt"
	"maps"
	"slices"
	"strings"
	"time"
	"unicode"
	"unicode/utf8"

	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/offer"
	"github.com/kl3inIT/second-bite/server/internal/order"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

const (
	// maxShiftReportDays bounds the days one shift report reads: a tab and a
	// sheet each.
	maxShiftReportDays = 31
	// maxShifts and maxShiftNameRunes bound what an admin sets.
	maxShifts         = 6
	maxShiftNameRunes = 40
	// shiftPageSize is how many orders one read of the range takes.
	shiftPageSize = 100
)

// ErrShiftRangeInvalid refuses a range of a shift report that ends before it
// starts, after today, or holds more than 31 days.
var ErrShiftRangeInvalid = platform.NewFailure("REPORT_SHIFT_RANGE_INVALID", platform.CategoryValidation, platform.Words{
	VI: "Khoảng ngày không hợp lệ: ngày bắt đầu không sau ngày kết thúc, ngày kết thúc không sau hôm nay, và tối đa 31 ngày.",
	EN: "The range of days is not valid: it starts no later than it ends, ends no later than today and holds at most 31 days.",
})

// ErrShiftsInvalid refuses shifts that break the rules: one to six, each a
// name of 1 to 40 characters and hours from 00:00 to 24:00 that start before
// they end, in order and without overlap.
var ErrShiftsInvalid = platform.NewFailure("REPORT_SHIFTS_INVALID", platform.CategoryValidation, platform.Words{
	VI: "Ca không hợp lệ: 1 đến 6 ca, mỗi ca có tên 1 đến 40 ký tự và giờ từ 00:00 đến 24:00, giờ bắt đầu trước giờ kết thúc, xếp theo thứ tự và không chồng nhau.",
	EN: "The shifts are not valid: one to six, each with a name of 1 to 40 characters and hours from 00:00 to 24:00 that start before they end, in order and not overlapping.",
})

// Shift is a named part of every day in Vietnam, [From, Until) as HH:MM, that
// the shift report cuts each day by.
type Shift struct {
	Name string
	platform.Clock
}

// DefaultShifts are the three shifts a report has when none is asked.
func DefaultShifts() []Shift {
	return []Shift{
		{Name: "Ca sáng", From: "06:00", Until: "12:00"},
		{Name: "Ca chiều", From: "12:00", Until: "18:00"},
		{Name: "Ca tối", From: "18:00", Until: "24:00"},
	}
}

// ParseShifts reads shifts written HH:MM-HH:MM,Name, the default three when
// none is given, and refuses any that break the rules of ErrShiftsInvalid.
func ParseShifts(values []string) ([]Shift, error) {
	if len(values) == 0 {
		return DefaultShifts(), nil
	}

	if len(values) > maxShifts {
		return nil, ErrShiftsInvalid
	}

	shifts := make([]Shift, 0, len(values))

	for _, v := range values {
		span, name, ok := strings.Cut(v, ",")
		from, until, hasDash := strings.Cut(span, "-")
		name = strings.TrimSpace(name)

		clock, valid := platform.ParseClock(from, until)
		if !ok || !hasDash || !valid || clock.IsZero() || !validName(name) {
			return nil, ErrShiftsInvalid
		}

		if n := len(shifts); n > 0 && clock.From < shifts[n-1].Until { // HH:MM compares as text
			return nil, ErrShiftsInvalid
		}

		shifts = append(shifts, Shift{Name: name, Clock: clock})
	}

	return shifts, nil
}

// validName is true for 1 to 40 characters with no control character.
func validName(name string) bool {
	n := utf8.RuneCountInString(name)

	return n >= 1 && n <= maxShiftNameRunes && !strings.ContainsFunc(name, unicode.IsControl)
}

// holds tells whether the shift keeps an instant, by the time of day in
// Vietnam, as the queries keep what starts in a Clock.
func (s Shift) holds(t time.Time) bool {
	at := t.In(vietnam).Format("15:04")

	return at >= s.From && at < s.Until
}

// ShiftFilter is what an admin reads the shift report by: days in Vietnam,
// both included, the shifts to cut them by, and one store or all of them.
type ShiftFilter struct {
	Since, Until time.Time
	Shifts       []Shift
	SellerID     *uuid.UUID
}

// ShiftSummary are the numbers of a shift, or of a day.
type ShiftSummary struct {
	// Stores are those with a post or an order in it.
	Stores int
	// UnitsPosted are the units of the offers posted for it, whatever became
	// of them.
	UnitsPosted int
	// Orders counts every order, however it ended; UnitsCollected are the
	// units handed over and UnitsNotCollected those the store refused or whose
	// window ended without a hand-over.
	Orders, UnitsCollected, UnitsNotCollected int
}

// ShiftOrder is an order as a shift lists it, with its buyer.
type ShiftOrder struct {
	Number                 int64
	Store, Customer, Phone string
	Dishes                 string
	Units                  int
	OrderedAt              time.Time
	WindowStart, WindowEnd time.Time
	Status                 order.Status
	sellerID               uuid.UUID
}

// ShiftBlock is a shift of a day with its numbers and its orders, by window.
type ShiftBlock struct {
	Shift
	Summary ShiftSummary
	Orders  []ShiftOrder
}

// ShiftDay is a day with the numbers of the whole day, whatever the shifts,
// and each shift.
type ShiftDay struct {
	Day     time.Time
	Summary ShiftSummary
	Shifts  []ShiftBlock
}

// ShiftReport is the admin's report by shift (SEC-209): every day of the
// range with its summary and its shifts, and the range's totals.
type ShiftReport struct {
	Since, Until time.Time
	Shifts       []Shift
	Totals       ShiftSummary
	Days         []ShiftDay
}

// ShiftReport reads the days of f for an admin, each cut into f's shifts. An
// order and a post belong to the shift holding the start of their window; one
// outside every shift is counted in its day alone.
func (s *Service) ShiftReport(ctx context.Context, f ShiftFilter) (ShiftReport, error) {
	if _, err := platform.RequireAdmin(ctx); err != nil {
		return ShiftReport{}, err
	}

	if f.Until.Before(f.Since) || f.Until.After(dayOf(s.now())) || f.Until.Sub(f.Since) >= maxShiftReportDays*24*time.Hour {
		return ShiftReport{}, ErrShiftRangeInvalid
	}

	if _, err := ParseShifts(shiftValues(f.Shifts)); err != nil || len(f.Shifts) == 0 {
		return ShiftReport{}, ErrShiftsInvalid
	}

	since := time.Date(f.Since.Year(), f.Since.Month(), f.Since.Day(), 0, 0, 0, 0, vietnam)
	until := time.Date(f.Until.Year(), f.Until.Month(), f.Until.Day()+1, 0, 0, 0, 0, vietnam)

	orders, err := s.shiftOrders(ctx, f, since, until)
	if err != nil {
		return ShiftReport{}, err
	}

	dayPosts, err := s.offers.PostDays(ctx, since, until, f.SellerID, platform.Clock{})
	if err != nil {
		return ShiftReport{}, err
	}

	shiftPosts := make([][]offer.PostDay, len(f.Shifts))

	for i, sh := range f.Shifts {
		if shiftPosts[i], err = s.offers.PostDays(ctx, since, until, f.SellerID, sh.Clock); err != nil {
			return ShiftReport{}, err
		}
	}

	return buildShiftReport(f, orders, dayPosts, shiftPosts), nil
}

// shiftOrders reads every order whose window starts in [since, until), page
// by page.
func (s *Service) shiftOrders(ctx context.Context, f ShiftFilter, since, until time.Time) ([]order.Order, error) {
	var all []order.Order

	filter := order.AdminFilter{CollectSince: &since, CollectUntil: &until, Size: shiftPageSize}
	if f.SellerID != nil {
		filter.SellerID = *f.SellerID
	}

	for page := 1; ; page++ {
		filter.Page = page

		got, err := s.orders.ListForAdmins(ctx, filter)
		if err != nil {
			return nil, fmt.Errorf("reading the orders of the shift report: %w", err)
		}

		all = append(all, got.Orders...)

		if len(got.Orders) < shiftPageSize || len(all) >= got.Total {
			return all, nil
		}
	}
}

// shiftValues writes shifts as ParseShifts reads them.
func shiftValues(shifts []Shift) []string {
	values := make([]string, len(shifts))
	for i, sh := range shifts {
		values[i] = sh.From + "-" + sh.Until + "," + sh.Name
	}

	return values
}

// tally adds an order and a post to a summary under construction.
type tally struct {
	stores map[uuid.UUID]struct{}
	sum    ShiftSummary
}

func newTally() *tally { return &tally{stores: map[uuid.UUID]struct{}{}} }

func (t *tally) post(p offer.PostDay) {
	t.stores[p.SellerID] = struct{}{}
	t.sum.UnitsPosted += p.Units
}

func (t *tally) order(o ShiftOrder) {
	t.stores[o.sellerID] = struct{}{}
	t.sum.Orders++

	switch o.Status {
	case order.StatusCollected:
		t.sum.UnitsCollected += o.Units
	case order.StatusRefused, order.StatusExpired:
		t.sum.UnitsNotCollected += o.Units
	case order.StatusConfirmed, order.StatusReady, order.StatusCancelled:
		// Open, or the customer's own doing: in neither.
	}
}

func (t *tally) summary() ShiftSummary {
	t.sum.Stores = len(t.stores)

	return t.sum
}

// cut is a day under construction: its numbers and its shifts'.
type cut struct {
	day    ShiftDay
	whole  *tally
	shifts []*tally
}

func newCut(d time.Time, shifts []Shift) *cut {
	c := &cut{
		day:    ShiftDay{Day: d, Shifts: make([]ShiftBlock, len(shifts))},
		whole:  newTally(),
		shifts: make([]*tally, len(shifts)),
	}

	for i, sh := range shifts {
		c.day.Shifts[i] = ShiftBlock{Shift: sh}
		c.shifts[i] = newTally()
	}

	return c
}

// order counts o in its day and in the shift holding its window's start, if
// any.
func (c *cut) order(o ShiftOrder) {
	c.whole.order(o)

	for i, sh := range c.day.Shifts {
		if sh.holds(o.WindowStart) {
			c.day.Shifts[i].Orders = append(c.day.Shifts[i].Orders, o)
			c.shifts[i].order(o)

			return
		}
	}
}

// finish sums the day and orders each shift's orders.
func (c *cut) finish() ShiftDay {
	c.day.Summary = c.whole.summary()

	for i := range c.day.Shifts {
		c.day.Shifts[i].Summary = c.shifts[i].summary()
		slices.SortFunc(c.day.Shifts[i].Orders, compareShiftOrders)
	}

	return c.day
}

// buildShiftReport cuts the orders and the posts into the days and shifts of
// f. It is pure: the service reads, this decides.
func buildShiftReport(f ShiftFilter, orders []order.Order, dayPosts []offer.PostDay, shiftPosts [][]offer.PostDay) ShiftReport {
	r := ShiftReport{Since: f.Since, Until: f.Until, Shifts: f.Shifts}
	cuts := map[time.Time]*cut{}

	for d := f.Since; !d.After(f.Until); d = d.AddDate(0, 0, 1) {
		cuts[d] = newCut(d, f.Shifts)
	}

	for _, p := range dayPosts {
		if c, ok := cuts[p.Day]; ok {
			c.whole.post(p)
		}
	}

	for i, posts := range shiftPosts {
		for _, p := range posts {
			if c, ok := cuts[p.Day]; ok {
				c.shifts[i].post(p)
			}
		}
	}

	for _, o := range orders {
		if c, ok := cuts[dayOf(o.WindowStart)]; ok {
			c.order(shiftOrderOf(o))
		}
	}

	total := newTally()

	for d := f.Since; !d.After(f.Until); d = d.AddDate(0, 0, 1) {
		c := cuts[d]
		day := c.finish()
		maps.Copy(total.stores, c.whole.stores)
		total.sum.UnitsPosted += day.Summary.UnitsPosted
		total.sum.Orders += day.Summary.Orders
		total.sum.UnitsCollected += day.Summary.UnitsCollected
		total.sum.UnitsNotCollected += day.Summary.UnitsNotCollected

		r.Days = append(r.Days, day)
	}

	r.Totals = total.summary()

	return r
}

// compareShiftOrders puts a shift's orders by window, then by number.
func compareShiftOrders(a, b ShiftOrder) int {
	return cmp.Or(a.WindowStart.Compare(b.WindowStart), cmp.Compare(a.Number, b.Number))
}

// shiftOrderOf is o as a shift lists it: its dishes in words, its units added.
func shiftOrderOf(o order.Order) ShiftOrder {
	dishes := make([]string, len(o.Lines))
	units := 0

	for i, l := range o.Lines {
		dishes[i] = l.Name
		if l.Units > 1 {
			dishes[i] = fmt.Sprintf("%s ×%d", l.Name, l.Units)
		}

		units += l.Units
	}

	return ShiftOrder{
		Number: o.Number, Store: o.SellerName, Customer: o.Contact.Name, Phone: o.Contact.Phone,
		Dishes: strings.Join(dishes, ", "), Units: units, OrderedAt: o.CreatedAt,
		WindowStart: o.WindowStart, WindowEnd: o.WindowEnd, Status: o.Status, sellerID: o.SellerID,
	}
}
