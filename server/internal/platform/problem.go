package platform

import (
	"context"
	"encoding/json"
	"errors"
	"log/slog"
	"maps"
	"net/http"
	"strings"
	"sync"

	"github.com/danielgtaylor/huma/v2"
)

// Codes of the failures the platform answers itself, before or around a module.
const (
	CodeRequestInvalid       = "PLATFORM_REQUEST_INVALID"
	CodeValueInvalid         = "PLATFORM_VALUE_INVALID"
	CodeRouteNotFound        = "PLATFORM_ROUTE_NOT_FOUND"
	CodeMethodNotAllowed     = "PLATFORM_METHOD_NOT_ALLOWED"
	CodeNotAcceptable        = "PLATFORM_NOT_ACCEPTABLE"
	CodeBodyTooLarge         = "PLATFORM_BODY_TOO_LARGE"
	CodeMediaTypeUnsupported = "PLATFORM_MEDIA_TYPE_UNSUPPORTED"
	CodeRequestRefused       = "PLATFORM_REQUEST_REFUSED"
	CodeDatabaseUnavailable  = "PLATFORM_DATABASE_UNAVAILABLE"
	CodeInternalFailure      = "PLATFORM_INTERNAL_FAILURE"
)

const (
	problemTypePrefix  = "urn:secondbite:failure:"
	problemContentType = "application/problem+json"
	internalDetail     = "An unexpected error occurred."
)

var platformStatusCodes = map[int]string{
	http.StatusBadRequest:            CodeRequestInvalid,
	http.StatusNotFound:              CodeRouteNotFound,
	http.StatusMethodNotAllowed:      CodeMethodNotAllowed,
	http.StatusNotAcceptable:         CodeNotAcceptable,
	http.StatusRequestEntityTooLarge: CodeBodyTooLarge,
	http.StatusUnsupportedMediaType:  CodeMediaTypeUnsupported,
	http.StatusServiceUnavailable:    CodeDatabaseUnavailable,
	http.StatusInternalServerError:   CodeInternalFailure,
}

// Problem is the RFC 9457 body of every error response, with the extension
// members code, requestId and, for invalid requests, errors.
type Problem struct { //nolint:errname // a response body; it implements error only because huma.StatusError requires it
	Type      string      `json:"type"                doc:"urn:secondbite:failure:<code in kebab case>"`
	Title     string      `json:"title"`
	Status    int         `json:"status"`
	Detail    string      `json:"detail,omitempty"`
	Code      string      `json:"code"                doc:"Stable machine-readable reason"`
	RequestID string      `json:"requestId,omitempty" doc:"The identifier returned in X-Request-Id"`
	Errors    []Violation `json:"errors,omitempty"    doc:"One entry per invalid member or parameter"`
}

// Violation is one invalid member of the body (pointer) or one invalid
// parameter. The rejected value is never echoed.
type Violation struct {
	Pointer   string `json:"pointer,omitempty"   doc:"JSON Pointer to the body member, for example #/priceVnd"`
	Parameter string `json:"parameter,omitempty" doc:"The invalid parameter, for example query.limit"`
	Detail    string `json:"detail"`
	Code      string `json:"code"`
}

func (p *Problem) Error() string { return p.Code }

// GetStatus implements huma.StatusError.
func (p *Problem) GetStatus() int { return p.Status }

// ContentType implements huma.ContentTypeFilter.
func (p *Problem) ContentType(ct string) string {
	if ct == "application/json" {
		return problemContentType
	}

	return ct
}

func newProblem(status int, code, title, detail, requestID string) *Problem {
	return &Problem{
		Type:      problemTypePrefix + strings.ToLower(strings.ReplaceAll(code, "_", "-")),
		Title:     title,
		Status:    status,
		Detail:    detail,
		Code:      code,
		RequestID: requestID,
	}
}

func problemFromFailure(f *FailureError, requestID string) *Problem {
	c := categories[f.Category]

	return newProblem(c.status, f.Code, c.title, f.Detail, requestID)
}

