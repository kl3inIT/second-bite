package main

import (
	"fmt"
	"net/http"
	"strconv"
	"testing"
)

// checkLimitsPerAddress: one address asking for more sign-in codes, or placing
// more orders, than a mall's Wi-Fi would in ten minutes is refused with 429 and
// a wait, whatever the email addresses or the orders; another address is not
// (SEC-160).
func checkLimitsPerAddress(t *testing.T, svc service) {
	t.Helper()

	from := func(address string) http.Header { return http.Header{"X-Forwarded-For": {address}} }

	var c challenge

	for i := range 30 {
		send(t, http.MethodPost, svc.base+"/auth/sign-in-codes", from("203.0.113.7"),
			emailBody(fmt.Sprintf("limit.%d@example.com", i))).decode(t, http.StatusAccepted, &c)
	}

	refused := send(t, http.MethodPost, svc.base+"/auth/sign-in-codes", from("203.0.113.7"), emailBody("limit.30@example.com"))
	checkTooMany(t, "the 31st code", refused)

	send(t, http.MethodPost, svc.base+"/auth/sign-in-codes", from("203.0.113.8"), emailBody("limit.30@example.com")).
		decode(t, http.StatusAccepted, &c)

	// An order counts before its dishes are read, so one of a dish that does
	// not exist is enough.
	unknown := cartOf(cartLine{"01a17df3-0000-7000-8000-000000000000", 1})
	placing := from("203.0.113.9")

	for i := range 60 {
		placing.Set("Idempotency-Key", "limit-0123456789-"+strconv.Itoa(i))

		if resp := send(t, http.MethodPost, svc.base+"/orders", placing, unknown); resp.status == http.StatusTooManyRequests {
			t.Fatalf("order %d refused for its address", i+1)
		}
	}

	placing.Set("Idempotency-Key", "limit-0123456789-60")
	checkTooMany(t, "the 61st order", send(t, http.MethodPost, svc.base+"/orders", placing, unknown))
}

func checkTooMany(t *testing.T, what string, resp response) {
	t.Helper()

	var p problem

	resp.decode(t, http.StatusTooManyRequests, &p)

	if p.Code != "PLATFORM_TOO_MANY_REQUESTS" || resp.header.Get("Retry-After") == "" {
		t.Errorf("%s: %s with Retry-After %q", what, p.Code, resp.header.Get("Retry-After"))
	}
}
