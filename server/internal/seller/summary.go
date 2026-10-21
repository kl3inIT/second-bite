package seller

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/seller/internal/db"
)

// latestOpened is how many of the newest sellers a summary lists.
const latestOpened = 5

// Summary is what admins see of the sellers at a glance: how many stand in
// each status now and on each day of a range, how many were opened in the
// range, and the newest.
type Summary struct {
	Active  int
	Pending int
	Blocked int
	// Opened counts the sellers opened in the range, whatever their status.
	Opened int
	// Latest are the five sellers opened last, whenever that was, newest
	// first.
	Latest []Opened
	// PerDay holds every day of the range, in order, with the sellers in
	// each status at its end. A seller keeps no history, so the days are
	// rebuilt from its status now and when that last changed; they are right
	// only when every seller changed status at most once (StatusPerDay in
	// queries.sql).
	PerDay []StatusDay
}

// StatusDay is how many sellers stood in each status at the end of one day
// in Vietnam time.
type StatusDay struct {
	// Day is the day's first instant, midnight in Vietnam.
	Day     time.Time
	Active  int
	Pending int
	Blocked int
}

// Opened is a seller as a summary lists it.
type Opened struct {
	ID       uuid.UUID
	Name     string
	OpenedAt time.Time
}

// Summary returns the sellers' summary over [from, to), to admins.
func (s *Service) Summary(ctx context.Context, from, to time.Time) (Summary, error) {
	if _, err := platform.RequireAdmin(ctx); err != nil {
		return Summary{}, err
	}

	counts, err := s.queries.SummarizeSellers(ctx, db.SummarizeSellersParams{RangeStart: from, RangeEnd: to})
	if err != nil {
		return Summary{}, fmt.Errorf("counting the sellers: %w", err)
	}

	rows, err := s.queries.LatestSellers(ctx, latestOpened)
	if err != nil {
		return Summary{}, fmt.Errorf("listing the newest sellers: %w", err)
	}

	days, err := s.queries.StatusPerDay(ctx, db.StatusPerDayParams{RangeStart: from, RangeEnd: to})
	if err != nil {
		return Summary{}, fmt.Errorf("counting the sellers per day: %w", err)
	}

	out := Summary{
		Active: int(counts.Active), Pending: int(counts.Pending), Blocked: int(counts.Blocked), Opened: int(counts.Opened),
		Latest: make([]Opened, 0, len(rows)),
		PerDay: make([]StatusDay, 0, len(days)),
	}

	for _, r := range rows {
		out.Latest = append(out.Latest, Opened{ID: r.ID, Name: r.Name, OpenedAt: r.CreatedAt})
	}

	for _, d := range days {
		out.PerDay = append(out.PerDay, StatusDay{
			Day: d.Day.In(platform.Vietnam), Active: int(d.Active), Pending: int(d.Pending), Blocked: int(d.Blocked),
		})
	}

	return out, nil
}
