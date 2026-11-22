package stats

import (
	"cmp"
	"context"
	"maps"
	"net/http"
	"slices"
	"strconv"
	"time"

	"github.com/danielgtaylor/huma/v2"
	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/offer"
)

type analysisKindBody struct {
	Kind      offer.Kind `json:"kind" enum:"bakery,prepared_food,ingredients,drinks,mixed_box,dessert,snacks,produce,other"`
	Posted    int        `json:"posted"    doc:"Units posted"`
	Collected int        `json:"collected" doc:"Units of them collected"`
}

type analysisDiscountBody struct {
	Band      string `json:"band" doc:"The discount against the original price" enum:"free,from70,from50,from30,under30"`
	Posted    int    `json:"posted"    doc:"Units posted"`
	Collected int    `json:"collected" doc:"Units of them collected"`
}

type analysisSlotBody struct {
	Weekday   int `json:"weekday"   doc:"1 Monday to 7 Sunday, of the window's start in Vietnam"`
	Hour      int `json:"hour"      doc:"The hour of the window's start in Vietnam"`
	Held      int `json:"held"`
	Collected int `json:"collected"`
}

type analysisDishBody struct {
	OfferID    uuid.UUID `json:"offerId"`
	Name       string    `json:"name"`
	SellerName string    `json:"sellerName"`
	Unit       string    `json:"unit"`
	Posted     int       `json:"posted"    doc:"Units posted"`
	Collected  int       `json:"collected" doc:"Units of them collected"`
}

type analysisCountBody struct {
	Key   string `json:"key"`
	Count int    `json:"count"`
}

type analysisOutput struct {
	Body struct {
		Since     string                 `json:"since"     format:"date"`
		Until     string                 `json:"until"     format:"date"`
		Kinds     []analysisKindBody     `json:"kinds" nullable:"false"     doc:"The portions posted and collected by kind of dish, the most posted first"`
		Discounts []analysisDiscountBody `json:"discounts" nullable:"false" doc:"The same by discount band, from food given away to the smallest discount"`
		Slots     []analysisSlotBody     `json:"slots" nullable:"false"     doc:"The orders by weekday and hour of their window's start"`
		LeadTimes struct {
			UnderHalfHour   int `json:"underHalfHour"`
			UnderHour       int `json:"underHour"`
			UnderThreeHours int `json:"underThreeHours"`
			OverThreeHours  int `json:"overThreeHours"`
		} `json:"leadTimes" doc:"How long before the window opened the orders were placed"`
		SellOut struct {
			UnderHalfHour int `json:"underHalfHour"`
			UnderHour     int `json:"underHour"`
			UnderTwoHours int `json:"underTwoHours"`
			OverTwoHours  int `json:"overTwoHours"`
			NotSoldOut    int `json:"notSoldOut"    doc:"Posts that ended with units left"`
			MedianMinutes int `json:"medianMinutes" doc:"The middle time to sell out; 0 when none did"`
		} `json:"sellOut" doc:"How long the posts took from posting to their last unit ordered"`
		Failures    []analysisCountBody `json:"failures" nullable:"false"    doc:"The orders not collected by ending: cancelled, expired, or refused_ and the reason; the most first"`
		Visits      []analysisCountBody `json:"visits" nullable:"false"      doc:"The customers by orders handed over: 1, 2, and 3 for three or more"`
		TopSold     []analysisDishBody  `json:"topSold" nullable:"false"     doc:"The five dishes most collected"`
		TopLeftover []analysisDishBody  `json:"topLeftover" nullable:"false" doc:"The five ended dishes with the most portions not collected"`
		Sources     []analysisCountBody `json:"sources" nullable:"false"     doc:"The views by utm_source, empty for none; the site's whatever store is chosen"`
		Tags        []analysisCountBody `json:"tags" nullable:"false"        doc:"The reviews praising each tag"`
		Problems    []analysisCountBody `json:"problems" nullable:"false"    doc:"The orders reported for each kind of problem"`
	}
}

