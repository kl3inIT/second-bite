# SEC-134 — Every store's posts for admins: plan

Design: [design.md](design.md). Tracked in Linear as SEC-134, on the branch `phamnhatanh811/sec-134-admin-posts-orders` with SEC-135, one commit per step.

| # | Step | Checks | State |
| --- | --- | --- | --- |
| 1 | Design and plan | Read against Figma AD-BD1 to AD-BD4 and the stores' screens | Done, 22 October 2026 |
| 2 | `GET /admin/offers` with its index and test; the contract, the web SDK and the mobile client generated again | `TestOffer` (CI: Docker on this machine is rootless), `TestOpenAPIDocumentIsCurrent`, `pnpm check:api`, the mobile check | Done, 22 October 2026 |
| 3 | The list and the panel on the web, the menu entry, the stub and the browser tests | `pnpm check`; `admin-offers.spec.ts` with axe on CI | Done, 22 October 2026 |
