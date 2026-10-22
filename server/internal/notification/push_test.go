package notification

import (
	"context"
	"crypto/ecdh"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"sync"
	"testing"
	"time"

	webpush "github.com/SherClockHolmes/webpush-go"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/kl3inIT/second-bite/server/internal/notification/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/platform/platformtest"
)

// pushService stands for a browser's push service: it answers each path with
// the status set for it, 201 by default, and keeps what it received.
type pushService struct {
	*httptest.Server

	mu       sync.Mutex
	status   map[string]int
	received map[string][]*http.Request
}

func newPushService(t *testing.T) *pushService {
	t.Helper()

	p := &pushService{status: map[string]int{}, received: map[string][]*http.Request{}}
	p.Server = httptest.NewTLSServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		p.mu.Lock()
		defer p.mu.Unlock()

		p.received[r.URL.Path] = append(p.received[r.URL.Path], r)

		w.WriteHeader(cmpOr(p.status[r.URL.Path], http.StatusCreated))
	}))
	t.Cleanup(p.Close)

	return p
}

func (p *pushService) answer(path string, status int) {
	p.mu.Lock()
	defer p.mu.Unlock()

	p.status[path] = status
}

func (p *pushService) requests(path string) []*http.Request {
	p.mu.Lock()
	defer p.mu.Unlock()

	return p.received[path]
}

func cmpOr(v, fallback int) int {
	if v == 0 {
		return fallback
	}

	return v
}

// newPushes is a service with Web Push on, posting to service.
func newPushes(t *testing.T, pool *pgxpool.Pool, service *pushService) *Service {
	t.Helper()

	private, public, err := webpush.GenerateVAPIDKeys()
	if err != nil {
		t.Fatal(err)
	}

	events, err := platform.NewEvents(pool, platformtest.Logger())
	if err != nil {
		t.Fatal(err)
	}

	s, err := NewService(pool, nil, events, Config{
		SettingsKey: make([]byte, 32),
		Push:        PushConfig{PublicKey: public, PrivateKey: private, SiteURL: "https://secondbite.example"},
	}, platformtest.Logger())
	if err != nil {
		t.Fatal(err)
	}

	if service != nil {
		s.pushClient = service.Client()
		s.pushHostAllowed = func(host string) bool { return host == service.Listener.Addr().String() }
	}

	return s
}

// browser is a subscription a browser would make at endpoint, with real keys,
// so the push can be encrypted for it.
func browser(t *testing.T, endpoint string) Subscription {
	t.Helper()

	key, err := ecdh.P256().GenerateKey(rand.Reader)
	if err != nil {
		t.Fatal(err)
	}

	return Subscription{
		Endpoint: endpoint,
		P256dh:   base64.RawURLEncoding.EncodeToString(key.PublicKey().Bytes()),
		Auth:     base64.RawURLEncoding.EncodeToString([]byte(rand.Text())[:16]),
	}
}

// redeemAs proves topic for any ticket; ok false refuses every ticket.
func redeemAs(topic string, ok bool) platform.RedeemTicket {
	return func(context.Context, string) (string, bool, error) { return topic, ok, nil }
}

func testPush(topic string) Push {
	return Push{
		Topic: topic, About: uuid.New(), Path: "/orders/1",
		Title: platform.Words{VI: "Croissant đã sẵn sàng", EN: "Croissant is ready"},
		Body:  platform.Words{VI: "Đến La Paris lấy trước 18:00", EN: "Collect at La Paris by 18:00"},
	}
}

func queue(t *testing.T, s *Service, p Push) uuid.UUID {
	t.Helper()

	err := pgx.BeginFunc(t.Context(), s.pool, func(tx pgx.Tx) error { return s.QueuePush(t.Context(), tx, p) })
	if err != nil {
		t.Fatal(err)
	}

	var id uuid.UUID
	if err := s.pool.QueryRow(t.Context(), `SELECT id FROM notification_pushes WHERE about = $1`, p.About).Scan(&id); err != nil &&
		!errors.Is(err, pgx.ErrNoRows) {
		t.Fatal(err)
	}

	return id
}

func TestPush(t *testing.T) {
	t.Parallel()

	pool := platformtest.StartPostgres(t)

	for name, check := range map[string]func(*testing.T, *pgxpool.Pool){
		"subscribing is checked":                  testSubscribingIsChecked,
		"a push reaches its topic's browsers":     testPushReachesBrowsers,
		"a push service down is tried again":      testPushRetried,
		"a push nobody follows is not written":    testPushNobodyFollows,
		"a push is written in the language asked": testPushPayload,
	} {
		t.Run(name, func(t *testing.T) {
			t.Parallel()
			check(t, pool)
		})
	}
}

