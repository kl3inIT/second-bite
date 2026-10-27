package seller

import (
	"context"
	"net/http"
	"time"

	"github.com/danielgtaylor/huma/v2"
	"github.com/google/uuid"
)

// feedbackDays is the range the admins' list reads when none is asked: the last
// week, today included, as the report's.
const feedbackDays = 7

func registerFeedbackOperations(api huma.API, s *Service) {
	huma.Register(api, huma.Operation{
		OperationID: "sendSellerFeedback", Method: http.MethodPost, Path: "/sellers/{sellerId}/feedback",
		Summary:     "Tell the Second Bite team what is hard or missing, for the seller's people",
		Description: "Kept with the seller, not who wrote it; at most 20 a day for one seller (SEC-82).",
		Tags:        tagSellers, Security: security, DefaultStatus: http.StatusNoContent,
	}, func(ctx context.Context, in *struct {
		SellerID uuid.UUID `path:"sellerId"`
		Body     struct {
			Text string `json:"text" doc:"1 to 1,000 characters, or SELLER_FEEDBACK_INVALID" maxLength:"4000"`
		}
	},
	) (*struct{}, error) {
		return nil, s.SendFeedback(ctx, in.SellerID, in.Body.Text)
	})
}

type feedbackBody struct {
	ID         uuid.UUID `json:"id"`
	SellerID   uuid.UUID `json:"sellerId"`
	SellerName string    `json:"sellerName"`
	Text       string    `json:"text"`
	SentAt     time.Time `json:"sentAt"`
}

type feedbackOutput struct {
	Body struct {
		Items []feedbackBody `json:"items" nullable:"false"`
	}
}

func registerFeedbackAdminOperations(admin huma.API, s *Service) {
	huma.Register(admin, huma.Operation{
		OperationID: "listSellerFeedbackForAdmins", Method: http.MethodGet, Path: "/seller-feedback",
		Summary:     "What the stores told the team, in a range of days, the latest first",
		Description: "At most 200; of one store when sellerId is given (SEC-82). The days are Vietnam's, as the report's.",
	}, func(ctx context.Context, in *struct {
		Since    string    `query:"since"    doc:"The first day in Vietnam, YYYY-MM-DD; six days before until when empty" pattern:"^[0-9]{4}-[0-9]{2}-[0-9]{2}$"`
		Until    string    `query:"until"    doc:"The last day in Vietnam, YYYY-MM-DD, included; today when empty"         pattern:"^[0-9]{4}-[0-9]{2}-[0-9]{2}$"`
		SellerID uuid.UUID `query:"sellerId" doc:"Keep one store's feedback"`
	},
	) (*feedbackOutput, error) {
		since, until, err := feedbackRange(in.Since, in.Until)
		if err != nil {
			return nil, err
		}

		items, err := s.FeedbackForAdmins(ctx, FeedbackFilter{Since: since, Until: until, SellerID: in.SellerID})
		if err != nil {
			return nil, err
		}

		out := &feedbackOutput{}
		out.Body.Items = make([]feedbackBody, 0, len(items))

		for _, f := range items {
			out.Body.Items = append(out.Body.Items, feedbackBody(f))
		}

		return out, nil
	})
}

// feedbackRange turns the days asked, in Vietnam, into [since, until): the
// last week by default; a range that ends before it starts is refused.
func feedbackRange(sinceDay, untilDay string) (time.Time, time.Time, error) {
	y, m, d := time.Now().In(vietnam).Date()
	last := time.Date(y, m, d, 0, 0, 0, 0, vietnam)

	if untilDay != "" {
		t, err := time.ParseInLocation(time.DateOnly, untilDay, vietnam)
		if err != nil {
			return time.Time{}, time.Time{}, ErrFeedbackListInvalid
		}

		last = t
	}

	first := last.AddDate(0, 0, 1-feedbackDays)

	if sinceDay != "" {
		t, err := time.ParseInLocation(time.DateOnly, sinceDay, vietnam)
		if err != nil {
			return time.Time{}, time.Time{}, ErrFeedbackListInvalid
		}

		first = t
	}

	if last.Before(first) {
		return time.Time{}, time.Time{}, ErrFeedbackListInvalid
	}

	return first, last.AddDate(0, 0, 1), nil
}
