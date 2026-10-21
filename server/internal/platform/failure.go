package platform

import (
	"errors"
	"net/http"
	"regexp"
	"strconv"
	"time"
)

// Category groups failures by what the caller can do about them; it decides
// the HTTP status and the problem's title.
type Category string

// The categories of the API error contract.
const (
	CategoryValidation         Category = "VALIDATION"
	CategoryUnauthenticated    Category = "UNAUTHENTICATED"
	CategoryNotPermitted       Category = "NOT_PERMITTED"
	CategoryNotFound           Category = "NOT_FOUND"
	CategoryConflict           Category = "CONFLICT"
	CategoryGone               Category = "GONE"
	CategoryLimitExceeded      Category = "LIMIT_EXCEEDED"
	CategoryServiceUnavailable Category = "SERVICE_UNAVAILABLE"
)

var categories = map[Category]struct {
	status int
	title  string
}{
	CategoryValidation:         {http.StatusBadRequest, "Invalid request"},
	CategoryUnauthenticated:    {http.StatusUnauthorized, "Authentication required"},
	CategoryNotPermitted:       {http.StatusForbidden, "Not permitted"},
	CategoryNotFound:           {http.StatusNotFound, "Not found"},
	CategoryConflict:           {http.StatusConflict, "Conflict"},
	CategoryGone:               {http.StatusGone, "Gone"},
	CategoryLimitExceeded:      {http.StatusTooManyRequests, "Limit exceeded"},
	CategoryServiceUnavailable: {http.StatusServiceUnavailable, "Service unavailable"},
}

var codePattern = regexp.MustCompile(`^[A-Z][A-Z0-9_]{0,61}[A-Z0-9]$`)

// FailureError is an expected failure of a module: a stable code, its category and
// a message safe to show people, in every language of the service (SEC-28). A
// module declares each failure once and returns it, optionally with the cause
// that only logs see:
//
//	var ErrSellerNotFound = platform.NewFailure("SELLER_NOT_FOUND", platform.CategoryNotFound,
//		platform.Words{VI: "Không tìm thấy quán này.", EN: "The seller does not exist."})
//	return ErrSellerNotFound.WithCause(err)
//
// Two failures are equal for errors.Is when their codes are equal.
type FailureError struct {
	Code       string
	Category   Category
	Words      Words
	RetryAfter time.Duration
	cause      error
}

// NewFailure declares a failure. It panics on a malformed code, an unknown
// category or words missing a language, which are programming errors found
// when the package loads, so no test of a module runs with one.
func NewFailure(code string, category Category, words Words) *FailureError {
	if !codePattern.MatchString(code) {
		panic("platform: malformed failure code " + strconv.Quote(code))
	}

	if _, ok := categories[category]; !ok {
		panic("platform: unknown failure category " + strconv.Quote(string(category)))
	}

	if !words.complete() {
		panic("platform: failure " + code + " lacks its words in a language")
	}

	return &FailureError{Code: code, Category: category, Words: words}
}

// WithCause returns a copy of the failure carrying the diagnostic cause.
func (f *FailureError) WithCause(err error) *FailureError {
	c := *f
	c.cause = err

	return &c
}

// WithRetryAfter returns a copy of the failure telling the caller when to try
// again; it is sent as Retry-After on 429 and 503 responses.
func (f *FailureError) WithRetryAfter(d time.Duration) *FailureError {
	c := *f
	c.RetryAfter = d

	return &c
}

func (f *FailureError) Error() string {
	if f.cause != nil {
		return f.Code + ": " + f.cause.Error()
	}

	return f.Code
}

func (f *FailureError) Unwrap() error { return f.cause }

// Is matches failures by code.
func (f *FailureError) Is(target error) bool {
	t, ok := target.(*FailureError)

	return ok && t.Code == f.Code
}

// GetHeaders lets huma send Retry-After and WWW-Authenticate with the problem.
func (f *FailureError) GetHeaders() http.Header {
	h := http.Header{}

	if f.RetryAfter > 0 {
		seconds := int64((f.RetryAfter + time.Second - 1) / time.Second)
		h.Set("Retry-After", strconv.FormatInt(seconds, 10))
	}

	if f.Category == CategoryUnauthenticated {
		h.Set("WWW-Authenticate", "Bearer")
	}

	return h
}

// AsFailure finds a FailureError in err's chain.
func AsFailure(err error) (*FailureError, bool) {
	return errors.AsType[*FailureError](err)
}
