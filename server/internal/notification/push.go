package notification

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"net/url"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"

	"github.com/kl3inIT/second-bite/server/internal/notification/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

const (
	// topicLifetime is how long a topic is followed after it was last proven
	// (SEC-25 decision 5): a person removed from a seller stops hearing its
	// orders within it.
	topicLifetime = 7 * 24 * time.Hour
	// pushLifetime is how long a push is worth sending: past it, the order has
	// moved on and the page says more. It is also the TTL the push service
	// keeps it for a device that is off.
	pushLifetime = 30 * time.Minute
	// maxTickets bounds the topics one subscribing proves: the orders a
	// browser keeps without an account, as the live socket bounds them.
	maxTickets = 20
	// pushPurgeEvery is how often lapsed topics, lone subscriptions and old
	// pushes are deleted.
	pushPurgeEvery = time.Hour
	// loneSubscriptionKept is how long a subscription that follows nothing is
	// kept, so a browser that subscribes before proving a topic is not lost.
	loneSubscriptionKept = 24 * time.Hour
)

// PushConfig is what Web Push needs; an empty PublicKey leaves it off, and
// the service runs without it.
type PushConfig struct {
	// PublicKey and PrivateKey are the VAPID key pair, in base64url as
	// `secondbite push keys` writes them.
	PublicKey  string
	PrivateKey string
	// SiteURL is the web's origin, such as https://secondbite.vadan.app: the
	// pages a push opens are on it, and push services read it as who sends.
	SiteURL string
}

func (c PushConfig) enabled() bool { return c.PublicKey != "" }

// Push is a short notice for the browsers following a topic: the words of
// what happened, in every language, and the page that tells the rest. It
// never carries a person's name or phone, an amount or a message's text
// (SEC-25 decision 7).
type Push struct {
	// Topic is who hears it: order:{orderId} or seller:{sellerId}, as the
	// live socket names them.
	Topic string
	// About is what it is about; a newer push about the same thing replaces
	// one still waiting on the device.
	About uuid.UUID
	// Path is the page it opens, after the language: /orders/{orderId}.
	Path  string
	Title platform.Words
	Body  platform.Words
}

// Subscription is a browser's Web Push subscription, as PushManager gives it.
type Subscription struct {
	Endpoint string
	P256dh   string
	Auth     string
}

// pushQueued tells the module's own listener that a push is waiting; it
// carries the push's identifier only.
type pushQueued struct {
	PushID uuid.UUID `json:"pushId"`
}

func (pushQueued) EventKey() string { return "notification.push_queued" }

// PushKey is the VAPID public key a browser subscribes with, or
// ErrPushNotConfigured.
func (s *Service) PushKey() (string, error) {
	if !s.push.enabled() {
		return "", ErrPushNotConfigured
	}

	return s.push.PublicKey, nil
}

// Subscribe keeps a browser's subscription, in the language of the request,
// following the topic each ticket proves; redeem is the live socket's
// redemption, so a ticket is spent here as it would be there. A subscription
// subscribing again follows the new topics too and renews the old ones it
// proves.
func (s *Service) Subscribe(ctx context.Context, sub Subscription, tickets []string, redeem platform.RedeemTicket) error {
	if !s.push.enabled() {
		return ErrPushNotConfigured
	}

	if err := s.checkEndpoint(sub.Endpoint); err != nil {
		return err
	}

	if len(tickets) == 0 || len(tickets) > maxTickets || sub.P256dh == "" || sub.Auth == "" {
		return ErrPushSubscriptionInvalid
	}

	topics, err := redeemAll(ctx, tickets, redeem)
	if err != nil {
		return err
	}

	err = pgx.BeginFunc(ctx, s.pool, func(tx pgx.Tx) error {
		q := s.queries.WithTx(tx)

		id, err := q.SaveSubscription(ctx, db.SaveSubscriptionParams{
			Endpoint: sub.Endpoint, P256dh: sub.P256dh, Auth: sub.Auth, Language: string(platform.LanguageOf(ctx)),
		})
		if err != nil {
			return fmt.Errorf("saving the subscription: %w", err)
		}

		for _, topic := range topics {
			if err := q.FollowTopic(ctx, db.FollowTopicParams{
				SubscriptionID: id, Topic: topic, ExpiresAt: s.now().Add(topicLifetime),
			}); err != nil {
				return fmt.Errorf("following a topic: %w", err)
			}
		}

		return nil
	})
	if err != nil {
		return err
	}

	s.logger.InfoContext(ctx, "push subscription saved",
		slog.String("event", "notification.push.subscribed"),
		slog.Int("topics", len(topics)),
	)

	return nil
}

