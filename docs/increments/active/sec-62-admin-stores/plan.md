# SEC-62 — The admin's list of stores: plan

Design: [design.md](design.md). Tracked in Linear as SEC-62, on the branch `phamnhatanh811/sec-62-admin-stores`, one commit per step.

| # | Step | Checks | State |
| --- | --- | --- | --- |
| 1 | Design and plan | Read against Figma AD-Q1, AD-Q2, AD-Q8, AD-DS4 and SEC-75 | Done, 21 October 2026 |
| 2 | `AdminSellerBody` lists its own fields; the contract, the web SDK and the mobile client generated again | `TestOpenAPIDocumentIsCurrent`, `pnpm check:api`, the mobile check of generated code | Contract and web done; mobile client not yet generated (no Flutter on this machine) |
| 3 | The stub answers `/admin/sellers` and its three actions | Through the browser tests of step 4 | Done, 21 October 2026 |
| 4 | The list (AD-Q1): cards, search, sort, page size, pages, states; the menu entry and its group; block, unblock, approve, reject from a row's menu | `pnpm check`, `pnpm test:e2e` with axe | Done, 21 October 2026: the admin's home now opens the stores, as SEC-75 planned, so the log's test opens `/admin/audit` itself; `SortHeader` is taken from `dathip04/sec-75-admin-accounts` as written |
| 5 | Documents: ARCHITECTURE.md, a [verification note](verification.md) | Read against the code | Done, 21 October 2026 |
| 6 | The cards' 14-day lines (`seller_status_days`, `days` in the list) and the "Sửa đổi" range (`changedSince`, `changedUntil`); the top bar's button folds the sidebar, the folded sidebar keeps the bitten "o" | `TestAdmin`, `pnpm check`, the admin browser tests with axe | Done, 21 October 2026 |
| 7 | A store's page (AD-Q3, AD-Q4): cover, header and its action, the three tabs; "Xem chi tiết" and the name in the list; the "Khu vực" filter drawn with the provinces of provinces.open-api.vn, not yet sent | `pnpm check`, the admin browser tests with axe (57 passed) | Done, 21 October 2026 |
| 8 | AD-Q5 to AD-Q11 against the running page: the reason dialogs count their characters, the confirmations ask their question alone; a store's number grouped; the posts tab by status, as boxes or a table, with a post's panel, and the members tab (AD-QD1 to AD-QD4) | `pnpm check`, `playwright test admin-sellers admin-accounts` with axe (30 passed) | Done, 21 October 2026 |
