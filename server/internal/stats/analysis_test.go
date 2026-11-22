package stats

import (
	"testing"
	"time"

	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/offer"
	"github.com/kl3inIT/second-bite/server/internal/order"
)

// TestAnalyse groups three posts of a day: a bread at 60% off that sold out
// in 40 minutes, a cake given away still on sale, and a rice box at 25% off
// that ended with units left.
func TestAnalyse(t *testing.T) {
	t.Parallel()

	posted := time.Date(2026, 11, 20, 17, 0, 0, 0, time.UTC)
	bread, cake, rice := uuid.New(), uuid.New(), uuid.New()
	posts := []offer.Post{
		{ID: bread, Name: "Bánh mì", Kind: offer.KindBakery, Units: 10, PriceVND: 8_000, OriginalPriceVND: 20_000, PostedAt: posted, Ended: true},
		{ID: cake, Name: "Bánh bông lan", Kind: offer.KindBakery, Units: 4, UnitsLeft: 2, OriginalPriceVND: 30_000, PostedAt: posted},
		{ID: rice, Name: "Cơm hộp", Kind: offer.KindPreparedFood, Units: 6, UnitsLeft: 4, PriceVND: 30_000, OriginalPriceVND: 40_000, PostedAt: posted, Ended: true},
	}
	outcomes := []order.OfferOutcome{
		{OfferID: bread, UnitsHeld: 10, UnitsCollected: 9, LastPlacedAt: posted.Add(40 * time.Minute)},
		{OfferID: cake, UnitsHeld: 2, UnitsCollected: 2, LastPlacedAt: posted.Add(time.Hour)},
		{OfferID: rice, UnitsHeld: 2, UnitsCollected: 1, LastPlacedAt: posted.Add(2 * time.Hour)},
	}

	a := analyse(posts, outcomes)

	if got := a.Kinds[offer.KindBakery]; got != (Portions{Posted: 14, Collected: 11}) {
		t.Errorf("bakery %+v", got)
	}

	if a.Discounts[DiscountFrom50] != (Portions{10, 9}) || a.Discounts[DiscountFree] != (Portions{4, 2}) ||
		a.Discounts[DiscountUnder30] != (Portions{6, 1}) {
		t.Errorf("discounts %+v", a.Discounts)
	}

	if a.SellOut != (SellOut{UnderHour: 1, NotSoldOut: 1, MedianMinutes: 40}) {
		t.Errorf("sell out %+v, want the bread in 40 minutes and the rice not, the cake still on sale", a.SellOut)
	}

	if len(a.TopSold) != 3 || a.TopSold[0].OfferID != bread || a.TopSold[2].OfferID != rice {
		t.Errorf("sold most %+v", a.TopSold)
	}

	// The cake is still on sale: only the ended rice and bread can be left over.
	if len(a.TopLeftover) != 2 || a.TopLeftover[0].OfferID != rice || a.TopLeftover[1].OfferID != bread {
		t.Errorf("left over most %+v", a.TopLeftover)
	}
}

func TestDiscountBandAndMedian(t *testing.T) {
	t.Parallel()

	for _, c := range []struct {
		price, original int64
		want            string
	}{
		{0, 10_000, DiscountFree},
		{3_000, 10_000, DiscountFrom70},
		{5_000, 10_000, DiscountFrom50},
		{6_900, 10_000, DiscountFrom30},
		{8_000, 10_000, DiscountUnder30},
	} {
		if got := discountBand(c.price, c.original); got != c.want {
			t.Errorf("discountBand(%d, %d) = %s, want %s", c.price, c.original, got, c.want)
		}
	}

	if median(nil) != 0 || median([]int{50, 10, 30}) != 30 || median([]int{40, 10}) != 10 {
		t.Error("the median of none, three and two values")
	}
}
