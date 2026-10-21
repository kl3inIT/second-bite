# SEC-66 — A store's real location, pinned on a map: design

Status: proposed on 21 October 2026. Tracked in Linear as SEC-66, assigned to Đạt Phan. Plan: [plan.md](plan.md).

## Why

The open-store form has no map. A store whose owner does not press the location button (SEC-100) is stored at Tasco Mall Long Biên (`web/src/features/seller/open-store-form.tsx:27`), and the button alone drifts indoors. The beta around 16 November reaches sellers outside the mall (`docs/vision.md:26`). Distance, "near me" and directions would then be wrong for them. The founder asks for the store's location, the distance from the customer and the way there (`docs/brief/second-bite-app-requirements-it.md`, section 7).

## Decisions

Decided with Đạt Phan on 21 October 2026. The scope is option A of the conversation: a map in the open-store form, a screen where the owner moves the pin later, and a map on the admin's store page. A store is `active` when opened, and whether it waits for approval is decided after the pilot (SEC-64), so the map on the admin's page is for spotting a wrong pin, not for approving.

| # | Decision | Why |
| --- | --- | --- |
| 1 | **The pin is the store's location; the written address is for people.** Distance, "near me" and directions read the pin. Moving the pin suggests an address through `GET /sellers/address`, by SEC-110's rule 5: an address the person typed is never replaced | SEC-110 already names a place from a point. Google Workspace's address editor keeps the same split: "Dragging the pin will not update the address" ([Mobbin](https://mobbin.com/screens/3f11e2b8-724f-4f2e-9df3-a306d56349c7)) |
| 2 | **A fixed pin in the centre; the person moves the map under it.** On a phone the map fills the screen, with the street under the pin above it, a button back to where the person stands and "Xác nhận vị trí" at the foot. On a computer it opens in a dialog | Grab ([Mobbin](https://mobbin.com/screens/705fc8f7-eb23-43a6-9f2d-4d9169fdebc0)), Shopee ([Mobbin](https://mobbin.com/screens/43f2269c-2e02-4efe-b755-6e6433e359ac)), Skip ([Mobbin](https://mobbin.com/screens/af898dfb-2380-41f5-b3f8-91c37fafdfda)) and talabat ([Mobbin](https://mobbin.com/screens/01342a2f-d8d9-46ae-b19a-752de522281c)) all do this. A finger never covers the pin, and the pin cannot be dropped off-screen |
| 3 | **The form shows a small map with the pin and "Chỉnh vị trí"**, which opens the map of decision 2 | Uber Eats ([Mobbin](https://mobbin.com/screens/4056d14a-1c65-4c5f-b960-8097ccc2b1a3)), Tripadvisor ([Mobbin](https://mobbin.com/screens/9428a5f6-efab-4e5a-8e64-db64d71762cf)) and Fresha ([Mobbin](https://mobbin.com/screens/92288cb2-ee98-45ad-92e3-1fb913ec3bc0)) put a small map in the address form with "Adjust pin" |
| 4 | **The location is a required field.** "Tạo quán" asks for a confirmed pin, from the map or from the location button; the mall is no longer a silent default. The map opens where the person stands when the browser allows it, otherwise at Tasco Mall | A place the device guessed is never saved by accident (VNExplore's `PickMap` shows no pin until the person acts, `Frontend/src/components/PickMap.tsx:27`). Fresha asks "Is the pin in the right location?" |
| 5 | **"Xác nhận vị trí" waits for a street-level zoom (16 or more)** and says "Phóng to để ghim đúng chỗ" until then | talabat disables "Confirm pin location" with "Please zoom in more to find your exact delivery location" ([Mobbin](https://mobbin.com/screens/01342a2f-d8d9-46ae-b19a-752de522281c)) |
| 6 | **Only Hanoi.** The map cannot be panned out of Hanoi (`maxBounds`) or zoomed out past 10 (`minZoom`). The server refuses a point outside Hanoi's box with `SELLER_LOCATION_OUTSIDE` (400), on `POST` and `PUT /sellers` | The pilot and the beta are in Hanoi (`docs/vision.md`). With no approval step, the server's check is the only guard. Since the map never shows the sea, it never shows Hoàng Sa, Trường Sa or any foreign claim (below) |
| 7 | **Only the owner moves the pin**, on a new page `/stores/{sellerId}/location`, through the existing `PUT /sellers/{sellerId}`. Staff and admins read it | `PUT /sellers/{id}` is the owner's today. The spec says admins read but never act for a seller. GrabMerchant and ShopeeFood Partner let the owner edit the location (Sapo's guides for [Grab](https://www.sapo.vn/blog/cach-thay-doi-dia-chi-tren-grab-food) and [Shopee](https://www.sapo.vn/blog/thay-doi-dia-chi-quan-tren-shopeefood)) |
| 8 | **No lock on changes.** Grab's 60 days without a change of address ([Grab](https://www.grab.com/vn/merchant/food/)) is not taken | In the pilot a wrong pin is the common case and must be fixed at once |
| 9 | **A moved store moves what is still to come.** Changing the location writes `seller.location_changed` (the seller's identifier, the point and the address) to the outbox. `offer` moves the offers whose window has not ended; `order` moves the orders still to collect (`confirmed`, `ready`). Ended offers and orders keep what they copied | Offers and orders copy the seller's point when created (`server/internal/offer/offer.go:132`, `order_orders`). A first move is usually a wrong pin corrected, and a customer on the way must see the right place. Following another module's event is how `order` already follows `offer.window_changed` (SEC-91) |
| 10 | **The admin's store page shows the pin** on a small map that only reads | Admins spot a store pinned in the wrong place and block it (SEC-75) |
| 11 | **When the map cannot load** (no WebGL, tiles unreachable), the form says so and the location button still pins the store | VNExplore wraps the map's creation and its `error` event and falls back (`Frontend/src/components/RealMap.tsx:328-334`) |

## The map

- **Libraries, at their latest versions:** `maplibre-gl` 6.15, `react-map-gl` 8.1 (`react-map-gl/maplibre`), `pmtiles` 4.5 and `@protomaps/basemaps` 5.7. The map loads only where it is shown (`next/dynamic`, no server rendering). The `pmtiles` protocol is registered once, at module scope, since it "must be added once globally" (`pmtiles` `js/src/adapters.ts:169-171`). No new Go library.
- **Style:** `layers("protomaps", flavor, { lang: "vi" })`, with the light flavor's colours moved towards [DESIGN.md](../../../../DESIGN.md), and a filter that drops boundaries marked `disputed`.
- **Data, self-hosted, no map SaaS:** one PMTiles extract of Hanoi from Protomaps' daily build (zoom 0 to 15, a few tens of MB), the Noto Sans glyphs and the light sprites from `protomaps/basemaps-assets`, and the MapLibre worker. They are served from the site's own origin under `/map/` by a small nginx container with the files mounted from the host (`/apps/secondbite-staging/map`), with byte ranges, strong ETags, no gzip, and a dated file name cached as immutable.
- **Hoàng Sa, Trường Sa and the nine-dash line:** OpenStreetMap does not map the nine-dash line, but it records the Paracels as administered by China and disputed, and Protomaps has no point-of-view option. The map therefore never leaves Hanoi (decision 6). A national map later would hide the base labels over Biển Đông and draw "Quần đảo Hoàng Sa (Việt Nam)" and "Quần đảo Trường Sa (Việt Nam)", as VNExplore does (`RealMap.tsx:75-204`).

## Studied

Cloned into `.tmp/map-refs/`: `visgl/react-map-gl`, `protomaps/basemaps`, `protomaps/PMTiles`, `protomaps/go-pmtiles`, `bikespace/bikespace` (MapLibre with PMTiles in Next.js, and how it mocks the map in tests), `KhoaNghiNoahDang/VNExplore` (a Vietnamese picker and the Biển Đông labels) and `cheeaun/busrouter-sg` (a production MapLibre and PMTiles app).

## Trade-offs

- OpenStreetMap's coverage of Hanoi's small alleys and house numbers is uneven. The pin does not depend on it, and the person edits the address.
- The tiles are a manual refresh: a new extract, a new dated file name and a deploy. For a one-city pilot that is rare.
- Moving the orders still to collect changes what the customer sees without telling them. Telling them is left to the notifications work.

## Out of scope

A national map; searching for a place by name; the Flutter application; the customer's maps (SEC-115); editing the store's other details.
