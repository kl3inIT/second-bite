package identity

import (
	"context"
	"errors"
	"testing"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/kl3inIT/second-bite/server/internal/audit"
	"github.com/kl3inIT/second-bite/server/internal/identity/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/platform/platformtest"
)

// people are the accounts of TestAccountsForAdmins: an admin who never signed
// in, An by Google, Bình by code, and an address without a name that never
// signed in.
type people struct {
	admin, an, binh Account
	unnamed         string
}

// TestAccountsForAdmins checks the admins' list of accounts and the sign-in
// it shows (SEC-75) on a database of its own, since the list counts every
// account in it.
func TestAccountsForAdmins(t *testing.T) {
	t.Parallel()

	pool := platformtest.StartPostgres(t)

	s, err := NewService(pool, nil, nil, audit.NewService(pool, platformtest.Logger()),
		Config{CodeKey: make([]byte, 32)}, platformtest.Logger())
	if err != nil {
		t.Fatal(err)
	}

	p := seedPeople(t, s, pool)
	asAdmin := adminCtx(t.Context(), p.admin)

	for name, check := range map[string]func(context.Context, *testing.T, *Service, people){
		"an account shows its last sign-in":                       checkLastSignIn,
		"the list finds words without marks and counts the roles": checkSearch,
		"the list reads LIKE's characters as letters":             checkPlainLetters,
		"the list sorts, those never signed in last":              checkSorts,
		"the list pages and refuses bad filters and customers":    checkPagingAndRefusals,
	} {
		t.Run(name, func(t *testing.T) {
			t.Parallel()
			check(asAdmin, t, s, p)
		})
	}
}

func seedPeople(t *testing.T, s *Service, pool *pgxpool.Pool) people {
	t.Helper()

	ctx := t.Context()

	admin, err := s.GrantAdminAsSystem(ctx, "quan.tri@example.com")
	if err != nil {
		t.Fatal(err)
	}

	p := people{
		admin:   admin,
		an:      insertAccount(t, s, "an@example.com", "Nguyễn Văn An"),
		binh:    insertAccount(t, s, "binh@example.com", "Trần Thị Bình"),
		unnamed: insertAccount(t, s, "dong.lan@example.com", "").Email,
	}

	// An signs in first, by Google; Bình after, by code.
	for _, signIn := range []struct {
		a      Account
		method string
	}{{p.an, methodGoogle}, {p.binh, methodCode}} {
		if err := pgx.BeginFunc(ctx, pool, func(tx pgx.Tx) error {
			_, err := s.openSession(ctx, s.queries.WithTx(tx), signIn.a, signIn.method)

			return err
		}); err != nil {
			t.Fatal(err)
		}
	}

	return p
}

func checkLastSignIn(asAdmin context.Context, t *testing.T, s *Service, p people) {
	t.Helper()

	got, err := s.AccountForAdmins(asAdmin, p.an.ID)
	if err != nil || got.LastSignedInAt == nil || got.LastSignInMethod != methodGoogle || got.CreatedAt.IsZero() {
		t.Errorf("An: %+v, %v; want a Google sign-in", got, err)
	}

	never, err := s.AccountForAdmins(asAdmin, p.admin.ID)
	if err != nil || never.LastSignedInAt != nil || never.LastSignInMethod != "" {
		t.Errorf("an admin never signed in: %+v, %v", never, err)
	}

	if _, err := s.AccountForAdmins(asAdmin, uuid.New()); !errors.Is(err, ErrAccountNotFound) {
		t.Errorf("an unknown account: %v, want ErrAccountNotFound", err)
	}
}

func checkSearch(asAdmin context.Context, t *testing.T, s *Service, p people) {
	t.Helper()

	for query, want := range map[string]string{"van an": p.an.Email, "BINH": p.binh.Email, "dong.lan": p.unnamed} {
		page, err := s.ListAccounts(asAdmin, AccountFilter{Query: query, Page: 1, Size: 25})
		if err != nil || len(page.Accounts) != 1 || page.Accounts[0].Email != want || page.Total != 1 {
			t.Errorf("q=%q: %+v, %v; want %s alone", query, page, err, want)
		}
	}

	page, err := s.ListAccounts(asAdmin, AccountFilter{Role: platform.RoleAdmin, Page: 1, Size: 25})
	if err != nil || page.Total != 1 || page.Accounts[0].ID != p.admin.ID ||
		page.Counts[platform.RoleAdmin] != 1 || page.Counts[platform.RoleCustomer] != 3 {
		t.Errorf("the admins: %+v, %v", page, err)
	}
}

