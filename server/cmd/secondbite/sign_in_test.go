package main

import (
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

	send(t, http.MethodPost, svc.base+"/auth/sign-in-codes", nil, map[string]string{"email": email}).
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

	resp := send(t, http.MethodPost, svc.base+"/auth/sign-in-codes", nil, map[string]string{"email": "COOLDOWN@example.com"})
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
	if p.Code != "PLATFORM_AUTHENTICATION_REQUIRED" {
		t.Errorf("anonymous: code %q", p.Code)
	}
}

func checkOperatorOnly(t *testing.T, svc service) {
	t.Helper()

	customer := signIn(t, svc, "not.an.operator@example.com")

	p := send(t, http.MethodGet, svc.base+"/operator/email-settings", bearer(customer.Token), nil).problem(t, http.StatusForbidden)
	if p.Code != "PLATFORM_OPERATOR_REQUIRED" {
		t.Errorf("customer: code %q", p.Code)
	}

	operator := signIn(t, svc, operatorEmail)
	if operator.Account.Role != "operator" {
		t.Fatalf("the granted operator signed in as %q", operator.Account.Role)
	}

	var settings struct {
		Provider        string `json:"provider"`
		SMTPPasswordSet bool   `json:"smtpPasswordSet"`
	}

	send(t, http.MethodGet, svc.base+"/operator/email-settings", bearer(operator.Token), nil).decode(t, http.StatusOK, &settings)

	if settings.Provider != "smtp" || settings.SMTPPasswordSet {
		t.Errorf("settings %+v", settings)
	}
}
