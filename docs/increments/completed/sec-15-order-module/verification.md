# SEC-15 — The `order` module: verification

Read against `main` on 22 October 2026. The module was built through later increments, each verified in its own pull request: the customer's flow without an account (SEC-76, PR #45), collecting by QR or by name and phone instead of a four-digit code (SEC-86, PR #49), the seller's order tab (SEC-78, PR #51), placing in its own transaction (SEC-128, PR #95), cancelling until ready (SEC-121), the chat and live state (SEC-117), and Web Push (SEC-25).

## Checks

| Part | Outcome |
| --- | --- |
| Backend | `TestOrder` and `TestService` against PostgreSQL in CI; every operation in the [spec](../../../specs/order.md) is served, with the jobs `order.expire_ended`, `order.remind_due_soon`, `order.purge_live_tickets`, `order.forget_old_chats` and the listeners `order.refuse_withdrawn_offer`, `order.follow_seller_location` |
| Web | Playwright `order.spec.ts` (order with a name and phone, cancel, the QR once ready, rate once collected, a dish that ran out, orders placed together, a 360 px phone) and `store-orders.spec.ts` (the day's orders in four tabs, ready, hand over and take back, cancel with a reason, the scanner, search by phone) |
| CI | Each pull request above green before merging |

## Against the real service

- **The whole flow on staging,** 22 October 2026 (see [SEC-66's verification](../sec-66-store-location-pin/verification.md)): a guest ordered a store's dish, the seller marked it ready and handed it over, the guest rated it.
- **The numbers,** 22 October 2026 (SEC-80): the admin's report read the real orders held and collected on staging, and matched the orders list.

## Left out, and where it went

- Paying by transfer and `PaymentReceived`: the pilot pays at the counter (SEC-114); online payment is SEC-18.
- A one-use collection code locked after wrong attempts: replaced by the order's QR, or its name and phone number (SEC-86).
- The Flutter screens: the pilot runs on the web (sponsor's row P-01); the app's ordering is SEC-12.
- Limits of units per customer and day, and of orders per phone number: not needed for the pilot's size; open in the spec's "Not yet".
