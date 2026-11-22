package stats

import (
	"cmp"
	"context"
	"fmt"
	"slices"
	"time"

	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/offer"
	"github.com/kl3inIT/second-bite/server/internal/order"
	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/stats/internal/db"
)

// topDishes is how many dishes each ranking of the analysis holds.
const topDishes = 5

// The discount bands of the analysis, from food given away to the smallest
// discount the settings allow.
const (
	DiscountFree    = "free"
	DiscountFrom70  = "from70"
	DiscountFrom50  = "from50"
	DiscountFrom30  = "from30"
	DiscountUnder30 = "under30"
)

// Portions are the units posted of a group of offers and those collected.
type Portions struct {
	Posted, Collected int
}

// DishRank is one offer of a ranking: what it posted and what was collected.
type DishRank struct {
	OfferID          uuid.UUID
	Name, SellerName string
	Unit             string
	Portions
}

// SellOut is how long the offers took to sell out, from posting to the
// latest order that took their last unit, in four bands, and those that ended
// without; MedianMinutes is the middle of the offers that sold out. An offer
// still on sale with units left is in neither.
type SellOut struct {
	UnderHalfHour, UnderHour, UnderTwoHours, OverTwoHours, NotSoldOut int
	MedianMinutes                                                     int
}

// SourceViews are the views a source brought; "" is none.
type SourceViews struct {
	Source string
	Views  int
}

// Analysis is the admin's analysis of a range (report-products-export
// increment): the posts of its collection days by kind and discount, the
// dishes sold most and left over most, how quickly offers sold out, and what
// the orders tell (when, how early, how they failed, how often customers
// come, what reviews praise and customers report). The views' sources are
// the site's whatever store is chosen.
type Analysis struct {
	Since, Until time.Time
	Kinds        map[offer.Kind]Portions
	Discounts    map[string]Portions
	TopSold      []DishRank
	TopLeftover  []DishRank
	SellOut      SellOut
	Orders       order.Analysis
	Sources      []SourceViews
}

// Analysis reads the analysis of f for an admin, over the same days and store
// as the report.
func (s *Service) Analysis(ctx context.Context, f ReportFilter) (Analysis, error) {
	if _, err := platform.RequireAdmin(ctx); err != nil {
		return Analysis{}, err
	}

	if f.Until.Before(f.Since) || f.Until.Sub(f.Since) >= maxReportDays*24*time.Hour {
		return Analysis{}, ErrReportRangeInvalid
	}

	since := time.Date(f.Since.Year(), f.Since.Month(), f.Since.Day(), 0, 0, 0, 0, vietnam)
	until := time.Date(f.Until.Year(), f.Until.Month(), f.Until.Day()+1, 0, 0, 0, 0, vietnam)

	posts, err := s.offers.PostsBetween(ctx, since, until, f.SellerID, f.Clock)
	if err != nil {
		return Analysis{}, err
	}

	outcomes, err := s.orders.OfferOutcomes(ctx, since, until, f.SellerID, f.Clock)
	if err != nil {
		return Analysis{}, err
	}

	orders, err := s.orders.Analysis(ctx, since, until, f.SellerID, f.Clock)
	if err != nil {
		return Analysis{}, err
	}

	from, to := f.Clock.Bounds()

	sources, err := s.queries.ViewSources(ctx, db.ViewSourcesParams{
		Since: date(f.Since), Until: date(f.Until), TimeFrom: from, TimeUntil: to,
	})
	if err != nil {
		return Analysis{}, fmt.Errorf("counting the views by source: %w", err)
	}

	a := analyse(posts, outcomes)
	a.Since, a.Until, a.Orders = f.Since, f.Until, orders

	for _, r := range sources {
		a.Sources = append(a.Sources, SourceViews{Source: r.Source, Views: int(r.Views)})
	}

	return a, nil
}

// taken is what the orders took of one offer over the range.
type taken struct {
	collected  int
	lastPlaced time.Time
}

