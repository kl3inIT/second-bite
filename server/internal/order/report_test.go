package order_test

import (
	"fmt"
	"math/rand/v2"
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

		o, err := f.orders.Place(customer, key(), uuid.Nil, someone, []order.Wanted{{bread.ID, units}})
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
	days, err := f.orders.OrderDays(t.Context(), since.AddDate(0, 0, -1), until, &shop)
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
		got.Cancelled += d.Cancelled
		got.Expired += d.Expired
	}

	want := order.DayCounts{Held: 4, UnitsHeld: 5, Collected: 1, UnitsCollected: 2, CollectedVND: 40_000, Cancelled: 1, Expired: 1}
	if got != want {
		t.Errorf("counted %+v, want %+v", got, want)
	}

	checkReportReads(t, f, since, until, bread.ID, shop, other)
}

// checkReportReads reads what the report asks of offer and seller: the
// offers and units the store posted, a dish's store and the stores' names.
func checkReportReads(t *testing.T, f fixture, since, until time.Time, bread, shop, other uuid.UUID) {
	t.Helper()

	posts, err := f.offers.PostDays(t.Context(), since, until, nil)
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

// phoneOf is a Vietnamese phone number no other check uses.
func phoneOf(t *testing.T) string {
	t.Helper()

	return fmt.Sprintf("09%08d", rand.IntN(100_000_000))
}
