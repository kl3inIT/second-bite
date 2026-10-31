package main

import (
	"bytes"
	"net/http"
	"strings"
	"testing"
	"time"
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
		SellerID string       `json:"sellerId"`
		Name     string       `json:"name"`
		Counts   reportCounts `json:"counts"`
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
		"User-Agent":      {"Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36"},
		"X-Forwarded-For": {"113.161.10.30"},
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
	case r.Totals != want || len(r.StoreDays) != 1:
		t.Errorf("totals %+v, store days %+v", r.Totals, r.StoreDays)
	}

	checkReportNewUsers(t, svc, admin)
	checkReportExport(t, svc, admin, sellerID)
	checkReportRangeRefused(t, svc, admin)
}

// checkReportNewUsers reads the site's new users (SEC-192): at least the
// three accounts signed in above and the customer who ordered today, other
// checks adding theirs, and the accounts there are at least as many.
func checkReportNewUsers(t *testing.T, svc service, admin http.Header) {
	t.Helper()

	var r struct {
		Accounts int `json:"accounts"`
		Totals   struct {
			NewAccounts  int `json:"newAccounts"`
			NewCustomers int `json:"newCustomers"`
		} `json:"totals"`
	}

	send(t, http.MethodGet, svc.base+"/admin/reports", admin, nil).decode(t, http.StatusOK, &r)

	if r.Totals.NewAccounts < 3 || r.Totals.NewCustomers < 1 || r.Accounts < r.Totals.NewAccounts {
		t.Errorf("new users %+v, accounts %d", r.Totals, r.Accounts)
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
