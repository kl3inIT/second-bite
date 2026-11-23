# A customer confirms they collected their order: plan

The [design](design.md) holds the decisions. One pull request.

| Step | What | State |
| --- | --- | --- |
| 1 | Server: migration 0051 `collected_by`, the shared collect step, `collectOrder`, the hand-over answering a collected order as it is, `collectedBy` in `OrderBody`, `collectedByCustomer` in the report; the HTTP-boundary and module checks | Done |
| 2 | Clients generated again: web (`pnpm generate:api`) and app (`swagger_parser`, `build_runner`) | Done |
| 3 | Web: "Đã nhận món" with its confirmation on the customer's order page; who confirmed on the store's list and order page, the admins' list and order page, the report's funnel; messages in both languages; the stub and Playwright tests | Done |
| 4 | App: "Đã nhận món" with its sheet on the order page; strings in both catalogs; widget test | Done |
| 5 | Specs and test matrices of `order` and `stats`; the roadmap | Done |
| 6 | Staging after the merge: a customer confirms an order of a store that did not press Đã giao | To do |
