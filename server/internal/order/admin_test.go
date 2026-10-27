package order_test

import (
	"testing"
	"time"

	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/order"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// adminOrders are the three orders testAdminsListOrders places at one seller.
type adminOrders struct {
	sellerID                 uuid.UUID
	open, collected, expired order.Order
}

// testAdminsListOrders: an admin lists one seller's orders among every
// seller's, by status, words and the day collected, with the count of each
// status; others may not, and bad filters are refused (SEC-135). The checks
// keep to the seller made here, since other checks order beside them.
func testAdminsListOrders(t *testing.T, f fixture) {
	t.Helper()

	o := placeThreeWays(t, f)
	admin := f.as(t, "admin", platform.RoleAdmin)

	checkAdminsSeeTheSellersOrders(t, f, o)
	checkAdminsListByStatus(t, f, o)
	checkAdminsFindOrdersByWords(t, f, o)

	tomorrow := time.Now().AddDate(0, 0, 1)

	later, err := f.orders.ListForAdmins(admin, order.AdminFilter{SellerID: o.sellerID, CollectSince: &tomorrow, Page: 1, Size: 10})
	if err != nil || later.Total != 0 || later.Counts[order.StatusConfirmed] != 0 {
		t.Errorf("collected from tomorrow: total %d, counts %v, %v", later.Total, later.Counts, err)
	}

	past, err := f.orders.ListForAdmins(admin, order.AdminFilter{SellerID: o.sellerID, Page: 2, Size: 10})
	if err != nil || past.Total != 3 || len(past.Orders) != 0 {
		t.Errorf("a page past the end: total %d, %d orders, %v", past.Total, len(past.Orders), err)
	}

	checkAdminListRefusals(t, f, tomorrow)
}

// placeThreeWays places, at a new seller, an order still open, one handed
// over and one whose window ended.
func placeThreeWays(t *testing.T, f fixture) adminOrders {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	customer := f.as(t, "customer", platform.RoleCustomer)
	sellerID := f.shop(owner, t, "Quán Bánh Cuốn "+f.prefix)
	croissant := f.post(owner, t, sellerID, "Croissant", 9, 20_000, time.Now())

	place := func() order.Order {
		placed, err := f.orders.Place(customer, key(), uuid.Nil, someone, []order.Wanted{{croissant.ID, 1}})
		if err != nil {
			t.Fatal(err)
		}

		return placed
	}

	o := adminOrders{sellerID: sellerID, expired: place(), collected: place(), open: place()}
	f.shift(t, o.expired.ID, -3*time.Hour)

	if _, err := f.orders.HandOver(owner, o.collected.ID); err != nil {
		t.Fatal(err)
	}

	return o
}

// checkAdminsSeeTheSellersOrders: the seller's three orders, the latest
// window first with their lines, counted by status.
func checkAdminsSeeTheSellersOrders(t *testing.T, f fixture, o adminOrders) {
	t.Helper()

	admin := f.as(t, "admin", platform.RoleAdmin)

	all, err := f.orders.ListForAdmins(admin, order.AdminFilter{SellerID: o.sellerID, Page: 1, Size: 10})
	if err != nil || all.Total != 3 || len(all.Orders) != 3 || all.Counts[order.StatusConfirmed] != 1 ||
		all.Counts[order.StatusCollected] != 1 || all.Counts[order.StatusExpired] != 1 {
		t.Fatalf("the seller's orders: total %d, counts %v, %v", all.Total, all.Counts, err)
	}

	if all.Orders[0].ID != o.open.ID || len(all.Orders[0].Lines) != 1 || all.Orders[0].Access != "" ||
		all.Orders[2].ID != o.expired.ID || all.Orders[2].Status != order.StatusExpired {
		t.Errorf("the latest window first, with lines, without access: %+v", all.Orders)
	}
}

// checkAdminsListByStatus: the orders still to collect, and those expired as
// read from the window, while the counts keep every status.
func checkAdminsListByStatus(t *testing.T, f fixture, o adminOrders) {
	t.Helper()

	admin := f.as(t, "admin", platform.RoleAdmin)

	waiting, err := f.orders.ListForAdmins(admin, order.AdminFilter{
		SellerID: o.sellerID, Statuses: []order.Status{order.StatusConfirmed, order.StatusReady}, Page: 1, Size: 10,
	})
	if err != nil || len(waiting.Orders) != 1 || waiting.Orders[0].ID != o.open.ID || waiting.Counts[order.StatusExpired] != 1 {
		t.Errorf("still to collect: %d orders, counts %v, %v", len(waiting.Orders), waiting.Counts, err)
	}

	expired, err := f.orders.ListForAdmins(admin, order.AdminFilter{
		SellerID: o.sellerID, Statuses: []order.Status{order.StatusExpired}, Page: 1, Size: 10,
	})
	if err != nil || len(expired.Orders) != 1 || expired.Orders[0].ID != o.expired.ID {
		t.Errorf("expired, read from the window: %d orders, %v", len(expired.Orders), err)
	}
}

// checkAdminsFindOrdersByWords: by the number with and without SB-, and by
// the seller's name without marks.
func checkAdminsFindOrdersByWords(t *testing.T, f fixture, o adminOrders) {
	t.Helper()

	admin := f.as(t, "admin", platform.RoleAdmin)

	for _, q := range []string{order.Number(o.collected.Number), order.Number(o.collected.Number)[3:]} {
		found, err := f.orders.ListForAdmins(admin, order.AdminFilter{Query: q, SellerID: o.sellerID, Page: 1, Size: 10})
		if err != nil || found.Total != 1 || found.Orders[0].ID != o.collected.ID {
			t.Errorf("by the number %q: total %d, %v", q, found.Total, err)
		}
	}

	byName, err := f.orders.ListForAdmins(admin, order.AdminFilter{Query: "banh cuon " + f.prefix, Page: 1, Size: 10})
	if err != nil || byName.Total != 3 {
		t.Errorf("by the seller's name without marks: total %d, %v", byName.Total, err)
	}
}

// checkAdminListRefusals: only admins list, and bad filters are refused.
func checkAdminListRefusals(t *testing.T, f fixture, tomorrow time.Time) {
	t.Helper()

	admin := f.as(t, "admin", platform.RoleAdmin)

	_, err := f.orders.ListForAdmins(f.as(t, "customer", platform.RoleCustomer), order.AdminFilter{Page: 1, Size: 10})
	mustFail(t, "a customer", err, platform.ErrAdminRequired)

	for what, filter := range map[string]order.AdminFilter{
		"a page of 101":                  {Page: 1, Size: 101},
		"an unknown status":              {Statuses: []order.Status{"on_sale"}, Page: 1, Size: 10},
		"a range that ends as it starts": {CollectSince: &tomorrow, CollectUntil: &tomorrow, Page: 1, Size: 10},
	} {
		_, err := f.orders.ListForAdmins(admin, filter)
		mustFail(t, what, err, order.ErrAdminListInvalid)
	}
}
