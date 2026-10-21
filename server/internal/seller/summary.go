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
// each status now, how many were opened in a range, and the newest.
type Summary struct {
	Active   int
	Pending  int
	Rejected int
	Blocked  int
	// Opened counts the sellers opened in the range, whatever their status.
	Opened int
	// Latest are the five sellers opened last, whenever that was, newest
	// first.
	Latest []Opened
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

	out := Summary{
		Active: int(counts.Active), Pending: int(counts.Pending), Rejected: int(counts.Rejected), Blocked: int(counts.Blocked),
		Opened: int(counts.Opened),
		Latest: make([]Opened, 0, len(rows)),
	}

	for _, r := range rows {
		out.Latest = append(out.Latest, Opened{ID: r.ID, Name: r.Name, OpenedAt: r.CreatedAt})
	}

	return out, nil
}
