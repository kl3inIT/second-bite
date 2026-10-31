# SEC-144 — The owner edits a store's name, phone number and photo: design

Status: started on 22 October 2026. Tracked in Linear as SEC-144, a child of [SEC-57](../sec-57-seller-web/design.md). The API (`PUT /sellers/{id}`, `PUT /sellers/{id}/photo`) already changes a store; the web had no screen for it beyond the address and the pin ([SEC-66](../sec-66-store-location-pin/design.md)).

## Why

A store could not be changed after it was opened: a wrong name or phone number stayed, and a photo that did not upload (the form swallowed that failure) could not be set again.

## Decisions

| # | Decision | Why |
| --- | --- | --- |
| 1 | A page `/stores/{id}/edit` for the store's owner; staff are sent to the store's home | The API's `updateSeller` and `setSellerPhoto` are the owner's |
| 2 | It holds the name, the phone number and the photo, with the rules of the form that opens a store; the address and the pin keep their page, which a link leads to | One place for each thing; the map is on the location page |
| 3 | The details are saved first, the photo after; a photo that does not arrive says so with its reference, and the details stay saved | The API changes the details in one call and the photo in another |
| 4 | The entries are "Sửa quán" in the store menu above "Vị trí quán" (owners), and a pencil button at the end of each store the person owns in the list "Quán của bạn" (Figma S0c) | The founder's side asked for the button at the end of the store's line |
| 5 | A store just opened whose photo did not upload goes to this page with a notice (`?photo=failed`) | The failure is no longer swallowed, and the page is where it is put right |

## Out of scope

Removing the photo; changing the address and the pin (their page); staff editing.
