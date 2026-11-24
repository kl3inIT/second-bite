package main

import (
	"bytes"
	"context"
	"image"
	"image/png"
	"net/http"
	"sync"
	"testing"
	"time"

	"github.com/jackc/pgx/v5"
)

// What a collected order's status and collectedBy read in these checks.
const (
	statusCollected = "collected"
	byCustomer      = "customer"
	codeNotFound    = "ORDER_NOT_FOUND"
)

type collectedResponse struct {
	orderResponse

	CollectedBy string `json:"collectedBy"`
	CollectedAt string `json:"collectedAt"`
	CanReview   bool   `json:"canReview"`
}

// checkCustomerCollects has customers confirm they collected their orders,
// "Đã nhận món", signed in and with an order's access, as the store's "Đã
// giao" would: the order is collected, says its customer confirmed it and
// opens its review. Someone else, an order ended, and a window not open or
// over are refused; the store and the customer confirming at once make one
// collection and one event.
func checkCustomerCollects(t *testing.T, svc service) {
	t.Helper()

	owner := bearer(signIn(t, svc, "collect.owner@example.com").Token)
	sellerID, offerID := postedOfferOf(t, svc, owner, "Bếp Tasco")
	customer := bearer(signIn(t, svc, "collect.customer@example.com").Token)
	stranger := bearer(signIn(t, svc, "collect.stranger@example.com").Token)

	place := func(header http.Header, phone, key, offer string) collectedResponse {
		t.Helper()

		placing := header.Clone()
		placing.Set("Idempotency-Key", key)

		var placed collectedResponse

		send(t, http.MethodPost, svc.base+"/orders", placing, cart{[]cartLine{{offer, 1}}, "Minh Anh", phone}).
			decode(t, http.StatusCreated, &placed)

		return placed
	}

	signedIn := place(customer, "0901234501", "collect-signed-in-0123", offerID)
	collectURL := svc.base + "/orders/" + signedIn.ID + "/collect"

	for who, header := range map[string]http.Header{"someone signed out": nil, "another customer": stranger, "the store": owner} {
		if p := send(t, http.MethodPost, collectURL, header, nil).problem(t, http.StatusNotFound); p.Code != codeNotFound {
			t.Errorf("%s confirms the collection: %q", who, p.Code)
		}
	}

	var collected collectedResponse

	send(t, http.MethodPost, collectURL, customer, nil).decode(t, http.StatusOK, &collected)

	if collected.Status != statusCollected || collected.CollectedBy != byCustomer || collected.CollectedAt == "" || !collected.CanReview {
		t.Errorf("confirmed by its customer: %+v", collected)
	}

	// The store pressing "Đã giao" afterwards finds it collected, as its customer confirmed it.
	var handed collectedResponse

	send(t, http.MethodPost, svc.base+"/orders/"+signedIn.ID+"/hand-over", owner, nil).decode(t, http.StatusOK, &handed)

	if handed.Status != statusCollected || handed.CollectedBy != byCustomer || handed.CollectedAt != collected.CollectedAt {
		t.Errorf("handed over once confirmed: %+v", handed)
	}

	guestCollects(t, svc, place(http.Header{}, "0901234502", "collect-guest-0123", offerID))
	storeAndCustomerRace(t, svc, owner, customer, place(customer, "0901234503", "collect-race-0123", offerID))
	endedNotCollected(t, svc, customer, place(customer, "0901234504", "collect-cancelled-0123", offerID),
		place(customer, "0901234505", "collect-expired-0123", offerID))

	later := postedLater(t, svc, owner, sellerID)
	early := place(customer, "0901234506", "collect-early-0123", later)

	if p := send(t, http.MethodPost, svc.base+"/orders/"+early.ID+"/collect", customer, nil).
		problem(t, http.StatusConflict); p.Code != "ORDER_OUTSIDE_WINDOW" {
		t.Errorf("confirmed before the window opens: %q", p.Code)
	}
}

// guestCollects has a customer who ordered without signing in confirm with
// the order's access; another access, or none, finds no order.
func guestCollects(t *testing.T, svc service, placed collectedResponse) {
	t.Helper()

	collectURL := svc.base + "/orders/" + placed.ID + "/collect"
	wrong := http.Header{}
	wrong.Set("Order-Access", "not-"+placed.Access)

	if p := send(t, http.MethodPost, collectURL, wrong, nil).problem(t, http.StatusNotFound); p.Code != codeNotFound {
		t.Errorf("another access: %q", p.Code)
	}

	access := http.Header{}
	access.Set("Order-Access", placed.Access)

	var collected collectedResponse

	send(t, http.MethodPost, collectURL, access, nil).decode(t, http.StatusOK, &collected)

	if collected.Status != statusCollected || collected.CollectedBy != byCustomer || collected.Access != placed.Access {
		t.Errorf("confirmed with the access: %+v", collected)
	}
}

