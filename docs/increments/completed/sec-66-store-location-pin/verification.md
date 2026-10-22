# SEC-66 — A store's real location, pinned on a map: verification

Run on 21 and 22 October 2026 on Windows 11, then on staging (`secondbite.vadan.app`).

## Checks

| Part | Outcome |
| --- | --- |
| Backend | `golangci-lint` 0 issues; every package's tests pass (`go test -p 2 ./...`), among them `testLocationIsHanoiAndAMoveIsTold`, `testOrdersAndOffersFollowTheSeller`, `TestWritten`, `TestPlaces`, `TestSearchAsksInHanoiWithAUserAgent` and `TestService` › a pin outside Hanoi is refused and suggestions need a caller; the contract regenerated (`api/openapi.yaml`) with the web's and the app's clients |
| Web | `pnpm check` green (138 unit tests, among them the style validated by MapLibre's validator and mutation-checked, and the address-fill rule); Playwright `store-location`, `open-store`, `admin-sellers`, `store-home`, `store-orders` on Pixel 7 and Desktop Chrome, with axe on each page |
| CI | Pull requests #107, #112, #113 and #114 green before merging |

## Against the real service

- **Map service:** `/map/hanoi.pmtiles` answers a byte range with 206, `Accept-Ranges: bytes`, a strong ETag and no compression; the glyphs and the sprites answer 200, through Nginx Proxy Manager's `location /map/` on host 10.
- **Picker on staging,** in Chromium as a Pixel 7 and a desktop: a two-finger pinch and the mouse wheel zoom to 19; the picker opens at street level; the address under the pin reads "Ngõ 68 Đường Phú Diễn, Phường Phú Diễn, Hà Nội" where it first read "Kẻ Diễn".
- **Suggestions on staging:** "12 pho hoa lam" suggests "12 Ngõ 121 Phố Hoa Lâm, Việt Hưng, Hà Nội" first; after #114, no place outside Hà Nội.
- **The demo's whole flow on staging,** 22 October 2026, with temporary accounts removed afterwards: a seller opened a store from a suggested address, posted a dish with a photo; a guest found it on the home page and ordered it; the seller marked it ready and handed it over; the guest rated it; an admin saw the store and its pin. All ten steps passed; the store, its dish, the order and the accounts were then deleted, their audit labels forgotten.
