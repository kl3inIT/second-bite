package identity

import (
	"context"
	"errors"
	"fmt"
	"slices"
	"strings"
	"time"
	"unicode/utf8"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"

	"github.com/kl3inIT/second-bite/server/internal/identity/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

const (
	// maxPageSize bounds one page of the admins' list.
	maxPageSize = 100
	// maxQueryRunes bounds what an admin searches for.
	maxQueryRunes = 100
)

// Record is an account as admins see it: when it was made and when and how
// it last signed in.
type Record struct {
	Account
	CreatedAt time.Time
	// LastSignedInAt is nil until its first sign-in since SEC-75 recorded
	// them, or when every session it had ended before.
	LastSignedInAt *time.Time
	// LastSignInMethod is "code" or "google", empty with LastSignedInAt.
	LastSignInMethod string
}

// AccountFilter is what an admin lists accounts by.
type AccountFilter struct {
	// Role keeps the accounts of this role; all when empty.
	Role platform.Role
	// Query keeps the accounts whose address or name holds it, marks ignored.
	Query string
	// Sort orders the page: one of accountSorts, empty for the newest first.
	Sort string
	// Page counts from 1; Size runs from 1 to 100.
	Page, Size int
}

// The orders an admin may sort accounts by; a leading '-' is descending.
var accountSorts = []string{"", "name", "-name", "created", "-created", "signedIn", "-signedIn"}

// AccountPage is one page of the admins' list, how many accounts match in
// all, and how many of each role match the words.
type AccountPage struct {
	Accounts []Record
	Total    int
	Counts   map[platform.Role]int
}

// ListAccounts answers one page of the accounts matching f, to an admin,
// the newest first unless f sorts otherwise.
func (s *Service) ListAccounts(ctx context.Context, f AccountFilter) (AccountPage, error) {
	if _, err := platform.RequireAdmin(ctx); err != nil {
		return AccountPage{}, err
	}

	params, err := f.params()
	if err != nil {
		return AccountPage{}, err
	}

	rows, err := s.queries.AccountsForAdmins(ctx, params)
	if err != nil {
		return AccountPage{}, fmt.Errorf("listing the accounts: %w", err)
	}

	page := AccountPage{Accounts: make([]Record, 0, len(rows))}

	if len(rows) > 0 {
		page.Total = int(rows[0].Total)
	} else if params.SkipRows > 0 {
		// Past the end the window counts nothing; the total is still asked.
		total, err := s.queries.CountAccountsForAdmins(ctx, db.CountAccountsForAdminsParams{Role: params.Role, Query: params.Query})
		if err != nil {
			return AccountPage{}, fmt.Errorf("counting the accounts: %w", err)
		}

		page.Total = int(total)
	}

	counts, err := s.queries.CountAccountsByRole(ctx, params.Query)
	if err != nil {
		return AccountPage{}, fmt.Errorf("counting the accounts by role: %w", err)
	}

	page.Counts = map[platform.Role]int{platform.RoleCustomer: 0, platform.RoleAdmin: 0}
	for _, c := range counts {
		page.Counts[platform.Role(c.Role)] = int(c.Accounts)
	}

	for _, r := range rows {
		page.Accounts = append(page.Accounts, recordOf(db.GetAccountForAdminsRow{
			ID: r.ID, Email: r.Email, Role: r.Role, DisplayName: r.DisplayName, CreatedAt: r.CreatedAt,
			LastSignedInAt: r.LastSignedInAt, LastSignInMethod: r.LastSignInMethod,
		}))
	}

	return page, nil
}

// AccountForAdmins answers the account id, to an admin.
func (s *Service) AccountForAdmins(ctx context.Context, id uuid.UUID) (Record, error) {
	if _, err := platform.RequireAdmin(ctx); err != nil {
		return Record{}, err
	}

	row, err := s.queries.GetAccountForAdmins(ctx, id)
	if errors.Is(err, pgx.ErrNoRows) {
		return Record{}, ErrAccountNotFound
	}

	if err != nil {
		return Record{}, fmt.Errorf("reading the account: %w", err)
	}

	return recordOf(row), nil
}

func (f AccountFilter) params() (db.AccountsForAdminsParams, error) {
	if f.Page < 1 || f.Size < 1 || f.Size > maxPageSize || !slices.Contains(accountSorts, f.Sort) ||
		(f.Role != "" && f.Role != platform.RoleCustomer && f.Role != platform.RoleAdmin) {
		return db.AccountsForAdminsParams{}, ErrAccountListInvalid
	}

	query := strings.TrimSpace(f.Query)
	if utf8.RuneCountInString(query) > maxQueryRunes {
		return db.AccountsForAdminsParams{}, ErrAccountListInvalid
	}

	return db.AccountsForAdminsParams{
		Role:     string(f.Role),
		Query:    escapeLike(query),
		Sort:     f.Sort,
		MaxRows:  int32(f.Size),
		SkipRows: int32((f.Page - 1) * f.Size), //nolint:gosec // a page past int32 finds nothing anyway
	}, nil
}

// escapeLike makes the characters LIKE reads as patterns plain.
func escapeLike(s string) string {
	return strings.NewReplacer(`\`, `\`, `%`, `\%`, `_`, `\_`).Replace(s)
}

func recordOf(r db.GetAccountForAdminsRow) Record {
	return Record{
		Account:          Account{ID: r.ID, Email: r.Email, Role: platform.Role(r.Role), DisplayName: r.DisplayName},
		CreatedAt:        r.CreatedAt,
		LastSignedInAt:   r.LastSignedInAt,
		LastSignInMethod: textOf(r.LastSignInMethod),
	}
}

func textOf(t pgtype.Text) string {
	if !t.Valid {
		return ""
	}

	return t.String
}
