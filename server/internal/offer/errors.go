package offer

import "github.com/kl3inIT/second-bite/server/internal/platform"

// The module's failures.
var (
	ErrDetailsInvalid = platform.NewFailure("OFFER_DETAILS_INVALID", platform.CategoryValidation,
		"Check the offer's name, kind, unit, units, prices, weight and description.")
	ErrDiscountTooSmall = platform.NewFailure("OFFER_DISCOUNT_TOO_SMALL", platform.CategoryValidation,
		"The price must be at least the minimum discount below the original price.")
	ErrWindowInvalid = platform.NewFailure("OFFER_WINDOW_INVALID", platform.CategoryValidation,
		"The collection window is too short, too long, already over, or starts too late.")
	ErrNotFound = platform.NewFailure("OFFER_NOT_FOUND", platform.CategoryNotFound,
		"The offer does not exist.")
	ErrChangeNotAllowed = platform.NewFailure("OFFER_CHANGE_NOT_ALLOWED", platform.CategoryConflict,
		"This offer can no longer be changed this way: units have been ordered, its window is over, or it was withdrawn.")
	ErrSearchInvalid = platform.NewFailure("OFFER_SEARCH_INVALID", platform.CategoryValidation,
		"Check the search: a point on the map, a time range that ends after it starts, a lowest price no higher than the highest, known kinds, and a point to sort by distance.")
	ErrSettingsInvalid = platform.NewFailure("OFFER_SETTINGS_INVALID", platform.CategoryValidation,
		"The offer settings are out of range or contradict each other.")
)
