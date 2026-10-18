package file

import (
	"time"

	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// The module's failures.
var (
	ErrPhotoInvalid = platform.NewFailure("FILE_PHOTO_INVALID", platform.CategoryValidation,
		"Choose a JPEG, PNG or WebP photo of at most 10 MB.")
	ErrPhotoNotFound = platform.NewFailure("FILE_PHOTO_NOT_FOUND", platform.CategoryNotFound,
		"The photo does not exist.")
	ErrUnusedLimit = platform.NewFailure("FILE_UNUSED_LIMIT", platform.CategoryLimitExceeded,
		"You have 20 files not used yet; use one before uploading more.")
	ErrDailyLimit = platform.NewFailure("FILE_DAILY_LIMIT", platform.CategoryLimitExceeded,
		"You have uploaded 100 files today; try again tomorrow.").WithRetryAfter(time.Hour)
	ErrStoreUnavailable = platform.NewFailure("FILE_STORE_UNAVAILABLE", platform.CategoryServiceUnavailable,
		"Photos cannot be stored right now; try again in a minute.").WithRetryAfter(time.Minute)
)
