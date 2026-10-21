# SEC-119 — Up to three photos on a dish and a post: design

Status: started on 21 October 2026. Tracked in Linear as SEC-119. The founder asked for it on seeing the posting drawer on a phone: a dish takes up to three photos, shown as three empty places to fill, the photo preview across the whole width, and the first photo being the cover. It changes the SEC-11 rule "one photo, required" ([SEC-11 design](../sec-11-offer-module/design.md)).

## Decision

A dish (the catalog) and an offer (a post) carry a cover and up to two more photos. The change is additive, so the mobile app, which reads one `photo`, keeps working:

| Part                  | Before     | Now                                                                                                          |
| --------------------- | ---------- | ------------------------------------------------------------------------------------------------------------ |
| Request (dish, offer) | `photoId`  | `photoId` is the cover; `morePhotoIds` (at most two, none repeated, none the cover) is optional              |
| Change                | `photoId`  | `photoId` and `morePhotoIds`; the list replaces the photos after the cover, and an empty one takes them away |
| Response              | `photo`    | `photo` stays the cover; `photos` lists every photo, the cover first                                         |
| Storage               | `photo_id` | `photo_id` stays the cover; `more_photo_ids uuid[]` (at most two) on `offer_dishes` and `offer_offers`       |

An array column, not a table of photos: no foreign key crosses modules for a photo anyway, the cover keeps the indexes and the copies orders make, and every query that reads a dish or an offer takes the column along. Each extra photo is claimed as the cover is, and a photo any of a seller's dishes or offers shows (cover or not) is one the seller may use again, so a post made from a dish shows the dish's photos.

Lists, search and orders show the cover; an order copies the cover only. The customer's dish sheet shows the chosen photo across its width, with a small button for each photo when there are several.

## The screens

- The seller's dish form and the posting drawer's "Món đột xuất" step: three places, the first across the whole width and labelled "Ảnh đại diện", two beside each other under it; an empty place opens the file picker (several photos may be chosen at once); a full one has a button to take its photo away. At least the cover is required, as before.
- The customer's dish sheet: the cover large, and buttons for the others.

## Not changed

Photos of a seller (its avatar), an order's lines, and the mobile app's screens, which read `photo` as before.
