package platform_test

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"sync"
	"testing"
	"time"

	"github.com/coder/websocket"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/platform/platformtest"
)

const (
	frameWait   = 10 * time.Second
	noticeType  = "order"
	statusReady = "ready"
	statusKey   = "status"
	typeKey     = "type"
)

// tickets is a module's tickets, each redeemed once.
type tickets struct {
	mu     sync.Mutex
	topics map[string]string
}

func (k *tickets) redeem(_ context.Context, ticket string) (string, bool, error) {
	k.mu.Lock()
	defer k.mu.Unlock()

	topic, ok := k.topics[ticket]
	delete(k.topics, ticket)

	return topic, ok, nil
}

// liveServer is one instance: a hub behind an HTTP server that mounts it.
type liveServer struct {
	url  string
	stop func()
}

// startLive runs a hub on pool and serves it at GET /live; configure changes
// the HTTP server before it starts.
func startLive(t *testing.T, pool *pgxpool.Pool, k *tickets, configure func(*http.Server), opts ...platform.LiveOption) liveServer {
	t.Helper()

	live := platform.NewLive(pool, platformtest.Logger(), k.redeem, opts...)

	mux := http.NewServeMux()
	mux.Handle("GET /live", live)

	srv := httptest.NewUnstartedServer(mux)
	if configure != nil {
		configure(srv.Config)
	}

	srv.Start()

	ctx, cancel := context.WithCancel(t.Context())
	done := make(chan struct{})

	go func() {
		defer close(done)

		if err := live.Run(ctx); err != nil {
			t.Errorf("Run returned %v, want nil", err)
		}
	}()

	var once sync.Once

	stop := func() {
		once.Do(func() {
			cancel()
			<-done
			srv.Close()
		})
	}
	t.Cleanup(stop)

	return liveServer{url: "ws" + strings.TrimPrefix(srv.URL, "http") + "/live", stop: stop}
}

func dial(t *testing.T, s liveServer) *websocket.Conn {
	t.Helper()

	ctx, cancel := context.WithTimeout(t.Context(), frameWait)
	defer cancel()

	c, _, err := websocket.Dial(ctx, s.url, nil) //nolint:bodyclose // the library owns the upgrade response
	if err != nil {
		t.Fatalf("dialing %s: %v", s.url, err)
	}

	t.Cleanup(func() { _ = c.CloseNow() })

	return c
}

func send(t *testing.T, c *websocket.Conn, frame string) {
	t.Helper()

	ctx, cancel := context.WithTimeout(t.Context(), frameWait)
	defer cancel()

	if err := c.Write(ctx, websocket.MessageText, []byte(frame)); err != nil {
		t.Fatalf("writing a frame: %v", err)
	}
}

// next reads the next frame as an object, leaving out the resync a hub sends
// when it starts listening after the socket opened.
func next(t *testing.T, c *websocket.Conn) map[string]any {
	t.Helper()

	ctx, cancel := context.WithTimeout(t.Context(), frameWait)
	defer cancel()

	for {
		_, data, err := c.Read(ctx)
		if err != nil {
			t.Fatalf("reading a frame: %v", err)
		}

		var frame map[string]any
		if err := json.Unmarshal(data, &frame); err != nil {
			t.Fatalf("frame %q is not an object: %v", data, err)
		}

		if frame["type"] != "resync" {
			return frame
		}
	}
}

// closedWith reads until the connection ends and returns the code it ended with.
func closedWith(t *testing.T, c *websocket.Conn) websocket.StatusCode {
	t.Helper()

	ctx, cancel := context.WithTimeout(t.Context(), frameWait)
	defer cancel()

	for {
		if _, _, err := c.Read(ctx); err != nil {
			return websocket.CloseStatus(err)
		}
	}
}

// follow gives topic a ticket and subscribes c to it.
func follow(t *testing.T, k *tickets, c *websocket.Conn, ticket, topic string) {
	t.Helper()

	k.mu.Lock()
	k.topics[ticket] = topic
	k.mu.Unlock()

	send(t, c, fmt.Sprintf(`{"type":"subscribe","ticket":%q}`, ticket))

	if got := next(t, c); got["type"] != "subscribed" || got["topic"] != topic {
		t.Fatalf("subscribing to %s answered %v, want subscribed", topic, got)
	}
}

