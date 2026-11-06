package order_test

import (
	"context"
	"errors"
	"sync"
	"testing"
	"time"

	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/audit"
	"github.com/kl3inIT/second-bite/server/internal/offer"
	"github.com/kl3inIT/second-bite/server/internal/order"
	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/platform/platformtest"
)

// TestOrderLimits checks the limits on what one person holds (SEC-158) with
// the settings' first values, in a database of its own: TestOrder widens them
// for its checks. The checks run one after another, as one changes the
// settings. The limit by address is checked over HTTP, where a request has
// one (cmd/secondbite).
func TestOrderLimits(t *testing.T) {
	t.Parallel()

	pool := platformtest.StartPostgres(t)

	for _, c := range []struct { //nolint:paralleltest // one check changes the settings the others place under
		name  string
		check func(*testing.T, fixture)
	}{
		{"a dish's cap bounds one order", testDishCap},
		{"a phone number holds two orders at a store", testOpenPerPhone},
		{"two orders at once cannot pass the cap", testOpenPerPhoneAtOnce},
		{"missed orders stop a phone number for some days", testMissedOrders},
		{"a suspected order gives its units back and counts as missed", testSuspected},
		{"a large order is marked for its store", testLargeOrder},
		{"admins change the limits", testOrderSettings},
	} {
		t.Run(c.name, func(t *testing.T) {
			c.check(t, newFixture(t, pool))
		})
	}
}

func testDishCap(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	shop := f.shop(owner, t, "La Paris")
	croissant := f.post(owner, t, shop, "Croissant", 20, 20_000, time.Now())

	if croissant.PerOrderMax != 5 || croissant.MaxPerOrder != nil {
		t.Fatalf("a post without a cap: %d, own %v, want the default 5", croissant.PerOrderMax, croissant.MaxPerOrder)
	}

	_, err := f.orders.Place(t.Context(), key(), uuid.Nil, f.someone, []order.Wanted{{croissant.ID, 6}})
	mustFail(t, "six of a dish capped at five", err, order.ErrOverDishLimit)

	if got := f.unitsLeft(owner, t, croissant.ID); got != 20 {
		t.Errorf("units left after a refusal: %d", got)
	}

	eight := 8

	capped, err := f.offers.Change(owner, croissant.ID, offer.Change{MaxPerOrder: &eight})
	if err != nil || capped.PerOrderMax != 8 || capped.MaxPerOrder == nil || *capped.MaxPerOrder != 8 {
		t.Fatalf("the store's cap above the default: %+v, %v", capped, err)
	}

	if _, err := f.orders.Place(t.Context(), key(), uuid.Nil, f.someone, []order.Wanted{{croissant.ID, 8}}); err != nil {
		t.Fatalf("eight under the store's cap of eight: %v", err)
	}

	other := order.Contact{Name: "Hoa", Phone: phoneOf(t)}
	_, err = f.orders.Place(t.Context(), key(), uuid.Nil, other, []order.Wanted{{croissant.ID, 9}})
	mustFail(t, "nine under the store's cap of eight", err, order.ErrOverDishLimit)

	zero := 0

	back, err := f.offers.Change(owner, croissant.ID, offer.Change{MaxPerOrder: &zero})
	if err != nil || back.PerOrderMax != 5 || back.MaxPerOrder != nil {
		t.Errorf("the cap taken away: %+v, %v", back, err)
	}
}

