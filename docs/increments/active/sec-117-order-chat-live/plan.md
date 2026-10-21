# SEC-117 — Chat on each order, and live order status: plan

Design: [design.md](design.md). Tracked in Linear as SEC-117.

| # | Step | State |
| --- | --- | --- |
| 1 | The hub in `platform`: `platform.Live` over coder/websocket and `LISTEN/NOTIFY`, with the `GET /live` handler, the heartbeat, the bounds, the deadlines cleared, close on shutdown and `resync`; its tests with two instances on one database | Done |
| 2 | Live tickets in `order`: migration, mint for an order and for a seller, redeem once, the purge schedule; tests of who may mint | Done |
| 3 | Notices from every path that changes an order (place, cancel, ready, hand over, reopen, refuse, withdrawn offer, moved window, expiry); a test per path, and none after a rollback | Done |
| 4 | Chats in `order`: migration, list, send with `Idempotency-Key` and the bounds, seen, `unreadMessages` on the order, the failure codes with their words; database tests | Done |
| 5 | `order.forget_account` and `order.forget_old_chats`; tests that run each twice | Done |
| 6 | Assembly in `cmd/secondbite`, the composition test through the middleware, OpenAPI and the web client regenerated | Done |
| 7 | The proxies: `local-proxy.conf`, the staging runbook's `location /api/` block, and CI's local-proxy job opening `/api/live` | Done |
| 8 | Documents: the order and platform specs (the socket's frames included), `docs/tests/order.md`, coder/websocket in the backend guideline, ARCHITECTURE.md, the runbook's connection count | To do |
| 9 | Web: the socket client in `src/lib`, the server action that mints tickets, reconnection and the polling fallback; Vitest | To do |
| 10 | Web: the order page and "Đơn của tôi" follow their orders and refresh at `windowEnd`; the Đơn tab and an order's page follow the seller; the unread badges | To do |
| 11 | Web: the chat after Figma 125:5155 and WK8 (349:36918), with the order card, the note under the input, "Đã xem" and the read-only state; "Nhắn quán" on the order page and the pickup card; the seller's chat with "Nhắn khách"; TanStack Query; both catalogs | To do |
| 12 | The stub backend, and Playwright specs with `page.routeWebSocket` at 390, 768 and 1440, with axe | To do |
| 13 | Regenerate the mobile client from the new OpenAPI document | To do: needs Dart |
| 14 | Deploy to staging, check the chat on two phones, record it in `verification.md`; consolidate and move the increment to `completed` | To do |

Two pull requests. The first, steps 1 to 8, is the backend with the proxy settings, merged first so the web can use the regenerated client. The second, steps 9 to 12, is the web. Each step is one commit.
