package main

import (
	"net/http"
	"strings"
	"testing"
	"time"
)

// sellerAdminEmail is a second admin, so this check signs in apart from the
// others that run beside it.
const sellerAdminEmail = "seller.admin@example.com"

type sellerResponse struct {
	ID           string `json:"id"`
	Status       string `json:"status"`
	StatusReason string `json:"statusReason"`
	MyRole       string `json:"myRole"`
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

	ownerSession := signIn(t, svc, "seller.owner@example.com")
	owner := bearer(ownerSession.Token)

	var opened sellerResponse

	send(t, http.MethodPost, svc.base+"/sellers", owner, newSeller("Bánh mì Tasco", "0912 345 678")).
		decode(t, http.StatusCreated, &opened)

	if opened.Status != "active" || opened.MyRole != "owner" {
		t.Fatalf("opened %+v", opened)
	}

	// A phone too short reaches the module's rule and its words, in the request's language (SEC-28).
	short := newSeller("Quán thử", "12")
	if p := send(t, http.MethodPost, svc.base+"/sellers", owner, short).problem(t, http.StatusBadRequest); p.Code != "SELLER_PHONE_INVALID" ||
		p.Detail != "Nhập số điện thoại 9 đến 15 chữ số, ví dụ 0912 345 678." {
		t.Errorf("a short phone: %q %q", p.Code, p.Detail)
	}

	inEnglish := owner.Clone()
	inEnglish.Set("Accept-Language", "en")

	if p := send(t, http.MethodPost, svc.base+"/sellers", inEnglish, short).problem(t, http.StatusBadRequest); p.Detail != "Enter a phone number of 9 to 15 digits, such as 0912 345 678." {
		t.Errorf("a short phone in English: %q", p.Detail)
	}

	sellerURL := svc.base + "/sellers/" + opened.ID

	send(t, http.MethodPost, sellerURL+"/members", owner, emailBody("seller.staff@example.com")).
		decode(t, http.StatusCreated, &struct{}{})

	// The staff member had no account; they sign in like anyone and find the seller.
	staffSession := signIn(t, svc, "seller.staff@example.com")
	staff := bearer(staffSession.Token)

	var mine struct {
		Sellers []sellerResponse `json:"sellers"`
	}

	send(t, http.MethodGet, svc.base+"/sellers/mine", staff, nil).decode(t, http.StatusOK, &mine)

	if len(mine.Sellers) != 1 || mine.Sellers[0].ID != opened.ID || mine.Sellers[0].MyRole != "staff" {
		t.Fatalf("staff's sellers %+v", mine)
	}

	body := newSeller("Renamed", "0912345678")
	if p := send(t, http.MethodPut, sellerURL, staff, body).problem(t, http.StatusForbidden); p.Code != "SELLER_OWNER_REQUIRED" {
		t.Errorf("staff changing the seller: %q", p.Code)
	}

	outside := newSeller("Renamed", "0912345678")
	outside["latitude"], outside["longitude"] = 10.7769, 106.7009 // Ho Chi Minh City

	if p := send(t, http.MethodPut, sellerURL, owner, outside).problem(t, http.StatusBadRequest); p.Code != "SELLER_LOCATION_OUTSIDE" {
		t.Errorf("the owner moving the seller out of Hanoi: %q", p.Code)
	}

	checkPlacesNeedACaller(t, svc, owner)

	stranger := bearer(signIn(t, svc, "seller.stranger@example.com").Token)
	if p := send(t, http.MethodGet, sellerURL, stranger, nil).problem(t, http.StatusNotFound); p.Code != "SELLER_NOT_FOUND" {
		t.Errorf("a stranger reading the seller: %q", p.Code)
	}

	if p := send(t, http.MethodPost, svc.base+"/admin/sellers/"+opened.ID+"/block", owner, reasonBody(testReason)).problem(t, http.StatusForbidden); p.Code != codeAdminRequired {
		t.Errorf("the owner blocking: %q", p.Code)
	}

	admin := bearer(signIn(t, svc, sellerAdminEmail).Token)
	checkMembershipsOfAccounts(t, svc, admin, ownerSession.Account.ID, staffSession.Account.ID)
	checkAdminBlocksAndLifts(t, svc, admin, opened.ID)
}

