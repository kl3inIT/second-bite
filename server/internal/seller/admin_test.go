package seller_test

import (
	"context"
	"errors"
	"strings"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/platform/platformtest"
	"github.com/kl3inIT/second-bite/server/internal/seller"
)

// TestAdmin checks what admins do to sellers (SEC-75) on a database of its
// own, since the list counts every seller in it.
func TestAdmin(t *testing.T) {
	t.Parallel()

	pool := platformtest.StartPostgres(t)
	f := newFixture(t, pool)

	// The listeners are known, so each change writes the job that tells the
	// owner; they do not run here.
	seller.RegisterListeners(f.events, f.sellers)

	// One after another: the list counts the sellers the other checks open.
	t.Run("every action from every status", func(t *testing.T) { //nolint:paralleltest // see above
		checkTransitions(t, pool, f)
	})
	t.Run("a reason is checked", func(t *testing.T) { //nolint:paralleltest // see above
		checkReasons(t, f)
	})
	t.Run("the list searches without marks", func(t *testing.T) { //nolint:paralleltest // see above
		checkSearch(t, pool, f)
	})
	t.Run("the list pages and refuses bad filters", func(t *testing.T) { //nolint:paralleltest // see above
		checkPaging(t, f)
	})
	t.Run("the list filters by the last change", func(t *testing.T) { //nolint:paralleltest // see above
		checkChanged(t, pool, f)
	})
	t.Run("the list counts each day", func(t *testing.T) { //nolint:paralleltest // see above
		checkDays(t, pool, f)
	})
}

// checkChanged: a seller last changed on 10 January 2026 is kept by a range
// holding that time and left out by one after it, the cards following; a
// range that ends before it starts is refused.
func checkChanged(t *testing.T, pool *pgxpool.Pool, f fixture) {
	t.Helper()

	admin := f.as(t, "admin", platform.RoleAdmin)
	owner := f.as(t, "changed.owner", platform.RoleCustomer)
	id := openNamed(owner, t, pool, f, "Quán Đổi Tháng Giêng", "0977 000 111", seller.StatusActive)

	if _, err := pool.Exec(t.Context(), `UPDATE seller_sellers SET updated_at = '2026-01-10T10:00:00+07:00' WHERE id = $1`, id); err != nil {
		t.Fatal(err)
	}

	at := func(s string) *time.Time {
		v, err := time.Parse(time.RFC3339, s)
		if err != nil {
			t.Fatal(err)
		}

		return &v
	}

	within, err := f.sellers.List(admin, seller.Filter{
		Query: "0977000111", ChangedSince: at("2026-01-10T00:00:00+07:00"), ChangedUntil: at("2026-01-11T00:00:00+07:00"), Page: 1, Size: 10,
	})
	if err != nil || within.Total != 1 || within.Sellers[0].ID != id || within.Counts[seller.StatusActive] != 1 {
		t.Errorf("changed within the day: total %d, counts %v, %v", within.Total, within.Counts, err)
	}

	after, err := f.sellers.List(admin, seller.Filter{Query: "0977000111", ChangedSince: at("2026-01-10T10:00:01+07:00"), Page: 1, Size: 10})
	if err != nil || after.Total != 0 || after.Counts[seller.StatusActive] != 0 {
		t.Errorf("changed after it: total %d, counts %v, %v", after.Total, after.Counts, err)
	}

	backwards := seller.Filter{ChangedSince: at("2026-01-11T00:00:00+07:00"), ChangedUntil: at("2026-01-10T00:00:00+07:00"), Page: 1, Size: 10}
	if _, err := f.sellers.List(admin, backwards); !errors.Is(err, seller.ErrListInvalid) {
		t.Errorf("a range ending before it starts: %v, want ErrListInvalid", err)
	}
}

