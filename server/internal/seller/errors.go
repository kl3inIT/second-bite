package seller

import "github.com/kl3inIT/second-bite/server/internal/platform"

// The module's failures.
var (
	ErrNotFound = platform.NewFailure("SELLER_NOT_FOUND", platform.CategoryNotFound,
		"The seller does not exist.")
	ErrNotActive = platform.NewFailure("SELLER_NOT_ACTIVE", platform.CategoryNotPermitted,
		"The seller is not active yet, or has been blocked; it cannot publish.")
	ErrOwnerRequired = platform.NewFailure("SELLER_OWNER_REQUIRED", platform.CategoryNotPermitted,
		"Only the seller's owner may do this.")
	ErrLimitReached = platform.NewFailure("SELLER_LIMIT_REACHED", platform.CategoryConflict,
		"You already own five sellers.")
	ErrDetailsInvalid = platform.NewFailure("SELLER_DETAILS_INVALID", platform.CategoryValidation,
		"Enter the seller's name and address.")
	ErrPhoneInvalid = platform.NewFailure("SELLER_PHONE_INVALID", platform.CategoryValidation,
		"Enter a phone number of 9 to 15 digits, such as 0912 345 678.")
	ErrStaffLimitReached = platform.NewFailure("SELLER_STAFF_LIMIT_REACHED", platform.CategoryConflict,
		"A seller has at most 30 people.")
	ErrAlreadyMember = platform.NewFailure("SELLER_ALREADY_MEMBER", platform.CategoryConflict,
		"This person already works for the seller.")
	ErrMemberNotFound = platform.NewFailure("SELLER_MEMBER_NOT_FOUND", platform.CategoryNotFound,
		"This person is not on the seller's staff.")
	ErrOwnerCannotLeave = platform.NewFailure("SELLER_OWNER_CANNOT_LEAVE", platform.CategoryConflict,
		"The owner cannot leave the seller.")
)
