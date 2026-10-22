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
		VI: "Đơn không huỷ được nữa: quán đã báo món sẵn sàng, hoặc đơn đã kết thúc.",
		EN: "The order can no longer be cancelled: the seller has marked it ready, or it has ended.",
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
		VI: "Chọn một lý do có sẵn (not_suitable, wrong_items, no_answer, no_show, late, sold_out hoặc other), kèm ghi chú tối đa 200 ký tự.",
		EN: "Give one of the reasons (not_suitable, wrong_items, no_answer, no_show, late, sold_out or other), and a note of at most 200 characters.",
	})
	ErrReviewInvalid = platform.NewFailure("ORDER_REVIEW_INVALID", platform.CategoryValidation, platform.Words{
		VI: "Chọn từ 1 đến 5 sao, các thẻ có sẵn (fast_pickup, good_quality, good_variety hoặc fair_portions) không lặp lại, và nhận xét tối đa 500 ký tự.",
		EN: "Give 1 to 5 stars, tags from the set (fast_pickup, good_quality, good_variety or fair_portions) none twice, and a comment of at most 500 characters.",
	})
	ErrNotCollected = platform.NewFailure("ORDER_NOT_COLLECTED", platform.CategoryConflict, platform.Words{
		VI: "Chỉ đánh giá được đơn đã nhận.",
		EN: "Only a collected order can be reviewed.",
	})
	ErrAlreadyReviewed = platform.NewFailure("ORDER_ALREADY_REVIEWED", platform.CategoryConflict, platform.Words{
		VI: "Đơn này đã được đánh giá.",
		EN: "The order was already reviewed.",
	})
	ErrAdminListInvalid = platform.NewFailure("ORDER_ADMIN_LIST_INVALID", platform.CategoryValidation, platform.Words{
		VI: "Bộ lọc danh sách đơn không hợp lệ: kiểm tra trạng thái, từ khoá tối đa 100 ký tự, khoảng ngày nhận có ngày bắt đầu trước ngày kết thúc, trang từ 1 và cỡ trang từ 1 đến 100.",
		EN: "The order list's filters are not valid: check the statuses, a query of at most 100 characters, a range of collection days that starts before it ends, a page from 1 and a page size of 1 to 100.",
	})
	ErrReviewListInvalid = platform.NewFailure("ORDER_REVIEW_LIST_INVALID", platform.CategoryValidation, platform.Words{
		VI: "Bộ lọc danh sách đánh giá không hợp lệ: kiểm tra số sao từ 1 đến 5, trạng thái hiển thị, từ khoá tối đa 100 ký tự, khoảng ngày đánh giá có ngày bắt đầu trước ngày kết thúc, trang từ 1 và cỡ trang từ 1 đến 100.",
		EN: "The review list's filters are not valid: check stars of 1 to 5, the visibility, a query of at most 100 characters, a range of review days that starts before it ends, a page from 1 and a page size of 1 to 100.",
	})
	ErrNotReviewed = platform.NewFailure("ORDER_NOT_REVIEWED", platform.CategoryNotFound, platform.Words{
		VI: "Đơn này chưa có đánh giá.",
		EN: "The order has no review.",
	})
	ErrReviewReasonInvalid = platform.NewFailure("ORDER_REVIEW_REASON_INVALID", platform.CategoryValidation, platform.Words{
		VI: "Lý do ẩn đánh giá tối đa 500 ký tự.",
		EN: "The reason for hiding a review is at most 500 characters.",
	})
	ErrReviewAlreadyHidden = platform.NewFailure("ORDER_REVIEW_ALREADY_HIDDEN", platform.CategoryConflict, platform.Words{
		VI: "Đánh giá này đã bị ẩn.",
		EN: "The review is already hidden.",
	})
	ErrReviewNotHidden = platform.NewFailure("ORDER_REVIEW_NOT_HIDDEN", platform.CategoryConflict, platform.Words{
		VI: "Đánh giá này đang hiển thị.",
		EN: "The review is already shown.",
	})
	ErrMessageInvalid = platform.NewFailure("ORDER_MESSAGE_INVALID", platform.CategoryValidation, platform.Words{
		VI: "Tin nhắn dài từ 1 đến 1.000 ký tự.",
		EN: "A message is 1 to 1,000 characters.",
	})
	ErrChatClosed = platform.NewFailure("ORDER_CHAT_CLOSED", platform.CategoryConflict, platform.Words{
		VI: "Đơn đã kết thúc, chỉ xem lại tin nhắn.",
		EN: "The order has ended; its messages can only be read.",
	})
	ErrChatFull = platform.NewFailure("ORDER_CHAT_FULL", platform.CategoryConflict, platform.Words{
		VI: "Cuộc trò chuyện đã đủ 500 tin nhắn.",
		EN: "The chat already holds 500 messages.",
	})
	ErrMessagesTooFast = platform.NewFailure("ORDER_MESSAGES_TOO_FAST", platform.CategoryLimitExceeded, platform.Words{
		VI: "Bạn nhắn quá nhanh, hãy thử lại sau ít phút.",
		EN: "You are sending messages too fast; try again shortly.",
	})
)
