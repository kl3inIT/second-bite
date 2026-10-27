# How to push live changes: WebSocket or server-sent events

Studied on 21 October 2026, after the live socket of SEC-117 was built. Its design chose WebSocket because the owner asked for it (decision 2 of [SEC-117](../increments/completed/sec-117-order-chat-live/design.md)), without weighing server-sent events. This note weighs the two against what Second Bite sends, against the open-source projects nearest to it, and against the libraries.

Each repository was cloned shallowly into the git-ignored `.tmp/` and read, not run; paths are relative to each repository. **Verified** means read in its code at the path given. **Not verified** means the sparse clone does not hold the file.

| Repository | Revision | What it is |
| --- | --- | --- |
| [Mattermost](https://github.com/mattermost/mattermost) | `356bdc7`, 2026-10-16 | Team chat, Go server |
| [Karrot](https://github.com/karrot-dev) backend and frontend | `b7a4e54`, `fdf8593`, 2026-09-22 | Food-saving groups, Django and Vue |
| [foodsharing](https://gitlab.com/foodsharing-dev/foodsharing) | `c4ab5f1`, 2026-10-16 | Food rescue, PHP with a Node socket server |
| [Gitea](https://github.com/go-gitea/gitea) | `6b252ca`, 2026-10-16 | Go forge |
| [immich](https://github.com/immich-app/immich) | `5db90ca`, 2026-10-16 | Photo server, NestJS and Svelte |
| [PocketBase](https://github.com/pocketbase/pocketbase) | `6f370ea`, 2026-10-08 | Go backend in one binary |
| [memos](https://github.com/usememos/memos) | `e051129`, 2026-10-16 | Go note server |
| [Medusa](https://github.com/medusajs/medusa), [listmonk](https://github.com/knadh/listmonk) | `906433a`, `a729a4a` | Commerce in Node; newsletters in Go |

## What Second Bite pushes

- **Notices from the server only.** The socket at `GET /live` carries notices that an order changed, a message was sent or a message was seen (`server/internal/platform/live.go`). A notice holds identifiers and numbers, never a message's text. The client reads the change through the API.
- **Commands go over HTTP.** Sending a message and marking messages seen are ordinary `POST` operations in the OpenAPI document.
- **The client sends one kind of frame:** a `subscribe` frame with a single-use live ticket that an authorized `POST` minted.

## The two transports

| | WebSocket | Server-sent events (`EventSource`) |
| --- | --- | --- |
| Direction | Both ways | Server to client only: "a one-way connection, so you can't send events from a client to a server" ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)) |
| Reconnecting | Written by the client | The browser reconnects by default, waiting the stream's `retry` time, and keeps the last event's `id` (MDN) |
| Proxies | Need the upgrade passed (`Upgrade`, `Connection`, a long read timeout); SEC-117 decision 30 | A long HTTP response; it needs buffering off |
| Middleware and logs | Leaves HTTP after the upgrade | Stays an HTTP request |
| Connections per browser | No browser cap | Over HTTP/1.1, 6 per browser and domain across all tabs; over HTTP/2 the negotiated stream limit, 100 by default (MDN) |
| Credentials | A browser socket cannot set a header | `EventSource` cannot set a header either; a ticket or a `fetch` stream is used instead |

## What the references use, and for what

- **Chat with events that the client sends uses WebSocket.**
  - **Mattermost:** its chat runs over `gorilla/websocket` (`server/channels/app/platform/web_conn.go`, the upgrader in `server/channels/api4/websocket.go:58`). Typing and reactions travel as events on the same socket (`web_conn.go:983`). Verified.
  - **Karrot:**
    - the backend is a Django Channels `JsonWebsocketConsumer`, which reads the token from a subprotocol for its Cordova app (`karrot/subscriptions/consumers.py`);
    - the client sends `away`, `back` and `ping`, which keep presence (`consumers.py:83-97`);
    - the frontend uses `reconnecting-websocket` with a 500 ms reconnect interval (`src/base/services/websocket.js:3,49`);
    - verified.
  - **foodsharing:** a socket.io server of its own (`websocket/src/WebSocket/SocketIOServerFacade.ts`). Verified.
  - **immich:** `socket.io-client` at `/api/socket.io` (`web/src/lib/stores/websocket.ts:12,51-52`). Verified.
  - **Gitea:** depends on `github.com/coder/websocket` v1.8.15 (`go.mod:29`) and serves it at `/-/ws` (`routers/web/web.go:609`). Verified; its handler is not in the sparse clone, so not verified.
- **A push that only says what changed uses server-sent events.**
  - **PocketBase:**
    - its realtime API opens the stream with `GET /api/realtime` as `text/event-stream` and sends `PB_CONNECT` with the client's identifier (`apis/realtime.go:37,43-61,90`);
    - the client then chooses its topics with an authenticated `POST` to the same path (`realtime.go:38,184`). That is the shape of Second Bite's ticket, split over two requests;
    - verified.
  - **memos:**
    - `/api/sse` refreshes memos live, with a heartbeat comment every 30 s (`server/api/sse_handler.go`);
    - the web opens it with `fetch` and an `Authorization: Bearer` header, not `EventSource` (`web/src/hooks/useLiveMemoRefresh.ts:402-405`);
    - verified.
  - **Medusa and listmonk** stream admin events and workflow progress as `text/event-stream`: Medusa in `packages/medusa/src/api/admin/workflows-executions/[workflow_id]/subscribe/route.ts:21`, listmonk in `cmd/events.go:13-16`. Verified.

The line the references draw: when the client sends events of its own on the live channel (typing, reactions, presence), they choose WebSocket. When the server only says that something changed and the client reads it again, they choose server-sent events.

## Where Second Bite stands

- **By what it sends, Second Bite is in the second group.** Server-sent events in PocketBase's shape would carry it: a stream per tab, and topics chosen with a ticket.
- **WebSocket still holds, for three reasons:**
  - **It is built and tested.** It has a heartbeat, a read limit, a bounded queue (a slow client is closed with 1013), single-use tickets, a resync after `LISTEN` drops, a polling fallback on the web, and about 575 lines of Go tests (`live_test.go`). A switch would rewrite the server, the web and the mobile client for no new capability.
  - **The chat may want typing or presence later.** That is the first group's reason, and the socket would carry it as Mattermost's and Karrot's do.
  - **No per-browser cap.** A seller keeps several tabs open; over HTTP/1.1, server-sent events share six connections per browser.
- **When to reconsider:** if the live channel never needs anything from the client, and a proxy or a platform makes the upgrade costly. Server-sent events in PocketBase's shape are then the alternative.

## Libraries

### Go server

| Library | Latest, as `go list -m -json …@latest` reported on 21 October 2026 | Notes |
| --- | --- | --- |
| `github.com/coder/websocket` | v1.8.15, 2026-06-15 | Formerly `nhooyr.io/websocket`. `context.Context` on every call, safe for concurrent writes, `Ping` waits for the pong, no dependencies. Gitea uses it. **In use** |
| `github.com/gorilla/websocket` | v1.5.3, 2024-06-14 | Most used; Mattermost uses it. No `context`, and one writer at a time |
| `github.com/gobwas/ws` | v1.4.0, 2024-05-03 | Low level, for very many connections |
| `golang.org/x/net/websocket` | — | No ping or close handling; its own documentation points to other packages |

A hosted or separate realtime server (Centrifugo, Pusher, Ably) is left out by the rule to minimise SaaS and by the [self-hosted infrastructure](../guidelines/backend.md#self-hosted-infrastructure) table: in-process fan-out on one instance, `LISTEN/NOTIFY` across instances, Redis only beyond that.

### Origin check

`websocket.Accept` refuses a request whose `Origin` host differs from the request's host, unless the host matches one of the `AcceptOptions.OriginPatterns`. Each pattern is matched with `path.Match` against the origin's host, or against `scheme://host` when the pattern holds a scheme. `InsecureSkipVerify` turns the check off. The library's own documentation says "You probably want to use OriginPatterns instead", and warns against `*` (`go doc github.com/coder/websocket.AcceptOptions`).

Second Bite turns the check off (SEC-117 decision 6) for two reasons:

- authority comes from the ticket alone;
- Next.js's development proxy rewrites `Host`, so every development connection would be refused.

With the web's own origin in `OriginPatterns` outside development, a page on another site could not even open the socket. That is defence in depth: the ticket already makes such a socket worthless.

### Clients

- **Web:** the browser's own `WebSocket`, wrapped in a small client of its own (`web/src/lib/live-client.ts` in the web chat pull request, #97, not yet merged). It reconnects with jittered backoff, polls when three attempts fail and the tab is visible, and writes notices into TanStack Query's cache.
  - Karrot uses `reconnecting-websocket` for the same part.
  - `socket.io-client` needs a socket.io server and is not compatible with a plain socket.
- **Mobile, when it needs the live channel:** `web_socket_channel`, maintained by the Dart team, with the same reconnect and polling rules as the web.
