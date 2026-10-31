package order

import (
	"context"
	"encoding/json"
	"fmt"
	"slices"
	"strconv"
	"strings"
	"time"
	"unicode/utf8"

	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/order/internal/db"
)

// A promotion is a programme an admin runs: from its start to its end, for
// every seller or those listed, it takes a discount off the orders its rules
// match, within a budget and a number of discounts per phone number and day.
// Each rule is conditions, all of which must hold, and a reward, as Medusa's
// promotions are rules and an application method and Spree's are rules and
// actions; of the rules that match an order, across every promotion running
// for its seller, the order takes the one that takes the most off, as Saleor's
// get_best_rule (buyer-discount increment).

// Promotion is a programme of discounts.
type Promotion struct {
	ID       uuid.UUID
	Name     string
	StartsAt time.Time
	EndsAt   time.Time
	// AllSellers runs it for every seller; otherwise for SellerIDs only.
	AllSellers bool
	SellerIDs  []uuid.UUID
	// BudgetVND bounds the discounts of its orders still to collect and of
	// those handed over.
	BudgetVND int64
	// PerPhonePerDay bounds the discounts one phone number takes in a day,
	// Vietnam time; 0 for no limit.
	PerPhonePerDay int
	// Enabled is false while an admin pauses it.
	Enabled   bool
	Rules     []Rule
	CreatedAt time.Time
	UpdatedAt time.Time
	// Use is what its discounts come to, read for admins.
	Use PromotionUse
}

// PromotionUse is what a promotion's discounts come to: spent on the orders
// handed over, held by those still to collect, and how many orders, new
// customers and sellers took one. An order cancelled, refused or expired took
// nothing.
type PromotionUse struct {
	SpentVND     int64
	HeldVND      int64
	Orders       int
	NewCustomers int
	Sellers      int
}

// PromotionStatus is where a promotion stands, read from its times and
// whether it is enabled.
type PromotionStatus string

// The statuses of a promotion.
const (
	PromotionRunning   PromotionStatus = "running"
	PromotionScheduled PromotionStatus = "scheduled"
	PromotionPaused    PromotionStatus = "paused"
	PromotionEnded     PromotionStatus = "ended"
)

// Status is where p stands at now.
func (p Promotion) Status(now time.Time) PromotionStatus {
	switch {
	case !p.EndsAt.After(now):
		return PromotionEnded
	case p.StartsAt.After(now):
		return PromotionScheduled
	case !p.Enabled:
		return PromotionPaused
	}

	return PromotionRunning
}

// Rule is one offer of a promotion: conditions that must all hold, and the
// reward taken off the order then.
type Rule struct {
	Name       string      `json:"name"`
	Conditions []Condition `json:"conditions"`
	Reward     Reward      `json:"reward"`
}

// Condition is an attribute of the order, an operator and values, as Medusa's
// promotion rules are.
type Condition struct {
	Attribute Attribute `json:"attribute"`
	Operator  Operator  `json:"operator"`
	Values    []string  `json:"values"`
}

// Attribute is what a condition reads of an order.
type Attribute string

// The attributes. customer is new or returning; seller is the order's
// seller's identifier; subtotal is what its dishes cost, in VND.
const (
	AttributeCustomer Attribute = "customer"
	AttributeSeller   Attribute = "seller"
	AttributeSubtotal Attribute = "subtotal"
)

// Operator compares an attribute with a condition's values.
type Operator string

// The operators: eq for customer; in and not_in for seller; gte and lt for
// subtotal.
const (
	OperatorEq    Operator = "eq"
	OperatorIn    Operator = "in"
	OperatorNotIn Operator = "not_in"
	OperatorGte   Operator = "gte"
	OperatorLt    Operator = "lt"
)

// The customers a condition names: a new customer's phone number has had no
// order handed over, a returning customer's has.
const (
	CustomerNew       = "new"
	CustomerReturning = "returning"
)