// checkMembershipsOfAccounts has an admin read the sellers of two accounts at
// once, the ids repeated in the query as the generated clients send an array
// (SEC-75).
func checkMembershipsOfAccounts(t *testing.T, svc service, admin http.Header, ownerID, staffID string) {
	t.Helper()

	var held struct {
		Memberships []struct {
			AccountID string `json:"accountId"`
			Role      string `json:"role"`
		} `json:"memberships"`
	}

	send(t, http.MethodGet, svc.base+"/admin/memberships?accountId="+ownerID+"&accountId="+staffID, admin, nil).
		decode(t, http.StatusOK, &held)

	roles := map[string]string{}
	for _, m := range held.Memberships {
		roles[m.AccountID] = m.Role
	}

	if len(held.Memberships) != 2 || roles[ownerID] != "owner" || roles[staffID] != "staff" {
		t.Errorf("the memberships of the owner and the staff member: %+v", held)
	}
}

// checkAdminBlocksAndLifts has an admin block the seller with a reason, find
// it among the blocked sellers by words without marks, see its owner emailed
// the reason, and approve it again (SEC-75).
func checkAdminBlocksAndLifts(t *testing.T, svc service, admin http.Header, sellerID string) {
	t.Helper()

	var blocked sellerResponse

	send(t, http.MethodPost, svc.base+"/admin/sellers/"+sellerID+"/block", admin, reasonBody(testReason)).
		decode(t, http.StatusOK, &blocked)

	if blocked.Status != "blocked" || blocked.StatusReason != testReason {
		t.Errorf("blocked %+v", blocked)
	}

	var listed struct {
		Items []struct {
			sellerResponse

			OwnerEmail string `json:"ownerEmail"`
		} `json:"items"`
		Total int `json:"total"`
	}

	send(t, http.MethodGet, svc.base+"/admin/sellers?status=blocked&q=banh+mi+tasco", admin, nil).decode(t, http.StatusOK, &listed)

	if listed.Total != 1 || len(listed.Items) != 1 || listed.Items[0].ID != sellerID || listed.Items[0].OwnerEmail != "seller.owner@example.com" {
		t.Fatalf("the blocked sellers named Bánh mì Tasco: %+v", listed)
	}

	email := waitEmail(t, svc, "seller.owner@example.com", "đã bị tạm khoá")
	if !strings.Contains(email, testReason) {
		t.Errorf("the owner's email lacks the reason: %q", email)
	}

	if p := send(t, http.MethodPost, svc.base+"/admin/sellers/"+sellerID+"/block", admin, reasonBody(testReason)).
		problem(t, http.StatusConflict); p.Code != "SELLER_STATUS_CHANGE_NOT_ALLOWED" {
		t.Errorf("blocking a blocked seller: %q", p.Code)
	}

	if p := send(t, http.MethodPost, svc.base+"/admin/sellers/"+sellerID+"/block", admin, reasonBody("ngắn")).
		problem(t, http.StatusBadRequest); p.Code != "PLATFORM_REQUEST_INVALID" {
		t.Errorf("a reason too short: %q", p.Code)
	}

	var approved sellerResponse

	send(t, http.MethodPost, svc.base+"/admin/sellers/"+sellerID+"/approve", admin, nil).decode(t, http.StatusOK, &approved)

	if approved.Status != "active" || approved.StatusReason != "" {
		t.Errorf("approved %+v", approved)
	}
}

// testReason is what an admin tells an owner in these checks.
const testReason = "Bán món đã quá hạn sử dụng"

func reasonBody(reason string) map[string]string {
	return map[string]string{"reason": reason}
}

// waitEmail waits for an email to address whose subject holds subject, and
// answers its text.
func waitEmail(t *testing.T, svc service, address, subject string) string {
	t.Helper()

	deadline := time.Now().Add(15 * time.Second)

	for time.Now().Before(deadline) {
		if id, ok := newestEmailTo(t, svc, address); ok {
			var msg struct {
				Subject string `json:"Subject"`
				Text    string `json:"Text"`
			}

			send(t, http.MethodGet, svc.mailpit+"/api/v1/message/"+id, nil, nil).decode(t, http.StatusOK, &msg)

			if strings.Contains(msg.Subject, subject) {
				return msg.Text
			}
		}

		time.Sleep(200 * time.Millisecond)
	}

	t.Fatalf("no email to %s about %q", address, subject)

	return ""
}

// checkPlacesNeedACaller: suggestions for an address are for someone signed in, from two letters typed.
func checkPlacesNeedACaller(t *testing.T, svc service, signedIn http.Header) {
	t.Helper()

	places := svc.base + "/sellers/places?q="
	if p := send(t, http.MethodGet, places+"hoa+lam", nil, nil).problem(t, http.StatusUnauthorized); p.Code != codeAuthenticationRequired {
		t.Errorf("anonymous suggestions: %q", p.Code)
	}

	if p := send(t, http.MethodGet, places+"h", signedIn, nil).problem(t, http.StatusBadRequest); p.Code != "PLATFORM_REQUEST_INVALID" {
		t.Errorf("one letter: %q", p.Code)
	}
}
