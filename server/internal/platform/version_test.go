package platform

import (
	"testing"
	"time"
)

func TestETag(t *testing.T) {
	t.Parallel()

	at := time.Date(2026, 10, 21, 20, 15, 0, 123456789, time.UTC)

	version, ok := VersionOf(ETag(at))
	if !ok || !SameVersion(at, version) {
		t.Fatalf("VersionOf(ETag(%v)) = %v, %v; want the same microsecond", at, version, ok)
	}

	if SameVersion(at.Add(time.Microsecond), version) {
		t.Error("a microsecond later is the same version")
	}
}

func TestVersionOf(t *testing.T) {
	t.Parallel()

	for _, tt := range []struct {
		name, ifMatch string
		ok            bool
	}{
		{"a tag ETag made", `"1792613700123456"`, true},
		{"with spaces around", ` "1792613700123456" `, true},
		{"any version", "*", false},
		{"a weak tag", `W/"1792613700123456"`, false},
		{"unquoted", "1792613700123456", false},
		{"two tags", `"1", "2"`, false},
		{"not a number", `"abc"`, false},
		{"zero", `"0"`, false},
		{"empty", "", false},
	} {
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()

			if _, ok := VersionOf(tt.ifMatch); ok != tt.ok {
				t.Errorf("VersionOf(%q) ok = %v, want %v", tt.ifMatch, ok, tt.ok)
			}
		})
	}
}
