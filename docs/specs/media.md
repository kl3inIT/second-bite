# media

Owns the photos uploaded for offers and sellers, and where their files are kept (tables `media_*`). Decided in the [SEC-11 design](../increments/active/sec-11-offer-module/design.md#photos), from Memos (a database store first, an S3-compatible one when configured, each attachment recording its store), PocketBase and Memos (orientation applied before resizing) and Open Food Network (fixed sizes). Checks: [docs/tests/media.md](../tests/media.md).

## Operations

| Operation | Who | Answer |
| --- | --- | --- |
| `POST /photos`, the image as the body | Anyone signed in, holding fewer than 20 unused photos | `201` id, width, height, `largePath`, `smallPath` |
| `GET /photos/{photoId}/1600.jpg`, `/400.jpg` | Anyone | `200` the photo as JPEG, cached for a year (`immutable`), with `X-Content-Type-Options: nosniff` |

Published to other modules: `Claim(photo, account)`, which marks a photo used; only the account that uploaded it may claim it. `seller` claims its owner's photo; `offer` will.

## Rules

- A photo is a JPEG, PNG or WebP of at most 10 MB and 50 megapixels. Its orientation from EXIF is applied, a transparent background becomes white, and it is written again as JPEG (quality 82) fitted within 1,600 and within 400 pixels, never enlarged. Writing it again drops every metadata, the location included.
- At most two photos are decoded at once. An upload may take two minutes to arrive.
- The store for new photos is chosen at startup by `SECONDBITE_MEDIA_STORE` (`postgres`, the default and the only store today). Each photo records its store and is read from it. The service does not start with a store it does not know.
- Files are stored before the photo's row; when the row is refused, they are deleted again.
- An account holds at most 20 photos it has not used; the check holds under concurrency (an advisory lock on the account).

## Data

| Table | Holds | Lifecycle |
| --- | --- | --- |
| `media_photos` | Store, identity's account that uploaded it (no foreign key across modules), width and height as uploaded, when it was first used | Kept |
| `media_files` | The PostgreSQL store's files: key (`photos/{id}/{size}.jpg`), content type, bytes, stored without compression | Kept with their photo |

## Failures

| Code | Status | When |
| --- | --- | --- |
| `MEDIA_PHOTO_INVALID` | 400 | Empty, not a JPEG, PNG or WebP, unreadable, or more than 50 megapixels |
| `MEDIA_PHOTO_NOT_FOUND` | 404 | No such photo; or, when claiming, one another account uploaded |
| `MEDIA_UNUSED_PHOTO_LIMIT` | 429 | The account already holds 20 unused photos |
| `MEDIA_STORE_UNAVAILABLE` | 503 | The store failed; `Retry-After` 60 |

A body over 10 MB answers `PLATFORM_BODY_TOO_LARGE` (413).

## Not yet

- Deleting photos unused after a day, with the first background job (SEC-11, step 6).
- An S3-compatible store, and `secondbite media move` to copy photos into it.
