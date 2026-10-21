package identity_test

import (
	"errors"
	"fmt"
	"testing"
	"time"

	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/identity"
	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/platform/platformtest"
)

// TestSummary counts accounts for the admins' dashboard on a database of its
// own, since it counts every account: those created in the range, per day in
// Vietnam time, and all of them.
func TestSummary(t *testing.T) {
	t.Parallel()

	pool := platformtest.StartPostgres(t)

	s, err := identity.NewService(pool, nil, nil, nil, identity.Config{CodeKey: make([]byte, 32)}, platformtest.Logger())
	if err != nil {
		t.Fatal(err)
	}

	day := func(d, hour, minute int) time.Time {
		return time.Date(2026, 9, d, hour, minute, 0, 0, platform.Vietnam)
	}

	// 00:30 on 1 September in Vietnam is still 31 August in UTC; the end of
	// the range is not in it.
	for i, created := range []time.Time{day(1, 0, 30), day(3, 12, 0), day(3, 23, 30), day(7, 23, 59), day(8, 0, 0), day(1, 0, 0).Add(-time.Minute)} {
		a, err := s.EnsureAccount(t.Context(), fmt.Sprintf("summary.%d.%s@example.com", i, uuid.NewString()[:8]))
		if err != nil {
			t.Fatal(err)
		}

		if _, err := pool.Exec(t.Context(), "UPDATE identity_accounts SET created_at = $2 WHERE id = $1", a.ID, created); err != nil {
			t.Fatal(err)
		}
	}

	admin := platform.WithCaller(t.Context(), platform.Caller{AccountID: uuid.New(), SessionID: uuid.New(), Role: platform.RoleAdmin})

	got, err := s.Summary(admin, day(1, 0, 0), day(8, 0, 0))
	if err != nil {
		t.Fatal(err)
	}

	want := identity.Summary{Total: 6, Created: 4, CreatedPerDay: []platform.DayCount{
		{Day: day(1, 0, 0), Count: 1}, {Day: day(3, 0, 0), Count: 2}, {Day: day(7, 0, 0), Count: 1},
	}}
	if fmt.Sprint(got) != fmt.Sprint(want) {
		t.Errorf("summary\n got %+v\nwant %+v", got, want)
	}

	customer := platform.WithCaller(t.Context(), platform.Caller{AccountID: uuid.New(), SessionID: uuid.New(), Role: platform.RoleCustomer})
	if _, err := s.Summary(customer, day(1, 0, 0), day(8, 0, 0)); !errors.Is(err, platform.ErrAdminRequired) {
		t.Errorf("a customer reading the summary: %v, want ErrAdminRequired", err)
	}
}