// notify sends a notice in a transaction, which commits or rolls back.
func notify(t *testing.T, pool *pgxpool.Pool, commit bool, notice any, topics ...string) {
	t.Helper()

	tx, err := pool.Begin(t.Context())
	if err != nil {
		t.Fatal(err)
	}

	if err := platform.Notify(t.Context(), tx, notice, topics...); err != nil {
		t.Fatal(err)
	}

	finish := tx.Rollback
	if commit {
		finish = tx.Commit
	}

	if err := finish(t.Context()); err != nil {
		t.Fatal(err)
	}
}

// delivered notifies until c hears the notice: a hub may start listening a
// moment after it serves.
func delivered(t *testing.T, pool *pgxpool.Pool, c *websocket.Conn, notice map[string]any, topics ...string) {
	t.Helper()

	got := make(chan map[string]any, 1)

	go func() {
		ctx, cancel := context.WithTimeout(context.WithoutCancel(t.Context()), frameWait)
		defer cancel()

		for {
			_, data, err := c.Read(ctx)
			if err != nil {
				got <- nil

				return
			}

			var frame map[string]any
			if json.Unmarshal(data, &frame) == nil && frame["type"] != "resync" {
				got <- frame

				return
			}
		}
	}()

	for {
		notify(t, pool, true, notice, topics...)

		select {
		case frame := <-got:
			if fmt.Sprint(frame) != fmt.Sprint(notice) {
				t.Fatalf("heard %v, want %v", frame, notice)
			}

			return
		case <-time.After(200 * time.Millisecond):
		}
	}
}

// TestLive runs the hub's checks one after another against one PostgreSQL:
// they kill listening connections, which parallel checks would feel.
func TestLive(t *testing.T) { //nolint:paralleltest // the checks kill listening connections, which parallel checks would feel
	pool := platformtest.StartPostgres(t)

	for name, check := range map[string]func(*testing.T, *pgxpool.Pool){ //nolint:paralleltest // see above
		"a notice committed through one instance reaches a socket on another":     testNoticeAcrossInstances,
		"a rolled back notice reaches nobody, and a socket hears only its topics": testRollbackAndTopics,
		"a ticket works once":                                          testTicketWorksOnce,
		"a connection follows at most twenty topics":                   testTopicLimit,
		"a connection that keeps sending bad tickets closes with 1008": testAttemptLimit,
		"a connection that follows nothing closes with 1008":           testIdle,
		"a frame that is not a subscription closes with 1008":          testProtocolViolation,
		"a frame over 4 KiB closes with 1009":                          testFrameTooBig,
		"a connection that never reads is closed with 1013":            testFullQueue,
		"a missed pong closes the connection":                          testMissedPong,
		"a connection ends with 4000 at its lifetime":                  testLifetime,
		"resync follows the listening connection being killed":         testResync,
		"a socket outlives the server's read and write timeouts":       testOutlivesTimeouts,
		"stopping closes every socket with 1001":                       testStopClosesWith1001,
	} {
		t.Run(name, func(t *testing.T) { check(t, pool) })
	}
}

func newTickets() *tickets { return &tickets{topics: map[string]string{}} }

func testNoticeAcrossInstances(t *testing.T, pool *pgxpool.Pool) {
	t.Helper()

	k := newTickets()
	a, b := startLive(t, pool, k, nil), startLive(t, pool, k, nil)

	onA, onB := dial(t, a), dial(t, b)
	follow(t, k, onA, "t1", "order:1")
	follow(t, k, onB, "t2", "order:1")

	notice := map[string]any{typeKey: noticeType, "orderId": "1", statusKey: statusReady}

	delivered(t, pool, onA, notice, "order:1", "seller:9")

	// The other instance heard it as well; one more notice proves it.
	delivered(t, pool, onB, notice, "order:1")
}

func testRollbackAndTopics(t *testing.T, pool *pgxpool.Pool) {
	t.Helper()

	k := newTickets()
	s := startLive(t, pool, k, nil)

	c := dial(t, s)
	follow(t, k, c, "t1", "order:1")

	// Neither the rolled back notice nor the one for another topic arrives
	// before the one that should.
	notify(t, pool, false, map[string]any{typeKey: noticeType, statusKey: "rolled back"}, "order:1")
	notify(t, pool, true, map[string]any{typeKey: noticeType, statusKey: "elsewhere"}, "order:2")

	delivered(t, pool, c, map[string]any{typeKey: noticeType, statusKey: "heard"}, "order:1")
}

