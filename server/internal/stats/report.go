package stats

import (
	"cmp"
	"context"
	"fmt"
	"slices"
	"time"

	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/stats/internal/db"
)

// maxReportDays bounds the days one report reads.
const maxReportDays = 92

// ErrReportRangeInvalid refuses a range that ends before it starts or is too long.
var ErrReportRangeInvalid = platform.NewFailure("REPORT_RANGE_INVALID", platform.CategoryValidation, platform.Words{
	VI: "Khoảng ngày không hợp lệ: ngày bắt đầu không sau ngày kết thúc, và tối đa 92 ngày.",
	EN: "The range of days is not valid: it starts no later than it ends and holds at most 92 days.",
})

// Counts are the numbers of a day, a store, or both.
type Counts struct {
	// Views and People count the pages opened and the browsers that opened
	// them, one a day; HomeViews the home's and QRViews those the poster's
	// code brought.
	Views, People, HomeViews, QRViews int
	// Offers and UnitsPosted are what was posted for the day.
	Offers, UnitsPosted int
	// Held counts every order of the day; Collected, Cancelled, Refused and
	// Expired how they ended.
	Held, UnitsHeld, Collected, UnitsCollected, Cancelled, Refused, Expired int
	// CollectedVND is what the collected orders came to at the counter.
	CollectedVND int64
}

func (c *Counts) addViews(o Counts) {
	c.Views += o.Views
	c.People += o.People
	c.HomeViews += o.HomeViews
	c.QRViews += o.QRViews
}

func (c *Counts) addTrade(o Counts) {
	c.Offers += o.Offers
	c.UnitsPosted += o.UnitsPosted
	c.Held += o.Held
	c.UnitsHeld += o.UnitsHeld
	c.Collected += o.Collected
	c.UnitsCollected += o.UnitsCollected
	c.Cancelled += o.Cancelled
	c.Refused += o.Refused
	c.Expired += o.Expired
	c.CollectedVND += o.CollectedVND
}

// ReportFilter is what an admin reads the report by: days in Vietnam, both
// included, and one store or all of them.
type ReportFilter struct {
	Since, Until time.Time
	SellerID     *uuid.UUID
}

// DayCounts are a day's numbers.
type DayCounts struct {
	Day time.Time
	Counts
}

// StoreCounts are a store's numbers over the range.
type StoreCounts struct {
	SellerID uuid.UUID
	Name     string
	Counts
}

// StoreDayCounts are a store's numbers on a day.
type StoreDayCounts struct {
	Day      time.Time
	SellerID uuid.UUID
	Name     string
	Counts
}

// Report is the admin's report (SEC-80): the totals, every day of the range,
// each store over the range, and each store on each day it has numbers.
// People add up over days, since a visitor's key changes every day.
type Report struct {
	Since, Until time.Time
	Totals       Counts
	Days         []DayCounts
	Stores       []StoreCounts
	StoreDays    []StoreDayCounts
}

type storeDay struct {
	day    time.Time
	seller uuid.UUID
}

// Report reads the numbers of f for an admin. The views are this module's;
// the posts, the orders and the stores' names are asked of their modules.
// With a store chosen, the views are those of its page and its dishes'.
func (s *Service) Report(ctx context.Context, f ReportFilter) (Report, error) {
	if _, err := platform.RequireAdmin(ctx); err != nil {
		return Report{}, err
	}

	if f.Until.Before(f.Since) || f.Until.Sub(f.Since) >= maxReportDays*24*time.Hour {
		return Report{}, ErrReportRangeInvalid
	}

	cells, err := s.storeDays(ctx, f)
	if err != nil {
		return Report{}, err
	}

	days := map[time.Time]*Counts{}
	for d := f.Since; !d.After(f.Until); d = d.AddDate(0, 0, 1) {
		days[d] = &Counts{}
	}

	for key, c := range cells {
		if day, ok := days[key.day]; ok {
			day.addTrade(*c)

			if f.SellerID != nil {
				day.addViews(*c)
			}
		}
	}

	if f.SellerID == nil {
		views, err := s.queries.ViewDays(ctx, db.ViewDaysParams{Since: date(f.Since), Until: date(f.Until)})
		if err != nil {
			return Report{}, fmt.Errorf("counting the views: %w", err)
		}

		for _, v := range views {
			if day, ok := days[v.Day.Time]; ok {
				day.addViews(Counts{Views: int(v.Views), People: int(v.People), HomeViews: int(v.HomeViews), QRViews: int(v.QrViews)})
			}
		}
	}

	return s.assemble(ctx, f, days, cells)
}

