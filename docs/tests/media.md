# media: verification matrix

Requirements of [docs/specs/media.md](../specs/media.md) and the checks that hold them. Paths are under `server/`.

| Requirement | Check |
| --- | --- |
| The EXIF orientation is applied, and no EXIF (location included) survives; both sizes fit 1,600 and 400 pixels | `TestRenderTurnsThePhotoAndDropsItsMetadata` (`internal/media/photo_image_test.go`), on a JPEG carrying orientation 6 and a GPS block |
| A small photo is not enlarged; transparency becomes white | `TestRenderKeepsASmallPhotoAndWhitensTransparency` |
| WebP is read | `TestRenderReadsWebP` |
| Text, GIF, a truncated JPEG, an image declaring 100 megapixels and one with no pixels are refused | `TestRenderRefusesWhatIsNotAPhoto` |
| An uploaded photo is served in both sizes as JPEG; an unknown one is not found | `TestMedia` › an uploaded photo is served in both sizes (`internal/media/media_test.go`) |
| Only the uploader claims a photo, and claiming again succeeds | `TestMedia` › only the uploader claims a photo |
| An account holds at most 20 unused photos; using one frees a place | `TestMedia` › an account holds at most 20 unused photos |
| An upload needs a caller and a non-empty image within 10 MB | `TestMedia` › uploads need a caller and an image within 10 MB |
| A store without an implementation stops the service | `TestUnknownStoreIsRefused` |
| Through the API: upload, set as a seller's photo, read without signing in with its headers; text refused; over 10 MB is 413; no upload without signing in | `TestService` › a photo is uploaded, set on a seller and served (`cmd/secondbite/photo_test.go`) |
| The seller's owner sets only a photo they uploaded; staff cannot; the photo is removed | `TestSeller` › the owner sets a photo they uploaded (`internal/seller/seller_test.go`) |

Not covered by a test: the limit of unused photos under concurrent uploads (the lock is the one `seller` tests for its owners), and an iPhone sending its HEIC photo as JPEG, to be tried on a device.
