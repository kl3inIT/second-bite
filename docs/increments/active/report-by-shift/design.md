# The report by day and shift for the sponsor, with every order's customer

Status: in review, 24 November 2026. GitHub issue [#261](https://github.com/kl3inIT/second-bite/issues/261), with the owner's additions of 24 November 2026, which take precedence over it. Linear issue: none yet (workers have no Linear access).

## Why

Tasco, the Tasco Mall pilot's sponsor, asks after each pilot day for a report by shift with every order's customer. On 22 and 24 November 2026 the owner built it by hand from the production database (`second-bite-bao-cao-22-11-2026.xlsx`, `second-bite-bao-cao-22-24-11-2026.xlsx`). The admin report's Excel workbook (report-products-export increment) is aggregate only: no shift and no order with who collected it. The figures sent for 22–24 November: 76 portions posted, 76 collected, 60 through the app and 16 handed out at the counter.

## What a person can do

- **An admin**, on Báo cáo › "Xuất báo cáo", chooses "Theo ca (gửi nhà tài trợ)" beside PDF, Excel and CSV, for the report's days, store and part of the day, and downloads `bao-cao-theo-ca-<since>-den-<until>.xlsx`.
- **An admin** sees each download in Nhật ký thao tác as "Tải báo cáo theo ca có khách", with its days and how many orders it listed; never the customers.
- A customer, a store's owner or staff are refused (`PLATFORM_ADMIN_REQUIRED`), as for every admin operation.

## The workbook

- **Tổng hợp**, first: one row per day and shift (store count, then the five portion columns below), a "Cả ngày" row per day, "Tổng" for the range; the people who collected an order on the app (distinct phone numbers of collected orders) and the portions handed out at the counter; then every order on the app: STT, day, shift, SB-number, store, customer's name and phone, dish, quantity, when ordered, pickup window, status, who confirmed the collection ("Quán giao" or "Khách xác nhận", since #258).
- **Ngày DD-MM**, one per day of the range: the day's shifts and "Cả ngày"; per shift, a table by store and dish with "Tổng ca", and the customers who ordered on the app. A day with nothing says so.
- **The columns** (owner's addition 1), per offer, then added up:
  - "Suất đăng": its units posted.
  - "Trong đó đặt qua app": the units of its orders on the app that were collected.
  - "Phát trực tiếp tại quầy": its units posted that no order on the app, other than a cancelled one, holds (never below 0). The pilot's stores hand them out at the counter.
  - "Đã nhận": the two above together.
  - "Không nhận": the units of its orders on the app that expired or were refused, so the figure stays honest if that happens.
  - The units of an order still open (today) are in none but "Suất đăng".
- **The shift** is told by the window's start in Vietnam: before 17:00 "Ca chiều", from 17:00 "Ca tối"; a shift's hours are the earliest start and the latest end of its windows.
- Cancelled orders are left out everywhere. Figures are numbers; names, phones, days and times are text in Vietnam's time, never formulas; as the report-products-export workbook (excelize).

## Decisions

1. **A separate operation, `GET /admin/reports/shifts`** (`exportShiftWorkbook`), not a mode of `exportReportWorkbook`: it is the one export that holds personal data and is audited, so its contract, its tests and its audit stay apart, and the aggregate workbook stays as it is. It takes the same query (`since`, `until`, `sellerId`, `timeFrom`, `timeUntil`).
2. **A fourth choice in the export dialog**, not a separate button: the dialog already chooses among the files of the same days and store; a 2×2 grid holds the four.
3. **Audited** (coordinator's decision of 24 November 2026): the existing exports write nothing to the audit trail; this one names every customer, so `order.OrdersWithCustomers` records `report.export_customers` (resource `report`, `<since>..<until>`; details since, until, sellerId, orders; no customer) in the transaction that reads the orders. If recording fails, no file is written.
4. **The orders are read by `order`**, which owns the customers' contacts and already records admin actions in the audit; `stats` builds the workbook from them and `offer.PostsBetween`, which now answers each offer's window. No new module edge.
5. **No test store is left out** (coordinator's decision of 24 November 2026): the issue said a test store "Ví dụ" is left out "as the other reports do", but no report leaves any store out and stores have no test flag. The export reads every store, or the one chosen, as the other reports. Hiding a test store would be a separate change (a seller flag) for the owner to decide.

## Verification plan

- Go unit tests (`server/internal/stats/shift_workbook_test.go`): the shift split at 17:00 in Vietnam, the five columns with counter portions, a post nobody ordered being all counter, cancelled orders left out, an open order, a day without posts, the totals and the people; the workbook opened with excelize: sheet names, header, rows and cell types.
- HTTP-boundary test against PostgreSQL (`server/cmd/secondbite/report_test.go` › `checkShiftWorkbook`): a customer and a store's owner refused without an audit event; the admin's download is an XLSX with "Tổng hợp" and the day's sheet, its figures, and one `report.export_customers` event with its details.
- Playwright: the dialog's choice and its download (`admin-reports.spec.ts`), the audit log's row (`admin-audit.spec.ts`).
- After the merge, on staging then production: the export of 22–24 November 2026 matches the figures sent (76 posted, 76 collected, 60 through the app, 16 at the counter).
