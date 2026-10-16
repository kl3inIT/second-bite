# Second Bite vision

This page states the outcomes Second Bite is meant to reach and the principles that stay stable while it is built. It is derived from the founder's [requirements for the IT team](brief/second-bite-app-requirements-it.md), the [project brief](brief/second-bite-project-brief.md) and the [kickoff meeting of 16 October 2026](research/sources/2026-10-16-kickoff-meeting-transcript.md). What exists today is in [ARCHITECTURE.md](../ARCHITECTURE.md); scheduled work is in the [roadmap](roadmap.md).

## Outcomes

Second Bite is a non-profit platform that connects shops and restaurants that have genuine edible surplus with nearby people who want good food at a lower price. It takes no commission from sellers. The journey the product must carry end to end is:

> A seller confirms surplus and offers it → a nearby customer finds it → orders confirmed stock and pays in cash or by transfer → collects it from the seller with a one-use code within the collection window.

The pilot succeeds when the team can show, with real sellers and customers around Tasco Mall in Việt Hưng ward, Hanoi, that:

- sellers post surplus quickly enough that they keep doing it at the end of a busy day;
- customers complete the collections they order, and come back;
- the surplus offered is genuine: food that would otherwise be thrown away, not stock moved from normal sale;
- avoided disposal is measured against a baseline, separately from sales.

The people it serves are customers nearby (office workers, students, security staff and labourers on modest incomes), the owners and staff of food and beverage sellers, and the Second Bite operators who verify sellers, handle problems and refunds, and report on the pilot.

## Pilot targets set at the kickoff

These are the sponsor's directional targets from the kickoff; the team may adjust them once in the first week, and then works to them ([transcript, 48:00–55:20](research/sources/2026-10-16-kickoff-meeting-transcript.md)).

- Three weeks of surveys of sellers, customers and competitors, from 16 October 2026.
- From the second to the fourth week, a running prototype with 30 sellers in Tasco Mall and 100 customers nearby.
- A beta around 16 November 2026 that reaches sellers outside the mall: 100 sellers and 300 customers.
- The sponsor funds the pilot; sponsorship and advertising are studied as later income, never a commission on sellers' sales.

## Product principles

- **No commission.** Second Bite never takes a share of a seller's sales. Fees of third parties (payment, delivery) are shown separately.
- **Genuine surplus only.** Food still needed for normal service stays in the kitchen. Expected surplus can be followed; only confirmed stock can be ordered.
- **People check food, software does not.** The seller's staff check suitability and handling at the handover. AI drafts an offer from words or a photo for staff to review, and never states that food is safe or when it expires.
- **AI helps and never blocks.** When the AI cannot read something or does not answer, staff type the offer and customers search with ordinary filters.
- **Collection first.** Customers collect from the seller. Delivery through a partner is enabled only when an agreement and a working integration exist.
- **The whole journey works.** A list of offers alone is not the product; an order ends in a completed collection or a clear cancellation, and never looks successful before it is.
- **Prices are honest.** A customer sees the price, the third-party fees and the total before ordering.
- **Access is enforced on the server.** Who may post, order, collect, chat or administer is decided by the backend, never only by what a screen shows.
- **Bilingual from the first screen.** Vietnamese and English, for screens and for the AI's answers.
- **Proportionate.** A small team must be able to run it: one command to run locally, a staging environment, tested backups.

## Target architecture

Agreed with the team on 16 October 2026, after reading how Mattermost organizes a Go server with web, mobile and desktop clients. Technology choices are taken one part at a time and recorded as they are accepted.

```text
   Customers / sellers / operators
       │                 │
    Web application    Mobile application (iOS, Android)
    (browser)          (submitted to the stores; until approved,
       │                 pilot users use the web application)
       └───────┬─────────┘
               │  HTTPS, per the OpenAPI contract
       Backend (Go, one deployable, modules with enforced boundaries)
          │              │                    │
     PostgreSQL     Object storage       External services
     with PostGIS   (S3-compatible)      payment, AI, maps, email, push
```

- **The backend is the only owner of data and business rules.** Clients show and send; they never decide whether stock is left or who may read an order. This is what lets two clients be built at the same time without drifting apart.
- **The API contract is the boundary between teams.** The backend generates its OpenAPI document from the implemented contract; the web and mobile applications generate their clients from it, so a client that falls behind a change fails its build.
- **Web and mobile are built in parallel** against the same API. The web goes first because it needs no store review; the mobile application is submitted to the App Store and Google Play, and pilot users who cannot install it yet use the web.
- The backend is one Go deployable whose business capabilities are modules with enforced boundaries ([backend guideline](guidelines/backend.md)), with PostgreSQL and PostGIS as the system of record and the schema owned by versioned migrations.
- **One repository** holds the backend, the web and mobile applications, the API contract, the infrastructure and the documents, as Ente and Immich do (decided with the team on 16 October 2026): `backend/`, `web/`, `mobile/`, `api/` (the OpenAPI document the backend generates and the clients read), `infra/`, `docs/`. Each folder is created with its first code. The mobile application can later move to a repository of its own, keeping its history, if a separate team and release cycle call for it.
- **The web application is Next.js with React and TypeScript** (decided with the team on 16 October 2026), as Ente's web is over its Go server: offer pages rendered on the server give shared links on Zalo and Facebook a preview with the photo and the price, and BeyondPilot's web conventions can be adapted rather than written anew. Its conventions arrive with its first increment (SEC-17).
- Self-hosted where practical; external services are used only where self-hosting is not possible or not sensible (app stores, push delivery, payment, AI model providers, maps), each vendor family behind interchangeable adapters.

Still to decide, one part at a time: the mobile application's technology; deployment and hosting. Also open: delivery partners, whether a customer's transfer goes to the seller's own account or through Second Bite, and the minimum discount. Each becomes an ADR or a roadmap entry when it is accepted.
