# file

Owns the files the system keeps, one row each in `file_files` whatever they are for, in the store configuration chooses; photos for offers and sellers are its first purpose (tables `file_*`). Decided in the [SEC-11 design](../increments/active/sec-11-offer-module/design.md#photos). The sources: Memos for the stores (its database or an S3-compatible store, each attachment recording its own: `store/storage.go`) and for applying the EXIF orientation before writing a photo again (`server/api/attachment_service_image.go`); PocketBase for serving files through the API; listmonk for one store interface of Put, Get and Delete (`internal/media/media.go`); Open Food Network for fixed sizes; and one table for every file, with a purpose and the key it is stored under, as Rails' `active_storage_blobs` (Open Food Network), Mattermost's `FileInfo` (a photo's width and height as columns other files leave empty) and BeyondPilot's `storage_file` (a purpose deciding the rules of its upload) keep theirs. Checks: [docs/tests/file.md](../tests/file.md).

## Operations

| Operation | Who | Answer |
| --- | --- | --- |
| `POST /photos`, the image as the body | Anyone signed in, holding fewer than 20 unused photos | `201` id, width, height, `largePath`, `smallPath` |
| `GET /photos/{photoId}/1600.jpg`, `/400.jpg` | Anyone | `200` the photo as JPEG, cached for a year (`immutable`), with `X-Content-Type-Options: nosniff` |

Published to other modules: `Claim(photo, account)`, which marks a photo used; only the account that uploaded it may claim it. `seller` claims its owner's photo; `offer` will.

## Stores

- A store keeps files by key, the key starting with what the file is (`photos/{id}/{size}.jpg`); every kind of file the system keeps later uses the same stores under its own prefix.
- Two stores, in a registry built at startup: `postgres` (table `file_blobs`) and `s3`, any S3-compatible store (AWS S3, Cloudflare R2, Garage, SeaweedFS, MinIO) through AWS's SDK, asking for checksums only where the API requires them, since several compatible stores refuse the SDK's default ones.
- `SECONDBITE_FILE_STORE` chooses the store of new files (`postgres` by default). The S3 store is configured by `SECONDBITE_S3_BUCKET`, `SECONDBITE_S3_ENDPOINT`, `SECONDBITE_S3_REGION`, `SECONDBITE_S3_ACCESS_KEY_ID`, `SECONDBITE_S3_PATH_STYLE` and the secret `SECONDBITE_S3_SECRET_ACCESS_KEY` ([runbook](../runbooks/backend.md)).
- Each photo records its store and is read from it, so photos kept before a switch stay readable. The service does not start with a store it does not know, with `s3` chosen but not configured, or with a configured bucket that does not answer within 5 seconds.
- Files are stored before the photo's row; when the row is refused, they are deleted again.

## Photos

- A photo is a JPEG, PNG or WebP of at most 10 MB and 24 megapixels (phones save 12 unless told otherwise). Its orientation from EXIF is applied, a transparent background becomes white after resizing, and it is written again as JPEG (quality 82) fitted within 1,600 and within 400 pixels, never enlarged. Writing it again drops every metadata, the location included; the original is not kept.
- At most two photos are decoded at once, each holding about 200 MB at the largest. An upload may take two minutes to arrive.
- An account holds at most 20 files it has not used, the check holding under concurrency (an advisory lock on the account), and uploads at most 100 files in 24 hours: a file once used is kept, so an owner setting photo after photo on a seller would otherwise store without bound.

## Data

| Table | Holds | Lifecycle |
| --- | --- | --- |
| `file_files` | Every file: its purpose (`photo` today), store, key (for a photo, the prefix its sizes are kept under), media type, the bytes kept for it, identity's account that uploaded it (no foreign key across modules), a photo's width and height, when it was first used | Kept |
| `file_blobs` | The PostgreSQL store's files: key, content type, bytes, stored without compression | Kept with what they belong to |

## Failures

| Code | Status | When |
| --- | --- | --- |
| `FILE_PHOTO_INVALID` | 400 | Empty, not a JPEG, PNG or WebP, unreadable, or more than 24 megapixels |
| `FILE_PHOTO_NOT_FOUND` | 404 | No such photo; or, when claiming, one another account uploaded |
| `FILE_UNUSED_LIMIT` | 429 | The account already holds 20 unused files |
| `FILE_DAILY_LIMIT` | 429 | The account uploaded 100 files in the last 24 hours; `Retry-After` 3600 |
| `FILE_STORE_UNAVAILABLE` | 503 | The store failed; `Retry-After` 60 |

A body over 10 MB answers `PLATFORM_BODY_TOO_LARGE` (413).

## Not yet

- Deleting photos unused after a day, with the first background job (SEC-11, step 6).
- `secondbite file move`, copying files from one store to another.
- Purposes other than `photo`: each arrives with the module that needs it, as a value of `purpose`, a key prefix and the rules of its upload.
- Private files, read through short-lived addresses, with the first private purpose (images in an order's conversation, SEC-19).
- Uploading straight to S3 through a presigned address, as BeyondPilot does: a photo must pass through the service to lose its metadata, so it would only add a round trip until uploads load the service.
- Serving photos from S3 or a CDN rather than through the API: their addresses stay the same either way.
