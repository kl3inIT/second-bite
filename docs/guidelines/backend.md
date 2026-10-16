# Backend guideline

How the backend realizes the [conventions](../conventions.md) in Go. It is policy for the backend from its first line of code; nothing here exists yet ([ARCHITECTURE.md](../../ARCHITECTURE.md)).

## Shape

One Go module under `backend/`, built into one binary that serves HTTP and runs background jobs. A second binary or a separate service needs the evidence of [boundary discovery step 8](../conventions.md#boundary-discovery) and an ADR.

```text
backend/
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
- **Everything else is internal to the module**, either unexported in the root package or under `internal/<module>/internal/`, which the Go compiler forbids any other module to import. A module starts flat (`handler.go`, `service.go`, `store.go` in the root package, unexported) and gains `internal/` subpackages only when it grows enough files to need them.
- **Persistence is never shared.** A module's queries and row types are unexported or under its `internal/`; another module calls the published API.
- **No import cycles**: the compiler refuses them, so a cycle between modules is resolved by an event or by moving the invariant to its owner, never by a shared helper package.
- `internal/platform` depends on no module. A module depends on `platform` and on the published API of the modules its context map names.
- Interfaces are declared by the code that consumes them, and only for a vendor family ([Strategy behind a registry](../conventions.md#interchangeable-implementations-strategy-behind-a-registry)) or a test that cannot use the real implementation. A module's own store and services are concrete types.
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

The compiler enforces `internal/` visibility and the absence of cycles. What it cannot enforce, which module may depend on which, is checked in continuous integration from a declared list of allowed edges, kept beside the module list in [ARCHITECTURE.md](../../ARCHITECTURE.md). The tool (`go-arch-lint`, `depguard` in golangci-lint, or a test over `go list -deps`) is chosen in the backend foundation increment. A new edge changes the list, the architecture page and, when it is a material change, an ADR, in the same change.

## Persistence

- PostgreSQL with PostGIS, reached through `pgx`.
- SQL is written in `.sql` files per module and turned into typed Go by `sqlc`, so a query that does not match the schema fails the build.
- Migrations are plain SQL run by `goose` ([persistence guideline](persistence.md)).
- Background jobs and the outbox of [events between modules](../conventions.md#events-between-modules) use River, which inserts a job in the same PostgreSQL transaction as the change.

## HTTP

- The standard library's `net/http` routing, with `huma` to declare operations and generate the OpenAPI 3.1 document from the implemented contract ([published API discovery](../conventions.md#api-discovery-and-product-boundaries)).
- Handlers route thinly: decode, call the module, encode. They never call a store or another module's internals.
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

- The Go version is pinned in `go.mod` with its `toolchain` line; tools (`sqlc`, `goose`, `golangci-lint`) are pinned with `tool` directives so every machine runs the same versions.
- Before pushing: formatting, `go vet`, golangci-lint, the boundary check, `govulncheck` and the tests, which need Docker for PostgreSQL. The exact commands land in a runbook with the backend foundation.

These library choices come from the [backend stack research](../research/2026-10-16-backend-stack.md); a change of one is an ADR once the backend exists.
