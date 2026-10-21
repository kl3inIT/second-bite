package main

import (
	"maps"
	"net/http"
	"net/url"
	"regexp"
	"strings"
	"testing"
	"time"
)

type challenge struct {
	ChallengeID string `json:"challengeId"`
}

type session struct {
	Token   string `json:"token"`
	Account struct {
		Email string `json:"email"`
		Role  string `json:"role"`
	} `json:"account"`
}

var codePattern = regexp.MustCompile(`\b(\d{6})\b`)

// requestCode asks for a code for email and returns its challenge and the
// code read from the email Mailpit caught.
func requestCode(t *testing.T, svc service, email string) (string, string) {
	t.Helper()

	var c challenge

	send(t, http.MethodPost, svc.base+"/auth/sign-in-codes", nil, emailBody(email)).
		decode(t, http.StatusAccepted, &c)

	return c.ChallengeID, readCode(t, svc, email)
}

// readCode polls Mailpit for the newest email to address and returns its code.
func readCode(t *testing.T, svc service, address string) string {
	t.Helper()

	deadline := time.Now().Add(10 * time.Second)

	for time.Now().Before(deadline) {
		var found struct {
			Messages []struct {
				ID string `json:"ID"`
			} `json:"messages"`
		}

		send(t, http.MethodGet, svc.mailpit+"/api/v1/search?query="+url.QueryEscape("to:"+address), nil, nil).
			decode(t, http.StatusOK, &found)

		if len(found.Messages) > 0 {
			var msg struct {
				Text string `json:"Text"`
			}

			send(t, http.MethodGet, svc.mailpit+"/api/v1/message/"+found.Messages[0].ID, nil, nil).
				decode(t, http.StatusOK, &msg)

			m := codePattern.FindStringSubmatch(msg.Text)
			if m == nil {
				t.Fatalf("no code in the email: %q", msg.Text)
			}

			return m[1]
		}

		time.Sleep(200 * time.Millisecond)
	}

	t.Fatalf("no email reached %s", address)

	return ""
}

func signIn(t *testing.T, svc service, email string) session {
	t.Helper()

	id, code := requestCode(t, svc, email)

	var s session

	send(t, http.MethodPost, svc.base+"/auth/sessions", nil, codeBody(id, code)).
		decode(t, http.StatusCreated, &s)

	return s
}

func emailBody(email string) map[string]string {
	return map[string]string{"email": email}
}

func codeBody(challengeID, code string) map[string]string {
	return map[string]string{"challengeId": challengeID, "code": code}
}

func bearer(token string) http.Header {
	return http.Header{"Authorization": {"Bearer " + token}}
}

func checkSignInAndOut(t *testing.T, svc service) {
	t.Helper()

	// The address is stored in lower case, however it was typed.
	s := signIn(t, svc, "Customer.One@Example.com")
	if s.Token == "" || s.Account.Email != "customer.one@example.com" || s.Account.Role != "customer" {
		t.Fatalf("session %+v", s)
	}

	var me struct {
		Email string `json:"email"`
	}

	send(t, http.MethodGet, svc.base+"/accounts/me", bearer(s.Token), nil).decode(t, http.StatusOK, &me)

	if me.Email != "customer.one@example.com" {
		t.Errorf("me %+v", me)
	}

	if resp := send(t, http.MethodDelete, svc.base+"/auth/sessions/current", bearer(s.Token), nil); resp.status != http.StatusNoContent {
		t.Fatalf("sign out: status %d; body %s", resp.status, resp.body)
	}

	p := send(t, http.MethodGet, svc.base+"/accounts/me", bearer(s.Token), nil).problem(t, http.StatusUnauthorized)
	if p.Code != "IDENTITY_SESSION_INVALID" {
		t.Errorf("after sign out: code %q", p.Code)
	}
}

