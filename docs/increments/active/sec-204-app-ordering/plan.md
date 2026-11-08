# SEC-204 — Ordering in the app for customers: plan

Design: [design.md](design.md). Tracked in Linear as SEC-204. Each pull request is merged once its checks pass; each step is one commit.

| # | Step | Pull request | State |
| --- | --- | --- | --- |
| 1 | Design and plan | docs, on `main` | Written, 8 November 2026 |
| 2 | Cards open their store: `/sellers/:id` and `/offers/:id` routes, the store's page (cover, facts, kind tabs, search, dishes, empty states), share, directions | A | Built, 8 November 2026. The distance waits for the place (step 14), the rating for the backend that sends one |
| 3 | The cart: the model and its rules with tests, kept in `shared_preferences`; the stepper and the dish sheet; the sticky cart bar | A | Built, 8 November 2026. The bar's "Xem giỏ hàng" arrives with `/cart` in step 5 |
| 4 | The store's map from the self-hosted style | — | Not done in A: the web builds the map's style in JavaScript (`@protomaps/basemaps` in `web/src/components/map/map-style.ts`) over a PMTiles archive; the app needs that style as a JSON file served beside the archive, which is a change to the map service, and `maplibre_gl` in the browser preview needs MapLibre's script on the page. To decide with that change |
| 5 | `/cart`: a card per store, payment at the counter, totals, the running promotions, the cancel policy | B | Built, 8 November 2026; the cart's bar opens it |
| 6 | Who collects: the contact sheet, the number's confirmation, the remembered contact; placing per store with the idempotency key and checkout id; the kept accesses in secure storage | B | Built, 8 November 2026. Until an order's page is in the app (step 9), the cart's page says which orders were placed, with their numbers, stores, windows and what to pay; step 9 opens the first order instead, as the web does |
| 7 | The sold-out sheet and every placing failure in the server's words | B | Built, 8 November 2026 |
| 8 | The Orders tab: open and ended, guest and signed in, the sign-in prompt | C | Not started |
| 9 | An order's page: band, countdown, steps, ticket with QR, how to collect, summary with the discount, directions; cancelling | C | Not started |
| 10 | After collection: the review, the receipt; ended orders' receipts and timelines; the problem report | C | Not started |
| 11 | The live client: one socket, tickets, reconnection, polling, foreground and background; the Orders tab and the order's page follow it | D | Not started |
| 12 | The chat with the store: messages, sending with a key, retry, quick replies, seen, locked | D | Not started |
| 13 | The Saved tab: follows on the phone, moved to the account at sign-in, the follow button on cards and stores | E | Not started |
| 14 | `/search` with the web's filters and sort, recent searches; the place sheet (Gần tôi, Tasco Mall, a typed place) on the home | E | Not started |
| 15 | The order limits of SEC-158 once PR #212 is merged: the client generated again, the cap in the stepper and sheet | B | Built, 8 November 2026: the cart, its stepper and the dish's sheet stop at the cap and say it; a refusal (`ORDER_OVER_DISH_LIMIT`, `ORDER_PHONE_HOLDS_ORDERS`, `ORDER_PHONE_MISSED_ORDERS`) shows in the server's words |
| 16 | Checked on an Android emulator against the stub and staging, as the design's verification plan lists | — | Not started |
