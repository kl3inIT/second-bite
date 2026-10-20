package offer

import "github.com/kl3inIT/second-bite/server/internal/platform"

// The module's failures.
var (
	ErrDetailsInvalid = platform.NewFailure("OFFER_DETAILS_INVALID", platform.CategoryValidation, platform.Words{
		VI: "Kiểm tra lại tên món, loại, đơn vị, số suất, giá, khối lượng và mô tả.",
		EN: "Check the offer's name, kind, unit, units, prices, weight and description.",
	})
	ErrDiscountTooSmall = platform.NewFailure("OFFER_DISCOUNT_TOO_SMALL", platform.CategoryValidation, platform.Words{
		VI: "Giá bán phải thấp hơn giá gốc ít nhất bằng mức giảm tối thiểu.",
		EN: "The price must be at least the minimum discount below the original price.",
	})
	ErrWindowInvalid = platform.NewFailure("OFFER_WINDOW_INVALID", platform.CategoryValidation, platform.Words{
		VI: "Khung giờ lấy món quá ngắn, quá dài, đã qua, hoặc bắt đầu quá muộn.",
		EN: "The collection window is too short, too long, already over, or starts too late.",
	})
	ErrNotFound = platform.NewFailure("OFFER_NOT_FOUND", platform.CategoryNotFound, platform.Words{
		VI: "Không tìm thấy món đăng này.",
		EN: "The offer does not exist.",
	})
	ErrChangeNotAllowed = platform.NewFailure("OFFER_CHANGE_NOT_ALLOWED", platform.CategoryConflict, platform.Words{
		VI: "Món đăng này không sửa theo cách này được nữa: đã có người đặt, đã hết giờ lấy, hoặc đã rút.",
		EN: "This offer can no longer be changed this way: units have been ordered, its window is over, or it was withdrawn.",
	})
	ErrDishNotFound = platform.NewFailure("OFFER_DISH_NOT_FOUND", platform.CategoryNotFound, platform.Words{
		VI: "Không tìm thấy món này trong danh mục.",
		EN: "The dish does not exist in the catalog.",
	})
	ErrDishLimitReached = platform.NewFailure("OFFER_DISH_LIMIT_REACHED", platform.CategoryConflict, platform.Words{
		VI: "Danh mục của quán có tối đa 100 món. Xoá bớt một món trước khi thêm.",
		EN: "A seller's catalog holds at most 100 dishes.",
	})
	ErrSearchInvalid = platform.NewFailure("OFFER_SEARCH_INVALID", platform.CategoryValidation, platform.Words{
		VI: "Kiểm tra lại tìm kiếm: một điểm trên bản đồ, khoảng thời gian kết thúc sau khi bắt đầu, loại món hợp lệ, và một điểm khi xếp theo khoảng cách.",
		EN: "Check the search: a point on the map, a time range that ends after it starts, known kinds, and a point to sort by distance.",
	})
	ErrSettingsInvalid = platform.NewFailure("OFFER_SETTINGS_INVALID", platform.CategoryValidation, platform.Words{
		VI: "Cài đặt món đăng nằm ngoài giới hạn hoặc mâu thuẫn nhau.",
		EN: "The offer settings are out of range or contradict each other.",
	})
)
