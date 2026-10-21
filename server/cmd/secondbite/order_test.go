package main

import (
	"bytes"
	"image"
	"image/png"
	"net/http"
	"testing"
	"time"
)

// orderAdminEmail is a fourth admin, so this check signs in apart from the
// others that run beside it.
const orderAdminEmail = "order.admin@example.com"

type orderResponse struct {
	ID               string `json:"id"`
	Number           string `json:"number"`
	Status           string `json:"status"`
	TotalVND         int64  `json:"totalVnd"`
	Code             string `json:"code"`
	CodeAttemptsLeft int    `json:"codeAttemptsLeft"`
	Lines            []struct {
		Name  string `json:"name"`
		Units int    `json:"units"`
	} `json:"lines"`
}

type cartLine struct {
	OfferID string `json:"offerId"`
	Units   int    `json:"units"`
}

type cart struct {
	Lines []cartLine `json:"lines"`
}

// checkOrderFlow has a customer order an offer of an active seller through
// the API, as the clients will, and the seller's owner mark it ready and hand
// it over against the code the customer is shown.
func checkOrderFlow(t *testing.T, svc service) {
	t.Helper()

	owner := bearer(signIn(t, svc, "order.owner@example.com").Token)
	offerID := postedOffer(t, svc, owner)
	customer := bearer(signIn(t, svc, "order.customer@example.com").Token)

	placed := placeTwice(t, svc, customer, offerID)

	placing := customer.Clone()
	placing.Set("Idempotency-Key", "order-flow-2")

	if p := send(t, http.MethodPost, svc.base+"/orders", placing, cart{[]cartLine{{offerID, 4}}}).
		problem(t, http.StatusConflict); p.Code != "ORDER_OFFER_SOLD_OUT" {
		t.Errorf("more units than are left: %q", p.Code)
	}

	handOver(t, svc, owner, placed)

	var mine struct {
		Orders []orderResponse `json:"orders"`
	}

	send(t, http.MethodGet, svc.base+"/orders?state=ended", customer, nil).decode(t, http.StatusOK, &mine)

	if len(mine.Orders) != 1 || mine.Orders[0].ID != placed.ID {
		t.Errorf("the customer's ended orders: %+v", mine)
	}
}

// placeTwice orders two units of an offer, then sends the same order again
// with the same Idempotency-Key, which returns the first.
func placeTwice(t *testing.T, svc service, customer http.Header, offerID string) orderResponse {
	t.Helper()

	twoUnits := cart{[]cartLine{{offerID, 2}}}

	if p := send(t, http.MethodPost, svc.base+"/orders", customer, twoUnits).problem(t, http.StatusBadRequest); p.Code != "PLATFORM_REQUEST_INVALID" {
		t.Errorf("placing without an Idempotency-Key: %q", p.Code)
	}

	placing := customer.Clone()
	placing.Set("Idempotency-Key", "order-flow-1")

	var placed, again orderResponse

	send(t, http.MethodPost, svc.base+"/orders", placing, twoUnits).decode(t, http.StatusCreated, &placed)

	if placed.Status != "confirmed" || placed.TotalVND != 30_000 || len(placed.Number) < 4 || placed.Number[:3] != "SB-" ||
		len(placed.Lines) != 1 || placed.Lines[0].Units != 2 || len(placed.Code) != 4 {
		t.Fatalf("placed %+v", placed)
	}

	send(t, http.MethodPost, svc.base+"/orders", placing, twoUnits).decode(t, http.StatusCreated, &again)

	if again.ID != placed.ID {
		t.Errorf("the same key again placed %s, want %s", again.ID, placed.ID)
	}

	return placed
}

// handOver has the seller's owner give a wrong code, mark the order ready,
// then hand it over against the code the customer was shown.
func handOver(t *testing.T, svc service, owner http.Header, placed orderResponse) {
	t.Helper()

	orderURL := svc.base + "/orders/" + placed.ID

	if p := send(t, http.MethodPost, orderURL+"/hand-over", owner, map[string]string{"code": wrongCollectionCode(placed.Code)}).
		problem(t, http.StatusConflict); p.Code != "ORDER_CODE_WRONG" {
		t.Errorf("a wrong code: %q", p.Code)
	}

	var ready, collected orderResponse

	send(t, http.MethodPost, orderURL+"/ready", owner, nil).decode(t, http.StatusOK, &ready)

	if ready.Status != "ready" || ready.Code != "" || ready.CodeAttemptsLeft != 2 {
		t.Errorf("ready, as staff see it: %+v", ready)
	}

	send(t, http.MethodPost, orderURL+"/hand-over", owner, map[string]string{"code": placed.Code}).decode(t, http.StatusOK, &collected)

	if collected.Status != "collected" {
		t.Errorf("handed over %+v", collected)
	}
}

// postedOffer opens a seller for owner, has an admin activate it, and posts an
// offer of five units at 15,000 đồng collected from now.
func postedOffer(t *testing.T, svc service, owner http.Header) string {
	t.Helper()

	var opened sellerResponse

	send(t, http.MethodPost, svc.base+"/sellers", owner, newSeller("La Paris", "0912 345 671")).decode(t, http.StatusCreated, &opened)

	admin := bearer(signIn(t, svc, orderAdminEmail).Token)
	send(t, http.MethodPost, svc.base+"/admin/sellers/"+opened.ID+"/activate", admin, nil).decode(t, http.StatusOK, &struct{}{})

	var buf bytes.Buffer
	if err := png.Encode(&buf, image.NewGray(image.Rect(0, 0, 64, 48))); err != nil {
		t.Fatal(err)
	}

	var photo, posted struct {
		ID string `json:"id"`
	}

	sendRaw(t, http.MethodPost, svc.base+"/photos", owner, "image/png", buf.Bytes()).decode(t, http.StatusCreated, &photo)

	now := time.Now()

	send(t, http.MethodPost, svc.base+"/sellers/"+opened.ID+"/offers", owner, struct {
		Name             string `json:"name"`
		Kind             string `json:"kind"`
		Units            int    `json:"units"`
		PriceVND         int    `json:"priceVnd"`
		OriginalPriceVND int    `json:"originalPriceVnd"`
		PhotoID          string `json:"photoId"`
		WindowStart      string `json:"windowStart"`
		WindowEnd        string `json:"windowEnd"`
	}{
		"Croissant", "bakery", 5, 15_000, 30_000, photo.ID, now.Format(time.RFC3339), now.Add(2 * time.Hour).Format(time.RFC3339),
	}).decode(t, http.StatusCreated, &posted)

	return posted.ID
}

// wrongCollectionCode is a four-digit code other than code.
func wrongCollectionCode(code string) string {
	if code == "0000" {
		return "0001"
	}

	return "0000"
}
