package order

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/order/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// Slot is how many orders a weekday and an hour of the window's start held,
// and how many of them were collected; Weekday runs from 1, Monday, to 7.
type Slot struct {
	Weekday, Hour   int
	Held, Collected int
}

// LeadTimes are how long before the window opened the orders were placed.
type LeadTimes struct {
	UnderHalfHour, UnderHour, UnderThreeHours, OverThreeHours int
}

// Analysis is what the orders of a range tell beyond the report's counts,
// for the admin's analysis: when they are collected, how early they are
// placed, how those not collected ended, how often customers come, what
// their reviews praise and what they report.
type Analysis struct {
	Slots     []Slot
	LeadTimes LeadTimes
	// Failures counts the orders not collected by ending: "cancelled",
	// "expired", or "refused_" and the refusal's reason.
	Failures map[string]int
	// Visits counts the customers by their orders handed over: 1, 2, or 3
	// for three and more.
	Visits map[int]int
	// Tags counts the reviews praising each tag; Problems the orders
	// reported for each kind.
	Tags, Problems map[string]int
}

// Analysis reads what the orders whose window starts in [since, until) tell
// beyond the report's counts, in clock's part of the day; one seller's
// only when sellerID is set.
func (s *Service) Analysis(ctx context.Context, since, until time.Time, sellerID *uuid.UUID, clock platform.Clock) (Analysis, error) {
	seller := uuid.NullUUID{}
	if sellerID != nil {
		seller = uuid.NullUUID{UUID: *sellerID, Valid: true}
	}

	from, to := clock.Bounds()

	a := Analysis{Failures: map[string]int{}, Visits: map[int]int{}, Tags: map[string]int{}, Problems: map[string]int{}}

	slots, err := s.queries.OrderSlots(ctx, db.OrderSlotsParams{Since: since, Until: until, SellerID: seller, TimeFrom: from, TimeUntil: to})
	if err != nil {
		return Analysis{}, fmt.Errorf("counting the orders by weekday and hour: %w", err)
	}

	for _, r := range slots {
		a.Slots = append(a.Slots, Slot{Weekday: int(r.Weekday), Hour: int(r.Hour), Held: int(r.Held), Collected: int(r.Collected)})
	}

	lead, err := s.queries.OrderLeadTimes(ctx, db.OrderLeadTimesParams{Since: since, Until: until, SellerID: seller, TimeFrom: from, TimeUntil: to})
	if err != nil {
		return Analysis{}, fmt.Errorf("counting how early orders are placed: %w", err)
	}

	a.LeadTimes = LeadTimes{
		UnderHalfHour: int(lead.UnderHalfHour), UnderHour: int(lead.UnderHour),
		UnderThreeHours: int(lead.UnderThreeHours), OverThreeHours: int(lead.OverThreeHours),
	}

	failures, err := s.queries.OrderFailures(ctx, db.OrderFailuresParams{Since: since, Until: until, SellerID: seller, TimeFrom: from, TimeUntil: to})
	if err != nil {
		return Analysis{}, fmt.Errorf("counting the orders not collected: %w", err)
	}

	for _, r := range failures {
		a.Failures[r.Ending] = int(r.Orders)
	}

	visits, err := s.queries.CustomerVisits(ctx, db.CustomerVisitsParams{Since: since, Until: until, SellerID: seller, TimeFrom: from, TimeUntil: to})
	if err != nil {
		return Analysis{}, fmt.Errorf("counting the customers' visits: %w", err)
	}

	for _, r := range visits {
		a.Visits[int(r.Visits)] = int(r.Customers)
	}

	return a, s.readFeedback(ctx, since, until, seller, clock, &a)
}

// readFeedback adds what the reviews praise and what customers reported.
func (s *Service) readFeedback(ctx context.Context, since, until time.Time, seller uuid.NullUUID, clock platform.Clock, a *Analysis) error {
	from, to := clock.Bounds()

	tags, err := s.queries.ReviewTagCounts(ctx, db.ReviewTagCountsParams{Since: since, Until: until, SellerID: seller, TimeFrom: from, TimeUntil: to})
	if err != nil {
		return fmt.Errorf("counting the reviews' tags: %w", err)
	}

	for _, r := range tags {
		a.Tags[r.Tag] = int(r.Reviews)
	}

	problems, err := s.queries.ProblemKindCounts(ctx, db.ProblemKindCountsParams{Since: since, Until: until, SellerID: seller, TimeFrom: from, TimeUntil: to})
	if err != nil {
		return fmt.Errorf("counting the problems reported: %w", err)
	}

	for _, r := range problems {
		a.Problems[r.Kind] = int(r.Orders)
	}

	return nil
}
