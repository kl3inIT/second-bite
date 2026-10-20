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
)

// platformWords are the details of the failures the platform answers itself,
// in every language of the service (SEC-28).
var platformWords = map[string]Words{
	CodeRequestInvalid: {
		VI: "Yêu cầu chưa hợp lệ. Kiểm tra lại thông tin rồi thử lại.",
		EN: "The request is not valid. Check what was sent and try again.",
	},
	CodeRouteNotFound: {
		VI: "Không có địa chỉ này.",
		EN: "This address does not exist.",
	},
	CodeMethodNotAllowed: {
		VI: "Địa chỉ này không nhận cách gọi này.",
		EN: "This address does not accept this method.",
	},
	CodeNotAcceptable: {
		VI: "Không trả lời được theo định dạng được yêu cầu.",
		EN: "The answer cannot be given in the format asked for.",
	},
	CodeBodyTooLarge: {
		VI: "Nội dung gửi lên quá lớn.",
		EN: "What was sent is too large.",
	},
	CodeMediaTypeUnsupported: {
		VI: "Không nhận nội dung theo định dạng này.",
		EN: "Content of this type is not accepted.",
	},
	CodeRequestRefused: {
		VI: "Yêu cầu không được chấp nhận.",
		EN: "The request was refused.",
	},
	CodeDatabaseUnavailable: {
		VI: "Hệ thống đang tạm gián đoạn. Thử lại sau ít phút.",
		EN: "The service is briefly unavailable. Try again in a few minutes.",
	},
	CodeInternalFailure: {
		VI: "Đã có lỗi ngoài ý muốn. Thử lại sau ít phút.",
		EN: "Something went wrong on our side. Try again in a few minutes.",
	},
}

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

func problemFromFailure(ctx context.Context, f *FailureError) *Problem {
	c := categories[f.Category]
	lang := LanguageOf(ctx)
	p := newProblem(c.status, f.Code, c.title, f.Words.In(lang), RequestID(ctx))
	p.Errors = f.violationsIn(lang)

	return p
}

// platformProblem is the problem of a failure the platform answers itself, in
// the request's language.
func platformProblem(ctx context.Context, status int, code string) *Problem {
	return newProblem(status, code, http.StatusText(status), platformWords[code].In(LanguageOf(ctx)), RequestID(ctx))
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

// huma's own sentence for the status is English; the platform's words replace
// it, so it is not read.
func mapError(ctx context.Context, status int, _ string, errs []error) *Problem {
	for _, err := range errs {
		if f, ok := AsFailure(err); ok {
			setErrorCode(ctx, f.Code)

			return problemFromFailure(ctx, f)
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

		return platformProblem(ctx, status, code)
	}

	p := platformProblem(ctx, status, code)
	p.Errors = violations(errs, LanguageOf(ctx))

	return p
}

// violations keeps the location and message of huma's details, the message
// in lang, and drops the value, which may be personal data or a secret.
func violations(errs []error, lang Language) []Violation {
	var out []Violation

	for _, err := range errs {
		var d huma.ErrorDetailer
		if !errors.As(err, &d) {
			continue
		}

		detail := d.ErrorDetail()
		v := Violation{Detail: violationDetail(detail.Message, lang), Code: CodeValueInvalid}

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

	writeProblem(w, problemFromFailure(r.Context(), f))
}

// writeProblem writes a problem outside huma: unmatched routes, panics and
// health checks.
func writeProblem(w http.ResponseWriter, p *Problem) {
	w.Header().Set("Content-Type", problemContentType)
	w.WriteHeader(p.Status)
	_ = json.NewEncoder(w).Encode(p) //nolint:errchkjson // the client is gone if this fails; nothing is left to tell it
}
