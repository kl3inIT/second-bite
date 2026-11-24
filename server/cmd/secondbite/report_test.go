package main

import (
	"bytes"
	"net/http"
	"slices"
	"strings"
	"testing"
	"time"

	"github.com/xuri/excelize/v2"
)

// reportAdminEmail is the admin who reads the report, granted with the others
// so that its sign-in codes are its own.
const reportAdminEmail = "report.admin@example.com"

type reportCounts struct {
	Views          int   `json:"views"`
	People         int   `json:"people"`
	Offers         int   `json:"offers"`
	UnitsPosted    int   `json:"unitsPosted"`
	Held           int   `json:"held"`
	UnitsHeld      int   `json:"unitsHeld"`
	Collected      int   `json:"collected"`
	UnitsCollected int   `json:"unitsCollected"`
	CollectedVND   int64 `json:"collectedVnd"`
}

type reportResponse struct {
	Totals reportCounts `json:"totals"`
	Days   []struct {
		Day string `json:"day"`
	} `json:"days"`
	Stores []struct {
		SellerID   string       `json:"sellerId"`
		Name       string       `json:"name"`
		Counts     reportCounts `json:"counts"`
		DaysPosted int          `json:"daysPosted"`
		FullDays   int          `json:"fullDays"`
	} `json:"stores"`
	StoreDays []struct {
		Day    string       `json:"day"`
		Counts reportCounts `json:"counts"`
	} `json:"storeDays"`
}

// checkReport opens a store, posts a dish, has an order for two units handed
// over and the store's page and dish opened by one phone, then reads the
// store's numbers as an admin (SEC-80).
func checkReport(t *testing.T, svc service) {
	t.Helper()

	owner := bearer(signIn(t, svc, "report.owner@example.com").Token)
	customer := bearer(signIn(t, svc, "report.customer@example.com").Token)
	admin := bearer(signIn(t, svc, reportAdminEmail).Token)

	sellerID, offerID := postedOfferOf(t, svc, owner, "Bếp Báo Cáo")

	placing := customer.Clone()
	placing.Set("Idempotency-Key", "report-1-0123456789")

	var placed orderResponse

	send(t, http.MethodPost, svc.base+"/orders", placing, cartOf(cartLine{offerID, 2})).decode(t, http.StatusCreated, &placed)
	handOver(t, svc, owner, placed)

	// One phone at one address: two pages, one person.
	phone := http.Header{
		"User-Agent": {"Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36"},
		forwardedFor: {"113.161.10.30"},
	}
	for _, path := range []string{"/vi/sellers/" + sellerID, "/vi/offers/" + offerID} {
		send(t, http.MethodPost, svc.base+"/stats/views", phone, map[string]string{"path": path})
	}

	var r reportResponse

	send(t, http.MethodGet, svc.base+"/admin/reports?sellerId="+sellerID, admin, nil).decode(t, http.StatusOK, &r)

	want := reportCounts{
		Views: 2, People: 1, Offers: 1, UnitsPosted: 5, Held: 1, UnitsHeld: 2, Collected: 1, UnitsCollected: 2,
		CollectedVND: 30_000,
	}

	switch {
	case len(r.Days) != 7:
		t.Errorf("%d days, want the last seven", len(r.Days))
	case len(r.Stores) != 1 || r.Stores[0].Name != "Bếp Báo Cáo" || r.Stores[0].Counts != want:
		t.Errorf("the store %+v, want %+v", r.Stores, want)
	case r.Stores[0].DaysPosted != 1 || r.Stores[0].FullDays != 0:
		t.Errorf("the store posted on %d days, %d full, want 1 and none: 5 portions are under 7 (SEC-200)",
			r.Stores[0].DaysPosted, r.Stores[0].FullDays)
	case r.Totals != want || len(r.StoreDays) != 1:
		t.Errorf("totals %+v, store days %+v", r.Totals, r.StoreDays)
	}

	checkReportNewUsers(t, svc, admin)
	checkReportExport(t, svc, admin, sellerID)
	checkReportAnalysis(t, svc, admin, sellerID)
	checkShiftWorkbook(t, svc, admin, sellerID, map[string]http.Header{"a customer": customer, "the store's owner": owner})
	checkOfferUnits(t, svc, admin, sellerID)
	checkReportRangeRefused(t, svc, admin)
}

