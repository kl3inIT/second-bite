package notification

import (
	"context"
	"errors"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"strings"

	webpush "github.com/SherClockHolmes/webpush-go"

	"github.com/kl3inIT/second-bite/server/internal/notification/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// pushOutcome is what a push service did with one push to one browser.
type pushOutcome int

const (
	pushDelivered pushOutcome = iota
	// pushGone: the subscription no longer exists (404 or 410, RFC 8030), so
	// it is forgotten.
	pushGone
	// pushRefused: the push service refused this push for good (a bad key, a
	// payload too large); sending it again would fail the same way.
	pushRefused
	// pushRetry: the push service is busy or down (429, 5xx, no answer); the
	// delivery is tried again later.
	pushRetry
)

// newPushClient is the one client every push goes through: bounded in time,
// and never following a redirect, so a push service cannot send the server
// elsewhere.
func newPushClient() *http.Client {
	return &http.Client{
		Timeout: sendTimeout,
		CheckRedirect: func(*http.Request, []*http.Request) error {
			return http.ErrUseLastResponse
		},
	}
}

// sendPush encrypts p for one browser in its language and posts it to the
// browser's push service. The topic header is what p is about, so a newer
// push replaces an older one the device has not shown.
func (s *Service) sendPush(ctx context.Context, r db.PendingRecipientsRow, p db.NotificationPush) (pushOutcome, error) {
	message, err := s.payload(p, platform.Language(r.Language))
	if err != nil {
		return pushRefused, err
	}

	res, err := webpush.SendNotificationWithContext(ctx, message,
		&webpush.Subscription{Endpoint: r.Endpoint, Keys: webpush.Keys{P256dh: r.P256dh, Auth: r.Auth}},
		&webpush.Options{
			HTTPClient:      s.pushClient,
			Subscriber:      s.push.SiteURL,
			Topic:           strings.ReplaceAll(p.About.String(), "-", ""),
			TTL:             int(pushLifetime.Seconds()),
			Urgency:         webpush.UrgencyHigh,
			VAPIDPublicKey:  s.push.PublicKey,
			VAPIDPrivateKey: s.push.PrivateKey,
		})
	if err != nil {
		if errors.Is(err, webpush.ErrMaxPadExceeded) {
			return s.pushFailed(ctx, r, p, pushRefused, 0, err)
		}

		// A key that does not decode is the browser's fault, and no retry
		// mends it; anything else failed on the way.
		if strings.Contains(err.Error(), "illegal base64") {
			return s.pushFailed(ctx, r, p, pushRefused, 0, err)
		}

		return s.pushFailed(ctx, r, p, pushRetry, 0, err)
	}

	defer func() {
		_, _ = io.Copy(io.Discard, io.LimitReader(res.Body, 4<<10))
		_ = res.Body.Close()
	}()

	switch code := res.StatusCode; {
	case code >= 200 && code < 300:
		return pushDelivered, nil
	case code == http.StatusNotFound || code == http.StatusGone:
		return s.pushFailed(ctx, r, p, pushGone, code, nil)
	case code == http.StatusTooManyRequests || code >= 500:
		return s.pushFailed(ctx, r, p, pushRetry, code, fmt.Errorf("push service answered %d", code))
	default:
		return s.pushFailed(ctx, r, p, pushRefused, code, fmt.Errorf("push service answered %d", code))
	}
}

// pushFailed logs a push that did not arrive, never with the endpoint, which
// identifies the browser to its push service.
func (s *Service) pushFailed(
	ctx context.Context, r db.PendingRecipientsRow, p db.NotificationPush, outcome pushOutcome, status int, err error,
) (pushOutcome, error) {
	attrs := []any{
		slog.String("push_id", p.ID.String()),
		slog.String("subscription_id", r.ID.String()),
		slog.Int("status", status),
	}

	switch outcome {
	case pushGone:
		s.logger.InfoContext(ctx, "push subscription gone", append(attrs, slog.String("event", "notification.push.gone"))...)
	case pushRetry:
		s.logger.WarnContext(ctx, "push service failed for now", append(attrs,
			slog.String("event", "notification.push.retry"), slog.String("error_type", fmt.Sprintf("%T", err)))...)
	case pushRefused, pushDelivered:
		s.logger.WarnContext(ctx, "push refused", append(attrs,
			slog.String("event", "notification.push.refused"), slog.String("error_type", fmt.Sprintf("%T", err)))...)
	}

	return outcome, err
}
