# SEC-75 — Admin foundation: plan

Design: [design.md](design.md). Research: [admin foundation](../../../research/2026-10-21-admin-foundation.md). Tracked in Linear as SEC-75, on the branch `dathip04/sec-75-admin-foundation`, one commit per step, merged through a pull request once its checks pass.

| # | Step | Checks before the next step | State |
| --- | --- | --- | --- |
| 1 | Design and plan | Read by the tech lead | Done, 21 October 2026 |
| 2 | **Authorization net.** The `/admin` group built in `cmd/secondbite`; each module's admin operations registered on it; email settings check the admin in the service, with a system path for the command line; the contract test over every `/admin` operation (401, 403) | `go test ./...`, the contract unchanged (`api/openapi.yaml` diff only in tags, if any) | Done, 21 October 2026: the contract changed only the email settings' tag, `Admins` to `Admin`, so the app's `AdminsClient` folds into `AdminClient` |
| 3 | **Audit module.** Migration `0014`, `internal/audit` with the catalog, `Record`, `ForgetAccount`; `platform.Caller` gains `Label`; identity calls `ForgetAccount` in the deletion's transaction; the boundary list in ARCHITECTURE.md | Catalog test, `Record` and `ForgetAccount` against PostgreSQL, the boundary test | |
| 4 | **Settings audited.** Offer and email settings record their change and take `If-Match`; the contract test checks one audit row per change | The contract test with its table of calls | |
| 5 | **Admins.** `secondbite admin revoke`; `GET /admin/admins`, `grant-admin`, `revoke-admin`; self and last-admin refusals under the lock; grant and revoke audited | Concurrent revokes, the revoked admin refused on the next request | |
| 6 | **A store's states.** Migration `0015` (`rejected`, `status_reason`); conditional `approve`, `reject`, `block` with their 409; audit; `StatusChangedEvent` and the owner's email; the admin list with statuses, `q`, pages and total | Every transition from every state, the list's filters and total, the email queued | |
| 7 | **Web base.** `role` in the current account, `requireAccount`, `requireRole`; `nuqs`, TanStack Table, TanStack Form and zod; the admin layout, sidebar, not-found, error, coming soon; `DataTable`, `AdminPageHeader`, `ConfirmDialog`, `ReasonDialog`, `useNotify` | `pnpm check`; the guard's statuses (404, 307) in Playwright | |
| 8 | **Web screens.** Row 1 (stores and their actions), row 2 (a store's detail), row 3 (settings), row 4 (the shared states), from Figma | `pnpm check`, `pnpm test:e2e` with axe on every page | |
| 9 | **Documents.** Conventions *Admin*, the backend and web guidelines, specs (`seller`, `identity`, new `audit`), test matrices, ARCHITECTURE.md; a verification note | Read against the code | |
| 10 | Review, merge through a pull request, move this increment to `completed/` | | |

Steps 2 to 6 change no screen and land before SEC-64 needs the states. Reviewing pull requests 25 and 26 (ordering, for the 23 October prototype) goes before step 2.
