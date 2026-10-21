package offer

import (
	"context"
	"net/http"
	"time"

	"github.com/danielgtaylor/huma/v2"
	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/identity"
	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/seller"
)

// The admins' summary covers at most maxSummaryDays days, and the last
// defaultSummaryDays without a range.
const (
	maxSummaryDays     = 90
	defaultSummaryDays = 30
)

type summaryInput struct {
	From string `doc:"The range's first day in Vietnam time; 29 days before to when absent" format:"date" query:"from"`
	To   string `doc:"The range's last day in Vietnam time, included; today when absent"   format:"date" query:"to"`
}

// summaryRange is the range of whole days in Vietnam time a summary covers.
type summaryRange struct {
	// start is the first day's midnight; end the midnight after the last day.
	start, end time.Time
	days       int
}

// summaryRange reads the range, defaulting to the defaultSummaryDays days
// that end today, and checks it.
func (in summaryInput) summaryRange(now time.Time) (summaryRange, error) {
	y, m, d := now.In(platform.Vietnam).Date()
	last := time.Date(y, m, d, 0, 0, 0, 0, platform.Vietnam)

	// huma has checked that both are dates when present.
	if in.To != "" {
		last, _ = time.ParseInLocation(time.DateOnly, in.To, platform.Vietnam)
	}

	first := last.AddDate(0, 0, 1-defaultSummaryDays)
	if in.From != "" {
		first, _ = time.ParseInLocation(time.DateOnly, in.From, platform.Vietnam)
	}

	if first.After(last) {
		return summaryRange{}, ErrSummaryRangeReversed.AtParameter("query.from", platform.Words{
			VI: "Không được sau ngày kết thúc.",
			EN: "Must not be after to.",
		})
	}

	// Vietnam has no daylight saving, so every day lasts 24 hours.
	days := int(last.Sub(first)/(24*time.Hour)) + 1
	if days > maxSummaryDays {
		return summaryRange{}, ErrSummaryRangeTooLong.AtParameter("query.from", platform.Words{
			VI: "Không được sớm hơn ngày kết thúc quá 90 ngày.",
			EN: "Must be at most 90 days before to.",
		})
	}

	return summaryRange{start: first, end: last.AddDate(0, 0, 1), days: days}, nil
}

// perDay lays counts out over every day of the range, a day without any at
// zero, for a chart.
func (r summaryRange) perDay(counts []platform.DayCount) []dayCountBody {
	byDay := make(map[string]int, len(counts))
	for _, c := range counts {
		byDay[c.Day.In(platform.Vietnam).Format(time.DateOnly)] = c.Count
	}

	out := make([]dayCountBody, 0, r.days)
	for i := range r.days {
		day := r.start.AddDate(0, 0, i).Format(time.DateOnly)
		out = append(out, dayCountBody{Date: day, Count: byDay[day]})
	}

	return out
}

type dayCountBody struct {
	Date  string `json:"date"  doc:"A day in Vietnam time" format:"date"`
	Count int    `json:"count"`
}

type adminSummaryBody struct {
	From     string              `json:"from"     doc:"The range's first day in Vietnam time"           format:"date"`
	To       string              `json:"to"       doc:"The range's last day in Vietnam time, included" format:"date"`
	Sellers  sellersSummaryBody  `json:"sellers"`
	Offers   offersSummaryBody   `json:"offers"`
	Accounts accountsSummaryBody `json:"accounts"`
}

type sellersSummaryBody struct {
	Active        int                `json:"active"        doc:"Sellers active now"`
	Pending       int                `json:"pending"       doc:"Sellers pending now"`
	Rejected      int                `json:"rejected"      doc:"Sellers rejected now"`
	Blocked       int                `json:"blocked"       doc:"Sellers blocked now"`
	OpenedInRange int                `json:"openedInRange" doc:"Sellers opened in the range, whatever their status"`
	Latest        []openedSellerBody `json:"latest"        doc:"The five sellers opened last, newest first, whenever that was" nullable:"false"`
}

type openedSellerBody struct {
	ID       uuid.UUID `json:"id"`
	Name     string    `json:"name"`
	OpenedAt time.Time `json:"openedAt"`
}

