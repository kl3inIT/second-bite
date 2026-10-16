# Second Bite architecture

This page states what is implemented today. Intended outcomes are in [docs/vision.md](docs/vision.md); planned work is in [docs/roadmap.md](docs/roadmap.md) and never appears here as a fact. Update this page in the change that makes a statement true or false.

## Runtime overview

The backend runs on a developer's machine and in tests; nothing is deployed, and no web or mobile application exists.

- One Go binary, `secondbite` (`server/cmd/secondbite`). At startup it reads its configuration, opens a PostgreSQL pool, applies the pending migrations under a lock, and serves the HTTP API until SIGINT or SIGTERM, then lets requests in flight finish ([runbook](docs/runbooks/backend.md)).
- PostgreSQL 18 with PostGIS 3.6, with the tables of `identity`, `notification` and `seller`.
- People sign in with a six-digit code emailed to them and get a session token, sent as `Authorization: Bearer`. Email goes through the provider admins chose (SMTP or Brevo's API); Mailpit catches it in development.
- People open sellers, which wait for an admin to activate them; an owner adds staff by email. Who may publish for a seller is answered by `seller`, for the offers to come.
- Two administrative commands set up a fresh installation: `secondbite email configure` and `secondbite admin grant`.
- The API answers the probes `/livez` and `/readyz`, serves its OpenAPI 3.1 contract, and answers every error, an unknown route included, as an RFC 9457 problem with a `code` and the request's `requestId`.
- Every request has an identifier, returned in `X-Request-Id` and logged as `request_id`.

## Code and capability boundaries

The modules under `server/internal/`, found through the [pilot domain model](docs/increments/active/sec-6-pilot-domain-model/design.md); each root package is the module's published API.

| Module | Owns | Published API |
| --- | --- | --- |
| `identity` | Accounts and their role (customer or admin), emailed sign-in codes, sessions (tables `identity_*`) | `Service`: request a code, sign in, sign out, read an account, grant a role; `Authenticate`, the middleware that puts the caller in each request's context |
| `seller` | Sellers, their status set by admins (pending, active, blocked), and their owner and staff (tables `seller_*`) | `Service`: open, read and change a seller, add and remove staff, list and activate or block for admins; `CanPublish` and `CollectionPoint` for offers |
| `notification` | Who delivers email, chosen by admins while the service runs, and the record of emails sent (tables `notification_*`) | `Service`: send an email, read and save the email settings |

`internal/platform` is not a module: it holds the technical code every module uses, including the caller of a request (`platform.CallerFrom`, `RequireCaller`, `RequireAdmin`), so a module authorizes without depending on `identity`.

### Allowed module dependencies

One line per module, naming the modules whose published API it may use, such as "- `seller` → `identity`". A module not listed may use none. `internal/platform` depends on no module, and every module may use it. The boundary test (`server/internal/boundaries_test.go`) reads this list.

- `identity` → `notification`
- `seller` → `identity`

## Repository contents

| Path | Holds today |
| --- | --- |
| `docs/` | Brief, vision, roadmap, conventions, guidelines, research and the active increments ([operating model](docs/guidelines/operating-model.md)) |
| `.claude/skills/` | Go skills vendored from community collections for coding agents ([sources](.claude/skills/SOURCES.md)) |
| `server/` | The Go service: `cmd/secondbite` assembles it, `internal/platform` holds its technical code, `migrations/` its schema ([backend guideline](docs/guidelines/backend.md)) |
| `api/` | `openapi.yaml`, the contract generated from the backend's operations and checked by a test |
| `compose.yaml` | The local database and Mailpit for development |
| `.github/workflows/` | CI for the backend: lint, tests, vulnerabilities |
