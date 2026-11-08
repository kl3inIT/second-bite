package order_test

import (
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
// settings.
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
		{"orders of different dishes at once cannot pass the cap", testOpenPerPhoneAtOnceAcrossDishes},
		{"one key sent twice at once answers its order", testSameKeyAtOnce},
		{"a reopened order is not held to a lowered cap", testReopenAboveCap},
		{"missed orders stop a phone number for some days", testMissedOrders},
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

// testOpenPerPhoneAtOnceAcrossDishes places at once orders of different
// dishes of one store, so no offer's row lines them up and only the phone
// number's lock keeps them under the cap (SEC-205).
func testOpenPerPhoneAtOnceAcrossDishes(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	shop := f.shop(owner, t, "La Paris")
	dishes := make([]offer.Offer, 4)

	for i, name := range []string{"Croissant", "Bánh mì", "Pain au chocolat", "Brioche"} {
		dishes[i] = f.post(owner, t, shop, name, 10, 20_000, time.Now())
	}

	errs := make([]error, len(dishes))

	var wg sync.WaitGroup

	for i, dish := range dishes {
		wg.Go(func() {
			_, errs[i] = f.orders.Place(t.Context(), key(), uuid.Nil, f.someone, []order.Wanted{{dish.ID, 1}})
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

	if placed != 2 {
		t.Errorf("%d of four orders of different dishes placed at once, want 2", placed)
	}
}

// testSameKeyAtOnce sends one key twice at once for a phone number that holds
// one open order: both answer the one order placed, and neither is refused
// for the cap the first one filled (SEC-205).
func testSameKeyAtOnce(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	shop := f.shop(owner, t, "La Paris")
	croissant := f.post(owner, t, shop, "Croissant", 10, 20_000, time.Now())

	if _, err := f.orders.Place(t.Context(), key(), uuid.Nil, f.someone, []order.Wanted{{croissant.ID, 1}}); err != nil {
		t.Fatal(err)
	}

	k := key()
	ids := make([]uuid.UUID, 2)
	errs := make([]error, 2)

	var wg sync.WaitGroup

	for i := range ids {
		wg.Go(func() {
			var o order.Order

			o, errs[i] = f.orders.Place(t.Context(), k, uuid.Nil, f.someone, []order.Wanted{{croissant.ID, 1}})
			ids[i] = o.ID
		})
	}

	wg.Wait()

	if errs[0] != nil || errs[1] != nil || ids[0] != ids[1] {
		t.Errorf("one key sent twice at once: %v, %v; orders %s and %s", errs[0], errs[1], ids[0], ids[1])
	}

	if got := f.unitsLeft(owner, t, croissant.ID); got != 8 {
		t.Errorf("units left after one key sent twice: %d, want 8", got)
	}
}

// testReopenAboveCap reopens a refused order larger than the dish's cap of
// today: the order met the cap of its day, and a reopening corrects the
// store's refusal; it still needs the units (SEC-205).
func testReopenAboveCap(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	shop := f.shop(owner, t, "La Paris")
	croissant := f.post(owner, t, shop, "Croissant", 10, 20_000, time.Now())
	eight, five := 8, 5

	if _, err := f.offers.Change(owner, croissant.ID, offer.Change{MaxPerOrder: &eight}); err != nil {
		t.Fatal(err)
	}

	o, err := f.orders.Place(t.Context(), key(), uuid.Nil, f.someone, []order.Wanted{{croissant.ID, 8}})
	if err != nil {
		t.Fatal(err)
	}

	if _, err := f.orders.Refuse(owner, o.ID, order.RefuseNoShow, ""); err != nil {
		t.Fatal(err)
	}

	if _, err := f.offers.Change(owner, croissant.ID, offer.Change{MaxPerOrder: &five}); err != nil {
		t.Fatal(err)
	}

	other := order.Contact{Name: "Hoa", Phone: phoneOf(t)}

	taken, err := f.orders.Place(t.Context(), key(), uuid.Nil, other, []order.Wanted{{croissant.ID, 5}})
	if err != nil {
		t.Fatal(err)
	}

	_, err = f.orders.Reopen(owner, o.ID)
	mustFail(t, "reopening when the units are gone", err, order.ErrOfferSoldOut)

	if _, err := f.orders.Cancel(t.Context(), taken.ID, taken.Access, ""); err != nil {
		t.Fatal(err)
	}

	back, err := f.orders.Reopen(owner, o.ID)
	if err != nil || back.Status != order.StatusConfirmed {
		t.Fatalf("eight reopened under a cap of five: %+v, %v", back, err)
	}
}

func testMissedOrders(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	shop := f.shop(owner, t, "La Paris")
	croissant := f.post(owner, t, shop, "Croissant", 10, 20_000, time.Now())

	missed := make([]uuid.UUID, 3)

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
	mustFail(t, "three orders missed in thirty days", err, order.ErrPhoneMissedOrders)

	// A month on, the oldest of the three leaves the thirty days.
	f.shift(t, missed[0], -30*24*time.Hour)

	if _, err := f.orders.Place(t.Context(), key(), uuid.Nil, f.someone, []order.Wanted{{croissant.ID, 1}}); err != nil {
		t.Errorf("two orders missed in thirty days: %v", err)
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
	if err != nil || set.OpenPerPhonePerSeller != 2 || set.MissedLimit != 3 || set.MissedDays != 30 {
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
