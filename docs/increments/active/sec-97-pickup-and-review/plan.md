# SEC-97 — Pickup and review: plan

Design: [design.md](design.md). Tracked in Linear as SEC-97.

| # | Step | State |
| --- | --- | --- |
| 1 | Reviews in the order module: migration, queries, `POST /orders/{orderId}/review`, the review on the order, tests | Done, 21 October 2026; the database tests still to run |
| 2 | "Đơn của tôi" after K8, one card per seller's order | Done, 21 October 2026 |
| 3 | The open order after K6, with the orders placed together | Done, 21 October 2026 |
| 4 | The collected order after K6b, with the review form and the review given | Done, 21 October 2026 |
| 5 | E2E specs and screenshots at 390, 768 and 1440 | Specs written; to run |
| 6 | Regenerate the mobile client from the new OpenAPI document | To do: needs Dart |

One pull request, after SEC-88's.
