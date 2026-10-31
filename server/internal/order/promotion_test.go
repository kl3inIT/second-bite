package order_test

import (
	"context"
	"errors"
	"fmt"
	"math/rand/v2"
	"testing"
	"time"

	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/order"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// phone is a number of its own for a check, so the orders of the checks
// running beside it never make it a returning customer's.
func phone() string { return fmt.Sprintf("09%08d", rand.IntN(100_000_000)) } //nolint:gosec // not a secret

// programme is the support programme of November 2026 for sellers: 10,000 VND
// off a new customer's order and 5,000 VND off a returning one's, from 30,000
// VND of dishes, once a day for each phone number.
func programme(budget int64, sellers ...uuid.UUID) order.Promotion {
	from30k := order.Condition{Attribute: order.AttributeSubtotal, Operator: order.OperatorGte, Values: []string{"30000"}}

	return order.Promotion{
		Name: "Hỗ trợ 2 tuần", StartsAt: time.Now().Add(-time.Hour), EndsAt: time.Now().Add(24 * time.Hour),
		SellerIDs: sellers, BudgetVND: budget, PerPhonePerDay: 1, Enabled: true,
		Rules: []order.Rule{
			{
				Name: "Khách mới",
				Conditions: []order.Condition{
					{Attribute: order.AttributeCustomer, Operator: order.OperatorEq, Values: []string{order.CustomerNew}}, from30k,
				},
				Reward: order.Reward{Type: order.RewardFixed, Value: 10_000},
			},
			{
				Name: "Khách quay lại",
				Conditions: []order.Condition{
					{Attribute: order.AttributeCustomer, Operator: order.OperatorEq, Values: []string{order.CustomerReturning}}, from30k,
				},
				Reward: order.Reward{Type: order.RewardFixed, Value: 5_000},
			},
		},
	}
}

func (f fixture) promote(t *testing.T, p order.Promotion) order.Promotion {
	t.Helper()

	created, err := f.orders.CreatePromotion(f.as(t, "admin", platform.RoleAdmin), p)
	if err != nil {
		t.Fatal(err)
	}

	return created
}

func (f fixture) placeFor(t *testing.T, number string, offerID uuid.UUID, units int) order.Order {
	t.Helper()

	o, err := f.orders.Place(t.Context(), key(), uuid.Nil, order.Contact{Name: "Lan", Phone: number}, []order.Wanted{{offerID, units}})
	if err != nil {
		t.Fatal(err)
	}

	return o
}

func discountOf(o order.Order) int64 {
	if o.Discount == nil {
		return 0
	}

	return o.Discount.AmountVND
}

func wantDiscount(t *testing.T, what string, o order.Order, amount int64) {
	t.Helper()

	if got := discountOf(o); got != amount || o.PayVND() != o.TotalVND-amount {
		t.Errorf("%s: discount %d, pay %d of %d; want discount %d", what, got, o.PayVND(), o.TotalVND, amount)
	}
}

// testPromotionDiscounts follows the programme's cases: a new customer's
// order, the limit of a day, an order too small, a cancelled order giving its
// discount back, and a returning customer the next day.
func testPromotionDiscounts(t *testing.T, f fixture) { //nolint:gocyclo // a check reads as one story
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	shop := f.shop(owner, t, "La Paris")
	croissant := f.post(owner, t, shop, "Croissant", 20, 20_000, time.Now())
	p := f.promote(t, programme(1_000_000, shop))
	lan := phone()

	first := f.placeFor(t, lan, croissant.ID, 2)
	wantDiscount(t, "a new customer's 40,000 VND", first, 10_000)

	if d := first.Discount; d == nil || d.PromotionID != p.ID || d.Promotion != "Hỗ trợ 2 tuần" || d.Rule != "Khách mới" || !d.NewCustomer {
		t.Errorf("the discount: %+v", first.Discount)
	}

	wantDiscount(t, "the same number again that day", f.placeFor(t, lan, croissant.ID, 2), 0)
	wantDiscount(t, "25,000 VND of dishes", f.placeFor(t, phone(), croissant.ID, 1), 0)

	if _, err := f.orders.Cancel(t.Context(), first.ID, first.Access, ""); err != nil {
		t.Fatal(err)
	}

	again := f.placeFor(t, lan, croissant.ID, 2)
	wantDiscount(t, "after the discounted order was cancelled", again, 10_000)

	if _, err := f.orders.HandOver(owner, again.ID); err != nil {
		t.Fatal(err)
	}

	// The next day: the orders of today were placed yesterday.
	if _, err := f.pool.Exec(t.Context(), `UPDATE order_orders SET created_at = created_at - interval '1 day' WHERE customer_phone = $1`, lan); err != nil {
		t.Fatal(err)
	}

	next := f.placeFor(t, lan, croissant.ID, 2)
	wantDiscount(t, "a returning customer the next day", next, 5_000)

	if next.Discount == nil || next.Discount.Rule != "Khách quay lại" || next.Discount.NewCustomer {
		t.Errorf("a returning customer's discount: %+v", next.Discount)
	}

	read, err := f.orders.Promotion(f.as(t, "admin", platform.RoleAdmin), p.ID)
	if err != nil {
		t.Fatal(err)
	}

	// Handed over: again's 10,000; still to collect: next's 5,000; cancelled: nothing.
	if u := read.Use; u.SpentVND != 10_000 || u.HeldVND != 5_000 || u.Orders != 2 || u.NewCustomers != 1 || u.Sellers != 1 {
		t.Errorf("use: %+v", read.Use)
	}
}

// testPromotionBudget runs a promotion out of budget: an order is discounted
// only while what is left covers it, and an order cancelled gives its
// discount back.
func testPromotionBudget(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	shop := f.shop(owner, t, "Panda Chef")
	bun := f.post(owner, t, shop, "Bánh bao", 20, 20_000, time.Now())
	f.promote(t, programme(15_000, shop))

	first := f.placeFor(t, phone(), bun.ID, 2)
	wantDiscount(t, "the first order", first, 10_000)
	wantDiscount(t, "5,000 VND left for a new customer's 10,000", f.placeFor(t, phone(), bun.ID, 2), 0)

	if _, err := f.orders.Cancel(t.Context(), first.ID, first.Access, ""); err != nil {
		t.Fatal(err)
	}

	wantDiscount(t, "the budget given back", f.placeFor(t, phone(), bun.ID, 2), 10_000)
}

// testPromotionBestRule places orders where two promotions run: the order
// takes the larger discount, and the other once the larger one's budget is
// spent; a promotion for some sellers leaves the others alone.
func testPromotionBestRule(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	shop := f.shop(owner, t, "La Paris")
	other := f.shop(owner, t, "Nét Huế")
	croissant := f.post(owner, t, shop, "Croissant", 20, 20_000, time.Now())
	bun := f.post(owner, t, other, "Bánh bèo", 20, 20_000, time.Now())

	f.promote(t, programme(1_000_000, shop))

	opening := programme(15_000, shop)
	opening.Name = "Mừng La Paris"
	opening.Rules = opening.Rules[:1]
	opening.Rules[0].Reward.Value = 15_000
	big := f.promote(t, opening)

	o := f.placeFor(t, phone(), croissant.ID, 2)
	wantDiscount(t, "the larger of two", o, 15_000)

	if o.Discount == nil || o.Discount.PromotionID != big.ID {
		t.Errorf("taken from %+v, want %s", o.Discount, big.ID)
	}

	wantDiscount(t, "the other once the larger is spent", f.placeFor(t, phone(), croissant.ID, 2), 10_000)
	wantDiscount(t, "a seller the promotions leave out", f.placeFor(t, phone(), bun.ID, 2), 0)
}

// testPromotionsForAdmins sets promotions up, changes and lists them, and
// pays sellers back, as admins only.
func testPromotionsForAdmins(t *testing.T, f fixture) { //nolint:gocyclo // a check reads as one story
	t.Helper()

	admin := f.as(t, "admin", platform.RoleAdmin)
	owner := f.as(t, "owner", platform.RoleCustomer)
	shop := f.shop(owner, t, "Tiệm bánh Pháp")
	croissant := f.post(owner, t, shop, "Croissant", 20, 20_000, time.Now())

	if _, err := f.orders.CreatePromotion(owner, programme(1_000, shop)); !errors.Is(err, platform.ErrAdminRequired) {
		t.Errorf("a customer sets a promotion up: %v", err)
	}

	for what, broken := range map[string]func(*order.Promotion){
		"no name":             func(p *order.Promotion) { p.Name = " " },
		"ends before it runs": func(p *order.Promotion) { p.EndsAt = p.StartsAt },
		"no seller":           func(p *order.Promotion) { p.SellerIDs = nil },
		"no rule":             func(p *order.Promotion) { p.Rules = nil },
		"a percentage uncapped": func(p *order.Promotion) {
			p.Rules[0].Reward = order.Reward{Type: order.RewardPercentage, Value: 10}
		},
		"an unknown customer": func(p *order.Promotion) { p.Rules[0].Conditions[0].Values = []string{"vip"} },
	} {
		p := programme(1_000, shop)
		broken(&p)

		if _, err := f.orders.CreatePromotion(admin, p); !errors.Is(err, order.ErrPromotionInvalid) {
			t.Errorf("%s: %v", what, err)
		}
	}

	p := f.promote(t, programme(1_000_000, shop))
	if p.Status(time.Now()) != order.PromotionRunning || len(p.SellerIDs) != 1 {
		t.Errorf("created %+v", p)
	}

	paused := programme(1_000_000, shop)
	paused.Enabled, paused.BudgetVND = false, 2_000_000

	changed, err := f.orders.ChangePromotion(admin, p.ID, paused)
	if err != nil || changed.Status(time.Now()) != order.PromotionPaused || changed.BudgetVND != 2_000_000 {
		t.Fatalf("changed %+v, %v", changed, err)
	}

	wantDiscount(t, "a paused promotion", f.placeFor(t, phone(), croissant.ID, 2), 0)

	if _, err := f.orders.ChangePromotion(admin, uuid.New(), paused); !errors.Is(err, order.ErrPromotionNotFound) {
		t.Errorf("changing none: %v", err)
	}

	page, err := f.orders.Promotions(admin, order.PromotionFilter{Status: order.PromotionPaused, SellerID: shop, Size: 10})
	if err != nil || page.Total != 1 || len(page.Promotions) != 1 || page.Counts[order.PromotionPaused] != 1 {
		t.Errorf("paused for the seller: %+v, %v", page, err)
	}

	if running, err := f.orders.RunningPromotions(t.Context(), []uuid.UUID{shop}); err != nil || len(running) != 0 {
		t.Errorf("running while paused: %d, %v", len(running), err)
	}

	paused.Enabled = true
	if _, err := f.orders.ChangePromotion(admin, p.ID, paused); err != nil {
		t.Fatal(err)
	}

	if running, err := f.orders.RunningPromotions(t.Context(), []uuid.UUID{shop}); err != nil || len(running) != 1 {
		t.Errorf("running again: %d, %v", len(running), err)
	}

	checkPayouts(admin, owner, t, f, shop, croissant.ID)
}

func checkPayouts(admin, owner context.Context, t *testing.T, f fixture, shop, offerID uuid.UUID) { //nolint:gocyclo // a check reads as one story
	t.Helper()

	o := f.placeFor(t, phone(), offerID, 2)
	if _, err := f.orders.HandOver(owner, o.ID); err != nil {
		t.Fatal(err)
	}

	y, m, d := time.Now().In(time.FixedZone("ICT", 7*3600)).Date()
	today := time.Date(y, m, d, 0, 0, 0, 0, time.UTC)
	monday := today.AddDate(0, 0, -((int(today.Weekday()) + 6) % 7))

	if _, err := f.orders.Payouts(admin, monday.AddDate(0, 0, 1), uuid.Nil); !errors.Is(err, order.ErrPayoutWeekInvalid) {
		t.Errorf("a week from Tuesday: %v", err)
	}

	payouts, err := f.orders.Payouts(admin, monday, uuid.Nil)
	if err != nil {
		t.Fatal(err)
	}

	owed := payoutOf(payouts, shop)
	if owed == nil || owed.AmountVND != 10_000 || owed.Orders != 1 || owed.NewCustomers != 1 || owed.PaidAt != nil {
		t.Fatalf("owed %+v", owed)
	}

	if _, err := f.orders.MarkPayout(owner, shop, monday); !errors.Is(err, platform.ErrAdminRequired) {
		t.Errorf("an owner marks a payout: %v", err)
	}

	marked, err := f.orders.MarkPayout(admin, shop, monday)
	if err != nil || marked.PaidAt == nil || marked.PaidVND != 10_000 {
		t.Fatalf("marked %+v, %v", marked, err)
	}

	if _, err := f.orders.MarkPayout(admin, shop, monday); !errors.Is(err, order.ErrPayoutAlreadyMarked) {
		t.Errorf("marked twice: %v", err)
	}

	if _, err := f.orders.MarkPayout(admin, uuid.New(), monday); !errors.Is(err, order.ErrPayoutNothingOwed) {
		t.Errorf("marking a seller owed nothing: %v", err)
	}

	payouts, err = f.orders.Payouts(admin, monday, uuid.Nil)
	if err != nil {
		t.Fatal(err)
	}

	if owed := payoutOf(payouts, shop); owed == nil || owed.PaidAt == nil || owed.PaidVND != 10_000 {
		t.Errorf("after marking: %+v", owed)
	}
}

func payoutOf(payouts []order.Payout, sellerID uuid.UUID) *order.Payout {
	for i := range payouts {
		if payouts[i].SellerID == sellerID {
			return &payouts[i]
		}
	}

	return nil
}
