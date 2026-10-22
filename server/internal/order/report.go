package order

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/order/internal/db"
)

// DayCounts is how one seller's orders of one collection day ended, for the
// admin's report (SEC-80). An order still open is counted as held only.
type DayCounts struct {
	// Day is the collection day in Vietnam, as midnight UTC of that date.
	Day                       time.Time
	SellerID                  uuid.UUID
	Held, UnitsHeld           int
	Collected, UnitsCollected int
	// CollectedVND is what the collected orders came to at the counter.
	CollectedVND                int64
	Cancelled, Refused, Expired int
}

// OrderDays counts the orders whose window starts in [since, until), per
// collection day and seller; one seller's only when sellerID is set. An order
// confirmed or ready whose window is over counts as expired.
func (s *Service) OrderDays(ctx context.Context, since, until time.Time, sellerID *uuid.UUID) ([]DayCounts, error) {
	params := db.OrderDaysParams{Since: since, Until: until}
	if sellerID != nil {
		params.SellerID = uuid.NullUUID{UUID: *sellerID, Valid: true}
	}

	rows, err := s.queries.OrderDays(ctx, params)
	if err != nil {
		return nil, fmt.Errorf("counting the orders: %w", err)
	}

	days := make([]DayCounts, len(rows))
	for i, r := range rows {
		days[i] = DayCounts{
			Day: r.Day.Time, SellerID: r.SellerID,
			Held: int(r.Held), UnitsHeld: int(r.UnitsHeld),
			Collected: int(r.Collected), UnitsCollected: int(r.UnitsCollected), CollectedVND: r.CollectedVnd,
			Cancelled: int(r.Cancelled), Refused: int(r.Refused), Expired: int(r.Expired),
		}
	}

	return days, nil
}
