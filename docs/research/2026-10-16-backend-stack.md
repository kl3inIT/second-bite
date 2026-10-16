# Backend stack: Spring or Go, templates, libraries and agent skills

Studied on 16 October 2026 to choose how the backend is built. Versions, stars and activity were read from GitHub that day.

## Spring Boot or Go

The team's prior work is in Spring Boot 4 with Java 25 and Spring Modulith; its Go experience is small. The pilot needs a REST API, PostgreSQL with PostGIS, background jobs (reservation expiry, reminders), file storage, push and AI calls.

| | Spring Boot 4, Java 25 | Go |
| --- | --- | --- |
| Provided by the framework | Security, validation, JPA, migrations, scheduling, Modulith boundaries and events, Spring AI | Little: assembled from small libraries |
| Memory at run time | About 250–500 MB | About 20–50 MB |
| Start-up | Seconds (native image: milliseconds) | Milliseconds |
| Image size | 150–300 MB | 10–30 MB |
| Code to write for the same scope | Less | About 1.5–2 times more for authentication, validation and error handling |
| Module boundaries | Spring Modulith, checked by a test | `internal/` and the ban on import cycles, enforced by the compiler; allowed dependency direction by a linter |

At the pilot's size (tens of sellers, hundreds of customers) neither is limited by performance. Go was chosen by the team; the [backend guideline](../guidelines/backend.md) records how the conventions are realized in it.

## How Go projects draw module boundaries

- The compiler forbids importing a package under another tree's `internal/` directory, and forbids import cycles. These two give a closed module without a framework.
- Which module may depend on which is not checked by the compiler. Tools: [go-arch-lint](https://github.com/fe3dback/go-arch-lint) (595 stars, active), [depguard](https://github.com/OpenPeeDeeP/depguard) through golangci-lint, or a test over `go list -deps`.
- Grouping by business concept rather than by technical layer is common advice (Ben Johnson's "Standard Package Layout"; the DDD layout of the vendored `golang-design-patterns` skill). A modular monolith with an architecture test, as BeyondPilot has with Spring Modulith, is less common in Go and has to be assembled.
- Events that must survive a crash after a commit need a transactional outbox; River inserts a job in the same PostgreSQL transaction.

## Templates and references

| Repository | Stars | Last push | Assessment |
| --- | --- | --- | --- |
| [evrone/go-clean-template](https://github.com/evrone/go-clean-template) | 7.7k | Oct 2026 | The best maintained clean-architecture template; layer-first |
| [ThreeDotsLabs/wild-workouts-go-ddd-example](https://github.com/ThreeDotsLabs/wild-workouts-go-ddd-example) | 6.5k | Aug 2026 | A full DDD and CQRS example with bounded contexts; to learn from, not to copy |
| [Melkeydev/go-blueprint](https://github.com/Melkeydev/go-blueprint) | 9.0k | Apr 2026 | A command-line generator for a starting project |
| [bxcodec/go-clean-arch](https://github.com/bxcodec/go-clean-arch) | 10.2k | Apr 2024 | Popular but no longer updated |
| [golang-standards/project-layout](https://github.com/golang-standards/project-layout) | 56.7k | Apr 2026 | Not an official standard; the Go team has objected to it. [go.dev/doc/modules/layout](https://go.dev/doc/modules/layout) is the official guidance |
| [go-zero](https://github.com/zeromicro/go-zero), [kratos](https://github.com/go-kratos/kratos) | 33k, 26k | Oct, Sep 2026 | Microservice frameworks; too heavy for one service |

## Libraries, latest releases on 16 October 2026

| Purpose | Library | Release |
| --- | --- | --- |
| Language | Go | go1.27.2 (the development machine had go1.26.3) |
| Routing | `net/http`, or [chi](https://github.com/go-chi/chi) | chi v5.5.0 |
| Operations and OpenAPI 3.1 | [huma](https://github.com/danielgtaylor/huma) | v2.39.1 |
| Specification first, as an alternative | [oapi-codegen](https://github.com/oapi-codegen/oapi-codegen) | v2.8.0 |
| PostgreSQL driver | [pgx](https://github.com/jackc/pgx) | v5.11.0 |
| SQL to typed Go | [sqlc](https://github.com/sqlc-dev/sqlc) | v1.31.1 |
| Migrations | [goose](https://github.com/pressly/goose) | v3.29.0 |
| Jobs on PostgreSQL | [River](https://github.com/riverqueue/river) | v0.49.0 |
| Validation | [validator](https://github.com/go-playground/validator) | v10.30.5 |
| Tokens | [golang-jwt](https://github.com/golang-jwt/jwt) | v5.3.1 |
| Object storage | [minio-go](https://github.com/minio/minio-go) | v7.4.1 |
| Push | [firebase-admin-go](https://github.com/firebase/firebase-admin-go) | v4.22.0 |
| AI | [anthropic-sdk-go](https://github.com/anthropics/anthropic-sdk-go), [openai-go](https://github.com/openai/openai-go) | v1.82.0, v3.78.0 |
| Linting | [golangci-lint](https://github.com/golangci/golangci-lint) | v2.14.0 |
| Integration tests | [testcontainers-go](https://github.com/testcontainers/testcontainers-go) | v0.44.0 |

## Agent skills for Go

| Collection | Stars | Forks | Contributors | Notes |
| --- | --- | --- | --- | --- |
| [samber/cc-skills-golang](https://github.com/samber/cc-skills-golang) (MIT) | 3.5k | 230 | 13 | About 45 skills; the most adopted. Several skills promote the author's own libraries (`samber/lo`, `do`, `mo`, `oops`) |
| [cxuu/golang-skills](https://github.com/cxuu/golang-skills) (Apache-2.0) | 180 | 19 | 2 | About 20 skills distilled from the Google and Uber style guides and Effective Go; no commit since June 2026 |
| [eduardo-sl/go-agent-skills](https://github.com/eduardo-sl/go-agent-skills) (MIT) | 77 | 10 | 1 | Based on the Uber style guide |

Twenty-one skills of samber's collection and `go-code-review` of cxuu's are vendored under `.claude/skills/` ([sources](../../.claude/skills/SOURCES.md)).

What the skills say about architecture: `golang-project-layout` and `golang-design-patterns` ask the developer which architecture to use; their size table recommends a flat layout under 500 lines, a layer-first `handler/service/repository` layout up to 5,000 lines, and clean, hexagonal or DDD above. Only the DDD reference groups code by bounded context under `internal/`. `golang-structs-interfaces` says interfaces belong to their consumer and should wait for a second implementation. The [backend guideline](../guidelines/backend.md) answers the architecture question once, so an agent does not choose differently each time.

Style guides behind the skills: [Effective Go](https://go.dev/doc/effective_go), [Go Code Review Comments](https://go.dev/wiki/CodeReviewComments), [Google Go Style Guide](https://google.github.io/styleguide/go/), [Uber Go Style Guide](https://github.com/uber-go/guide).
