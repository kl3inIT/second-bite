package identity

import (
	"time"

	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// The module's failures.
var (
	ErrEmailInvalid = platform.NewFailure("IDENTITY_EMAIL_INVALID", platform.CategoryValidation, platform.Words{
		VI: "Nhập một địa chỉ email, ví dụ ten@gmail.com.",
		EN: "Enter one email address, such as name@example.com.",
	})
	ErrCodeLimitExceeded = platform.NewFailure("IDENTITY_CODE_LIMIT_EXCEEDED", platform.CategoryLimitExceeded, platform.Words{
		VI: "Bạn đã xin quá nhiều mã cho email này. Đợi một lúc rồi thử lại.",
		EN: "Too many codes were asked for this address. Wait before asking again.",
	})
	ErrChallengeGone = platform.NewFailure("IDENTITY_CHALLENGE_GONE", platform.CategoryGone, platform.Words{
		VI: "Mã này đã hết hạn hoặc đã dùng. Gửi lại mã mới.",
		EN: "This code has expired or was already used. Ask for a new code.",
	})
	ErrCodeAttemptsExhausted = platform.NewFailure("IDENTITY_CODE_ATTEMPTS_EXHAUSTED", platform.CategoryGone, platform.Words{
		VI: "Bạn đã nhập sai quá nhiều lần. Gửi lại mã mới.",
		EN: "Too many wrong codes. Ask for a new code.",
	})
	ErrCodeIncorrect = platform.NewFailure("IDENTITY_CODE_INCORRECT", platform.CategoryValidation, platform.Words{
		VI: "Mã chưa đúng. Xem lại email mới nhất rồi nhập lại.",
		EN: "The code is not right. Check the latest email and try again.",
	})
	ErrSessionInvalid = platform.NewFailure("IDENTITY_SESSION_INVALID", platform.CategoryUnauthenticated, platform.Words{
		VI: "Phiên đăng nhập đã hết. Đăng nhập lại để tiếp tục.",
		EN: "Your session has ended. Sign in again.",
	})
	ErrSessionUnavailable = platform.NewFailure("IDENTITY_SESSION_UNAVAILABLE", platform.CategoryServiceUnavailable, platform.Words{
		VI: "Chưa kiểm tra được phiên đăng nhập. Thử lại sau giây lát.",
		EN: "Your session could not be checked. Try again shortly.",
	}).WithRetryAfter(5 * time.Second)
	ErrGoogleNotConfigured = platform.NewFailure("IDENTITY_GOOGLE_NOT_CONFIGURED", platform.CategoryServiceUnavailable, platform.Words{
		VI: "Chưa đăng nhập bằng Google được. Đăng nhập bằng mã gửi qua email.",
		EN: "Signing in with Google is not available; sign in with an emailed code.",
	})
	ErrGoogleTokenInvalid = platform.NewFailure("IDENTITY_GOOGLE_TOKEN_INVALID", platform.CategoryUnauthenticated, platform.Words{
		VI: "Google chưa xác nhận được việc đăng nhập. Thử lại.",
		EN: "Google's sign-in could not be confirmed; try again.",
	})
	ErrEmailNotVerified = platform.NewFailure("IDENTITY_EMAIL_NOT_VERIFIED", platform.CategoryNotPermitted, platform.Words{
		VI: "Google chưa xác nhận email này. Đăng nhập bằng mã gửi qua email.",
		EN: "Google has not confirmed this address; sign in with an emailed code.",
	})
	ErrGoogleLinkRequired = platform.NewFailure("IDENTITY_GOOGLE_LINK_REQUIRED", platform.CategoryConflict, platform.Words{
		VI: "Email này đã có tài khoản. Đăng nhập bằng mã chúng tôi gửi đến email này.",
		EN: "This address already has an account; sign in with the code we email to it.",
	})
	ErrAddressUnproven = platform.NewFailure("IDENTITY_ADDRESS_UNPROVEN", platform.CategoryConflict, platform.Words{
		VI: "Email này chưa được xác nhận: chủ email cần đăng nhập một lần bằng mã gửi qua email, rồi thử lại.",
		EN: "This address is not confirmed yet: its owner signs in once with the code we email to it, then try again.",
	})
	ErrDisplayNameInvalid = platform.NewFailure("IDENTITY_DISPLAY_NAME_INVALID", platform.CategoryValidation, platform.Words{
		VI: "Nhập tên hiển thị từ 1 đến 50 ký tự.",
		EN: "Enter a display name of 1 to 50 characters.",
	})
	ErrAccountNotFound = platform.NewFailure("IDENTITY_ACCOUNT_NOT_FOUND", platform.CategoryNotFound, platform.Words{
		VI: "Không tìm thấy tài khoản này.",
		EN: "The account does not exist.",
	})
)
