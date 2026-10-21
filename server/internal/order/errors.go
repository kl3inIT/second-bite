package order

import "github.com/kl3inIT/second-bite/server/internal/platform"

// The module's failures.
var (
	ErrLinesInvalid = platform.NewFailure("ORDER_LINES_INVALID", platform.CategoryValidation, platform.Words{
		VI: "Một đơn gồm một đến mười món khác nhau của một quán, mỗi món ít nhất một phần.",
		EN: "An order holds one to ten different offers of one seller, each at least one unit.",
	})
	ErrContactInvalid = platform.NewFailure("ORDER_CONTACT_INVALID", platform.CategoryValidation, platform.Words{
		VI: "Nhập tên từ 1 đến 50 ký tự và số điện thoại Việt Nam 10 số, bắt đầu bằng 0.",
		EN: "Give a name of 1 to 50 characters and a 10-digit Vietnamese phone number starting with 0.",
	})
	ErrIdempotencyKeyInvalid = platform.NewFailure("ORDER_IDEMPOTENCY_KEY_INVALID", platform.CategoryValidation, platform.Words{
		VI: "Gửi Idempotency-Key dài 1 đến 255 ký tự, và gửi lại đúng khoá đó khi đặt lại đơn.",
		EN: "Send an Idempotency-Key of 1 to 255 characters, the same one when sending the order again.",
	})
	ErrWindowsDoNotMeet = platform.NewFailure("ORDER_WINDOWS_DO_NOT_MEET", platform.CategoryValidation, platform.Words{
		VI: "Các món này không có chung giờ nhận; hãy đặt riêng từng đơn.",
		EN: "These offers are not collected at a time they share; order them separately.",
	})
	ErrOfferSoldOut = platform.NewFailure("ORDER_OFFER_SOLD_OUT", platform.CategoryConflict, platform.Words{
		VI: "Có món còn ít phần hơn số bạn chọn; chưa có gì được đặt.",
		EN: "An offer has fewer units left than you asked for; nothing was ordered.",
	})
	ErrOfferUnavailable = platform.NewFailure("ORDER_OFFER_UNAVAILABLE", platform.CategoryConflict, platform.Words{
		VI: "Có món không còn bán; chưa có gì được đặt.",
		EN: "An offer is no longer on sale; nothing was ordered.",
	})
	ErrNotFound = platform.NewFailure("ORDER_NOT_FOUND", platform.CategoryNotFound, platform.Words{
		VI: "Không tìm thấy đơn này.",
		EN: "The order does not exist.",
	})
	ErrCancelTooLate = platform.NewFailure("ORDER_CANCEL_TOO_LATE", platform.CategoryConflict, platform.Words{
		VI: "Đơn không huỷ được nữa: đã đến giờ nhận, hoặc đơn đã kết thúc.",
		EN: "The order can no longer be cancelled: its collection window has opened, or it has ended.",
	})
	ErrTransitionNotAllowed = platform.NewFailure("ORDER_TRANSITION_NOT_ALLOWED", platform.CategoryConflict, platform.Words{
		VI: "Đơn đã kết thúc: đã nhận, đã huỷ, bị từ chối, hoặc đã hết giờ nhận.",
		EN: "The order has ended: it was collected, cancelled, refused, or its window is over.",
	})
	ErrOutsideWindow = platform.NewFailure("ORDER_OUTSIDE_WINDOW", platform.CategoryConflict, platform.Words{
		VI: "Chỉ giao đơn trong giờ nhận.",
		EN: "The order is handed over within its collection window.",
	})
	ErrDayInvalid = platform.NewFailure("ORDER_DAY_INVALID", platform.CategoryValidation, platform.Words{
		VI: "Hãy chọn một ngày có thật, dạng YYYY-MM-DD.",
		EN: "Name a day that exists, as YYYY-MM-DD.",
	})
	ErrRefusalInvalid = platform.NewFailure("ORDER_REFUSAL_INVALID", platform.CategoryValidation, platform.Words{
		VI: "Chọn lý do là not_suitable, wrong_items hoặc other, kèm ghi chú tối đa 200 ký tự.",
		EN: "Give a reason among not_suitable, wrong_items and other, and a note of at most 200 characters.",
	})
)