func testOpenPerPhone(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	paris := f.shop(owner, t, "La Paris")
	panda := f.shop(owner, t, "Panda Chef")
	croissant := f.post(owner, t, paris, "Croissant", 10, 20_000, time.Now())
	dumpling := f.post(owner, t, panda, "Há cảo", 10, 25_000, time.Now())

	first, err := f.orders.Place(t.Context(), key(), uuid.Nil, f.someone, []order.Wanted{{croissant.ID, 1}})
	if err != nil {
		t.Fatal(err)
	}

	if _, err := f.orders.Place(t.Context(), key(), uuid.Nil, f.someone, []order.Wanted{{croissant.ID, 1}}); err != nil {
		t.Fatal(err)
	}

	_, err = f.orders.Place(t.Context(), key(), uuid.Nil, f.someone, []order.Wanted{{croissant.ID, 1}})
	mustFail(t, "a third open order at one store", err, order.ErrPhoneHoldsOrders)

	if _, err := f.orders.Place(t.Context(), key(), uuid.Nil, f.someone, []order.Wanted{{dumpling.ID, 1}}); err != nil {
		t.Errorf("an order at another store: %v", err)
	}

	if _, err := f.orders.Cancel(t.Context(), first.ID, first.Access, ""); err != nil {
		t.Fatal(err)
	}

	if _, err := f.orders.Place(t.Context(), key(), uuid.Nil, f.someone, []order.Wanted{{croissant.ID, 1}}); err != nil {
		t.Errorf("an order once one was cancelled: %v", err)
	}
}

func testOpenPerPhoneAtOnce(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	shop := f.shop(owner, t, "La Paris")
	croissant := f.post(owner, t, shop, "Croissant", 10, 20_000, time.Now())

	if _, err := f.orders.Place(t.Context(), key(), uuid.Nil, f.someone, []order.Wanted{{croissant.ID, 1}}); err != nil {
		t.Fatal(err)
	}

	errs := make([]error, 4)

	var wg sync.WaitGroup

	for i := range errs {
		wg.Go(func() {
			_, errs[i] = f.orders.Place(t.Context(), key(), uuid.Nil, f.someone, []order.Wanted{{croissant.ID, 1}})
		})
	}

	wg.Wait()

	placed := 0

	for _, err := range errs {
		switch {
		case err == nil:
			placed++
		case !errors.Is(err, order.ErrPhoneHoldsOrders):
			t.Errorf("placing at once: %v", err)
		}
	}

	if placed != 1 {
		t.Errorf("%d of four orders placed at once beside one open, want 1", placed)
	}
}

func testMissedOrders(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	shop := f.shop(owner, t, "La Paris")
	croissant := f.post(owner, t, shop, "Croissant", 10, 20_000, time.Now())

	missed := make([]uuid.UUID, 2)

	for i := range missed {
		o, err := f.orders.Place(t.Context(), key(), uuid.Nil, f.someone, []order.Wanted{{croissant.ID, 1}})
		if err != nil {
			t.Fatal(err)
		}

		// Its window ended yesterday, and nobody came.
		f.shift(t, o.ID, -26*time.Hour)
		missed[i] = o.ID
	}

	_, err := f.orders.Place(t.Context(), key(), uuid.Nil, f.someone, []order.Wanted{{croissant.ID, 1}})
	mustFail(t, "two orders missed in seven days", err, order.ErrPhoneMissedOrders)

	// A week on, the older of the two leaves the seven days.
	f.shift(t, missed[0], -7*24*time.Hour)

	if _, err := f.orders.Place(t.Context(), key(), uuid.Nil, f.someone, []order.Wanted{{croissant.ID, 1}}); err != nil {
		t.Errorf("one order missed in seven days: %v", err)
	}
}

func testSuspected(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	shop := f.shop(owner, t, "La Paris")
	croissant := f.post(owner, t, shop, "Croissant", 10, 20_000, time.Now())

	for range 2 {
		o, err := f.orders.Place(t.Context(), key(), uuid.Nil, f.someone, []order.Wanted{{croissant.ID, 4}})
		if err != nil {
			t.Fatal(err)
		}

		refused, err := f.orders.Refuse(owner, o.ID, order.RefuseSuspected, "")
		if err != nil || refused.RefuseReason != order.RefuseSuspected {
			t.Fatalf("refused as suspected: %+v, %v", refused, err)
		}
	}

	if got := f.unitsLeft(owner, t, croissant.ID); got != 10 {
		t.Errorf("units left after two suspected orders: %d, want 10", got)
	}

	_, err := f.orders.Place(t.Context(), key(), uuid.Nil, f.someone, []order.Wanted{{croissant.ID, 1}})
	mustFail(t, "a phone number with two suspected orders", err, order.ErrPhoneMissedOrders)
}