// checkReportNewUsers reads the site's new users (SEC-192): at least the
// three accounts signed in above and the customer who ordered today, other
// checks adding theirs, and the accounts there are at least as many.
func checkReportNewUsers(t *testing.T, svc service, admin http.Header) {
	t.Helper()

	var r struct {
		Accounts  int `json:"accounts"`
		Customers int `json:"customers"`
		Returning int `json:"returningCustomers"`
		Totals    struct {
			NewAccounts  int `json:"newAccounts"`
			NewCustomers int `json:"newCustomers"`
		} `json:"totals"`
	}

	send(t, http.MethodGet, svc.base+"/admin/reports", admin, nil).decode(t, http.StatusOK, &r)

	if r.Totals.NewAccounts < 3 || r.Totals.NewCustomers < 1 || r.Accounts < r.Totals.NewAccounts {
		t.Errorf("new users %+v, accounts %d", r.Totals, r.Accounts)
	}

	// SEC-200: the customer whose order was handed over today, other checks adding theirs.
	if r.Customers < 1 || r.Returning > r.Customers {
		t.Errorf("customers %d, returning %d", r.Customers, r.Returning)
	}
}

// checkReportExport downloads the store's report as a file of CSV, which
// starts with a byte order mark and names the store with its marks.
func checkReportExport(t *testing.T, svc service, admin http.Header, sellerID string) {
	t.Helper()

	csv := send(t, http.MethodGet, svc.base+"/admin/reports/export?sellerId="+sellerID, admin, nil)
	if csv.status != http.StatusOK || csv.header.Get("Content-Type") != "text/csv; charset=utf-8" ||
		!strings.HasPrefix(csv.header.Get("Content-Disposition"), "attachment; filename=bao-cao-") ||
		!bytes.HasPrefix(csv.body, []byte("\xEF\xBB\xBF")) || !bytes.Contains(csv.body, []byte("Bếp Báo Cáo")) {
		t.Errorf("the export: %d %v %q", csv.status, csv.header, csv.body)
	}
}

// checkReportAnalysis reads the store's analysis, its one dish sold most, and
// its workbook (report-products-export).
func checkReportAnalysis(t *testing.T, svc service, admin http.Header, sellerID string) {
	t.Helper()

	var a struct {
		Kinds   []struct{ Posted, Collected int } `json:"kinds"`
		TopSold []struct {
			Name      string `json:"name"`
			Collected int    `json:"collected"`
		} `json:"topSold"`
		Visits []struct {
			Key   string `json:"key"`
			Count int    `json:"count"`
		} `json:"visits"`
	}

	send(t, http.MethodGet, svc.base+"/admin/reports/analysis?sellerId="+sellerID, admin, nil).decode(t, http.StatusOK, &a)

	if len(a.Kinds) != 1 || a.Kinds[0].Posted != 5 || a.Kinds[0].Collected != 2 || len(a.TopSold) != 1 ||
		a.TopSold[0].Collected != 2 || len(a.Visits) != 3 || a.Visits[0].Key != "1" || a.Visits[0].Count != 1 {
		t.Errorf("the store's analysis %+v", a)
	}

	book := send(t, http.MethodGet, svc.base+"/admin/reports/workbook?sellerId="+sellerID, admin, nil)
	if book.status != http.StatusOK ||
		book.header.Get("Content-Type") != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
		!strings.HasSuffix(book.header.Get("Content-Disposition"), ".xlsx") || !bytes.HasPrefix(book.body, []byte("PK")) {
		t.Errorf("the workbook: %d %v", book.status, book.header)
	}
}

// checkOfferUnits reads what became of the store's post's units: two of five
// collected by one order, three left.
func checkOfferUnits(t *testing.T, svc service, admin http.Header, sellerID string) {
	t.Helper()

	var u struct {
		Posts, Posted, Left, Collected, CollectedOrders, Held, Missed int
	}

	send(t, http.MethodGet, svc.base+"/admin/offer-units?sellerId="+sellerID, admin, nil).decode(t, http.StatusOK, &u)

	if u.Posts != 1 || u.Posted != 5 || u.Left != 3 || u.Collected != 2 || u.CollectedOrders != 1 || u.Held != 0 || u.Missed != 0 {
		t.Errorf("the store's units %+v", u)
	}
}

