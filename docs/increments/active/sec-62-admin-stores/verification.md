# SEC-62 — The admin's list of stores: verification

Run on 21 October 2026 on a Windows machine, against the stub backend; the Go service was not run for the screen.

| What | Command | Observed |
| --- | --- | --- |
| The contract carries the item's fields | `go test ./cmd/secondbite -run TestOpenAPIDocumentIsCurrent` after `-update` | Passes; `AdminSellerBody` gains `id`, `name`, `address`, `latitude`, `longitude`, `phone`, `status`, `statusReason`, `statusChangedAt`, `createdAt`, `updatedAt`, `photoId` |
| The web checks | `pnpm check` | Tokens, catalogs (917 keys), API client, Oxlint, Prettier, types, 89 unit tests and knip pass |
| The stub's list and actions | `curl` against `STUB_BACKEND_PORT=3290` | 27 stores, counts 23 active, 1 pending, 1 rejected, 2 blocked; a short reason answers 400 `SELLER_REASON_INVALID`; approving an active store answers 409 `SELLER_STATUS_CHANGE_NOT_ALLOWED` |
| The pages in a phone and a desktop browser | `playwright test admin-sellers admin-audit admin-shell` | 23 passed, 1 skipped (an existing test of the shell); every page and the block dialog without a serious axe violation. Ports 3100 and 3190 were held by another project here, so the run used a copy of the config on 3101 and 3291 |
| The screen against Figma | Screenshots at 1440 and 390 wide | AD-Q1's cards, filter bar, table and footer; the block dialog as AD-Q5 (480 wide, the reason with its 10 to 500 characters counted, the solid red action) |

| The range and the days (step 6) | `go test ./internal/seller/ ./migrations/`; `go test ./cmd/secondbite -run 'TestService/while_running/a_seller_is_opened_active|TestAdmin|TestOpenAPI'`; `pnpm check`; the six admin browser test files | Pass; 53 browser tests passed, 1 skipped by design. The whole `TestService` fails 6 to 8 cases on this machine with `NOTIFICATION_EMAIL_UNAVAILABLE` after 10 s, on a clean `main` as well, so the email container here, not this change |
| Q5 to Q11 and QD1 to QD4 (step 8) | Screenshots at 1440 of each frame's state beside Figma; `pnpm check`; `playwright test admin-sellers admin-accounts` | The dialogs, menus, notices and filtered lists match their frames; the posts tab, its table, its panel and the members tab match AD-QD1 to AD-QD4; 30 browser tests passed |

Not verified: the mobile client generated again, since this machine has no Flutter (plan step 2).
