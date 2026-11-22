# The posts' portions, the report's products, impact, analysis and export

Status: started on 22 November 2026. Not yet tracked in Linear; the issue is opened when the user asks. It changes the admins' posts page of [SEC-134](../../completed/sec-134-admin-posts/design.md) and the admin's report of [SEC-80](../../completed/sec-80-prototype-numbers/design.md) and [SEC-192](../../completed/sec-192-report-three-numbers/design.md), owned by `offer`, `order` and `stats` ([offer](../../../specs/offer.md), [order](../../../specs/order.md), [stats](../../../specs/stats.md)).

## What an admin can do

- **Posts page.** "Xem số suất", at the end of the "Bài đăng" title row, opens a "Sản phẩm" box over the list: the portions posted (from how many posts), sold (how many customers collected), waiting (how many have yet to collect), not collected (how many did not) and left (and of them, left over on posts that ended). It follows the list's filters and is kept in the address; closed, nothing is read.
- **Report.** Beside the three numbers: a products block (portions posted, ordered, collected, left over, share sold), an impact block (food rescued in kilograms, the original value of what was collected, what customers saved, the discounts Second Bite paid back), a "Sản phẩm" tab on the chart, three store columns (portions posted, left over, share sold), and an analysis in four groups: customers (funnel, per-order averages, visits, sources), products and prices (kinds, discount bands, dishes sold and left most), time (weekday by hour, hours collected, time to sell out, how early customers order) and quality (failures, ratings, praise, problems).
- **Hours.** On the posts, the orders and the report, "Khung giờ" beside the days keeps what starts in a part of each day, any time from and to in hours and minutes (17:30 to 21:15). Ready-made parts of the day were tried and removed on 22 November 2026: their labels overflowed the panel, and the user asked for the hours and minutes alone. It is kept in the address, and the report's exports, the copied message and the print page name it.
- **Export.** "Xuất CSV" becomes "Xuất báo cáo": a PDF of the parts ticked (the browser's print of a page laid out for A4), an Excel workbook, or the CSV.

## Decisions

- **Units by outcome** (`GET /admin/offer-units`) live in `order`, which already depends on `offer`: `offer` answers the offers matching the list's filters and their units, `order` judges the lines of their orders. Missed units are those that never came back: orders expired, and refusals for anything but no answer, no show or late, whose units return to the offer. So posted is left plus collected, held and missed. Orders stand for customers.
- **Left over** on the report is the portions posted less those collected; it is not split further, because `unitsHeld` counts every order placed, cancelled ones included.
- **Impact.** `order.OrderDays` adds the original price of the dishes collected and the discounts paid back; the grams are the units collected times their offer's weight, which `offer.WeightsOf` gives for the dishes that have one, so the screen says how many units were weighed. What customers saved is the original price less what they paid: the total less the discount.
- **Analysis** (`GET /admin/reports/analysis`) is assembled by `stats` from `offer.PostsBetween`, `order.OfferOutcomes` and `order.Analysis`, as the report already is, each module reading only its tables. A post sold out at the latest order not cancelled that took from it; one still on sale with units left is counted neither as sold out nor as not. Only ended posts rank among those left over. The views' sources are the site's whatever store is chosen, as new users are.
- **The PDF is the browser's**: the print page (`/admin/reports/print`) draws the parts ticked without the sidebar or the controls. No PDF library is added.
- **The workbook** uses `github.com/xuri/excelize/v2` (BSD-3-Clause), approved by the tech lead on 22 November 2026. Its sheets are in Vietnamese, as the CSV is; figures are numbers, names text.
- **Hours** are the window's start, as the days already are; the views by when they were opened. `platform.Clock` holds [from, until) as HH:MM, `24:00` ending at midnight, and each query compares it with the time in Vietnam. New users and customers stay the whole day's, as they stay the site's whatever store is chosen. The ratings, read from the reviews, keep the days only.
- **The CSV** keeps its columns in place and adds the impact columns at the end, so the sponsor's sheet keeps its places.

The user approved HTML previews of the posts page and the report on 22 November 2026, and the tech lead the contract the same day; the previews are kept outside the repository.

## Contract

- `GET /admin/offer-units?status=&q=&sellerId=&postedSince=&postedUntil=` (order).
- `GET /admin/reports` and its CSV: `counts` gain `originalVnd`, `discountVnd`, `discountOrders`, `gramsCollected` and `unitsWeighed`.
- `GET /admin/reports/analysis?since=&until=&sellerId=` (stats).
- `GET /admin/reports/workbook?since=&until=&sellerId=` (stats).
- `timeFrom` and `timeUntil` on `GET /admin/offers`, `/admin/offer-units`, `/admin/orders` and the four report operations.

## Verification

- Go: `TestOrder` › admins count what became of posts' units, the report counts the days (worth, outcomes, analysis reads); `TestAnalyse`, `TestDiscountBandAndMedian`, `TestReportCSVImpact`, `TestReportWorkbook`; `TestService` › the report counts a store's views, posts and orders, through the API.
- Web: `report-numbers.test.ts`; `admin-offers.spec.ts` and `admin-reports.spec.ts`, each page checked with axe.
