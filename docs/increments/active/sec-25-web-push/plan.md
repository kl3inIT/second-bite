# SEC-25 — Web Push for orders: plan

Design: [design.md](design.md). Tracked in Linear as SEC-25.

| # | Step | State |
| --- | --- | --- |
| 1 | Research, design and plan | Done, 22 October 2026 |
| 2 | `order`: a push queued in the transactions that change an order or write a message; the reminder job and its migration (`due_soon_at`); the Zalo consent on the order (migration, API field); spec and checks | Merged, PR #128 |
| 3 | `notification`: the tables of subscriptions, topics and pushes; `POST /push/subscriptions` and `/push/subscriptions/remove` with live tickets, `GET /push/key`; `QueuePush` and its listener (`webpush-go`, one HTTP client, Topic, Urgency, TTL); deletion on 404 and 410; `secondbite push keys`; spec and checks | Merged, PR #128 |
| 4 | OpenAPI, and the web and mobile clients generated again | Merged, PR #128 |
| 5 | Web: `app/manifest.ts` and its icons, a static `public/sw.js` with its headers, the button on the order page and on the Đơn tab, the iPhone steps, the undo hint; words in both languages; stub and Playwright checks. The subscribe body's `endpoint` and `keys` were missing from the contract, fixed here with a check through the HTTP API. The Zalo checkbox is left out (design decision 12) | Built, pull request open |
| 6 | Staging: generate the VAPID keys on the host, then `deploy.sh`, compose and the runbook | Keys on the host 22 October 2026; files in the same pull request |
| 7 | Proof on real phones: Android Chrome, an iPhone added to the Home Screen and a desktop browser, each receiving the events; verification note; consolidate into `docs/specs`; move this increment to `completed/` | To do |
