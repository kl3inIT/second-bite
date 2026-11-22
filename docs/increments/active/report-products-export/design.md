# The report's products, analysis and export

Status: started on 22 November 2026. Not yet tracked in Linear; the issue is opened when the user asks. It changes the admin's report of [SEC-80](../../completed/sec-80-prototype-numbers/design.md) and [SEC-192](../../completed/sec-192-report-three-numbers/design.md), owned by `stats` ([spec](../../../specs/stats.md)).

## What an admin can do

An admin reads, beside the three numbers, what became of the portions posted: how many were posted, ordered and collected, how many were left over, and the share that reached a customer. The chart gains a tab with the portions collected and left over each day, and the stores' table gains the portions posted, left over and the share sold for each store. Under the chart, an analysis follows the visitors to the orders held and collected, gives what one collected order holds on average, and shows the customers' ratings of the same days.

"Xuất CSV" becomes "Xuất báo cáo": a dialog chooses a PDF or the CSV. The PDF is a page of the report laid out for paper, holding the parts the admin ticked, which the browser saves as a PDF; the CSV is the server's file as before.

## Decisions

- **Only what the API already gives.** The report's `counts` hold `unitsPosted`, `unitsHeld` and `unitsCollected`, which no screen showed; the ratings come from `GET /admin/reviews` (SEC-145) with the same days and store. No endpoint or field is added, so the contract and the CSV stay as they are.
- **Left over** is the portions posted less those collected: what did not reach a customer, whether nobody ordered it or the customer did not come. It is not split further, because `unitsHeld` counts the portions of every order placed, cancelled ones included, so a portion cancelled and ordered again counts twice.
- **The share sold** is the portions collected over those posted, in whole percent, none without posts.
- **The funnel** stops at the orders collected. The customers and returning customers are the site's whatever store is chosen (SEC-200), so they stay on their own card rather than under a store's orders.
- **Ratings** are those given in the range's days in Vietnam, of the store chosen, as the reviews page reads them; the average is of the reviews shown, as the API gives it.
- **"Phần đã lấy"** moves from the cards under the three numbers to the products block, which holds every portion figure; four cards remain under the three numbers.
- **The PDF is the browser's.** The print page (`/admin/reports/print`) reads the same report and draws the parts chosen without the sidebar or the controls; "Lưu PDF" opens the browser's print dialog. No PDF library and no server code are added. A workbook (`.xlsx`) would need a library on the server and waits for the tech lead.
- **Left for later, each needing an API agreed with the tech lead:** the posts page's portions by outcome; the original value, what customers saved, the discounts Second Bite paid back and the kilograms rescued; the kinds of dish, discount levels, hours, weekdays, time to sell out, how long before the window customers order, reasons orders fail, praise tags and problem reports; the workbook.

The user approved HTML previews of the posts page and the report on 22 November 2026; they are kept outside the repository.

## Verification

- `report-numbers.test.ts` for the portions left over and the share sold.
- `admin-reports.spec.ts` for the products block, the chart's new tab, the stores' new columns, the analysis, the export dialog, the CSV download and the print page, each page checked with axe.
