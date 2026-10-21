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
)
