# SEC-154 — The store's reviews for its sellers: plan

Design: [design.md](design.md). Tracked in Linear as SEC-154, on the branch `nhudinhnhat2004/sec-154-seller-reviews`, one commit per step.

| # | Step | Checks | State |
| --- | --- | --- | --- |
| 1 | Design and plan | Read against Figma `Q1b-3` to `Q1b-5` and the admins' list | Done, 26 October 2026 |
| 2 | The query for a dish's name, `ListReviewsOfSeller`, the operation, the contract and the web SDK generated again | `go build`, `go vet`, `TestOpenAPIDocumentIsCurrent`, `TestOrder` on CI, `pnpm check:api` | To do |
| 3 | The web: the card on the home, the page, the filter, the messages | `pnpm check`; the browser test with axe on CI | To do |
| 4 | Documents: `docs/specs/order.md`, `docs/tests/order.md`, `ARCHITECTURE.md` | Read against the code | To do |
| 5 | The mobile client generated again from the contract | The mobile check | To do: whoever has Flutter |
