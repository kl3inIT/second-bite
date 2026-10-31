package order

import (
	"context"
	"net/http"
	"time"

	"github.com/danielgtaylor/huma/v2"
	"github.com/google/uuid"
)

type promotionConditionBody struct {
	Attribute Attribute `json:"attribute" enum:"customer,seller,subtotal"`
	Operator  Operator  `json:"operator"  enum:"eq,in,not_in,gte,lt" doc:"eq for customer; in or not_in for seller; gte or lt for subtotal"`
	Values    []string  `json:"values"    nullable:"false" maxItems:"200" minItems:"1" doc:"new or returning for customer; seller identifiers; one amount in VND for subtotal"`
}

type promotionRewardBody struct {
	Type   RewardType `json:"type"             enum:"fixed,percentage"`
	Value  int64      `json:"value"            minimum:"1" doc:"VND for fixed, 1 to 100 for percentage"`
	MaxVND int64      `json:"maxVnd,omitempty" required:"false" doc:"The most a percentage takes off, in VND; required with a percentage"`
}

type promotionRuleBody struct {
	Name       string                   `json:"name"       maxLength:"60" minLength:"1"`
	Conditions []promotionConditionBody `json:"conditions" nullable:"false" maxItems:"5" doc:"All must hold; none means every order"`
	Reward     promotionRewardBody      `json:"reward"     doc:"Taken off the order's dishes, never more than they cost"`
}

type promotionInputBody struct {
	Name           string              `json:"name"           maxLength:"80" minLength:"1"`
	StartsAt       time.Time           `json:"startsAt"`
	EndsAt         time.Time           `json:"endsAt"         doc:"After startsAt"`
	AllSellers     bool                `json:"allSellers"     doc:"Runs for every seller; otherwise for sellerIds"`
	SellerIDs      []uuid.UUID         `json:"sellerIds"      nullable:"false" maxItems:"200" required:"false"`
	BudgetVND      int64               `json:"budgetVnd"      maximum:"10000000000" minimum:"1" doc:"Bounds the discounts of its orders still to collect and handed over"`
	PerPhonePerDay int                 `json:"perPhonePerDay" maximum:"100" minimum:"0" doc:"Discounts one phone number takes in a day, Vietnam time; 0 for no limit"`
	Enabled        bool                `json:"enabled"        doc:"false pauses it"`
	Rules          []promotionRuleBody `json:"rules"          nullable:"false" maxItems:"10" minItems:"1" doc:"Each an alternative; an order takes the one taking the most off"`
}

type promotionUseBody struct {
	SpentVND     int64 `json:"spentVnd"     doc:"Discounts of the orders handed over"`
	HeldVND      int64 `json:"heldVnd"      doc:"Discounts of the orders still to collect; given back when they are cancelled, refused or expire"`
	LeftVND      int64 `json:"leftVnd"      doc:"budgetVnd less spentVnd and heldVnd"`
	Orders       int   `json:"orders"       doc:"Orders still to collect or handed over that took a discount"`
	NewCustomers int   `json:"newCustomers" doc:"Of those, the orders of a new customer"`
	Sellers      int   `json:"sellers"      doc:"Sellers whose orders took a discount"`
}

type promotionBody struct {
	ID             uuid.UUID           `json:"id"`
	Name           string              `json:"name"`
	Status         PromotionStatus     `json:"status"         enum:"running,scheduled,paused,ended" doc:"Read from its times and whether it is enabled"`
	StartsAt       time.Time           `json:"startsAt"`
	EndsAt         time.Time           `json:"endsAt"`
	AllSellers     bool                `json:"allSellers"`
	SellerIDs      []uuid.UUID         `json:"sellerIds"      nullable:"false"`
	BudgetVND      int64               `json:"budgetVnd"`
	PerPhonePerDay int                 `json:"perPhonePerDay"`
	Enabled        bool                `json:"enabled"`
	Rules          []promotionRuleBody `json:"rules"          nullable:"false"`
	Use            promotionUseBody    `json:"use"`
	CreatedAt      time.Time           `json:"createdAt"`
	UpdatedAt      time.Time           `json:"updatedAt"`
}

