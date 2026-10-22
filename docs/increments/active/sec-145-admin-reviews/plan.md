# SEC-145 — Every review for admins, hidden and shown again: plan

Design: [design.md](design.md). Tracked in Linear as SEC-145, on the branch `phamnhatanh811/sec-145-admin-reviews`, one commit per step.

| # | Step | Checks | State |
| --- | --- | --- | --- |
| 1 | Design and plan | Read against Figma AD-DG1 to AD-DG3 and the orders' list | Done, 22 October 2026 |
| 2 | The migration, the queries, `ListReviewsForAdmins`, `HideReview`, `ShowReview`, `canReview`, the audit's `review.hide` and `review.show`; the contract and the web SDK generated again | `go build`, `go vet`, `TestOpenAPIDocumentIsCurrent`, `TestOrder`, `TestAudit`, the migrations, `pnpm check:api` | Done, 22 October 2026 |
| 3 | The web: the list, its cards and filters, the row's menu with hide and show, the menu entry, the log's names, the customer's form on `canReview`, the stub and the browser test | `pnpm check`; `admin-reviews.spec.ts` with axe on CI | To do |
| 4 | Documents: `docs/specs/order.md`, `docs/tests/order.md`, `ARCHITECTURE.md` | Read against the code | To do |
| 5 | The mobile client generated again from the contract | The mobile check | To do: whoever has Flutter |
