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
	// A test email says more than any other email, so the admin can fix the
	// settings: whether the provider refused them or could not be reached. It
	// never carries the provider's own words.
	ErrTestEmailRefused = platform.NewFailure("NOTIFICATION_TEST_EMAIL_REFUSED", platform.CategoryConflict, platform.Words{
		VI: "Nhà cung cấp email từ chối gửi. Kiểm tra user và mật khẩu (hoặc khoá API), và địa chỉ gửi đã được xác minh chưa.",
		EN: "The email provider refused to send. Check the user and password (or the API key), and that the sender address is verified.",
	})
	ErrTestEmailUnreachable = platform.NewFailure("NOTIFICATION_TEST_EMAIL_UNREACHABLE", platform.CategoryServiceUnavailable, platform.Words{
		VI: "Không kết nối được nhà cung cấp email. Kiểm tra host, port và bảo mật, rồi thử lại.",
		EN: "The email provider could not be reached. Check the host, port and security, then try again.",
	})
	ErrPushNotConfigured = platform.NewFailure("NOTIFICATION_PUSH_NOT_CONFIGURED", platform.CategoryServiceUnavailable, platform.Words{
		VI: "Chưa bật được thông báo lúc này.",
		EN: "Notifications cannot be turned on yet.",
	})
	ErrPushSubscriptionInvalid = platform.NewFailure("NOTIFICATION_PUSH_SUBSCRIPTION_INVALID", platform.CategoryValidation, platform.Words{
		VI: "Trình duyệt này không bật được thông báo.",
		EN: "Notifications cannot be turned on in this browser.",
	})
	// A ticket is spent or expired: the page asks for another and subscribes
	// again.
	ErrPushTicketInvalid = platform.NewFailure("NOTIFICATION_PUSH_TICKET_INVALID", platform.CategoryValidation, platform.Words{
		VI: "Phiên bật thông báo đã hết hạn. Thử lại.",
		EN: "The request to turn on notifications expired. Try again.",
	})
	ErrEmailSettingsInvalid = platform.NewFailure("NOTIFICATION_EMAIL_SETTINGS_INVALID", platform.CategoryValidation, platform.Words{
		VI: "Cấu hình gửi email chưa đủ hoặc chưa đúng.",
		EN: "The email settings are incomplete or invalid.",
	})
)
