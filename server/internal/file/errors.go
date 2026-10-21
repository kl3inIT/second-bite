package file

import (
	"time"

	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// The module's failures.
var (
	ErrPhotoInvalid = platform.NewFailure("FILE_PHOTO_INVALID", platform.CategoryValidation, platform.Words{
		VI: "Chọn ảnh JPEG, PNG hoặc WebP, tối đa 10 MB.",
		EN: "Choose a JPEG, PNG or WebP photo of at most 10 MB.",
	})
	ErrPhotoNotFound = platform.NewFailure("FILE_PHOTO_NOT_FOUND", platform.CategoryNotFound, platform.Words{
		VI: "Không tìm thấy ảnh này.",
		EN: "The photo does not exist.",
	})
	ErrUnusedLimit = platform.NewFailure("FILE_UNUSED_LIMIT", platform.CategoryLimitExceeded, platform.Words{
		VI: "Bạn đang có 20 ảnh chưa dùng. Dùng bớt một ảnh rồi tải thêm.",
		EN: "You have 20 files not used yet; use one before uploading more.",
	})
	ErrDailyLimit = platform.NewFailure("FILE_DAILY_LIMIT", platform.CategoryLimitExceeded, platform.Words{
		VI: "Hôm nay bạn đã tải lên 100 ảnh. Thử lại vào ngày mai.",
		EN: "You have uploaded 100 files today; try again tomorrow.",
	}).WithRetryAfter(time.Hour)
	ErrStoreUnavailable = platform.NewFailure("FILE_STORE_UNAVAILABLE", platform.CategoryServiceUnavailable, platform.Words{
		VI: "Chưa lưu được ảnh lúc này. Thử lại sau một phút.",
		EN: "Photos cannot be stored right now; try again in a minute.",
	}).WithRetryAfter(time.Minute)
)
