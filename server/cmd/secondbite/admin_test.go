package main

import (
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