// Reward is what a rule takes off an order: a fixed amount, or a percentage
// of its dishes up to MaxVND.
type Reward struct {
	Type   RewardType `json:"type"`
	Value  int64      `json:"value"`
	MaxVND int64      `json:"maxVnd,omitempty"`
}

// RewardType is how a reward is counted.
type RewardType string

// The reward types, as Medusa's application methods and Saleor's reward
// values.
const (
	RewardFixed      RewardType = "fixed"
	RewardPercentage RewardType = "percentage"
)

// The bounds of a promotion an admin gives.
const (
	maxPromotionName   = 80
	maxRuleName        = 60
	maxRules           = 10
	maxConditions      = 5
	maxPromotionSeller = 200
	maxRewardVND       = 10_000_000
	maxBudgetVND       = 10_000_000_000
	maxPerPhonePerDay  = 100
)

// normalized is p as stored, or ErrPromotionInvalid naming what is wrong.
func (p Promotion) normalized() (Promotion, error) {
	p.Name = strings.TrimSpace(p.Name)
	if err := p.checkBounds(); err != nil {
		return Promotion{}, err
	}

	if p.AllSellers {
		p.SellerIDs = nil
	} else {
		p.SellerIDs = slices.Compact(slices.SortedFunc(slices.Values(p.SellerIDs), compareIDs))
		if len(p.SellerIDs) < 1 || len(p.SellerIDs) > maxPromotionSeller || p.SellerIDs[0] == uuid.Nil {
			return Promotion{}, invalidPromotion("sellerIds", "1 to 200 sellers unless allSellers")
		}
	}

	rules := make([]Rule, len(p.Rules))

	for i, r := range p.Rules {
		var err error
		if rules[i], err = r.normalized(); err != nil {
			return Promotion{}, err
		}
	}

	p.Rules = rules

	return p, nil
}

// checkBounds checks what p holds besides its sellers and rules.
func (p Promotion) checkBounds() error {
	switch n := utf8.RuneCountInString(p.Name); {
	case n < 1 || n > maxPromotionName:
		return invalidPromotion("name", "1 to 80 characters")
	case !p.EndsAt.After(p.StartsAt):
		return invalidPromotion("endsAt", "after startsAt")
	case p.BudgetVND < 1 || p.BudgetVND > maxBudgetVND:
		return invalidPromotion("budgetVnd", "1 to 10,000,000,000")
	case p.PerPhonePerDay < 0 || p.PerPhonePerDay > maxPerPhonePerDay:
		return invalidPromotion("perPhonePerDay", "0 to 100")
	case len(p.Rules) < 1 || len(p.Rules) > maxRules:
		return invalidPromotion("rules", "1 to 10")
	}

	return nil
}

func (r Rule) normalized() (Rule, error) {
	r.Name = strings.TrimSpace(r.Name)
	if n := utf8.RuneCountInString(r.Name); n < 1 || n > maxRuleName {
		return Rule{}, invalidPromotion("rules.name", "1 to 60 characters")
	}

	if len(r.Conditions) > maxConditions {
		return Rule{}, invalidPromotion("rules.conditions", "at most 5")
	}

	conditions := make([]Condition, len(r.Conditions))

	for i, c := range r.Conditions {
		var err error
		if conditions[i], err = c.normalized(); err != nil {
			return Rule{}, err
		}
	}

	r.Conditions = conditions

	reward, err := r.Reward.normalized()
	if err != nil {
		return Rule{}, err
	}

	r.Reward = reward

	return r, nil
}

func (w Reward) normalized() (Reward, error) {
	switch w.Type {
	case RewardFixed:
		w.MaxVND = 0
		if w.Value < 1 || w.Value > maxRewardVND {
			return Reward{}, invalidPromotion("rules.reward.value", "1 to 10,000,000 VND")
		}
	case RewardPercentage:
		if w.Value < 1 || w.Value > 100 {
			return Reward{}, invalidPromotion("rules.reward.value", "1 to 100 percent")
		}

		if w.MaxVND < 1 || w.MaxVND > maxRewardVND {
			return Reward{}, invalidPromotion("rules.reward.maxVnd", "1 to 10,000,000 VND with a percentage")
		}
	default:
		return Reward{}, invalidPromotion("rules.reward.type", "fixed or percentage")
	}

	return w, nil
}

