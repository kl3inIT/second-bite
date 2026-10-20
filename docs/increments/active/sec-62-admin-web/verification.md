# SEC-62 — The admin web: verification

Checked on 21 October 2026 on the increment's branch (head `f33c974` before this file), on a Windows workstation.

## Web

- `pnpm check` (tokens, messages, API client, oxlint, Prettier, `tsc`, Vitest, knip): passes. Vitest: 43 files, 254 tests. Screens without a backend are rendered with sample data in Vitest only (`renderToStaticMarkup`); running code holds none.
- `pnpm test:e2e`, the production build against the stub backend, desktop and phone (Pixel 7), with the axe check on every state: 163 passed, 0 failed, 73 skipped, twice. The skipped tests are those of the 22 pages that show "Sắp ra mắt" (they run again when a page is released) and the tests meant for one screen width only.
- Runs with many workers on the busy workstation lost some stub connections (`ECONNRESET`) and timed out navigations; the same tests passed alone and with two workers. CI runs them on its own.
- Someone signed in who is not an admin gets HTTP 404 on `/{locale}/admin/**` (checked in `admin-shell.spec.ts`); admin pages answer `X-Robots-Tag: noindex, nofollow`.

## Backend

- `GET /admin/summary`: `golangci-lint` (0 issues), `sqlc diff`, `go mod tidy -diff`, `govulncheck`, the three module summary tests on PostgreSQL, the boundary and contract checks: pass.
- The full `go test ./...` failed here only in email-sending checks of `TestService` (Mailpit answered 503 under the workstation's 3.8 GB Docker limit); the same failures occur on the commit before this increment. CI is the reference.
- The mobile API client was regenerated with Flutter 3.47.7 as CI does it; the app gains no screen.

## Not verified

- A visual pass against Figma in a real browser for every screen: the agents compared their screens with Figma exports; a pass in the browser is still to be done before release.
- The 14-day trend of the store cards (no status history in `seller` yet).
