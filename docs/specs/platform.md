# Platform: API behavior every module shares

`server/internal/platform` is not a module; it holds the behavior every operation has. Why it is shaped this way is in the [SEC-10 design](../increments/completed/sec-10-backend-foundation/design.md#foundation); how to run it is in the [backend runbook](../runbooks/backend.md). Checks: [docs/tests/platform.md](../tests/platform.md).

## Startup and configuration

- Configuration is read from variables prefixed `SECONDBITE_`. A secret is read from the file named after its variable under `SECONDBITE_SECRETS_DIR` (`/run/secrets` by default), and from the variable only when that file is absent. A database URL that holds a password is refused.
- Every missing or malformed value is reported at once and the service does not start.
- Migrations embedded in the binary are applied at startup under a PostgreSQL session lock, so several instances can start together.
- SIGINT or SIGTERM stops accepting requests and lets those in flight finish within 20 seconds.

## Requests

- Every request has an identifier: the caller's `X-Request-Id` when it is 1 to 64 characters of letters, digits, `.`, `_` or `-`, otherwise a new random one. It is returned in `X-Request-Id`, carried in every problem as `requestId` and logged as `request_id`.
- One access record per request (`platform.request.completed`) holds the route pattern, the status, the duration and the failure's code; never a body, an address, a code or a token.
- `/livez` answers while the process runs; `/readyz` while the database answers within 2 seconds.
- The OpenAPI 3.1 contract is served by the API and kept in `api/openapi.yaml`.

## Problems

Every error is an RFC 9457 problem (`application/problem+json`) with `type` (`urn:secondbite:failure:<code in kebab case>`), `title`, `status`, `detail`, `code` and `requestId`, as the [API errors convention](../conventions.md#api-errors) asks.

`detail` is written for people in the request's language (SEC-28). `Accept-Language` is matched against Vietnamese and English, quality values honoured, and Vietnamese answers when it asks for neither. Every problem carries `Content-Language` and `Vary: Accept-Language`. Each failure declares its words in both languages beside its code (`platform.Words`); a failure missing one stops its package from loading. Violations keep huma's English and are translated into Vietnamese by recognising huma's sentence, with "Giá trị không hợp lệ." when none is recognised. `title` stays the category's English.

| Category | Status | Notes |
| --- | --- | --- |
| `VALIDATION` | 400 | Violations in `errors[]`, each naming a body member by JSON Pointer (`pointer`) or a parameter by location (`parameter`, such as `query.limit`), with code `PLATFORM_VALUE_INVALID`; the rejected value is never echoed |
| `UNAUTHENTICATED` | 401 | Sends `WWW-Authenticate: Bearer` |
| `NOT_PERMITTED` | 403 | |
| `NOT_FOUND` | 404 | |
| `CONFLICT` | 409 | |
| `STALE` | 412 | A change sent with a version that is no longer the current one (SEC-75) |
| `GONE` | 410 | |
| `LIMIT_EXCEEDED` | 429 | `Retry-After` in whole seconds when the failure carries a wait |
| `SERVICE_UNAVAILABLE` | 503 | `Retry-After` likewise |

Failures the platform answers itself:

| Code | Status | When |
| --- | --- | --- |
| `PLATFORM_REQUEST_INVALID` | 400 | The body or a parameter breaks the contract, or the body is not JSON |
| `PLATFORM_AUTHENTICATION_REQUIRED` | 401 | An operation that needs a caller is called without one |
| `PLATFORM_ADMIN_REQUIRED` | 403 | An admin operation is called by someone else |
| `PLATFORM_CROSS_ORIGIN_REFUSED` | 403 | A change of state authenticated by the session cookie comes from another origin |
| `PLATFORM_VERSION_REQUIRED` | 400 | A change that needs the version read comes without `If-Match`, or without `If-None-Match: *` for what does not exist yet |
| `PLATFORM_CHANGED_SINCE_READ` | 412 | `If-Match` names a version that is no longer the current one, or none; or `If-None-Match: *` asks for something that exists already |
| `PLATFORM_ROUTE_NOT_FOUND` | 404 | No route matches the path |
| `PLATFORM_METHOD_NOT_ALLOWED` | 405 | The path exists for other methods, listed in `Allow` |
| `PLATFORM_INTERNAL_FAILURE` | 500 | An uncaught error or a panic; the cause is logged with the request's identifier, never answered |

## The caller

- A request with `Authorization: Bearer <token>`, or without it the session cookie `secondbite_session`, is authenticated by `identity` before it reaches its route, and its caller (account, session, role, and the account's address as its label for the audit trail, never logged) is put in the request's context. Without either the request is anonymous.
- A change of state (any method but `GET`, `HEAD` and `OPTIONS`) authenticated by the cookie must come from the same origin, judged by `Sec-Fetch-Site` and `Origin` with Go's `http.CrossOriginProtection`; a request without those headers, such as the web's server, passes.
- The contract declares both schemes, `bearer` and `cookie`; an operation that needs a caller lists either (`platform.SignedIn`), one open to anyone lists none as well (`platform.MaybeSignedIn`).
- A module reads the caller through `platform.CallerFrom`, `RequireCaller` and `RequireAdmin`, so it authorizes without depending on `identity`.
- Roles are `customer` and `admin`.

## Versions

- A setting kept in one row is changed only at the version read (SEC-75). Its read answers `ETag`, a strong tag of the row's `updated_at` in microseconds (`platform.ETag`). A save requires `If-Match` with that tag. The service locks the row, compares, and answers 412 `PLATFORM_CHANGED_SINCE_READ` when someone saved since. A weak tag, `*` or several tags name no version. Where the row may not exist yet, `If-None-Match: *` saves the first one, and answers 412 when someone saved it since (`platform.ErrVersionRequired` when neither header comes).
- Every admin operation is registered on the group `platform.NewAdminGroup` returns, under `/admin` (SEC-75). The group tags it `Admin`, documents that it needs a session, and refuses anyone but an admin before the request is read: 401 `PLATFORM_AUTHENTICATION_REQUIRED` signed out, 403 `PLATFORM_ADMIN_REQUIRED` otherwise. The service checks `RequireAdmin` as well. A test calls every operation under `/admin` both ways.

## Events between modules

Introduced with SEC-37 ([design](../increments/completed/sec-37-account-deletion/design.md#the-outbox)).

- River (v0.49) on the service's PostgreSQL carries events as a transactional outbox. Its tables are River's own, created by its migrations after goose at start-up while a session lock lets one instance migrate at a time.
- `Publish` writes an event inside the publisher's transaction, one job per listener; a rolled-back change publishes nothing. `Listen` registers a listener under a stable name before the service runs.
- Every event travels as one job kind, `platform.event`, with its key (`identity.account_deleted`) and its listener's name inside, since River binds one worker to a kind.
- **Schedules** (SEC-96): `Events.Every(name, interval, run)` registers a periodic River job under a stable name; River's elected leader enqueues each run, so instances never double one, and a run that fails is not retried, as the next comes soon. The run must be idempotent. Registered when the service is assembled and run only in `serve`, as the listeners are.
- `serve` runs the listeners, at most ten at once and each within a minute, retried with River's backoff; a job whose listener no longer exists is cancelled; they stop after the HTTP server, with ten seconds to finish. The command-line commands only write events.

## The live socket

Introduced with SEC-117 ([design](../increments/active/sec-117-order-chat-live/design.md)).

- `GET /live` is a WebSocket, a plain route and not a huma operation. It reads no cookie or `Authorization`, and accepts any `Origin`: authority comes from a live ticket alone, minted by an operation of a module (`platform.RedeemTicket` is the function the module gives the hub). Library: `github.com/coder/websocket`.
- Frames are JSON text. Client: `{"type":"subscribe","ticket":"…"}`. Server: `{"type":"subscribed","topic":"…"}`; `{"type":"refused"}` for an unknown, used or expired ticket or a 21st topic; the notices of the modules (`{"type":"order",…}`, `{"type":"message",…}`, `{"type":"seen",…}`); and `{"type":"resync"}`, which says notices may have been lost, so the client reads its state again.
- A connection follows at most 20 topics. A frame from the client is at most 4 KiB (1009), anything but a subscribe frame closes with 1008, a queue of 64 notices that fills closes with 1013, and a write takes at most 10 seconds. The server pings every 25 seconds and closes a connection whose pong does not come within 10. A connection lives 30 minutes, then closes with 4000 so the client reconnects with new tickets. On shutdown the hub closes every socket with 1001.
- `platform.Notify(ctx, tx, notice, topics...)` calls `pg_notify` on channel `secondbite_live` in the sender's transaction: delivered on commit, never on a rollback, and to the sockets of every instance. Each instance holds one dedicated listening connection, outside the pool, which `SECONDBITE_DATABASE_MAX_CONNS` does not count. When it drops, the hub reconnects with backoff of 1 to 30 seconds and sends `resync` to all its sockets.
- `serve` clears the read and write deadlines of a socket before accepting it, since `Serve` sets `ReadTimeout` and `WriteTimeout`. The access log records one line when a connection closes, with its duration; the hub logs topic counts and close codes, never a ticket or a notice.
