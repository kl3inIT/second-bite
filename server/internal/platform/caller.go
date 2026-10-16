package platform

import (
	"context"

	"github.com/google/uuid"
)

// SecurityBearer names the session token scheme in the OpenAPI document; an
// operation that needs a signed-in caller lists it in its Security.
const SecurityBearer = "bearer"

// Role is what an account may do across the product. Rights tied to one seller
// are the seller module's, not a role.
type Role string

// The roles of an account.
const (
	RoleCustomer Role = "customer"
	RoleOperator Role = "operator"
)

// Caller is the signed-in account a request acts for. The module that signs
// people in puts it in the request's context; every module reads it from
// there, so none needs to depend on that module to authorize.
type Caller struct {
	AccountID uuid.UUID
	SessionID uuid.UUID
	Role      Role
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
	ErrAuthenticationRequired = NewFailure("PLATFORM_AUTHENTICATION_REQUIRED", CategoryUnauthenticated, "Sign in to continue.")
	ErrOperatorRequired       = NewFailure("PLATFORM_OPERATOR_REQUIRED", CategoryNotPermitted, "Only Second Bite operators may do this.")
)

// RequireCaller returns the caller of ctx, or ErrAuthenticationRequired.
func RequireCaller(ctx context.Context) (Caller, error) {
	c, ok := CallerFrom(ctx)
	if !ok {
		return Caller{}, ErrAuthenticationRequired
	}

	return c, nil
}

// RequireOperator returns the caller of ctx when it is an operator.
func RequireOperator(ctx context.Context) (Caller, error) {
	c, err := RequireCaller(ctx)
	if err != nil {
		return Caller{}, err
	}

	if c.Role != RoleOperator {
		return Caller{}, ErrOperatorRequired
	}

	return c, nil
}
