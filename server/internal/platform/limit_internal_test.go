package platform

import (
	"errors"
	"testing"
	"time"
)

// A key makes its n calls in a window, is refused after with the time left,
// and may call again once the window ended; another key counts apart, and keys
// whose window ended are forgotten (SEC-160).
func TestLimiter(t *testing.T) {
	t.Parallel()

	now := time.Date(2026, 10, 27, 20, 0, 0, 0, time.UTC)
	l := NewLimiter(3, time.Minute)
	l.now = func() time.Time { return now }

	for i := range 3 {
		if err := l.Take("113.161.10.20"); err != nil {
			t.Fatalf("call %d: %v", i+1, err)
		}
	}

	now = now.Add(20 * time.Second)

	err := l.Take("113.161.10.20")

	var refused *FailureError
	if !errors.As(err, &refused) || refused.Code != ErrTooManyRequests.Code || refused.RetryAfter != 40*time.Second {
		t.Fatalf("the fourth call: %v, want ErrTooManyRequests retrying after 40s", err)
	}

	if err := l.Take("113.161.10.21"); err != nil {
		t.Errorf("another address: %v", err)
	}

	now = now.Add(40 * time.Second)

	if err := l.Take("113.161.10.20"); err != nil {
		t.Errorf("once the window ended: %v", err)
	}

	now = now.Add(2 * time.Minute)
	_ = l.Take("113.161.10.22")

	if _, kept := l.seen["113.161.10.21"]; kept || len(l.seen) != 1 {
		t.Errorf("after the sweep %d keys are kept, want only the latest", len(l.seen))
	}
}

func TestClientAddressOf(t *testing.T) {
	t.Parallel()

	for _, tc := range []struct{ forwarded, remote, want string }{
		{"113.161.10.20, 172.18.0.5", "172.18.0.6:41234", "113.161.10.20"},
		{"", "172.18.0.6:41234", "172.18.0.6"},
		{" ", "[::1]:8080", "::1"},
	} {
		if got := ClientAddressOf(tc.forwarded, tc.remote); got != tc.want {
			t.Errorf("ClientAddressOf(%q, %q) = %q, want %q", tc.forwarded, tc.remote, got, tc.want)
		}
	}
}
