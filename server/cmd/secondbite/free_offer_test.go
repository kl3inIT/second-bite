package main

import (
	"bytes"
	"image"
	"image/png"
	"net/http"
	"testing"
	"time"
)

// checkFreeOffer has a store post food given away free, at 0 đồng with its
// original price, and a customer reserve it and the store hand it over, the
// order coming to 0 throughout. A free offer without an original price, and a
// paid one below the paid minimum, are refused.
func checkFreeOffer(t *testing.T, svc service) {
	t.Helper()

	owner := bearer(signIn(t, svc, "free.owner@example.com").Token)

	var opened sellerResponse

	send(t, http.MethodPost, svc.base+"/sellers", owner, newSeller("Cơm Tasco", "0912 345 672")).
		decode(t, http.StatusCreated, &opened)

	var buf bytes.Buffer
	if err := png.Encode(&buf, image.NewGray(image.Rect(0, 0, 64, 48))); err != nil {
		t.Fatal(err)
	}

	var photo struct {
		ID string `json:"id"`
	}

	sendRaw(t, http.MethodPost, svc.base+"/photos", owner, "image/png", buf.Bytes()).decode(t, http.StatusCreated, &photo)

	type offerDetails struct {
		Name             string `json:"name"`
		Kind             string `json:"kind"`
		Units            int    `json:"units"`
		PriceVND         int    `json:"priceVnd"`
		OriginalPriceVND int    `json:"originalPriceVnd"`
		PhotoID          string `json:"photoId"`
		WindowStart      string `json:"windowStart"`
		WindowEnd        string `json:"windowEnd"`
	}

	now := time.Now()
	offerOf := func(price, original int) offerDetails {
		return offerDetails{
			"Cơm suất", "prepared_food", 10, price, original, photo.ID,
			now.Format(time.RFC3339), now.Add(2 * time.Hour).Format(time.RFC3339),
		}
	}
	offersURL := svc.base + "/sellers/" + opened.ID + "/offers"

	if p := send(t, http.MethodPost, offersURL, owner, offerOf(0, 0)).problem(t, http.StatusBadRequest); p.Code != codeRequestInvalid {
		t.Errorf("free without an original price: %q", p.Code)
	}

	if p := send(t, http.MethodPost, offersURL, owner, offerOf(500, 30_000)).problem(t, http.StatusBadRequest); p.Code != "OFFER_DETAILS_INVALID" {
		t.Errorf("a paid price below 1,000 đồng: %q", p.Code)
	}

	var posted struct {
		ID              string `json:"id"`
		PriceVND        int64  `json:"priceVnd"`
		DiscountPercent int    `json:"discountPercent"`
	}

	send(t, http.MethodPost, offersURL, owner, offerOf(0, 30_000)).decode(t, http.StatusCreated, &posted)

	if posted.PriceVND != 0 || posted.DiscountPercent != 100 {
		t.Fatalf("posted free: %+v", posted)
	}

	customer := bearer(signIn(t, svc, "free.customer@example.com").Token)
	customer.Set("Idempotency-Key", "free-offer-0123456789")

	var placed struct {
		orderResponse

		PayVND int64 `json:"payVnd"`
	}

	send(t, http.MethodPost, svc.base+"/orders", customer, cartOf(cartLine{posted.ID, 2})).decode(t, http.StatusCreated, &placed)

	if placed.Status != "confirmed" || placed.TotalVND != 0 || placed.PayVND != 0 || len(placed.Lines) != 1 || placed.Lines[0].Units != 2 {
		t.Fatalf("reserved free: %+v", placed)
	}

	handOver(t, svc, owner, placed.orderResponse)
}
