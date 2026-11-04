package identity

import (
	"testing"
	"time"
)

func TestGuessLimit(t *testing.T) {
	t.Parallel()

	now := time.Date(2026, 11, 4, 9, 0, 0, 0, time.UTC)
	l := newGuessLimit(3, 15*time.Minute)
	l.now = func() time.Time { return now }

	// Three tries are allowed, the fourth waits for the window to end, and a
	// refused try counts nothing.
	var start time.Time

	for i := range 3 {
		s, wait := l.take("lan")
		if wait != 0 {
			t.Fatalf("try %d refused, waiting %v", i+1, wait)
		}

		start = s
	}

	if _, wait := l.take("lan"); wait != 15*time.Minute {
		t.Errorf("fourth try: wait %v, want the 15 minutes left of the window", wait)
	}

	now = now.Add(5 * time.Minute)

	if _, wait := l.take("lan"); wait != 10*time.Minute {
		t.Errorf("fourth try 5 minutes on: wait %v, want 10 minutes", wait)
	}

	// Another key has its own count.
	if _, wait := l.take("minh"); wait != 0 {
		t.Errorf("another key refused: %v", wait)
	}

	// A try that proves right is given back; wrong ones keep their count.
	l.refund("lan", start)

	if _, wait := l.take("lan"); wait != 0 {
		t.Errorf("a refunded try was not given back: wait %v", wait)
	}

	if _, wait := l.take("lan"); wait == 0 {
		t.Error("the refund gave back more than one try")
	}

	// After the window a key starts again, and a refund of the old window is
	// ignored.
	now = now.Add(11 * time.Minute)

	_, wait := l.take("lan")
	if wait != 0 {
		t.Fatalf("the window ended but the key is refused: %v", wait)
	}

	l.refund("lan", start)

	for range 2 {
		if _, wait := l.take("lan"); wait != 0 {
			t.Fatalf("a refund of the old window changed the new one: %v", wait)
		}
	}

	if _, wait := l.take("lan"); wait == 0 {
		t.Error("a refund of the old window gave a try back in the new one")
	}

}

func TestGuessLimitSweepsEndedWindows(t *testing.T) {
	t.Parallel()

	now := time.Date(2026, 11, 4, 9, 0, 0, 0, time.UTC)
	l := newGuessLimit(3, time.Minute)
	l.now = func() time.Time { return now }

	l.take("a")
	l.take("b")

	now = now.Add(2 * time.Minute)
	l.take("c")

	if len(l.seen) != 1 {
		t.Errorf("%d keys kept, want only the one in the current window", len(l.seen))
	}
}
