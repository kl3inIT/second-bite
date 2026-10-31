package order_test

import (
	"testing"
	"time"

	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/order"
	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/seller"
)

// testSellerDeletionWaitsForOrders: a seller an admin deletes takes no more
// orders, still hands over the ones placed, and is deleted only once none can
// be handed over or opened again, its orders kept.
func testSellerDeletionWaitsForOrders(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	customer := f.as(t, "customer", platform.RoleCustomer)
	admin := f.as(t, "admin", platform.RoleAdmin)
	shop := f.shop(owner, t, "Quán Sắp Xoá")
	croissant := f.post(owner, t, shop, "Croissant", 5, 20_000, time.Now())

	o, err := f.orders.Place(customer, key(), uuid.Nil, someone, []order.Wanted{{croissant.ID, 1}})
	if err != nil {
		t.Fatal(err)
	}

	if _, err := f.sellers.Delete(admin, shop, "Quán dừng hợp tác với Second Bite"); err != nil {
		t.Fatal(err)
	}

	_, err = f.orders.Place(customer, key(), uuid.Nil, someone, []order.Wanted{{croissant.ID, 1}})
	mustFail(t, "ordering from a seller being deleted", err, order.ErrOfferUnavailable)

	finish := func(want seller.Status, what string) {
		t.Helper()

		if err := f.orders.FinishSellerDeletions(t.Context()); err != nil {
			t.Fatal(err)
		}

		if s, err := f.sellers.Get(admin, shop); err != nil || s.Status != want {
			t.Errorf("%s: %v, %v; want %s", what, s.Status, err, want)
		}
	}

	finish(seller.StatusBlocked, "an order still to collect")

	if _, err := f.orders.HandOver(owner, o.ID); err != nil {
		t.Fatalf("handing over while the seller waits: %v", err)
	}

	finish(seller.StatusBlocked, "an order handed over that may be opened again")

	f.shift(t, o.ID, -3*time.Hour)
	finish(seller.StatusDeleted, "every window over")

	if got, err := f.orders.Get(customer, o.ID, ""); err != nil || got.Status != order.StatusCollected {
		t.Errorf("the customer's order after the deletion: %+v, %v", got.Status, err)
	}
}
