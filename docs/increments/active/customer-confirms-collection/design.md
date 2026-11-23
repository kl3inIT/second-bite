# A customer confirms they collected their order

Status: in review, 23 November 2026. Linear issue: none yet (workers have no Linear access); to be opened and linked by the member who directs this work.

## Why

Owner's decision of 23 November 2026, agreed by the Tasco Mall partner: the stores of the free-meal pilot often forget to press **Đã giao**, and an order nobody hands over before its window ends becomes `expired` and counts as the customer's no-show (the missed-orders limit of SEC-158, the report's "Khách không đến"). On 22 November production had 35 orders, all collected, several handed over minutes before the window ended.

## What a person can do

- **A customer**, on their own order's page, within its window and while the order is confirmed or ready, presses **Đã nhận món**, is asked once more ("Xác nhận đã nhận đơn #SB-…?", what it means, **Chưa nhận** or **Xác nhận đã nhận**) and confirms. The order is then collected, exactly as if the store had pressed **Đã giao**, and its page shows the collected order with its rating. Signed in, or without an account with the order's access, as cancelling works. The app's order page offers the same, in a sheet.
- **A store** keeps **Đã giao** as it is. An order its customer confirmed shows in the **Đã giao** tab and on its page as delivered, with "Khách xác nhận"; the store may take it back with **Hoàn tác** as its own hand-over.
- **An admin** sees, on the orders list and an order's page, who confirmed a collected order ("Khách xác nhận" or "Quán giao"), and in the report's funnel how many orders their customers confirmed.

## References (From:)

- Too Good To Go, "How do I make an order on Too Good To Go?" (https://tgtg.zendesk.com/hc/en-us/articles/27734974995602): step 6, "Swipe your in-app receipt after you have collected the order to confirm the process has been finalised." Its "How to collect" page (https://www.toogoodtogo.com/en-gb/how-to-collect-too-good-to-go): the customer swipes "the in-app slider as proof of your reservation". "I picked up my order but forgot to swipe" (https://tgtg.zendesk.com/hc/en-us/articles/32645749931282): once the window has passed the status cannot be changed, and the store is paid anyway. Its loyalty-stamp page (https://tgtg.zendesk.com/hc/en-us/articles/28718873255826) does offer a late path: an order the customer forgot to swipe can be confirmed afterwards under Profile › My Orders › Past › **Confirm Collection**, unless it is already marked "not collected". Not taken: ours stays inside the window by design, since after it the order is expired, counted in the missed-orders limit and the report, and the store may no longer reopen it. Taken: the customer confirms on their own order, only within the window, and the action is deliberate.
- Pratt IxD's critique of the Too Good To Go app (https://ixd.prattsi.org/2026/02/design-critique-too-good-to-go-mobile-app/), describing the current app: a "Tap to pick up" button opens a bottom sheet with the order's number, then the swipe "reduces accidental taps". Taken: one press only asks; a second, deliberate step confirms.
- Karma, "Pick up and confirm your order" (https://support.karma.life/en/articles/pick-up-confirm-order): the guest selects **I've picked up** only after receiving the food, which "moves the order out of the active pickup flow and may trigger the rating prompt"; "Manage surplus sales in Karma" (https://support.karma.life/en/articles/manage-surplus-sales): the venue's **Confirm picked up** completes the same order. Taken: either side completes the one order, and the rating follows.

## Decisions

1. **One path for both sides.** `POST /orders/{orderId}/collect` (`collectOrder`) and the store's `hand-over` call one step in `order`: the order locked, open and its window opened (`ORDER_OUTSIDE_WINDOW` before, `ORDER_TRANSITION_NOT_ALLOWED` once ended or expired), `MarkCollected`, one `collected` event, the notice to the order's and the seller's sockets. The review opens, and the reports and money count it, because they all read `state = 'collected'`. No push, as a hand-over sends none.
2. **First wins; the second is answered, not refused.** The order's row lock orders the two; the second finds it collected and answers it as it is, with no second event or notice. This applies to the store's hand-over too, which used to answer `ORDER_TRANSITION_NOT_ALLOWED` to a second press: a store pressing **Đã giao** on an order its customer has just confirmed now sees it delivered instead of a refusal. It is the repository's way for ready (`Ready` answers an order already ready as it is).
3. **Who confirmed is recorded** as `order_orders.collected_by`, `seller` or `customer`, reusing the order's `Side` (`customer`, `seller`) that the chat already uses rather than a new word ("staff"). A check holds it set exactly when the order is collected; the migration sets `seller` on every order collected before (they were all handed over by staff). Reopening clears it. It is `collectedBy` in `OrderBody`, which the store, the customer and admins read, and `collectedByCustomer` in the report's counts.
4. **A confirmation step, not a swipe** (own choice among the references). Too Good To Go asks for a swipe after a tap; Karma for a button. The web uses the registry alert dialog the guideline prescribes for a confirmation (docs/guidelines/web.md › Feedback), and the app a bottom sheet as its cancelling does: both buttons are reachable by keyboard and screen reader, where a swipe would need another way for them (WCAG 2.5.7, Dragging Movements), and no new control is owned. The words say to confirm only with the food in hand, as Karma's page does.
5. **Shown only within the window** on the web and in the app, as the server refuses it outside; the page reads the order again when the window opens and closes, as it does today.
6. **The CSV and the workbook are unchanged** (own choice): their columns are pasted into the sponsor's sheet; the count is in the API and on the report's screen.

## Data

Migration `0051_order_add_collected_by.sql`: the nullable column with its check of the two values, every collected row set to `seller`, then the check `(state = 'collected') = (collected_by IS NOT NULL)`. The previous release cannot run against it (docs/guidelines/persistence.md › Schema evolution): it hands over orders without the column, and reopens a collected order without clearing it, so both fail with `23514` on `order_orders_collected_by_state`. A deployed server cannot run the migration's Down: the binary offers no such command, the image is distroless and `deploy.sh` only pulls, dumps and starts (docs/runbooks/ci-cd.md). Rolling back past 0051 is therefore a database restore: restore the dump `deploy.sh` saved before the deployment (`backups/pre-deploy-<release>.dump`), then deploy the previous release, losing every order and change made since the deployment. Fixing forward with a new release keeps them. Dropping the column by hand instead would leave goose's version at 51, so the next release would not run 0051 again and would find its column missing.

## Failure behavior

Someone else, another order's access or the store calling `collect`: `404 ORDER_NOT_FOUND`. Cancelled, refused or expired: `409 ORDER_TRANSITION_NOT_ALLOWED`. Before the window: `409 ORDER_OUTSIDE_WINDOW`, whose words now say handing over and collecting. A request that got no answer: the web's and the app's own sentence in the dialog or the sheet.

## Verification plan

HTTP-boundary check `TestService` › a customer confirms they collected their order (`server/cmd/secondbite/collect_test.go`) against PostgreSQL with PostGIS: signed in and with the access, someone else refused, the store and the customer at once with one event, a cancelled and an expired order refused, before the window refused, `collectedBy` both ways. `TestOrder` checks the hand-over answering a second press, the store taking back a customer's confirmation, and the report's count. Playwright: the customer confirming after the dialog ("Chưa nhận" first), the store's tab and page, the admins' list and page, the report. Flutter widget test of the app's sheet.

## Open questions

- Whether the store should get a push when its customer confirms (none now, as for a hand-over): the owner.
