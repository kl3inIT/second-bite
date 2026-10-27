package platform

import (
	"cmp"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"sync"
	"sync/atomic"
	"time"

	"github.com/coder/websocket"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// LiveChannel is the PostgreSQL channel the notices travel on. A statement
// that notifies from SQL names it too.
const LiveChannel = "secondbite_live"

const (
	// liveTopicsPerConn is how many topics one connection follows: the orders
	// a browser keeps without an account.
	liveTopicsPerConn = 20
	// liveAttemptsPerConn is how many subscribe frames one connection may send,
	// refused ones included, so a client without tickets cannot make the server
	// query without end; the next one closes it with 1008.
	liveAttemptsPerConn = 40
	// liveReadLimit bounds a frame from the client; a larger one closes the
	// connection with 1009.
	liveReadLimit = 4 << 10
	// liveQueueSize bounds the notices waiting for one connection; a full
	// queue closes it with 1013 so the client catches up after reconnecting.
	liveQueueSize = 64
	// liveNotifyLimit is below PostgreSQL's 8000-byte limit of a payload.
	liveNotifyLimit = 7900

	// closeLifetime asks the client to reconnect, with new tickets.
	closeLifetime websocket.StatusCode = 4000

	liveListenBackoff    = time.Second
	liveListenBackoffMax = 30 * time.Second
	liveCloseTimeout     = 5 * time.Second
)

// Frames the server sends, besides the notices modules send.
const (
	liveResync           = `{"type":"resync"}`
	liveRefused          = `{"type":"refused"}`
	liveSubscribedFormat = `{"type":"subscribed","topic":%q}`
)

// errBadFrame ends the read loop of a client that broke the protocol.
var errBadFrame = errors.New("the client sent a frame that is not a subscription")

// RedeemTicket exchanges a live ticket for the topic it lets its holder
// follow, once; ok is false when the ticket is unknown, used or expired. The
// module that mints tickets provides it, so the platform knows no module.
type RedeemTicket func(ctx context.Context, ticket string) (topic string, ok bool, err error)

// LiveTiming is how often the hub pings, how long it waits for a pong, how
// long a connection lives and how long it may follow nothing; each defaults
// when zero.
type LiveTiming struct {
	Ping, Pong, Lifetime, Write, Idle time.Duration
}

func (t LiveTiming) withDefaults() LiveTiming {
	return LiveTiming{
		Ping:     cmp.Or(t.Ping, 25*time.Second),
		Pong:     cmp.Or(t.Pong, 10*time.Second),
		Lifetime: cmp.Or(t.Lifetime, 30*time.Minute),
		Write:    cmp.Or(t.Write, 10*time.Second),
		Idle:     cmp.Or(t.Idle, 10*time.Second),
	}
}

// LiveOption changes how a Live behaves; tests use it to shorten its times.
type LiveOption func(*Live)

// WithLiveTiming sets the times of the heartbeat and of a connection's life.
func WithLiveTiming(t LiveTiming) LiveOption {
	return func(l *Live) { l.timing = t.withDefaults() }
}

// WithLiveMaxConns caps the sockets the instance holds below liveMaxConns, as
// a test needs.
func WithLiveMaxConns(n int) LiveOption {
	return func(l *Live) { l.maxConns = n }
}

// Live pushes notices to the browsers that follow a topic, over WebSocket. A
// module notifies in the transaction that makes a change (Notify); PostgreSQL
// delivers it on commit to every instance, which passes it to its own
// connections on that topic. A connection follows a topic only for a live
// ticket, which the module that mints them redeems.
type Live struct {
	pool   *pgxpool.Pool
	logger *slog.Logger
	redeem RedeemTicket
	timing LiveTiming
	// maxConns caps the sockets the instance holds (SEC-160); held counts the
	// places taken, from before the upgrade until the socket's handler returns.
	maxConns int
	held     int

	mu      sync.Mutex
	closing bool
	conns   map[*liveConn]struct{}
	byTopic map[string]map[*liveConn]struct{}
}

// NewLive prepares the hub on pool. It listens only once Run is called.
func NewLive(pool *pgxpool.Pool, logger *slog.Logger, redeem RedeemTicket, opts ...LiveOption) *Live {
	l := &Live{
		pool: pool, logger: logger, redeem: redeem, timing: LiveTiming{}.withDefaults(), maxConns: liveMaxConns,
		conns: map[*liveConn]struct{}{}, byTopic: map[string]map[*liveConn]struct{}{},
	}

	for _, opt := range opts {
		opt(l)
	}

	return l
}

// liveBroadcast is what travels through NOTIFY: the topics a notice is for,
// and the notice, a JSON object with a "type", as the client reads it. Never
// a message's text.
type liveBroadcast struct {
	Topics []string        `json:"topics"`
	Notice json.RawMessage `json:"notice"`
}

// Notify sends notice to the connections following any of topics, in tx: it
// is delivered when tx commits, and never when it rolls back. A notice names
// what changed with identifiers and numbers only.
func Notify(ctx context.Context, tx pgx.Tx, notice any, topics ...string) error {
	body, err := json.Marshal(notice)
	if err != nil {
		return fmt.Errorf("writing the notice: %w", err)
	}

	payload, err := json.Marshal(liveBroadcast{Topics: topics, Notice: body})
	if err != nil {
		return fmt.Errorf("writing the notice: %w", err)
	}

	if len(payload) > liveNotifyLimit {
		return errors.New("the notice is too large to send")
	}

	if _, err := tx.Exec(ctx, "SELECT pg_notify($1, $2)", LiveChannel, string(payload)); err != nil {
		return fmt.Errorf("sending the notice: %w", err)
	}

	return nil
}

// Run listens for notices on a connection of its own until ctx ends, then
// closes every socket with 1001. When the connection drops it listens again
// with backoff, and tells every socket to read its state again, since the
// notices sent meanwhile are lost.
func (l *Live) Run(ctx context.Context) error {
	defer l.closeAll(websocket.StatusGoingAway, "the server is stopping")

	backoff := liveListenBackoff

	for {
		listened, err := l.listen(ctx)
		if ctx.Err() != nil {
			return nil
		}

		if listened {
			backoff = liveListenBackoff
		}

		l.logger.WarnContext(ctx, "live listening dropped",
			slog.String("event", "platform.live.listen_dropped"),
			slog.String("error_type", fmt.Sprintf("%T", err)),
			slog.Duration("retry_in", backoff),
		)

		select {
		case <-ctx.Done():
			return nil
		case <-time.After(backoff):
		}

		backoff = min(backoff*2, liveListenBackoffMax)
	}
}

// listen holds one listening connection until it fails or ctx ends. listened
// tells whether it listened at all.
func (l *Live) listen(ctx context.Context) (listened bool, err error) {
	conn, err := pgx.ConnectConfig(ctx, l.pool.Config().ConnConfig)
	if err != nil {
		return false, fmt.Errorf("connecting to listen: %w", err)
	}

	defer func() {
		closeCtx, cancel := context.WithTimeout(context.WithoutCancel(ctx), liveCloseTimeout)
		defer cancel()

		_ = conn.Close(closeCtx)
	}()

	if _, err := conn.Exec(ctx, "LISTEN "+LiveChannel); err != nil {
		return false, fmt.Errorf("listening: %w", err)
	}

	l.logger.InfoContext(ctx, "live listening",
		slog.String("event", "platform.live.listening"),
		slog.String("channel", LiveChannel),
	)

	// Whatever was sent while nobody listened is lost.
	l.broadcastResync()

	for {
		n, err := conn.WaitForNotification(ctx)
		if err != nil {
			return true, fmt.Errorf("waiting for a notice: %w", err)
		}

		l.dispatch(ctx, n.Payload)
	}
}

func (l *Live) dispatch(ctx context.Context, payload string) {
	var b liveBroadcast
	if err := json.Unmarshal([]byte(payload), &b); err != nil || len(b.Notice) == 0 {
		l.logger.WarnContext(ctx, "live notice unreadable",
			slog.String("event", "platform.live.notice_unreadable"),
		)

		return
	}

	l.mu.Lock()
	defer l.mu.Unlock()

	// A connection following two of the topics gets the notice once.
	sent := map[*liveConn]struct{}{}

	for _, topic := range b.Topics {
		for c := range l.byTopic[topic] {
			if _, done := sent[c]; !done {
				sent[c] = struct{}{}
				c.enqueue([]byte(b.Notice))
			}
		}
	}
}

func (l *Live) broadcastResync() {
	l.mu.Lock()
	defer l.mu.Unlock()

	for c := range l.conns {
		c.enqueue([]byte(liveResync))
	}
}

// closeAll closes every socket with code and refuses new ones, waiting for
// the close handshakes.
func (l *Live) closeAll(code websocket.StatusCode, reason string) {
	l.mu.Lock()
	l.closing = true
	conns := make([]*liveConn, 0, len(l.conns))

	for c := range l.conns {
		conns = append(conns, c)
	}
	l.mu.Unlock()

	var wg sync.WaitGroup

	for _, c := range conns {
		wg.Go(func() { c.close(code, reason) })
	}

	wg.Wait()
}

// liveConn is one browser's socket.
type liveConn struct {
	ws     *websocket.Conn
	send   chan []byte
	cancel context.CancelFunc
	once   sync.Once
	// code is the close code the server chose, 0 while the client closed first.
	code atomic.Int32
	// topics is guarded by the hub's mutex.
	topics map[string]struct{}
}

// enqueue queues a frame without waiting; a connection whose queue is full is
// closed and catches up when it reconnects.
func (c *liveConn) enqueue(frame []byte) {
	select {
	case c.send <- frame:
	default:
		go c.close(websocket.StatusTryAgainLater, "too slow")
	}
}

// close ends the connection once, with code, and waits up to the library's
// timeout for the client's answer.
func (c *liveConn) close(code websocket.StatusCode, reason string) {
	c.once.Do(func() {
		c.code.Store(int32(code)) //nolint:gosec // close codes are 1000 to 4999
		_ = c.ws.Close(code, reason)
		c.cancel()
	})
}

// liveMaxConns is how many sockets one instance holds at most, far above the
// pilot's people; liveFullRetry is when a refused client may try again.
const (
	liveMaxConns  = 2000
	liveFullRetry = 30 * time.Second
)

// ServeHTTP upgrades the request to a WebSocket and follows the topics its
// client has tickets for. Mount it as GET /live.
func (l *Live) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	start := time.Now()

	// Serve's read and write timeouts would cut a socket that lives for minutes.
	rc := http.NewResponseController(w)
	if err := errors.Join(rc.SetReadDeadline(time.Time{}), rc.SetWriteDeadline(time.Time{})); err != nil {
		l.logger.WarnContext(r.Context(), "live deadlines not cleared",
			slog.String("event", "platform.live.deadlines_kept"),
			slog.String("error_type", fmt.Sprintf("%T", err)),
		)
	}

	// A cap on the sockets one instance holds, so a script opening them cannot
	// take its memory (SEC-160); the client reconnects later, with backoff. The
	// place is taken before the upgrade, so upgrades arriving together cannot
	// all pass a count that only registered sockets would make.
	if !l.take() {
		WriteFailure(w, r, ErrTooManyRequests.WithRetryAfter(liveFullRetry))

		return
	}
	defer l.release()

	ws, err := websocket.Accept(w, r, &websocket.AcceptOptions{
		// Authority comes from the live ticket alone, never from a cookie or
		// the origin, so another site gains nothing by opening this socket; and
		// Next.js's development proxy rewrites Host, which the library's
		// same-host check would refuse.
		InsecureSkipVerify: true,
	})
	if err != nil {
		return
	}

	ws.SetReadLimit(liveReadLimit)

	ctx, cancel := context.WithCancel(context.WithoutCancel(r.Context()))
	c := &liveConn{ws: ws, send: make(chan []byte, liveQueueSize), cancel: cancel, topics: map[string]struct{}{}}

	if !l.register(c) {
		c.close(websocket.StatusGoingAway, "the server is stopping")

		return
	}

	lifetime := time.AfterFunc(l.timing.Lifetime, func() { c.close(closeLifetime, "renew your tickets") })
	idle := time.AfterFunc(l.timing.Idle, func() {
		if l.followed(c) == 0 {
			c.close(websocket.StatusPolicyViolation, "subscribe with a ticket")
		}
	})

	var wg sync.WaitGroup

	wg.Go(func() { l.write(ctx, c) })
	wg.Go(func() { l.heartbeat(ctx, c) })

	readErr := l.read(ctx, c)

	lifetime.Stop()
	idle.Stop()
	c.close(websocket.StatusNormalClosure, "")
	wg.Wait()

	topics := l.unregister(c)

	code := websocket.StatusCode(c.code.Load())
	if code == websocket.StatusNormalClosure {
		code = websocket.CloseStatus(readErr)
	}

	l.logger.InfoContext(ctx, "live connection closed",
		slog.String("event", "platform.live.closed"),
		slog.Int("close_code", int(code)),
		slog.Int("topics", topics),
		slog.Int64("duration_ms", time.Since(start).Milliseconds()),
	)
}

