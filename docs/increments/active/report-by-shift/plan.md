# The report by day and shift for the sponsor: plan

The [design](design.md) holds the decisions. One pull request.

| Step | What | State |
| --- | --- | --- |
| 1 | `offer.PostsBetween` answers the window; `order.OrdersWithCustomers` with the audit action `report.export_customers`; `stats`: the report by shift, its workbook and `GET /admin/reports/shifts`; unit and HTTP-boundary tests; the contract | Done |
| 2 | Clients generated again (web, app) | Done |
| 3 | Web: "Theo ca (gửi nhà tài trợ)" in the export dialog; the audit log's action; messages; stub and Playwright tests | Done |
| 4 | Specs of `stats`, `order`, `offer`, `audit`; the roadmap | Done |
| 5 | After the merge: the export of 22–24 November 2026 on production against the figures sent to Tasco (76 posted, 76 collected: 60 app, 16 counter) | To do |