// checkCookieSession signs in as the web does, with the session in the cookie
// (SEC-27), and uses it without a token.
func checkCookieSession(t *testing.T, svc service) {
	t.Helper()

	jar := signInWithCookie(t, svc, "cookie.user@example.com")

	var me struct {
		Email string `json:"email"`
	}

	send(t, http.MethodGet, svc.base+"/accounts/me", jar, nil).decode(t, http.StatusOK, &me)

	if me.Email != "cookie.user@example.com" {
		t.Errorf("me %+v", me)
	}

	// A Bearer header wins over the cookie.
	both := jar.Clone()
	both.Set("Authorization", "Bearer not-a-session")

	if p := send(t, http.MethodGet, svc.base+"/accounts/me", both, nil).problem(t, http.StatusUnauthorized); p.Code != "IDENTITY_SESSION_INVALID" {
		t.Errorf("Bearer beside the cookie: %q", p.Code)
	}

	checkCookieSignOut(t, svc, jar)
}

// signInWithCookie signs email in with the session in the cookie, checks the
// cookie's attributes and returns the header that sends it back.
func signInWithCookie(t *testing.T, svc service, email string) http.Header {
	t.Helper()

	id, code := requestCode(t, svc, email)
	body := codeBody(id, code)
	body["session"] = "cookie"

	resp := send(t, http.MethodPost, svc.base+"/auth/sessions", nil, body)

	var s session
	resp.decode(t, http.StatusCreated, &s)

	if s.Token != "" {
		t.Error("the token is in the body as well as in the cookie")
	}

	c := sessionCookieOf(t, resp)
	if !c.HttpOnly || !c.Secure || c.SameSite != http.SameSiteLaxMode || c.Path != "/" || c.MaxAge <= 0 || c.Value == "" {
		t.Fatalf("cookie %+v", c)
	}

	return http.Header{"Cookie": {c.Name + "=" + c.Value}}
}

// checkCookieSignOut signs out with the cookie: refused from another site,
// accepted from our own, and the ended cookie ignored afterwards.
func checkCookieSignOut(t *testing.T, svc service, jar http.Header) {
	t.Helper()

	// Another site's page cannot change anything with the cookie; our own can.
	crossSite := jar.Clone()
	crossSite.Set("Sec-Fetch-Site", "cross-site")

	p := send(t, http.MethodDelete, svc.base+"/auth/sessions/current", crossSite, nil).problem(t, http.StatusForbidden)
	if p.Code != "PLATFORM_CROSS_ORIGIN_REFUSED" {
		t.Errorf("cross-site sign-out: %q", p.Code)
	}

	sameOrigin := jar.Clone()
	sameOrigin.Set("Sec-Fetch-Site", "same-origin")

	out := send(t, http.MethodDelete, svc.base+"/auth/sessions/current", sameOrigin, nil)
	if out.status != http.StatusNoContent {
		t.Fatalf("sign out: %d %s", out.status, out.body)
	}

	if cleared := sessionCookieOf(t, out); cleared.MaxAge >= 0 || cleared.Value != "" {
		t.Errorf("the cookie was not cleared: %+v", cleared)
	}

	// A cookie of an ended session is ignored: public pages still answer, and
	// what needs a caller asks for sign-in.
	if r := send(t, http.MethodGet, svc.base+"/offers", jar, nil); r.status != http.StatusOK {
		t.Errorf("offers with an ended cookie: %d %s", r.status, r.body)
	}

	if p := send(t, http.MethodGet, svc.base+"/accounts/me", jar, nil).problem(t, http.StatusUnauthorized); p.Code != codeAuthenticationRequired {
		t.Errorf("me with an ended cookie: %q", p.Code)
	}
}

func sessionCookieOf(t *testing.T, r response) *http.Cookie {
	t.Helper()

	for _, c := range (&http.Response{Header: r.header}).Cookies() {
		if c.Name == "secondbite_session" {
			return c
		}
	}

	t.Fatalf("no session cookie in %v", r.header.Values("Set-Cookie"))

	return nil
}

