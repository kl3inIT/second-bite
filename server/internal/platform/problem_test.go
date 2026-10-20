package platform_test

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/http/httptest"
	"slices"
	"strings"
	"testing"
	"time"

	"github.com/danielgtaylor/huma/v2"

	"github.com/kl3inIT/second-bite/server/internal/platform"
)

const (
	soldOutVI   = "Món này đã hết."
	soldOutEN   = "The offer is sold out."
	soldOutPath = "/sold-out"
)

var (
	errSoldOut = platform.NewFailure("TEST_OFFER_SOLD_OUT", platform.CategoryConflict, platform.Words{
		VI: soldOutVI,
		EN: soldOutEN,
	})
	errBusy = platform.NewFailure("TEST_PROVIDER_BUSY", platform.CategoryServiceUnavailable, platform.Words{
		VI: "Thử lại sau giây lát.",
		EN: "Try again shortly.",
	})
)

type priceInput struct {
	Body struct {
		PriceVnd int64 `json:"priceVnd" minimum:"1"`
	}
}

// newTestHandler serves a few operations through the real API, middleware
// and problem mapping, and returns the log they write.
func newTestHandler(t *testing.T) (http.Handler, *bytes.Buffer) {
	t.Helper()

	var logs bytes.Buffer

	logger := platform.NewLogger(&logs, platform.Config{LogFormat: "json"})
	mux := http.NewServeMux()
	api := platform.NewAPI(mux)

	huma.Post(api, "/prices", func(_ context.Context, _ *priceInput) (*struct{}, error) {
		return nil, nil
	})
	huma.Get(api, soldOutPath, func(_ context.Context, _ *struct{}) (*struct{}, error) {
		return nil, fmt.Errorf("ordering: %w", errSoldOut.WithCause(errors.New("units_left is 0")))
	})
	huma.Get(api, "/busy", func(_ context.Context, _ *struct{}) (*struct{}, error) {
		return nil, errBusy.WithRetryAfter(2500 * time.Millisecond)
	})
	huma.Get(api, "/broken", func(_ context.Context, _ *struct{}) (*struct{}, error) {
		return nil, errors.New("connecting as admin with secret-value-123")
	})
	huma.Get(api, "/panics", func(_ context.Context, _ *struct{}) (*struct{}, error) {
		panic("boom")
	})

	return platform.NewHandler(mux, logger), &logs
}

func serve(t *testing.T, h http.Handler, method, path, body string) *httptest.ResponseRecorder {
	t.Helper()

	return serveIn(t, h, method, path, body, "")
}

// serveIn sends the request with acceptLanguage as its Accept-Language, or
// none when it is empty.
func serveIn(t *testing.T, h http.Handler, method, path, body, acceptLanguage string) *httptest.ResponseRecorder {
	t.Helper()

	req := httptest.NewRequestWithContext(t.Context(), method, path, strings.NewReader(body))
	if body != "" {
		req.Header.Set("Content-Type", "application/json")
	}

	if acceptLanguage != "" {
		req.Header.Set("Accept-Language", acceptLanguage)
	}

	rec := httptest.NewRecorder()
	h.ServeHTTP(rec, req)

	return rec
}

func decode(t *testing.T, rec *httptest.ResponseRecorder, status int) platform.Problem {
	t.Helper()

	if rec.Code != status {
		t.Fatalf("status %d, want %d; body %s", rec.Code, status, rec.Body)
	}

	if ct := rec.Header().Get("Content-Type"); ct != "application/problem+json" {
		t.Fatalf("Content-Type %q, want application/problem+json", ct)
	}

	var p platform.Problem
	if err := json.Unmarshal(rec.Body.Bytes(), &p); err != nil {
		t.Fatal(err)
	}

	if p.Status != status {
		t.Errorf("problem status %d, want %d", p.Status, status)
	}

	if p.RequestID == "" || p.RequestID != rec.Header().Get("X-Request-Id") {
		t.Errorf("requestId %q, X-Request-Id %q", p.RequestID, rec.Header().Get("X-Request-Id"))
	}

	return p
}

