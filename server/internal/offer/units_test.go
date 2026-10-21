package offer_test

import (
	"context"
	"sync"
	"testing"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"

	"github.com/kl3inIT/second-bite/server/internal/offer"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// take takes units of an offer in a transaction of its own, as an order does.
func (f fixture) take(ctx context.Context, offerID uuid.UUID, units int) (offer.Taken, error) {
	var taken offer.Taken

	err := pgx.BeginFunc(ctx, f.pool, func(tx pgx.Tx) error {
		var err error

		taken, err = f.offers.Take(ctx, tx, offerID, units)

		return err
	})

	return taken, err
}

func testOrdersTakeAndReturnUnits(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	sellerID := f.activeSeller(owner, t)

	o, err := f.offers.Post(owner, sellerID, bread(f.photo(owner, t)))
	if err != nil {
		t.Fatal(err)
	}

	taken, err := f.take(t.Context(), o.ID, 2)
	if err != nil {
		t.Fatal(err)
	}

	if taken.SellerID != sellerID || taken.Name != o.Name || taken.PriceVND != 15_000 || taken.SellerName != "Quầy Tasco" ||
		!taken.WindowEnd.Equal(o.WindowEnd) {
		t.Errorf("taken %+v", taken)
	}

	raceForTheLastUnits(t, f, o.ID)

	if got, _ := f.offers.Get(owner, o.ID); got.UnitsLeft != 0 || got.Status != offer.StatusSoldOut {
		t.Errorf("after both orders: %+v", got)
	}

	// A cancelled order gives its units back, never above those posted.
	err = pgx.BeginFunc(t.Context(), f.pool, func(tx pgx.Tx) error { return f.offers.Return(t.Context(), tx, o.ID, 9) })
	if err != nil {
		t.Fatal(err)
	}

	if got, _ := f.offers.Get(owner, o.ID); got.UnitsLeft != 5 || got.Status != offer.StatusOnSale {
		t.Errorf("after the units came back: %+v", got)
	}

	withdrawnAndUnknownGiveNothing(owner, t, f, o.ID)
}

// withdrawnAndUnknownGiveNothing withdraws an offer, then asks it and an
// offer that does not exist for units.
func withdrawnAndUnknownGiveNothing(owner context.Context, t *testing.T, f fixture, offerID uuid.UUID) {
	t.Helper()

	if _, err := f.offers.Withdraw(owner, offerID); err != nil {
		t.Fatal(err)
	}

	_, err := f.take(t.Context(), offerID, 1)
	mustFail(t, "a withdrawn offer", err, offer.ErrUnavailable)

	_, err = f.take(t.Context(), uuid.New(), 1)
	mustFail(t, "no such offer", err, offer.ErrNotFound)
}

// raceForTheLastUnits has two orders want the last three units of an offer
// at once: one gets them, the other is told the offer is sold out.
func raceForTheLastUnits(t *testing.T, f fixture, offerID uuid.UUID) {
	t.Helper()

	var (
		wg   sync.WaitGroup
		errs [2]error
	)

	for i := range errs {
		wg.Go(func() { _, errs[i] = f.take(t.Context(), offerID, 3) })
	}

	wg.Wait()

	if (errs[0] == nil) == (errs[1] == nil) {
		t.Fatalf("two orders for the last three units: %v, %v", errs[0], errs[1])
	}

	for _, err := range errs {
		if err != nil {
			mustFail(t, "the second order for the last units", err, offer.ErrSoldOut)
		}
	}
}
