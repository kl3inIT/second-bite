# The report's three numbers

Status: delivered on 31 October 2026, on production the same day (PR #197). Tracked in Linear as SEC-192. It changes the admin's report of [SEC-80](../../completed/sec-80-prototype-numbers/design.md), owned by `stats` ([spec](../../../specs/stats.md)).

## What an admin can do

An admin opens the admin and lands on yesterday's report. The first row holds the three numbers the sponsor asked for each day on 31 October 2026: new users, transactions and website visitors. Each shows its change against the period before of the same length, such as "+2 so với hôm trước". "Hôm qua", "7 ngày" and "30 ngày" choose the days in one tap. "Sao chép báo cáo" copies the three numbers as a short message to paste in a chat.

## Decisions

- **New users** are counted in two ways, chosen by the user on 31 October 2026. The figure is the accounts created in the range, with the total of accounts at its end. Its note gives the customers whose first order falls in the range. A customer orders with a name and a phone number and no account, so accounts alone would miss most of the people who use the site. A customer is told apart by phone number, and is counted on the collection day of their first order, as orders are. An order whose contact was forgotten (SEC-165) counts for nobody, and a deleted account is counted on no day.
- **New users belong to no store.** They are the site's whatever store is chosen, marked "toàn trang", and none of a store's rows has them.
- **The period before** is read by the page as a second report, of the same length and store, ending the day before the range starts. The API gains no comparison of its own.
- **Page views** become a note under the visitors, the better number to report. The five cards of SEC-80 become three first and four under them: units collected, the share collected, no-shows, and what was taken at the counter.
- **The chart** keeps its bars and gains two tabs: visitors, and new accounts with first-time customers.
- **The admin's home** opens the report on yesterday until the overview of SEC-62 exists. It used to open the stores.
- **Where:** in the report page, not a page of its own. The report already holds the days, the store filter and the CSV, so the numbers of a day stay in one place.

The user approved an HTML preview drawn over the running report; it is kept outside the repository.

## Contract

`GET /admin/reports` gains `accounts`, and in every `counts` `newAccounts` and `newCustomers`. The CSV gains "Tài khoản mới" and "Khách đặt lần đầu", filled on the whole site's rows and the totals. `stats` asks `identity.AccountDays` and `order.FirstOrderDays`; ARCHITECTURE.md gains the edge `stats` → `identity`.

## Verification

- `TestOrder` › the report counts first orders.
- `TestService` › the report counts a store's views, posts and orders, now with the site's new users.
- `report-numbers.test.ts` for the presets, the period before and the signed change.
- `admin-reports.spec.ts` for the cards and their changes, the chart's tabs, the admin's home on yesterday, the presets and the copied message.