func (c Condition) normalized() (Condition, error) {
	values := make([]string, 0, len(c.Values))
	for _, v := range c.Values {
		if v = strings.TrimSpace(v); v != "" {
			values = append(values, v)
		}
	}

	c.Values = values

	var err error

	switch c.Attribute {
	case AttributeCustomer:
		err = c.checkCustomer()
	case AttributeSeller:
		err = c.checkSellers()
	case AttributeSubtotal:
		err = c.checkSubtotal()
	default:
		err = invalidPromotion("conditions.attribute", "customer, seller or subtotal")
	}

	if err != nil {
		return Condition{}, err
	}

	return c, nil
}

func (c Condition) checkCustomer() error {
	if c.Operator != OperatorEq || len(c.Values) != 1 || (c.Values[0] != CustomerNew && c.Values[0] != CustomerReturning) {
		return invalidPromotion("conditions.customer", "eq new or returning")
	}

	return nil
}

// checkSellers checks the sellers' identifiers and writes them as the order's
// are read.
func (c Condition) checkSellers() error {
	if (c.Operator != OperatorIn && c.Operator != OperatorNotIn) || len(c.Values) < 1 || len(c.Values) > maxPromotionSeller {
		return invalidPromotion("conditions.seller", "in or not_in 1 to 200 sellers")
	}

	for i, v := range c.Values {
		id, err := uuid.Parse(v)
		if err != nil {
			return invalidPromotion("conditions.seller", "seller identifiers")
		}

		c.Values[i] = id.String()
	}

	return nil
}

func (c Condition) checkSubtotal() error {
	if (c.Operator != OperatorGte && c.Operator != OperatorLt) || len(c.Values) != 1 {
		return invalidPromotion("conditions.subtotal", "gte or lt one amount")
	}

	if n, err := strconv.ParseInt(c.Values[0], 10, 64); err != nil || n < 0 || n > maxBudgetVND {
		return invalidPromotion("conditions.subtotal", "an amount in VND")
	}

	return nil
}

// candidate is what the conditions read of an order being placed.
type candidate struct {
	newCustomer bool
	sellerID    uuid.UUID
	subtotalVND int64
}

// holds tells whether c holds for o. Values were checked when the promotion
// was saved.
func (c Condition) holds(o candidate) bool {
	switch c.Attribute {
	case AttributeCustomer:
		return (c.Values[0] == CustomerNew) == o.newCustomer
	case AttributeSeller:
		return slices.Contains(c.Values, o.sellerID.String()) == (c.Operator == OperatorIn)
	case AttributeSubtotal:
		n, _ := strconv.ParseInt(c.Values[0], 10, 64)
		if c.Operator == OperatorGte {
			return o.subtotalVND >= n
		}

		return o.subtotalVND < n
	}

	return false
}

// discount is what r takes off o, none when a condition does not hold. A
// discount never exceeds the dishes.
func (r Rule) discount(o candidate) int64 {
	for _, c := range r.Conditions {
		if !c.holds(o) {
			return 0
		}
	}

	amount := r.Reward.Value
	if r.Reward.Type == RewardPercentage {
		amount = min(o.subtotalVND*r.Reward.Value/100, r.Reward.MaxVND)
	}

	return min(amount, o.subtotalVND)
}

// best is the rule of p that takes the most off o, the first of equals.
func (p Promotion) best(o candidate) (Rule, int64) {
	var (
		rule   Rule
		amount int64
	)

	for _, r := range p.Rules {
		if d := r.discount(o); d > amount {
			rule, amount = r, d
		}
	}

	return rule, amount
}

// applied is the discount an order takes when it is placed.
type applied struct {
	promotion   Promotion
	rule        string
	newCustomer bool
	amountVND   int64
}

