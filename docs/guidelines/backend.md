# Backend guideline

How the backend realizes the [conventions](../conventions.md) in Go. It is policy for the backend from its first line of code; nothing here exists yet ([ARCHITECTURE.md](../../ARCHITECTURE.md)).

## Shape

One Go module under `server/`, built into one binary that serves HTTP and runs background jobs. A second binary or a separate service needs the evidence of [boundary discovery step 8](../conventions.md#boundary-discovery) and an ADR.

```text
server/
  cmd/secondbite/        main: read configuration, assemble the modules, run; no business logic
  internal/
    platform/            technical code that knows no module: HTTP server and middleware,
                         the problem mapping, database pool and transactions, job queue, logging
    <module>/            one directory per module, created with its first code
  migrations/            versioned SQL migrations
```

The layout follows [Go's official guidance on module layout](https://go.dev/doc/modules/layout): `cmd/` for the entry point, `internal/` for code no other Go module may import. There is no `pkg/`: nothing here is a library for other repositories.

## Modules

A module is a package directly under `internal/`, named after its business concept in the singular (`offer`, `order`), discovered through [boundary discovery](../conventions.md#boundary-discovery). The skills' layer-first layouts (`internal/entity`, `internal/adapter/handler`) are not used: code is grouped by module first, as in the DDD layout of the vendored `golang-design-patterns` skill.

- **The module's root package is its published API**: the exported functions and types other modules call, its events and its failure codes. Keep it narrow.
- **Everything else is internal to the module**, either unexported in the root package or under `internal/<module>/internal/`, which the Go compiler forbids any other module to import. A module is one flat package, sized as the vendored `golang-project-layout` skill asks ("a service gets layers only when justified by actual complexity"), and gains `internal/` subpackages only when it grows enough files to need them. The layered splits of the `golang-design-patterns` skill (`domain/`, `application/`, `adapters/`) and of Wild Workouts are not followed (decided with the team on 16 October 2026).

  ```text
  internal/order/
    order.go         the Order type and its rules (its state machine), with no database or HTTP
    service.go       Service: the use cases other modules and the handlers call;
                     opens the transaction, applies the rules, saves, publishes events
    repository.go    Repository: the module's sqlc queries, a concrete type
    handler.go       the huma operations: decode, call Service, encode
    events.go        PlacedEvent, CollectedEvent...
    errors.go        the module's failure codes
  ```

  - The names follow the skills: `golang-structs-interfaces` starts a repository as a concrete `UserRepository struct` and extracts an interface only when a second implementation needs it; `golang-naming` forbids repeating the package in a name, so the types are `order.Service` and `order.Repository`, not `order.OrderService`; files are lower case with underscores where they need two words (`order_status.go`); tests sit beside the code (`service_test.go`), as `golang-project-layout` places them.
  - Exported: `Service`, the events and the failure codes, which other modules use, and one function `cmd/secondbite` calls to register the handlers. Unexported: the repository, the handlers themselves and the row types.
- **Persistence is never shared.** A module's queries and row types are unexported or under its `internal/`; another module calls the published API.
- **No import cycles**: the compiler refuses them, so a cycle between modules is resolved by an event or by moving the invariant to its owner, never by a shared helper package.
- `internal/platform` depends on no module. A module depends on `platform` and on the published API of the modules its context map names.
- Interfaces are declared by the code that consumes them, and only for a vendor family ([Strategy behind a registry](../conventions.md#interchangeable-implementations-strategy-behind-a-registry)) or a test that cannot use the real implementation. A module's own repository and service are concrete types.
- Dependencies are passed explicitly through constructors, assembled in `cmd/secondbite`. No dependency injection container and no package-level mutable state.

## Events

[Events between modules](../conventions.md#events-between-modules) in Go:

- An event is a struct in the publishing module's root package, part of its published API: `type PublishedEvent struct { OfferID uuid.UUID }` in package `offer`, read as `offer.PublishedEvent`. Repeating the package in the name (`offer.OfferPublishedEvent`) is the stutter Go's naming guidance warns against.
- Its key (`offer.published`) is the River job kind that carries it, so a listener is a River worker. It is inserted with `InsertTx` in the transaction that made the change.
- A listener that needs the event in its own terms translates it at its edge, as the anti-corruption layer of the vendored `golang-design-patterns` skill (`references/ddd.md`) shows.
- Where that skill differs, this repository wins:
  - it publishes after saving, through an `EventPublisher` called once the repository has saved; here the event is written in the same transaction, so a crash between the two can neither lose it nor publish a change that was rolled back;
  - it places a shared event bus under `internal/events/`; here the mechanics (River, the insert in a transaction) live in `internal/platform` and each event type with its publisher;
  - it splits each context into `domain/`, `application/` and `adapters/` from the start; here a module starts flat ([Modules](#modules)).
- A message broker (Redis Streams, RabbitMQ, NATS, Kafka) joins only when a listener lives outside this deployable. It is fed from the same transactional records by a relay, so publishers do not change; Watermill, which the vendored `golang-popular-libraries` skill lists, is the library to study first.

## Boundary verification

The compiler enforces `internal/` visibility and the absence of cycles. What it cannot enforce, which module may depend on which, is checked in continuous integration from a declared list of allowed edges, kept beside the module list in [ARCHITECTURE.md](../../ARCHITECTURE.md). The check is a test over `go list` (`server/internal/boundaries_test.go`) that reads the list from ARCHITECTURE.md, chosen in SEC-10 over go-arch-lint and depguard because it needs no tool and the page and the check cannot disagree. A new edge changes the list, the architecture page and, when it is a material change, an ADR, in the same change.

## Persistence

- PostgreSQL with PostGIS, reached through `pgx`.
- SQL is written in `internal/<module>/queries.sql` and turned into typed Go by `sqlc` in `internal/<module>/internal/db`, which no other module can import; `omit_unused_structs` keeps another module's row types out of it. A query that does not match the schema the migrations build fails generation, and CI fails when the generated code is out of date.
- Migrations are plain SQL run by `goose` ([persistence guideline](persistence.md)).
- Background jobs and the outbox of [events between modules](../conventions.md#events-between-modules) use River, which inserts a job in the same PostgreSQL transaction as the change.

## HTTP

- The standard library's `net/http` routing, with `huma` to declare operations and generate the OpenAPI 3.1 document from the implemented contract ([published API discovery](../conventions.md#api-discovery-and-product-boundaries)).
- chi was weighed as the router and left out because it would remove no hand-written code. Its middleware answers in plain text, not problems, and logs without `slog`, so the request identifier, panic recovery and access log stay in `internal/platform` with any router. Its custom 405 handler loses the `Allow` header. Middleware for a group of routes comes from `huma.NewGroup`, which also shows it in the OpenAPI document. Reconsider chi when routing needs something neither `http.ServeMux` nor huma offers, such as path constraints or mounting handlers that are not huma operations.
- Handlers route thinly: decode, call the module, encode. They never call a repository or another module's internals.
- One problem mapping in `internal/platform` turns typed failures into RFC 9457 responses ([API errors](../conventions.md#api-errors)).
- Every request gets an identifier, returned in `X-Request-Id` and logged as `request_id`.
- `context.Context` is the first parameter of every function that does I/O, and every outbound call has a timeout.

## Self-hosted infrastructure

Infrastructure the team runs itself in Docker Compose is preferred over managed cloud services; an external service is used only where self-hosting is not possible or not sensible (app stores, push delivery, payment, AI model providers). A component joins the composition with the first increment that needs it, never ahead of it.

| Component | Joins when | Until then |
| --- | --- | --- |
| PostgreSQL with PostGIS (`postgis/postgis:18-3.6`) | The backend foundation | — |
| pgvector, in an image built from the PostGIS one | Search by meaning (SEC-20) | Full text with `unaccent` and `pg_trgm` |
| MinIO or another S3-compatible store | The first stored image (SEC-11) | A local directory in development |
| Redis | Realtime fan-out across several instances, rate limits PostgreSQL cannot carry, or a cache justified by a measured slow read | Jobs in River, counts and sessions in PostgreSQL, in-process fan-out on one instance, `LISTEN/NOTIFY` across instances |
| A reverse proxy | The first deployment; on the temporary host it is that host's existing proxy ([vision](../vision.md#target-architecture)) | — |

## Logging and errors

- `log/slog` with the fields of [logging](../conventions.md#logging); JSON in deployed environments.
- Errors are wrapped with `%w` and compared with `errors.Is` and `errors.As`; an expected failure is a typed error carrying its code.

## Tooling and gates

- **Everything is on its newest stable version**: Go, every module, the tools, the actions and the images, as of the change that adds or touches them. Dependabot proposes each newer version every week (`.github/dependabot.yml`) of the Go modules, the web packages, the actions and the images in `compose.yaml`, which the tests also start (`platformtest.Image`); govulncheck fails CI on a known vulnerability the code reaches. A pre-release (PostgreSQL 19 beta) is not taken.
- **Raised by hand**, because Dependabot does not update them; check each when a module or the web application is touched, and at least once a month:

  | What | Where its version is written | Newest from |
  | --- | --- | --- |
  | Go | `go` in `server/go.mod`; CI reads it | [go.dev/dl](https://go.dev/dl/) |
  | golangci-lint | `version` in `.github/workflows/backend.yml`, and each developer's own install | [its releases](https://github.com/golangci/golangci-lint/releases) |
  | pnpm | `packageManager` in `web/package.json` | `npm view pnpm version` |
  | Node, its major version | `node-version` in `.github/workflows/web.yml` and `engines` in `web/package.json`; CI takes the newest release of that major version | [the LTS schedule](https://nodejs.org/en/about/previous-releases); 24 until the team moves |
- The Go version is pinned in `go.mod`. Code generators (`sqlc`) are pinned with `tool` directives so every machine runs the same version; goose runs as a library inside the binary. golangci-lint is pinned by version in CI and the runbook instead, because its maintainers advise against installing it through `go tool`.
- golangci-lint runs the recommended configuration of the vendored `golang-lint` skill (`server/.golangci.yml`). A `//nolint` names its linter and says why.
- Before pushing: formatting, golangci-lint, the tests (the boundary check, the contract check and the PostgreSQL tests, which need Docker) and `govulncheck`, as the [backend runbook](../runbooks/backend.md) lists.

These library choices come from the [backend stack research](../research/2026-10-16-backend-stack.md); a change of one is an ADR once the backend exists.
