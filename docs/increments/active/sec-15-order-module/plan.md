# SEC-15 — The `order` module: plan

Design: [design.md](design.md). Tracked in Linear as SEC-15.

| # | Step | State |
| --- | --- | --- |
| 1 | Design and plan, from the screens drawn in Figma | Proposed, 20 October 2026 |
| 2 | `offer`: take and return units inside the caller's transaction | Built, 20 October 2026 ([spec](../../../specs/offer.md)) |
| 3 | `order`: place, read, list, cancel, ready, hand over with a code, refuse; expiry read from the window | Built, 20 October 2026 ([spec](../../../specs/order.md)) |
| 4 | Web: order an offer, follow the order and its code, cancel, list my orders | Built, 20 October 2026, in SEC-51: `/orders/new`, `/orders/[orderId]`, `/orders`; the offer page (SEC-45) links to `/orders/new` |
| 5 | Web: a seller's orders of the day, ready, hand over, refuse | Waits for the seller's area on the web |
| 6 | Mobile: the same screens in Flutter | Done by Việt, outside this branch |
| 7 | Specs, test matrices, architecture, roadmap and verification | Not started |
