# SEC-126 — Account deletion, the low-risk follow-ups: verification

Run on 22 October 2026 on Windows 11, on the branch before review.

## Checks

| Part | Outcome |
| --- | --- |
| Backend | `golangci-lint` 0 issues; every package's tests pass; `go mod tidy -diff` and `sqlc diff` clean; the contract unchanged |
| New and changed tests | `TestEvents` › reaches every listener again once the delay has passed; `TestDeleteAccount` (two jobs, about 120 s apart); `TestLimitWait` (three deletion codes against ten sign-in codes); `TestDeletedAccountIsForgotten` (a store opened after a delivery is blocked by the next); `TestForgetUploaderFailsPartWay`; `TestService` › an owner deletes their account (the sign-in code survives a deletion code, a fourth deletion code is refused) |
| The tests catch the bugs | Without the second delivery, `TestDeleteAccount` fails (one job). With deletion codes allowed ten an hour, `TestService`'s deletion flow fails |

## Against the real service

The server was built from the branch and run on its own PostGIS and Mailpit. Requests went through the HTTP API, and the database was read with `psql`.

- **Deletion codes and sign-in codes are kept apart (3):**
  - A sign-in code was asked, then a deletion code. Signing in with the sign-in code answered 201. Before, the deletion code ended it, and signing in answered 410.
  - Deletion codes 2 and 3 were sent. The fourth answered 429 `IDENTITY_CODE_LIMIT_EXCEEDED` with `Retry-After: 3240`.
  - A sign-in code asked right after that refusal was sent (202).
- **The index (2):** `notification_emails_recipient` exists on `lower(recipient)`. With sequential scans off, the `ForgetRecipient` delete plans a bitmap index scan on it. On a table this small, PostgreSQL otherwise prefers a sequential scan.
- **The second delivery (1):**
  - The owner opened a store and deleted the account. River held six jobs: `file.forget_uploader`, `order.forget_account` and `seller.forget_account` at +0 s, all completed, and the same three scheduled at +120 s.
  - The store was blocked by the first delivery.
  - A late write was simulated by inserting, after the first delivery, a second store owned by the deleted account, as a request already past authentication would. It stood `active` with one membership of the deleted account.
  - At +120 s the three jobs completed. The late store was blocked with "Chủ cửa hàng đã xoá tài khoản", and no membership of the account was left.