// checkReportRangeRefused refuses a reversed range and one of 93 days.
func checkReportRangeRefused(t *testing.T, svc service, admin http.Header) {
	t.Helper()

	today := time.Now()
	for name, query := range map[string]string{
		"a reversed range": "since=" + today.Format(time.DateOnly) + "&until=2000-01-01",
		"93 days":          "since=" + today.AddDate(0, 0, -92).Format(time.DateOnly) + "&until=" + today.Format(time.DateOnly),
	} {
		if p := send(t, http.MethodGet, svc.base+"/admin/reports?"+query, admin, nil).
			problem(t, http.StatusBadRequest); p.Code != "REPORT_RANGE_INVALID" {
			t.Errorf("%s: %q", name, p.Code)
		}
	}
}

// checkShiftWorkbook downloads the store's day by shift with its customers
// (#261): only an admin may, each download is recorded in the audit without
// the customers, and the workbook opens with "Tổng hợp" first and a sheet for
// the day. Of the 5 croissants, 2 were collected on the app and the 3 no order
// holds were handed out at the counter.
func checkShiftWorkbook(t *testing.T, svc service, admin http.Header, sellerID string, others map[string]http.Header) {
	t.Helper()

	today := time.Now().In(time.FixedZone("Asia/Ho_Chi_Minh", 7*60*60))
	url := svc.base + "/admin/reports/shifts?sellerId=" + sellerID + "&since=" + today.Format(time.DateOnly) +
		"&until=" + today.Format(time.DateOnly)

	checkShiftWorkbookRefused(t, svc, url, others)

	book := send(t, http.MethodGet, url, admin, nil)
	if book.status != http.StatusOK ||
		book.header.Get("Content-Type") != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
		book.header.Get("Content-Disposition") != "attachment; filename=bao-cao-theo-ca-"+today.Format(time.DateOnly)+
			"-den-"+today.Format(time.DateOnly)+".xlsx" {
		t.Fatalf("the workbook by shift: %d %v %s", book.status, book.header, book.body)
	}

	if n := countRows(t, svc, `SELECT count(*) FROM audit_events
		WHERE request_id = $1 AND action = 'report.export_customers' AND resource_type = 'report'
		AND resource_id = $2 AND actor_label = $3 AND details->>'sellerId' = $4 AND (details->>'orders')::int = 1
		AND details::text NOT LIKE '%@%'`,
		book.header.Get("X-Request-Id"), today.Format(time.DateOnly)+".."+today.Format(time.DateOnly), reportAdminEmail,
		sellerID); n != 1 {
		t.Errorf("%d audit events of the download, want 1 with its days, store and orders", n)
	}

	checkShiftWorkbookRows(t, book.body, today)
}

// checkShiftWorkbookRefused: a customer and a store's owner are refused, and
// their requests leave no audit event.
func checkShiftWorkbookRefused(t *testing.T, svc service, url string, others map[string]http.Header) {
	t.Helper()

	for who, header := range others {
		refused := send(t, http.MethodGet, url, header, nil)
		if p := refused.problem(t, http.StatusForbidden); p.Code != codeAdminRequired {
			t.Errorf("%s: %q", who, p.Code)
		}

		if n := countRows(t, svc, "SELECT count(*) FROM audit_events WHERE request_id = $1",
			refused.header.Get("X-Request-Id")); n != 0 {
			t.Errorf("%s's refused download left %d audit events", who, n)
		}
	}
}

// checkShiftWorkbookRows opens the workbook: "Tổng hợp" and the day's sheet,
// the day's figures and the order with its customer.
func checkShiftWorkbookRows(t *testing.T, body []byte, today time.Time) {
	t.Helper()

	f, err := excelize.OpenReader(bytes.NewReader(body))
	if err != nil {
		t.Fatal(err)
	}
	defer f.Close() //nolint:errcheck // read from memory

	if got := f.GetSheetList(); !slices.Equal(got, []string{"Tổng hợp", "Ngày " + today.Format("02-01")}) {
		t.Fatalf("sheets %q", got)
	}

	rows, err := f.GetRows("Tổng hợp")
	if err != nil {
		t.Fatal(err)
	}

	whole := []string{today.Format("02-01-2006"), "Cả ngày", "", "1", "5", "5", "2", "3", "0"}
	if !slices.ContainsFunc(rows, func(row []string) bool { return slices.Equal(row, whole) }) {
		t.Errorf("no row %q in %q", whole, rows)
	}

	if !slices.ContainsFunc(rows, func(row []string) bool {
		return len(row) > 8 && row[4] == "Bếp Báo Cáo" && row[7] == "Croissant" && row[8] == "2"
	}) {
		t.Errorf("the order is not listed with its customer: %q", rows)
	}
}
