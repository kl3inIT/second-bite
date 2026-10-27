# SEC-135 — Every order for admins, and an order's page: plan

Design: [design.md](design.md). Tracked in Linear as SEC-135, on the branch `phamnhatanh811/sec-134-admin-posts-orders` with SEC-134.

| # | Step | Checks | State |
| --- | --- | --- | --- |
| 1 | Design and plan | Read against Figma AD-DH1 to AD-DH5, the research of 21 October and the posts' list | Done, 22 October 2026 |
| 2 | `GET /admin/orders` with `order_fold`, `search_text`, the window's index and the test; the contract and the web SDK generated again | `TestOrder` (CI: Docker on this machine is rootless), `golangci-lint`, `TestOpenAPIDocumentIsCurrent`, `pnpm check:api` | Done, 22 October 2026 |
| 3 | The list and an order's page on the web, the menu entry, the stub and the browser tests | `pnpm check`; `admin-orders.spec.ts` with axe on CI | Done, 22 October 2026 |
| 4 | The mobile client generated again from the contract | The mobile check | To do: the lead, with Docker |
