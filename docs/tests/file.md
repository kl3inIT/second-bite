# file: verification matrix

Requirements of [docs/specs/file.md](../specs/file.md) and the checks that hold them. Paths are under `server/`.

| Requirement | Check |
| --- | --- |
| The EXIF orientation is applied, and no EXIF (location included) survives; both sizes fit 1,600 and 400 pixels | `TestRenderTurnsThePhotoAndDropsItsMetadata` (`internal/file/photo_image_test.go`), on a JPEG carrying orientation 6 and a GPS block |
| A small photo is not enlarged; transparency becomes white | `TestRenderKeepsASmallPhotoAndWhitensTransparency` |
| WebP is read | `TestRenderReadsWebP` |
| Each of the eight EXIF orientations turns the photo as EXIF defines | `TestOrientationTurnsAsExifDefines` |
| Text, GIF, a truncated JPEG, an image declaring just over 24 megapixels and one with no pixels are refused | `TestRenderRefusesWhatIsNotAPhoto` |
| An uploaded photo is served in both sizes as JPEG; an unknown one is not found | `TestFile` › an uploaded photo is served in both sizes (`internal/file/file_test.go`) |
| Only the uploader claims a photo, and claiming again succeeds | `TestFile` › only the uploader claims a photo |
| An account holds at most 20 unused files; using one frees a place | `TestFile` › an account holds at most 20 unused files |
| An account uploads at most 100 files a day, even when each is used | `TestFile` › an account uploads at most 100 files a day |
| An upload needs a caller and a non-empty image within 10 MB | `TestFile` › uploads need a caller and an image within 10 MB |
| A store without an implementation stops the service | `TestUnknownStoreIsRefused` |
| Photos are kept in an S3-compatible store and served from it; a photo kept in PostgreSQL before the switch is still read from there | `TestS3Store` (`internal/file/s3_object_store_test.go`), against VersityGW, an S3 gateway in a container |
| `s3` chosen without a bucket, or a bucket that does not answer, stops the service | `TestS3StoreMustAnswer` |
| Through the API: upload, set as a seller's photo, read without signing in with its headers; text refused; over 10 MB is 413; no upload without signing in | `TestService` › a photo is uploaded, set on a seller and served (`cmd/secondbite/photo_test.go`) |
| The seller's owner sets only a photo they uploaded; staff cannot; the photo is removed | `TestSeller` › the owner sets a photo they uploaded (`internal/seller/seller_test.go`) |
| When an account is deleted, the photos it uploaded that nothing uses are deleted, objects and rows, and the one in use is still served; delivered twice, nothing more changes | `TestDeletedUploaderIsForgotten` (`internal/file/listeners_test.go`) |

Not covered by a test: a real AWS S3, R2 or Garage bucket (only a compatible gateway); the limit of unused photos under concurrent uploads (the lock is the one `seller` tests for its owners), and an iPhone sending its HEIC photo as JPEG, to be tried on a device.
