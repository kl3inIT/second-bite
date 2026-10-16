package notification

import (
	"encoding/json"
	"errors"
	"maps"
	"net/http"
	"net/http/httptest"
	"reflect"
	"testing"
	"time"
)

// TestBrevoEmailSender checks the request Brevo documents and how each answer
// is classified, against a server that answers as Brevo does.
func TestBrevoEmailSender(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name       string
		status     int
		header     http.Header
		body       string
		wantID     string
		wantResult sendOutcome
		wantRetry  time.Duration
	}{
		{name: "sent", status: http.StatusCreated, body: `{"messageId":"<2017.5787683@relay.domain.com>"}`, wantID: "2017.5787683@relay.domain.com"},
		{name: "rate limited with a wait", status: http.StatusTooManyRequests, header: http.Header{"Retry-After": {"7"}}, wantResult: sendRateLimited, wantRetry: 7 * time.Second},
		{name: "rate limited without a wait", status: http.StatusTooManyRequests, wantResult: sendRateLimited, wantRetry: brevoDefaultRetry},
		{name: "refused key", status: http.StatusUnauthorized, body: `{"code":"unauthorized","message":"Key not found"}`, wantResult: sendRefused},
		{name: "bad request", status: http.StatusBadRequest, wantResult: sendRefused},
		{name: "server failure", status: http.StatusBadGateway, wantResult: sendUnavailable},
		{name: "unreadable success", status: http.StatusCreated, body: `not json`, wantResult: sendUnavailable},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()

			srv := fakeBrevo(t, tt.status, tt.header, tt.body)

			sender := brevoEmailSender{client: srv.Client(), baseURL: srv.URL + "/v3"}
			id, err := sender.Send(t.Context(),
				providerConfig{senderAddress: "no-reply@secondbite.test", senderName: "Second Bite", brevoAPIKey: "test-key"},
				Email{Kind: "test", To: "a@example.com", Subject: "Hello", Text: "text"})

			if tt.wantResult == 0 {
				if err != nil || id != tt.wantID {
					t.Fatalf("id %q, err %v; want %q", id, err, tt.wantID)
				}

				return
			}

			se, ok := errors.AsType[*sendError](err)
			if !ok || se.outcome != tt.wantResult || se.retryAfter != tt.wantRetry {
				t.Fatalf("err %v; want outcome %d, retry %v", err, tt.wantResult, tt.wantRetry)
			}
		})
	}
}

// fakeBrevo answers one send as Brevo would, after checking the request has
// the shape Brevo documents.
func fakeBrevo(t *testing.T, status int, header http.Header, body string) *httptest.Server {
	t.Helper()

	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost || r.URL.Path != "/v3/smtp/email" || r.Header.Get("api-key") != "test-key" {
			t.Errorf("request %s %s, api-key %q", r.Method, r.URL.Path, r.Header.Get("api-key"))
		}

		var got brevoRequest
		if err := json.NewDecoder(r.Body).Decode(&got); err != nil {
			t.Errorf("body: %v", err)
		}

		want := brevoRequest{
			Sender: brevoAddress{Email: "no-reply@secondbite.test", Name: "Second Bite"}, To: []brevoAddress{{Email: "a@example.com"}},
			Subject: "Hello", TextContent: "text", Tags: []string{"test"},
		}
		if !reflect.DeepEqual(got, want) {
			t.Errorf("body %+v, want %+v", got, want)
		}

		maps.Copy(w.Header(), header)
		w.WriteHeader(status)
		_, _ = w.Write([]byte(body))
	}))
	t.Cleanup(srv.Close)

	return srv
}

func TestBrevoUnreachable(t *testing.T) {
	t.Parallel()

	srv := httptest.NewServer(http.NotFoundHandler())
	srv.Close()

	_, err := brevoEmailSender{client: srv.Client(), baseURL: srv.URL}.Send(t.Context(), providerConfig{}, Email{})
	if se, ok := errors.AsType[*sendError](err); !ok || se.outcome != sendUnavailable {
		t.Fatalf("err %v, want unavailable", err)
	}
}
