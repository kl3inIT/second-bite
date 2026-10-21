# SEC-117 — Chat on each order, and live order status: design

Status: designed on 21 October 2026, not started. Tracked in Linear as SEC-117. The owner asked for a chat between the customer and the seller on each order, and for the order pages of both to follow the order as it changes, without reloading. The screens are taken from Figma:

- mobile, section "7 · Chat với quán" (125:5155) on page "Mobile · Khách";
- web, section 349:36918, frame WK8: the chat at the left, the order card and how to collect it at the right.

It supersedes [SEC-97 decision 7](../sec-97-pickup-and-review/design.md) for "Nhắn quán", which is now built; "Trợ giúp" and "Báo vấn đề với đơn" stay unbuilt.

## What a person can do

- A customer on their order's page sees it move on its own: Chuẩn bị, then Sẵn sàng with the QR code, then Hoàn tất with the review card, or what ended it. "Đơn của tôi" moves the same way.
- A seller's people see a new order appear in the Đơn tab as soon as it is placed. An order with a message they have not read carries a badge, and an order's own page changes when the customer cancels.
- On an order still to collect, or collected less than 2 hours ago, either side taps "Nhắn quán" (the customer) or "Nhắn khách" (the seller's people) and writes. The other side sees the message at once, and the writer sees "Đã xem" once it has been read. The order's card heads the chat. Under the input it says: "Tin nhắn không đổi giá, số lượng hay giờ nhận của đơn."
- For 2 hours after the order is collected, the chat stays writable (to report a missing or wrong dish). Then, and at once when the order is cancelled, refused or expired, it can still be read but no longer written in. A read-only chat says: "Đơn đã kết thúc, chỉ xem lại tin nhắn."

## Boundary discovery

### Domain story

A customer places an order without signing in. The seller's phone, open on the Đơn tab, shows the order at once. The customer opens the order and taps "Nhắn quán": "Cho mình nhận trễ 10 phút được không?" A staff member sees the badge on the order, opens its chat, and the customer's side shows "Đã xem". The staff member answers, then presses "Báo sẵn sàng". The customer's page turns to Sẵn sàng and shows the QR code. At the counter the order is handed over, the customer's page turns to Hoàn tất with the review card. The chat stays writable for 2 hours more, then becomes read-only.

Failure paths:

- Someone who knows only the order's number or identifier asks for its messages or a ticket, and gets "not found".
- The connection drops (a tunnel, a phone asleep, an instance replaced). The page reconnects, reads the order and the messages it missed, and goes on. When it cannot connect at all, it asks again every few seconds.
- A message is sent at the moment the order is cancelled or refused. If that committed first, the message is refused as closed. A hand-over does not close the chat, so a message sent at that moment is accepted.
- A staff member is removed from the seller. Their open connection keeps their subscription only until it is renewed (at most 30 minutes). The renewal mints a new ticket, and the minting refuses them.

### Glossary

- **Chat:** the messages of one order between its customer and the seller's people. One order has at most one chat, created by its first message.
- **Message:** a text one side wrote in a chat, numbered in its chat from 1 (`seq`). It comes from a side, not from a person: `customer` or `seller`, where any of the seller's people writes as the seller.
- **Seen:** for each side, the highest `seq` that side has read. "Đã xem" shows under the writer's last message whose `seq` the other side has seen.
- **Open chat:** a chat whose order is open: its status `confirmed` or `ready` with its window not over (the status as every read computes it), or `collected` less than 2 hours ago. Only an open chat takes messages.
- **Topic:** what a connection follows: `order:{orderId}` for one order, or `seller:{sellerId}` for the orders of one seller.
- **Live ticket:** a short-lived, single-use proof, minted by an authenticated HTTP call, that its holder may follow one topic.
- **Notice:** what the server pushes on a topic. It names what changed (an order, a message, seen) with identifiers and numbers only, never the text.

### Commands, facts and read models

| Command | Who | Fact | Pushed as |
| --- | --- | --- | --- |
| Place, cancel, ready, hand over, reopen, refuse; the system's refusal of a withdrawn offer, a moved window, expiry | As today | The order changed | `order` notice on `order:{id}` and `seller:{sellerId}` |
| Send a message | The customer (session or access), the seller's people | A message was sent | `message` notice on both topics |
| Mark seen up to `seq` | The same | A side saw | `seen` notice on `order:{id}` |
| Mint a live ticket | Whoever may read the order today; the seller's people for a seller topic | — | — |

Read models: an order's messages with both sides' seen marks, and each order's unread count for its reader, carried on the order.

### Owner of data and rules

The `order` module owns the chat. A message is a fact about one order, as a review is ([SEC-97 decision 1](../sec-97-pickup-and-review/design.md)): it has the same actors, the same authorization, the order's status decides whether it may be written, and it is read on the order's pages. Sending checks the order inside one transaction, which another module could not do without a race. It needs no module of its own ([boundary discovery](../../../conventions.md#boundary-discovery): prefer fewer modules). What differs, its retention and its deletion with an account, is a lifecycle the module can own beside its orders.

The connections, fan-out across instances and heartbeats are technical and know no module. They go in `internal/platform` as `platform.Live`, with topics as plain strings. The tickets, which decide who may follow what, stay with `order`.

### Communication

No new edge between modules. `order` already uses `identity`, whose `AccountDeletedEvent` it now follows. The notices are not events between modules. They go from `order` to the platform's hub inside the transaction, through PostgreSQL `NOTIFY`, and from there to the connections.

## Decisions

| # | Decision | Why |
| --- | --- | --- |
| 1 | The chat lives in the `order` module: tables `order_chats` and `order_messages`, operations under `/orders/{orderId}/messages` | See [Owner of data and rules](#owner-of-data-and-rules) |
| 2 | One WebSocket endpoint, `GET /live`, carries the notices of any number of topics, at most 20 per connection. It serves the customer's order page, "Đơn của tôi", the seller's Đơn tab and an order's page | The owner asked for WebSocket. One connection per tab, not one per order; 20 is the number of orders the browser keeps without an account |
| 3 | The socket reads no cookie or Bearer. It follows a topic only for a **live ticket**, sent in a `subscribe` frame after the connection opens. A ticket is minted by `POST /orders/{orderId}/live-ticket` or by `POST /sellers/{sellerId}/orders/live-ticket`. The customer is authorized as `getOrder` authorizes them (the session, or `Order-Access`), and the seller's people as `staffOf` authorizes them (`MyRole` set). Admins, whom `getOrder` admits, are left out on purpose (decision 22) | A browser WebSocket cannot set `Order-Access`, and the access must never be in an address. Minting through an ordinary operation reuses the existing authorization and the cross-origin check on cookie-authenticated POSTs. A socket that ignores ambient credentials cannot be hijacked from another site. Knowing an order's identifier grants nothing |
| 4 | A ticket is 256 random bits, valid 30 seconds, for one topic, used once. Only its SHA-256 is stored, in `order_live_tickets`, so any instance can redeem it. A schedule purges expired tickets | Minting and connecting can land on different instances. A stolen database row is useless, and an observed frame is useless after one use |
| 5 | The ticket travels in the first frames, never in the URL or a subprotocol | Proxies log URLs, and a subprotocol is a header proxies may log and that the server must echo |
| 6 | The socket accepts any `Origin` (`InsecureSkipVerify` in coder/websocket, with the reason written beside it) | Authority comes from the ticket alone (decision 3). Next.js's development proxy rewrites `Host`, so the library's same-host check would refuse every development connection |
| 7 | Library: `github.com/coder/websocket` (v1.8.15, ISC licence, no dependencies). Recorded in the [backend guideline](../../../guidelines/backend.md) | It takes a `context.Context` everywhere, is safe for concurrent writes, has `Ping` that waits for the pong, and finds the hijacker through `Unwrap`, which the platform's `statusRecorder` has. gorilla/websocket, which the vendored `golang-popular-libraries` skill names, has no context, allows one writer at a time and has had no release since 2024. `golang.org/x/net/websocket` lacks ping and close handling |
| 8 | Not huma: the socket is a plain `mux.Handle("GET /live", …)` assembled in `cmd/secondbite`, as `/livez` is. `platform.Live` is given `order`'s function that redeems a ticket for its topic, so the platform knows no module. Its frames are documented in the [order spec](../../../specs/order.md). The ticket and message operations are huma operations in the OpenAPI document | huma cannot describe a WebSocket. Everything that needs authorization stays in the contract |
| 9 | Across instances: PostgreSQL `LISTEN/NOTIFY` on channel `secondbite_live`. `order` calls `pg_notify` in the transaction that makes the change. Each instance holds one dedicated listening connection and passes each notice to its own sockets on that topic | The [backend guideline](../../../guidelines/backend.md#self-hosted-infrastructure) decides this: in-process fan-out on one instance, `LISTEN/NOTIFY` across instances, Redis only beyond that. Staging runs one server container, so this is the guideline's path until Redis is needed. `NOTIFY` is transactional: delivered on commit, never for a rollback. The River outbox (`platform.Publish`) cannot carry the notices: a job runs once, on whichever instance takes it, so it cannot reach sockets held on every instance, and it adds the queue's fetch delay. `Publish` stays the way modules tell each other facts. `NOTIFY` is only the push to connections |
| 10 | A notice carries identifiers, a status and numbers, never a message's text or a name. On a message notice the client fetches the text through the authorized `GET …/messages?after=` | Fan-out needs no read per notice, nothing personal goes through `NOTIFY` or the hub, and every read of content goes through the module's authorization |
| 11 | Every path that changes an order notifies: place, cancel, ready, hand over, reopen and refuse; `RefuseWithdrawnOffer`; `FollowOfferWindow` (the times change); and `ExpireEnded`, whose statement notifies for each order it expires. A notice goes to `order:{id}` and to `seller:{sellerId}` | The owner's list: confirmed (Chuẩn bị), ready, collected, cancelled, refused, expired. There is no delivery and no separate preparing status ([SEC-97 decision 5](../sec-97-pickup-and-review/design.md)) |
| 12 | Catch-up rebuilds state; no events are replayed. After every (re)subscription, and on a `resync` notice, a page reads its state again: the order pages by `router.refresh()`, the chat by `GET …/messages?after=<last seq>`. Notices are applied idempotently, by `seq` for messages | The page needs the current state, not the history. `order_events.id` is an identity whose values do not commit in order, and it does not cover messages or seen. The conventions forbid prebuilding an event journal |
| 13 | Heartbeat: the server pings every 25 seconds and closes a connection whose pong does not come within 10. A connection lives at most 30 minutes, then closes with 4000, and the client reconnects with new tickets | 25 seconds stays well under nginx's 60-second `proxy_read_timeout`. The renewal re-checks who may follow, such as a removed staff member (decision 3) |
| 14 | Bounds: a frame from the client is at most 4 KiB; each connection has a queue of 64 notices, and a full queue closes it with 1013 so it catches up after reconnecting; each write must finish within 10 seconds | A slow client never holds the hub back, and memory stays bounded |
| 15 | The socket handler clears the server's read and write deadlines through `http.ResponseController` before it accepts. On SIGTERM the hub closes every socket with 1001, and the clients reconnect to another instance. The access log records one line per connection, when it closes, with its duration | `platform.Serve` sets `ReadTimeout` 15 seconds and `WriteTimeout` 30, which would cut every socket. `Shutdown` does not track hijacked connections |
| 16 | When the listening connection drops, the hub reconnects with backoff, then sends `resync` to all its sockets | Notices sent while it was down are lost. `resync` makes every page catch up (decision 12) |
| 17 | Messages are text of 1 to 1,000 characters, trimmed. Sending takes `Idempotency-Key`, unique per order and side: the same key returns the message sent first. At most 20 messages a minute from one side of one chat (429 with `Retry-After`), and 500 in one chat | A person may send twice on a poor connection ([API discovery](../../../conventions.md#api-discovery-and-product-boundaries) point 7). The bounds stop a script holding only an order's access from flooding the seller |
| 18 | `seq` comes from `order_chats.last_seq`, raised by an upsert in the sending transaction, which serializes the messages of one chat in commit order | `after=<seq>` then never skips a message that commits late |
| 19 | Sending locks the order row for share and refuses with `ORDER_CHAT_CLOSED` unless the chat is open: the order `confirmed` or `ready` as reads compute it, its window not over, or `collected` less than 2 hours ago (`collected_at`). A cancelled, refused or expired order refuses at once | The rule "only while the order is open" holds against a hand-over, a cancellation or the window ending at the same moment. The 2 hours after collecting let a customer report a missing or wrong dish (the owner's decision) |
| 20 | Seen is kept per side: `customer_seen_seq` and `seller_seen_seq` on the chat, only ever raised. Any of the seller's people seeing counts as the seller | One seller answers, whoever holds the phone. It matches "Đã xem" in Figma 125:5155 |
| 21 | The order carries `unreadMessages` for its reader: from the seller for the customer, from the customer for the seller's people. Absent for admins | The badges on the Đơn tab, on "Đơn của tôi" and on "Nhắn quán". One join in the module's own queries |
| 22 | The chat is between the two sides only: admins neither mint tickets nor read messages | Admins read orders to answer accounts (SEC-75), not private conversations. The owner decided that no admin access is built in this issue |
| 23 | **Photos are phase 2, not built here.** | `file` serves every photo publicly at `/photos/{id}/…` to anyone who has its address. A chat photo needs private serving, authorized like the order, and its own retention: a new access model in `file`, which deserves its own issue |
| 24 | Messages are deleted 30 days after the order's window ends, by a daily schedule (`order.forget_old_chats`). The order and its events are kept | A chat is about collecting one order, and it holds personal free text. Orders are records and keep their history. The owner confirmed the 30 days |
| 25 | Deleting an account deletes the chats of the orders it placed (`order.forget_account`, listening to `identity.account_deleted`). A message stores its side, not the account of the staff member who wrote it, so a staff account's deletion leaves nothing to remove | The account's data goes with it, as favourites and memberships do ([SEC-37](../../completed/sec-37-account-deletion/design.md)) |
| 26 | Logs never hold a message's text, a ticket or an access. `order.message.sent` logs the order, the side and `seq`; `platform.live.*` logs topic counts, close codes and durations | [Logging](../../../conventions.md#logging) |
| 27 | Expiry shows at the window's end: a page also schedules its own refresh at `windowEnd`. `ExpireEnded`'s notice, up to a minute later, then confirms it | Reads compute `expired` at once, while the job runs every minute |
| 28 | The web mints its tickets in a server action, which forwards the session cookie and each order's access from the httpOnly `secondbite_orders` cookie. It runs at every (re)connect. The chat's client component calls the message operations itself, with the access it receives as a prop from the server page, as `CancelOrder` and `ReviewForm` do today | One minting path serves both the signed-in and the anonymous customer, including "Đơn của tôi", whose accesses only the server reads. The chat follows the existing pattern for an order's commands |
| 29 | When the socket cannot open three times in a row, the web polls while the tab is visible: the order pages refresh every 15 seconds, and an open chat reads `after=` every 5. Reconnection keeps trying every 30 seconds and stops the polling once it succeeds | The owner asked for a fallback. Visibility bounds the load |
| 30 | The proxies pass the upgrade: `proxy_http_version 1.1`, `Upgrade` and `Connection` headers, and `proxy_read_timeout 75s`, in `local-proxy.conf` and in the staging runbook's `location /api/` block. Development needs nothing, since Next.js's rewrite proxies upgrades (`router-server`'s `upgradeHandler`) | Without them production would quietly stay on polling. CI's "start together and exercise the routes" opens `/api/live` through the local proxy |
| 31 | Chat state in the browser is kept with TanStack Query, which arrives with this screen. A notice updates the query's data | The [web guideline](../../../guidelines/web.md#stack) brings TanStack Query with the first screen that keeps server data in the browser, and the chat is that screen |
| 32 | The owner's answers to the open questions (21 October 2026): messages are kept 30 days after the window ends (decision 24); every one of the seller's people may read and answer every chat (decision 20); the chat stays writable 2 hours after collecting (decision 19); no admin access (decision 22) | Recorded as decisions, so the table is the whole truth |
| 33 | The seller's chat screen is built like the customer's: the order's card heads the chat, and from 1024px the customer (name, phone number, status) and "Việc cần làm" stand beside it. Figma Q7 (phone) and Q5m (desktop) drew it on 21 October, after the first answer, which had asked for the customer's name and the order's status in place of the card | The owner's answer, then the frames. The web PR follows the frames |
| 34 | The read-only line reads "Đơn đã kết thúc, chỉ xem lại tin nhắn." | The owner's answer |
| 35 | Web, approved by the owner: while `unreadMessages` is above 0, the top of the order page shows a banner, "Quán vừa nhắn" (the seller's side reads "Khách vừa nhắn"), quoting the latest message, with a "Xem tin" action that opens the chat. No popup. The banner reads the latest message from `GET /orders/{orderId}/messages`, so the order payload carries a count and never message text | The order lists (`Mine`, `OfSeller`) stay free of free text, and decision 10 holds |
| 36 | Web, approved by the owner: the chat footer offers quick-reply chips that send a fixed text at once, hidden while the person types and when the chat is read-only. Customer: "Mình đang tới", "Cho mình nhận trễ 10 phút", "Quán còn món không?". Seller: "Món đã sẵn sàng", "Quán đang làm, chờ chút nhé", "Giữ món tới hết giờ nhận" | Common answers in one tap. They are ordinary messages, so the backend needs nothing new |

## The contract

### Operations

| Operation | Who | Answer |
| --- | --- | --- |
| `POST /orders/{orderId}/live-ticket`, header `Order-Access` without an account | Its customer, signed in or with its access; the seller's people | `200 {ticket, expiresAt}` for topic `order:{orderId}` |
| `POST /sellers/{sellerId}/orders/live-ticket` | The seller's people (owner or staff) | `200 {ticket, expiresAt}` for topic `seller:{sellerId}` |
| `GET /orders/{orderId}/messages?after=&limit=`, header `Order-Access` without an account | Its customer; the seller's people | `200 {messages: [{seq, from, text, sentAt}], seen: {customer, seller}, open, closesAt}` (`closesAt` only once the order is collected: when the chat turns read-only), oldest first, after `seq` `after` (0 by default), at most 100 a page (50 by default) |
| `POST /orders/{orderId}/messages` `{text}`, headers `Idempotency-Key` and `Order-Access` without an account | Its customer; the seller's people | `201` the message; the same message again for the same key |
| `POST /orders/{orderId}/messages/seen` `{upTo}`, header `Order-Access` without an account | Its customer; the seller's people | `204`; `upTo` beyond the last `seq` counts as the last |

The order gains `unreadMessages` (decision 21). The operation identifiers are `createOrderLiveTicket`, `createSellerLiveTicket`, `listOrderMessages`, `sendOrderMessage` and `markOrderMessagesSeen`, tagged `Orders`.

### The socket, `GET /live`

Frames are JSON text.

| From | Frame | Meaning |
| --- | --- | --- |
| Client | `{"type":"subscribe","ticket":"…"}` | Follow the ticket's topic |
| Server | `{"type":"subscribed","topic":"order:…"}` | Followed. The client now reads its state again (decision 12) |
| Server | `{"type":"refused"}` | The ticket was unknown, used or expired, or the connection already follows 20 topics. The client mints again |
| Server | `{"type":"order","orderId":"…","status":"ready"}` | The order changed: status, times or reason |
| Server | `{"type":"message","orderId":"…","seq":7,"from":"customer"}` | A message was sent |
| Server | `{"type":"seen","orderId":"…","by":"seller","seq":7}` | A side saw up to `seq` |
| Server | `{"type":"resync"}` | Notices may have been lost. Read every followed state again |

Close codes: 1001 when the instance stops, 1008 for a frame that breaks the protocol, for a 41st subscribe frame (refused ones count) and for a connection that follows nothing within 10 seconds, 1009 for a frame over 4 KiB, 1013 when the queue is full, and 4000 when the connection reaches 30 minutes. The client reconnects after each, with backoff of 1, 2, 4, 8, 16, then 30 seconds and jitter.

### Failures

| Code | Status | When |
| --- | --- | --- |
| `ORDER_MESSAGE_INVALID` | 400 | Empty after trimming, or over 1,000 characters |
| `ORDER_IDEMPOTENCY_KEY_INVALID` | 400 | As for placing an order |
| `ORDER_NOT_FOUND` | 404 | No such order, or the caller is neither its customer nor one of the seller's people (an admin included) |
| `SELLER_NOT_FOUND` | 404 | A seller ticket for a seller the caller is not one of the people of |
| `ORDER_CHAT_CLOSED` | 409 | Sending when the order is cancelled, refused or expired, or more than 2 hours after it was collected |
| `ORDER_CHAT_FULL` | 409 | The chat already holds 500 messages |
| `ORDER_MESSAGES_TOO_FAST` | 429 | More than 20 messages in a minute from one side, with `Retry-After` |

Each code declares its words in Vietnamese and English beside it (`platform.Words`), which the stub backend reads too.

## Data

Two migrations, numbered after the highest on `main` when the branch merges (`0025` and `0026` today):

- `0026_order_create_chats.sql`:
  - `order_chats`: order (primary key, references `order_orders`, cascades), `last_seq`, `customer_seen_seq`, `seller_seen_seq` (integers, not negative, seen never beyond `last_seq`).
  - `order_messages`: order and `seq` (primary key), sender (`customer` or `seller`), text (1 to 1,000 characters), idempotency key (unique with order and sender), when sent. An index on order and when sent serves the per-minute bound.
- `0027_order_create_live_tickets.sql`: `order_live_tickets` holds the SHA-256 of a ticket (primary key), its topic and when it expires, with an index on the expiry.

| Table | Lifecycle |
| --- | --- |
| `order_chats`, `order_messages` | Deleted 30 days after the order's window ends, or when the account that placed the order is deleted |
| `order_live_tickets` | Deleted when redeemed (`DELETE … RETURNING`, so a ticket works once), or by the purge every 10 minutes |

The listening connection is one connection per instance outside the pool's work. `SECONDBITE_DATABASE_MAX_CONNS` and the runbook count it.

## Failure behavior

- **The database is down:** minting and messages answer 503 as every operation does. The hub keeps its sockets and retries listening, and sends `resync` once it listens again.
- **An instance stops:** its sockets close with 1001, and the clients reconnect to another instance and catch up.
- **A notice is lost** (listening dropped, a queue overflowed): `resync` or the reconnect makes every page read its state again.
- **The socket never opens** (a proxy without the upgrade, a network that blocks it): the pages poll (decision 29), and the chat still works through its operations.
- **A message is sent twice:** the second answers the first (decision 17).
- **The order ends while a message is written:** the message is refused with `ORDER_CHAT_CLOSED`, and the chat turns read-only on the `order` notice (for a cancelled, refused or expired order at once; for a collected one, when the 2 hours end, which the page computes from the order).

## Verification plan

- **Go, against PostgreSQL in a container**, in the order module:
  - sending, the trimmed text, `seq` in commit order under concurrent senders, and the idempotent resend;
  - accepted up to 2 hours after collecting and refused after; refused at once when cancelled, refused and at the window's end, including a send racing a cancellation or a refusal;
  - the per-minute and per-chat bounds;
  - seen only rising, and `unreadMessages` on the order for each reader;
  - who may read, send and mint: the session, the access, the seller's owner and staff; a stranger holding only the identifier, a wrong access and an admin get 404;
  - every changing path notifies, and a rolled-back change notifies nothing;
  - `forget_account` and `forget_old_chats`, each run twice.
- **Go, the platform hub:**
  - two `platform.Live` on one database: a notice committed through one reaches a socket on the other;
  - a ticket works once, and an expired one is refused;
  - the 20-topic and 4 KiB bounds, a full queue closing with 1013, a missed pong closing the connection, and 4000 at the lifetime;
  - `resync` after the listening connection is killed;
  - a socket outliving the server's `WriteTimeout`, and 1001 on shutdown.
- **Go, the assembled service** (`cmd/secondbite`): `/live` upgrades through the whole middleware chain.
- **OpenAPI:** the contract test, then the web client regenerated.
- **Playwright** against the stub backend, which gains the ticket and message operations. `page.routeWebSocket` plays the socket, so the stub needs no WebSocket server. At 390, 768 and 1440, with axe:
  - the order page turns to Sẵn sàng with its QR code on an `order` notice, and to Hoàn tất with the review card;
  - "Đơn của tôi" moves a card;
  - the chat from "Nhắn quán" and from the pickup card shows the order card, the note under the input, sending and receiving, and "Đã xem";
  - a collected order's chat is writable for 2 hours, then read-only with the line "Đơn đã kết thúc, chỉ xem lại tin nhắn.";
  - the Đơn tab shows a new order and an unread badge;
  - with the socket refused, the order page still changes by polling.
- **Vitest:** the socket client's backoff, subscription after reconnect, and applying notices once each by `seq`.
- **The proxy:** CI's local-proxy job opens `/api/live`. After deploying, a manual check on staging opens a chat on two phones and records the result in `verification.md`.

## Trade-offs

- A message notice costs the client one more read for the text (decision 10), which is a small price for keeping content out of the hub.
- A removed staff member keeps following for up to 30 minutes (decision 13).
- A browser holds the order's access only in its cookie, so a customer who cleared cookies without an account loses the chat with the order, as they already lose the order.

## Out of scope

- Photos in the chat (decision 23, phase 2).
- The Flutter app in `mobile/`: its generated client is regenerated, but it gets no screens.
- Telling a person of a message or a status while they are off the page, by push or email (SEC-24 and later).
- Typing indicators, editing or deleting a message, and admins reading chats.

## Open questions

All answered by the owner on 21 October 2026.

| Question | Answer |
| --- | --- |
| How long are messages kept after the window ends? | 30 days, then deleted by a periodic job (decision 24) |
| Should every one of the seller's people see and answer every chat? | Yes (decision 20) |
| Should the chat stay writable for a while after the order is collected? | Yes, for 2 hours, to report a missing or wrong dish; then read-only. Cancelled, refused and expired orders lock at once (decision 19) |
| Does the seller's chat need Figma frames of its own? | Yes, and they came: Q7 and Q5m (decision 33) |
| Do disputes need admins to read a chat? | No admin access in this issue (decision 22) |
| The words of the read-only line | "Đơn đã kết thúc, chỉ xem lại tin nhắn." (decision 34) |
