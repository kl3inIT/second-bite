package platform

import (
	"context"

	"github.com/google/uuid"
)

// The session's schemes in the OpenAPI document: the token as Bearer, which
// the mobile application sends, or the cookie the web keeps (SEC-27).
const (
	SecurityBearer = "bearer"
	SecurityCookie = "cookie"
	// SessionCookie is the cookie that holds the web's session token.
	SessionCookie = "secondbite_session"
)

// SignedIn is the Security of an operation that needs a signed-in caller.
func SignedIn() []map[string][]string {
	return []map[string][]string{{SecurityBearer: {}}, {SecurityCookie: {}}}
}

// MaybeSignedIn is the Security of an operation anyone may call, which shows
// a signed-in caller more.
func MaybeSignedIn() []map[string][]string {
	return []map[string][]string{{}, {SecurityBearer: {}}, {SecurityCookie: {}}}
}

// Role is what an account may do across the product. Rights tied to one seller
// are the seller module's, not a role.
type Role string

// The roles of an account.
const (
	RoleCustomer Role = "customer"
	RoleAdmin    Role = "admin"
)

// Caller is the signed-in account a request acts for. The module that signs
// people in puts it in the request's context; every module reads it from
// there, so none needs to depend on that module to authorize.
type Caller struct {
	AccountID uuid.UUID
	SessionID uuid.UUID
	Role      Role
	// Label names the account as people read it, its address, for the audit
	// trail only; it is never logged.
	Label string
}

type callerKey struct{}

// WithCaller returns a context carrying c.
func WithCaller(ctx context.Context, c Caller) context.Context {
	return context.WithValue(ctx, callerKey{}, c)
}

// CallerFrom returns the caller of ctx, if a session was presented.
func CallerFrom(ctx context.Context) (Caller, bool) {
	c, ok := ctx.Value(callerKey{}).(Caller)

	return c, ok
}

// The failures of authorization every module shares.
var (
	ErrAuthenticationRequired = NewFailure("PLATFORM_AUTHENTICATION_REQUIRED", CategoryUnauthenticated, Words{
		VI: "Đăng nhập để tiếp tục.",
		EN: "Sign in to continue.",
	})
	ErrAdminRequired = NewFailure("PLATFORM_ADMIN_REQUIRED", CategoryNotPermitted, Words{
		VI: "Chỉ quản trị viên Second Bite mới làm được việc này.",
		EN: "Only Second Bite admins may do this.",
	})
	ErrCrossOriginRefused = NewFailure("PLATFORM_CROSS_ORIGIN_REFUSED", CategoryNotPermitted, Words{
		VI: "Thay đổi bằng phiên đăng nhập trên trình duyệt phải đến từ chính trang Second Bite.",
		EN: "A change signed in by the session cookie must come from Second Bite's own pages.",
	})
)

// RequireCaller returns the caller of ctx, or ErrAuthenticationRequired.
func RequireCaller(ctx context.Context) (Caller, error) {
	c, ok := CallerFrom(ctx)
	if !ok {
		return Caller{}, ErrAuthenticationRequired
	}

	return c, nil
}

// RequireAdmin returns the caller of ctx when it is an admin.
func RequireAdmin(ctx context.Context) (Caller, error) {
	c, err := RequireCaller(ctx)
	if err != nil {
		return Caller{}, err
	}

	if c.Role != RoleAdmin {
		return Caller{}, ErrAdminRequired
	}

	return c, nil
}
