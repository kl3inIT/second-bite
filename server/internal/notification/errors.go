package notification

import (
	"time"

	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// The module's failures.
var (
	ErrEmailNotConfigured = platform.NewFailure("NOTIFICATION_EMAIL_NOT_CONFIGURED", platform.CategoryServiceUnavailable, platform.Words{
		VI: "Chưa gửi email được lúc này. Thử lại sau.",
		EN: "Email cannot be sent yet. Try again later.",
	}).WithRetryAfter(time.Minute)
	ErrEmailUnavailable = platform.NewFailure("NOTIFICATION_EMAIL_UNAVAILABLE", platform.CategoryServiceUnavailable, platform.Words{
		VI: "Chưa gửi được email. Thử lại sau giây lát.",
		EN: "The email could not be sent. Try again shortly.",
	}).WithRetryAfter(30 * time.Second)
	ErrEmailSettingsInvalid = platform.NewFailure("NOTIFICATION_EMAIL_SETTINGS_INVALID", platform.CategoryValidation, platform.Words{
		VI: "Cấu hình gửi email chưa đủ hoặc chưa đúng.",
		EN: "The email settings are incomplete or invalid.",
	})
)
