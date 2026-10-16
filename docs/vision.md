# Second Bite vision

This page states the outcomes Second Bite is meant to reach and the principles that stay stable while it is built. It is derived from the founder's [brief](brief/second-bite-project-brief.md) and the [kickoff meeting of 16 October 2026](research/sources/2026-10-16-kickoff-meeting-transcript.md). What exists today is in [ARCHITECTURE.md](../ARCHITECTURE.md); scheduled work is in the [roadmap](roadmap.md).

## Outcomes

Second Bite connects shops and restaurants that have genuine edible surplus with nearby people who want good food at a lower price. The journey the product must carry end to end is:

> A seller confirms surplus and offers it → a nearby customer finds it → reserves confirmed stock → collects it from the seller with a one-use code within the collection window.

The pilot succeeds when the team can show, with real sellers and customers around Tasco Mall in Việt Hưng ward, Hanoi, that:

- sellers post surplus quickly enough that they keep doing it at the end of a busy day;
- customers complete the collections they reserve, and come back;
- the surplus offered is genuine: food that would otherwise be thrown away, not stock moved from normal sale;
- the economics can work once a fee is charged;
- avoided disposal is measured against a baseline, separately from sales.

The people it serves are customers nearby (office workers, students, security staff and labourers on modest incomes), the staff and owners of food and beverage sellers, and the Second Bite operators who verify sellers and handle support.

## Pilot targets set at the kickoff

These are the sponsor's directional targets from the kickoff; the team may adjust them once in the first week, and then works to them ([transcript, 48:00–55:20](research/sources/2026-10-16-kickoff-meeting-transcript.md)).

- Three weeks of surveys of sellers, customers and competitors, from 16 October 2026.
- From the second to the fourth week, a running prototype with 30 sellers in Tasco Mall and 100 customers nearby.
- A beta around 16 November 2026 that reaches sellers outside the mall: 100 sellers and 300 customers.
- No fee during the pilot. The sponsor funds the pilot; sponsorship and advertising are studied as later revenue.

## Product principles

- **Genuine surplus only.** Food still needed for normal service stays in the kitchen. Expected surplus can be followed; only confirmed stock can be reserved.
- **People check food, software does not.** The seller's staff check suitability and handling at the handover. AI drafts a listing for staff to review and never decides whether food is safe.
- **Collection first.** Customers collect from the seller. Delivery, maps with live tracking and courier integration come after the pilot.
- **The whole journey works.** A list of offers alone is not the product; a reservation ends in a completed collection or a clear cancellation.
- **Prices are honest.** A customer sees the original price beside the offer price; a seller sees what the platform takes before posting.
- **Access is enforced on the server.** Who may post, reserve, collect or administer is decided by the backend, never only by what a screen shows.
- **Bilingual from the first screen.** Vietnamese and English.
- **Proportionate.** A small team must be able to run it: one command to run locally, a staging environment, tested backups.

## Target architecture

- One backend service in Go whose business capabilities are modules with enforced boundaries ([backend guideline](guidelines/backend.md)), and a Flutter mobile application for customers and sellers, with an administration screen for operators.
- PostgreSQL with PostGIS as the system of record, the schema owned by versioned migrations.
- The backend owns the API contract; clients use code generated from it.
- Self-hosted where practical; the external services kept are the ones that cannot be avoided: the app stores, push delivery, and AI model providers behind interchangeable adapters.

Not yet decided, and therefore not part of this target: the fee once the pilot ends, whether customers pay in advance, how long a reservation is held, the minimum discount, hosting, and the shape of the administration screen. Each becomes an ADR or a roadmap entry when it is accepted.
