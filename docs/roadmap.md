# Second Bite roadmap

Task status lives in Linear (team Second-bite, issues `SEC-<n>`); this page summarizes it and links to the increments.

## Delivered

- SEC-5 — Repository foundation, 16 October 2026: brief, vision, conventions, guidelines, the research done before design, the Go agent skills and the Linear MCP server.
- [SEC-10 — Backend foundation and the `seller` module](increments/completed/sec-10-backend-foundation/design.md), 17 October 2026: the Go service with its checks in CI, sign-in by emailed code with bearer sessions, email through the provider admins choose (SMTP or Brevo), and `seller` (opened by anyone, activated by admins, staffed by its owner). Specs and test matrices under `docs/specs/` and `docs/tests/`; Brevo's delivery reports moved to SEC-24.
- [SEC-52 — Legal, error and account screens](increments/completed/sec-52-legal-error-account-screens/design.md), 20 October 2026: redrawn in Figma as web desktop and mobile app; on the web under the seller header and findable by search and answer engines (metadata, language alternates, JSON-LD, sitemap); in the app the legal pages open inside it and every screen but the home has the blue top bar (PR #30). Staging to be measured again with PageSpeed once deployed.
- [SEC-37 — Account deletion and account settings](increments/completed/sec-37-account-deletion/design.md), 20 October 2026: a person deletes their account in the app or on the web with an emailed code, from the foot of account settings, which the account menu and the account tab lead to; `/delete-account` is also Google Play's web link. The first events between modules, through a River outbox (PR #33).
- [SEC-28 — Failure messages translated by the server](increments/completed/sec-28-failure-words/design.md), 20 October 2026: every failure in Vietnamese and English beside its code, chosen from `Accept-Language`; the web and the app show the server's words; proven against the real service (PR #38).
- [SEC-61 — Edit the display name](increments/completed/sec-61-display-name/design.md), 20 October 2026: a person names their account from account settings, on the web and in the app; a name they chose stays when they sign in with Google; a refused name reads in the server's words; proven against the real service (PR #39).
- [SEC-75 — Admin foundation](increments/completed/sec-75-admin-foundation/design.md), 21 October 2026: every `/admin` operation behind one group, refused signed out and to customers, with an append-only audit trail of admin changes; settings saved at the version read; admins granted and revoked from the web and the command line; a store's states `pending`, `active`, `rejected`, `blocked` with the owner emailed; the admin web's shell, stores, a store's page, settings, the log, accounts and admins (PRs #42, #57, #67).
- [SEC-66 — A store's real location, pinned on a map](increments/completed/sec-66-store-location-pin/design.md), 22 October 2026: the owner pins the store on a self-hosted map of Hanoi (MapLibre and a PMTiles extract served at `/map/`) when opening it, from a suggested address, the location button or the map, and moves it later; the server keeps every store in Hanoi, and a moved store moves its offers on sale and its orders still to collect; an admin sees the pin (PRs #107, #112, #113, #114).
- [SEC-15 — The `order` module](increments/completed/sec-15-order-module/design.md), 22 October 2026: a customer orders units of a store's dishes with a name and a phone number, signed in or not, and pays at the counter; the store marks the order ready, hands it over by its QR or by name and phone, refuses it with a reason or reopens it; the customer cancels until it is ready and rates it once collected; orders expire with their window and follow a withdrawn dish or a moved store. On the web only; built through SEC-76, SEC-86, SEC-78, SEC-121, SEC-117 and SEC-25 (PRs #45, #49, #51, #95). The offer page with its order panel (SEC-45) is part of it; the app's screens moved to SEC-12, transfers to SEC-18.
- [SEC-80 — The prototype's numbers](increments/completed/sec-80-prototype-numbers/design.md), 22 October 2026: the site counts the pages people open itself (no analytics service; bots, prefetches and driven browsers left out; a daily-salted visitor key, views kept 400 days); the admin's Báo cáo page shows views, orders held and collected, the share collected and what expired, per day and per store, and exports them as CSV; the poster's QR counts as `qr` (PRs #127, #132, #134, #137).
- [SEC-84 — A customer reports a problem with an order](increments/completed/sec-84-order-problem/design.md), 24 October 2026: within two days of a collected or expired order, its customer, signed in or holding its access, reports one problem (an item missing, the wrong item, poor quality, the store closed) with an optional note; the store answers it once on the order's page; each side is told by push without the words (PR #145).
- [SEC-82 — Feedback from a store to the team](increments/completed/sec-82-store-feedback/design.md), 24 October 2026: the customer's side is the review after a pick-up and SEC-84's report; a store's owner and staff send "Góp ý cho Second Bite" from the store's menu, kept without its author, at most 20 a day; admins read it on the report page, by the same days and store (PR #146).
- [SEC-33 — Staging](increments/completed/sec-33-staging/design.md), 18 October 2026: `secondbite.vadan.app` on the shared host as its own Compose project, deployed after every green `main`, with a database dump before each migration and nightly backups; from then on migrations are forward-only.
- SEC-57's seller rules, 21 October 2026: [a post's hours may change with orders, and the orders follow](increments/completed/sec-91-change-hours-with-orders/design.md) (SEC-91, PR #56); [ended posts and orders closed by a scheduled job](increments/completed/sec-96-close-ended/design.md) (SEC-96, PR #63); [withdrawing a post ends its orders](increments/completed/sec-108-withdraw-with-orders/design.md) (SEC-108, PR #70); [the address filled from where the person stands](increments/completed/sec-110-address-from-location/design.md) (SEC-110, PR #74); [the Đơn tab scans the customer's order QR](increments/completed/sec-113-scan-order-qr/design.md) (SEC-113, PR #79).

## Active

- [SEC-6 — Pilot domain model](increments/active/sec-6-pilot-domain-model/design.md): the pilot's journey worked through boundary discovery from the founder's requirements, ending in candidate modules, their data owners and working assumptions. The one question left for the founder is SEC-7; the reading of comparable products SEC-8.
- SEC-9 — Seller and customer surveys, three weeks from 16 October 2026.
- [SEC-11 — The `offer` module](increments/active/sec-11-offer-module/design.md): sellers post surplus with a photo and post it again in two fields, announce expected surplus by hand or by a weekly schedule and confirm it; customers find offers near them and follow sellers and announcements by email; photos in a new `file` module. Flow decided on 18 October 2026; steps 2 to 4 built.
- [SEC-29 — Signing in on the web](increments/active/sec-29-web-sign-in/design.md), with SEC-27: the session in an httpOnly cookie, the sign-in page with the emailed code and Google, linking by Google's authoritative addresses. Proposed on 18 October 2026.
- [SEC-43 — Signing in on the app](increments/active/sec-43-app-sign-in/design.md): the Flutter application's sign-in with the emailed code and Google, the session as a Bearer token in the platform's secure store, and the web's Lucide icons. Built on 19 October 2026; checked on a device before the beta.
- [SEC-53 — The seller's web screens in Figma](increments/active/sec-53-seller-web-design/design.md): sign-in and opening a store, the four tabs, posting, expected surplus, managing and editing posts, the catalog; designed on 20 October 2026, no code. The rules go to SEC-54 and SEC-55.
- [SEC-57 — The seller's web screens](increments/active/sec-57-seller-web/design.md): open a store, my stores, the store's tabs, posting, editing and withdrawing, for what the backend does today; expected surplus, the catalog and orders wait for their issues.

## Candidates

In the order the pilot needs them; each starts as an increment when it is taken.

1. SEC-18 — `payment`: cash at the counter and VietQR transfers confirmed through SePay, behind a provider registry; refunds decided by admins.
2. SEC-17 — The web application in React for customers, sellers and admins.
3. SEC-19 — `messaging`: one conversation per order between the customer and the seller's staff.
4. SEC-16 — Offer drafts from a seller's words, voice or photo, reviewed by staff before they are posted.
5. SEC-20 — AI search for customers in words or voice, answered in their language.
6. SEC-13 — Problem reports, cancellation and refund requests handled by admins, and the reports they download.
7. SEC-12 — The native mobile application, once its technology is chosen.
8. SEC-14 — Distribution to testers through TestFlight and Google Play internal testing.

Before the pilot opens: SEC-24 — Brevo's delivery reports and suppressed addresses, with the first deployment.

After the pilot: delivery through Grab or Xanh SM with courier tracking (SEC-21), sellers outside food and beverage.
