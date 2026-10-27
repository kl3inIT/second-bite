package seller

import "github.com/kl3inIT/second-bite/server/internal/platform"

// The module's failures.
var (
	ErrNotFound = platform.NewFailure("SELLER_NOT_FOUND", platform.CategoryNotFound, platform.Words{
		VI: "Không tìm thấy quán này.",
		EN: "The seller does not exist.",
	})
	ErrNotActive = platform.NewFailure("SELLER_NOT_ACTIVE", platform.CategoryNotPermitted, platform.Words{
		VI: "Quán chưa hoạt động hoặc đã bị khoá nên chưa đăng món được.",
		EN: "The seller is not active yet, or has been blocked; it cannot publish.",
	})
	ErrOwnerRequired = platform.NewFailure("SELLER_OWNER_REQUIRED", platform.CategoryNotPermitted, platform.Words{
		VI: "Chỉ chủ quán mới làm được việc này.",
		EN: "Only the seller's owner may do this.",
	})
	ErrLimitReached = platform.NewFailure("SELLER_LIMIT_REACHED", platform.CategoryConflict, platform.Words{
		VI: "Bạn đã có đủ 5 quán. Hãy dùng một trong số đó.",
		EN: "You already own five sellers.",
	})
	ErrDetailsInvalid = platform.NewFailure("SELLER_DETAILS_INVALID", platform.CategoryValidation, platform.Words{
		VI: "Nhập tên và địa chỉ của quán.",
		EN: "Enter the seller's name and address.",
	})
	ErrPhoneInvalid = platform.NewFailure("SELLER_PHONE_INVALID", platform.CategoryValidation, platform.Words{
		VI: "Nhập số điện thoại 9 đến 15 chữ số, ví dụ 0912 345 678.",
		EN: "Enter a phone number of 9 to 15 digits, such as 0912 345 678.",
	})
	ErrLocationOutside = platform.NewFailure("SELLER_LOCATION_OUTSIDE", platform.CategoryValidation, platform.Words{
		VI: "Second Bite mới phục vụ ở Hà Nội. Hãy ghim quán ở trong Hà Nội.",
		EN: "Second Bite serves Hanoi only for now. Pin the seller inside Hanoi.",
	})
	ErrStaffLimitReached = platform.NewFailure("SELLER_STAFF_LIMIT_REACHED", platform.CategoryConflict, platform.Words{
		VI: "Mỗi quán có tối đa 30 người.",
		EN: "A seller has at most 30 people.",
	})
	ErrAlreadyMember = platform.NewFailure("SELLER_ALREADY_MEMBER", platform.CategoryConflict, platform.Words{
		VI: "Người này đã làm ở quán.",
		EN: "This person already works for the seller.",
	})
	ErrMemberNotFound = platform.NewFailure("SELLER_MEMBER_NOT_FOUND", platform.CategoryNotFound, platform.Words{
		VI: "Người này không có trong danh sách nhân viên của quán.",
		EN: "This person is not on the seller's staff.",
	})
	ErrOwnerCannotLeave = platform.NewFailure("SELLER_OWNER_CANNOT_LEAVE", platform.CategoryConflict, platform.Words{
		VI: "Chủ quán không thể rời quán.",
		EN: "The owner cannot leave the seller.",
	})
	ErrStatusChangeNotAllowed = platform.NewFailure("SELLER_STATUS_CHANGE_NOT_ALLOWED", platform.CategoryConflict, platform.Words{
		VI: "Không đổi được trạng thái cửa hàng theo cách này: chỉ duyệt cửa hàng đang chờ, bị từ chối hoặc bị khoá; chỉ từ chối cửa hàng đang chờ; chỉ khoá cửa hàng đang hoạt động.",
		EN: "The seller's status cannot change this way: only a pending, rejected or blocked seller is approved, only a pending one rejected, only an active one blocked.",
	})
	ErrOwnerless = platform.NewFailure("SELLER_OWNERLESS", platform.CategoryConflict, platform.Words{
		VI: "Cửa hàng không còn chủ vì chủ đã xoá tài khoản, nên không duyệt lại được.",
		EN: "The seller has no owner, since its owner deleted their account, so it cannot be approved.",
	})
	ErrReasonInvalid = platform.NewFailure("SELLER_REASON_INVALID", platform.CategoryValidation, platform.Words{
		VI: "Ghi lý do cho chủ cửa hàng, từ 10 đến 500 ký tự.",
		EN: "Write the owner a reason of 10 to 500 characters.",
	})
	ErrFeedbackInvalid = platform.NewFailure("SELLER_FEEDBACK_INVALID", platform.CategoryValidation, platform.Words{
		VI: "Viết góp ý từ 1 đến 1.000 ký tự.",
		EN: "Write feedback of 1 to 1,000 characters.",
	})
	ErrFeedbackLimitReached = platform.NewFailure("SELLER_FEEDBACK_LIMIT_REACHED", platform.CategoryConflict, platform.Words{
		VI: "Hôm nay quán đã gửi 20 góp ý. Nhóm đang đọc, ngày mai quán gửi tiếp nhé.",
		EN: "The store sent 20 pieces of feedback today. The team is reading them; send more tomorrow.",
	})
	ErrFeedbackListInvalid = platform.NewFailure("SELLER_FEEDBACK_LIST_INVALID", platform.CategoryValidation, platform.Words{
		VI: "Khoảng ngày không hợp lệ: ngày bắt đầu phải trước ngày kết thúc.",
		EN: "The range of days is not valid: it must start before it ends.",
	})
	ErrListInvalid = platform.NewFailure("SELLER_LIST_INVALID", platform.CategoryValidation, platform.Words{
		VI: "Bộ lọc danh sách cửa hàng không hợp lệ: kiểm tra trạng thái, từ khoá tối đa 100 ký tự, khoảng ngày sửa đổi có ngày bắt đầu trước ngày kết thúc, trang từ 1 và cỡ trang từ 1 đến 100.",
		EN: "The seller list's filters are not valid: check the statuses, a query of at most 100 characters, a range of last changes that starts before it ends, a page from 1 and a page size of 1 to 100.",
	})
	ErrAlreadyOwner = platform.NewFailure("SELLER_ALREADY_OWNER", platform.CategoryConflict, platform.Words{
		VI: "Người này đã là chủ của quán.",
		EN: "This person already owns the seller.",
	})
	ErrNewOwnerLimitReached = platform.NewFailure("SELLER_NEW_OWNER_LIMIT_REACHED", platform.CategoryConflict, platform.Words{
		VI: "Người này đã là chủ của 5 quán, không nhận thêm quán được.",
		EN: "This person already owns five sellers and cannot take another.",
	})
)
