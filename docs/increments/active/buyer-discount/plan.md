# Buyer discount: plan

The [design](design.md) holds the decisions. The screens were agreed on an HTML preview built against the running web on 31 October 2026.

1. **Server** (one pull request). Done: PR #196.
   - Migration: `order_promotions` (rules as JSON checked in Go), `order_promotion_sellers`, `order_promotion_payouts`; on `order_orders` the promotion, rule name, new-customer flag and discount, with indexes for a phone's orders handed over and a promotion's orders.
   - Placing: the promotions running for the store, locked; the best rule; the discount written on the order.
   - The order answers `discountVnd`, `payVnd` and its `promotion`; `GET /promotions/running` gives the cart what runs for some stores.
   - Admins: list, read, create and change promotions with their use; the payouts of a week and marking one paid; each change in the audit.
   - Tests for each case of the preview's table; `docs/specs/order.md`; the API document and the generated web and mobile clients.
2. **Web** (done: PR #198): Admin → Giảm giá (list, one promotion, the rule dialog, payouts); the cart's notice; the customer's and the store's order showing the discount and what is collected.
3. **Mobile** (to do, waits for the store's order screens in the app, SEC-12): the store's order shows what is collected and what Second Bite pays back; the terms on web and mobile together, which keep the same text.
4. **The programme's figures** (SEC-200), in the admin's report in place of a page of their own, decided on 5 November 2026 ([design](design.md#the-programmes-figures-step-4-sec-200)): `order` counts customers and returning customers; `stats` adds days posted, full days and portions sold per store, and the two customer numbers; the contract and both clients; the report's columns, card and CSV; the spec and test matrix. Built 5 November 2026; merged once its checks pass.