type runningPromotionBody struct {
	ID             uuid.UUID           `json:"id"`
	Name           string              `json:"name"`
	EndsAt         time.Time           `json:"endsAt"`
	AllSellers     bool                `json:"allSellers"`
	SellerIDs      []uuid.UUID         `json:"sellerIds"      nullable:"false"`
	PerPhonePerDay int                 `json:"perPhonePerDay" doc:"0 for no limit"`
	Rules          []promotionRuleBody `json:"rules"          nullable:"false"`
}

type payoutBody struct {
	SellerID     uuid.UUID  `json:"sellerId"`
	SellerName   string     `json:"sellerName"`
	AmountVND    int64      `json:"amountVnd"         doc:"Discounts of its orders handed over in the week"`
	Orders       int        `json:"orders"`
	NewCustomers int        `json:"newCustomers"`
	PaidAt       *time.Time `json:"paidAt,omitempty"  doc:"When an admin marked the week paid; absent until then"`
	PaidVND      int64      `json:"paidVnd,omitempty" doc:"The amount marked paid then"`
}

func rulesBody(rules []Rule) []promotionRuleBody {
	out := make([]promotionRuleBody, 0, len(rules))

	for _, r := range rules {
		conditions := make([]promotionConditionBody, 0, len(r.Conditions))
		for _, c := range r.Conditions {
			conditions = append(conditions, promotionConditionBody(c))
		}

		out = append(out, promotionRuleBody{
			Name: r.Name, Conditions: conditions,
			Reward: promotionRewardBody{Type: r.Reward.Type, Value: r.Reward.Value, MaxVND: r.Reward.MaxVND},
		})
	}

	return out
}

func sellerIDsBody(ids []uuid.UUID) []uuid.UUID {
	if ids == nil {
		return []uuid.UUID{}
	}

	return ids
}

func toPromotionBody(p Promotion, now time.Time) promotionBody {
	return promotionBody{
		ID: p.ID, Name: p.Name, Status: p.Status(now), StartsAt: p.StartsAt, EndsAt: p.EndsAt, AllSellers: p.AllSellers,
		SellerIDs: sellerIDsBody(p.SellerIDs), BudgetVND: p.BudgetVND, PerPhonePerDay: p.PerPhonePerDay, Enabled: p.Enabled,
		Rules: rulesBody(p.Rules), CreatedAt: p.CreatedAt, UpdatedAt: p.UpdatedAt,
		Use: promotionUseBody{
			SpentVND: p.Use.SpentVND, HeldVND: p.Use.HeldVND, LeftVND: p.BudgetVND - p.Use.SpentVND - p.Use.HeldVND,
			Orders: p.Use.Orders, NewCustomers: p.Use.NewCustomers, Sellers: p.Use.Sellers,
		},
	}
}

func (b promotionInputBody) promotion() Promotion {
	rules := make([]Rule, 0, len(b.Rules))

	for _, r := range b.Rules {
		conditions := make([]Condition, 0, len(r.Conditions))
		for _, c := range r.Conditions {
			conditions = append(conditions, Condition(c))
		}

		rules = append(rules, Rule{
			Name: r.Name, Conditions: conditions,
			Reward: Reward{Type: r.Reward.Type, Value: r.Reward.Value, MaxVND: r.Reward.MaxVND},
		})
	}

	return Promotion{
		Name: b.Name, StartsAt: b.StartsAt, EndsAt: b.EndsAt, AllSellers: b.AllSellers, SellerIDs: b.SellerIDs,
		BudgetVND: b.BudgetVND, PerPhonePerDay: b.PerPhonePerDay, Enabled: b.Enabled, Rules: rules,
	}
}

func toPayoutBody(p Payout) payoutBody {
	return payoutBody(p)
}

type promotionOutput struct {
	Body promotionBody
}

type promotionPath struct {
	PromotionID uuid.UUID `path:"promotionId"`
}

var tagPromotions = []string{"Promotions"}