func TestFailureBecomesItsProblem(t *testing.T) {
	t.Parallel()

	h, logs := newTestHandler(t)
	p := decode(t, serveIn(t, h, http.MethodGet, soldOutPath, "", "en"), http.StatusConflict)

	want := platform.Problem{
		Type: "urn:secondbite:failure:test-offer-sold-out", Title: "Conflict", Status: http.StatusConflict,
		Detail: soldOutEN, Code: "TEST_OFFER_SOLD_OUT", RequestID: p.RequestID,
	}
	if fmt.Sprint(p) != fmt.Sprint(want) {
		t.Errorf("problem\n got %+v\nwant %+v", p, want)
	}

	if !strings.Contains(logs.String(), `"error_code":"TEST_OFFER_SOLD_OUT"`) {
		t.Errorf("access log lacks the failure's code: %s", logs)
	}
}

func TestRetryAfterIsSentInWholeSeconds(t *testing.T) {
	t.Parallel()

	h, _ := newTestHandler(t)
	rec := serve(t, h, http.MethodGet, "/busy", "")
	decode(t, rec, http.StatusServiceUnavailable)

	if got := rec.Header().Get("Retry-After"); got != "3" {
		t.Errorf("Retry-After %q, want 3", got)
	}
}

func TestUncaughtErrorIsAGeneric500(t *testing.T) {
	t.Parallel()

	h, logs := newTestHandler(t)
	rec := serve(t, h, http.MethodGet, "/broken", "")
	p := decode(t, rec, http.StatusInternalServerError)

	if p.Code != platform.CodeInternalFailure || p.Detail != "Đã có lỗi ngoài ý muốn. Thử lại sau ít phút." {
		t.Errorf("problem %+v", p)
	}

	if strings.Contains(rec.Body.String(), "secret-value-123") {
		t.Error("the response reveals the internal error")
	}

	if !strings.Contains(logs.String(), `"event":"platform.request.failed"`) ||
		!strings.Contains(logs.String(), `"request_id":"`+p.RequestID+`"`) {
		t.Errorf("the failure is not logged with its request id: %s", logs)
	}
}

func TestPanicIsAGeneric500(t *testing.T) {
	t.Parallel()

	h, logs := newTestHandler(t)
	p := decode(t, serve(t, h, http.MethodGet, "/panics", ""), http.StatusInternalServerError)

	if p.Code != platform.CodeInternalFailure {
		t.Errorf("code %q", p.Code)
	}

	if !strings.Contains(logs.String(), `"event":"platform.request.panicked"`) {
		t.Errorf("the panic is not logged: %s", logs)
	}
}

func TestInvalidBodyNamesTheMemberWithoutItsValue(t *testing.T) {
	t.Parallel()

	h, _ := newTestHandler(t)
	rec := serve(t, h, http.MethodPost, "/prices", `{"priceVnd": -987654}`)
	p := decode(t, rec, http.StatusBadRequest)

	if p.Code != platform.CodeRequestInvalid || len(p.Errors) != 1 {
		t.Fatalf("problem %+v", p)
	}

	if v := p.Errors[0]; v.Pointer != "#/priceVnd" || v.Code != platform.CodeValueInvalid || v.Detail == "" {
		t.Errorf("violation %+v", v)
	}

	if strings.Contains(rec.Body.String(), "987654") {
		t.Error("the rejected value is echoed")
	}
}

func TestMalformedBodyIsAProblem(t *testing.T) {
	t.Parallel()

	h, _ := newTestHandler(t)
	p := decode(t, serve(t, h, http.MethodPost, "/prices", `{"priceVnd":`), http.StatusBadRequest)

	if p.Code != platform.CodeRequestInvalid {
		t.Errorf("code %q", p.Code)
	}
}

