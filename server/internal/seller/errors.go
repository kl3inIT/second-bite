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
	ErrReasonInvalid = platform.NewFailure("SELLER_REASON_INVALID", platform.CategoryValidation, platform.Words{
		VI: "Ghi lý do cho chủ cửa hàng, từ 10 đến 500 ký tự.",
		EN: "Write the owner a reason of 10 to 500 characters.",
	})
	ErrListInvalid = platform.NewFailure("SELLER_LIST_INVALID", platform.CategoryValidation, platform.Words{
		VI: "Bộ lọc danh sách cửa hàng không hợp lệ: kiểm tra trạng thái, từ khoá tối đa 100 ký tự, khoảng ngày sửa đổi có ngày bắt đầu trước ngày kết thúc, trang từ 1 và cỡ trang từ 1 đến 100.",
		EN: "The seller list's filters are not valid: check the statuses, a query of at most 100 characters, a range of last changes that starts before it ends, a page from 1 and a page size of 1 to 100.",
	})
)
