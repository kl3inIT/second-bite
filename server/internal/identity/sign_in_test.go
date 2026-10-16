package identity

import (
	"errors"
	"testing"
	"time"

	"github.com/kl3inIT/second-bite/server/internal/identity/internal/db"
)

func TestLimitWait(t *testing.T) {
	t.Parallel()

	now := time.Date(2026, 10, 17, 12, 0, 0, 0, time.UTC)
	long := now.Add(-48 * time.Hour)

	tests := []struct {
		name  string
		usage db.ChallengeUsageRow
		want  time.Duration
	}{
		{name: "first code", usage: db.ChallengeUsageRow{NewestSentAt: long}},
		{name: "a minute after the last", usage: db.ChallengeUsageRow{NewestSentAt: now.Add(-time.Minute)}},
		{name: "cooldown", usage: db.ChallengeUsageRow{NewestSentAt: now.Add(-20 * time.Second)}, want: 40 * time.Second},
		{
			name:  "ten codes in the hour",
			usage: db.ChallengeUsageRow{NewestSentAt: now.Add(-5 * time.Minute), SentLastHour: 10, OldestSentLastHour: now.Add(-50 * time.Minute)},
			want:  10 * time.Minute,
		},
		{
			name:  "fifteen wrong guesses in the hour",
			usage: db.ChallengeUsageRow{NewestSentAt: long, WrongLastHour: 15, OldestWrongLastHour: now.Add(-30 * time.Minute)},
			want:  30 * time.Minute,
		},
		{
			name:  "thirty wrong guesses in the day",
			usage: db.ChallengeUsageRow{NewestSentAt: long, WrongLastDay: 30, OldestWrongLastDay: now.Add(-20 * time.Hour)},
			want:  4 * time.Hour,
		},
		{
			name: "the longest wait wins",
			usage: db.ChallengeUsageRow{
				NewestSentAt: now.Add(-10 * time.Second), WrongLastDay: 30, OldestWrongLastDay: now.Add(-23 * time.Hour),
			},
			want: time.Hour,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()

			tt.usage.CheckedAt = now
			if got := limitWait(tt.usage); got != tt.want {
				t.Errorf("wait %v, want %v", got, tt.want)
			}
		})
	}
}

func TestNormalizeEmail(t *testing.T) {
	t.Parallel()

	valid := map[string]string{
		"a@example.com":           "a@example.com",
		"  Mixed.Case@Example.VN": "mixed.case@example.vn",
	}
	for in, want := range valid {
		if got, err := normalizeEmail(in); err != nil || got != want {
			t.Errorf("%q: %q, %v; want %q", in, got, err, want)
		}
	}

	for _, in := range []string{"", "not-an-address", "Name <a@example.com>", "a@example.com, b@example.com", "a@"} {
		if _, err := normalizeEmail(in); !errors.Is(err, ErrEmailInvalid) {
			t.Errorf("%q: err %v, want ErrEmailInvalid", in, err)
		}
	}
}

func TestCodeHashDependsOnChallengeAndKey(t *testing.T) {
	t.Parallel()

	a := &Service{codeKey: make([]byte, 32)}
	b := &Service{codeKey: append(make([]byte, 31), 1)}

	id1 := [16]byte{1}
	id2 := [16]byte{2}

	if string(a.codeHash(id1, "123456")) == string(a.codeHash(id2, "123456")) {
		t.Error("the same code hashes alike for two challenges")
	}

	if string(a.codeHash(id1, "123456")) == string(b.codeHash(id1, "123456")) {
		t.Error("the hash does not depend on the key")
	}
}
