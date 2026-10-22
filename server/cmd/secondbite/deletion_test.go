package main

import (
	"bytes"
	"context"
	"image"
	"image/png"
	"net/http"
	"testing"
	"time"

	"github.com/jackc/pgx/v5"
)

// The codes of the problems the deletion answers, as the clients branch on them.
const (
	codeAuthenticationRequired = "PLATFORM_AUTHENTICATION_REQUIRED"
	codeChallengeGone          = "IDENTITY_CHALLENGE_GONE"
	codeSessionInvalid         = "IDENTITY_SESSION_INVALID"
)

// deletionAdminEmail is the admin who tries to bring back the seller left
// without an owner, signed in apart from the other checks' admins.
const deletionAdminEmail = "deletion.admin@example.com"

// checkAccountDeletion has the owner of a seller delete their account through
// the API as the clients will (SEC-37): the emailed code, kept apart from the
// sign-in codes; the account, its sessions and the emails to its address gone
// at once; then, through the outbox, its memberships and unused photo gone and
// its seller blocked, while the photo the seller uses stays.
func checkAccountDeletion(t *testing.T, svc service) {
	t.Helper()

	const ownerEmail, staffEmail = "deleting.owner@example.com", "deleting.staff@example.com"

	ownerSession := signIn(t, svc, ownerEmail)
	owner := bearer(ownerSession.Token)

	var opened sellerResponse

	send(t, http.MethodPost, svc.base+"/sellers", owner, newSeller("Quán sắp đóng", "0912 345 670")).
		decode(t, http.StatusCreated, &opened)

	sellerURL := svc.base + "/sellers/" + opened.ID

	send(t, http.MethodPost, sellerURL+"/members", owner, emailBody(staffEmail)).decode(t, http.StatusCreated, &struct{}{})
	staff := bearer(signIn(t, svc, staffEmail).Token)

	used, unused := uploadPhoto(t, svc, owner), uploadPhoto(t, svc, owner)
	send(t, http.MethodPut, sellerURL+"/photo", owner, map[string]any{"photoId": used}).decode(t, http.StatusOK, &struct{}{})

	var me struct {
		ID string `json:"id"`
	}

	send(t, http.MethodGet, svc.base+"/accounts/me", owner, nil).decode(t, http.StatusOK, &me)

	// Asking for the deletion code without signing in is refused.
	if p := send(t, http.MethodPost, svc.base+"/accounts/me/deletion-codes", nil, nil).
		problem(t, http.StatusUnauthorized); p.Code != codeAuthenticationRequired {
		t.Errorf("a deletion code without signing in: %q", p.Code)
	}

	checkCodePurposesApart(t, svc, owner, ownerEmail)

	deletionID, deletionCode := requestDeletionCode(t, svc, owner, ownerEmail)

	if p := send(t, http.MethodPost, svc.base+"/accounts/me/deletion", owner, codeBody(deletionID, wrongCode(deletionCode))).
		problem(t, http.StatusBadRequest); p.Code != "IDENTITY_CODE_INCORRECT" {
		t.Errorf("deleting with a wrong code: %q", p.Code)
	}

	deleted := send(t, http.MethodPost, svc.base+"/accounts/me/deletion", owner, codeBody(deletionID, deletionCode))
	if deleted.status != http.StatusNoContent {
		t.Fatalf("deleting the account: %d %s", deleted.status, deleted.body)
	}

	if c := sessionCookieOf(t, deleted); c.MaxAge >= 0 {
		t.Errorf("the session cookie is not cleared: %+v", c)
	}

	// The session ended with the account, and the code works once.
	if p := send(t, http.MethodGet, svc.base+"/accounts/me", owner, nil).
		problem(t, http.StatusUnauthorized); p.Code != codeSessionInvalid {
		t.Errorf("the deleted account's session: %q", p.Code)
	}

	checkDeletedAtOnce(t, svc, ownerEmail, me.ID)
	checkFollowed(t, svc, staff, sellerURL, me.ID, used, unused)
	checkOwnerlessStaysBlocked(t, svc, staff, opened.ID)

	// The address can sign in again, as a new account.
	backdateCodes(t, svc, ownerEmail)

	var again struct {
		ID string `json:"id"`
	}

	send(t, http.MethodGet, svc.base+"/accounts/me", bearer(signIn(t, svc, ownerEmail).Token), nil).
		decode(t, http.StatusOK, &again)

	if again.ID == me.ID {
		t.Error("signing in again found the deleted account")
	}
}

// checkCodePurposesApart checks that a deletion code cannot sign in and a
// sign-in code cannot delete.
func checkCodePurposesApart(t *testing.T, svc service, auth http.Header, address string) {
	t.Helper()

	deletionID, deletionCode := requestDeletionCode(t, svc, auth, address)

	if p := send(t, http.MethodPost, svc.base+"/auth/sessions", nil, codeBody(deletionID, deletionCode)).
		problem(t, http.StatusGone); p.Code != codeChallengeGone {
		t.Errorf("signing in with a deletion code: %q", p.Code)
	}

	// The sign-in code also ends the deletion code: one live code per address.
	backdateCodes(t, svc, address)
	signInID, signInCode := requestCode(t, svc, address)

	if p := send(t, http.MethodPost, svc.base+"/accounts/me/deletion", auth, codeBody(signInID, signInCode)).
		problem(t, http.StatusGone); p.Code != codeChallengeGone {
		t.Errorf("deleting with a sign-in code: %q", p.Code)
	}
}