// checkGoogleOff: without client IDs the service offers no Google button
// and refuses Google's tokens with a 503 that names it.
func checkGoogleOff(t *testing.T, svc service) {
	t.Helper()

	var methods map[string]any

	send(t, http.MethodGet, svc.base+"/auth/methods", nil, nil).decode(t, http.StatusOK, &methods)

	if _, ok := methods["google"]; ok {
		t.Errorf("methods %v offer Google", methods)
	}

	p := send(t, http.MethodPost, svc.base+"/auth/google", nil, map[string]string{"idToken": "a.b.c"}).
		problem(t, http.StatusServiceUnavailable)
	if p.Code != "IDENTITY_GOOGLE_NOT_CONFIGURED" {
		t.Errorf("code %q", p.Code)
	}
}

func checkWrongCodes(t *testing.T, svc service) {
	t.Helper()

	id, code := requestCode(t, svc, "wrong.codes@example.com")
	wrong := "000000"

	if code == wrong {
		wrong = "111111"
	}

	for range 4 {
		p := send(t, http.MethodPost, svc.base+"/auth/sessions", nil, codeBody(id, wrong)).
			problem(t, http.StatusBadRequest)
		if p.Code != "IDENTITY_CODE_INCORRECT" {
			t.Fatalf("code %q", p.Code)
		}
	}

	// The fifth guess is the last; after it even the right code is refused.
	send(t, http.MethodPost, svc.base+"/auth/sessions", nil, codeBody(id, wrong)).
		problem(t, http.StatusBadRequest)

	p := send(t, http.MethodPost, svc.base+"/auth/sessions", nil, codeBody(id, code)).
		problem(t, http.StatusGone)
	if p.Code != "IDENTITY_CODE_ATTEMPTS_EXHAUSTED" {
		t.Errorf("code %q", p.Code)
	}
}

func checkCodeCooldown(t *testing.T, svc service) {
	t.Helper()

	requestCode(t, svc, "cooldown@example.com")

	resp := send(t, http.MethodPost, svc.base+"/auth/sign-in-codes", nil, emailBody("COOLDOWN@example.com"))
	if p := resp.problem(t, http.StatusTooManyRequests); p.Code != "IDENTITY_CODE_LIMIT_EXCEEDED" {
		t.Errorf("code %q", p.Code)
	}

	if resp.header.Get("Retry-After") == "" {
		t.Error("no Retry-After")
	}
}

func checkCodeWorksOnce(t *testing.T, svc service) {
	t.Helper()

	id, code := requestCode(t, svc, "once@example.com")
	body := codeBody(id, code)

	send(t, http.MethodPost, svc.base+"/auth/sessions", nil, body).decode(t, http.StatusCreated, &session{})

	if p := send(t, http.MethodPost, svc.base+"/auth/sessions", nil, body).problem(t, http.StatusGone); p.Code != "IDENTITY_CHALLENGE_GONE" {
		t.Errorf("code %q", p.Code)
	}
}

func checkNewCodeEndsEarlier(t *testing.T, svc service) {
	t.Helper()

	const email = "replaced@example.com"

	first, firstCode := requestCode(t, svc, email)

	// Move the first code back past the minute between codes.
	execSQL(t, svc, "UPDATE identity_sign_in_challenges SET created_at = created_at - interval '2 minutes' WHERE id = $1", first)

	second, secondCode := requestCode(t, svc, email)
	if secondCode == firstCode {
		t.Skip("the two codes drew the same digits; the email read cannot tell them apart")
	}

	p := send(t, http.MethodPost, svc.base+"/auth/sessions", nil, codeBody(first, firstCode)).problem(t, http.StatusGone)
	if p.Code != "IDENTITY_CHALLENGE_GONE" {
		t.Errorf("the earlier code: %q", p.Code)
	}

	send(t, http.MethodPost, svc.base+"/auth/sessions", nil, codeBody(second, secondCode)).decode(t, http.StatusCreated, &session{})
}

