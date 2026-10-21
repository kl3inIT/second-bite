package main

import (
	"net/http"
	"testing"
	"time"

	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// summaryAdminEmail is an admin of its own, so this check signs in apart from
// the others that run beside it.
const summaryAdminEmail = "summary.admin@example.com"

type dayCount struct {
	Date  string `json:"date"`
	Count int    `json:"count"`
}

// checkAdminSummary reads the admins' dashboard over the default range and
// refuses a range that is reversed, too long or not a date, naming the
// parameter, through the API as the web will.
func checkAdminSummary(t *testing.T, svc service) {
	t.Helper()

	customer := bearer(signIn(t, svc, "summary.customer@example.com").Token)
	if p := send(t, http.MethodGet, svc.base+"/admin/summary", customer, nil).problem(t, http.StatusForbidden); p.Code != "PLATFORM_ADMIN_REQUIRED" {
		t.Errorf("a customer reading the summary: %q", p.Code)
	}

	admin := bearer(signIn(t, svc, summaryAdminEmail).Token)

	var summary struct {
		From    string `json:"from"`
		To      string `json:"to"`
		Sellers struct {
			Latest []struct {
				ID string `json:"id"`
			} `json:"latest"`
			PerDay []struct {
				Date   string `json:"date"`
				Active int    `json:"active"`
			} `json:"perDay"`
		} `json:"sellers"`
		Offers struct {
			PostedPerDay []dayCount `json:"postedPerDay"`
			TopSellers   []struct {
				SellerID string `json:"sellerId"`
			} `json:"topSellers"`
		} `json:"offers"`
		Accounts struct {
			Total     int        `json:"total"`
			NewPerDay []dayCount `json:"newPerDay"`
		} `json:"accounts"`
	}

	send(t, http.MethodGet, svc.base+"/admin/summary", admin, nil).decode(t, http.StatusOK, &summary)

	today := time.Now().In(platform.Vietnam).Format(time.DateOnly)
	if summary.To != today || len(summary.Offers.PostedPerDay) != 30 || len(summary.Accounts.NewPerDay) != 30 ||
		summary.Offers.PostedPerDay[29].Date != today || summary.Accounts.NewPerDay[0].Date != summary.From ||
		summary.Accounts.Total < 2 || summary.Sellers.Latest == nil || summary.Offers.TopSellers == nil ||
		len(summary.Sellers.PerDay) != 30 || summary.Sellers.PerDay[0].Date != summary.From || summary.Sellers.PerDay[29].Date != today {
		t.Errorf("the default summary %+v, want the 30 days to %s", summary, today)
	}

	checkSummaryRangeRefused(t, svc, admin)
}

// checkSummaryRangeRefused has an admin ask for ranges that are reversed, too
// long or not dates, and each answer name query.from.
func checkSummaryRangeRefused(t *testing.T, svc service, admin http.Header) {
	t.Helper()

	for query, code := range map[string]string{
		"?from=2026-10-10&to=2026-10-01": "OFFER_SUMMARY_RANGE_REVERSED",
		"?from=2026-01-01&to=2026-06-30": "OFFER_SUMMARY_RANGE_TOO_LONG",
		"?from=2026-13-01":               "PLATFORM_REQUEST_INVALID",
	} {
		p := send(t, http.MethodGet, svc.base+"/admin/summary"+query, admin, nil).problem(t, http.StatusBadRequest)
		if p.Code != code || len(p.Errors) != 1 || p.Errors[0].Parameter != "query.from" {
			t.Errorf("%s: %+v, want %s naming query.from", query, p, code)
		}
	}

	// The words come in the language asked for, the parameter's too (SEC-28).
	inEnglish := admin.Clone()
	inEnglish.Set("Accept-Language", "en")

	p := send(t, http.MethodGet, svc.base+"/admin/summary?from=2026-10-10&to=2026-10-01", inEnglish, nil).
		problem(t, http.StatusBadRequest)
	if p.Detail != "The range must start on or before the day it ends." || len(p.Errors) != 1 ||
		p.Errors[0].Detail != "Must not be after to." {
		t.Errorf("in English: %+v", p)
	}
}
