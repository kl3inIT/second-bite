# Second Bite roadmap

Task status lives in Linear (team Second-bite, issues `SEC-<n>`); this page summarizes it and links to the increments.

## Delivered

- SEC-5 — Repository foundation, 16 October 2026: brief, vision, conventions, guidelines, the research done before design, the Go agent skills and the Linear MCP server.
- [SEC-10 — Backend foundation and the `seller` module](increments/completed/sec-10-backend-foundation/design.md), 17 October 2026: the Go service with its checks in CI, sign-in by emailed code with bearer sessions, email through the provider admins choose (SMTP or Brevo), and `seller` (opened by anyone, activated by admins, staffed by its owner). Specs and test matrices under `docs/specs/` and `docs/tests/`; Brevo's delivery reports moved to SEC-24.

## Active

- [SEC-6 — Pilot domain model](increments/active/sec-6-pilot-domain-model/design.md): the pilot's journey worked through boundary discovery from the founder's requirements, ending in candidate modules, their data owners and working assumptions. The one question left for the founder is SEC-7; the reading of comparable products SEC-8.
- SEC-9 — Seller and customer surveys, three weeks from 16 October 2026.

## Candidates

In the order the pilot needs them; each starts as an increment when it is taken.

1. SEC-11 — `offer`: a seller posts confirmed or expected surplus with its photo, units, price and collection window.
2. SEC-15 — `order`: ordering confirmed stock, collection with a one-use code, readiness, cancellation and expiry.
3. SEC-18 — `payment`: cash at the counter and VietQR transfers confirmed through SePay, behind a provider registry; refunds decided by admins.
4. SEC-17 — The web application in React for customers, sellers and admins.
5. SEC-19 — `messaging`: one conversation per order between the customer and the seller's staff.
6. SEC-16 — Offer drafts from a seller's words, voice or photo, reviewed by staff before they are posted.
7. SEC-20 — AI search for customers in words or voice, answered in their language.
8. SEC-13 — Problem reports, cancellation and refund requests handled by admins, and the reports they download.
9. SEC-12 — The native mobile application, once its technology is chosen.
10. SEC-14 — Distribution to testers through TestFlight and Google Play internal testing.

Before the pilot opens: SEC-24 — Brevo's delivery reports and suppressed addresses, with the first deployment.

After the pilot: delivery through Grab or Xanh SM with courier tracking (SEC-21), sellers outside food and beverage.