func testTicketWorksOnce(t *testing.T, pool *pgxpool.Pool) {
	t.Helper()

	k := newTickets()
	s := startLive(t, pool, k, nil)

	c := dial(t, s)
	follow(t, k, c, "once", "order:1")

	send(t, c, `{"type":"subscribe","ticket":"once"}`)

	if got := next(t, c); got["type"] != "refused" {
		t.Errorf("the used ticket answered %v, want refused", got)
	}

	send(t, c, `{"type":"subscribe","ticket":"never-minted"}`)

	if got := next(t, c); got["type"] != "refused" {
		t.Errorf("an unknown ticket answered %v, want refused", got)
	}
}

func testTopicLimit(t *testing.T, pool *pgxpool.Pool) {
	t.Helper()

	k := newTickets()
	s := startLive(t, pool, k, nil)

	c := dial(t, s)
	for i := range 20 {
		follow(t, k, c, fmt.Sprintf("t%d", i), fmt.Sprintf("order:%d", i))
	}

	k.mu.Lock()
	k.topics["one-too-many"] = "order:20"
	k.mu.Unlock()

	send(t, c, `{"type":"subscribe","ticket":"one-too-many"}`)

	if got := next(t, c); got["type"] != "refused" {
		t.Errorf("the 21st topic answered %v, want refused", got)
	}
}

func testAttemptLimit(t *testing.T, pool *pgxpool.Pool) {
	t.Helper()

	s := startLive(t, pool, newTickets(), nil)

	c := dial(t, s)
	for i := range 40 {
		send(t, c, `{"type":"subscribe","ticket":"unknown"}`)

		if got := next(t, c); got["type"] != "refused" {
			t.Fatalf("attempt %d answered %v, want refused", i+1, got)
		}
	}

	send(t, c, `{"type":"subscribe","ticket":"unknown"}`)

	if got := closedWith(t, c); got != websocket.StatusPolicyViolation {
		t.Errorf("closed with %d after the 41st attempt, want 1008", got)
	}
}

func testIdle(t *testing.T, pool *pgxpool.Pool) {
	t.Helper()

	s := startLive(t, pool, newTickets(), nil, platform.WithLiveTiming(platform.LiveTiming{Idle: 200 * time.Millisecond}))

	if got := closedWith(t, dial(t, s)); got != websocket.StatusPolicyViolation {
		t.Errorf("closed with %d, want 1008", got)
	}

	// A connection that follows a topic in time stays open past the grace.
	k := newTickets()
	s = startLive(t, pool, k, nil, platform.WithLiveTiming(platform.LiveTiming{Idle: 300 * time.Millisecond}))

	c := dial(t, s)
	follow(t, k, c, "t", "order:1")

	time.Sleep(600 * time.Millisecond)

	k.mu.Lock()
	k.topics["again"] = "order:2"
	k.mu.Unlock()
	send(t, c, `{"type":"subscribe","ticket":"again"}`)

	if got := next(t, c); got["type"] != "subscribed" {
		t.Errorf("after the grace a connection that follows a topic answered %v, want subscribed", got)
	}
}

func testProtocolViolation(t *testing.T, pool *pgxpool.Pool) {
	t.Helper()

	s := startLive(t, pool, newTickets(), nil)

	c := dial(t, s)
	send(t, c, `{"type":"hello"}`)

	if got := closedWith(t, c); got != websocket.StatusPolicyViolation {
		t.Errorf("closed with %d, want 1008", got)
	}
}

func testFrameTooBig(t *testing.T, pool *pgxpool.Pool) {
	t.Helper()

	s := startLive(t, pool, newTickets(), nil)

	c := dial(t, s)
	send(t, c, `{"type":"subscribe","ticket":"`+strings.Repeat("x", 5000)+`"}`)

	if got := closedWith(t, c); got != websocket.StatusMessageTooBig {
		t.Errorf("closed with %d, want 1009", got)
	}
}

