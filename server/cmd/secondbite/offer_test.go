package main

import (
	"bytes"
	"image"
	"image/png"
	"net/http"
	"net/url"
	"testing"
	"time"
)

// offerAdminEmail is a third admin, so this check signs in apart from the
// others that run beside it.
const offerAdminEmail = "offer.admin@example.com"

// checkOfferFlow has an active seller's owner post an offer, and anyone find
// it near Tasco Mall by words typed without marks and read the seller's page,
// through the API as the clients will.
func checkOfferFlow(t *testing.T, svc service) {
	t.Helper()

	owner := bearer(signIn(t, svc, "offer.owner@example.com").Token)

	var opened sellerResponse

	send(t, http.MethodPost, svc.base+"/sellers", owner, newSeller("Quầy xôi Tasco", "0912 345 670")).
		decode(t, http.StatusCreated, &opened)

	var buf bytes.Buffer
	if err := png.Encode(&buf, image.NewGray(image.Rect(0, 0, 64, 48))); err != nil {
		t.Fatal(err)
	}

	var photo struct {
		ID string `json:"id"`
	}

	sendRaw(t, http.MethodPost, svc.base+"/photos", owner, "image/png", buf.Bytes()).decode(t, http.StatusCreated, &photo)

	now := time.Now()
	details := map[string]any{
		"name": "Xôi xéo đậu xanh", "kind": "prepared_food", "unit": "hộp", "units": 4, "priceVnd": 15000,
		"originalPriceVnd": 30000, "photoId": photo.ID,
		"windowStart": now.Format(time.RFC3339), "windowEnd": now.Add(2 * time.Hour).Format(time.RFC3339),
	}

	offersURL := svc.base + "/sellers/" + opened.ID + "/offers"
	if p := send(t, http.MethodPost, offersURL, owner, details).problem(t, http.StatusForbidden); p.Code != "SELLER_NOT_ACTIVE" {
		t.Errorf("posting for a pending seller: %q", p.Code)
	}

	admin := bearer(signIn(t, svc, offerAdminEmail).Token)
	send(t, http.MethodPost, svc.base+"/admin/sellers/"+opened.ID+"/activate", admin, nil).decode(t, http.StatusOK, &struct{}{})

	var posted struct {
		ID              string `json:"id"`
		Status          string `json:"status"`
		DiscountPercent int    `json:"discountPercent"`
	}

	send(t, http.MethodPost, offersURL, owner, details).decode(t, http.StatusCreated, &posted)

	if posted.Status != "on_sale" || posted.DiscountPercent != 50 {
		t.Fatalf("posted %+v", posted)
	}

	var found struct {
		Offers []struct {
			ID        string `json:"id"`
			UnitsLeft int    `json:"unitsLeft"`
			Seller    struct {
				Name string `json:"name"`
			} `json:"seller"`
			DistanceMeters *float64 `json:"distanceMeters"`
		} `json:"offers"`
	}

	// Anyone searches, without signing in.
	query := url.Values{"near": {"21.0565,105.8964"}, "q": {"xoi xeo dau"}, "sellerId": {opened.ID}}
	send(t, http.MethodGet, svc.base+"/offers?"+query.Encode(), nil, nil).decode(t, http.StatusOK, &found)

	if len(found.Offers) != 1 || found.Offers[0].ID != posted.ID || found.Offers[0].UnitsLeft != 4 ||
		found.Offers[0].Seller.Name != "Quầy xôi Tasco" || found.Offers[0].DistanceMeters == nil {
		t.Fatalf("found %+v", found)
	}

	if p := send(t, http.MethodGet, svc.base+"/offers?sort=distance", nil, nil).problem(t, http.StatusBadRequest); p.Code != "OFFER_SEARCH_INVALID" {
		t.Errorf("sorting by distance from no point: %q", p.Code)
	}

	var profile struct {
		Name string `json:"name"`
	}

	send(t, http.MethodGet, svc.base+"/sellers/"+opened.ID+"/profile", nil, nil).decode(t, http.StatusOK, &profile)

	if profile.Name != "Quầy xôi Tasco" {
		t.Errorf("the seller's page: %+v", profile)
	}
}
