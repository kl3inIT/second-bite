package identity

import (
	"sync"
	"time"
)

// guessLimit lets each key try at most n times in a window, counted in this
// instance's memory like platform.Limiter (SEC-160): a try is counted before it
// is judged, so tries arriving together cannot all slip past the count, and a
// try that proves right is given back, so that signing in does not use up the
// allowance and only wrong ones keep their count for the rest of the window.
// A window starts with a key's first try. The keys of windows that ended are
// swept as tries come.
type guessLimit struct {
	n      int
	window time.Duration
	now    func() time.Time

	mu    sync.Mutex
	seen  map[string]*guessWindow
	swept time.Time
}

type guessWindow struct {
	start time.Time
	tries int
}

func newGuessLimit(n int, window time.Duration) *guessLimit {
	return &guessLimit{n: n, window: window, now: time.Now, seen: map[string]*guessWindow{}}
}

// take counts a try of key. It answers the start of the window the try is in,
// to give the try back with; or, when the key has used its n tries, how long
// until its window ends, and counts nothing.
func (l *guessLimit) take(key string) (start time.Time, wait time.Duration) {
	l.mu.Lock()
	defer l.mu.Unlock()

	now := l.now()
	l.sweep(now)

	w, ok := l.seen[key]
	if !ok || now.Sub(w.start) >= l.window {
		w = &guessWindow{start: now}
		l.seen[key] = w
	}

	if w.tries >= l.n {
		return time.Time{}, w.start.Add(l.window).Sub(now)
	}

	w.tries++

	return w.start, 0
}

// refund gives back the try counted in the window that began at start, when it
// proved right. A window that has ended since keeps nothing to give back.
func (l *guessLimit) refund(key string, start time.Time) {
	l.mu.Lock()
	defer l.mu.Unlock()

	if w, ok := l.seen[key]; ok && w.start.Equal(start) && w.tries > 0 {
		w.tries--
	}
}

// sweep forgets the keys whose window ended, at most once a window.
func (l *guessLimit) sweep(now time.Time) {
	if now.Sub(l.swept) < l.window {
		return
	}

	for key, w := range l.seen {
		if now.Sub(w.start) >= l.window {
			delete(l.seen, key)
		}
	}

	l.swept = now
}
