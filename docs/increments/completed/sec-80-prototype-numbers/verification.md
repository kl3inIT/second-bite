# SEC-80 — The prototype's numbers: verification

Run on 22 October 2026 on Windows 11, then on staging (`secondbite.vadan.app`).

## Checks

| Part | Outcome |
| --- | --- |
| Backend | `golangci-lint` 0 issues; every package's tests pass, among them `TestStats`, `TestReportCSV`, `TestReportCSVOfOneStore`, `TestSafe`, `TestModuleBoundaries` and `TestService` › the report counts a store's views, posts and orders; the contract regenerated (`api/openapi.yaml`) with the web's and the app's clients |
| Web | `pnpm check` green, among them `viewOf`; Playwright `admin-reports` (with axe) and `count-view` on Pixel 7 and Desktop Chrome |
| CI | Pull requests #127, #132, #134 and #137 green before merging |

## Against the real service

- **The visitor's address:** two different source addresses through the proxy gave two different visitor keys, so the real address reaches the server.
- **The report on staging:** the cards, the bars and the table read the real orders (24 held, 10 units collected, 42%); Xuất CSV downloads `bao-cao-<since>-den-<until>.csv`; at 1440 px a long store name is whole and no column head is cut in Vietnamese or English.
- **The poster:** poster v2 (SEC-81) decodes to `https://secondbite.vadan.app/vi?utm_source=qr`.
- **From a phone and from Zalo,** by the owner on 22 October 2026: pages opened, an order held and collected, and the report's numbers matched the orders list.
