package seller

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgtype"

	"github.com/kl3inIT/second-bite/server/internal/seller/internal/db"
)

// trendDays is how many days the admins' cards draw (Figma AD-Q1 › Sparkline · 14 ngày).
const trendDays = 14

// vietnam is the zone a day is counted in.
var vietnam = time.FixedZone("Asia/Ho_Chi_Minh", 7*60*60)

// StatusDay is how many sellers stood in each status at the end of Day, or
// now for today.
type StatusDay struct {
	Day    time.Time
	Counts map[Status]int
}

// recordStatusDay keeps today's counts after a change in q's transaction.
// The lock makes a change that commits later count the ones before it.
func recordStatusDay(ctx context.Context, q *db.Queries) error {
	if err := q.LockStatusDays(ctx); err != nil {
		return fmt.Errorf("locking the day's counts: %w", err)
	}

	if err := q.RecordStatusDay(ctx); err != nil {
		return fmt.Errorf("keeping the day's counts: %w", err)
	}

	return nil
}

// statusDays answers how many sellers stood in each status on each of the
// last days in Vietnam, today the last. A day with no change stands as the
// day before; the days before counting started are left out, so nothing is
// made up.
func (s *Service) statusDays(ctx context.Context, days int) ([]StatusDay, error) {
	now := time.Now().In(vietnam)
	today := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, time.UTC)
	first := today.AddDate(0, 0, 1-days)

	rows, err := s.queries.StatusDays(ctx, pgtype.Date{Time: first, Valid: true})
	if err != nil {
		return nil, fmt.Errorf("reading the days' counts: %w", err)
	}

	out := make([]StatusDay, 0, days)
	next := 0

	var last *db.SellerStatusDay

	for day := first; !day.After(today); day = day.AddDate(0, 0, 1) {
		for next < len(rows) && !rows[next].Day.Time.After(day) {
			last = &rows[next]
			next++
		}

		if last == nil {
			continue
		}

		out = append(out, StatusDay{Day: day, Counts: map[Status]int{
			StatusPending: int(last.Pending), StatusActive: int(last.Active),
			StatusRejected: int(last.Rejected), StatusBlocked: int(last.Blocked),
		}})
	}

	return out, nil
}
