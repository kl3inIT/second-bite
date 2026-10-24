package seller_test

import (
	"errors"
	"strings"
	"testing"
	"time"

	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/platform/platformtest"
	"github.com/kl3inIT/second-bite/server/internal/seller"
)

// TestFeedback checks what a store's people tell the team (SEC-82): the owner
// and staff send it, nobody else does; it is checked and bounded to 20 a day;
// admins read it by days and store, the latest first.
func TestFeedback(t *testing.T) {
	t.Parallel()

	pool := platformtest.StartPostgres(t)
	f := newFixture(t, pool)

	owner := f.as(t, "fb.owner", platform.RoleCustomer)
	staff := f.as(t, "fb.staff", platform.RoleCustomer)
	stranger := f.as(t, "fb.stranger", platform.RoleCustomer)
	admin := f.as(t, "fb.admin", platform.RoleAdmin)

	store, err := f.sellers.Open(owner, shop)
	if err != nil {
		t.Fatal(err)
	}

	other, err := f.sellers.Open(stranger, shop)
	if err != nil {
		t.Fatal(err)
	}

	if _, err := f.sellers.AddStaff(owner, store.ID, f.mail("fb.staff")); err != nil {
		t.Fatal(err)
	}

	if err := f.sellers.SendFeedback(owner, store.ID, "  Lúc đông khách khó tìm nút Đã giao.  "); err != nil {
		t.Fatalf("the owner: %v", err)
	}

	if err := f.sellers.SendFeedback(staff, store.ID, "Muốn đăng cả túi bánh cuối ngày một giá."); err != nil {
		t.Fatalf("staff: %v", err)
	}

	if err := f.sellers.SendFeedback(stranger, other.ID, "Quán khác góp ý."); err != nil {
		t.Fatal(err)
	}

	for name, err := range map[string]error{
		"a stranger":         f.sellers.SendFeedback(stranger, store.ID, "Không phải quán mình"),
		"an admin outside":   f.sellers.SendFeedback(admin, store.ID, "Admin không nói thay quán"),
		"an unknown seller":  f.sellers.SendFeedback(owner, uuid.New(), "Không có quán này"),
		"signed out (guest)": f.sellers.SendFeedback(t.Context(), store.ID, "Khách vãng lai"),
	} {
		if !errors.Is(err, seller.ErrNotFound) && !errors.Is(err, platform.ErrAuthenticationRequired) {
			t.Errorf("%s: %v", name, err)
		}
	}

	for name, text := range map[string]string{"blank": "   ", "too long": strings.Repeat("ế", 1001), "a control char": "khó\x00dùng"} {
		if err := f.sellers.SendFeedback(owner, store.ID, text); !errors.Is(err, seller.ErrFeedbackInvalid) {
			t.Errorf("%s: %v, want ErrFeedbackInvalid", name, err)
		}
	}

	checkFeedbackList(t, f, store.ID)
	checkFeedbackBound(t, f, store.ID)
}

// checkFeedbackList: admins read the feedback of the week, the latest first,
// trimmed and with its store; of one store; none for days before it; customers
// and backward ranges are refused.
func checkFeedbackList(t *testing.T, f fixture, storeID uuid.UUID) {
	t.Helper()

	admin := f.as(t, "fb.admin", platform.RoleAdmin)
	owner := f.as(t, "fb.owner", platform.RoleCustomer)
	now := time.Now()
	week := seller.FeedbackFilter{Since: now.AddDate(0, 0, -7), Until: now.Add(time.Hour)}

	all, err := f.sellers.FeedbackForAdmins(admin, week)
	if err != nil || len(all) != 3 {
		t.Fatalf("every store's: %d, %v; want 3", len(all), err)
	}

	week.SellerID = storeID

	mine, err := f.sellers.FeedbackForAdmins(admin, week)
	if err != nil || len(mine) != 2 || mine[0].Text != "Muốn đăng cả túi bánh cuối ngày một giá." ||
		mine[1].Text != "Lúc đông khách khó tìm nút Đã giao." || mine[0].SellerName == "" || mine[0].SentAt.Before(mine[1].SentAt) {
		t.Errorf("one store's, the latest first: %+v, %v", mine, err)
	}

	if before, err := f.sellers.FeedbackForAdmins(admin, seller.FeedbackFilter{Since: now.AddDate(0, 0, -9), Until: now.AddDate(0, 0, -8)}); err != nil || len(before) != 0 {
		t.Errorf("days before any feedback: %d, %v", len(before), err)
	}

	if _, err := f.sellers.FeedbackForAdmins(owner, week); !errors.Is(err, platform.ErrAdminRequired) {
		t.Errorf("a customer reading: %v", err)
	}

	if _, err := f.sellers.FeedbackForAdmins(admin, seller.FeedbackFilter{Since: now, Until: now.Add(-time.Hour)}); !errors.Is(err, seller.ErrFeedbackListInvalid) {
		t.Errorf("a range ending before it starts: %v", err)
	}
}

// checkFeedbackBound: a store sends at most 20 a day.
func checkFeedbackBound(t *testing.T, f fixture, storeID uuid.UUID) {
	t.Helper()

	owner := f.as(t, "fb.owner", platform.RoleCustomer)

	// Two were sent already.
	for i := range 18 {
		if err := f.sellers.SendFeedback(owner, storeID, "Góp ý số "+strings.Repeat("I", i+1)); err != nil {
			t.Fatalf("feedback %d: %v", i+3, err)
		}
	}

	if err := f.sellers.SendFeedback(owner, storeID, "Góp ý thứ 21"); !errors.Is(err, seller.ErrFeedbackLimitReached) {
		t.Errorf("the 21st in a day: %v, want ErrFeedbackLimitReached", err)
	}
}