// checkDays: after a block, today's counts are the sellers' as they stand; a
// day with no change stands as the day before, and no day comes before the
// first one counted.
func checkDays(t *testing.T, pool *pgxpool.Pool, f fixture) {
	t.Helper()

	admin := f.as(t, "admin", platform.RoleAdmin)
	id := sellerIn(t, pool, f, seller.StatusActive)

	if _, err := f.sellers.Block(admin, id, blockReason); err != nil {
		t.Fatal(err)
	}

	var active, blocked int
	if err := pool.QueryRow(t.Context(), `SELECT count(*) FILTER (WHERE status = 'active'), count(*) FILTER (WHERE status = 'blocked')
		FROM seller_sellers`).Scan(&active, &blocked); err != nil {
		t.Fatal(err)
	}

	if _, err := pool.Exec(t.Context(), `INSERT INTO seller_status_days (day, pending, active, rejected, blocked)
		VALUES ((now() AT TIME ZONE 'Asia/Ho_Chi_Minh')::date - 5, 0, 7, 0, 3)`); err != nil {
		t.Fatal(err)
	}

	page, err := f.sellers.List(admin, seller.Filter{Page: 1, Size: 1})
	if err != nil || len(page.Days) != 6 {
		t.Fatalf("the days: %d, %v; want the 6 from the one inserted to today", len(page.Days), err)
	}

	today := page.Days[5]
	if today.Counts[seller.StatusActive] != active || today.Counts[seller.StatusBlocked] != blocked {
		t.Errorf("today: %v; want %d active and %d blocked", today.Counts, active, blocked)
	}

	for _, d := range page.Days[:5] {
		if d.Counts[seller.StatusActive] != 7 || d.Counts[seller.StatusBlocked] != 3 {
			t.Errorf("%s stands as the day inserted: %v", d.Day.Format(time.DateOnly), d.Counts)
		}
	}

	if got := page.Days[1].Day.Sub(page.Days[0].Day); got != 24*time.Hour {
		t.Errorf("the days follow one another: %v apart", got)
	}
}

type transition struct {
	name   string
	do     func(context.Context, uuid.UUID) (seller.Seller, error)
	from   seller.Status
	to     seller.Status // empty when refused
	action string
}

func checkTransitions(t *testing.T, pool *pgxpool.Pool, f fixture) {
	t.Helper()

	admin := f.as(t, "admin", platform.RoleAdmin)
	approve := f.sellers.Approve
	reject := func(ctx context.Context, id uuid.UUID) (seller.Seller, error) {
		return f.sellers.Reject(ctx, id, blockReason)
	}
	block := func(ctx context.Context, id uuid.UUID) (seller.Seller, error) {
		return f.sellers.Block(ctx, id, blockReason)
	}

	for _, tt := range []transition{
		{"approve a pending seller", approve, seller.StatusPending, seller.StatusActive, "seller.approve"},
		{"approve a rejected seller", approve, seller.StatusRejected, seller.StatusActive, "seller.approve"},
		{"approve a blocked seller", approve, seller.StatusBlocked, seller.StatusActive, "seller.unblock"},
		{"approve an active seller", approve, seller.StatusActive, "", ""},
		{"reject a pending seller", reject, seller.StatusPending, seller.StatusRejected, "seller.reject"},
		{"reject an active seller", reject, seller.StatusActive, "", ""},
		{"reject a rejected seller", reject, seller.StatusRejected, "", ""},
		{"reject a blocked seller", reject, seller.StatusBlocked, "", ""},
		{"block an active seller", block, seller.StatusActive, seller.StatusBlocked, "seller.block"},
		{"block a pending seller", block, seller.StatusPending, "", ""},
		{"block a rejected seller", block, seller.StatusRejected, "", ""},
		{"block a blocked seller", block, seller.StatusBlocked, "", ""},
	} {
		t.Run(tt.name, func(t *testing.T) {
			id := sellerIn(t, pool, f, tt.from)

			got, err := tt.do(admin, id)
			if tt.to == "" {
				if !errors.Is(err, seller.ErrStatusChangeNotAllowed) {
					t.Fatalf("%v, want ErrStatusChangeNotAllowed", err)
				}

				checkRecorded(t, pool, id, "", 0)

				return
			}

			if err != nil || got.Status != tt.to {
				t.Fatalf("%+v, %v; want %s", got.Status, err, tt.to)
			}

			if wantReason := tt.to != seller.StatusActive; (got.StatusReason == blockReason) != wantReason {
				t.Errorf("reason %q after %s", got.StatusReason, tt.name)
			}

			checkRecorded(t, pool, id, tt.action, 1)
		})
	}

	checkOwnerless(admin, t, pool, f)

	customer := f.as(t, "customer", platform.RoleCustomer)
	if _, err := f.sellers.Approve(customer, sellerIn(t, pool, f, seller.StatusPending)); !errors.Is(err, platform.ErrAdminRequired) {
		t.Errorf("a customer approving: %v", err)
	}

	if _, err := f.sellers.Approve(admin, uuid.New()); !errors.Is(err, seller.ErrNotFound) {
		t.Errorf("approving an unknown seller: %v", err)
	}
}