// take reserves a socket's place, false when the instance holds its cap.
func (l *Live) take() bool {
	l.mu.Lock()
	defer l.mu.Unlock()

	if l.held >= l.maxConns {
		return false
	}

	l.held++

	return true
}

// release gives back the place take reserved.
func (l *Live) release() {
	l.mu.Lock()
	defer l.mu.Unlock()

	l.held--
}

func (l *Live) register(c *liveConn) bool {
	l.mu.Lock()
	defer l.mu.Unlock()

	if l.closing {
		return false
	}

	l.conns[c] = struct{}{}

	return true
}

// unregister forgets c and returns how many topics it followed.
func (l *Live) unregister(c *liveConn) int {
	l.mu.Lock()
	defer l.mu.Unlock()

	delete(l.conns, c)

	for topic := range c.topics {
		delete(l.byTopic[topic], c)

		if len(l.byTopic[topic]) == 0 {
			delete(l.byTopic, topic)
		}
	}

	return len(c.topics)
}

// read takes the client's frames until the connection ends. It always runs,
// since the library answers pings only while someone reads.
func (l *Live) read(ctx context.Context, c *liveConn) error {
	for attempts := 1; ; attempts++ {
		typ, data, err := c.ws.Read(ctx)
		if err != nil {
			return err
		}

		var frame struct {
			Type   string `json:"type"`
			Ticket string `json:"ticket"`
		}

		if typ != websocket.MessageText || json.Unmarshal(data, &frame) != nil || frame.Type != "subscribe" {
			c.close(websocket.StatusPolicyViolation, "send subscribe frames in JSON text")

			return errBadFrame
		}

		if attempts > liveAttemptsPerConn {
			c.close(websocket.StatusPolicyViolation, "too many subscribe frames")

			return errBadFrame
		}

		l.subscribe(ctx, c, frame.Ticket)
	}
}

