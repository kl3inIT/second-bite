package notification

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"
	"time"
)

const (
	brevoBaseURL         = "https://api.brevo.com/v3"
	brevoUserAgent       = "secondbite"
	brevoDefaultRetry    = time.Minute
	brevoMaxResponseBody = 64 << 10
)

// brevoEmailSender delivers email through Brevo's transactional API, read on
// the shape of Brevo's Go SDK and Resend's: one JSON request with the api-key
// header, a typed failure per status, a client with its own timeout.
type brevoEmailSender struct {
	client  *http.Client
	baseURL string
}

type brevoAddress struct {
	Email string `json:"email"`
	Name  string `json:"name,omitempty"`
}

type brevoRequest struct {
	Sender      brevoAddress   `json:"sender"`
	To          []brevoAddress `json:"to"`
	Subject     string         `json:"subject"`
	TextContent string         `json:"textContent"`
	HTMLContent string         `json:"htmlContent,omitempty"`
	Tags        []string       `json:"tags,omitempty"`
}

type brevoResponse struct {
	MessageID string `json:"messageId"`
}

// Send implements emailSender.
func (b brevoEmailSender) Send(ctx context.Context, cfg providerConfig, e Email) (string, error) {
	body, err := json.Marshal(brevoRequest{
		Sender:      brevoAddress{Email: cfg.senderAddress, Name: cfg.senderName},
		To:          []brevoAddress{{Email: e.To}},
		Subject:     e.Subject,
		TextContent: e.Text,
		HTMLContent: e.HTML,
		Tags:        []string{e.Kind},
	})
	if err != nil {
		return "", &sendError{outcome: sendRefused, cause: err}
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, b.baseURL+"/smtp/email", bytes.NewReader(body))
	if err != nil {
		return "", &sendError{outcome: sendRefused, cause: err}
	}

	req.Header.Set("Accept", "application/json")
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("User-Agent", brevoUserAgent)
	req.Header.Set("api-key", cfg.brevoAPIKey)

	resp, err := b.client.Do(req)
	if err != nil {
		return "", &sendError{outcome: sendUnavailable, cause: errors.New("brevo could not be reached")}
	}

	defer func() { _ = resp.Body.Close() }()

	// Brevo's error text is never kept: it is a third party's, and may echo
	// the request. Only the status is.
	raw, err := io.ReadAll(io.LimitReader(resp.Body, brevoMaxResponseBody))
	if err != nil {
		return "", &sendError{outcome: sendUnavailable, cause: errors.New("brevo's answer could not be read")}
	}

	switch {
	case resp.StatusCode == http.StatusCreated || resp.StatusCode == http.StatusOK || resp.StatusCode == http.StatusAccepted:
		var out brevoResponse
		if err := json.Unmarshal(raw, &out); err != nil {
			return "", &sendError{outcome: sendUnavailable, cause: errors.New("brevo answered success with an unreadable body")}
		}

		return strings.Trim(out.MessageID, "<>"), nil
	case resp.StatusCode == http.StatusTooManyRequests:
		return "", &sendError{
			outcome:    sendRateLimited,
			retryAfter: retryAfter(resp.Header.Get("Retry-After"), brevoDefaultRetry),
			cause:      errors.New("brevo answered 429"),
		}
	case resp.StatusCode >= http.StatusInternalServerError:
		return "", &sendError{outcome: sendUnavailable, cause: fmt.Errorf("brevo answered %d", resp.StatusCode)}
	default:
		return "", &sendError{outcome: sendRefused, cause: fmt.Errorf("brevo answered %d", resp.StatusCode)}
	}
}

func retryAfter(header string, fallback time.Duration) time.Duration {
	seconds, err := strconv.Atoi(header)
	if err != nil || seconds <= 0 {
		return fallback
	}

	return time.Duration(seconds) * time.Second
}