func testFullQueue(t *testing.T, pool *pgxpool.Pool) {
	t.Helper()

	k := newTickets()
	s := startLive(t, pool, k, nil, platform.WithLiveTiming(platform.LiveTiming{Write: time.Minute}))

	c := dial(t, s)
	follow(t, k, c, "t1", "order:1")

	// The client reads slower than notices of 7 KB come, so they pile up past
	// what the sockets' buffers hold and the queue of 64; the connection is
	// then closed, and the client finds out once it reads on.
	codes := make(chan websocket.StatusCode, 1)

	go func() {
		for {
			if _, _, err := c.Read(context.WithoutCancel(t.Context())); err != nil {
				codes <- websocket.CloseStatus(err)

				return
			}

			time.Sleep(20 * time.Millisecond)
		}
	}()

	notice := map[string]any{"type": "message", "padding": strings.Repeat("x", 7000)}
	deadline := time.After(2 * frameWait)

	for {
		select {
		case code := <-codes:
			if code != websocket.StatusTryAgainLater {
				t.Errorf("closed with %d, want 1013", code)
			}

			return
		case <-deadline:
			t.Fatal("the connection stayed open while its queue should have filled")
		default:
			notify(t, pool, true, notice, "order:1")
		}
	}
}

func testMissedPong(t *testing.T, pool *pgxpool.Pool) {
	t.Helper()

	s := startLive(t, pool, newTickets(), nil, platform.WithLiveTiming(platform.LiveTiming{Ping: 50 * time.Millisecond, Pong: 100 * time.Millisecond}))

	// The client reads nothing, so the library does not answer the pings.
	c := dial(t, s)

	time.Sleep(time.Second)

	if got := closedWith(t, c); got != websocket.StatusGoingAway {
		t.Errorf("closed with %d, want 1001", got)
	}
}

func testLifetime(t *testing.T, pool *pgxpool.Pool) {
	t.Helper()

	s := startLive(t, pool, newTickets(), nil, platform.WithLiveTiming(platform.LiveTiming{Lifetime: 200 * time.Millisecond}))

	c := dial(t, s)

	if got := closedWith(t, c); got != 4000 {
		t.Errorf("closed with %d, want 4000", got)
	}
}

func testResync(t *testing.T, pool *pgxpool.Pool) {
	t.Helper()

	k := newTickets()
	s := startLive(t, pool, k, nil)

	c := dial(t, s)
	follow(t, k, c, "t1", "order:1")

	resyncs := make(chan struct{}, 8)

	go func() {
		for {
			_, data, err := c.Read(context.WithoutCancel(t.Context()))
			if err != nil {
				return
			}

			if strings.Contains(string(data), `"resync"`) {
				resyncs <- struct{}{}
			}
		}
	}()

	// Kill the listening connection until a resync follows a kill that found
	// one; the resync a hub sends when it first listens does not count.
	killed := 0
	deadline := time.After(frameWait)

	for {
		var n int
		if err := pool.QueryRow(t.Context(),
			"SELECT count(*) FROM (SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE query = 'LISTEN "+platform.LiveChannel+"') AS k",
		).Scan(&n); err != nil {
			t.Fatal(err)
		}

		killed += n

		select {
		case <-resyncs:
			if killed > 0 {
				return
			}
		case <-deadline:
			t.Fatal("no resync came after the listening connection was killed")
		case <-time.After(300 * time.Millisecond):
		}
	}
}

func testOutlivesTimeouts(t *testing.T, pool *pgxpool.Pool) {
	t.Helper()

	k := newTickets()
	s := startLive(t, pool, k, func(srv *http.Server) {
		srv.ReadTimeout, srv.WriteTimeout = 200*time.Millisecond, 200*time.Millisecond
	})

	c := dial(t, s)
	follow(t, k, c, "t1", "order:1")

	time.Sleep(600 * time.Millisecond)

	delivered(t, pool, c, map[string]any{typeKey: noticeType, statusKey: statusReady}, "order:1")
}

func testStopClosesWith1001(t *testing.T, pool *pgxpool.Pool) {
	t.Helper()

	k := newTickets()
	s := startLive(t, pool, k, nil)

	c := dial(t, s)
	follow(t, k, c, "t1", "order:1")

	go s.stop()

	if got := closedWith(t, c); got != websocket.StatusGoingAway {
		t.Errorf("closed with %d, want 1001", got)
	}
}