// checkOwnerless: a seller whose owner deleted their account has no one to run
// it, so approving it is refused from every status it may stand in, its status
// kept and nothing recorded (SEC-65).
func checkOwnerless(admin context.Context, t *testing.T, pool *pgxpool.Pool, f fixture) {
	t.Helper()

	for _, from := range []seller.Status{seller.StatusBlocked, seller.StatusPending, seller.StatusRejected} {
		t.Run("approve an owner-less "+string(from)+" seller", func(t *testing.T) {
			id := sellerIn(t, pool, f, from)
			if _, err := pool.Exec(t.Context(), `DELETE FROM seller_members WHERE seller_id = $1`, id); err != nil {
				t.Fatal(err)
			}

			if _, err := f.sellers.Approve(admin, id); !errors.Is(err, seller.ErrOwnerless) {
				t.Fatalf("%v, want ErrOwnerless", err)
			}

			if s, err := f.sellers.Get(admin, id); err != nil || s.Status != from {
				t.Errorf("after the refusal: %+v, %v; want %s", s.Status, err, from)
			}

			checkRecorded(t, pool, id, "", 0)
		})
	}
}

// sellerIn opens a seller and puts it in status, as earlier admins' actions
// would have.
func sellerIn(t *testing.T, pool *pgxpool.Pool, f fixture, status seller.Status) uuid.UUID {
	t.Helper()

	s, err := f.sellers.Open(f.as(t, "owner."+uuid.NewString()[:8], platform.RoleCustomer), shop)
	if err != nil {
		t.Fatal(err)
	}

	if _, err := pool.Exec(t.Context(), `UPDATE seller_sellers SET status = $2,
		status_reason = CASE WHEN $2 IN ('rejected', 'blocked') THEN 'Một lý do trước đây' END WHERE id = $1`,
		s.ID, string(status)); err != nil {
		t.Fatal(err)
	}

	return s.ID
}

// checkRecorded checks the seller's audit events and the jobs that tell its
// owner: want of each, the event being action.
func checkRecorded(t *testing.T, pool *pgxpool.Pool, id uuid.UUID, action string, want int) {
	t.Helper()

	var events, jobs int

	var last string
	if err := pool.QueryRow(t.Context(), `SELECT
		(SELECT count(*) FROM audit_events WHERE resource_type = 'seller' AND resource_id = $1::text),
		(SELECT coalesce(max(action), '') FROM audit_events WHERE resource_type = 'seller' AND resource_id = $1::text),
		(SELECT count(*) FROM river_job WHERE args->>'event' = 'seller.status_changed' AND args->'payload'->>'sellerId' = $1::text)`,
		id).Scan(&events, &last, &jobs); err != nil {
		t.Fatal(err)
	}

	if events != want || jobs != want || last != action {
		t.Errorf("%d audit events (the last %q) and %d jobs to tell the owner; want %d, %q, %d", events, last, jobs, want, action, want)
	}
}

func checkReasons(t *testing.T, f fixture) {
	t.Helper()

	admin := f.as(t, "admin", platform.RoleAdmin)

	for name, reason := range map[string]string{
		"too short":           "Quá hạn",
		"too long":            strings.Repeat("a", 501),
		"only spaces":         "            ",
		"a control character": "Bán đồ quá hạn\x00 nhiều lần",
		"short once trimmed":  "   Quá hạn   ",
	} {
		if _, err := f.sellers.Block(admin, uuid.New(), reason); !errors.Is(err, seller.ErrReasonInvalid) {
			t.Errorf("a reason %s: %v, want ErrReasonInvalid", name, err)
		}
	}
}

func checkSearch(t *testing.T, pool *pgxpool.Pool, f fixture) {
	t.Helper()

	admin := f.as(t, "admin", platform.RoleAdmin)
	owner := f.as(t, "list.owner", platform.RoleCustomer)

	bakery := openNamed(owner, t, pool, f, "Tiệm Bánh Đồng Xuân", "0987 111 222", seller.StatusPending)
	rice := openNamed(owner, t, pool, f, "Cơm Gà 100%", "0987 333 444", seller.StatusActive)

	checkSortAndCounts(t, f, bakery, rice)

	page, err := f.sellers.List(admin, seller.Filter{Query: "banh dong xuan", Page: 1, Size: 10})
	if err != nil || page.Total != 1 || len(page.Sellers) != 1 || page.Sellers[0].ID != bakery {
		t.Fatalf("words without marks: %+v, %v", page, err)
	}

	if page.Sellers[0].OwnerEmail != f.mail("list.owner") {
		t.Errorf("the owner's address %q", page.Sellers[0].OwnerEmail)
	}

	for name, filter := range map[string]seller.Filter{
		"by phone digits":            {Query: "0987111", Page: 1, Size: 10},
		"with marks and capitals":    {Query: "BÁNH ĐỒNG", Page: 1, Size: 10},
		"pending only":               {Statuses: []seller.Status{seller.StatusPending}, Query: "đồng xuân", Page: 1, Size: 10},
		"a percent sign is a letter": {Query: "%", Page: 1, Size: 10},
	} {
		page, err := f.sellers.List(admin, filter)
		if err != nil || page.Total != 1 {
			t.Errorf("%s: total %d, %v; want 1", name, page.Total, err)
		}
	}
}

