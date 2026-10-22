package stats

import (
	"context"
	"net/http"
	"time"

	"github.com/danielgtaylor/huma/v2"
	"github.com/google/uuid"
)

// defaultReportDays is the range a report reads when none is asked: the last
// week, today included.
const defaultReportDays = 7

type reportInput struct {
	Since    string    `query:"since"    doc:"The first day in Vietnam, YYYY-MM-DD; six days before until when empty" pattern:"^[0-9]{4}-[0-9]{2}-[0-9]{2}$"`
	Until    string    `query:"until"    doc:"The last day in Vietnam, YYYY-MM-DD, included; today when empty"         pattern:"^[0-9]{4}-[0-9]{2}-[0-9]{2}$"`
	SellerID uuid.UUID `query:"sellerId" doc:"Keep one store's numbers; the views are then its page's and its dishes'"`
}

type countsBody struct {
	Views          int   `json:"views"          doc:"Pages opened"`
	People         int   `json:"people"         doc:"Browsers that opened them, each counted once a day"`
	HomeViews      int   `json:"homeViews"      doc:"Opens of the home; none for a store"`
	QRViews        int   `json:"qrViews"        doc:"Opens the poster's code brought (utm_source=qr)"`
	Offers         int   `json:"offers"         doc:"Offers posted for the day"`
	UnitsPosted    int   `json:"unitsPosted"`
	Held           int   `json:"held"           doc:"Orders, however they ended"`
	UnitsHeld      int   `json:"unitsHeld"`
	Collected      int   `json:"collected"`
	UnitsCollected int   `json:"unitsCollected"`
	Cancelled      int   `json:"cancelled"`
	Refused        int   `json:"refused"`
	Expired        int   `json:"expired"        doc:"Orders the customer did not come for"`
	CollectedVND   int64 `json:"collectedVnd"   doc:"What the collected orders came to at the counter"`
}

type reportDayBody struct {
	Day string `json:"day" format:"date"`
	countsBody
}

type reportStoreBody struct {
	SellerID uuid.UUID `json:"sellerId"`
	Name     string    `json:"name"`
	countsBody
}

type reportStoreDayBody struct {
	Day      string    `json:"day"      format:"date"`
	SellerID uuid.UUID `json:"sellerId"`
	Name     string    `json:"name"`
	countsBody
}

type reportOutput struct {
	Body struct {
		Since     string               `json:"since"     format:"date"`
		Until     string               `json:"until"     format:"date"`
		Totals    countsBody           `json:"totals"`
		Days      []reportDayBody      `json:"days"      doc:"Every day of the range, in order"`
		Stores    []reportStoreBody    `json:"stores"    doc:"Each store with numbers in the range, the most orders first"`
		StoreDays []reportStoreDayBody `json:"storeDays" doc:"Each store on each day it has numbers, by day then name"`
	}
}

// RegisterAdminOperations adds the module's admin operations to admin, the
// group every admin operation is under.
func RegisterAdminOperations(admin huma.API, s *Service) {
	huma.Register(admin, huma.Operation{
		OperationID: "getReport", Method: http.MethodGet, Path: "/reports",
		Summary: "The prototype's numbers per day and store: pages opened, posts and orders",
		Description: "Days are Vietnam's; posts and orders count on their collection day. People add up over days, " +
			"since a visitor is counted once a day.",
	}, func(ctx context.Context, in *reportInput) (*reportOutput, error) {
		f, err := reportFilter(in, dayOf(s.now()))
		if err != nil {
			return nil, err
		}

		r, err := s.Report(ctx, f)
		if err != nil {
			return nil, err
		}

		return reportOf(r), nil
	})
}

// reportFilter reads the range asked, the last week up to today by default.
func reportFilter(in *reportInput, today time.Time) (ReportFilter, error) {
	f := ReportFilter{Until: today}

	if in.Until != "" {
		until, err := time.Parse(time.DateOnly, in.Until)
		if err != nil {
			return ReportFilter{}, ErrReportRangeInvalid
		}

		f.Until = until
	}

	f.Since = f.Until.AddDate(0, 0, 1-defaultReportDays)

	if in.Since != "" {
		since, err := time.Parse(time.DateOnly, in.Since)
		if err != nil {
			return ReportFilter{}, ErrReportRangeInvalid
		}

		f.Since = since
	}

	if in.SellerID != uuid.Nil {
		f.SellerID = &in.SellerID
	}

	return f, nil
}

func reportOf(r Report) *reportOutput {
	out := &reportOutput{}
	out.Body.Since, out.Body.Until = r.Since.Format(time.DateOnly), r.Until.Format(time.DateOnly)
	out.Body.Totals = countsOf(r.Totals)

	out.Body.Days = make([]reportDayBody, len(r.Days))
	for i, d := range r.Days {
		out.Body.Days[i] = reportDayBody{Day: d.Day.Format(time.DateOnly), countsBody: countsOf(d.Counts)}
	}

	out.Body.Stores = make([]reportStoreBody, len(r.Stores))
	for i, st := range r.Stores {
		out.Body.Stores[i] = reportStoreBody{SellerID: st.SellerID, Name: st.Name, countsBody: countsOf(st.Counts)}
	}

	out.Body.StoreDays = make([]reportStoreDayBody, len(r.StoreDays))
	for i, sd := range r.StoreDays {
		out.Body.StoreDays[i] = reportStoreDayBody{
			Day: sd.Day.Format(time.DateOnly), SellerID: sd.SellerID, Name: sd.Name, countsBody: countsOf(sd.Counts),
		}
	}

	return out
}

func countsOf(c Counts) countsBody { return countsBody(c) }