func checkSMTPPasswordFollowsServer(t *testing.T, svc service) {
	t.Helper()

	var current map[string]any

	admin := signIn(t, svc, adminEmail)
	auth := bearer(admin.Token)
	send(t, http.MethodGet, svc.base+"/admin/email-settings", auth, nil).decode(t, http.StatusOK, &current)

	put := func(body map[string]any) response {
		return send(t, http.MethodPut, svc.base+"/admin/email-settings", auth, body)
	}

	withPassword := map[string]any{
		"provider": "smtp", "senderAddress": "no-reply@secondbite.test", "senderName": "Second Bite",
		"smtpHost": "smtp.example.com", "smtpPort": 587, "smtpSecurity": "starttls",
		"smtpUsername": "relay-user", "smtpPassword": "relay-password",
	}
	if resp := put(withPassword); resp.status != http.StatusNoContent {
		t.Fatalf("saving with a password: %d %s", resp.status, resp.body)
	}

	moved := maps.Clone(withPassword)
	moved["smtpHost"] = "smtp.attacker.example"
	delete(moved, "smtpPassword")

	if p := put(moved).problem(t, http.StatusBadRequest); p.Code != "NOTIFICATION_EMAIL_SETTINGS_INVALID" {
		t.Errorf("another server kept the password: %q", p.Code)
	}

	noTLS := maps.Clone(withPassword)
	noTLS["smtpSecurity"] = "none"

	if p := put(noTLS).problem(t, http.StatusBadRequest); p.Code != "NOTIFICATION_EMAIL_SETTINGS_INVALID" {
		t.Errorf("a password without TLS was accepted: %q", p.Code)
	}

	// Restore what the service was configured with.
	restore := map[string]any{}
	for _, k := range []string{"provider", "senderAddress", "senderName", "smtpHost", "smtpPort", "smtpSecurity"} {
		restore[k] = current[k]
	}

	if resp := put(restore); resp.status != http.StatusNoContent {
		t.Fatalf("restoring: %d %s", resp.status, resp.body)
	}
}

func checkInvalidToken(t *testing.T, svc service) {
	t.Helper()

	for _, header := range []string{"Bearer not-a-session", "Basic dXNlcjpwYXNz", "Bearer"} {
		resp := send(t, http.MethodGet, svc.base+"/accounts/me", http.Header{"Authorization": {header}}, nil)
		if p := resp.problem(t, http.StatusUnauthorized); p.Code != "IDENTITY_SESSION_INVALID" {
			t.Errorf("%q: code %q", header, p.Code)
		}

		if !strings.HasPrefix(resp.header.Get("WWW-Authenticate"), "Bearer") {
			t.Errorf("%q: WWW-Authenticate %q", header, resp.header.Get("WWW-Authenticate"))
		}
	}

	p := send(t, http.MethodGet, svc.base+"/accounts/me", nil, nil).problem(t, http.StatusUnauthorized)
	if p.Code != codeAuthenticationRequired {
		t.Errorf("anonymous: code %q", p.Code)
	}
}

func checkAdminOnly(t *testing.T, svc service) {
	t.Helper()

	customer := signIn(t, svc, "not.an.admin@example.com")

	p := send(t, http.MethodGet, svc.base+"/admin/email-settings", bearer(customer.Token), nil).problem(t, http.StatusForbidden)
	if p.Code != "PLATFORM_ADMIN_REQUIRED" {
		t.Errorf("customer: code %q", p.Code)
	}

	admin := signIn(t, svc, adminEmail)
	if admin.Account.Role != "admin" {
		t.Fatalf("the granted admin signed in as %q", admin.Account.Role)
	}

	var settings struct {
		Provider        string `json:"provider"`
		SMTPPasswordSet bool   `json:"smtpPasswordSet"`
	}

	send(t, http.MethodGet, svc.base+"/admin/email-settings", bearer(admin.Token), nil).decode(t, http.StatusOK, &settings)

	if settings.Provider != "smtp" || settings.SMTPPasswordSet {
		t.Errorf("settings %+v", settings)
	}
}
