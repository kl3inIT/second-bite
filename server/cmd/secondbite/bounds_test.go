package main

import (
	"net/http"
	"testing"
)

// boundsAdminEmail is an admin of its own, so its sign-in waits on no other check's.
const boundsAdminEmail = "bounds.admin@example.com"

// checkBounds: an offset or a page past what a list can hold, which once
// wrapped to a negative number and answered 500, and an order key too short to
// be unguessable are refused with 400 before any work (SEC-167).
func checkBounds(t *testing.T, svc service) {
	t.Helper()

	admin := bearer(signIn(t, svc, boundsAdminEmail).Token)
	customer := bearer(signIn(t, svc, "bounds.customer@example.com").Token)

	for _, c := range []struct {
		what   string
		path   string
		header http.Header
	}{
		{"the public search", "/offers?latitude=21.0565&longitude=105.8964&offset=3000000000", nil},
		{"a customer's orders", "/orders?offset=3000000000", customer},
		{"the admin's stores", "/admin/sellers?page=3000000000", admin},
	} {
		var p problem

		send(t, http.MethodGet, svc.base+c.path, c.header, nil).decode(t, http.StatusBadRequest, &p)

		if p.Code != "PLATFORM_REQUEST_INVALID" {
			t.Errorf("%s: %s, want PLATFORM_REQUEST_INVALID", c.what, p.Code)
		}
	}

	placing := customer.Clone()
	placing.Set("Idempotency-Key", "short-key-15chr")

	var p problem

	send(t, http.MethodPost, svc.base+"/orders", placing, cartOf(cartLine{"01a17df3-0000-7000-8000-000000000000", 1})).
		decode(t, http.StatusBadRequest, &p)
}
