package media

import (
	"time"

	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// The module's failures.
var (
	ErrPhotoInvalid = platform.NewFailure("MEDIA_PHOTO_INVALID", platform.CategoryValidation,
		"Choose a JPEG, PNG or WebP photo of at most 10 MB.")
	ErrPhotoNotFound = platform.NewFailure("MEDIA_PHOTO_NOT_FOUND", platform.CategoryNotFound,
		"The photo does not exist.")
	ErrUnusedPhotoLimit = platform.NewFailure("MEDIA_UNUSED_PHOTO_LIMIT", platform.CategoryLimitExceeded,
		"You have 20 photos not used yet; use one before uploading more.")
	ErrDailyPhotoLimit = platform.NewFailure("MEDIA_DAILY_PHOTO_LIMIT", platform.CategoryLimitExceeded,
		"You have uploaded 100 photos today; try again tomorrow.").WithRetryAfter(time.Hour)
	ErrStoreUnavailable = platform.NewFailure("MEDIA_STORE_UNAVAILABLE", platform.CategoryServiceUnavailable,
		"Photos cannot be stored right now; try again in a minute.").WithRetryAfter(time.Minute)
)
