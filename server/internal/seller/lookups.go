package seller

import (
	"context"
	"errors"
	"net/url"
	"sync"
	"time"
)

// The bounds on the address lookups, which pass to free public services
// (SEC-160): an account makes lookupsPerAccount in ten minutes, answers are
// kept for a while so the same point or words do not ask again, and Nominatim
// is asked at most once a second, as its policy says.
const (
	lookupsPerAccount = 60
	lookupWindow      = 10 * time.Minute
	addressKept       = 24 * time.Hour
	placesKept        = time.Hour
	lookupsKept       = 512
	nominatimEvery    = time.Second
)

// lookupCache keeps up to lookupsKept answers for ttl each; full, it first
// forgets the expired ones and, failing that, starts again.
type lookupCache[V any] struct {
	ttl time.Duration
	now func() time.Time

	mu    sync.Mutex
	items map[string]cachedLookup[V]
}

type cachedLookup[V any] struct {
	value V
	until time.Time
}

func newLookupCache[V any](ttl time.Duration) *lookupCache[V] {
	return &lookupCache[V]{ttl: ttl, now: time.Now, items: map[string]cachedLookup[V]{}}
}

func (c *lookupCache[V]) get(key string) (V, bool) {
	c.mu.Lock()
	defer c.mu.Unlock()

	item, ok := c.items[key]
	if !ok || !c.now().Before(item.until) {
		var none V

		return none, false
	}

	return item.value, true
}

func (c *lookupCache[V]) put(key string, value V) {
	c.mu.Lock()
	defer c.mu.Unlock()

	now := c.now()

	if len(c.items) >= lookupsKept {
		for k, item := range c.items {
			if !now.Before(item.until) {
				delete(c.items, k)
			}
		}

		if len(c.items) >= lookupsKept {
			clear(c.items)
		}
	}

	c.items[key] = cachedLookup[V]{value: value, until: now.Add(c.ttl)}
}

// pacer spaces calls every apart, across every caller of the instance.
type pacer struct {
	every time.Duration

	mu   sync.Mutex
	next time.Time
}

// wait holds the caller until its turn, or until ctx ends.
func (p *pacer) wait(ctx context.Context) error {
	if p == nil {
		return nil
	}

	p.mu.Lock()

	now := time.Now()

	turn := now
	if p.next.After(now) {
		turn = p.next
	}

	p.next = turn.Add(p.every)
	p.mu.Unlock()

	if !turn.After(now) {
		return nil
	}

	timer := time.NewTimer(turn.Sub(now))
	defer timer.Stop()

	select {
	case <-ctx.Done():
		return ctx.Err()
	case <-timer.C:
		return nil
	}
}

// lookupFailure says why a lookup failed without the URL a transport error
// carries, which holds the address typed or the point (SEC-160).
func lookupFailure(err error) string {
	if transport, ok := errors.AsType[*url.Error](err); ok {
		return transport.Op + ": " + transport.Err.Error()
	}

	return err.Error()
}
