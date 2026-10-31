package identity

import (
	"context"
	"fmt"
	"time"

	"github.com/kl3inIT/second-bite/server/internal/identity/internal/db"
)

// AccountDay is how many accounts were created on a day, for the admin's
// report (SEC-192).
type AccountDay struct {
	// Day is the day in Vietnam, as midnight UTC of that date.
	Day      time.Time
	Accounts int
}

// AccountDays counts the accounts created in [since, until), per day in
// Vietnam, and the accounts there are that were created before until. A
// deleted account is counted on no day.
func (s *Service) AccountDays(ctx context.Context, since, until time.Time) ([]AccountDay, int, error) {
	rows, err := s.queries.AccountDays(ctx, db.AccountDaysParams{Since: since, Until: until})
	if err != nil {
		return nil, 0, fmt.Errorf("counting the new accounts: %w", err)
	}

	days := make([]AccountDay, len(rows))
	for i, r := range rows {
		days[i] = AccountDay{Day: r.Day.Time, Accounts: int(r.Accounts)}
	}

	total, err := s.queries.CountAccountsBefore(ctx, until)
	if err != nil {
		return nil, 0, fmt.Errorf("counting the accounts: %w", err)
	}

	return days, int(total), nil
}
