# SEC-10 — Backend foundation and the `seller` module: design

Status: being designed, one part at a time ([plan](plan.md)). Each part below is decided with the team before code is written for it.

## Foundation

Built on 16 October 2026 on this increment's branch; how to run and check it is in the [backend runbook](../../../runbooks/backend.md). Each choice below follows a vendored skill, a reference project or a repository rule, named beside it.

### Entry point and lifecycle

- `cmd/secondbite` only assembles: `main` takes the signal context and calls `run(ctx, getenv, stdout)`, which a test calls in-process. `golang-project-layout` keeps business logic out of `main`; taking the environment as an argument is what makes the whole service testable.
- **Shutdown** follows `golang-design-patterns` (`references/resource-management.md`): `signal.NotifyContext` for SIGINT and SIGTERM, then `http.Server.Shutdown` with 20 seconds for requests in flight, then the pool closes.
- **Server timeouts** are explicit (`go-code-review`, `references/WEB-SERVER.md`): read header 5 s, read 15 s, write 30 s, idle 60 s.
- **One process for now.** The `serve` and `worker` roles discussed for River arrive with the first job; until then there is no subcommand.

### Configuration

- Variables prefixed `SECONDBITE_`, read through the standard library: seven values do not need a library, and `golang-popular-libraries` lists env, Koanf and Viper for larger needs.
- A secret is read from the file named after its variable under `SECONDBITE_SECRETS_DIR` (`/run/secrets` by default), through `os.Root` so a name cannot leave that directory; only when the file is absent does it fall back to the variable, for local development ([data and security](../../../conventions.md#data-and-security)).
- The database password is a secret of its own; a URL that holds a password is refused.
- The service fails closed: every missing or malformed value is reported at once and the service does not start.

### Database and migrations

- `pgxpool` with an explicit size (10), connection lifetime (30 minutes) and a 5-second bound on the first connection ([persistence operations](../../../guidelines/persistence.md#operations)). pgxpool has no acquisition timeout of its own; each caller's context bounds it.
- Migrations are embedded in the binary (`server/migrations`) and applied by goose's `Provider` at startup, under a PostgreSQL session lock so that several instances can start together, as BeyondPilot applies Flyway at startup.
- The first migration enables PostGIS (`0001_platform_enable_postgis.sql`); the seller's location is its first user, in this increment.

### HTTP and problems

- huma on the standard library's `ServeMux` (`humago`). The `$schema` member and `Link` header huma adds by default are turned off: the contract is the OpenAPI document.
- **One mapping for every error**, `mapError` in `internal/platform`. huma lets a service replace how it builds errors only through two package variables (`huma.NewError`, `huma.NewErrorWithContext`); they are set once per process, and the logger comes from the request's context so that tests running in parallel do not race.
- What huma does by default and the [API errors](../../../conventions.md#api-errors) forbid, the mapping changes:
  - an uncaught error answered "unexpected error occurred" with the error's own text in `errors`; it now answers a generic 500 and logs the error with the request's identifier;
  - a validation error echoed the rejected `value`; it is now dropped;
  - validation answered 422; it now answers 400.
- A module returns a `*platform.FailureError` declared once with its code, category and safe message (`errname` in the lint configuration asks for the `Error` suffix). The category gives the status and the title; `Retry-After` is sent in whole seconds for a failure that carries a wait.
- Failures the platform answers itself have codes beginning `PLATFORM_`: `PLATFORM_REQUEST_INVALID`, `PLATFORM_ROUTE_NOT_FOUND`, `PLATFORM_METHOD_NOT_ALLOWED`, `PLATFORM_INTERNAL_FAILURE` and the others in `problem.go`.
- **Unmatched routes** are answered with a problem too: the mux is asked which handler it would use, and a 404 or a 405 (with `Allow`) is written as `application/problem+json` instead of the mux's plain text.
- A violation names a body member by JSON Pointer (`#/priceVnd`) or a parameter by its location (`query.limit`). Every violation has the code `PLATFORM_VALUE_INVALID` for now: huma gives a message per violation but no stable reason, and a code per rule (too small, too long, missing) is added when a client needs to tell them apart.

### Request identifier, logs and probes

- Every request gets an identifier from `crypto/rand.Text`, or keeps the caller's when it is 1 to 64 characters of letters, digits, `.`, `_` or `-`, so a proxy's identifier follows the request. It is returned in `X-Request-Id`, carried in every problem as `requestId`, and added as `request_id` to every record logged with the request's context.
- One access record per request (`platform.request.completed`) with the route pattern rather than the path, the status, the duration and the failure's code, as `golang-error-handling` asks of request logging. The probes log at DEBUG.
- A panic is recovered into a generic 500 problem and logged with its stack (`platform.request.panicked`); `http.ErrAbortHandler` is left to net/http.
- `/livez` answers while the process runs; `/readyz` while the database answers within 2 seconds.

### Checks

- **Lint**: the recommended `.golangci.yml` of the vendored `golang-lint` skill, unchanged apart from a renamed gofumpt setting, with golangci-lint v2.14.0 (v2.15.0 was published the same day and is not taken yet).
- **Boundary check**: a test over `go list` (`server/internal/boundaries_test.go`), chosen over go-arch-lint and depguard because it needs no tool and reads the allowed edges from [ARCHITECTURE.md](../../../../ARCHITECTURE.md), so the page and the check cannot disagree. It counts test imports too, and was seen to fail on a module importing another without an allowed edge and on one reaching past another's root package.
- **Contract check**: `api/openapi.yaml` is generated from the registered operations and compared in a test; `-update` rewrites it.
- **Composition test**: the assembled service against `postgis/postgis:18-3.6` in a container (testcontainers-go): migrations, probes, request identifiers, the contract, problems for an unknown route and a wrong method, and a clean stop.
- **CI** (`.github/workflows/backend.yml`): lint, `go mod tidy -diff`, tests with the race detector, govulncheck; actions pinned by commit SHA, read-only token, no automatic merge.
- **Local database**: `compose.yaml` at the repository root. Its health check asks over TCP, because during the image's first start PostGIS is installed on a server that listens only on its Unix socket, and a socket check reports ready too early (seen on the first run).

### Not in the foundation yet

Each arrives with its first user, as the [backend guideline](../../../guidelines/backend.md#self-hosted-infrastructure) asks: River with the first job, sqlc with the first query, Mailpit with email, the `UNAUTHENTICATED` category (401) with `identity`, and the container image and deployment with the first deployment.

## Email delivery

Decided with the team on 16 October 2026.

### What is decided

- **Email delivery is a vendor family from the first line**, as [interchangeable implementations](../../../conventions.md#interchangeable-implementations-strategy-behind-a-registry) prescribes. There is one interface for the function, `EmailSender`, declared in the module that sends, and one type per provider.
- **Operators choose the provider while the system runs**, as in BeyondPilot's Admin › Email, so the registry is real and not a choice made once at startup:
  - The family is **closed**: the providers are a persisted enumeration (`brevo`, `smtp`, later `resend` or `ses`).
  - `cmd/secondbite` builds every implementation once and gives them to a registry keyed by that enumeration, a plain map built at startup with no package-level state. Startup fails when a provider has no implementation or two.
  - Each send reads the current settings, resolves the provider through the registry and passes it that provider's settings, so a change takes effect on the next email without a restart.
  - Adding a provider is a new type, a new enumeration value and its settings fields on the screen.
- **Brevo through its HTTP API is the provider of staging and production** (`BrevoEmailSender`), not its SMTP relay. The API answers a message id, which the delivery reports of Brevo's webhook name, so bounces and complaints can later be matched to the email and the address suppressed, as BeyondPilot does in BEY-128. Its free plan allows 300 emails a day, which covers the pilot's sign-in codes.
- **SMTP to Mailpit in development and in tests** (`SmtpEmailSender`). Mailpit joins the local Compose file and catches every email, so a developer reads it in Mailpit's web page and a test reads the code that was sent through Mailpit's API. The same type serves any SMTP server later.
- **Shared mechanics stay outside the providers**: the message type, address validation, the timeout and logging, so each provider only translates a message into its vendor's call. A provider answers a typed failure:
  - refused: the request or the address is wrong, and trying again does not help;
  - rate limited: carries the wait the vendor asks for;
  - unavailable: a network failure or a 5xx.
- **Settings live in the database and are kept by operators.** One settings row holds the chosen provider, the sender address and name, and each provider's values (Brevo's API key; an SMTP server's host, port, user and password).
  - Secrets in that row are sealed field by field with AES-256-GCM (`crypto/cipher` from the standard library) under a key read from a file under `/run/secrets` ([data and security](../../../conventions.md#data-and-security)), the one email value the environment supplies.
  - The API never returns a secret; it says only whether one is set, and an empty field on save keeps the stored one.
  - Losing or replacing the key makes the stored secrets unreadable; an operator enters them again.
  - A fresh database sends no email until an operator chooses a provider. Local setup chooses SMTP to Mailpit, so development works from the first run.
- **Delivery reports** (Brevo's webhook, suppressed addresses) are a later step of the [plan](plan.md). The message id is kept from the first send so they can attach to it.

### The sign-in code is sent within the request

Decided with the team on 16 October 2026.

When a customer asks for a sign-in code, `identity` creates it, stores only its hash, and sends the email before the request is answered. If sending fails, the request answers `503` with `Retry-After` and the customer asks again. No job queue carries the code.

- **The code exists in clear only in that request.** A River job keeps its arguments in `river_job`, and River keeps a completed job for 24 hours by default (`CompletedJobRetentionPeriodDefault`). Kratos likewise stores the rendered message, code included, in its courier table. Either way a database dump or backup would hold live codes unless they were encrypted.
- **A retry later is worth nothing here.** The customer is waiting on the screen and the code expires within minutes. River's backoff, seconds and then minutes, would deliver a code they have already given up on. An immediate failure they can see and repeat is the better answer.
- **The cost is a slower answer** while Brevo answers, bounded by a timeout of 10 seconds.
- **Every other email goes through a River job** with retries (order confirmations, reminders), carrying no secret. BeyondPilot's ADR 0005 records the same split.

### Libraries

Checked on GitHub on 16 October 2026. None of the vendored skills names an email library.

| Use | Library | Why |
| --- | --- | --- |
| SMTP (Mailpit, any SMTP server) | `github.com/wneessen/go-mail` (v0.8.1, July 2026; about 1,500 stars, pushed this week) | Maintained, with context-aware sending, STARTTLS and implicit TLS, SMTP authentication and MIME built in; Kratos sends through a fork of it (`ory/mail/v3`) |
| Brevo's API | `net/http` against `POST https://api.brevo.com/v3/smtp/email` | Brevo's Go SDK `getbrevo/brevo-go` (v1.1.3) has had no release since February 2025 and has about 30 stars; the call is one JSON request ([what the SDKs teach](#what-the-sdks-teach)) |
| Resend, if added | `github.com/resend/resend-go` (v4.8.2, October 2026) | The vendor's own SDK, maintained |
| Amazon SES, if added | `github.com/aws/aws-sdk-go-v2/service/sesv2` | The vendor's own SDK |
| Local catcher | Mailpit (`axllent/mailpit`, about 10,700 stars, v1.31.6) | Maintained successor of MailHog, which listmonk and Kratos still run; it serves SMTP and a web page and has an API that tests read |

Not chosen: `net/smtp` (the Go team has frozen it; memos uses it), `go-gomail/gomail` (no release since 2016), `knadh/smtppool` (a connection pool built for bulk campaigns; one email at a time needs none).

### What the SDKs teach

Brevo's and Resend's Go SDKs were cloned into `.tmp/` on 16 October 2026 and read for what a hand-written client should keep.

- **`getbrevo/brevo-go`** is generated by Swagger Codegen.
  - The send is `POST /v3/smtp/email` with the header `api-key`. The body has `sender`, `to`, `subject`, `htmlContent`, `textContent`, `replyTo`, `tags` and `headers`. A `201` answers `messageId`; an error answers `{code, message}` (`lib/api_transactional_emails.go`, `lib/model_send_smtp_email.go`, `lib/model_error_model.go`).
  - It falls back to `http.DefaultClient`, which has no timeout (`lib/client.go`), and sends the same key a second time as `partner-key`. Neither is copied.
- **`resend/resend-go`** is written by hand and is the better model of the shape.
  - `NewCustomClient(httpClient, apiKey)` takes the `*http.Client`, so tests point it at a local server. The default has a timeout of one minute and a `User-Agent` (`resend.go`).
  - One `handleError` turns the status into a typed error. A 429 becomes `RateLimitError` carrying `Retry-After`, matched with `errors.Is(err, ErrRateLimit)` (`errors.go`).
  - An idempotency key travels in the `Idempotency-Key` header on POST.

So `BrevoEmailSender`:

- takes an `*http.Client` with its own timeout;
- sends `api-key` and a `User-Agent`;
- tags each email with its kind (`sign-in-code`);
- maps 429 to rate limited, other 4xx to refused, and 5xx or a network error to unavailable;
- is tested against an `httptest.Server` answering as Brevo documents;
- sends no idempotency key until its behaviour is known from a real account, for the reasons BeyondPilot gives in BEY-128;
- never logs the body or the key.

### What the references do

The references were read in `.tmp/` and in BeyondPilot on 16 October 2026.

- **BeyondPilot** began with SMTP from the environment. It later moved provider choice into an operator screen with Amazon SES, Resend, SMTP and Brevo behind `EmailAdapterRegistry` (its ADR 0005, BEY-68 and BEY-128).
  - `identity` publishes the sign-in code as an event, and `notification` sends it synchronously, so the code in clear is never stored.
  - A failure answers `503` with `Retry-After`.
- **Ory Kratos** (`courier/`) has a `Channel` interface with two implementations, `smtp` and `http`.
  - Messages are stored and sent by a queue with retries.
  - The SMTP server is configured as one connection URI.
  - Tests and the quickstart use MailHog or MailSlurper.
  - It sends through `github.com/ory/mail/v3`, a fork of go-mail.
- **listmonk** sends through `github.com/knadh/smtppool/v2`, a pool of SMTP connections built for bulk campaigns. Its development Compose file runs MailHog.
- **memos** (`internal/email`) wraps the standard library's `net/smtp` in one concrete `Client`, without any interface, and gives each operation a 15-second timeout.

So the shape is common: mail caught locally in development, a provider family once more than one way of sending is wanted (Second Bite has two from the start, Mailpit and Brevo), and a vendor's API where its delivery reports matter.

### Left for the step that writes the code

- **Who calls whom.** `identity` sends the sign-in code through the email module, and the settings screen is for operators, whose role `identity` owns. BeyondPilot broke the same cycle by having `identity` publish the code as a synchronous event (its ADR 0005). Here the operator check may come from the request's authenticated caller in `internal/platform` instead, so that only one edge exists. This is decided with the `identity` step, against the context map.
- **The settings screen** belongs to the operators' web application (SEC-17); this increment delivers its API.
- **Pinned versions** of Mailpit and go-mail, each at least two weeks old when pinned.
- **Brevo's documented limits and its webhook**, read again on developers.brevo.com when the delivery reports are built.

### Sources

- [Brevo review, WP Mail SMTP](https://wpmailsmtp.com/brevo-review/)
- [Best free SMTP servers compared, SendLayer](https://sendlayer.com/blog/best-free-smtp-servers/)
- [Brevo review 2026, Dreamlit](https://dreamlit.ai/blog/brevo-review)

The free limit (300 a day, Brevo branding in the footer) comes from these secondary sources. It is checked on Brevo's own pricing page when the account is created.
