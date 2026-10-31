package order

import (
	"testing"

	"github.com/google/uuid"
)

// TestRuleDiscount checks what a rule takes off an order: its conditions all
// hold, a percentage stops at its cap, and nothing takes more than the
// dishes cost.
func TestRuleDiscount(t *testing.T) {
	t.Parallel()

	shop, other := uuid.New(), uuid.New()
	notOther := Condition{Attribute: AttributeSeller, Operator: OperatorNotIn, Values: []string{other.String()}}
	under := Condition{Attribute: AttributeSubtotal, Operator: OperatorLt, Values: []string{"50000"}}
	returning := Condition{Attribute: AttributeCustomer, Operator: OperatorEq, Values: []string{CustomerReturning}}

	for what, c := range map[string]struct {
		rule Rule
		o    candidate
		want int64
	}{
		"a percentage":              {Rule{Reward: Reward{Type: RewardPercentage, Value: 10, MaxVND: 8_000}}, candidate{subtotalVND: 40_000}, 4_000},
		"a percentage at its cap":   {Rule{Reward: Reward{Type: RewardPercentage, Value: 50, MaxVND: 8_000}}, candidate{subtotalVND: 40_000}, 8_000},
		"never more than the food":  {Rule{Reward: Reward{Type: RewardFixed, Value: 30_000}}, candidate{subtotalVND: 20_000}, 20_000},
		"a seller not left out":     {Rule{Conditions: []Condition{notOther}, Reward: Reward{Type: RewardFixed, Value: 5_000}}, candidate{sellerID: shop, subtotalVND: 40_000}, 5_000},
		"a seller left out":         {Rule{Conditions: []Condition{notOther}, Reward: Reward{Type: RewardFixed, Value: 5_000}}, candidate{sellerID: other, subtotalVND: 40_000}, 0},
		"under an amount":           {Rule{Conditions: []Condition{under}, Reward: Reward{Type: RewardFixed, Value: 5_000}}, candidate{subtotalVND: 49_999}, 5_000},
		"at the amount":             {Rule{Conditions: []Condition{under}, Reward: Reward{Type: RewardFixed, Value: 5_000}}, candidate{subtotalVND: 50_000}, 0},
		"a new customer, returning": {Rule{Conditions: []Condition{returning}, Reward: Reward{Type: RewardFixed, Value: 5_000}}, candidate{newCustomer: true, subtotalVND: 40_000}, 0},
		"every condition must hold": {Rule{Conditions: []Condition{returning, under}, Reward: Reward{Type: RewardFixed, Value: 5_000}}, candidate{subtotalVND: 60_000}, 0},
	} {
		if got := c.rule.discount(c.o); got != c.want {
			t.Errorf("%s: %d, want %d", what, got, c.want)
		}
	}
}
