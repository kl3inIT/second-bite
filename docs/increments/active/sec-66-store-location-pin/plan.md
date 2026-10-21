# SEC-66 — A store's real location, pinned on a map: plan

Design: [design.md](design.md). One pull request from `main`, branch `dathip04/sec-66-a-stores-real-location-before-the-beta-every-store-is-pinned`.

## Server

1. `seller`: Hanoi's box and `SELLER_LOCATION_OUTSIDE` in `POST` and `PUT /sellers`; unit checks of the edges.
2. `seller`: a change of location writes `seller.location_changed` (identifier, point, address) to the outbox in the same transaction as the update.
3. `offer`: a listener moves the offers whose window has not ended; `order`: a listener moves the orders `confirmed` or `ready`. Integration checks: an ended offer and a collected order keep their point.
4. OpenAPI and the web client regenerated; `docs/specs/seller.md`, `offer.md`, `order.md`, the test matrices under `docs/tests/`.

## Map data and hosting

5. `infrastructure/map/fetch.sh`: `pmtiles extract` of Hanoi from a dated Protomaps build, `pmtiles verify`, the glyphs and sprites from `protomaps/basemaps-assets`, into a dated folder.
6. A `map` nginx service in `compose.staging.yaml` and `compose.local.yaml` (files mounted read-only, config inline as a Compose `config`), `/map/` in `local-proxy.conf`, and the Nginx Proxy Manager location in `docs/runbooks/ci-cd.md`, with the host folder in its table.
7. The MapLibre worker copied from `node_modules` into `web/public/map/` at install, so its version follows the package.

## Web

8. Install `maplibre-gl`, `react-map-gl`, `pmtiles`, `@protomaps/basemaps` at their latest versions.
9. `components/map/`: the style (Vietnamese labels, DESIGN.md colours, no disputed boundaries), the protocol registered once, a map limited to Hanoi, and two uses: choosing a point with a fixed centre pin, and showing one; the fallback when the map cannot load.
10. The open-store form: the small map with "Chỉnh vị trí", the location as a required field, the mall no longer a default, the suggested address by SEC-110's rule.
11. `/stores/{sellerId}/location`: the owner's page to move the pin, linked from the store's home; staff are sent back.
12. `/admin/sellers/{sellerId}`: the pin on a small map.
13. Words in Vietnamese and English.
14. Checks: unit tests with the map mocked (as bikespace does); Playwright for opening a store with a pin, moving it, and a point outside Hanoi refused; screenshots on a phone and a computer for review.

## Documents

15. `ARCHITECTURE.md`, the web guideline if a rule for maps is worth keeping, and the roadmap's entry.
