package stats

import (
	"context"
	"mime"
	"net/http"
	"time"

	"github.com/danielgtaylor/huma/v2"
	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/order"
)

type shiftReportInput struct {
	Since    string    `query:"since"    doc:"The first day in Vietnam, YYYY-MM-DD" pattern:"^[0-9]{4}-[0-9]{2}-[0-9]{2}$" required:"true"`
	Until    string    `query:"until"    doc:"The last day in Vietnam, YYYY-MM-DD, included, today at the latest" pattern:"^[0-9]{4}-[0-9]{2}-[0-9]{2}$" required:"true"`
	SellerID uuid.UUID `query:"sellerId" doc:"Keep one store's orders and posts"`
	Shift    []string  `query:"shift"    doc:"A shift, HH:MM-HH:MM,Name, from 00:00 to 24:00; the parameter repeats, one to six, in order and not overlapping. Ca sáng 06:00–12:00, Ca chiều 12:00–18:00 and Ca tối 18:00–24:00 when absent" maxItems:"6"`
}

type shiftSummaryBody struct {
	Stores            int `json:"stores"            doc:"Stores with a post or an order"`
	UnitsPosted       int `json:"unitsPosted"       doc:"Portions of the offers posted for it, whatever became of them"`
	Orders            int `json:"orders"            doc:"Orders, however they ended"`
	UnitsCollected    int `json:"unitsCollected"    doc:"Portions handed over"`
	UnitsNotCollected int `json:"unitsNotCollected" doc:"Portions the store refused or whose window ended without a hand-over; an order cancelled by its customer is in neither"`
}

type shiftOrderBody struct {
	Number      int64        `json:"number"`
	Store       string       `json:"store"`
	Customer    string       `json:"customer"    doc:"The name copied on the order; empty once forgotten"`
	Phone       string       `json:"phone"       doc:"The phone copied on the order; empty once forgotten"`
	Dishes      string       `json:"dishes"      doc:"The dishes, each with its portions when more than one"`
	Units       int          `json:"units"`
	OrderedAt   time.Time    `json:"orderedAt"`
	WindowStart time.Time    `json:"windowStart"`
	WindowEnd   time.Time    `json:"windowEnd"`
	Status      order.Status `json:"status"      enum:"confirmed,ready,collected,cancelled,refused,expired"`
}

type shiftBlockBody struct {
	Name    string           `json:"name"`
	From    string           `json:"from"    doc:"HH:MM"`
	Until   string           `json:"until"   doc:"HH:MM, 24:00 ending at midnight"`
	Summary shiftSummaryBody `json:"summary"`
	Orders  []shiftOrderBody `json:"orders"  doc:"By window, then number" nullable:"false"`
}

type shiftDayBody struct {
	Day     string           `json:"day"     format:"date"`
	Summary shiftSummaryBody `json:"summary" doc:"The whole day, whatever the shifts"`
	Shifts  []shiftBlockBody `json:"shifts"  doc:"In the order asked" nullable:"false"`
}

type shiftReportOutput struct {
	Body struct {
		Since  string           `json:"since"  format:"date"`
		Until  string           `json:"until"  format:"date"`
		Totals shiftSummaryBody `json:"totals" doc:"The whole range"`
		Days   []shiftDayBody   `json:"days"   doc:"Every day of the range, in order" nullable:"false"`
	}
}

// registerShiftOperations adds the report by shift to admin (SEC-209).
func registerShiftOperations(admin huma.API, s *Service) {
	huma.Register(admin, huma.Operation{
		OperationID: "getShiftReport", Method: http.MethodGet, Path: "/shift-reports",
		Summary: "The orders and their buyers by day and shift, with each shift's and each day's numbers",
		Description: "Days and hours are Vietnam's; an order and a post belong to the shift holding the start of its window, " +
			"and one outside every shift is counted in its day alone. At most 31 days, none after today.",
	}, func(ctx context.Context, in *shiftReportInput) (*shiftReportOutput, error) {
		r, err := readShiftReport(ctx, s, in)
		if err != nil {
			return nil, err
		}

		return shiftReportOf(r), nil
	})

	huma.Register(admin, huma.Operation{
		OperationID: "exportShiftReport", Method: http.MethodGet, Path: "/shift-reports/export",
		Summary: "The shift report as an Excel workbook: a summary sheet and a sheet per day",
		Description: "The same numbers as getShiftReport, in Vietnamese: the summary of the range, then for each day its summary " +
			"and a table per shift of its orders with their buyers. Figures are numbers, names, phones and times text, " +
			"never formulas.",
		Responses: map[string]*huma.Response{
			"200": {Description: "The workbook", Content: map[string]*huma.MediaType{contentTypeXLSX: {}}},
		},
	}, func(ctx context.Context, in *shiftReportInput) (*csvOutput, error) {
		r, err := readShiftReport(ctx, s, in)
		if err != nil {
			return nil, err
		}

		body, err := shiftWorkbook(r)
		if err != nil {
			return nil, err
		}

		return &csvOutput{
			ContentType:        contentTypeXLSX,
			ContentDisposition: mime.FormatMediaType("attachment", map[string]string{"filename": shiftWorkbookName(r)}),
			CacheControl:       "no-store",
			Body:               body,
		}, nil
	})
}

// readShiftReport reads what in asks for.
func readShiftReport(ctx context.Context, s *Service, in *shiftReportInput) (ShiftReport, error) {
	since, err := time.Parse(time.DateOnly, in.Since)
	if err != nil {
		return ShiftReport{}, ErrShiftRangeInvalid
	}

	until, err := time.Parse(time.DateOnly, in.Until)
	if err != nil {
		return ShiftReport{}, ErrShiftRangeInvalid
	}

	shifts, err := ParseShifts(in.Shift)
	if err != nil {
		return ShiftReport{}, err
	}

	f := ShiftFilter{Since: since, Until: until, Shifts: shifts}
	if in.SellerID != uuid.Nil {
		f.SellerID = &in.SellerID
	}

	return s.ShiftReport(ctx, f)
}

func shiftReportOf(r ShiftReport) *shiftReportOutput {
	out := &shiftReportOutput{}
	out.Body.Since, out.Body.Until = r.Since.Format(time.DateOnly), r.Until.Format(time.DateOnly)
	out.Body.Totals = shiftSummaryOf(r.Totals)
	out.Body.Days = make([]shiftDayBody, len(r.Days))

	for i, d := range r.Days {
		day := shiftDayBody{Day: d.Day.Format(time.DateOnly), Summary: shiftSummaryOf(d.Summary), Shifts: make([]shiftBlockBody, len(d.Shifts))}

		for j, b := range d.Shifts {
			block := shiftBlockBody{
				Name: b.Name, From: b.From, Until: b.Until, Summary: shiftSummaryOf(b.Summary),
				Orders: make([]shiftOrderBody, len(b.Orders)),
			}

			for k, o := range b.Orders {
				block.Orders[k] = shiftOrderBody{
					Number: o.Number, Store: o.Store, Customer: o.Customer, Phone: o.Phone, Dishes: o.Dishes, Units: o.Units,
					OrderedAt: o.OrderedAt, WindowStart: o.WindowStart, WindowEnd: o.WindowEnd, Status: o.Status,
				}
			}

			day.Shifts[j] = block
		}

		out.Body.Days[i] = day
	}

	return out
}

func shiftSummaryOf(m ShiftSummary) shiftSummaryBody { return shiftSummaryBody(m) }
