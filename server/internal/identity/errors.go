package identity

import (
	"time"

	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// The module's failures.
var (
	ErrEmailInvalid = platform.NewFailure("IDENTITY_EMAIL_INVALID", platform.CategoryValidation,
		"Enter one email address, such as name@example.com.")
	ErrCodeLimitExceeded = platform.NewFailure("IDENTITY_CODE_LIMIT_EXCEEDED", platform.CategoryLimitExceeded,
		"Too many codes were asked for this address. Wait before asking again.")
	ErrChallengeGone = platform.NewFailure("IDENTITY_CHALLENGE_GONE", platform.CategoryGone,
		"This code has expired or was already used. Ask for a new code.")
	ErrCodeAttemptsExhausted = platform.NewFailure("IDENTITY_CODE_ATTEMPTS_EXHAUSTED", platform.CategoryGone,
		"Too many wrong codes. Ask for a new code.")
	ErrCodeIncorrect = platform.NewFailure("IDENTITY_CODE_INCORRECT", platform.CategoryValidation,
		"The code is not right. Check the latest email and try again.")
	ErrSessionInvalid = platform.NewFailure("IDENTITY_SESSION_INVALID", platform.CategoryUnauthenticated,
		"Your session has ended. Sign in again.")
	ErrSessionUnavailable = platform.NewFailure("IDENTITY_SESSION_UNAVAILABLE", platform.CategoryServiceUnavailable,
		"Your session could not be checked. Try again shortly.").WithRetryAfter(5 * time.Second)
	ErrAccountNotFound = platform.NewFailure("IDENTITY_ACCOUNT_NOT_FOUND", platform.CategoryNotFound,
		"The account does not exist.")
)
