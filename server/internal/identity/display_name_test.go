package identity

import (
	"errors"
	"strings"
	"testing"

	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/identity/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/platform/platformtest"
)

const lanName = "Trần Thị Lan"

func TestNormalizeDisplayName(t *testing.T) {
	t.Parallel()

	cases := []struct {
		raw, want string
		ok        bool
	}{
		{"  " + lanName + "  ", lanName, true},
		{"Lan", "Lan", true},
		{strings.Repeat("ă", 50), strings.Repeat("ă", 50), true},
		{strings.Repeat("ă", 51), "", false},
		{"", "", false},
		{"   ", "", false},
		{"Lan\u0000", "", false},
		{"Lan\nAnh", "", false},
		{"Lan\xff", "", false},
	}

	for _, c := range cases {
		got, ok := normalizeDisplayName(c.raw)
		if got != c.want || ok != c.ok {
			t.Errorf("normalizeDisplayName(%q) = %q, %v; want %q, %v", c.raw, got, ok, c.want, c.ok)
		}
	}
}

// TestSetDisplayName checks the rules below the HTTP flow of cmd/secondbite
// (SEC-61): the name is kept trimmed, Google's sign-in no longer replaces it,
// an invalid one changes nothing, and someone signed out is refused.
func TestSetDisplayName(t *testing.T) {
	t.Parallel()

	pool := platformtest.StartPostgres(t)
	s := newDeletionService(t, pool)
	lan := signedIn(t, s, "lan."+uuid.NewString()[:8]+"@example.com")
	ctx := callerCtx(t, lan)

	a, err := s.SetDisplayName(ctx, "  "+lanName+"  ")
	if err != nil || a.DisplayName != lanName {
		t.Fatalf("SetDisplayName: %+v, %v", a, err)
	}

	// A later Google sign-in fills a name only while it is empty.
	row, err := s.queries.FillDisplayName(t.Context(), db.FillDisplayNameParams{ID: lan.Account.ID, DisplayName: "Lan from Google"})
	if err != nil || row.DisplayName != lanName {
		t.Errorf("Google replaced the chosen name: %q, %v", row.DisplayName, err)
	}

	if _, err := s.SetDisplayName(ctx, strings.Repeat("x", 51)); !errors.Is(err, ErrDisplayNameInvalid) {
		t.Errorf("a name too long: %v, want ErrDisplayNameInvalid", err)
	}

	if got, err := s.Account(t.Context(), lan.Account.ID); err != nil || got.DisplayName != lanName {
		t.Errorf("an invalid name changed the account: %+v, %v", got, err)
	}

	if _, err := s.SetDisplayName(t.Context(), "Lan"); !errors.Is(err, platform.ErrAuthenticationRequired) {
		t.Errorf("signed out: %v, want ErrAuthenticationRequired", err)
	}
}