// redeemAll spends every ticket and returns the topics they prove, or
// ErrPushTicketInvalid when one is spent, expired or unknown.
func redeemAll(ctx context.Context, tickets []string, redeem platform.RedeemTicket) ([]string, error) {
	topics := make([]string, 0, len(tickets))

	for _, ticket := range tickets {
		topic, ok, err := redeem(ctx, ticket)
		if err != nil {
			return nil, err
		}

		if !ok {
			return nil, ErrPushTicketInvalid
		}

		topics = append(topics, topic)
	}

	return topics, nil
}

// Unsubscribe forgets a browser's subscription and every topic it follows.
// Forgetting one that is not kept does nothing.
func (s *Service) Unsubscribe(ctx context.Context, endpoint string) error {
	n, err := s.queries.DeleteSubscription(ctx, endpoint)
	if err != nil {
		return fmt.Errorf("forgetting the subscription: %w", err)
	}

	if n > 0 {
		s.logger.InfoContext(ctx, "push subscription forgotten", slog.String("event", "notification.push.unsubscribed"))
	}

	return nil
}

// QueuePush writes p in tx, the transaction of the change it tells of, to be
// sent once tx commits; when tx rolls back, nothing is sent. A push nobody
// follows, or any push while Web Push is off, is not written.
func (s *Service) QueuePush(ctx context.Context, tx pgx.Tx, p Push) error {
	if !s.push.enabled() {
		return nil
	}

	if p.Topic == "" || !strings.HasPrefix(p.Path, "/") || p.Title.VI == "" || p.Title.EN == "" || p.Body.VI == "" || p.Body.EN == "" {
		return fmt.Errorf("a push needs a topic, a path and its words in every language: %+v", p)
	}

	q := s.queries.WithTx(tx)

	followed, err := q.TopicFollowed(ctx, db.TopicFollowedParams{Topic: p.Topic, Now: s.now()})
	if err != nil {
		return fmt.Errorf("reading who follows a topic: %w", err)
	}

	if !followed {
		return nil
	}

	id, err := q.InsertPush(ctx, db.InsertPushParams{
		Topic: p.Topic, About: p.About, Path: p.Path,
		TitleVi: p.Title.VI, TitleEn: p.Title.EN, BodyVi: p.Body.VI, BodyEn: p.Body.EN,
	})
	if err != nil {
		return fmt.Errorf("writing the push: %w", err)
	}

	return platform.Publish(ctx, tx, s.events, pushQueued{PushID: id})
}

// deliver sends a push to every browser following its topic that it has not
// reached. A browser whose subscription is gone is forgotten; a push service
// that fails for a while makes the whole delivery fail, so River tries again,
// and the browsers already reached are skipped. A push older than
// pushLifetime is dropped instead.
func (s *Service) deliver(ctx context.Context, e pushQueued) error {
	p, err := s.queries.GetPush(ctx, e.PushID)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil
	}

	if err != nil {
		return fmt.Errorf("reading the push: %w", err)
	}

	if s.now().Sub(p.CreatedAt) > pushLifetime {
		s.logger.WarnContext(ctx, "push dropped, too old",
			slog.String("event", "notification.push.dropped"),
			slog.String("push_id", p.ID.String()),
		)

		return s.queries.DeletePush(ctx, p.ID)
	}

	recipients, err := s.queries.PendingRecipients(ctx, db.PendingRecipientsParams{Topic: p.Topic, Now: s.now(), PushID: p.ID})
	if err != nil {
		return fmt.Errorf("reading who follows the push's topic: %w", err)
	}

	var later []error

	for _, r := range recipients {
		outcome, err := s.sendPush(ctx, r, p)

		switch outcome {
		case pushDelivered, pushRefused:
			if err := s.queries.RecordDelivery(ctx, db.RecordDeliveryParams{PushID: p.ID, SubscriptionID: r.ID}); err != nil {
				return fmt.Errorf("recording a delivery: %w", err)
			}
		case pushGone:
			if err := s.queries.DeleteSubscriptionByID(ctx, r.ID); err != nil {
				return fmt.Errorf("forgetting a subscription that is gone: %w", err)
			}
		case pushRetry:
			later = append(later, err)
		}
	}

	if len(later) > 0 {
		return fmt.Errorf("a push service failed for now: %w", errors.Join(later...))
	}

	return s.queries.DeletePush(ctx, p.ID)
}

