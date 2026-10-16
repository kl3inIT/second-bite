# SEC-10 — Backend foundation and the `seller` module: verification

What was run before the increment was completed, and what it showed. The requirement-to-check matrices are in `docs/tests/` ([platform](../../../tests/platform.md), [identity](../../../tests/identity.md), [notification](../../../tests/notification.md), [seller](../../../tests/seller.md)).

## CI

The Backend workflow (`.github/workflows/backend.yml`) passed on `main` at `99dfe76` on 17 October 2026 (run 38948691255): golangci-lint v2.15.0; `go mod tidy -diff`; `go tool sqlc diff`; `go test -race -count=1 ./...` with PostGIS and Mailpit in containers; govulncheck with no reachable vulnerability. Dependabot's alert on `cel-go` was closed by that commit.

## Locally, 17 October 2026

On Windows with Docker Desktop and Go 1.27.2:

| Command (in `server/`) | Outcome |
| --- | --- |
| `go test -count=1 ./...` | Every package passed, the composition test (`cmd/secondbite`) and the seller tests against containers included |
| `go tool sqlc diff` | No difference |
| `go mod tidy -diff` | No difference |

The race detector needs cgo, which this machine does not have; CI runs it.

## Findings along the way

Each was found by a test, a review or CI, fixed, and is now held by a check:

- huma's defaults answered 422, echoed rejected values and leaked an error's text in a 500; one mapping replaced all three (`internal/platform/problem_test.go`).
- The Compose health check reported PostGIS ready during its first start; it now asks over TCP.
- huma did not read path parameters from an unexported embedded struct; found by the composition test.
- An automated security review found that several live codes multiplied the wrong guesses allowed (one live code per address now), that a stored SMTP password could be sent to another server (it now follows only its server), and that the staff cap was counted outside the transaction (a hundred additions at once left 98 people; the seller's row is now locked).
- govulncheck in CI found a reachable vulnerability in the test dependency `moby/go-archive` and one in Go 1.26.3's `net/http`; both were upgraded.

## Open at completion

- Brevo's delivery reports and suppressed addresses: SEC-24.
- Limits per client address, with the first deployment.
- A cookie with CSRF defence for the web application: SEC-17.
- Retention of the record of emails sent.
