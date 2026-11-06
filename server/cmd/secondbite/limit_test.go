package main

import (
	"fmt"
	"net/http"
	"strconv"
	"testing"
)

// forwardedFor is the header the edge proxy names the caller's address in.
const forwardedFor = "X-Forwarded-For"

// checkLimitsPerAddress: one address asking for more sign-in codes, or placing
// more orders, than a mall's Wi-Fi would in ten minutes is refused with 429 and
// a wait, whatever the email addresses or the orders; another address is not
// (SEC-160).
func checkLimitsPerAddress(t *testing.T, svc service) {
	t.Helper()

	from := func(address string) http.Header { return http.Header{forwardedFor: {address}} }

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

// checkOpenOrdersPerAddress: once an address holds openPerAddress orders still
// to collect, it places no more until one ends, whatever the phone numbers;
// another address still does (SEC-158). The order settings are lowered for the
// check, so it runs alone.
func checkOpenOrdersPerAddress(t *testing.T, svc service) {
	t.Helper()

	admin := bearer(signIn(t, svc, adminEmail).Token)

	_, restore := changeSettings(t, svc, admin, "/admin/order-settings", func(s map[string]any) {
		s["openPerAddress"] = 2
	})
	defer restore()

	owner := bearer(signIn(t, svc, "limit.owner@example.com").Token)
	offerID := postedOffer(t, svc, owner)

	place := func(address, phone, key string) response {
		header := http.Header{forwardedFor: {address}, "Idempotency-Key": {"open-per-address-" + key}}

		return send(t, http.MethodPost, svc.base+"/orders", header, cart{[]cartLine{{offerID, 1}}, "Lan", phone})
	}

	for i, phone := range []string{"0900000101", "0900000102"} {
		if resp := place("198.51.100.20", phone, strconv.Itoa(i)+"-0123456789"); resp.status != http.StatusCreated {
			t.Fatalf("order %d from the address: %d %s", i+1, resp.status, resp.body)
		}
	}

	if p := place("198.51.100.20", "0900000103", "2-0123456789").problem(t, http.StatusTooManyRequests); p.Code != "ORDER_ADDRESS_HOLDS_ORDERS" {
		t.Errorf("a third open order from the address: %q", p.Code)
	}

	if resp := place("198.51.100.21", "0900000103", "3-0123456789"); resp.status != http.StatusCreated {
		t.Errorf("an order from another address: %d %s", resp.status, resp.body)
	}
}