// storeAndCustomerRace has the store's "Đã giao" and the customer's "Đã nhận
// món" sent at once: both answer the collected order, as whoever came first
// confirmed it, and the order holds one collection event.
func storeAndCustomerRace(t *testing.T, svc service, owner, customer http.Header, placed collectedResponse) {
	t.Helper()

	orderURL := svc.base + "/orders/" + placed.ID

	var (
		wg      sync.WaitGroup
		answers [2]response
	)

	for i, call := range []struct {
		path   string
		header http.Header
	}{{"/hand-over", owner}, {"/collect", customer}} {
		wg.Go(func() { answers[i] = send(t, http.MethodPost, orderURL+call.path, call.header, nil) })
	}

	wg.Wait()

	var results [2]collectedResponse
	for i := range answers {
		answers[i].decode(t, http.StatusOK, &results[i])
	}

	store, mine := results[0], results[1]
	if store.Status != statusCollected || mine.Status != statusCollected || store.CollectedBy != mine.CollectedBy ||
		store.CollectedAt != mine.CollectedAt {
		t.Errorf("the store and the customer at once: %+v and %+v", store, mine)
	}

	if events := collectionEvents(t, svc, placed.ID); events != 1 {
		t.Errorf("%d collection events, want 1", events)
	}
}

// endedNotCollected has the customer confirm an order they cancelled and one
// whose window is over, which ended without a collection.
func endedNotCollected(t *testing.T, svc service, customer http.Header, cancelled, expired collectedResponse) {
	t.Helper()

	send(t, http.MethodPost, svc.base+"/orders/"+cancelled.ID+"/cancel", customer, struct{}{}).decode(t, http.StatusOK, &struct{}{})
	execSQL(t, svc, `UPDATE order_orders SET window_start = now() - interval '3 hours', window_end = now() - interval '1 hour'
		WHERE id = $1`, expired.ID)

	for what, id := range map[string]string{"cancelled": cancelled.ID, "expired": expired.ID} {
		if p := send(t, http.MethodPost, svc.base+"/orders/"+id+"/collect", customer, nil).
			problem(t, http.StatusConflict); p.Code != "ORDER_TRANSITION_NOT_ALLOWED" {
			t.Errorf("confirming an order %s: %q", what, p.Code)
		}

		if events := collectionEvents(t, svc, id); events != 0 {
			t.Errorf("an order %s holds %d collection events", what, events)
		}
	}
}

// collectionEvents counts the collection events of an order.
func collectionEvents(t *testing.T, svc service, orderID string) int {
	t.Helper()

	conn, err := pgx.Connect(t.Context(), svc.dsn)
	if err != nil {
		t.Fatal(err)
	}

	defer func() {
		if err := conn.Close(context.WithoutCancel(t.Context())); err != nil {
			t.Error(err)
		}
	}()

	var n int
	if err := conn.QueryRow(t.Context(), `SELECT count(*) FROM order_events WHERE order_id = $1 AND kind = 'collected'`, orderID).
		Scan(&n); err != nil {
		t.Fatal(err)
	}

	return n
}

// postedLater posts an offer of the seller collected from an hour on.
func postedLater(t *testing.T, svc service, owner http.Header, sellerID string) string {
	t.Helper()

	var buf bytes.Buffer
	if err := png.Encode(&buf, image.NewGray(image.Rect(0, 0, 64, 48))); err != nil {
		t.Fatal(err)
	}

	var photo, posted struct {
		ID string `json:"id"`
	}

	sendRaw(t, http.MethodPost, svc.base+"/photos", owner, "image/png", buf.Bytes()).decode(t, http.StatusCreated, &photo)

	start := time.Now().Add(time.Hour)

	send(t, http.MethodPost, svc.base+"/sellers/"+sellerID+"/offers", owner, struct {
		Name             string `json:"name"`
		Kind             string `json:"kind"`
		Units            int    `json:"units"`
		PriceVND         int    `json:"priceVnd"`
		OriginalPriceVND int    `json:"originalPriceVnd"`
		PhotoID          string `json:"photoId"`
		WindowStart      string `json:"windowStart"`
		WindowEnd        string `json:"windowEnd"`
	}{
		"Bánh bao", "bakery", 5, 15_000, 30_000, photo.ID, start.Format(time.RFC3339), start.Add(2 * time.Hour).Format(time.RFC3339),
	}).decode(t, http.StatusCreated, &posted)

	return posted.ID
}
