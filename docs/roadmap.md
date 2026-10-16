# Second Bite roadmap

Task status lives in Linear; this page summarizes it and links to the increments.

## Delivered

- Repository foundation, 16 October 2026: brief, vision, conventions, guidelines and the research done before design.

## Active

- [Pilot domain model](increments/active/sb-pilot-domain-model/design.md): the pilot's journey worked through boundary discovery, ending in candidate modules, their data owners and the questions the team must answer before the first code. Draft for review.

## Candidates

In the order the pilot needs them; each starts as an increment when it is taken.

1. Backend foundation: the Go service, PostgreSQL with PostGIS, migrations, the error contract and continuous integration, created with the first module that needs them.
2. Sellers and their verification by operators.
3. Offers: a seller posts confirmed or expected surplus with its prices and collection window.
4. Reservations and collection with a one-use code, including expiry and no-shows.
5. The mobile application for customers and sellers, and the operators' screen.
6. Listing drafts from a seller's spoken description, reviewed by staff before they are posted.
7. Support requests from customers.
8. Distribution to testers through TestFlight and Google Play internal testing.

After the pilot: payments, delivery and courier integration, live order tracking, sellers outside food and beverage.
