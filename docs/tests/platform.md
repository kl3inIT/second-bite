# Platform: verification matrix

Requirements of [docs/specs/platform.md](../specs/platform.md) and the checks that hold them. Paths are under `server/`. `TestService` (`cmd/secondbite/main_test.go`) runs the assembled service against PostGIS and Mailpit in containers.

| Requirement | Check |
| --- | --- |
| Missing or malformed configuration is reported at once; a URL with a password is refused | `TestLoadConfig` (`internal/platform/config_test.go`) |
| Migrations apply at startup and follow the naming rule | `TestService` › migrations applied; `TestNames` (`migrations/migrations_test.go`) |
| Probes answer and carry a request identifier | `TestService` › probes answer and carry a request id |
| A well-formed request identifier from the caller is kept | `TestService` › a well-formed request id from the caller is kept |
| The contract is served and `api/openapi.yaml` matches the operations | `TestService` › the contract is served; `TestOpenAPIDocumentIsCurrent` (`cmd/secondbite/openapi_test.go`) |
| An unknown route is a 404 problem; another method a 405 problem with `Allow` | `TestService` › an unknown route is a problem; another method on a known route is a problem with Allow |
| A failure becomes its problem, with code, category status and request identifier | `TestFailureBecomesItsProblem`, `TestFailuresMatchByCode` (`internal/platform/problem_test.go`) |
| `Retry-After` is sent in whole seconds | `TestRetryAfterIsSentInWholeSeconds` |
| An uncaught error or a panic is a generic 500, logged with the request identifier, never answered | `TestUncaughtErrorIsAGeneric500`, `TestPanicIsAGeneric500` |
| A violation names the member without echoing its value; validation answers 400 | `TestInvalidBodyNamesTheMemberWithoutItsValue` |
| A malformed body is a problem | `TestMalformedBodyIsAProblem` |
| A module's validation failure names the parameter at fault under its own code, and the failure it was made from stays without it | `TestFailureNamesItsParameter` |
| A module uses only the modules ARCHITECTURE.md allows, and only their root package | `TestModuleBoundaries` (`internal/boundaries_test.go`) |
| Generated queries match `queries.sql`; modules are tidy | CI: `go tool sqlc diff`, `go mod tidy -diff` |
| Lint and reachable vulnerabilities | CI: golangci-lint, govulncheck |
| An event reaches every listener once the change commits; a change that rolls back writes no job and no listener hears it | `internal/platform` `TestEvents` |
| A failure answers `detail` in the language `Accept-Language` asks for: Vietnamese, English, an English variant, quality values, Vietnamese for an unknown or unreadable header or none; an unknown route, a panic and a malformed body likewise; every problem carries `Content-Language` and `Vary: Accept-Language` | `internal/platform` `TestProblemsAnswerInTheRequestsLanguage` |
| A violation is huma's sentence in English and its Vietnamese otherwise, with huma's values kept; a sentence no template matches answers the generic one; no template uses a value huma does not give | `TestViolationsAreTranslated`, `TestViolationDetail`, `TestViolationWordsKeepHumasValues` |
| A failure cannot be declared without its words in both languages; every platform code has words | `TestAFailureNeedsItsWordsInEveryLanguage`, `TestEveryPlatformCodeHasWords` |