func testSubscribingIsChecked(t *testing.T, pool *pgxpool.Pool) {
	t.Helper()

	off := newPushes(t, pool, nil)
	off.push = PushConfig{}

	if err := off.Subscribe(t.Context(), browser(t, "https://fcm.googleapis.com/fcm/send/x"), []string{"t"}, redeemAs("order:1", true)); !errors.Is(err, ErrPushNotConfigured) {
		t.Errorf("subscribing with Web Push off: %v, want ErrPushNotConfigured", err)
	}

	if _, err := off.PushKey(); !errors.Is(err, ErrPushNotConfigured) {
		t.Errorf("the key with Web Push off: %v, want ErrPushNotConfigured", err)
	}

	s := newPushes(t, pool, nil)

	for _, endpoint := range []string{
		"https://example.com/push",              // not a push service
		"http://fcm.googleapis.com/fcm/send/x",  // not HTTPS
		"https://fcm.googleapis.com:8443/fcm/x", // another port
		"https://fcm.googleapis.com.example/x",  // a look-alike host
		"https://user@fcm.googleapis.com/fcm/x", // credentials
	} {
		if err := s.Subscribe(t.Context(), browser(t, endpoint), []string{"t"}, redeemAs("order:1", true)); !errors.Is(err, ErrPushSubscriptionInvalid) {
			t.Errorf("subscribing %s: %v, want ErrPushSubscriptionInvalid", endpoint, err)
		}
	}

	if err := s.Subscribe(t.Context(), browser(t, "https://web.push.apple.com/abc"), []string{"spent"}, redeemAs("", false)); !errors.Is(err, ErrPushTicketInvalid) {
		t.Errorf("subscribing with a spent ticket: %v, want ErrPushTicketInvalid", err)
	}

	if err := s.Subscribe(t.Context(), browser(t, "https://web.push.apple.com/abc"), nil, redeemAs("order:1", true)); !errors.Is(err, ErrPushSubscriptionInvalid) {
		t.Errorf("subscribing with no ticket: %v, want ErrPushSubscriptionInvalid", err)
	}
}

func testPushReachesBrowsers(t *testing.T, pool *pgxpool.Pool) {
	t.Helper()

	service := newPushService(t)
	s := newPushes(t, pool, service)
	topic := "order:" + uuid.NewString()

	kept, gone := browser(t, service.URL+"/kept"), browser(t, service.URL+"/gone")
	service.answer("/gone", http.StatusGone)

	for _, b := range []Subscription{kept, gone} {
		if err := s.Subscribe(t.Context(), b, []string{"ticket"}, redeemAs(topic, true)); err != nil {
			t.Fatal(err)
		}
	}

	p := testPush(topic)
	id := queue(t, s, p)

	if err := s.deliver(t.Context(), pushQueued{PushID: id}); err != nil {
		t.Fatalf("delivering: %v", err)
	}

	sent := service.requests("/kept")
	if len(sent) != 1 {
		t.Fatalf("the kept browser received %d pushes, want 1", len(sent))
	}

	for header, want := range map[string]string{
		"TTL": "1800", "Urgency": "high", "Content-Encoding": "aes128gcm",
		"Topic": strings.ReplaceAll(p.About.String(), "-", ""),
	} {
		if got := sent[0].Header.Get(header); got != want {
			t.Errorf("the push's %s: %q, want %q", header, got, want)
		}
	}

	if got := sent[0].Header.Get("Authorization"); len(got) < 6 || got[:6] != "vapid " {
		t.Errorf("the push's Authorization: %q, want a VAPID one", got)
	}

	expectRows(t, pool, `SELECT count(*) FROM notification_pushes WHERE id = $1`, id, 0, "the push once delivered")
	expectRows(t, pool, `SELECT count(*) FROM notification_push_subscriptions WHERE endpoint = $1`, gone.Endpoint, 0,
		"the subscription its push service called gone")
	expectRows(t, pool, `SELECT count(*) FROM notification_push_subscriptions WHERE endpoint = $1`, kept.Endpoint, 1,
		"the subscription that received it")
}

func testPushRetried(t *testing.T, pool *pgxpool.Pool) {
	t.Helper()

	service := newPushService(t)
	s := newPushes(t, pool, service)
	topic := "seller:" + uuid.NewString()

	one, two := browser(t, service.URL+"/one"), browser(t, service.URL+"/two")
	for _, b := range []Subscription{one, two} {
		if err := s.Subscribe(t.Context(), b, []string{"ticket"}, redeemAs(topic, true)); err != nil {
			t.Fatal(err)
		}
	}

	service.answer("/two", http.StatusServiceUnavailable)

	id := queue(t, s, testPush(topic))

	if err := s.deliver(t.Context(), pushQueued{PushID: id}); err == nil {
		t.Fatal("delivering while a push service is down succeeded, want an error so it is tried again")
	}

	expectRows(t, pool, `SELECT count(*) FROM notification_pushes WHERE id = $1`, id, 1, "the push kept for the retry")

	service.answer("/two", http.StatusCreated)

	if err := s.deliver(t.Context(), pushQueued{PushID: id}); err != nil {
		t.Fatalf("delivering again: %v", err)
	}

	if n := len(service.requests("/one")); n != 1 {
		t.Errorf("the browser reached first received %d pushes, want 1", n)
	}

	if n := len(service.requests("/two")); n != 2 {
		t.Errorf("the browser whose service was down was tried %d times, want 2", n)
	}

	// A push too old to matter is dropped, not sent.
	stale := queue(t, s, testPush(topic))
	s.now = func() time.Time { return time.Now().Add(pushLifetime + time.Minute) }

	if err := s.deliver(t.Context(), pushQueued{PushID: stale}); err != nil {
		t.Fatal(err)
	}

	if n := len(service.requests("/one")); n != 1 {
		t.Errorf("a stale push was sent: %d pushes, want 1", n)
	}

	expectRows(t, pool, `SELECT count(*) FROM notification_pushes WHERE id = $1`, stale, 0, "the stale push")
}