// checkPlainLetters: LIKE's own characters are plain letters, and no address
// or name holds them.
func checkPlainLetters(asAdmin context.Context, t *testing.T, s *Service, _ people) {
	t.Helper()

	for _, query := range []string{"_", "%"} {
		page, err := s.ListAccounts(asAdmin, AccountFilter{Query: query, Page: 1, Size: 25})
		if err != nil || page.Total != 0 {
			t.Errorf("q=%q: %d found, %v; want none", query, page.Total, err)
		}
	}
}

func checkSorts(asAdmin context.Context, t *testing.T, s *Service, p people) {
	t.Helper()

	for sort, want := range map[string][]string{
		"":          {p.unnamed, p.binh.Email, p.an.Email, p.admin.Email},
		"signedIn":  {p.an.Email, p.binh.Email},
		"-signedIn": {p.binh.Email, p.an.Email},
		"name":      {p.unnamed, p.an.Email, p.admin.Email, p.binh.Email},
	} {
		page, err := s.ListAccounts(asAdmin, AccountFilter{Sort: sort, Page: 1, Size: 25})
		if err != nil || len(page.Accounts) != 4 {
			t.Fatalf("sort=%q: %+v, %v", sort, page, err)
		}

		for i, email := range want {
			if page.Accounts[i].Email != email {
				t.Errorf("sort=%q: #%d is %s, want %s", sort, i, page.Accounts[i].Email, email)
			}
		}
	}
}

func checkPagingAndRefusals(asAdmin context.Context, t *testing.T, s *Service, p people) {
	t.Helper()

	second, err := s.ListAccounts(asAdmin, AccountFilter{Page: 2, Size: 3})
	if err != nil || len(second.Accounts) != 1 || second.Total != 4 {
		t.Errorf("page 2 of 3: %+v, %v", second, err)
	}

	past, err := s.ListAccounts(asAdmin, AccountFilter{Page: 9, Size: 3})
	if err != nil || len(past.Accounts) != 0 || past.Total != 4 {
		t.Errorf("past the end: %+v, %v; want none of 4", past, err)
	}

	for _, f := range []AccountFilter{
		{Page: 0, Size: 25},
		{Page: 1, Size: 101},
		{Page: 1, Size: 25, Sort: "email"},
		{Page: 1, Size: 25, Role: "owner"},
		{Page: 1, Size: 25, Query: string(make([]rune, 101))},
	} {
		if _, err := s.ListAccounts(asAdmin, f); !errors.Is(err, ErrAccountListInvalid) {
			t.Errorf("%+v: %v, want ErrAccountListInvalid", f, err)
		}
	}

	customer := platform.WithCaller(t.Context(), platform.Caller{AccountID: p.an.ID, Role: platform.RoleCustomer})
	if _, err := s.ListAccounts(customer, AccountFilter{Page: 1, Size: 25}); !errors.Is(err, platform.ErrAdminRequired) {
		t.Errorf("a customer listing: %v, want ErrAdminRequired", err)
	}
}

// insertAccount makes an account of email with a name, as a first sign-in
// and Google would.
func insertAccount(t *testing.T, s *Service, email, name string) Account {
	t.Helper()

	row, err := s.queries.InsertAccount(t.Context(), email)
	if err != nil {
		t.Fatal(err)
	}

	if name == "" {
		return accountOf(db.GetAccountRow(row))
	}

	named, err := s.queries.SetDisplayName(t.Context(), db.SetDisplayNameParams{ID: row.ID, DisplayName: name})
	if err != nil {
		t.Fatal(err)
	}

	return accountOf(db.GetAccountRow(named))
}

func TestEscapeLike(t *testing.T) {
	t.Parallel()

	if got, want := escapeLike(`50%_a\b`), `50\%\_a\\b`; got != want {
		t.Errorf("escapeLike: %q, want %q", got, want)
	}
}