// discountFor finds, inside the transaction placing an order, the discount it
// takes: of the promotions running for its seller, locked until the order is
// stored, the rule taking the most off among those whose promotion has budget
// for it and has not given the phone number its discounts of the day. None
// when nothing matches.
func (s *Service) discountFor(ctx context.Context, q *db.Queries, sellerID uuid.UUID, phone string, subtotal int64) (applied, bool, error) {
	now := s.now()

	rows, err := q.LockRunningPromotions(ctx, db.LockRunningPromotionsParams{Now: now, SellerID: sellerID})
	if err != nil {
		return applied{}, false, fmt.Errorf("reading the running promotions: %w", err)
	}

	if len(rows) == 0 {
		return applied{}, false, nil
	}

	collected, err := q.PhoneHasCollected(ctx, phone)
	if err != nil {
		return applied{}, false, fmt.Errorf("reading the customer's orders: %w", err)
	}

	o := candidate{newCustomer: !collected, sellerID: sellerID, subtotalVND: subtotal}
	ids := make([]uuid.UUID, len(rows))

	for i, r := range rows {
		ids[i] = r.ID
	}

	uses, err := s.usesOf(ctx, q, ids)
	if err != nil {
		return applied{}, false, err
	}

	y, m, d := now.In(vietnam).Date()
	dayStart := time.Date(y, m, d, 0, 0, 0, 0, vietnam)

	var best applied

	for _, row := range rows {
		p, err := promotionOf(row)
		if err != nil {
			return applied{}, false, err
		}

		rule, amount := p.best(o)
		if amount <= best.amountVND {
			continue
		}

		use := uses[p.ID]
		if p.BudgetVND-use.SpentVND-use.HeldVND < amount {
			continue
		}

		if p.PerPhonePerDay > 0 {
			taken, err := q.PhoneDiscountsBetween(ctx, db.PhoneDiscountsBetweenParams{
				PromotionID: uuid.NullUUID{UUID: p.ID, Valid: true}, CustomerPhone: phone,
				DayStart: dayStart, DayEnd: dayStart.AddDate(0, 0, 1),
			})
			if err != nil {
				return applied{}, false, fmt.Errorf("counting the customer's discounts of the day: %w", err)
			}

			if taken >= int64(p.PerPhonePerDay) {
				continue
			}
		}

		best = applied{promotion: p, rule: rule.Name, newCustomer: o.newCustomer, amountVND: amount}
	}

	return best, best.amountVND > 0, nil
}

// usesOf reads what the promotions' discounts come to, with q: the pool's, or
// a transaction's.
func (s *Service) usesOf(ctx context.Context, q *db.Queries, ids []uuid.UUID) (map[uuid.UUID]PromotionUse, error) {
	rows, err := q.PromotionUses(ctx, ids)
	if err != nil {
		return nil, fmt.Errorf("reading what the promotions spent: %w", err)
	}

	uses := make(map[uuid.UUID]PromotionUse, len(rows))
	for _, r := range rows {
		uses[r.PromotionID] = PromotionUse{
			SpentVND: r.SpentVnd, HeldVND: r.HeldVnd, Orders: int(r.Orders), NewCustomers: int(r.NewCustomers),
			Sellers: int(r.Sellers),
		}
	}

	return uses, nil
}

// promotionOf reads a stored promotion, without its sellers.
func promotionOf(r db.OrderPromotion) (Promotion, error) {
	p := Promotion{
		ID: r.ID, Name: r.Name, StartsAt: r.StartsAt, EndsAt: r.EndsAt, AllSellers: r.AllSellers, BudgetVND: r.BudgetVnd,
		PerPhonePerDay: int(r.PerPhonePerDay), Enabled: r.Enabled, CreatedAt: r.CreatedAt, UpdatedAt: r.UpdatedAt,
	}

	if err := json.Unmarshal(r.Rules, &p.Rules); err != nil {
		return Promotion{}, fmt.Errorf("reading the promotion's rules: %w", err)
	}

	return p, nil
}

func compareIDs(a, b uuid.UUID) int { return strings.Compare(a.String(), b.String()) }