func testPushNobodyFollows(t *testing.T, pool *pgxpool.Pool) {
	t.Helper()

	s := newPushes(t, pool, nil)
	p := testPush("order:" + uuid.NewString())

	if id := queue(t, s, p); id != uuid.Nil {
		t.Errorf("a push nobody follows was written")
	}

	// Followed, but rolled back with its change: nothing is written.
	if err := s.Subscribe(t.Context(), browser(t, "https://fcm.googleapis.com/fcm/send/"+uuid.NewString()), []string{"t"},
		redeemAs(p.Topic, true)); err != nil {
		t.Fatal(err)
	}

	rollback := errors.New("the change failed")

	err := pgx.BeginFunc(t.Context(), s.pool, func(tx pgx.Tx) error {
		if err := s.QueuePush(t.Context(), tx, p); err != nil {
			return err
		}

		return rollback
	})
	if !errors.Is(err, rollback) {
		t.Fatal(err)
	}

	expectRows(t, pool, `SELECT count(*) FROM notification_pushes WHERE about = $1`, p.About, 0, "a push rolled back")
}

func testPushPayload(t *testing.T, pool *pgxpool.Pool) {
	t.Helper()

	s := newPushes(t, pool, nil)
	about := uuid.New()

	message, err := s.payload(db.NotificationPush{
		About: about, Path: "/orders/" + about.String(),
		TitleVi: "Croissant đã sẵn sàng", TitleEn: "Croissant is ready",
		BodyVi: "Đến La Paris lấy trước 18:00", BodyEn: "Collect at La Paris by 18:00",
	}, platform.LanguageEnglish)
	if err != nil {
		t.Fatal(err)
	}

	var got struct {
		WebPush      int `json:"web_push"`
		Notification struct {
			Title, Body, Lang, Tag, Navigate string
		} `json:"notification"`
	}
	if err := json.Unmarshal(message, &got); err != nil {
		t.Fatal(err)
	}

	n := got.Notification
	if got.WebPush != 8030 || n.Title != "Croissant is ready" || n.Body != "Collect at La Paris by 18:00" ||
		n.Lang != "en" || n.Tag != about.String() || n.Navigate != "https://secondbite.example/en/orders/"+about.String() {
		t.Errorf("the payload: %s", message)
	}
}

// TestPushesPurged runs in a database of its own: purging reads the clock
// moved a week on, which would purge what the other checks follow.
func TestPushesPurged(t *testing.T) {
	t.Parallel()

	pool := platformtest.StartPostgres(t)
	s := newPushes(t, pool, nil)

	b := browser(t, "https://fcm.googleapis.com/fcm/send/"+uuid.NewString())
	if err := s.Subscribe(t.Context(), b, []string{"t"}, redeemAs("order:"+uuid.NewString(), true)); err != nil {
		t.Fatal(err)
	}

	if err := s.PurgePushes(t.Context()); err != nil {
		t.Fatal(err)
	}

	expectRows(t, pool, `SELECT count(*) FROM notification_push_subscriptions WHERE endpoint = $1`, b.Endpoint, 1,
		"a subscription following a topic")

	s.now = func() time.Time { return time.Now().Add(topicLifetime + time.Hour) }
	for range 2 { // a second run purges nothing more
		if err := s.PurgePushes(t.Context()); err != nil {
			t.Fatal(err)
		}
	}

	expectRows(t, pool, `SELECT count(*) FROM notification_push_subscriptions WHERE endpoint = $1`, b.Endpoint, 0,
		"a subscription whose topics lapsed")
}

func expectRows(t *testing.T, pool *pgxpool.Pool, query string, arg any, want int, what string) {
	t.Helper()

	var n int
	if err := pool.QueryRow(t.Context(), query, arg).Scan(&n); err != nil {
		t.Fatal(err)
	}

	if n != want {
		t.Errorf("%s: %d rows, want %d", what, n, want)
	}
}
