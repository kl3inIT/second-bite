package identity

import (
	"errors"
	"testing"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"

	"github.com/kl3inIT/second-bite/server/internal/audit"
	"github.com/kl3inIT/second-bite/server/internal/identity/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/platform/platformtest"
)

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

	ctx := t.Context()

	admin, err := s.GrantAdminAsSystem(ctx, "quan.tri@example.com")
	if err != nil {
		t.Fatal(err)
	}

	an := insertAccount(t, s, "an@example.com", "Nguyễn Văn An")
	binh := insertAccount(t, s, "binh@example.com", "Trần Thị Bình")
	insertAccount(t, s, "dong.lan@example.com", "")

	// An signs in by Google, Bình by code; the others never have.
	for _, signIn := range []struct {
		a      Account
		method string
	}{{an, methodGoogle}, {binh, methodCode}} {
		if err := pgx.BeginFunc(ctx, pool, func(tx pgx.Tx) error {
			_, err := s.openSession(ctx, s.queries.WithTx(tx), signIn.a, signIn.method)

			return err
		}); err != nil {
			t.Fatal(err)
		}
	}

	asAdmin := adminCtx(ctx, admin)

	t.Run("an account shows its last sign-in", func(t *testing.T) {
		t.Parallel()

		got, err := s.AccountForAdmins(asAdmin, an.ID)
		if err != nil || got.LastSignedInAt == nil || got.LastSignInMethod != methodGoogle || got.CreatedAt.IsZero() {
			t.Errorf("An: %+v, %v; want a Google sign-in", got, err)
		}

		never, err := s.AccountForAdmins(asAdmin, admin.ID)
		if err != nil || never.LastSignedInAt != nil || never.LastSignInMethod != "" {
			t.Errorf("an admin never signed in: %+v, %v", never, err)
		}

		if _, err := s.AccountForAdmins(asAdmin, uuid.New()); !errors.Is(err, ErrAccountNotFound) {
			t.Errorf("an unknown account: %v, want ErrAccountNotFound", err)
		}
	})

	t.Run("the list finds words without marks and counts the roles", func(t *testing.T) {
		t.Parallel()

		for query, want := range map[string]string{"van an": an.Email, "BINH": binh.Email, "dong.lan": "dong.lan@example.com"} {
			page, err := s.ListAccounts(asAdmin, AccountFilter{Query: query, Page: 1, Size: 25})
			if err != nil || len(page.Accounts) != 1 || page.Accounts[0].Email != want || page.Total != 1 {
				t.Errorf("q=%q: %+v, %v; want %s alone", query, page, err, want)
			}
		}

		page, err := s.ListAccounts(asAdmin, AccountFilter{Role: platform.RoleAdmin, Page: 1, Size: 25})
		if err != nil || page.Total != 1 || page.Accounts[0].ID != admin.ID ||
			page.Counts[platform.RoleAdmin] != 1 || page.Counts[platform.RoleCustomer] != 3 {
			t.Errorf("the admins: %+v, %v", page, err)
		}
	})

	t.Run("the list sorts, those never signed in last", func(t *testing.T) {
		t.Parallel()

		for sort, want := range map[string][]string{
			"":          {"dong.lan@example.com", binh.Email, an.Email, admin.Email},
			"signedIn":  {an.Email, binh.Email},
			"-signedIn": {binh.Email, an.Email},
			"name":      {"dong.lan@example.com", an.Email, admin.Email, binh.Email},
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
	})

	t.Run("the list pages and refuses bad filters", func(t *testing.T) {
		t.Parallel()

		second, err := s.ListAccounts(asAdmin, AccountFilter{Page: 2, Size: 3})
		if err != nil || len(second.Accounts) != 1 || second.Total != 4 {
			t.Errorf("page 2 of 3: %+v, %v", second, err)
		}

		past, err := s.ListAccounts(asAdmin, AccountFilter{Page: 9, Size: 3})
		if err != nil || len(past.Accounts) != 0 || past.Total != 4 {
			t.Errorf("past the end: %+v, %v; want none of 4", past, err)
		}

		for _, f := range []AccountFilter{
			{Page: 0, Size: 25}, {Page: 1, Size: 101}, {Page: 1, Size: 25, Sort: "email"},
			{Page: 1, Size: 25, Role: "owner"}, {Page: 1, Size: 25, Query: string(make([]rune, 101))},
		} {
			if _, err := s.ListAccounts(asAdmin, f); !errors.Is(err, ErrAccountListInvalid) {
				t.Errorf("%+v: %v, want ErrAccountListInvalid", f, err)
			}
		}

		customer := platform.WithCaller(ctx, platform.Caller{AccountID: an.ID, Role: platform.RoleCustomer})
		if _, err := s.ListAccounts(customer, AccountFilter{Page: 1, Size: 25}); !errors.Is(err, platform.ErrAdminRequired) {
			t.Errorf("a customer listing: %v, want ErrAdminRequired", err)
		}
	})
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