// registerPromotionOperations adds what a cart reads of the running
// promotions.
func registerPromotionOperations(api huma.API, s *Service) {
	huma.Register(api, huma.Operation{
		OperationID: "listRunningPromotions", Method: http.MethodGet, Path: "/promotions/running",
		Summary: "The promotions running now for any of some sellers, soonest to end first",
		Description: "What a cart may take off, signed in or not. What one phone number gets is never told before " +
			"the order is placed; the order says the discount it took.",
		Tags: tagPromotions, Security: anyone,
	}, func(ctx context.Context, in *struct {
		SellerID []uuid.UUID `query:"sellerId" maxItems:"20" doc:"The sellers of the cart"`
	},
	) (*struct {
		Body struct {
			Promotions []runningPromotionBody `json:"promotions" nullable:"false"`
		}
	}, error,
	) {
		promotions, err := s.RunningPromotions(ctx, in.SellerID)
		if err != nil {
			return nil, err
		}

		out := &struct {
			Body struct {
				Promotions []runningPromotionBody `json:"promotions" nullable:"false"`
			}
		}{}
		out.Body.Promotions = make([]runningPromotionBody, 0, len(promotions))

		for _, p := range promotions {
			out.Body.Promotions = append(out.Body.Promotions, runningPromotionBody{
				ID: p.ID, Name: p.Name, EndsAt: p.EndsAt, AllSellers: p.AllSellers, SellerIDs: sellerIDsBody(p.SellerIDs),
				PerPhonePerDay: p.PerPhonePerDay, Rules: rulesBody(p.Rules),
			})
		}

		return out, nil
	})
}

type promotionCountsBody struct {
	Running   int `json:"running"`
	Scheduled int `json:"scheduled"`
	Paused    int `json:"paused"`
	Ended     int `json:"ended"`
}

// registerAdminPromotionOperations adds the admins' promotions and payouts.
func registerAdminPromotionOperations(admin huma.API, s *Service) {
	huma.Register(admin, huma.Operation{
		OperationID: "listPromotions", Method: http.MethodGet, Path: "/promotions",
		Summary:     "The promotions by status, name and seller, the latest start first, with what each spent",
		Description: "counts holds the promotions of each status matching the other filters. A page past the end is empty.",
	}, func(ctx context.Context, in *struct {
		Status   PromotionStatus `query:"status"   enum:"running,scheduled,paused,ended"`
		Q        string          `query:"q"        maxLength:"100" doc:"Words of the name"`
		SellerID uuid.UUID       `query:"sellerId" doc:"Keep the promotions that apply to this seller"`
		Page     int             `query:"page"     default:"1" maximum:"10000" minimum:"1"`
		Size     int             `query:"size"     default:"25" maximum:"100" minimum:"1"`
	},
	) (*struct {
		Body struct {
			Items    []promotionBody     `json:"items"    nullable:"false"`
			Page     int                 `json:"page"`
			PageSize int                 `json:"pageSize"`
			Total    int                 `json:"total"`
			Counts   promotionCountsBody `json:"counts"`
		}
	}, error,
	) {
		page, err := s.Promotions(ctx, PromotionFilter{Status: in.Status, Query: in.Q, SellerID: in.SellerID, Page: in.Page, Size: in.Size})
		if err != nil {
			return nil, err
		}

		out := &struct {
			Body struct {
				Items    []promotionBody     `json:"items"    nullable:"false"`
				Page     int                 `json:"page"`
				PageSize int                 `json:"pageSize"`
				Total    int                 `json:"total"`
				Counts   promotionCountsBody `json:"counts"`
			}
		}{}
		out.Body.Page, out.Body.PageSize, out.Body.Total = in.Page, in.Size, page.Total
		out.Body.Counts = promotionCountsBody{
			Running: page.Counts[PromotionRunning], Scheduled: page.Counts[PromotionScheduled],
			Paused: page.Counts[PromotionPaused], Ended: page.Counts[PromotionEnded],
		}

		now := s.now()
		out.Body.Items = make([]promotionBody, 0, len(page.Promotions))

		for _, p := range page.Promotions {
			out.Body.Items = append(out.Body.Items, toPromotionBody(p, now))
		}

		return out, nil
	})

	huma.Register(admin, huma.Operation{
		OperationID: "createPromotion", Method: http.MethodPost, Path: "/promotions",
		Summary: "Set up a promotion; recorded in the audit", DefaultStatus: http.StatusCreated,
	}, func(ctx context.Context, in *struct {
		Body promotionInputBody
	},
	) (*promotionOutput, error) {
		p, err := s.CreatePromotion(ctx, in.Body.promotion())
		if err != nil {
			return nil, err
		}

		return &promotionOutput{Body: toPromotionBody(p, s.now())}, nil
	})

	huma.Register(admin, huma.Operation{
		OperationID: "getPromotion", Method: http.MethodGet, Path: "/promotions/{promotionId}",
		Summary: "A promotion with what it spent",
	}, func(ctx context.Context, in *promotionPath) (*promotionOutput, error) {
		p, err := s.Promotion(ctx, in.PromotionID)
		if err != nil {
			return nil, err
		}

		return &promotionOutput{Body: toPromotionBody(p, s.now())}, nil
	})

	huma.Register(admin, huma.Operation{
		OperationID: "changePromotion", Method: http.MethodPut, Path: "/promotions/{promotionId}",
		Summary:     "Replace a promotion; recorded in the audit with what changed",
		Description: "The orders placed before keep the discount they took.",
	}, func(ctx context.Context, in *struct {
		PromotionID uuid.UUID `path:"promotionId"`
		Body        promotionInputBody
	},
	) (*promotionOutput, error) {
		p, err := s.ChangePromotion(ctx, in.PromotionID, in.Body.promotion())
		if err != nil {
			return nil, err
		}

		return &promotionOutput{Body: toPromotionBody(p, s.now())}, nil
	})

	registerAdminPayoutOperations(admin, s)
}

