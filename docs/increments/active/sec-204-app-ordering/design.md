# SEC-204 — Ordering in the app for customers: design

Decided by Đạt on 8 November 2026 (SEC-12): the app is for customers only, stores keep the web, and the app matches the web's customer flow in full, live status included. There is no reduced first version. Push and opening shared links in the app (universal links, App Links) come after. Tracked in Linear as SEC-204. The server does not change; every operation below already serves the web ([order spec](../../../specs/order.md), [offer spec](../../../specs/offer.md), [platform spec › The live socket](../../../specs/platform.md)).

## What a customer can do

The web's customer flow, screen for screen, with the same words from the same catalogs:

- **Choose a place** from the home's header: "Gần tôi" (the device's location, asked only from that button), Tasco Mall, or a typed place; remembered on the phone. Distances follow it.
- **Search** at `/search` with the web's parameters (`q`, `kind`, `now`, `near`, `radiusKm`, `minPrice`, `maxPrice`, `from`, `to`, `sort`) and its five recent searches.
- **Open a store** at `/sellers/:id` from any card: its cover, facts, directions, kind tabs, search, tonight's dishes with a stepper, a dish's sheet, share and follow. `/offers/:id` opens the store at that dish, as on the web.
- **Keep a cart** across stores, on the phone, until it is ordered; lines past their window are marked and left out.
- **Place the order** without an account: who collects (name, phone number, remembered), the confirmation of the number, one order per store under one checkout, the running promotions shown before and the discount shown after, and the "dish just sold out" sheet.
- **Follow orders** in the Orders tab (open and ended) and on an order's page: the window and its countdown, the steps, the QR when ready, cancelling, the review, a problem report, the chat with the store, all updated live.
- **Keep favourite stores** in the Saved tab, on the phone until signed in, then on the account.

## Where the app differs from the web

### 1. Each screen is the web's phone layout

The web's layout under 768 px is the reference for each screen: its sections in its order, its states (loading, empty, error, sold out, ended) and its words. Widgets shared by several screens go into `app_ui` with an `App` prefix and a widget test: the quantity stepper, the bottom sheet's frame, the sticky bar, the status pill, the order ticket, the chat bubble. The colours, type and spacing are the tokens' ([mobile guideline](../../../guidelines/mobile.md)). Each new string goes into both ARB catalogs; a text the web has is copied from `web/messages` under the same meaning.

### 2. The cart and other remembered choices live in `shared_preferences`

The web keeps the cart, the last contact, the guest's follows, the recent searches and the chosen place in `localStorage`. The app keeps each as JSON under the same name in `shared_preferences` (the Flutter team's package), read once at start into a Riverpod notifier and written on each change. None is a secret. The cart is the web's model (`web/src/features/cart/cart.ts`): one basket per store, each line a snapshot of the offer, clamped to the units left, a line past its window left out of totals and ordering, re-checked every 30 seconds.

### 3. A guest's orders are found by their access, kept in secure storage

An order placed without an account answers its access once. The web keeps up to 20 pairs of order and access in an httpOnly cookie (`web/src/features/orders/order-access.ts`); the app keeps the same list, newest first, at most 20, in `flutter_secure_storage` beside the session, and sends `Order-Access` on every call about that order. The Orders tab lists the account's orders when signed in and the kept orders otherwise, as `read-orders.ts` does, dropping one the server no longer finds.

### 4. Placing sends an idempotency key per store

As `use-place-cart.ts`: one random key and one checkout id per attempt; each store's basket is placed with `Idempotency-Key: {key}:{sellerId}` and the same `checkoutId`, its access kept and its basket removed as soon as it is placed; the first order opens when all are placed. A sold-out or unavailable dish re-reads each line, cuts the basket to what is left and opens the sheet that offers the rest, placed with the same key. Every other failure shows the server's `detail` and its reference.

### 5. Live status over one WebSocket, kept while the app is in front

The app follows `GET /live` as `web/src/lib/live-client.ts` does: one socket for the app, a ticket per `order:{id}` topic minted at each connection, `subscribe` frames, the server's `order`, `message`, `seen`, `refused` and `resync`, a re-read after each subscription answered, reconnection after 1, 2, 4, 8, 16 and 30 seconds with jitter, polling every 15 seconds after three failures, the chat polling every 5 seconds while the socket is down. Unlike a browser tab, an app is paused in the background: the socket is closed when the app leaves the foreground and opened again, with a re-read of what is shown, when it returns. The package is `web_socket_channel`, the Dart team's.

### 6. The QR, directions, calls, sharing and the map use the platform

- The order's QR encodes its id, as the web's, drawn by `qr_flutter`.
- "Chỉ đường" opens Google Maps' directions URL, "share" opens the system share sheet, both through the Flutter team's `url_launcher` and `share_plus`.
- The store's map uses the web's self-hosted map at `/map/` through `maplibre_gl`, the MapLibre project's Flutter plugin, so no map service is added. The site serves the style the web builds in JavaScript as a file, `GET /map-style.json` (SEC-206), with its URLs on the origin it was asked on, so staging's style points at staging's tiles; the app reads it from the API's origin without `/api`. The map is still, as the web's: no gesture, the camera at street zoom inside Hanoi's bounds, the brand-coloured pin at its centre, the attribution kept, and a tap opening the directions. MapLibre Native reads the `pmtiles://` archive on Android and iOS; the browser preview draws no map, as MapLibre there needs the PMTiles protocol registered by the page.
- "Gần tôi" reads the device's position once through `geolocator`, after the button is pressed, and asks for permission then; Android and iOS declare the "when in use" location permission with the reason in Vietnamese and English.

### 7. The order limits arrive with SEC-158

PR #212 adds a cap per dish in one order (`perOrderMax`, the store's or the admin's default of 5) and at most two open orders per phone number at one store. The app's stepper and sheet stop at the cap and show the server's words for a refusal, as the web does. The client is generated again once that pull request is merged; until then the cap is the units left.

## Boundary

- **In:** the customer screens listed above, their state, storage and live updates, in `mobile/lib/features/` by the Go module they talk to (`offer`, `seller`, `order`, `chat` under `order`), and their widgets in `app_ui`.
- **Out:** any server change; push (a decision still to make); opening shared links in the app; the store's screens (stores use the web); payment by transfer, which the web marks "sắp có".

## Packages

Each arrives with its first consumer ([mobile guideline › Stack](../../../guidelines/mobile.md#stack)), at its newest release:

| Package | Maintainer | For |
| --- | --- | --- |
| `shared_preferences` | Flutter team | Cart, last contact, follows, recent searches, place |
| `web_socket_channel` | Dart team | The live socket |
| `url_launcher`, `share_plus` | Flutter team, Flutter Community (Plus) | Directions, calls, sharing |
| `qr_flutter` | Its authors, the most used QR package | The order's QR |
| `uuid` | Dart community, the most used | Idempotency keys, checkout id |
| `geolocator` | Baseflow | "Gần tôi" |
| `maplibre_gl` | MapLibre | The store's map from `/map-style.json` (plan step 4) |

## Verification plan

- Unit tests for the cart's rules, the contact's normalisation, the kept accesses, the live client's reconnection and polling (with a fake socket and clock), as the web's tests do.
- Widget tests for each screen's states, with the repositories overridden.
- On an Android emulator against the stub backend and then staging: browse, add, place as a guest and signed in, the sold-out sheet, the order page turning ready live when the store marks it on the web, cancel, review, a problem report, the chat both ways, the app sent to the background and brought back, favourites before and after signing in.
