# Deleting a store softly: plan

Design: [design.md](design.md). Tracked in Linear as SEC-187, on the branch `phamnhatanh811/sec-187-seller-soft-delete`.

| # | Step | Checks | State |
| --- | --- | --- | --- |
| 1 | Design and plan | Read against the `seller` and `order` specs | Done, 31 October 2026 |
| 2 | `seller`: the `deleted` status and the wait (migration 0043), delete and restore, the owner's email, the trail; `order.finish_seller_deletions` | `TestAdmin`, `TestStatusEmail`, `TestOrder` (need Docker), golangci-lint, `sqlc diff` | Written; lint, vet, `sqlc diff` and the email test pass; the PostgreSQL tests are left to CI (no Docker running here) |
| 3 | The contract, the web SDK; the mobile client generated again | `TestOpenAPIDocumentIsCurrent`, `pnpm check:api`, the mobile check of generated code | Contract and web done; mobile client not yet generated (no Flutter on this machine) |
| 4 | The admin web: "Xóa cửa hàng" and "Khôi phục" in a store's menu, "Chờ xóa" and "Đã xóa", the "Đã xóa" button; the stub answers both actions | `pnpm check`, `admin-sellers.spec.ts` | Done locally against the stub; the browser tests are left to CI |
| 5 | The specs: `seller`, `order`, `audit` | Read against the code | Done, 31 October 2026 |
