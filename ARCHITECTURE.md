# Second Bite architecture

This page states what is implemented today. Intended outcomes are in [docs/vision.md](docs/vision.md); planned work is in [docs/roadmap.md](docs/roadmap.md) and never appears here as a fact. Update this page in the change that makes a statement true or false.

## Runtime overview

The backend runs on a developer's machine and in tests; nothing is deployed, and no web or mobile application exists.

- One Go binary, `secondbite` (`backend/cmd/secondbite`). At startup it reads its configuration, opens a PostgreSQL pool, applies the pending migrations under a lock, and serves the HTTP API until SIGINT or SIGTERM, then lets requests in flight finish ([runbook](docs/runbooks/backend.md)).
- PostgreSQL 18 with PostGIS 3.6. The only migration enables PostGIS; no table of the product exists.
- The API has no operation yet. It answers the probes `/livez` and `/readyz`, serves its OpenAPI 3.1 contract, and answers every error, an unknown route included, as an RFC 9457 problem with a `code` and the request's `requestId`.
- Every request has an identifier, returned in `X-Request-Id` and logged as `request_id`.

## Code and capability boundaries

No module exists. The candidate boundaries of the pilot are being discovered in the [pilot domain model increment](docs/increments/active/sec-6-pilot-domain-model/design.md); a module appears here only with its first code.

### Allowed module dependencies

One line per module, naming the modules whose published API it may use, such as "- `seller` → `identity`". A module not listed may use none. `internal/platform` depends on no module, and every module may use it. The boundary test (`backend/internal/boundaries_test.go`) reads this list.

None yet.

## Repository contents

| Path | Holds today |
| --- | --- |
| `docs/` | Brief, vision, roadmap, conventions, guidelines, research and the active increments ([operating model](docs/guidelines/operating-model.md)) |
| `.claude/skills/` | Go skills vendored from community collections for coding agents ([sources](.claude/skills/SOURCES.md)) |
| `backend/` | The Go service: `cmd/secondbite` assembles it, `internal/platform` holds its technical code, `migrations/` its schema ([backend guideline](docs/guidelines/backend.md)) |
| `api/` | `openapi.yaml`, the contract generated from the backend's operations and checked by a test |
| `compose.yaml` | The local database for development |
| `.github/workflows/` | CI for the backend: lint, tests, vulnerabilities |
