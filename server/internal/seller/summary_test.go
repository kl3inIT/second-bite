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

	// Sellers are opened active, so one is put back to rejected by hand.
	if _, err := pool.Exec(t.Context(), "UPDATE seller_sellers SET status = 'rejected', status_reason = $2 WHERE id = $1", ids[1], blockReason); err != nil {
		t.Fatal(err)
	}

	// From 1 to 5 September, in Vietnam time.
	from := time.Date(2026, 9, 1, 0, 0, 0, 0, platform.Vietnam)
	to := from.AddDate(0, 0, 5)

	got, err := f.sellers.Summary(admin, from, to)
	if err != nil {
		t.Fatal(err)
	}

	if got.Active != 4 || got.Pending != 0 || got.Rejected != 1 || got.Blocked != 1 || got.Opened != 5 {
		t.Errorf("counts %+v, want 4 active, 1 rejected, 1 blocked, 5 opened in the range", got)
	}

	want := seller.Opened{ID: ids[5], Name: shop.Name, OpenedAt: september9am(5)}
	if len(got.Latest) != 5 || got.Latest[0].ID != want.ID || got.Latest[0].Name != want.Name ||
		!got.Latest[0].OpenedAt.Equal(want.OpenedAt) || got.Latest[4].ID != ids[1] {
		t.Errorf("the newest %+v, want the last five opened, newest first", got.Latest)
	}

	if _, err := f.sellers.Summary(f.as(t, "owner", platform.RoleCustomer), from, to); !errors.Is(err, platform.ErrAdminRequired) {
		t.Errorf("an owner reading the summary: %v, want ErrAdminRequired", err)
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
