package order_test

import (
	"fmt"
	"testing"
	"time"

	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/order"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// testReportCounts places orders that end every way and reads them back as
// the admin's report does (SEC-80), with the offers posted and the store's
// name from the modules that own them.
func testReportCounts(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	customer := f.as(t, "customer", platform.RoleCustomer)
	shop := f.shop(owner, t, "Bếp Báo Cáo")
	other := f.shop(owner, t, "Quán Bên Cạnh")

	start := time.Now().Add(-time.Minute)
	bread := f.post(owner, t, shop, "Bánh mì", 6, 20_000, start)
	f.post(owner, t, shop, "Xôi", 4, 15_000, start)
	f.post(owner, t, other, "Phở", 3, 30_000, start)

	place := func(units int) order.Order {
		t.Helper()

		o, err := f.orders.Place(customer, key(), uuid.Nil, f.someone, []order.Wanted{{bread.ID, units}})
		if err != nil {
			t.Fatal(err)
		}

		return o
	}

	collected := place(2)
	if _, err := f.orders.HandOver(owner, collected.ID); err != nil {
		t.Fatal(err)
	}

	cancelled := place(1)
	if _, err := f.orders.Cancel(customer, cancelled.ID, "", "Đặt nhầm"); err != nil {
		t.Fatal(err)
	}

	expired := place(1)
	f.shift(t, expired.ID, -3*time.Hour) // its window is over; still confirmed in the table
	place(1)                             // still open

	day := time.Now().In(time.FixedZone("", 7*60*60))
	since := time.Date(day.Year(), day.Month(), day.Day(), 0, 0, 0, 0, day.Location())
	until := since.AddDate(0, 0, 1)

	// The shifted order may fall on the day before in Vietnam; ask for both.
	days, err := f.orders.OrderDays(t.Context(), since.AddDate(0, 0, -1), until, &shop, platform.Clock{})
	if err != nil {
		t.Fatal(err)
	}

	var got order.DayCounts

	for _, d := range days {
		if d.SellerID != shop {
			t.Errorf("another seller's day %+v", d)
		}

		got.Held += d.Held
		got.UnitsHeld += d.UnitsHeld
		got.Collected += d.Collected
		got.UnitsCollected += d.UnitsCollected
		got.CollectedVND += d.CollectedVND
		got.OriginalVND += d.OriginalVND
		got.DiscountVND += d.DiscountVND
		got.DiscountOrders += d.DiscountOrders
		got.Cancelled += d.Cancelled
		got.Expired += d.Expired
	}

	// The two units collected cost 40.000đ each at the original price; no promotion ran.
	want := order.DayCounts{
		Held: 4, UnitsHeld: 5, Collected: 1, UnitsCollected: 2, CollectedVND: 40_000, OriginalVND: 80_000,
		Cancelled: 1, Expired: 1,
	}
	if got != want {
		t.Errorf("counted %+v, want %+v", got, want)
	}

	checkOfferOutcomes(t, f, since.AddDate(0, 0, -1), until, shop, bread.ID)
	checkClock(t, f, since.AddDate(0, 0, -1), until, shop)
	checkAnalysisReads(t, f, since.AddDate(0, 0, -1), until, shop)

	checkReportReads(t, f, since, until, bread.ID, shop, other)
}

// checkClock keeps the orders by the part of the day their window starts in:
// the whole day written 00:00 to 24:00 keeps the four, and one minute six
// hours from now, which no window starts in, keeps none.
func checkClock(t *testing.T, f fixture, since, until time.Time, shop uuid.UUID) {
	t.Helper()

	count := func(clock platform.Clock) int {
		t.Helper()

		days, err := f.orders.OrderDays(t.Context(), since, until, &shop, clock)
		if err != nil {
			t.Fatal(err)
		}

		held := 0
		for _, d := range days {
			held += d.Held
		}

		return held
	}

	whole, ok := platform.ParseClock("00:00", "24:00")
	if !ok || count(whole) != 4 {
		t.Errorf("the whole day keeps %d orders, want 4", count(whole))
	}

	away := time.Now().Add(6 * time.Hour).In(time.FixedZone("", 7*60*60))

	end := away.Add(time.Minute).Format("15:04")
	if end == "00:00" {
		end = "24:00"
	}

	minute, ok := platform.ParseClock(away.Format("15:04"), end)
	if !ok || count(minute) != 0 {
		t.Errorf("a minute six hours away keeps %d orders, want none", count(minute))
	}
}

// checkOfferOutcomes reads what the orders took of the bread: five units in
// four orders, two of them collected, the latest placed after the first.
func checkOfferOutcomes(t *testing.T, f fixture, since, until time.Time, shop, bread uuid.UUID) {
	t.Helper()

	outcomes, err := f.orders.OfferOutcomes(t.Context(), since, until, &shop, platform.Clock{})
	if err != nil {
		t.Fatal(err)
	}

	held, collected := 0, 0

	for _, o := range outcomes {
		if o.OfferID != bread || o.SellerID != shop || o.LastPlacedAt.IsZero() {
			t.Errorf("an outcome %+v", o)
		}

		held += o.UnitsHeld
		collected += o.UnitsCollected
	}

	if held != 5 || collected != 2 {
		t.Errorf("the bread's units: %d held, %d collected, want 5 and 2", held, collected)
	}

	weights, err := f.offers.WeightsOf(t.Context(), []uuid.UUID{bread})
	if err != nil || len(weights) != 0 {
		t.Errorf("a bread without a weight has none: %v, %v", weights, err)
	}
}

// checkAnalysisReads reads what the analysis asks of order and offer: the
// four orders by slot and how early they were placed, the cancelled and the
// expired one as failures, the one customer who collected once, and the
// store's two posts.
func checkAnalysisReads(t *testing.T, f fixture, since, until time.Time, shop uuid.UUID) {
	t.Helper()

	a, err := f.orders.Analysis(t.Context(), since, until, &shop, platform.Clock{})
	if err != nil {
		t.Fatal(err)
	}

	held, collected := slotTotals(a.Slots)

	lead := a.LeadTimes.UnderHalfHour + a.LeadTimes.UnderHour + a.LeadTimes.UnderThreeHours + a.LeadTimes.OverThreeHours
	if held != 4 || collected != 1 || lead != 4 {
		t.Errorf("slots hold %d orders, %d collected, %d timed; want 4, 1 and 4", held, collected, lead)
	}

	if a.Failures["cancelled"] != 1 || a.Failures["expired"] != 1 || len(a.Failures) != 2 {
		t.Errorf("failures %v, want one cancelled and one expired", a.Failures)
	}

	if a.Visits[1] != 1 || len(a.Visits) != 1 || len(a.Tags) != 0 || len(a.Problems) != 0 {
		t.Errorf("visits %v, tags %v, problems %v", a.Visits, a.Tags, a.Problems)
	}

	checkPostsBetween(t, f, since, until, shop)
}

// slotTotals adds up the orders held and collected of every slot.
func slotTotals(slots []order.Slot) (held, collected int) {
	for _, sl := range slots {
		held += sl.Held
		collected += sl.Collected
	}

	return held, collected
}

// checkPostsBetween reads the store's two posts with their prices.
func checkPostsBetween(t *testing.T, f fixture, since, until time.Time, shop uuid.UUID) {
	t.Helper()

	posts, err := f.offers.PostsBetween(t.Context(), since, until, &shop, platform.Clock{})
	if err != nil || len(posts) != 2 || posts[0].SellerID != shop || posts[0].OriginalPriceVND != 2*posts[0].PriceVND {
		t.Errorf("the store's posts %+v, %v", posts, err)
	}
}

// checkReportReads reads what the report asks of offer and seller: the
// offers and units the store posted, a dish's store and the stores' names.
func checkReportReads(t *testing.T, f fixture, since, until time.Time, bread, shop, other uuid.UUID) {
	t.Helper()

	posts, err := f.offers.PostDays(t.Context(), since, until, nil, platform.Clock{})
	if err != nil {
		t.Fatal(err)
	}

	offers, units := 0, 0

	for _, p := range posts {
		if p.SellerID == shop {
			offers += p.Offers
			units += p.Units
		}
	}

	if offers != 2 || units != 10 {
		t.Errorf("the store posted %d offers of %d units, want 2 of 10", offers, units)
	}

	sellers, err := f.offers.SellersOf(t.Context(), []uuid.UUID{bread, uuid.New()})
	if err != nil || len(sellers) != 1 || sellers[bread] != shop {
		t.Errorf("the offers' sellers %v, %v", sellers, err)
	}

	names, err := f.sellers.NamesOf(t.Context(), []uuid.UUID{shop, other})
	if err != nil || names[shop] != "Bếp Báo Cáo" || names[other] != "Quán Bên Cạnh" {
		t.Errorf("the names %v, %v", names, err)
	}
}

// testFirstOrders counts each phone number once, on the day of its first
// order (SEC-192). The orders are moved 500 days back, where no other check
// places any, so the day holds only these.
func testFirstOrders(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	customer := f.as(t, "customer", platform.RoleCustomer)
	shop := f.shop(owner, t, "Bếp Khách Mới")
	bread := f.post(owner, t, shop, "Bánh mì", 6, 20_000, time.Now().Add(-time.Minute))

	first, second := order.Contact{Name: "An", Phone: phoneOf(t)}, order.Contact{Name: "Bình", Phone: phoneOf(t)}
	back := -500 * 24 * time.Hour

	place := func(who order.Contact, d time.Duration) {
		t.Helper()

		o, err := f.orders.Place(customer, key(), uuid.Nil, who, []order.Wanted{{bread.ID, 1}})
		if err != nil {
			t.Fatal(err)
		}

		f.shift(t, o.ID, d)
	}

	place(first, back)
	place(first, back) // the same customer again on the same day
	place(second, back)
	place(second, back+24*time.Hour) // a later order is not a first

	day := time.Now().Add(back).In(time.FixedZone("", 7*60*60))
	since := time.Date(day.Year(), day.Month(), day.Day(), 0, 0, 0, 0, day.Location())

	days, err := f.orders.FirstOrderDays(t.Context(), since, since.AddDate(0, 0, 2))
	if err != nil {
		t.Fatal(err)
	}

	if len(days) != 1 || days[0].Customers != 2 || !days[0].Day.Equal(time.Date(day.Year(), day.Month(), day.Day(), 0, 0, 0, 0, time.UTC)) {
		t.Errorf("first orders %+v, want two customers on %s", days, since.Format(time.DateOnly))
	}
}

// testReturningCustomers counts the customers of a day by phone number, and
// as returning those with orders handed over on another day before it
// (SEC-200). The orders are moved 600 days back, where no other check places
// any.
func testReturningCustomers(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	customer := f.as(t, "customer", platform.RoleCustomer)
	shop := f.shop(owner, t, "Bếp Khách Quen")
	bread := f.post(owner, t, shop, "Bánh mì", 20, 20_000, time.Now().Add(-time.Minute))

	back := -600 * 24 * time.Hour
	returning, once, twiceOneDay, cancelled, before := order.Contact{Name: "An", Phone: phoneOf(t)},
		order.Contact{Name: "Bình", Phone: phoneOf(t)}, order.Contact{Name: "Chi", Phone: phoneOf(t)},
		order.Contact{Name: "Dũng", Phone: phoneOf(t)}, order.Contact{Name: "Em", Phone: phoneOf(t)}

	place := func(who order.Contact, d time.Duration, collect bool) {
		t.Helper()

		o, err := f.orders.Place(customer, key(), uuid.Nil, who, []order.Wanted{{bread.ID, 1}})
		if err != nil {
			t.Fatal(err)
		}

		if collect {
			if _, err := f.orders.HandOver(owner, o.ID); err != nil {
				t.Fatal(err)
			}
		} else if _, err := f.orders.Cancel(customer, o.ID, "", "Đặt nhầm"); err != nil {
			t.Fatal(err)
		}

		f.shift(t, o.ID, d)
	}

	place(returning, back, true)
	place(returning, back-3*24*time.Hour, true) // came three days before: returning
	place(once, back, true)
	place(twiceOneDay, back, true)
	place(twiceOneDay, back, true)           // twice on one day is one purchase
	place(cancelled, back, false)            // nothing handed over: no customer
	place(before, back-3*24*time.Hour, true) // only before the range

	day := time.Now().Add(back).In(time.FixedZone("", 7*60*60))
	since := time.Date(day.Year(), day.Month(), day.Day(), 0, 0, 0, 0, day.Location())

	got, err := f.orders.CollectedCustomers(t.Context(), since, since.AddDate(0, 0, 1))
	if err != nil {
		t.Fatal(err)
	}

	if want := (order.Customers{Customers: 3, Returning: 1}); got != want {
		t.Errorf("customers %+v, want %+v", got, want)
	}
}

// phoneOf is a Vietnamese phone number no other check uses, drawn from a new
// identifier.
func phoneOf(t *testing.T) string {
	t.Helper()

	return fmt.Sprintf("09%08d", uuid.New().ID()%100_000_000)
}