// PurgePushes deletes the topics that lapsed, the subscriptions that follow
// nothing, and the pushes too old to send. It changes nothing a second run
// would not, so it may run twice.
func (s *Service) PurgePushes(ctx context.Context) error {
	now := s.now()

	n, err := s.queries.PurgePushes(ctx, db.PurgePushesParams{
		Now: now, SubscriptionBefore: now.Add(-loneSubscriptionKept), PushBefore: now.Add(-pushLifetime),
	})
	if err != nil {
		return fmt.Errorf("purging the pushes: %w", err)
	}

	if n.Topics+n.Subscriptions+n.Pushes > 0 {
		s.logger.InfoContext(ctx, "lapsed push topics, subscriptions and pushes purged",
			slog.String("event", "notification.push.purged"),
			slog.Int64("topics_purged", n.Topics),
			slog.Int64("subscriptions_purged", n.Subscriptions),
			slog.Int64("pushes_purged", n.Pushes),
		)
	}

	return nil
}

// RegisterListeners makes the module send what it queued.
func RegisterListeners(events *platform.Events, s *Service) {
	platform.Listen(events, "notification.deliver_push", s.deliver)
}

// RegisterSchedules makes the module run what it does on the clock.
func RegisterSchedules(events *platform.Events, s *Service) {
	events.Every("notification.purge_pushes", pushPurgeEvery, s.PurgePushes)
}

// pushServices are the hosts of the push services browsers subscribe with:
// Chrome's and Edge's, Firefox's, Apple's and Windows'. The server posts only
// to them, so an endpoint can never make it reach another host.
var pushServices = []string{"fcm.googleapis.com", "push.services.mozilla.com", "push.apple.com", "notify.windows.com"}

func (s *Service) checkEndpoint(endpoint string) error {
	u, err := url.Parse(endpoint)
	if err != nil || u.Scheme != "https" || u.User != nil || len(endpoint) > 2048 {
		return ErrPushSubscriptionInvalid
	}

	if s.pushHostAllowed != nil {
		if s.pushHostAllowed(u.Host) {
			return nil
		}

		return ErrPushSubscriptionInvalid
	}

	if u.Port() != "" {
		return ErrPushSubscriptionInvalid
	}

	host := strings.ToLower(u.Hostname())
	for _, service := range pushServices {
		if host == service || strings.HasSuffix(host, "."+service) {
			return nil
		}
	}

	return ErrPushSubscriptionInvalid
}

// payload is the push as Declarative Web Push writes it (WebKit, iOS 18.4):
// Safari shows it without our script, and the web's service worker shows the
// same on other browsers.
func (s *Service) payload(p db.NotificationPush, lang platform.Language) ([]byte, error) {
	title, body := platform.Words{VI: p.TitleVi, EN: p.TitleEn}, platform.Words{VI: p.BodyVi, EN: p.BodyEn}

	type notification struct {
		Title    string `json:"title"`
		Body     string `json:"body"`
		Lang     string `json:"lang"`
		Tag      string `json:"tag"`
		Navigate string `json:"navigate"`
	}

	return json.Marshal(struct {
		WebPush      int          `json:"web_push"`
		Notification notification `json:"notification"`
	}{
		WebPush: 8030,
		Notification: notification{
			Title: title.In(lang), Body: body.In(lang), Lang: string(lang), Tag: p.About.String(),
			Navigate: strings.TrimSuffix(s.push.SiteURL, "/") + "/" + string(lang) + p.Path,
		},
	})
}
