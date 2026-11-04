package identity

import (
	"testing"
	"time"
)

// TestGuessLimit checks that a key gets its tries, that the one after them
// waits for the window to end and counts nothing, that keys are kept apart, and
// that a try that proves right is given back while wrong ones keep their count.
func TestGuessLimit(t *testing.T) {
	t.Parallel()

	now := time.Date(2026, 11, 4, 9, 0, 0, 0, time.UTC)
	l := newGuessLimit(3, 15*time.Minute)
	l.now = func() time.Time { return now }

	var start time.Time

	for i := range 3 {
		s, wait := l.take(lanUser)
		if wait != 0 {
			t.Fatalf("try %d refused, waiting %v", i+1, wait)
		}

		start = s
	}

	if _, wait := l.take(lanUser); wait != 15*time.Minute {
		t.Errorf("fourth try: wait %v, want the 15 minutes left of the window", wait)
	}

	now = now.Add(5 * time.Minute)

	if _, wait := l.take(lanUser); wait != 10*time.Minute {
		t.Errorf("fourth try 5 minutes on: wait %v, want 10 minutes", wait)
	}

	if _, wait := l.take("minh"); wait != 0 {
		t.Errorf("another key refused: %v", wait)
	}

	l.refund(lanUser, start)

	if _, wait := l.take(lanUser); wait != 0 {
		t.Errorf("a refunded try was not given back: wait %v", wait)
	}

	if _, wait := l.take(lanUser); wait == 0 {
		t.Error("the refund gave back more than one try")
	}
}

// TestGuessLimitStartsAgainAfterTheWindow checks that a key starts afresh once
// its window ended, and that a refund of the old window changes nothing in the
// new one.
func TestGuessLimitStartsAgainAfterTheWindow(t *testing.T) {
	t.Parallel()

	now := time.Date(2026, 11, 4, 9, 0, 0, 0, time.UTC)
	l := newGuessLimit(3, 15*time.Minute)
	l.now = func() time.Time { return now }

	var old time.Time

	for range 3 {
		old, _ = l.take(lanUser)
	}

	now = now.Add(16 * time.Minute)

	if _, wait := l.take(lanUser); wait != 0 {
		t.Fatalf("the window ended but the key is refused: %v", wait)
	}

	l.refund(lanUser, old)

	for range 2 {
		if _, wait := l.take(lanUser); wait != 0 {
			t.Fatalf("a refund of the old window changed the new one: %v", wait)
		}
	}

	if _, wait := l.take(lanUser); wait == 0 {
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
