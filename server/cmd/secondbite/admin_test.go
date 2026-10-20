package main

import (
	"maps"
	"net/http"
	"regexp"
	"strings"
	"testing"

	"github.com/danielgtaylor/huma/v2"
	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/platform"
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
				{"as a customer", customer, http.StatusForbidden, "PLATFORM_ADMIN_REQUIRED"},
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
	"blockSeller": {
		call: func(t *testing.T, svc service, admin http.Header) (response, func()) {
			t.Helper()

			id := openSeller(t, svc, "audit.block.owner@example.com")

			return send(t, http.MethodPost, svc.base+"/admin/sellers/"+id+"/block", admin, nil), func() {}
		},
		notAudited: "a store's states are recorded once they take a reason (SEC-75 plan, step 6)",
	},
	"activateSeller": {
		call: func(t *testing.T, svc service, admin http.Header) (response, func()) {
			t.Helper()

			id := openSeller(t, svc, "audit.activate.owner@example.com")

			return send(t, http.MethodPost, svc.base+"/admin/sellers/"+id+"/activate", admin, nil), func() {}
		},
		notAudited: "a store's states are recorded once they take a reason (SEC-75 plan, step 6)",
	},
}

// checkAdminChangesAreAudited makes every admin change through the API and
// expects exactly one audit event carrying its request's identifier, or none
// when its entry says why (SEC-75). It changes shared settings, so it runs
// after the checks running in parallel.
func checkAdminChangesAreAudited(t *testing.T, svc service) {
	t.Helper()

	admin := bearer(signIn(t, svc, adminEmail).Token)

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

// openSeller opens a seller for a new owner and answers its identifier.
func openSeller(t *testing.T, svc service, owner string) string {
	t.Helper()

	var opened sellerResponse

	send(t, http.MethodPost, svc.base+"/sellers", bearer(signIn(t, svc, owner).Token), newSeller("Quán "+owner, "0912 345 678")).
		decode(t, http.StatusCreated, &opened)

	return opened.ID
}
