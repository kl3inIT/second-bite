package order_test

import (
	"testing"

	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/offer"
	"github.com/kl3inIT/second-bite/server/internal/order"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// testAdminsCountOfferUnits: what became of the units of a seller's posts,
// for the portions above the admins' list. A croissant of 9 has one unit held,
// one collected, one expired and one cancelled, whose unit came back.
func testAdminsCountOfferUnits(t *testing.T, f fixture) {
	t.Helper()

	o := placeThreeWays(t, f)
	customer := f.as(t, "customer", platform.RoleCustomer)

	cancelled, err := f.orders.Place(customer, key(), uuid.Nil, f.someone, []order.Wanted{{o.open.Lines[0].OfferID, 1}})
	if err != nil {
		t.Fatal(err)
	}

	if _, err := f.orders.Cancel(customer, cancelled.ID, "", ""); err != nil {
		t.Fatal(err)
	}

	admin := f.as(t, "admin", platform.RoleAdmin)

	u, err := f.orders.UnitsForAdmins(admin, offer.AdminFilter{SellerID: o.sellerID})
	if err != nil {
		t.Fatal(err)
	}

	want := order.OfferUnits{
		Posts: 1, Posted: 9, Left: 6, Leftover: 0,
		Collected: 1, CollectedOrders: 1, Held: 1, HeldOrders: 1, Missed: 1, MissedOrders: 1,
	}
	if u != want {
		t.Errorf("the seller's units: %+v, want %+v", u, want)
	}

	none, err := f.orders.UnitsForAdmins(admin, offer.AdminFilter{SellerID: o.sellerID, Status: offer.StatusWithdrawn})
	if err != nil || none != (order.OfferUnits{}) {
		t.Errorf("no post withdrawn: %+v, %v", none, err)
	}

	_, err = f.orders.UnitsForAdmins(customer, offer.AdminFilter{})
	mustFail(t, "a customer", err, platform.ErrAdminRequired)

	_, err = f.orders.UnitsForAdmins(admin, offer.AdminFilter{Status: "pending"})
	mustFail(t, "an unknown status", err, offer.ErrAdminListInvalid)
}
