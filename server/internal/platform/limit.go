package platform

import (
	"context"
	"net"
	"strings"
	"sync"
	"time"
)

// ErrTooManyRequests refuses a caller who asked too often in a short time; it
// carries when to try again.
var ErrTooManyRequests = NewFailure("PLATFORM_TOO_MANY_REQUESTS", CategoryLimitExceeded, Words{
	VI: "Bạn thao tác nhanh quá. Đợi một lát rồi thử lại.",
	EN: "Too many requests in a short time. Wait a moment and try again.",
})

// Limiter lets each key make at most n calls in a window, counted in this
// instance's memory (SEC-160). A window starts with a key's first call; keys
// whose window ended are swept as calls come, so the map stays as small as the
// callers of one window. Several instances each count their own.
type Limiter struct {
	n      int
	window time.Duration
	now    func() time.Time

	mu    sync.Mutex
	seen  map[string]*windowCount
	swept time.Time
}

type windowCount struct {
	start time.Time
	calls int
}

// NewLimiter lets each key make n calls in every window.
func NewLimiter(n int, window time.Duration) *Limiter {
	return &Limiter{n: n, window: window, now: time.Now, seen: map[string]*windowCount{}}
}

// Take counts a call of key, and refuses it with ErrTooManyRequests, carrying
// when the key's window ends, once the key has made its n calls.
func (l *Limiter) Take(key string) error {
	l.mu.Lock()
	defer l.mu.Unlock()

	now := l.now()
	l.sweep(now)

	c, ok := l.seen[key]
	if !ok || now.Sub(c.start) >= l.window {
		l.seen[key] = &windowCount{start: now, calls: 1}

		return nil
	}

	if c.calls >= l.n {
		return ErrTooManyRequests.WithRetryAfter(c.start.Add(l.window).Sub(now))
	}

	c.calls++

	return nil
}

// sweep forgets the keys whose window ended, at most once a window.
func (l *Limiter) sweep(now time.Time) {
	if now.Sub(l.swept) < l.window {
		return
	}

	for key, c := range l.seen {
		if now.Sub(c.start) >= l.window {
			delete(l.seen, key)
		}
	}

	l.swept = now
}

// ClientAddressOf is the caller's address: the first of X-Forwarded-For, which
// the edge proxy sets as the site is reached only through it, else the
// connection's host.
func ClientAddressOf(forwarded, remote string) string {
	if first, _, _ := strings.Cut(forwarded, ","); strings.TrimSpace(first) != "" {
		return strings.TrimSpace(first)
	}

	if host, _, err := net.SplitHostPort(remote); err == nil {
		return host
	}

	return remote
}

// ClientAddress is the address of the request ctx serves, as withRequest read
// it; empty outside a request.
func ClientAddress(ctx context.Context) string {
	if info, ok := ctx.Value(requestKey{}).(*requestInfo); ok {
		return info.client
	}

	return ""
}

// TakeFor counts a call of the address of the request ctx serves; a call
// outside a request, from the command line or a test of the service, is not
// counted.
func (l *Limiter) TakeFor(ctx context.Context) error {
	address := ClientAddress(ctx)
	if address == "" {
		return nil
	}

	return l.Take(address)
}