type offersSummaryBody struct {
	PostedInRange      int               `json:"postedInRange"      doc:"Offers posted in the range, whatever became of them"`
	UnitsPostedInRange int64             `json:"unitsPostedInRange" doc:"The units those offers put up"`
	OnSaleNow          int               `json:"onSaleNow"          doc:"Offers customers can order now; a blocked seller's are left out"`
	SoldOutNow         int               `json:"soldOutNow"         doc:"Offers customers see sold out now; a blocked seller's are left out"`
	PostedPerDay       []dayCountBody    `json:"postedPerDay"       doc:"Offers posted on every day of the range, in order" nullable:"false"`
	TopSellers         []topSellerBody   `json:"topSellers"         doc:"The five sellers that posted most in the range" nullable:"false"`
	Latest             []latestOfferBody `json:"latest"             doc:"The five offers posted last, newest first, whenever that was" nullable:"false"`
}

type topSellerBody struct {
	SellerID uuid.UUID `json:"sellerId"`
	Name     string    `json:"name"     doc:"As the seller's newest offer in the range copied it"`
	Offers   int       `json:"offers"   doc:"Offers it posted in the range"`
}

type latestOfferBody struct {
	ID         uuid.UUID `json:"id"`
	Name       string    `json:"name"`
	SellerID   uuid.UUID `json:"sellerId"`
	SellerName string    `json:"sellerName" doc:"As the offer copied it when posted"`
	PostedAt   time.Time `json:"postedAt"`
}

type accountsSummaryBody struct {
	Total      int            `json:"total"      doc:"Every account now, admins included"`
	NewInRange int            `json:"newInRange" doc:"Accounts created in the range that still exist"`
	NewPerDay  []dayCountBody `json:"newPerDay"  doc:"Accounts created on every day of the range, in order" nullable:"false"`
}

func toSellersSummaryBody(s seller.Summary) sellersSummaryBody {
	b := sellersSummaryBody{
		Active: s.Active, Pending: s.Pending, Rejected: s.Rejected, Blocked: s.Blocked, OpenedInRange: s.Opened,
		Latest: make([]openedSellerBody, 0, len(s.Latest)),
	}
	for _, o := range s.Latest {
		b.Latest = append(b.Latest, openedSellerBody(o))
	}

	return b
}

func toOffersSummaryBody(s Summary, r summaryRange) offersSummaryBody {
	b := offersSummaryBody{
		PostedInRange: s.Posted, UnitsPostedInRange: s.UnitsPosted, OnSaleNow: s.OnSale, SoldOutNow: s.SoldOut,
		PostedPerDay: r.perDay(s.PostedPerDay),
		TopSellers:   make([]topSellerBody, 0, len(s.TopPosters)),
		Latest:       make([]latestOfferBody, 0, len(s.Latest)),
	}
	for _, p := range s.TopPosters {
		b.TopSellers = append(b.TopSellers, topSellerBody{SellerID: p.SellerID, Name: p.SellerName, Offers: p.Posted})
	}

	for _, p := range s.Latest {
		b.Latest = append(b.Latest, latestOfferBody(p))
	}

	return b
}

// registerSummaryOperations adds the admins' dashboard to admin, the group
// platform.NewAdminGroup returns. It lives here because offer is the one
// module allowed to read both seller and identity (ARCHITECTURE.md); each of
// the three counts its own tables.
func registerSummaryOperations(admin huma.API, s *Service, accounts *identity.Service) {
	huma.Register(admin, huma.Operation{
		OperationID: "getAdminSummary", Method: http.MethodGet, Path: "/summary",
		Summary: "The figures of the admins' dashboard over a range of days",
		Description: "Sellers by status now and opened in the range; offers posted in the range, per day and by seller, " +
			"and open now; accounts in all and created in the range, per day. Days are in Vietnam time; " +
			"the range is at most 90 days and the last 30 without one. Orders and payments are not counted yet.",
	}, func(ctx context.Context, in *summaryInput) (*struct{ Body adminSummaryBody }, error) {
		r, err := in.summaryRange(s.now())
		if err != nil {
			return nil, err
		}

		sellers, err := s.sellers.Summary(ctx, r.start, r.end)
		if err != nil {
			return nil, err
		}

		offers, err := s.Summary(ctx, r.start, r.end)
		if err != nil {
			return nil, err
		}

		people, err := accounts.Summary(ctx, r.start, r.end)
		if err != nil {
			return nil, err
		}

		return &struct{ Body adminSummaryBody }{Body: adminSummaryBody{
			From:    r.start.Format(time.DateOnly),
			To:      r.end.AddDate(0, 0, -1).Format(time.DateOnly),
			Sellers: toSellersSummaryBody(sellers),
			Offers:  toOffersSummaryBody(offers, r),
			Accounts: accountsSummaryBody{
				Total: people.Total, NewInRange: people.Created, NewPerDay: r.perDay(people.CreatedPerDay),
			},
		}}, nil
	})
}
