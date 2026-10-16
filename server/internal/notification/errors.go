package notification

import (
	"time"

	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// The module's failures.
var (
	ErrEmailNotConfigured = platform.NewFailure("NOTIFICATION_EMAIL_NOT_CONFIGURED", platform.CategoryServiceUnavailable,
		"Email cannot be sent yet. Try again later.").WithRetryAfter(time.Minute)
	ErrEmailUnavailable = platform.NewFailure("NOTIFICATION_EMAIL_UNAVAILABLE", platform.CategoryServiceUnavailable,
		"The email could not be sent. Try again shortly.").WithRetryAfter(30 * time.Second)
	ErrEmailSettingsInvalid = platform.NewFailure("NOTIFICATION_EMAIL_SETTINGS_INVALID", platform.CategoryValidation,
		"The email settings are incomplete or invalid.")
)