func TestFailuresMatchByCode(t *testing.T) {
	t.Parallel()

	err := fmt.Errorf("placing: %w", errSoldOut.WithCause(errors.New("cause")))
	if !errors.Is(err, errSoldOut) || errors.Is(err, errBusy) {
		t.Error("errors.Is does not match failures by code")
	}
}

func TestProblemsAnswerInTheRequestsLanguage(t *testing.T) {
	t.Parallel()

	h, _ := newTestHandler(t)

	cases := []struct {
		name, method, path, body, acceptLanguage string
		status                                   int
		detail, language                         string
	}{
		{"a failure, nothing asked", http.MethodGet, soldOutPath, "", "", http.StatusConflict, soldOutVI, "vi"},
		{"a failure in Vietnamese", http.MethodGet, soldOutPath, "", "vi", http.StatusConflict, soldOutVI, "vi"},
		{"a failure in English", http.MethodGet, soldOutPath, "", "en-US,en;q=0.9", http.StatusConflict, soldOutEN, "en"},
		{"a failure in an unknown language", http.MethodGet, soldOutPath, "", "fr", http.StatusConflict, soldOutVI, "vi"},
		{"quality values decide", http.MethodGet, soldOutPath, "", "vi;q=0.2, en;q=0.8", http.StatusConflict, soldOutEN, "en"},
		{"French first, English after", http.MethodGet, soldOutPath, "", "fr, en;q=0.5", http.StatusConflict, soldOutEN, "en"},
		{"an unreadable header", http.MethodGet, soldOutPath, "", "@@@", http.StatusConflict, soldOutVI, "vi"},
		{"an unknown route in English", http.MethodGet, "/nowhere", "", "en", http.StatusNotFound, "This address does not exist.", "en"},
		{"an unknown route in Vietnamese", http.MethodGet, "/nowhere", "", "vi", http.StatusNotFound, "Không có địa chỉ này.", "vi"},
		{"a panic in English", http.MethodGet, "/panics", "", "en", http.StatusInternalServerError, "Something went wrong on our side. Try again in a few minutes.", "en"},
		{"a malformed body in English", http.MethodPost, "/prices", `{"priceVnd":`, "en", http.StatusBadRequest, "The request is not valid. Check what was sent and try again.", "en"},
	}

	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			t.Parallel()

			rec := serveIn(t, h, c.method, c.path, c.body, c.acceptLanguage)
			p := decode(t, rec, c.status)

			if p.Detail != c.detail {
				t.Errorf("detail %q, want %q", p.Detail, c.detail)
			}

			if got := rec.Header().Get("Content-Language"); got != c.language {
				t.Errorf("Content-Language %q, want %q", got, c.language)
			}

			if got := rec.Header().Values("Vary"); !slices.Contains(got, "Accept-Language") {
				t.Errorf("Vary %q lacks Accept-Language", got)
			}
		})
	}
}

func TestViolationsAreTranslated(t *testing.T) {
	t.Parallel()

	h, _ := newTestHandler(t)

	for lang, want := range map[string]string{"vi": "Phải từ 1 trở lên.", "en": "expected number >= 1"} {
		p := decode(t, serveIn(t, h, http.MethodPost, "/prices", `{"priceVnd": -5}`, lang), http.StatusBadRequest)
		if len(p.Errors) != 1 || p.Errors[0].Detail != want {
			t.Errorf("%s: violations %+v, want detail %q", lang, p.Errors, want)
		}
	}
}

func TestAFailureNeedsItsWordsInEveryLanguage(t *testing.T) {
	t.Parallel()

	for name, words := range map[string]platform.Words{
		"no Vietnamese": {EN: soldOutEN},
		"no English":    {VI: soldOutVI},
	} {
		t.Run(name, func(t *testing.T) {
			t.Parallel()

			defer func() {
				if recover() == nil {
					t.Error("NewFailure accepted words missing a language")
				}
			}()

			_ = platform.NewFailure("TEST_INCOMPLETE", platform.CategoryConflict, words)
		})
	}
}