// registerAdminPayoutOperations adds what Second Bite owes sellers for the
// discounts, and marking it paid.
func registerAdminPayoutOperations(admin huma.API, s *Service) {
	huma.Register(admin, huma.Operation{
		OperationID: "listPayouts", Method: http.MethodGet, Path: "/promotion-payouts",
		Summary:     "What Second Bite owes each seller for a week's discounts, the most owed first",
		Description: "The discounts of each seller's orders handed over in the week, Monday to Sunday in Vietnam time.",
	}, func(ctx context.Context, in *struct {
		WeekStart   string    `query:"weekStart"   required:"true" pattern:"^[0-9]{4}-[0-9]{2}-[0-9]{2}$" doc:"The week's Monday"`
		PromotionID uuid.UUID `query:"promotionId" doc:"Only this promotion's discounts"`
	},
	) (*struct {
		Body struct {
			Payouts []payoutBody `json:"payouts" nullable:"false"`
		}
	}, error,
	) {
		week, err := time.Parse(time.DateOnly, in.WeekStart)
		if err != nil {
			return nil, ErrPayoutWeekInvalid
		}

		payouts, err := s.Payouts(ctx, week, in.PromotionID)
		if err != nil {
			return nil, err
		}

		out := &struct {
			Body struct {
				Payouts []payoutBody `json:"payouts" nullable:"false"`
			}
		}{}
		out.Body.Payouts = make([]payoutBody, 0, len(payouts))

		for _, p := range payouts {
			out.Body.Payouts = append(out.Body.Payouts, toPayoutBody(p))
		}

		return out, nil
	})

	huma.Register(admin, huma.Operation{
		OperationID: "markPayoutPaid", Method: http.MethodPost, Path: "/promotion-payouts/{sellerId}/{weekStart}/paid",
		Summary:     "Mark a seller's week of discounts as paid back to it; recorded in the audit",
		Description: "The amount owed now is kept. A week is marked once.",
	}, func(ctx context.Context, in *struct {
		SellerID  uuid.UUID `path:"sellerId"`
		WeekStart string    `path:"weekStart" pattern:"^[0-9]{4}-[0-9]{2}-[0-9]{2}$" doc:"The week's Monday"`
	},
	) (*struct{ Body payoutBody }, error) {
		week, err := time.Parse(time.DateOnly, in.WeekStart)
		if err != nil {
			return nil, ErrPayoutWeekInvalid
		}

		p, err := s.MarkPayout(ctx, in.SellerID, week)
		if err != nil {
			return nil, err
		}

		return &struct{ Body payoutBody }{Body: toPayoutBody(p)}, nil
	})
}