// registerAnalysisOperation adds the admin's analysis, read for the report's
// days and store.
func registerAnalysisOperation(admin huma.API, s *Service) {
	huma.Register(admin, huma.Operation{
		OperationID: "getReportAnalysis", Method: http.MethodGet, Path: "/reports/analysis",
		Summary: "What the posts and orders of the report's days tell beyond its counts",
		Description: "The same days and store as getReport; posts and orders count on their collection day. " +
			"The views' sources are the site's whatever store is chosen.",
	}, func(ctx context.Context, in *reportInput) (*analysisOutput, error) {
		f, err := reportFilter(in, dayOf(s.now()))
		if err != nil {
			return nil, err
		}

		a, err := s.Analysis(ctx, f)
		if err != nil {
			return nil, err
		}

		return analysisOf(a), nil
	})
}

func analysisOf(a Analysis) *analysisOutput {
	out := &analysisOutput{}
	b := &out.Body
	b.Since, b.Until = a.Since.Format(time.DateOnly), a.Until.Format(time.DateOnly)

	b.Kinds = []analysisKindBody{}
	for kind, p := range a.Kinds {
		b.Kinds = append(b.Kinds, analysisKindBody{Kind: kind, Posted: p.Posted, Collected: p.Collected})
	}

	slices.SortFunc(b.Kinds, func(x, y analysisKindBody) int {
		return cmp.Or(cmp.Compare(y.Posted, x.Posted), cmp.Compare(x.Kind, y.Kind))
	})

	b.Discounts = []analysisDiscountBody{}
	for _, band := range []string{DiscountFree, DiscountFrom70, DiscountFrom50, DiscountFrom30, DiscountUnder30} {
		p := a.Discounts[band]
		b.Discounts = append(b.Discounts, analysisDiscountBody{Band: band, Posted: p.Posted, Collected: p.Collected})
	}

	b.Slots = []analysisSlotBody{}
	for _, sl := range a.Orders.Slots {
		b.Slots = append(b.Slots, analysisSlotBody{Weekday: sl.Weekday, Hour: sl.Hour, Held: sl.Held, Collected: sl.Collected})
	}

	lt := a.Orders.LeadTimes
	b.LeadTimes.UnderHalfHour, b.LeadTimes.UnderHour = lt.UnderHalfHour, lt.UnderHour
	b.LeadTimes.UnderThreeHours, b.LeadTimes.OverThreeHours = lt.UnderThreeHours, lt.OverThreeHours

	so := a.SellOut
	b.SellOut.UnderHalfHour, b.SellOut.UnderHour, b.SellOut.UnderTwoHours = so.UnderHalfHour, so.UnderHour, so.UnderTwoHours
	b.SellOut.OverTwoHours, b.SellOut.NotSoldOut, b.SellOut.MedianMinutes = so.OverTwoHours, so.NotSoldOut, so.MedianMinutes

	b.Failures = countsBy(a.Orders.Failures)
	b.Tags = countsBy(a.Orders.Tags)
	b.Problems = countsBy(a.Orders.Problems)

	b.Visits = []analysisCountBody{}
	for _, n := range []int{1, 2, 3} {
		b.Visits = append(b.Visits, analysisCountBody{Key: strconv.Itoa(n), Count: a.Orders.Visits[n]})
	}

	b.TopSold, b.TopLeftover = dishesOf(a.TopSold), dishesOf(a.TopLeftover)

	b.Sources = []analysisCountBody{}
	for _, sv := range a.Sources {
		b.Sources = append(b.Sources, analysisCountBody{Key: sv.Source, Count: sv.Views})
	}

	return out
}

// countsBy lists counts the most first, then by key.
func countsBy(counts map[string]int) []analysisCountBody {
	list := []analysisCountBody{}
	for _, key := range slices.Sorted(maps.Keys(counts)) {
		list = append(list, analysisCountBody{Key: key, Count: counts[key]})
	}

	slices.SortStableFunc(list, func(x, y analysisCountBody) int { return cmp.Compare(y.Count, x.Count) })

	return list
}

func dishesOf(dishes []DishRank) []analysisDishBody {
	list := make([]analysisDishBody, len(dishes))
	for i, d := range dishes {
		list[i] = analysisDishBody{
			OfferID: d.OfferID, Name: d.Name, SellerName: d.SellerName, Unit: d.Unit, Posted: d.Posted, Collected: d.Collected,
		}
	}

	return list
}
