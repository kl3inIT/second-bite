package offer_test

import (
	"context"
	"errors"
	"fmt"
	"testing"
	"time"

	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/offer"
	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/platform/platformtest"
)

// september is a time in Vietnam on a day of September 2026.
func september(day, hour, minute int) time.Time {
	return time.Date(2026, 9, day, hour, minute, 0, 0, platform.Vietnam)
}

// postedAt posts an offer of units for a seller, its window open now, and
// dates its posting at posted.
func (f fixture) postedAt(ctx context.Context, t *testing.T, sellerID uuid.UUID, units int, posted time.Time) uuid.UUID {
	t.Helper()

	d := bread(f.photo(ctx, t))
	d.Units = units

	o, err := f.offers.Post(ctx, sellerID, d)
	if err != nil {
		t.Fatal(err)
	}

	if _, err := f.pool.Exec(t.Context(), "UPDATE offer_offers SET created_at = $2 WHERE id = $1", o.ID, posted); err != nil {
		t.Fatal(err)
	}

	return o.ID
}

// TestSummary counts offers for the admins' dashboard on a database of its
// own, since it counts every offer: posted in the range, per day in Vietnam
// time and by seller; open now, a blocked seller's left out; the newest five.
func TestSummary(t *testing.T) {
	t.Parallel()

	f := newFixture(t, platformtest.StartPostgres(t))
	admin := f.as(t, "admin", platform.RoleAdmin)
	baker := f.as(t, "baker", platform.RoleCustomer)
	cook := f.as(t, "cook", platform.RoleCustomer)
	bakery := f.sellerAt(baker, t, "Tiệm bánh Tasco", tasco)
	kiosk := f.sellerAt(cook, t, "Quầy xôi Tasco", tasco)

	// The range is 1 to 7 September: 00:30 on the 1st is 31 August in UTC,
	// 23:30 on the 3rd is the 3rd in Vietnam, and midnight on the 8th is
	// past the range.
	from, to := september(1, 0, 0), september(8, 0, 0)
	b1 := f.postedAt(baker, t, bakery, 5, september(1, 0, 30))
	b2 := f.postedAt(baker, t, bakery, 5, september(3, 12, 0))
	b3 := f.postedAt(baker, t, bakery, 5, september(3, 23, 30))
	k1 := f.postedAt(cook, t, kiosk, 3, september(7, 23, 59))
	k2 := f.postedAt(cook, t, kiosk, 4, to)

	f.order(t, k1, 3)

	if _, err := f.offers.Withdraw(baker, b3); err != nil {
		t.Fatal(err)
	}

	got, err := f.offers.Summary(admin, from, to)
	if err != nil {
		t.Fatal(err)
	}

	latest := got.Latest
	got.Latest = nil

	want := offer.Summary{
		Posted: 4, UnitsPosted: 18, OnSale: 3, SoldOut: 1,
		PostedPerDay: []platform.DayCount{
			{Day: september(1, 0, 0), Count: 1}, {Day: september(3, 0, 0), Count: 2}, {Day: september(7, 0, 0), Count: 1},
		},
		TopPosters: []offer.Poster{
			{SellerID: bakery, SellerName: "Tiệm bánh Tasco", Posted: 3}, {SellerID: kiosk, SellerName: "Quầy xôi Tasco", Posted: 1},
		},
	}
	if fmt.Sprint(got) != fmt.Sprint(want) {
		t.Errorf("summary\n got %+v\nwant %+v", got, want)
	}

	mustListNewest(t, latest, []uuid.UUID{k2, k1, b3, b2, b1},
		offer.Posted{ID: k2, Name: breadMixed, SellerID: kiosk, SellerName: "Quầy xôi Tasco", PostedAt: to})

	// A blocked seller's offers leave what is open now, not what was posted.
	if _, err := f.sellers.Block(admin, kiosk, "Bán món đã quá hạn sử dụng"); err != nil {
		t.Fatal(err)
	}

	if got, err := f.offers.Summary(admin, from, to); err != nil || got.OnSale != 2 || got.SoldOut != 0 || got.Posted != 4 {
		t.Errorf("with the kiosk blocked: %+v, %v; want 2 on sale, none sold out, 4 posted", got, err)
	}

	if _, err := f.offers.Summary(baker, from, to); !errors.Is(err, platform.ErrAdminRequired) {
		t.Errorf("a seller's owner reading the summary: %v, want ErrAdminRequired", err)
	}
}

// mustListNewest checks the newest offers are want, in order, the first as
// first is.
func mustListNewest(t *testing.T, latest []offer.Posted, want []uuid.UUID, first offer.Posted) {
	t.Helper()

	got := make([]uuid.UUID, 0, len(latest))
	for _, p := range latest {
		got = append(got, p.ID)
	}

	if fmt.Sprint(got) != fmt.Sprint(want) {
		t.Fatalf("the newest %v, want %v", got, want)
	}

	l := latest[0]
	if l.Name != first.Name || l.SellerID != first.SellerID || l.SellerName != first.SellerName || !l.PostedAt.Equal(first.PostedAt) {
		t.Errorf("the newest offer %+v, want %+v", l, first)
	}
}
