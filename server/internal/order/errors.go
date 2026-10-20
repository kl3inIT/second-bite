package order

import "github.com/kl3inIT/second-bite/server/internal/platform"

// The module's failures.
var (
	ErrLinesInvalid = platform.NewFailure("ORDER_LINES_INVALID", platform.CategoryValidation,
		"An order holds one to ten different offers of one seller, each at least one unit.")
	ErrIdempotencyKeyInvalid = platform.NewFailure("ORDER_IDEMPOTENCY_KEY_INVALID", platform.CategoryValidation,
		"Send an Idempotency-Key of 1 to 255 characters, the same one when sending the order again.")
	ErrWindowsDoNotMeet = platform.NewFailure("ORDER_WINDOWS_DO_NOT_MEET", platform.CategoryValidation,
		"These offers are not collected at a time they share; order them separately.")
	ErrOfferSoldOut = platform.NewFailure("ORDER_OFFER_SOLD_OUT", platform.CategoryConflict,
		"An offer has fewer units left than you asked for; nothing was ordered.")
	ErrOfferUnavailable = platform.NewFailure("ORDER_OFFER_UNAVAILABLE", platform.CategoryConflict,
		"An offer is no longer on sale; nothing was ordered.")
	ErrNotFound = platform.NewFailure("ORDER_NOT_FOUND", platform.CategoryNotFound,
		"The order does not exist.")
	ErrCancelTooLate = platform.NewFailure("ORDER_CANCEL_TOO_LATE", platform.CategoryConflict,
		"The order can no longer be cancelled: its collection window has opened, or it has ended.")
	ErrTransitionNotAllowed = platform.NewFailure("ORDER_TRANSITION_NOT_ALLOWED", platform.CategoryConflict,
		"The order has ended: it was collected, cancelled, refused, or its window is over.")
	ErrOutsideWindow = platform.NewFailure("ORDER_OUTSIDE_WINDOW", platform.CategoryConflict,
		"The order is handed over within its collection window.")
	ErrCodeWrong = platform.NewFailure("ORDER_CODE_WRONG", platform.CategoryConflict,
		"The collection code is not this order's.")
	ErrCodeLocked = platform.NewFailure("ORDER_CODE_LOCKED", platform.CategoryConflict,
		"Too many wrong codes were given for this order; call Second Bite's support.")
	ErrDayInvalid = platform.NewFailure("ORDER_DAY_INVALID", platform.CategoryValidation,
		"Name a day that exists, as YYYY-MM-DD.")
	ErrRefusalInvalid = platform.NewFailure("ORDER_REFUSAL_INVALID", platform.CategoryValidation,
		"Give a reason among not_suitable, wrong_items and other, and a note of at most 200 characters.")
)
