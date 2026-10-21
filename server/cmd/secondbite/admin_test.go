package main

import (
	"errors"
	"io"
	"maps"
	"net/http"
	"regexp"
	"strings"
	"testing"

	"github.com/danielgtaylor/huma/v2"
	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// Admins of their own, so the checks that sign them in do not end one
// another's codes: grantingAdminEmail grants and revokes beside the other
// checks, auditAdminEmail makes every change after them.
const (
	grantingAdminEmail = "granting.admin@example.com"
	auditAdminEmail    = "audit.admin@example.com"
)

const (
	roleAdmin         = "admin"
	commandAdmin      = "admin"
	codeAdminRequired = "PLATFORM_ADMIN_REQUIRED"
)

// adminOperation is one operation of the contract under the admin prefix.
type adminOperation struct {
	id, method, path string
}

// pathParam matches a parameter in an OpenAPI path, such as {sellerId}.
var pathParam = regexp.MustCompile(`\{[^}]+\}`)

// adminOperations lists every operation the service registers under the admin
// prefix, read from the same registration the contract is generated from, so
// an operation added later is checked without editing this test.
func adminOperations(t *testing.T) []adminOperation {
	t.Helper()

	api := platform.NewAPI(http.NewServeMux())
	registerOperations(api, &app{})

	var ops []adminOperation

	for path, item := range api.OpenAPI().Paths {
		if !strings.HasPrefix(path, platform.AdminPrefix+"/") {
			continue
		}

		for method, op := range map[string]*huma.Operation{
			http.MethodGet: item.Get, http.MethodPost: item.Post, http.MethodPut: item.Put,
			http.MethodPatch: item.Patch, http.MethodDelete: item.Delete,
		} {
			if op != nil {
				ops = append(ops, adminOperation{id: op.OperationID, method: method, path: path})
			}
		}
	}

	if len(ops) == 0 {
		t.Fatal("no operation is registered under the admin prefix")
	}

	return ops
}

// checkAdminOperationsRefuseOthers calls every admin operation signed out and
// as a customer: each must refuse before it reads the request (SEC-75).
func checkAdminOperationsRefuseOthers(t *testing.T, svc service) {
	t.Helper()

	customer := bearer(signIn(t, svc, "customer.of.admin.routes@example.com").Token)

	for _, op := range adminOperations(t) {
		url := svc.base + pathParam.ReplaceAllString(op.path, uuid.NewString())

		t.Run(op.id, func(t *testing.T) {
			t.Parallel()

			for _, c := range []struct {
				name   string
				header http.Header
				status int
				code   string
			}{
				{"signed out", nil, http.StatusUnauthorized, "PLATFORM_AUTHENTICATION_REQUIRED"},
				{"as a customer", customer, http.StatusForbidden, codeAdminRequired},
			} {
				// No body: a refusal must come before the request is read, so a
				// customer cannot learn how an admin operation validates.
				p := send(t, op.method, url, c.header, nil).problem(t, c.status)
				if p.Code != c.code {
					t.Errorf("%s %s %s: code %q, want %q", c.name, op.method, op.path, p.Code, c.code)
				}
			}
		})
	}
}

// adminChange is the happy-path call of one admin operation that changes
// something, with what it leaves in the audit trail.
type adminChange struct {
	// call makes the change as admin and answers its response, and what
	// restores the change after its events are counted.
	call func(t *testing.T, svc service, admin http.Header) (response, func())
	// notAudited, when set, is why the change records nothing.
	notAudited string
}

// adminChanges holds every admin operation other than a read, by operation
// identifier. An operation missing here fails checkAdminChangesAreAudited.
var adminChanges = map[string]adminChange{
	"saveOfferSettings": {call: func(t *testing.T, svc service, admin http.Header) (response, func()) {
		t.Helper()

		return changeSettings(t, svc, admin, "/admin/offer-settings", func(s map[string]any) {
			radius, ok := s["maxRadiusKm"].(float64)
			if !ok {
				t.Fatalf("maxRadiusKm is %T", s["maxRadiusKm"])
			}

			s["maxRadiusKm"] = radius - 1
		})
	}},
	"saveEmailSettings": {call: func(t *testing.T, svc service, admin http.Header) (response, func()) {
		t.Helper()

		return changeSettings(t, svc, admin, "/admin/email-settings", func(s map[string]any) {
			s["senderName"] = "Second Bite (kiểm tra)"
		})
	}},
	"sendTestEmail": {notAudited: "it sends one email and changes nothing", call: func(t *testing.T, svc service, admin http.Header) (response, func()) {
		t.Helper()

		// Without a body the admin receives it; with one, the address named does.
		resp := send(t, http.MethodPost, svc.base+"/admin/email-settings/test", admin, nil)
		if resp.status != http.StatusNoContent {
			return resp, func() {}
		}

		waitEmail(t, svc, auditAdminEmail, "email thử")

		resp = send(t, http.MethodPost, svc.base+"/admin/email-settings/test", admin,
			map[string]string{"to": "audit.mailbox@example.com"})
		if resp.status == http.StatusNoContent {
			waitEmail(t, svc, "audit.mailbox@example.com", "email thử")
		}

		return resp, func() {}
	}},
	"grantAdmin": {call: func(t *testing.T, svc service, admin http.Header) (response, func()) {
		t.Helper()

		return send(t, http.MethodPost, svc.base+"/admin/admins", admin, emailBody("audit.granted@example.com")), func() {}
	}},
	"revokeAdmin": {call: func(t *testing.T, svc service, admin http.Header) (response, func()) {
		t.Helper()

		id := grantAdmin(t, svc, admin, "audit.revoked@example.com")

		return send(t, http.MethodPost, svc.base+"/admin/admins/"+id+"/revoke", admin, nil), func() {}
	}},
	"approveSeller": {call: func(t *testing.T, svc service, admin http.Header) (response, func()) {
		t.Helper()

		id := sellerInStatus(t, svc, "audit.approve.owner@example.com", "pending")

		return send(t, http.MethodPost, svc.base+"/admin/sellers/"+id+"/approve", admin, nil), func() {}
	}},
	"rejectSeller": {call: func(t *testing.T, svc service, admin http.Header) (response, func()) {
		t.Helper()

		id := sellerInStatus(t, svc, "audit.reject.owner@example.com", "pending")

		return send(t, http.MethodPost, svc.base+"/admin/sellers/"+id+"/reject", admin, reasonBody(testReason)), func() {}
	}},
	"blockSeller": {call: func(t *testing.T, svc service, admin http.Header) (response, func()) {
		t.Helper()

		id := sellerInStatus(t, svc, "audit.block.owner@example.com", "active")

		return send(t, http.MethodPost, svc.base+"/admin/sellers/"+id+"/block", admin, reasonBody(testReason)), func() {}
	}},
}

// checkAdminChangesAreAudited makes every admin change through the API and
// expects exactly one audit event carrying its request's identifier, or none
// when its entry says why (SEC-75). It changes shared settings, so it runs
// after the checks running in parallel.
func checkAdminChangesAreAudited(t *testing.T, svc service) {
	t.Helper()

	admin := bearer(signIn(t, svc, auditAdminEmail).Token)

	for _, op := range adminOperations(t) {
		if op.method == http.MethodGet {
			continue
		}

		change, ok := adminChanges[op.id]
		if !ok {
			t.Errorf("%s %s (%s) has no entry in adminChanges", op.method, op.path, op.id)

			continue
		}

		t.Run(op.id, func(t *testing.T) {
			resp, restore := change.call(t, svc, admin)
			defer restore()

			if resp.status < 200 || resp.status > 299 {
				t.Fatalf("status %d; body %s", resp.status, resp.body)
			}

			want := 1
			if change.notAudited != "" {
				want = 0
			}

			requestID := resp.header.Get("X-Request-Id")
			if got := countRows(t, svc, "SELECT count(*) FROM audit_events WHERE request_id = $1", requestID); got != want {
				t.Errorf("%d audit events for request %s, want %d", got, requestID, want)
			}
		})
	}
}

// changeSettings reads the settings at path and saves them changed by edit
// with the version read; restore saves them back as they were.
func changeSettings(t *testing.T, svc service, admin http.Header, path string, edit func(map[string]any)) (response, func()) {
	t.Helper()

	before, etag := readSettings(t, svc, admin, path)

	changed := maps.Clone(before)
	edit(changed)

	resp := saveSettings(t, svc, admin, path, etag, changed)

	return resp, func() {
		_, now := readSettings(t, svc, admin, path)
		if back := saveSettings(t, svc, admin, path, now, before); back.status >= 300 {
			t.Errorf("restoring %s: %d %s", path, back.status, back.body)
		}
	}
}

// readSettings reads the settings at path and their version.
func readSettings(t *testing.T, svc service, admin http.Header, path string) (map[string]any, string) {
	t.Helper()

	var settings map[string]any

	resp := send(t, http.MethodGet, svc.base+path, admin, nil)
	resp.decode(t, http.StatusOK, &settings)

	for _, readOnly := range []string{"updatedAt", "updatedBy", "smtpPasswordSet", "brevoApiKeySet"} {
		delete(settings, readOnly)
	}

	return settings, resp.header.Get("ETag")
}

// saveSettings saves the settings at path as of version etag.
func saveSettings(t *testing.T, svc service, admin http.Header, path, etag string, settings map[string]any) response {
	t.Helper()

	header := admin.Clone()
	header.Set("If-Match", etag)

	return send(t, http.MethodPut, svc.base+path, header, settings)
}

// sellerInStatus opens a seller for a new owner and puts it in status, as an
// earlier step would have, answering its identifier.
func sellerInStatus(t *testing.T, svc service, owner, status string) string {
	t.Helper()

	id := openSeller(t, svc, owner)
	execSQL(t, svc, "UPDATE seller_sellers SET status = $2 WHERE id = $1", id, status)

	return id
}

// openSeller opens a seller for a new owner and answers its identifier.
func openSeller(t *testing.T, svc service, owner string) string {
	t.Helper()

	var opened sellerResponse

	send(t, http.MethodPost, svc.base+"/sellers", bearer(signIn(t, svc, owner).Token), newSeller("Quán "+owner, "0912 345 678")).
		decode(t, http.StatusCreated, &opened)

	return opened.ID
}

// grantAdmin makes the account of email an admin through the API and answers
// its identifier.
func grantAdmin(t *testing.T, svc service, admin http.Header, email string) string {
	t.Helper()

	var granted struct {
		ID   string `json:"id"`
		Role string `json:"role"`
	}

	send(t, http.MethodPost, svc.base+"/admin/admins", admin, emailBody(email)).decode(t, http.StatusOK, &granted)

	if granted.Role != roleAdmin {
		t.Fatalf("granted %s: role %q", email, granted.Role)
	}

	return granted.ID
}

// checkRevokedAdminRefused grants an admin, who signs in and reads the
// admins; once revoked, the same session is refused (SEC-75). Revoking
// oneself is refused.
func checkRevokedAdminRefused(t *testing.T, svc service) {
	t.Helper()

	const email = "revoked.admin@example.com"

	admin := bearer(signIn(t, svc, grantingAdminEmail).Token)
	id := grantAdmin(t, svc, admin, email)

	revoked := signIn(t, svc, email)
	if revoked.Account.Role != roleAdmin {
		t.Fatalf("the granted admin signed in as %q", revoked.Account.Role)
	}

	theirs := bearer(revoked.Token)
	send(t, http.MethodGet, svc.base+"/admin/admins", theirs, nil).decode(t, http.StatusOK, &struct{}{})

	if p := send(t, http.MethodPost, svc.base+"/admin/admins/"+id+"/revoke", theirs, nil).problem(t, http.StatusConflict); p.Code != "IDENTITY_ADMIN_SELF" {
		t.Errorf("revoking oneself: %q", p.Code)
	}

	send(t, http.MethodPost, svc.base+"/admin/admins/"+id+"/revoke", admin, nil).decode(t, http.StatusOK, &struct{}{})

	if p := send(t, http.MethodGet, svc.base+"/admin/admins", theirs, nil).problem(t, http.StatusForbidden); p.Code != codeAdminRequired {
		t.Errorf("the revoked admin's session: %q", p.Code)
	}
}

// checkAdminCommands grants and revokes an admin with the commands, as an
// operator does, and finds each change in the audit trail without an actor.
func checkAdminCommands(t *testing.T, svc service) {
	t.Helper()

	const email = "command.admin@example.com"

	for _, args := range [][]string{{commandAdmin, "grant", email}, {commandAdmin, "revoke", email}} {
		var out strings.Builder
		if err := run(t.Context(), args, svc.getenv, strings.NewReader(""), &out); err != nil {
			t.Fatalf("secondbite %s: %v", strings.Join(args, " "), err)
		}
	}

	if signIn(t, svc, email).Account.Role != "customer" {
		t.Error("the revoked admin signs in as an admin")
	}

	events := countRows(t, svc, `SELECT count(*) FROM audit_events
		WHERE resource_label = $1 AND action IN ('admin.grant', 'admin.revoke')
		AND actor_id IS NULL AND details->>'source' = 'command_line'`, email)
	if events != 2 {
		t.Errorf("%d command-line changes of %s recorded, want 2", events, email)
	}

	if err := run(t.Context(), []string{commandAdmin, "demote", email}, svc.getenv, strings.NewReader(""), io.Discard); !errors.Is(err, errUsage) {
		t.Errorf("an unknown admin command: %v, want the usage", err)
	}
}
