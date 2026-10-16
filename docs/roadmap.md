# Second Bite roadmap

Task status lives in Linear (team Second-bite, issues `SEC-<n>`); this page summarizes it and links to the increments.

## Delivered

- SEC-5 — Repository foundation, 16 October 2026: brief, vision, conventions, guidelines, the research done before design, the Go agent skills and the Linear MCP server.

## Active

- [SEC-6 — Pilot domain model](increments/active/sec-6-pilot-domain-model/design.md): the pilot's journey worked through boundary discovery from the founder's requirements, ending in candidate modules, their data owners and working assumptions. The one question left for the founder is SEC-7; the reading of comparable products SEC-8.
- SEC-9 — Seller and customer surveys, three weeks from 16 October 2026.
- [SEC-10 — Backend foundation and the `seller` module](increments/active/sec-10-backend-foundation/design.md): decided so far, email delivery as a provider family with SMTP first, Mailpit locally and Brevo's relay as the first provider.

## Candidates

In the order the pilot needs them; each starts as an increment when it is taken.

1. SEC-11 — `offer`: a seller posts confirmed or expected surplus with its photo, units, price and collection window.
2. SEC-15 — `order`: ordering confirmed stock, collection with a one-use code, readiness, cancellation and expiry.
3. SEC-18 — `payment`: cash at the counter and VietQR transfers confirmed through SePay, behind a provider registry; refunds decided by operators.
4. SEC-17 — The web application in React for customers, sellers and operators.
5. SEC-19 — `messaging`: one conversation per order between the customer and the seller's staff.
6. SEC-16 — Offer drafts from a seller's words, voice or photo, reviewed by staff before they are posted.
7. SEC-20 — AI search for customers in words or voice, answered in their language.
8. SEC-13 — Problem reports, cancellation and refund requests handled by operators, and the reports they download.
9. SEC-12 — The native mobile application, once its technology is chosen.
10. SEC-14 — Distribution to testers through TestFlight and Google Play internal testing.

After the pilot: delivery through Grab or Xanh SM with courier tracking (SEC-21), sellers outside food and beverage.