// analyse groups the posts by kind and discount, ranks them and times how
// they sold out, from what the orders took of each.
func analyse(posts []offer.Post, outcomes []order.OfferOutcome) Analysis {
	took := map[uuid.UUID]taken{}

	for _, o := range outcomes {
		t := took[o.OfferID]
		t.collected += o.UnitsCollected

		if o.LastPlacedAt.After(t.lastPlaced) {
			t.lastPlaced = o.LastPlacedAt
		}

		took[o.OfferID] = t
	}

	a := Analysis{Kinds: map[offer.Kind]Portions{}, Discounts: map[string]Portions{}}

	// Every dish can rank among those sold; only those ended among those left
	// over, as one still on sale may sell yet.
	var dishes, ended []DishRank

	var soldOutMinutes []int

	for _, p := range posts {
		collected := took[p.ID].collected
		add := func(into map[string]Portions, key string) {
			b := into[key]
			b.Posted += p.Units
			b.Collected += collected
			into[key] = b
		}

		k := a.Kinds[p.Kind]
		k.Posted += p.Units
		k.Collected += collected
		a.Kinds[p.Kind] = k

		add(a.Discounts, discountBand(p.PriceVND, p.OriginalPriceVND))

		dish := DishRank{
			OfferID: p.ID, Name: p.Name, SellerName: p.SellerName, Unit: p.Unit,
			Posted: p.Units, Collected: collected,
		}
		dishes = append(dishes, dish)

		if p.Ended {
			ended = append(ended, dish)
		}

		switch {
		case p.UnitsLeft == 0 && !took[p.ID].lastPlaced.IsZero():
			minutes := max(int(took[p.ID].lastPlaced.Sub(p.PostedAt).Minutes()), 0)
			soldOutMinutes = append(soldOutMinutes, minutes)
			a.SellOut.band(minutes)
		case p.Ended:
			a.SellOut.NotSoldOut++
		}
	}

	a.SellOut.MedianMinutes = median(soldOutMinutes)
	a.TopSold = rank(dishes, func(d DishRank) int { return d.Collected })
	a.TopLeftover = rank(ended, func(d DishRank) int { return d.Posted - d.Collected })

	return a
}

// band counts an offer that sold out after minutes.
func (s *SellOut) band(minutes int) {
	switch {
	case minutes < 30:
		s.UnderHalfHour++
	case minutes < 60:
		s.UnderHour++
	case minutes < 120:
		s.UnderTwoHours++
	default:
		s.OverTwoHours++
	}
}

// discountBand names the band of an offer's discount against its original
// price, in whole percent rounded down.
func discountBand(price, original int64) string {
	if price == 0 {
		return DiscountFree
	}

	percent := int64(0)
	if original > 0 {
		percent = (original - price) * 100 / original
	}

	switch {
	case percent >= 70:
		return DiscountFrom70
	case percent >= 50:
		return DiscountFrom50
	case percent >= 30:
		return DiscountFrom30
	default:
		return DiscountUnder30
	}
}

// rank keeps the topDishes dishes with the most by, more than none, then by
// name.
func rank(dishes []DishRank, by func(DishRank) int) []DishRank {
	kept := slices.DeleteFunc(slices.Clone(dishes), func(d DishRank) bool { return by(d) <= 0 })
	slices.SortFunc(kept, func(a, b DishRank) int {
		return cmp.Or(cmp.Compare(by(b), by(a)), cmp.Compare(a.Name, b.Name), cmp.Compare(a.OfferID.String(), b.OfferID.String()))
	})

	return kept[:min(len(kept), topDishes)]
}

// median is the middle of values, the lower of the two middles for an even
// count; 0 for none.
func median(values []int) int {
	if len(values) == 0 {
		return 0
	}

	sorted := slices.Sorted(slices.Values(values))

	return sorted[(len(sorted)-1)/2]
}
