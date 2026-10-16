# Second Bite roadmap

Task status lives in Linear (team Second-bite, issues `SEC-<n>`); this page summarizes it and links to the increments.

## Delivered

- SEC-5 — Repository foundation, 16 October 2026: brief, vision, conventions, guidelines, the research done before design, the Go agent skills and the Linear MCP server.

## Active

- [SEC-6 — Pilot domain model](increments/active/sec-6-pilot-domain-model/design.md): the pilot's journey worked through boundary discovery, ending in candidate modules, their data owners and the questions the team must answer before the first code. Draft for review; its open questions are SEC-7, the reading of comparable open-source models SEC-8.
- SEC-9 — Seller and customer surveys, three weeks from 16 October 2026.

## Candidates

In the order the pilot needs them; each starts as an increment when it is taken.

1. SEC-10 — Backend foundation and the `seller` module: the Go service, PostgreSQL with PostGIS, migrations, the error contract and continuous integration, created with the first module that needs them. Waits for SEC-7.
2. SEC-11 — `offer`: a seller posts confirmed or expected surplus with its prices and collection window.
3. SEC-15 — `reservation`: reservations and collection with a one-use code, including expiry and no-shows.
4. SEC-12 — The mobile application for customers and sellers, and the operators' screen.
5. SEC-16 — Offer drafts from a seller's spoken description, reviewed by staff before they are posted.
6. SEC-13 — Support requests.
7. SEC-14 — Distribution to testers through TestFlight and Google Play internal testing.

After the pilot: payments, delivery and courier integration, live order tracking, sellers outside food and beverage.
