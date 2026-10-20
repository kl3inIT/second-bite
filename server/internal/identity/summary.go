package identity

import (
	"context"
	"fmt"
	"time"

	"github.com/kl3inIT/second-bite/server/internal/identity/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// Summary is what admins see of the accounts at a glance.
type Summary struct {
	// Total counts every account now, admins included; a deleted account is
	// gone from it.
	Total int
	// Created counts the accounts created in the range that still exist.
	Created int
	// CreatedPerDay holds the days of the range on which accounts were
	// created, in order; a day without any is absent.
	CreatedPerDay []platform.DayCount
}

// Summary returns the accounts' summary over [from, to), to admins.
func (s *Service) Summary(ctx context.Context, from, to time.Time) (Summary, error) {
	if _, err := platform.RequireAdmin(ctx); err != nil {
		return Summary{}, err
	}

	counts, err := s.queries.SummarizeAccounts(ctx, db.SummarizeAccountsParams{RangeStart: from, RangeEnd: to})
	if err != nil {
		return Summary{}, fmt.Errorf("counting the accounts: %w", err)
	}

	days, err := s.queries.CreatedPerDay(ctx, db.CreatedPerDayParams{RangeStart: from, RangeEnd: to})
	if err != nil {
		return Summary{}, fmt.Errorf("counting the accounts per day: %w", err)
	}

	out := Summary{Total: int(counts.Total), Created: int(counts.Created), CreatedPerDay: make([]platform.DayCount, 0, len(days))}
	for _, d := range days {
		out.CreatedPerDay = append(out.CreatedPerDay, platform.DayCount{Day: d.Day.In(platform.Vietnam), Count: int(d.Created)})
	}

	return out, nil
}
