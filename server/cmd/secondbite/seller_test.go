package main

import (
	"net/http"
	"testing"
)

// sellerAdminEmail is a second admin, so this check signs in apart from the
// others that run beside it.
const sellerAdminEmail = "seller.admin@example.com"

type sellerResponse struct {
	ID     string `json:"id"`
	Status string `json:"status"`
	MyRole string `json:"myRole"`
}

// newSeller is the body that opens a seller at Tasco Mall.
func newSeller(name, phone string) map[string]any {
	return map[string]any{
		"name": name, "address": "Tasco Mall, Việt Hưng", "latitude": 21.0565, "longitude": 105.8964, "phone": phone,
	}
}

// checkSellerFlow opens a seller, adds staff who sign in through Mailpit, and
// has an admin block it and lift the block, through the API as the clients will.
func checkSellerFlow(t *testing.T, svc service) {
	t.Helper()

	owner := bearer(signIn(t, svc, "seller.owner@example.com").Token)

	var opened sellerResponse

	send(t, http.MethodPost, svc.base+"/sellers", owner, newSeller("Bánh mì Tasco", "0912 345 678")).
		decode(t, http.StatusCreated, &opened)

	if opened.Status != "active" || opened.MyRole != "owner" {
		t.Fatalf("opened %+v", opened)
	}

	sellerURL := svc.base + "/sellers/" + opened.ID

	send(t, http.MethodPost, sellerURL+"/members", owner, emailBody("seller.staff@example.com")).
		decode(t, http.StatusCreated, &struct{}{})

	// The staff member had no account; they sign in like anyone and find the seller.
	staff := bearer(signIn(t, svc, "seller.staff@example.com").Token)

	var mine struct {
		Sellers []sellerResponse `json:"sellers"`
	}

	send(t, http.MethodGet, svc.base+"/sellers/mine", staff, nil).decode(t, http.StatusOK, &mine)

	if len(mine.Sellers) != 1 || mine.Sellers[0].ID != opened.ID || mine.Sellers[0].MyRole != "staff" {
		t.Fatalf("staff's sellers %+v", mine)
	}

	body := map[string]any{"name": "Renamed", "address": "x", "latitude": 21, "longitude": 105, "phone": "0912345678"}
	if p := send(t, http.MethodPut, sellerURL, staff, body).problem(t, http.StatusForbidden); p.Code != "SELLER_OWNER_REQUIRED" {
		t.Errorf("staff changing the seller: %q", p.Code)
	}

	stranger := bearer(signIn(t, svc, "seller.stranger@example.com").Token)
	if p := send(t, http.MethodGet, sellerURL, stranger, nil).problem(t, http.StatusNotFound); p.Code != "SELLER_NOT_FOUND" {
		t.Errorf("a stranger reading the seller: %q", p.Code)
	}

	if p := send(t, http.MethodPost, svc.base+"/admin/sellers/"+opened.ID+"/block", owner, nil).problem(t, http.StatusForbidden); p.Code != "PLATFORM_ADMIN_REQUIRED" {
		t.Errorf("the owner blocking: %q", p.Code)
	}

	admin := bearer(signIn(t, svc, sellerAdminEmail).Token)

	var blocked sellerResponse

	send(t, http.MethodPost, svc.base+"/admin/sellers/"+opened.ID+"/block", admin, nil).decode(t, http.StatusOK, &blocked)

	if blocked.Status != "blocked" {
		t.Errorf("blocked %+v", blocked)
	}

	var listed struct {
		Sellers []sellerResponse `json:"sellers"`
	}

	send(t, http.MethodGet, svc.base+"/admin/sellers?status=blocked", admin, nil).decode(t, http.StatusOK, &listed)

	found := false
	for _, s := range listed.Sellers {
		found = found || s.ID == opened.ID
	}

	if !found {
		t.Fatalf("the blocked list lacks the seller: %+v", listed)
	}

	var activated sellerResponse

	send(t, http.MethodPost, svc.base+"/admin/sellers/"+opened.ID+"/activate", admin, nil).decode(t, http.StatusOK, &activated)

	if activated.Status != "active" {
		t.Errorf("activated %+v", activated)
	}
}
