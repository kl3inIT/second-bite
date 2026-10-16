# Engineering conventions

These conventions apply across Second Bite, whatever the language or framework. How the backend realizes them in Go is in the [backend guideline](guidelines/backend.md); module-specific behavior belongs in `docs/specs/`; change-local reasoning belongs in the active increment ([operating model](guidelines/operating-model.md)).

The conventions are adapted from the BeyondPilot repository (GenAI Fund), revision `173f8789` of 16 October 2026, with everything specific to Spring, Java and Next.js removed.

## Change design

- Prefer the smallest complete production path over scaffolding for a hypothetical future path.
- Do not add interfaces, adapters, configuration modes or deployment units without a current caller and an owned lifecycle. The one deliberate exception is the [interchangeable-implementations pattern](#interchangeable-implementations-strategy-behind-a-registry).
- Use a clean cutover: migrate every caller and remove obsolete code, configuration, comments and tests in the same change.
- Never ship a temporary runtime mode, one-shot profile, convenience endpoint or unused abstraction to make an incomplete flow operable. Disposable verification helpers stay in tests or scratch files and are never built into the application.
- Keep the module boundaries recorded in [ARCHITECTURE.md](../ARCHITECTURE.md). A new dependency edge between modules requires an architecture decision and an update to the boundary check ([backend guideline](guidelines/backend.md#boundary-verification)).

## Design patterns

### Interchangeable implementations: Strategy behind a registry

Use this pattern when a module performs one function through one of several interchangeable implementations, and configuration or persisted data chooses which one runs. Typical cases are external vendors: AI model providers, speech-to-text, object storage, message delivery. Each implementation is a Strategy for the function and an Adapter over one vendor's API; a registry selects it by key.

- **One interface per function**, named `<Function>Adapter` or after the function (`ListingDrafter`), not one interface per vendor. A function that only some implementations offer gets its own interface and registry instead of methods that fail with "unsupported".
- **One type per implementation**, named after its vendor and function (`ClaudeListingDrafter`, `S3ObjectStore`), kept inside the owning module.
- **One registry** receives every implementation when the application is assembled and resolves one by key:
  - **Closed family** (the product supports a fixed list): key by a persisted enumeration of providers. Startup fails when a provider has no implementation or two.
  - **Open family** (a new implementation is only a new type): key by the implementation's stable string type. Startup fails on a duplicate key.
- **The key is identity only.** What an implementation supports (features, limits, defaults) comes from the implementation as a capabilities value, not from flags on the enumeration.
- **Shared mechanics stay shared.** HTTP client setup, timeouts, retries, metrics and result validation live in one place that delegates to the implementation; they are not copied into each one.
- **Naming.** Vendor names are written as words (`OpenAi`, `Claude`, `Minio`), spelled the same everywhere. Type names carry no authentication mode or API version.
- **Apply it from the first implementation, and only to vendor families.** This pattern is the deliberate exception to the rule against single-implementation interfaces. Do not use it for code that has exactly one implementation by nature, such as a store over the module's own tables, an application service or the push sender.

The pilot's vendor families are listed in the [pilot domain model](increments/active/sec-6-pilot-domain-model/design.md#interchangeable-implementations).

## Reference-based design and scope control

Production readiness is a required quality standard for the agreed scope from the start: correct behavior, authorization, data integrity, bounded resource use, failure handling, observability, and appropriate verification and deployment practices. Scope control must not be used to defer necessary engineering or to deliver a prototype in place of the requested system.

Scope creep means adding unrequested behavior or mechanisms without establishing why the agreed scope needs them. Necessary hardening is part of the scope even when nobody enumerated every failure case. Establish the need through concrete requirements, source analysis, credible failure scenarios or measurements; do not wait for an incident. Choose the simplest sufficient mechanism and explain its tradeoffs.

- When a reference implementation is the baseline (BeyondPilot, a template repository, a library's own example), inspect it and cite the revision and code path. Separate observed behavior, inferred rationale, proposed changes, accepted decisions and verified implementation. State evidence gaps instead of assuming the reference lacks a capability.
- Before recommending a material departure from the reference, record in the active design: the current requirement or demonstrated failure; the reference behavior and its strengths; the proposed difference; its concrete benefit; its implementation, operational and UX costs; the simpler baseline option; and the evidence needed to choose. If the benefit does not justify the cost, keep the baseline.
- Use the standard library and the chosen libraries' public APIs first. Prefer documented configuration and hooks, then composition; avoid internal packages, reflection and copied engines.
- Evaluate reuse across the whole accepted scope, not only the next step. A missing connection calls for integration, not a duplicate engine.
- Do not prebuild workers, queues, event journals, configuration snapshots, registries or plugin mechanisms for hypothetical future use. Extensibility starts with usable APIs and actual consumers, not empty packages.
- Carry accepted decisions across turns. Do not reopen rejected additions or silently promote suggestions into scope.
- Keep validation claims proportional to evidence. Source review, diagrams, isolated probes and production acceptance are different results.
- When a decision changes, reconcile the design, plan, references and diagrams together, and keep one canonical statement of each decision.

## Boundary discovery

Module boundaries are discovered from domain evidence, not inferred from folders, tables, entities, frameworks or imagined future services. Every new module, and every material change to a boundary, follows this sequence:

```text
Domain Story
→ Visual Glossary
→ Events, Commands, Aggregates and Read Models
→ Data and Invariant Owner
→ Context Map and Communication Pattern
→ Module inside the one service
→ Boundary Verification
→ Separate Service Only with Evidence
```

1. **Domain Story:** record actors, work objects, ordered actions, the outcome, and important failure and recovery paths in the active increment.
2. **Visual Glossary:** define one term per concept, its relationships and cardinality, and where the same real-world object means different things. Do not proceed while terms such as Seller, Store, Offer, Box, Order, Collection or Customer are overloaded.
3. **Events, Commands, Aggregates and Read Models:** identify intent, observed business facts, consistency boundaries and projections. Distinguish synchronous invariants from asynchronous reactions.
4. **Data and Invariant Owner:** assign one module as the source of truth for each table, lifecycle and invariant. No two modules write the same table or read each other's persistence code.
5. **Context Map:** state provided and required APIs, dependency direction, synchronous calls, events, failure and consistency semantics, actors and non-functional requirements. Reject unexplained cycles.
6. **Module first:** implement the smallest complete vertical slice as a closed module of the one backend service, with a narrow published API and everything else internal ([backend guideline](guidelines/backend.md#modules)). A bounded context may contain several modules; a module is not automatically a service.
7. **Verify:** enforce allowed dependencies, internal and persistence ownership, and observable contracts in continuous integration.
8. **Separate service only with evidence:** add a separately built or deployed unit only for a concrete dependency conflict, an independently selected runtime, release or team ownership, a scaling or failure boundary, or a demonstrated build bottleneck. Record the accepted tradeoff in an ADR after implementation starts.

Keep parts together when they share one language, invariant owner, transaction and lifecycle, and reason to change. Separate them when language, source of truth, invariants, actors, lifecycle, failures, non-functional requirements or change ownership diverge and an explicit one-way contract exists. When evidence is incomplete, prefer fewer modules and preserve later extraction through published APIs rather than predeclaring placeholders.

## API discovery and product boundaries

Published APIs are derived after domain boundaries, not from tables, entity fields, handler convenience or provider SDKs. Every new API or material contract change follows:

```text
Domain Story and Consumer
→ Visual Glossary
→ Commands, Events and Read Models
→ Context Map and API Product Canvas
→ Synchronous or Asynchronous Surface
→ HTTP or Event Contract
→ Generated Specification
→ Consumer and Runtime Verification
```

1. Name the consumer, goal, authority, frequency, latency and consistency need, and the failure and recovery path before choosing REST, an event, a push notification or a background operation.
2. Use consumer-facing ubiquitous language. Do not expose persistence joins, framework types, provider SDK objects or internal orchestration names as resources because they exist in code.
3. Separate commands from read models. A read model may compose data from several modules without moving source-of-truth ownership into the HTTP layer.
4. Use resource creation, list and detail where a durable resource is the product concept. Use an explicit POST command for a domain transition on a durable resource; do not label a cancel or withdraw as DELETE when history stays addressable under the same identity.
5. Keep responses minimal and consumer-owned. Expose internal identifiers, lifecycle facts, authority projections and diagnostic metadata only when a current consumer needs them.
6. Model asynchronous work as `202 Accepted` plus a durable status resource with a polling and recovery contract. Do not return success or a problem for work that has not completed.
7. Define idempotency, retries, the concurrency winner, ordering, pagination, bounded filters and sorts, and deletion and retention before publishing an operation. A command a person may send twice, such as placing an order, takes an idempotency key.
8. Every operation in the OpenAPI document has a stable consumer-facing `operationId`, product tags, a summary, its security requirement and explicit success and failure responses.
9. Generate the specification from the implemented contract, verify it against the API Product Canvas and glossary, regenerate clients, and exercise one real consumer flow.

## API errors

The error contract follows [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457.html) and the machine-readable-reason guidance of [Google AIP-193](https://google.aip.dev/193).

- **Typed failures.** Each module declares its expected failures as stable codes, each with a category and a safe message for people. Code returns or raises a typed failure carrying the code; the diagnostic message reaches logs only. HTTP types never enter a module's business or persistence code.
- **One mapping.** One place in the HTTP layer turns a failure into a problem response. Handlers do not write error bodies of their own.
- **Codes.** Codes are upper snake case, start with the module name, match `[A-Z][A-Z0-9_]+[A-Z0-9]` and are at most 63 characters, for example `ORDER_OFFER_SOLD_OUT`. A published code never changes meaning; a new meaning gets a new code.
- **Status by category.**

  | Category | HTTP status |
  | --- | --- |
  | `VALIDATION` | 400 |
  | `NOT_PERMITTED` | 403 |
  | `NOT_FOUND` | 404 |
  | `CONFLICT` | 409 |
  | `GONE` | 410 |
  | `LIMIT_EXCEEDED` | 429 |
  | `SERVICE_UNAVAILABLE` | 503 |

- **Problem members.** `type` is `urn:secondbite:failure:<code in kebab case>` and maps one to one to `code`; `title` comes from the category; `detail` is the safe message; `code` and `requestId` are extension members, `requestId` equal to the identifier logged for that request and returned in `X-Request-Id`.
- **Every error response is `application/problem+json`**: business failures, request validation, unknown routes, authentication refusals and uncaught failures, which answer a generic 500 with no internal detail. A test verifies each kind.
- **Validation failures** return 400 with an `errors` extension: one entry per violation with `pointer` (a JSON Pointer to the offending member, for example `#/priceVnd`), `detail`, `code` and optional `params` holding only allowlisted numeric bounds such as `min` and `max`. A rejected value is never echoed.
- **Retry hints.** 429 and 503 responses carry `Retry-After` in whole seconds.
- **Consumers.** Clients branch on `status` or `code`, never on `title`, `detail` or diagnostic text, and translate codes into the reader's language. A new code arrives with its words in both languages of every client that can meet it.
- Never put a code into a message string and match the string later.

## Events between modules

A module tells others that something happened with an event.

- **The event** is named for a past fact followed by `Event`, and is written with the module that publishes it, so the module is not repeated in the name: `offer.PublishedEvent`, `order.CollectedEvent`, `payment.ReceivedEvent`. Its stable key, used where the event is stored, delivered and logged, is the module and the fact in lower case: `offer.published`, `order.collected`. The domain model may still speak of the fact alone ("offer published"). The event carries identifiers only. A listener that needs the state reads it through the publisher's published API, so it always sees the current state and the event store never holds personal data.
- **Publishing** happens inside the transaction that made the change, by writing the event or the job that carries it to PostgreSQL in that transaction (a transactional outbox). A rolled-back change publishes nothing; a committed change is never lost by a crash after the commit.
- **Listening** runs after the commit, in a transaction of its own, so its failure never undoes the change. A listener is idempotent and does not depend on order, because an event can be delivered again.
- **Within a module**, a side effect after the commit may use a plain job without being part of the module's published API.

## Testing

Every test must identify the observable contract and the regression it would catch. Use the smallest boundary that can actually detect that regression:

| Contract | Default test boundary |
| --- | --- |
| Business rule, validation, ordering, state transition | Plain unit test with real values; substitute only external collaborators |
| HTTP mapping, binding, validation, JSON, authentication | The real HTTP handler with its middleware, called through an in-process server; calling a business function directly is insufficient |
| SQL, migration, locking, transaction or constraint | Integration test against PostgreSQL with the real migrations, in a container |
| Module boundary and events between modules | The boundary check for the structure; an integration test for the event's delivery |
| Composition of the whole service, background lifecycle | The assembled service against its real dependencies in containers |
| Mobile interaction | A widget test for one screen's behavior; an integration test on a device or emulator for navigation and the session |
| Deployed feature acceptance | A smoke test against the deployed release and its real dependencies |

- Do not test generated code, library defaults, unexported helpers, fixed call sequences or source spelling. Boundary and generated-contract drift checks are exceptions because those boundaries are repository contracts.
- Before adding a test, check the module's verification matrix in `docs/tests/` and existing cases. Extend an existing case when it covers the same behavior, boundary and failure mode.
- Test through the published entry point. Do not export a helper or keep dead code alive only so a test can reach it.
- Never mock the database to test SQL, a migration, a lock or a constraint.
- Remove a test only with an explicit explanation of its missing value or a named replacement that preserves its assertions. Never remove concurrency, migration, security or negative-path coverage because a happy-path test passes.
- Keep database fixtures isolated, avoid order dependencies and shared mutable state, bound every asynchronous wait, and clean up resources through their actual lifecycle owner.
- A required infrastructure failure fails the required gate. A mock or skipped test never establishes a live integration.
- Retries must not turn a flaky required test into accepted evidence. Classify the failure from diagnostics; do not weaken assertions or quarantine a test as a fix.
- Coverage is a diagnostic, not a percentage gate.

## Logging

- Logs are structured key and value records.
- Every log carries `event` named `<module>.<subject>.<outcome>` in snake case, for example `order.collection.confirmed`. Failures add `error_type` and `error_code` (the typed code when one exists). A handled failure logs these fields without a stack trace.
- INFO records lifecycle transitions, DEBUG stale or no-op details, WARN handled retries and expected failures worth attention, ERROR unhandled failures.
- Never log passwords, tokens, secrets, presigned URLs, collection codes, request or response bodies, file or audio contents, personal data such as names, email addresses, phone numbers or precise locations, or a third party's error text.
- Local development logs readable text; deployed environments log JSON to standard output.

## Data and security

- Follow the [persistence guideline](guidelines/persistence.md).
- Authorization is enforced on the server in the module's application code, never only by hiding interface elements.
- Fail closed on missing configuration, invalid credentials, unknown bindings and ownership conflicts.
- Configuration comes from environment variables prefixed `SECONDBITE_`. Deployed environments mount each secret as a file named after its variable under `/run/secrets`; a secret never sits in a container's environment, where inspection and crash reports show it.
- Never write passwords, tokens, private keys, authorization codes, secret values or personal data to Git, docs, Linear, logs or command history. The repository is public. Record only where a secret is managed and how to retrieve it.
- A collection code is a secret of its order: random, single use, stored only as a hash, valid only within its collection window, and refused after a bounded number of wrong attempts.
- A customer's precise location is used to answer a query and is not stored with their account.
- Administrative or ownership-changing behavior requires an authorization and audit design; never expose an unauthenticated convenience endpoint.

## Documentation

- One canonical home per fact; link instead of copying.
- `ARCHITECTURE.md` states what exists. `docs/vision.md` states intended outcomes. ADRs state accepted rationale. Guidelines state reusable policy. Specs state module contracts. Increments state change-local design and progress. See the [operating model](guidelines/operating-model.md).
- Update documents in the same change that makes them true.
- Repository documents are written in English.
