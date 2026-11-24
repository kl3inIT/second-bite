# SEC-209 — The admin shift report: a tab per day, three shifts and a day summary, and an Excel export: design

Tracked in Linear as SEC-209. Asked for on 24 November 2026 by the person who runs the web, after the pilot's days were reported by hand in a workbook: a sheet of totals and one sheet per day, each with every order and its buyer. The page gives admins that report on screen and exports the same workbook. It reads what the report of [SEC-80](../../completed/sec-80-prototype-numbers/design.md) reads (posts and orders) and adds the buyers and the shifts.

## 1. What an admin can do

- Open **Báo cáo theo ca** under People in the admin menu, pick a range of days (1 to 31, today and the past) and, if wanted, one store. The page shows **one tab per day** of the range; nothing is scrolled through to reach another day.
- In a day's tab, from the top: the **day summary** (per shift and for the whole day: stores, portions posted, portions collected, portions not collected), then **one table per shift** listing every order whose pickup window starts in the shift, with its buyer: number, store, customer, phone, dishes, portions, time ordered, pickup window, status. A shift with no order says it has none.
- The shifts are three by default: **Ca sáng 06:00–12:00**, **Ca chiều 12:00–18:00**, **Ca tối 18:00–24:00**. A button on each shift opens a form to **rename the shifts and change their hours** (one to six shifts). The choice is kept in the admin's browser and sent with every request; the server keeps nothing about it.
- **Xuất Excel** downloads the range as a workbook: a sheet **Tổng hợp** and one sheet per day, with the same shifts, tables and numbers as the screen.

## 2. Rules

- **Days and hours are Vietnam's** (UTC+7), as in the report of SEC-80. A range holds at most 31 days and may not end after today.
- **A shift is a half-open span of the day**, `HH:MM` to `HH:MM`, from `00:00` to `24:00`; its end is after its start. Shifts are listed in order and do not overlap; gaps are allowed. A name is 1 to 40 characters.
- **An order and a post belong to the shift holding the start of its pickup window.** It is the key the admin's orders list filters by and the report of SEC-80 counts by, so the numbers agree with those pages. An order or a post outside every shift is in no shift table and is counted in the day.
- **The numbers**, for a shift, and for the day (every order and post of the day, whatever the shifts):
  - *Stores*: the distinct stores with a post or an order in it.
  - *Portions posted*: the units of the offers posted for it, whatever became of them (as SEC-80).
  - *Portions collected*: the units of its orders handed over.
  - *Portions not collected*: the units of its orders the store refused or whose window ended without a hand-over. An order cancelled by its customer is in neither; one still open is in neither.
- **A buyer is the contact copied on the order** (name and phone); an order whose contact was forgotten shows them empty. Admins already read this on the orders list (SEC-135); the page adds no new reader and no new data.
- **The workbook is built from the same answer as the screen**, so the two never disagree.

**Not chosen:**

- *Shifts kept on the server for everyone*: it needs a table, a screen of its own and an audit for a setting only this report reads. Kept in the browser, two admins may see different shifts; the export carries the shifts it was asked with and names them in its sheets.
- *Cutting by the time the order was placed*: it disagrees with the posts, which have only their window, so the "stores" and "portions posted" of a shift could not be given.
- *Building the workbook in the browser*: a spreadsheet library in every admin's bundle, and a second place that knows the rules.
- *CSV*: the pilot's report is a workbook with several sheets; one CSV cannot hold it.

## 3. Interface

| Operation | Who | Answer |
| --- | --- | --- |
| `GET /admin/shift-reports?since&until&sellerId&shift…` | An admin | The days of the range, each with its summary and its shifts with their orders |
| `GET /admin/shift-reports/export?…` (the same query) | An admin | The workbook (`application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`), named `bao-cao-theo-ca-<since>-den-<until>.xlsx` |

`since` and `until` are `YYYY-MM-DD`; each `shift` is `HH:MM-HH:MM,Name` and the parameter repeats, in order; without any, the three defaults apply. Failures: `REPORT_RANGE_INVALID` (400, as SEC-80, here with at most 31 days) and `REPORT_SHIFTS_INVALID` (400, new): a count, a name, an hour, an order or an overlap that breaks section 2.

The answer: for each day, `day`, `summary` (the whole day), and `shifts[]` of `{name, start, end, summary, orders[]}`; `summary` is `{stores, unitsPosted, unitsCollected, unitsNotCollected, orders}`; an order is `{number, store, customer, phone, dishes, units, orderedAt, windowStart, windowEnd, status}`.

## 4. The workbook

- **Tổng hợp**: the title with the range, then a table with a row per day and per shift (day, shift, hours, stores, posted, collected, not collected) and a total row.
- **Ngày dd-mm**: one sheet per day, with its title, the summary table, and a block per shift (the shift's name and hours, its numbers and its orders table). Widths are set, header rows are bold, numbers are numbers, times are text as shown, phone numbers are text (a leading zero stays), and **every text from a person or a store is written as text, never as a formula** (a name starting with `=`, `+`, `-` or `@` cannot run in a spreadsheet; OWASP's formula injection), as the CSV of SEC-80 already does.
- Sheet names stay within Excel's 31 characters and avoid its forbidden ones; the file is built in memory (31 days of a pilot's orders are small) and never written to disk.

## 5. Data

No migration. The offers module answers the posts of a range with their windows (one new query); the orders module answers the orders of a range with their lines (the admin list's query, read whole); the stats module cuts, sums and writes. Nothing new is stored: the buyers' name and phone are read from the orders when asked and never logged.

## 6. Failure behavior

A range or a shift that breaks the rules is refused before anything is read. A range without orders yields tables that say so and an export with empty tables, not an error. The export is a download, so it does not paginate.

## Verification plan

- **Go (`TestService`, run by CI):** an order and a post fall in the shift of their window's start in Vietnam's time, including at the edges (11:59, 12:00, 23:59); one outside every shift is in the day only; the numbers (stores, posted, collected, not collected) over seeded orders in every status; shift validation (count, names, overlap, order, end after start, `24:00`); the range limits; the workbook opens with the sheets named as above, its figures equal the answer's, a name starting with `=` is a string cell, a phone keeps its leading zero.
- **Web:** Playwright with axe on the page at 390 and 1440, against the stub backend: the tabs, the tables, the settings form, the download link; run by CI.
- **Against the real service:** the pilot's days 22 to 24 November exported and compared with the workbook made by hand.

## Open questions

- Whether *portions not collected* should include the orders customers cancelled; answered by the sponsor's team when they read the first export. Until then they are left out, as above.
