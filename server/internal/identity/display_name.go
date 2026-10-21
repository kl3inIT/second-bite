package identity

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"unicode"
	"unicode/utf8"

	"github.com/jackc/pgx/v5"

	"github.com/kl3inIT/second-bite/server/internal/identity/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// maxDisplayNameLength is the most characters a display name holds: enough
// for a full Vietnamese name, short enough for a header capsule.
const maxDisplayNameLength = 50

// SetDisplayName gives the signed-in account the name it chose (SEC-61):
// trimmed, 1 to 50 characters, none of them a control character. Google's
// sign-in fills a name only while it is empty, so the chosen one stays.
func (s *Service) SetDisplayName(ctx context.Context, name string) (Account, error) {
	caller, err := platform.RequireCaller(ctx)
	if err != nil {
		return Account{}, err
	}

	name, ok := normalizeDisplayName(name)
	if !ok {
		return Account{}, ErrDisplayNameInvalid
	}

	row, err := s.queries.SetDisplayName(ctx, db.SetDisplayNameParams{ID: caller.AccountID, DisplayName: name})
	if errors.Is(err, pgx.ErrNoRows) {
		return Account{}, ErrAccountNotFound
	}

	if err != nil {
		return Account{}, fmt.Errorf("setting the display name: %w", err)
	}

	return Account{ID: row.ID, Email: row.Email, Role: platform.Role(row.Role), DisplayName: row.DisplayName}, nil
}

// normalizeDisplayName trims raw and reports whether it is a name a person
// may choose.
func normalizeDisplayName(raw string) (string, bool) {
	name := strings.TrimSpace(raw)
	if name == "" || !utf8.ValidString(name) || utf8.RuneCountInString(name) > maxDisplayNameLength {
		return "", false
	}

	if strings.ContainsFunc(name, unicode.IsControl) {
		return "", false
	}

	return name, true
}
