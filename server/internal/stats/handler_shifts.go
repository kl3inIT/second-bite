package stats

import (
	"context"
	"mime"
	"net/http"

	"github.com/danielgtaylor/huma/v2"
)

// registerShiftOperation adds the admin's report by day and shift with every
// order's customer (#261), for the report's days and store.
func registerShiftOperation(admin huma.API, s *Service) {
	huma.Register(admin, huma.Operation{
		OperationID: "exportShiftWorkbook", Method: http.MethodGet, Path: "/reports/shifts",
		Summary: "The report by day and shift with every order's customer, as an Excel workbook for the sponsor",
		Description: "The same days and store as getReport (#261), in Vietnamese: \"Tổng hợp\", then a sheet per day " +
			"\"Ngày DD-MM\". A shift is the afternoon's when its window starts before 17:00 in Vietnam, else the " +
			"evening's. Per shift, store and dish: the portions posted, collected (ordered on the app and collected, " +
			"plus those handed out at the counter: posted and held by no order on the app not cancelled) and not taken " +
			"(of orders on the app that expired or were refused); and every order on the app with its customer's name " +
			"and phone. Cancelled orders are left out. The download is recorded in the audit as " +
			"report.export_customers, without the customers.",
		Responses: map[string]*huma.Response{
			"200": {Description: "The workbook", Content: map[string]*huma.MediaType{contentTypeXLSX: {}}},
		},
	}, func(ctx context.Context, in *reportInput) (*csvOutput, error) {
		f, err := reportFilter(in, dayOf(s.now()))
		if err != nil {
			return nil, err
		}

		body, name, err := s.ShiftWorkbook(ctx, f)
		if err != nil {
			return nil, err
		}

		return &csvOutput{
			ContentType:        contentTypeXLSX,
			ContentDisposition: mime.FormatMediaType("attachment", map[string]string{"filename": name}),
			CacheControl:       "no-store",
			Body:               body,
		}, nil
	})
}
