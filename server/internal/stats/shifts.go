package stats

import (
	"cmp"
	"context"
	"slices"
	"time"

	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/offer"
	"github.com/kl3inIT/second-bite/server/internal/order"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// eveningFrom is the hour in Vietnam from which a window's start is the
// evening shift; before it, the afternoon's (#261).
const eveningFrom = 17

// shift is a part of a collection day, told by the start of the window.
type shift int

const (
	shiftAfternoon shift = iota
	shiftEvening
)

var shiftWords = [...]string{shiftAfternoon: "Ca chiều", shiftEvening: "Ca tối"}

// shiftOf is the shift of a window starting at start.
func shiftOf(start time.Time) shift {
	if start.In(vietnam).Hour() < eveningFrom {
		return shiftAfternoon
	}

	return shiftEvening
}

// collectionDay is the day in Vietnam a window starting at start is
// collected on, as midnight UTC of its date, as the report's days are.
func collectionDay(start time.Time) time.Time {
	y, m, d := start.In(vietnam).Date()

	return time.Date(y, m, d, 0, 0, 0, 0, time.UTC)
}

// sharePortions are the portions of a group of posts as the sponsor counts
// them (#261, owner's additions of 24 November 2026): Posted; App, those of
// the orders on the app that were collected; Counter, those posted that no
// order on the app holds, handed out at the counter; and NotTaken, those of
// the orders on the app that ended without a hand-over, expired or refused.
// The portions of orders still open are in none but Posted.
type sharePortions struct {
	Posted, App, Counter, NotTaken int
}

// collected are the portions handed out, through the app or at the counter.
func (p sharePortions) collected() int { return p.App + p.Counter }

func (p *sharePortions) add(o sharePortions) {
	p.Posted += o.Posted
	p.App += o.App
	p.Counter += o.Counter
	p.NotTaken += o.NotTaken
}

// dishPortions are one store's dish in a shift.
type dishPortions struct {
	Store, Dish string
	sharePortions
}

// customerLine is one dish of an order on the app, with its customer, and
// the day and shift of its window.
type customerLine struct {
	Order order.Order
	Day   time.Time
	Shift shift
	Dish  string
	Units int
}

// shiftPart is one shift of a day: the earliest start and the latest end of
// its windows, its stores, its portions, by store and dish, and the orders
// on the app with their customers.
type shiftPart struct {
	Shift     shift
	From, To  time.Time
	Stores    int
	Portions  sharePortions
	Dishes    []dishPortions
	Customers []customerLine
}

// shiftDay is one day of the range: its shifts that have a post or an order,
// in order, and the whole day's.
type shiftDay struct {
	Day      time.Time
	Shifts   []shiftPart
	Stores   int
	Portions sharePortions
}

// shiftReport is the report by day and shift sent to the sponsor (#261):
// every day of the range, the range's totals, the people who collected an
// order on the app, told apart by phone number, and every order on the app.
type shiftReport struct {
	Since, Until time.Time
	Scope        string
	Days         []shiftDay
	Stores       int
	Portions     sharePortions
	People       int
	Customers    []customerLine
}

// offerTally is what one offer posted and what the orders on the app did
// with it.
type offerTally struct {
	seller        uuid.UUID
	store, dish   string
	day           time.Time
	shift         shift
	start, end    time.Time
	posted, held  int
	app, notTaken int
}

// ShiftWorkbook reads the posts and the orders of f's days and writes the
// report by shift with every order's customer, for an admin (#261). Reading
// the orders records in the audit that the admin downloaded their customers.
func (s *Service) ShiftWorkbook(ctx context.Context, f ReportFilter) ([]byte, string, error) {
	if _, err := platform.RequireAdmin(ctx); err != nil {
		return nil, "", err
	}

	if f.Until.Before(f.Since) || f.Until.Sub(f.Since) >= maxReportDays*24*time.Hour {
		return nil, "", ErrReportRangeInvalid
	}

	since := time.Date(f.Since.Year(), f.Since.Month(), f.Since.Day(), 0, 0, 0, 0, vietnam)
	until := time.Date(f.Until.Year(), f.Until.Month(), f.Until.Day()+1, 0, 0, 0, 0, vietnam)

	posts, err := s.offers.PostsBetween(ctx, since, until, f.SellerID, f.Clock)
	if err != nil {
		return nil, "", err
	}

	orders, err := s.orders.OrdersWithCustomers(ctx, order.CustomersFilter{
		Since: f.Since, Until: f.Until, SellerID: f.SellerID, Clock: f.Clock,
	})
	if err != nil {
		return nil, "", err
	}

	scope := wordAllStores

	if f.SellerID != nil {
		names, err := s.sellers.NamesOf(ctx, []uuid.UUID{*f.SellerID})
		if err != nil {
			return nil, "", err
		}

		scope = names[*f.SellerID]
	}

	r := shiftReportOf(f.Since, f.Until, scope, posts, orders)

	body, err := shiftWorkbook(r)
	if err != nil {
		return nil, "", err
	}

	return body, shiftWorkbookName(r), nil
}

// shiftReportOf groups the posts and the orders on the app of the days from
// since to until by day, shift, store and dish. A cancelled order counts for
// nothing; an order whose post is not among posts, its window moved after it
// was placed, counts under its own day and shift with nothing posted.
func shiftReportOf(since, until time.Time, scope string, posts []offer.Post, orders []order.Order) shiftReport {
	tallies := map[uuid.UUID]*offerTally{}

	for _, p := range posts {
		tallies[p.ID] = &offerTally{
			seller: p.SellerID, store: p.SellerName, dish: p.Name,
			day: collectionDay(p.WindowStart), shift: shiftOf(p.WindowStart), start: p.WindowStart, end: p.WindowEnd,
			posted: p.Units,
		}
	}

	r := shiftReport{Since: since, Until: until, Scope: scope}
	people := map[string]bool{}

	for _, o := range orders {
		if o.Status == order.StatusCancelled {
			continue
		}

		if o.Status == order.StatusCollected && o.Contact.Phone != "" {
			people[o.Contact.Phone] = true
		}

		for _, l := range o.Lines {
			t := tallies[l.OfferID]
			if t == nil {
				t = &offerTally{
					seller: o.SellerID, store: o.SellerName, dish: l.Name,
					day: collectionDay(o.WindowStart), shift: shiftOf(o.WindowStart), start: o.WindowStart, end: o.WindowEnd,
				}
				tallies[l.OfferID] = t
			}

			t.held += l.Units

			switch o.Status {
			case order.StatusCollected:
				t.app += l.Units
			case order.StatusExpired, order.StatusRefused:
				t.notTaken += l.Units
			case order.StatusConfirmed, order.StatusReady, order.StatusCancelled:
			}

			r.Customers = append(r.Customers, customerLine{
				Order: o, Day: collectionDay(o.WindowStart), Shift: shiftOf(o.WindowStart), Dish: l.Name, Units: l.Units,
			})
		}
	}

	r.People = len(people)

	slices.SortStableFunc(r.Customers, func(a, b customerLine) int {
		return cmp.Or(a.Order.WindowStart.Compare(b.Order.WindowStart), cmp.Compare(a.Order.Number, b.Order.Number))
	})

	for d := since; !d.After(until); d = d.AddDate(0, 0, 1) {
		day := dayOfTallies(d, tallies, r.Customers)
		r.Days = append(r.Days, day)
		r.Portions.add(day.Portions)
	}

	stores := map[uuid.UUID]bool{}
	for _, t := range tallies {
		stores[t.seller] = true
	}

	r.Stores = len(stores)

	return r
}

// dayOfTallies is one day's shifts from the tallies of every offer.
func dayOfTallies(day time.Time, tallies map[uuid.UUID]*offerTally, customers []customerLine) shiftDay {
	d := shiftDay{Day: day}
	dayStores := map[uuid.UUID]bool{}

	for _, sh := range []shift{shiftAfternoon, shiftEvening} {
		var of []*offerTally

		for _, t := range tallies {
			if t.day.Equal(day) && t.shift == sh {
				of = append(of, t)
				dayStores[t.seller] = true
			}
		}

		if len(of) == 0 {
			continue
		}

		part := shiftPartOf(sh, of)

		for _, c := range customers {
			if c.Day.Equal(day) && c.Shift == sh {
				part.Customers = append(part.Customers, c)
			}
		}

		d.Shifts = append(d.Shifts, part)
		d.Portions.add(part.Portions)
	}

	d.Stores = len(dayStores)

	return d
}

// shiftPartOf adds up one shift's offers, at least one, by store and dish.
func shiftPartOf(sh shift, tallies []*offerTally) shiftPart {
	part := shiftPart{Shift: sh, From: tallies[0].start, To: tallies[0].end}
	stores := map[uuid.UUID]bool{}
	dishes := map[[2]string]*dishPortions{}

	for _, t := range tallies {
		if t.start.Before(part.From) {
			part.From = t.start
		}

		if t.end.After(part.To) {
			part.To = t.end
		}

		stores[t.seller] = true

		p := sharePortions{Posted: t.posted, App: t.app, Counter: max(t.posted-t.held, 0), NotTaken: t.notTaken}
		part.Portions.add(p)

		key := [2]string{t.store, t.dish}
		if dishes[key] == nil {
			dishes[key] = &dishPortions{Store: t.store, Dish: t.dish}
		}

		dishes[key].add(p)
	}

	part.Stores = len(stores)

	for _, dp := range dishes {
		part.Dishes = append(part.Dishes, *dp)
	}

	slices.SortFunc(part.Dishes, func(a, b dishPortions) int {
		return cmp.Or(cmp.Compare(a.Store, b.Store), cmp.Compare(a.Dish, b.Dish))
	})

	return part
}