var installOnce sync.Once

// installErrorMapping makes huma build every error through mapError, the one
// place that turns an error into a problem. huma exposes this only as package
// variables, so they are set once per process; what differs per service, the
// logger, comes from the request's context.
func installErrorMapping() {
	installOnce.Do(func() {
		huma.NewError = func(status int, msg string, errs ...error) huma.StatusError {
			return mapError(context.Background(), status, msg, errs)
		}
		huma.NewErrorWithContext = func(hctx huma.Context, status int, msg string, errs ...error) huma.StatusError {
			ctx := context.Background()
			if hctx != nil {
				ctx = hctx.Context()
			}

			return mapError(ctx, status, msg, errs)
		}
	})
}

func mapError(ctx context.Context, status int, msg string, errs []error) *Problem {
	requestID := RequestID(ctx)

	for _, err := range errs {
		if f, ok := AsFailure(err); ok {
			setErrorCode(ctx, f.Code)

			return problemFromFailure(f, requestID)
		}
	}

	if status == http.StatusUnprocessableEntity {
		status = http.StatusBadRequest
	}

	code, ok := platformStatusCodes[status]
	if !ok {
		code = CodeRequestRefused
	}

	setErrorCode(ctx, code)

	if status >= http.StatusInternalServerError {
		if logger := requestLogger(ctx); logger != nil && status == http.StatusInternalServerError && len(errs) > 0 {
			logger.ErrorContext(ctx, "request failed",
				slog.String("event", "platform.request.failed"),
				slog.String("error_code", code),
				slog.String("error", errors.Join(errs...).Error()),
			)
		}

		return newProblem(status, code, http.StatusText(status), internalDetail, requestID)
	}

	p := newProblem(status, code, http.StatusText(status), msg, requestID)
	p.Errors = violations(errs)

	return p
}

// violations keeps the location and message of huma's details and drops the
// value, which may be personal data or a secret.
func violations(errs []error) []Violation {
	var out []Violation

	for _, err := range errs {
		var d huma.ErrorDetailer
		if !errors.As(err, &d) {
			continue
		}

		detail := d.ErrorDetail()
		v := Violation{Detail: detail.Message, Code: CodeValueInvalid}

		if rest, isBody := strings.CutPrefix(detail.Location, "body"); isBody {
			v.Pointer = jsonPointer(rest)
		} else {
			v.Parameter = detail.Location
		}

		out = append(out, v)
	}

	return out
}

// jsonPointer turns huma's location after "body" (".items[3].tags") into a
// JSON Pointer fragment ("#/items/3/tags").
func jsonPointer(location string) string {
	var b strings.Builder

	b.WriteString("#")

	for part := range strings.SplitSeq(strings.TrimPrefix(location, "."), ".") {
		if part == "" {
			continue
		}

		name, index, _ := strings.Cut(part, "[")
		b.WriteString("/" + escapePointer(name))

		for index != "" {
			i, rest, _ := strings.Cut(index, "]")
			b.WriteString("/" + i)

			index = strings.TrimPrefix(rest, "[")
		}
	}

	return b.String()
}

func escapePointer(s string) string {
	return strings.ReplaceAll(strings.ReplaceAll(s, "~", "~0"), "/", "~1")
}

// WriteFailure answers a request with the problem of f, for middleware that
// refuses a request before it reaches an operation.
func WriteFailure(w http.ResponseWriter, r *http.Request, f *FailureError) {
	setErrorCode(r.Context(), f.Code)

	maps.Copy(w.Header(), f.GetHeaders())

	writeProblem(w, problemFromFailure(f, RequestID(r.Context())))
}

// writeProblem writes a problem outside huma: unmatched routes, panics and
// health checks.
func writeProblem(w http.ResponseWriter, p *Problem) {
	w.Header().Set("Content-Type", problemContentType)
	w.WriteHeader(p.Status)
	_ = json.NewEncoder(w).Encode(p) //nolint:errchkjson // the client is gone if this fails; nothing is left to tell it
}
