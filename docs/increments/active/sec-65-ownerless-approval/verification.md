# SEC-65 — An owner-less seller cannot be approved: verification

Run on 22 October 2026 on Windows 11, on the branch before review.

## Checks

| Part | Outcome |
| --- | --- |
| Backend | `golangci-lint` 0 issues; every package's tests pass, among them `TestAdmin` › every action from every status › approve an owner-less blocked, pending and rejected seller, and `TestService` › an owner deletes their account; the others forget it; `go mod tidy -diff` and `sqlc diff` clean; the contract rewritten (`api/openapi.yaml`, the approve operation's summary) and the web's client generated from it |
| The tests catch the bug | With the owner check switched off, the three new `TestAdmin` cases and the `TestService` deletion check fail |

`govulncheck` reports GO-2026-6809 in `crypto/x509` of Go 1.27.2, fixed in 1.27.3. It comes from the Go version in `server/go.mod`, not from this change.

## Against the real service

The server was built from the branch and run on its own PostGIS and Mailpit. The admin web ran from its production build in Chromium at 1440 × 900.

- **API:**
  - An owner opened a store and deleted their account with the emailed code. The listener blocked the store with the reason "Chủ cửa hàng đã xoá tài khoản", naming no one; no owner was left.
  - The admin's approve answered 409 `SELLER_OWNERLESS`, "Cửa hàng không còn chủ vì chủ đã xoá tài khoản, nên không duyệt lại được." In English: "The seller has no owner, since its owner deleted their account, so it cannot be approved."
  - The store stayed blocked, and no audit event was recorded for it.
- **Admin web:**
  - "Gỡ chặn" on the owner-less store showed the server's sentence in the error toast, and the store stayed "Bị chặn".
  - A control store, with an owner and blocked by the admin, was unblocked as before: "Đã gỡ chặn …", then "Đang hoạt động".