// subscribe follows the topic of a ticket, or answers refused.
func (l *Live) subscribe(ctx context.Context, c *liveConn, ticket string) {
	if l.followed(c) >= liveTopicsPerConn {
		c.enqueue([]byte(liveRefused))

		return
	}

	topic, ok, err := l.redeem(ctx, ticket)
	if err != nil {
		l.logger.WarnContext(ctx, "live ticket not redeemed",
			slog.String("event", "platform.live.redeem_failed"),
			slog.String("error_type", fmt.Sprintf("%T", err)),
		)
	}

	if err != nil || !ok {
		c.enqueue([]byte(liveRefused))

		return
	}

	l.mu.Lock()
	if _, already := c.topics[topic]; !already && !l.closing {
		c.topics[topic] = struct{}{}

		if l.byTopic[topic] == nil {
			l.byTopic[topic] = map[*liveConn]struct{}{}
		}

		l.byTopic[topic][c] = struct{}{}
	}
	l.mu.Unlock()

	c.enqueue(fmt.Appendf(nil, liveSubscribedFormat, topic))
}

func (l *Live) followed(c *liveConn) int {
	l.mu.Lock()
	defer l.mu.Unlock()

	return len(c.topics)
}

// write sends the queued frames, each within the write timeout.
func (l *Live) write(ctx context.Context, c *liveConn) {
	for {
		select {
		case <-ctx.Done():
			return
		case frame := <-c.send:
			writeCtx, cancel := context.WithTimeout(ctx, l.timing.Write)
			err := c.ws.Write(writeCtx, websocket.MessageText, frame)

			cancel()

			if err != nil {
				c.close(websocket.StatusInternalError, "write failed")

				return
			}
		}
	}
}

// heartbeat pings the client and closes the connection when its pong does not
// come in time, so a proxy never idles it and a dead phone is dropped.
func (l *Live) heartbeat(ctx context.Context, c *liveConn) {
	ticker := time.NewTicker(l.timing.Ping)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			pingCtx, cancel := context.WithTimeout(ctx, l.timing.Pong)
			err := c.ws.Ping(pingCtx)

			cancel()

			if err != nil {
				c.close(websocket.StatusGoingAway, "no pong")

				return
			}
		}
	}
}
