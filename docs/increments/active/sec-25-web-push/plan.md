# SEC-25 — Web Push for orders: plan

Design: [design.md](design.md). Tracked in Linear as SEC-25.

| # | Step | State |
| --- | --- | --- |
| 1 | Research, design and plan | Done, 22 October 2026 |
| 2 | `order`: the durable events of decision 6 in the transactions that change an order or write a message; the reminder job and its migration (`due_soon_at`); the Zalo consent on the order (migration, API field); spec and checks | To do |
| 3 | `notification`: the table of subscriptions and their topics; `POST` and `DELETE /push/subscriptions` with live tickets; the sender (`webpush-go`, one HTTP client, Topic, Urgency, TTL); the listeners that word each event in Vietnamese and English; deletion on 404 and 410; the VAPID keys as a secret; spec and checks | To do |
| 4 | OpenAPI, and the web and mobile clients generated again | To do |
| 5 | Web: `app/manifest.ts`, a static `public/sw.js` with its headers, the button on the order page and on the Đơn tab, the iPhone steps, the undo hint, the Zalo checkbox at checkout; words in both languages; stub and Playwright checks | To do |
| 6 | Staging: generate the VAPID keys on the host, then `deploy.sh`, compose and the runbook | To do |
| 7 | Proof on real phones: Android Chrome, an iPhone added to the Home Screen and a desktop browser, each receiving the events; verification note; consolidate into `docs/specs`; move this increment to `completed/` | To do |
