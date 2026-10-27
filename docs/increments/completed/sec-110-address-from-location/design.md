# SEC-110 — The open-store form fills the address from where the person stands: design

Status: started on 21 October 2026; delivered the same day (PR #74). Tracked in Linear as SEC-110, a child of [SEC-57](../../active/sec-57-seller-web/design.md); it follows SEC-100, which pinned a store where the person stands but left the address to be typed.

## Why

The button at the end of the address field took the browser's coordinates and left the field empty, under a note that read as if it were filled. People who press it expect the place named (Figma O1e).

## Decisions

| # | Decision | Why |
| --- | --- | --- |
| 1 | `GET /sellers/address?latitude&longitude`, for a signed-in caller, answers `{address}` | The web is a client of the Go API; the address is a seller concern (the form that opens one), so no new module |
| 2 | The server asks OpenStreetMap's Nominatim (`/reverse`, `accept-language=vi`) and writes the parts in Vietnamese order: house number and street, ward, district, city | No key or account; its usage policy (one request a second, a User-Agent naming the app) is met by a pilot of a few stores |
| 3 | Only the server calls the geocoder, with no account data, from a single place | The browser's coordinates are the only thing sent on; a provider with a key (Goong, Google) replaces it in `locate.go` |
| 4 | A point it cannot name, or a geocoder that does not answer, gives an empty address and a warning in the log, not an error | The person writes the address, as before |
| 5 | The form fills the field when it is empty or still holds what the last press wrote; an address the person typed is kept. The note says which: filled, kept, or no street found | Never overwrite what someone wrote |

## Trade-offs

- OpenStreetMap's coverage of Vietnamese house numbers is uneven; the address may stop at the street or the ward, and the person edits it.
- A public service with no agreement: if it throttles us, the field stays empty. Moving to a keyed provider is a change of one file.

## Out of scope

A keyed provider; caching points; a map to pin the store by hand.