// storeDays merges the views, the posts and the orders of each store and day.
func (s *Service) storeDays(ctx context.Context, f ReportFilter) (map[storeDay]*Counts, error) {
	since := time.Date(f.Since.Year(), f.Since.Month(), f.Since.Day(), 0, 0, 0, 0, vietnam)
	until := time.Date(f.Until.Year(), f.Until.Month(), f.Until.Day()+1, 0, 0, 0, 0, vietnam)
	cells := map[storeDay]*Counts{}

	cell := func(day time.Time, seller uuid.UUID) *Counts {
		key := storeDay{day, seller}
		if cells[key] == nil {
			cells[key] = &Counts{}
		}

		return cells[key]
	}

	posts, err := s.offers.PostDays(ctx, since, until, f.SellerID)
	if err != nil {
		return nil, err
	}

	for _, p := range posts {
		cell(p.Day, p.SellerID).addTrade(Counts{Offers: p.Offers, UnitsPosted: p.Units})
	}

	orders, err := s.orders.OrderDays(ctx, since, until, f.SellerID)
	if err != nil {
		return nil, err
	}

	for _, o := range orders {
		cell(o.Day, o.SellerID).addTrade(Counts{
			Held: o.Held, UnitsHeld: o.UnitsHeld, Collected: o.Collected, UnitsCollected: o.UnitsCollected,
			Cancelled: o.Cancelled, Refused: o.Refused, Expired: o.Expired, CollectedVND: o.CollectedVND,
		})
	}

	views, err := s.storeViewDays(ctx, f)
	if err != nil {
		return nil, err
	}

	for _, v := range views {
		if f.SellerID == nil || v.SellerID == *f.SellerID {
			cell(v.Day.Time, v.SellerID).addViews(Counts{Views: int(v.Views), People: int(v.People), QRViews: int(v.QrViews)})
		}
	}

	return cells, nil
}

// storeViewDays counts the views of stores' pages and of their dishes', the
// dishes' stores asked of offer.
func (s *Service) storeViewDays(ctx context.Context, f ReportFilter) ([]db.StoreViewDaysRow, error) {
	dishes, err := s.queries.OfferSubjects(ctx, db.OfferSubjectsParams{Since: date(f.Since), Until: date(f.Until)})
	if err != nil {
		return nil, fmt.Errorf("reading the dishes viewed: %w", err)
	}

	owners, err := s.offers.SellersOf(ctx, dishes)
	if err != nil {
		return nil, err
	}

	params := db.StoreViewDaysParams{Since: date(f.Since), Until: date(f.Until)}
	for dish, seller := range owners {
		params.OfferIds = append(params.OfferIds, dish)
		params.OfferSellers = append(params.OfferSellers, seller)
	}

	views, err := s.queries.StoreViewDays(ctx, params)
	if err != nil {
		return nil, fmt.Errorf("counting the stores' views: %w", err)
	}

	return views, nil
}

// assemble names the stores and orders the report: the days in order, the
// stores by orders held then name, a store's days by day then name.
func (s *Service) assemble(ctx context.Context, f ReportFilter, days map[time.Time]*Counts, cells map[storeDay]*Counts) (Report, error) {
	r := Report{Since: f.Since, Until: f.Until}

	for day, c := range days {
		r.Days = append(r.Days, DayCounts{Day: day, Counts: *c})
		r.Totals.addViews(*c)
		r.Totals.addTrade(*c)
	}

	slices.SortFunc(r.Days, func(a, b DayCounts) int { return a.Day.Compare(b.Day) })

	stores := map[uuid.UUID]*Counts{}

	for key, c := range cells {
		if stores[key.seller] == nil {
			stores[key.seller] = &Counts{}
		}

		stores[key.seller].addViews(*c)
		stores[key.seller].addTrade(*c)
	}

	ids := make([]uuid.UUID, 0, len(stores))
	for id := range stores {
		ids = append(ids, id)
	}

	names, err := s.sellers.NamesOf(ctx, ids)
	if err != nil {
		return Report{}, err
	}

	for id, c := range stores {
		r.Stores = append(r.Stores, StoreCounts{SellerID: id, Name: names[id], Counts: *c})
	}

	slices.SortFunc(r.Stores, func(a, b StoreCounts) int {
		return cmp.Or(cmp.Compare(b.Held, a.Held), cmp.Compare(a.Name, b.Name), cmp.Compare(a.SellerID.String(), b.SellerID.String()))
	})

	for key, c := range cells {
		r.StoreDays = append(r.StoreDays, StoreDayCounts{Day: key.day, SellerID: key.seller, Name: names[key.seller], Counts: *c})
	}

	slices.SortFunc(r.StoreDays, func(a, b StoreDayCounts) int {
		return cmp.Or(a.Day.Compare(b.Day), cmp.Compare(a.Name, b.Name), cmp.Compare(a.SellerID.String(), b.SellerID.String()))
	})

	return r, nil
}
