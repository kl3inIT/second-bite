# The posts' portions, the report's products, impact, analysis and export: plan

Design: [design.md](design.md). Not yet tracked in Linear.

| # | Step | State |
| --- | --- | --- |
| 1 | Design and plan | Done, 22 November 2026 |
| 2 | Web: the report's products block, the chart's "Sản phẩm" tab, the stores' new columns and the copied message's products line | Done, 22 November 2026 |
| 3 | Web: the analysis from the report and the reviews (funnel, averages per order, ratings) | Done, 22 November 2026 |
| 4 | Web: the export dialog and the print page | Done, 22 November 2026 |
| 5 | `order` and `offer`: `GET /admin/offer-units`; web: the posts page's "Sản phẩm" box | Done, 22 November 2026 |
| 6 | `order`, `offer`, `stats`: the collected orders' worth, discounts and grams, the CSV's impact columns; web: the impact block | Done, 22 November 2026 |
| 7 | `order`, `offer`, `stats`: `GET /admin/reports/analysis`; web: the analysis in four groups | Done, 22 November 2026 |
| 8 | `stats`: `GET /admin/reports/workbook` on excelize; web: "Excel" in the export dialog | Done, 22 November 2026 |
| 9 | Tests: Go unit and PostgreSQL tests, the API test, the stub backend, `admin-offers.spec.ts`, `admin-reports.spec.ts` | Written, 22 November 2026; `pnpm check`, golangci-lint, govulncheck and the Go unit tests pass locally; the PostgreSQL and browser tests run on CI |
| 10 | Pull request, CI, staging, then move this increment to `completed/` | To do |