// openNamed opens a seller with name and phone for owner, in status.
func openNamed(owner context.Context, t *testing.T, pool *pgxpool.Pool, f fixture, name, phone string, status seller.Status) uuid.UUID {
	t.Helper()

	d := shop
	d.Name, d.Phone = name, phone

	s, err := f.sellers.Open(owner, d)
	if err != nil {
		t.Fatal(err)
	}

	if _, err := pool.Exec(t.Context(), `UPDATE seller_sellers SET status = $2 WHERE id = $1`, s.ID, string(status)); err != nil {
		t.Fatal(err)
	}

	return s.ID
}

func checkPaging(t *testing.T, f fixture) {
	t.Helper()

	admin := f.as(t, "admin", platform.RoleAdmin)

	every, err := f.sellers.List(admin, seller.Filter{Page: 1, Size: 100})
	if err != nil || every.Total < 2 || len(every.Sellers) != every.Total {
		t.Fatalf("every seller: %d of %d, %v", len(every.Sellers), every.Total, err)
	}

	first, err := f.sellers.List(admin, seller.Filter{Page: 1, Size: 1})
	if err != nil || first.Total != every.Total || len(first.Sellers) != 1 || first.Sellers[0].Status != seller.StatusPending {
		t.Errorf("one per page: total %d (want %d), first %+v, %v; want a pending seller first", first.Total, every.Total, first.Sellers, err)
	}

	past, err := f.sellers.List(admin, seller.Filter{Page: 1000, Size: 10})
	if err != nil || len(past.Sellers) != 0 || past.Total != every.Total {
		t.Errorf("past the end: %d sellers, total %d, %v; want none of %d", len(past.Sellers), past.Total, err, every.Total)
	}

	checkBadFilters(t, f)
}

// checkBadFilters: filters out of bounds and customers are refused.
func checkBadFilters(t *testing.T, f fixture) {
	t.Helper()

	admin := f.as(t, "admin", platform.RoleAdmin)

	for name, filter := range map[string]seller.Filter{
		"page 0":         {Page: 0, Size: 10},
		"size 101":       {Page: 1, Size: 101},
		"unknown status": {Statuses: []seller.Status{"closed"}, Page: 1, Size: 10},
	} {
		if _, err := f.sellers.List(admin, filter); !errors.Is(err, seller.ErrListInvalid) {
			t.Errorf("%s: %v, want ErrListInvalid", name, err)
		}
	}

	customer := f.as(t, "list.customer", platform.RoleCustomer)
	if _, err := f.sellers.List(customer, seller.Filter{Page: 1, Size: 10}); !errors.Is(err, platform.ErrAdminRequired) {
		t.Errorf("a customer listing: %v", err)
	}
}

// checkSortAndCounts: the two sellers whose phones hold 0987 sort by name
// both ways, and the counts name one of each status whatever the status
// asked.
func checkSortAndCounts(t *testing.T, f fixture, bakery, rice uuid.UUID) {
	t.Helper()

	admin := f.as(t, "admin", platform.RoleAdmin)

	for sort, first := range map[string]uuid.UUID{"name": rice, "-name": bakery, "": bakery} {
		page, err := f.sellers.List(admin, seller.Filter{Query: "0987", Sort: sort, Page: 1, Size: 10})
		if err != nil || len(page.Sellers) != 2 || page.Sellers[0].ID != first {
			t.Errorf("sorted %q: %+v, %v", sort, page.Sellers, err)
		}
	}

	page, err := f.sellers.List(admin, seller.Filter{
		Statuses: []seller.Status{seller.StatusBlocked}, Query: "0987", Page: 1, Size: 10,
	})
	if err != nil || page.Total != 0 || page.Counts[seller.StatusPending] != 1 || page.Counts[seller.StatusActive] != 1 ||
		page.Counts[seller.StatusRejected] != 0 || page.Counts[seller.StatusBlocked] != 0 {
		t.Errorf("counts while listing the blocked: %+v, total %d, %v", page.Counts, page.Total, err)
	}

	if _, err := f.sellers.List(admin, seller.Filter{Sort: "phone", Page: 1, Size: 10}); !errors.Is(err, seller.ErrListInvalid) {
		t.Errorf("sorting by phone: %v, want ErrListInvalid", err)
	}
}
