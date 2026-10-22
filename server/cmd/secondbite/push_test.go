package main

import (
	"net/http"
	"testing"
)

// checkPushSubscribe has a browser follow an order by Web Push as the web
// does: the key from GET /push/key, then the subscription as PushSubscription's
// toJSON writes it, with the customer's live ticket. A ticket works once.
func checkPushSubscribe(t *testing.T, svc service) {
	t.Helper()

	var key struct {
		PublicKey string `json:"publicKey"`
	}

	send(t, http.MethodGet, svc.base+"/push/key", nil, nil).decode(t, http.StatusOK, &key)

	if key.PublicKey != svc.getenv("SECONDBITE_PUSH_PUBLIC_KEY") {
		t.Errorf("the key served %q, want the configured one", key.PublicKey)
	}

	owner := bearer(signIn(t, svc, "push.owner@example.com").Token)
	offerID := postedOffer(t, svc, owner)
	customer := bearer(signIn(t, svc, "push.customer@example.com").Token)

	placing := customer.Clone()
	placing.Set("Idempotency-Key", "push-1")

	var placed orderResponse

	send(t, http.MethodPost, svc.base+"/orders", placing, cartOf(cartLine{offerID, 1})).decode(t, http.StatusCreated, &placed)

	var ticket struct {
		Ticket string `json:"ticket"`
	}

	send(t, http.MethodPost, svc.base+"/orders/"+placed.ID+"/live-ticket", customer, nil).decode(t, http.StatusOK, &ticket)

	// Never sent to: nothing changes this order while the check runs.
	subscription := map[string]any{
		"endpoint": "https://fcm.googleapis.com/fcm/send/second-bite-test",
		"keys":     map[string]string{"p256dh": "BElm-test-key", "auth": "test-auth"},
		"tickets":  []string{ticket.Ticket},
	}

	if r := send(t, http.MethodPost, svc.base+"/push/subscriptions", nil, subscription); r.status != http.StatusNoContent {
		t.Fatalf("subscribing answered %d: %s", r.status, r.body)
	}

	if p := send(t, http.MethodPost, svc.base+"/push/subscriptions", nil, subscription).problem(t, http.StatusBadRequest); p.Code != "NOTIFICATION_PUSH_TICKET_INVALID" {
		t.Errorf("a spent ticket: %q", p.Code)
	}

	remove := map[string]string{"endpoint": "https://fcm.googleapis.com/fcm/send/second-bite-test"}
	if r := send(t, http.MethodPost, svc.base+"/push/subscriptions/remove", nil, remove); r.status != http.StatusNoContent {
		t.Errorf("unsubscribing answered %d: %s", r.status, r.body)
	}
}
