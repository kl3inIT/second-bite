# Buyer discount: plan

The [design](design.md) holds the decisions. The screens were agreed on an HTML preview built against the running web on 31 October 2026.

1. **Server** (one pull request).
   - Migration: `order_promotions` (rules as JSON checked in Go), `order_promotion_sellers`, `order_promotion_payouts`; on `order_orders` the promotion, rule name, new-customer flag and discount, with indexes for a phone's orders handed over and a promotion's orders.
   - Placing: the promotions running for the store, locked; the best rule; the discount written on the order.
   - The order answers `discountVnd`, `payVnd` and its `promotion`; `GET /promotions/running` gives the cart what runs for some stores.
   - Admins: list, read, create and change promotions with their use; the payouts of a week and marking one paid; each change in the audit.
   - Tests for each case of the preview's table; `docs/specs/order.md`; the API document and the generated web and mobile clients.
2. **Web**: Admin → Khuyến mãi (list, one promotion, the rule dialog, payouts); the cart's notice; the customer's and the store's order showing the discount and what is collected; the terms.
3. **Mobile**: the store's order shows what is collected and what Second Bite pays back.
4. **Rewards for stores and the programme's figures**, previewed in HTML first.
