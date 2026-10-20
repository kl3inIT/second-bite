package main

import (
	"net/http"
	"testing"
)

// checkDisplayName has a person name their account through HTTP (SEC-61): the
// name comes back trimmed, the account reads it, and a name too long is
// refused in the request's language without changing it.
func checkDisplayName(t *testing.T, svc service) {
	t.Helper()

	auth := bearer(signIn(t, svc, "named.person@example.com").Token)

	var account struct {
		DisplayName string `json:"displayName"`
	}

	send(t, http.MethodPut, svc.base+"/accounts/me", auth, map[string]any{"displayName": "  Trần Thị Lan  "}).
		decode(t, http.StatusOK, &account)

	if account.DisplayName != "Trần Thị Lan" {
		t.Errorf("set name %q", account.DisplayName)
	}

	send(t, http.MethodGet, svc.base+"/accounts/me", auth, nil).decode(t, http.StatusOK, &account)

	if account.DisplayName != "Trần Thị Lan" {
		t.Errorf("read name %q", account.DisplayName)
	}

	tooLong := map[string]any{"displayName": "Một cái tên dài hơn năm mươi ký tự thì không được nhận"}

	p := send(t, http.MethodPut, svc.base+"/accounts/me", auth, tooLong).problem(t, http.StatusBadRequest)
	if p.Code != "IDENTITY_DISPLAY_NAME_INVALID" || p.Detail != "Nhập tên hiển thị từ 1 đến 50 ký tự." {
		t.Errorf("a name too long: %q %q", p.Code, p.Detail)
	}

	inEnglish := auth.Clone()
	inEnglish.Set("Accept-Language", "en")

	if p := send(t, http.MethodPut, svc.base+"/accounts/me", inEnglish, tooLong).problem(t, http.StatusBadRequest); p.Detail != "Enter a display name of 1 to 50 characters." {
		t.Errorf("a name too long in English: %q", p.Detail)
	}

	send(t, http.MethodGet, svc.base+"/accounts/me", auth, nil).decode(t, http.StatusOK, &account)

	if account.DisplayName != "Trần Thị Lan" {
		t.Errorf("a refused name changed the account: %q", account.DisplayName)
	}

	if p := send(t, http.MethodPut, svc.base+"/accounts/me", nil, map[string]any{"displayName": "Lan"}).problem(t, http.StatusUnauthorized); p.Code != codeAuthenticationRequired {
		t.Errorf("signed out: %q", p.Code)
	}
}
