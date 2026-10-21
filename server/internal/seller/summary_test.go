package seller_test

import (
	"errors"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/platform/platformtest"
	"github.com/kl3inIT/second-bite/server/internal/seller"
)

// september9am is 09:00 in Vietnam on a day of September 2026; day 0 is
// 31 August.
func september9am(day int) time.Time {
	return time.Date(2026, 9, day, 9, 0, 0, 0, platform.Vietnam)
}

// TestSummary counts sellers for the admins' dashboard on a database of its
// own, since it counts every seller: by status now, opened in the range, and
// the newest five whenever they were opened.
func TestSummary(t *testing.T) {
	t.Parallel()

	pool := platformtest.StartPostgres(t)
	f := newFixture(t, pool)
	admin := f.as(t, "admin", platform.RoleAdmin)
	ids := openSixSellers(t, pool, f)

	if _, err := f.sellers.Block(admin, ids[0], blockReason); err != nil {
		t.Fatal(err)
	}

	changeStatuses(t, pool, ids)

	// From 1 to 5 September, in Vietnam time.
	from := time.Date(2026, 9, 1, 0, 0, 0, 0, platform.Vietnam)
	to := from.AddDate(0, 0, 5)

	got, err := f.sellers.Summary(admin, from, to)
	if err != nil {
		t.Fatal(err)
	}

	if got.Active != 3 || got.Pending != 1 || got.Rejected != 1 || got.Blocked != 1 || got.Opened != 5 {
		t.Errorf("counts %+v, want 3 active, 1 pending, 1 rejected, 1 blocked, 5 opened in the range", got)
	}

	checkStatusPerDay(t, got.PerDay, from)

	want := seller.Opened{ID: ids[5], Name: shop.Name, OpenedAt: september9am(5)}
	if len(got.Latest) != 5 || got.Latest[0].ID != want.ID || got.Latest[0].Name != want.Name ||
		!got.Latest[0].OpenedAt.Equal(want.OpenedAt) || got.Latest[4].ID != ids[1] {
		t.Errorf("the newest %+v, want the last five opened, newest first", got.Latest)
	}

	if _, err := f.sellers.Summary(f.as(t, "owner", platform.RoleCustomer), from, to); !errors.Is(err, platform.ErrAdminRequired) {
		t.Errorf("an owner reading the summary: %v, want ErrAdminRequired", err)
	}
}

// checkStatusPerDay checks the sellers in each status at the end of each day
// from 1 to 5 September, after changeStatuses: the first seller active until
// blocked on the 3rd; the second pending until approved on the 4th; the
// third pending throughout; the fourth pending until rejected on the 4th; the
// others active from the day they were opened.
func checkStatusPerDay(t *testing.T, got []seller.StatusDay, from time.Time) {
	t.Helper()

	want := []seller.StatusDay{
		{Day: from, Active: 1, Pending: 1},
		{Day: from.AddDate(0, 0, 1), Active: 1, Pending: 2},
		{Day: from.AddDate(0, 0, 2), Pending: 3, Blocked: 1},
		{Day: from.AddDate(0, 0, 3), Active: 2, Pending: 1, Rejected: 1, Blocked: 1},
		{Day: from.AddDate(0, 0, 4), Active: 3, Pending: 1, Rejected: 1, Blocked: 1},
	}
	if len(got) != len(want) {
		t.Fatalf("per day %+v, want the five days of the range", got)
	}

	for i, w := range want {
		if d := got[i]; !d.Day.Equal(w.Day) || d.Active != w.Active || d.Pending != w.Pending ||
			d.Rejected != w.Rejected || d.Blocked != w.Blocked {
			t.Errorf("day %d: %+v, want %+v", i, d, w)
		}
	}
}

// changeStatuses dates the block of the first seller to 3 September, and
// makes the second one opened pending before SEC-57 and activated on 4
// September, the third one opened pending and never approved, and the fourth
// opened pending and rejected on 4 September.
func changeStatuses(t *testing.T, pool *pgxpool.Pool, ids []uuid.UUID) {
	t.Helper()

	for _, change := range []struct {
		id        uuid.UUID
		status    string
		changedAt *time.Time
	}{
		{ids[0], "blocked", new(time.Date(2026, 9, 3, 12, 0, 0, 0, platform.Vietnam))},
		{ids[1], "active", new(time.Date(2026, 9, 4, 10, 0, 0, 0, platform.Vietnam))},
		{ids[2], "pending", nil},
		{ids[3], "rejected", new(time.Date(2026, 9, 4, 15, 0, 0, 0, platform.Vietnam))},
	} {
		if _, err := pool.Exec(t.Context(), "UPDATE seller_sellers SET status = $2, status_changed_at = $3 WHERE id = $1",
			change.id, change.status, change.changedAt); err != nil {
			t.Fatal(err)
		}
	}
}

// openSixSellers opens six sellers for two owners, since an owner owns at
// most five, one a day from 31 August, oldest first.
func openSixSellers(t *testing.T, pool *pgxpool.Pool, f fixture) []uuid.UUID {
	t.Helper()

	owner, other := f.as(t, "owner", platform.RoleCustomer), f.as(t, "other", platform.RoleCustomer)

	ids := make([]uuid.UUID, 0, 6)

	for i := range 6 {
		by := owner
		if i >= 4 {
			by = other
		}

		s, err := f.sellers.Open(by, shop)
		if err != nil {
			t.Fatal(err)
		}

		if _, err := pool.Exec(t.Context(), "UPDATE seller_sellers SET created_at = $2 WHERE id = $1", s.ID, september9am(i)); err != nil {
			t.Fatal(err)
		}

		ids = append(ids, s.ID)
	}

	return ids
}