// checkDeletedAtOnce checks what the deletion removes in its own transaction.
func checkDeletedAtOnce(t *testing.T, svc service, address, accountID string) {
	t.Helper()

	for table, query := range map[string]string{
		"identity_accounts":           "SELECT count(*) FROM identity_accounts WHERE email = $1",
		"identity_sign_in_challenges": "SELECT count(*) FROM identity_sign_in_challenges WHERE email = $1",
		"notification_emails":         "SELECT count(*) FROM notification_emails WHERE recipient = $1",
	} {
		if n := countRows(t, svc, query, address); n != 0 {
			t.Errorf("%d rows of %s still name the address", n, table)
		}
	}

	if n := countRows(t, svc, "SELECT count(*) FROM identity_sessions WHERE account_id = $1", accountID); n != 0 {
		t.Errorf("%d sessions of the deleted account remain", n)
	}
}

// checkFollowed checks what the listeners do after the deletion: the seller
// is blocked, the owner's membership and unused photo are gone, the staff and
// the seller's photo stay.
func checkFollowed(t *testing.T, svc service, staff http.Header, sellerURL, accountID, used, unused string) {
	t.Helper()

	waitUntil(t, func() bool {
		var s sellerResponse

		send(t, http.MethodGet, sellerURL, staff, nil).decode(t, http.StatusOK, &s)

		return s.Status == "blocked" &&
			countRows(t, svc, "SELECT count(*) FROM file_files WHERE id = $1", unused) == 0
	})

	if n := countRows(t, svc, "SELECT count(*) FROM seller_members WHERE account_id = $1", accountID); n != 0 {
		t.Errorf("%d memberships of the deleted account remain", n)
	}

	if got := send(t, http.MethodGet, svc.base+"/photos/"+used+"/400.jpg", nil, nil); got.status != http.StatusOK {
		t.Errorf("the seller's photo after its uploader left: %d", got.status)
	}

	if got := send(t, http.MethodGet, svc.base+"/photos/"+unused+"/400.jpg", nil, nil); got.status != http.StatusNotFound {
		t.Errorf("the unused photo after its uploader left: %d", got.status)
	}
}

// checkOwnerlessStaysBlocked has an admin approve the seller the deletion
// blocked (SEC-65): with no owner, nobody could run it, so it is refused in
// the request's language and the seller stays blocked.
func checkOwnerlessStaysBlocked(t *testing.T, svc service, staff http.Header, sellerID string) {
	t.Helper()

	admin := bearer(signIn(t, svc, deletionAdminEmail).Token)
	approve := svc.base + "/admin/sellers/" + sellerID + "/approve"

	p := send(t, http.MethodPost, approve, admin, nil).problem(t, http.StatusConflict)
	if p.Code != "SELLER_OWNERLESS" || p.Detail != "Cửa hàng không còn chủ vì chủ đã xoá tài khoản, nên không duyệt lại được." {
		t.Errorf("approving the owner-less seller: %q %q", p.Code, p.Detail)
	}

	inEnglish := admin.Clone()
	inEnglish.Set("Accept-Language", "en")

	want := "The seller has no owner, since its owner deleted their account, so it cannot be approved."
	if p := send(t, http.MethodPost, approve, inEnglish, nil).problem(t, http.StatusConflict); p.Detail != want {
		t.Errorf("approving the owner-less seller in English: %q", p.Detail)
	}

	var s sellerResponse

	send(t, http.MethodGet, svc.base+"/sellers/"+sellerID, staff, nil).decode(t, http.StatusOK, &s)

	if s.Status != "blocked" {
		t.Errorf("the owner-less seller after the refusals: %s, want blocked", s.Status)
	}
}

// requestDeletionCode asks for the signed-in account's deletion code and reads
// it from the email Mailpit caught, past the address's one-minute wait.
func requestDeletionCode(t *testing.T, svc service, auth http.Header, address string) (string, string) {
	t.Helper()

	backdateCodes(t, svc, address)

	var c challenge

	send(t, http.MethodPost, svc.base+"/accounts/me/deletion-codes", auth, nil).decode(t, http.StatusAccepted, &c)

	return c.ChallengeID, readCode(t, svc, address)
}

// backdateCodes moves the address's codes two minutes back, past the wait
// between two codes, as a person would wait.
func backdateCodes(t *testing.T, svc service, address string) {
	t.Helper()

	execSQL(t, svc, "UPDATE identity_sign_in_challenges SET created_at = created_at - interval '2 minutes' WHERE email = $1", address)
}

func wrongCode(code string) string {
	if code == "000000" {
		return "111111"
	}

	return "000000"
}

func uploadPhoto(t *testing.T, svc service, auth http.Header) string {
	t.Helper()

	var buf bytes.Buffer
	if err := png.Encode(&buf, image.NewGray(image.Rect(0, 0, 32, 32))); err != nil {
		t.Fatal(err)
	}

	var photo struct {
		ID string `json:"id"`
	}

	sendRaw(t, http.MethodPost, svc.base+"/photos", auth, "image/png", buf.Bytes()).decode(t, http.StatusCreated, &photo)

	return photo.ID
}

func countRows(t *testing.T, svc service, query string, args ...any) int {
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
	if err := conn.QueryRow(t.Context(), query, args...).Scan(&n); err != nil {
		t.Fatal(err)
	}

	return n
}

// waitUntil polls cond for at most fifteen seconds, the time the listeners
// get to follow an event.
func waitUntil(t *testing.T, cond func() bool) {
	t.Helper()

	deadline := time.Now().Add(15 * time.Second)
	for !cond() {
		if time.Now().After(deadline) {
			t.Fatal("the listeners did not follow within fifteen seconds")
		}

		time.Sleep(200 * time.Millisecond)
	}
}