func testLargeOrder(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	shop := f.shop(owner, t, "La Paris")
	now := time.Now()
	croissant := f.post(owner, t, shop, "Croissant", 20, 20_000, now)
	bread := f.post(owner, t, shop, "Bánh mì", 3, 15_000, now)
	cake := f.post(owner, t, shop, "Bánh bông lan", 1, 30_000, now)

	for _, c := range []struct {
		what   string
		wanted []order.Wanted
		large  bool
	}{
		{"two of twenty, under the cap", []order.Wanted{{croissant.ID, 2}}, false},
		{"five of twenty, the cap", []order.Wanted{{croissant.ID, 5}}, true},
		{"two of three, more than half", []order.Wanted{{bread.ID, 2}}, true},
		{"the only one, a single unit", []order.Wanted{{cake.ID, 1}}, false},
	} {
		who := order.Contact{Name: "Ngọc", Phone: phoneOf(t)}

		placed, err := f.orders.Place(t.Context(), key(), uuid.Nil, who, c.wanted)
		if err != nil {
			t.Fatalf("%s: %v", c.what, err)
		}

		if placed.Large || placed.Phone != nil {
			t.Errorf("%s: the customer reads large %v, phone %+v", c.what, placed.Large, placed.Phone)
		}

		read, err := f.orders.Get(owner, placed.ID, "")
		if err != nil {
			t.Fatal(err)
		}

		if read.Large != c.large || read.Phone == nil || read.Phone.Open != 1 || read.Phone.Missed != 0 {
			t.Errorf("%s: the store reads large %v, phone %+v, want large %v", c.what, read.Large, read.Phone, c.large)
		}
	}

	checkLargeListed(owner, t, f, shop, now)
}

// checkLargeListed checks the store's list of the day carries each order's
// phone number history and marks the two large orders of testLargeOrder.
func checkLargeListed(owner context.Context, t *testing.T, f fixture, shop uuid.UUID, day time.Time) {
	t.Helper()

	orders, err := f.orders.OfSeller(owner, shop, day)
	if err != nil {
		t.Fatal(err)
	}

	large := 0

	for _, o := range orders {
		if o.Phone == nil {
			t.Errorf("listed without its phone number's orders: %s", order.Number(o.Number))
		}

		if o.Large {
			large++
		}
	}

	if large != 2 {
		t.Errorf("large orders on the store's list: %d, want 2", large)
	}
}

func testOrderSettings(t *testing.T, f fixture) {
	t.Helper()

	admin := f.as(t, "admin", platform.RoleAdmin)
	owner := f.as(t, "owner", platform.RoleCustomer)

	if _, err := f.orders.Settings(owner); err == nil {
		t.Error("a store's owner read the order settings")
	}

	set, err := f.orders.Settings(admin)
	if err != nil || set.OpenPerPhonePerSeller != 2 || set.OpenPerAddress != 20 || set.MissedLimit != 2 || set.MissedDays != 7 {
		t.Fatalf("the first settings: %+v, %v", set, err)
	}

	bad := set
	bad.MissedDays = 61
	_, err = f.orders.SaveSettings(admin, bad, set.UpdatedAt)
	mustFail(t, "61 days", err, order.ErrSettingsInvalid)

	next := set
	next.OpenPerPhonePerSeller = 3

	saved, err := f.orders.SaveSettings(admin, next, set.UpdatedAt)
	if err != nil || saved.OpenPerPhonePerSeller != 3 {
		t.Fatalf("saving three per phone number: %+v, %v", saved, err)
	}

	_, err = f.orders.SaveSettings(admin, next, set.UpdatedAt)
	mustFail(t, "a save at the version read before", err, platform.ErrChangedSinceRead)

	page, err := f.trail.List(admin, audit.Filter{Actions: []string{"order_settings.change"}, Page: 1, Size: 10})
	if err != nil || len(page.Events) != 1 || page.Events[0].Action != "order_settings.change" {
		t.Errorf("the audit trail: %+v, %v", page, err)
	}

	// Back to the first values for the checks that follow.
	if _, err := f.orders.SaveSettings(admin, set, saved.UpdatedAt); err != nil {
		t.Fatal(err)
	}
}
