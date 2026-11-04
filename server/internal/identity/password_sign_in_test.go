package identity

import (
	"context"
	"errors"
	"strings"
	"testing"

	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/platform/platformtest"
)

const (
	lanPassword   = "correct horse battery"
	wrongPassword = "wrong password"
	lanAnh        = "lan.anh"
	limitUser     = "limit.user"
	nobodyHere    = "nobody.here"
	minhTran      = "minh.tran"
	guessUser     = "guess.user"
)

// TestRegisterAndSignInWithPassword checks the rules below the HTTP flow of
// cmd/secondbite (SEC-193): an account made with a username has no email, is
// signed in at once, keeps only a hash of its password, and a username is one
// whatever the case it is typed in.
func TestRegisterAndSignInWithPassword(t *testing.T) {
	t.Parallel()

	pool := platformtest.StartPostgres(t)
	s := newDeletionService(t, pool)

	session, err := s.Register(t.Context(), "Lan.Anh", lanPassword)
	if err != nil {
		t.Fatal(err)
	}

	if a := session.Account; a.Username != lanAnh || a.Email != "" || a.Role != platform.RoleCustomer || a.Label() != lanAnh {
		t.Errorf("account %+v: want the username lan.anh, no email, a customer", a)
	}

	// The session works: it finds its caller, named by the username.
	caller, err := s.findCaller(t.Context(), session.Token)
	if err != nil || caller.AccountID != session.Account.ID || caller.Label != lanAnh {
		t.Errorf("findCaller: %+v, %v", caller, err)
	}

	// Only a hash is kept.
	var hash, method string
	if err := pool.QueryRow(t.Context(),
		`SELECT password_hash, last_sign_in_method FROM identity_accounts WHERE id = $1`, session.Account.ID,
	).Scan(&hash, &method); err != nil {
		t.Fatal(err)
	}

	if !strings.HasPrefix(hash, "$argon2id$") || strings.Contains(hash, lanPassword) || method != "password" {
		t.Errorf("stored %q, last sign-in by %q: want an argon2id hash and the password method", hash, method)
	}

	checkRegisterRefusals(t, s)

	// Signing in, in any case, opens another session of the same account.
	again, err := s.SignInWithPassword(t.Context(), "LAN.ANH", lanPassword)
	if err != nil || again.Account.ID != session.Account.ID || again.Token == session.Token {
		t.Fatalf("SignInWithPassword: %+v, %v", again, err)
	}

	for _, c := range []struct{ username, password string }{
		{lanAnh, lanPassword + "x"},
		{lanAnh, ""},
		{nobodyHere, lanPassword},
		{strings.Repeat("a", 31), lanPassword},
		{lanAnh, strings.Repeat("a", 129)},
	} {
		if _, err := s.SignInWithPassword(t.Context(), c.username, c.password); !errors.Is(err, ErrCredentialsIncorrect) {
			t.Errorf("SignInWithPassword(%q, %d characters): %v, want ErrCredentialsIncorrect", c.username, len(c.password), err)
		}
	}
}

func checkRegisterRefusals(t *testing.T, s *Service) {
	t.Helper()

	for _, c := range []struct {
		username, password string
		want               error
	}{
		{"LAN.ANH", lanPassword, ErrUsernameTaken},
		{lanAnh, "another password", ErrUsernameTaken},
		{"ab", lanPassword, ErrUsernameInvalid},
		{"lan anh", lanPassword, ErrUsernameInvalid},
		{minhTran, "short", ErrPasswordInvalid},
		{minhTran, minhTran, ErrPasswordInvalid},
	} {
		if _, err := s.Register(t.Context(), c.username, c.password); !errors.Is(err, c.want) {
			t.Errorf("Register(%q, %q): %v, want %v", c.username, c.password, err, c.want)
		}
	}
}

// TestPasswordTriesAreLimited checks that a username gets five tries in a
// window, that the sixth is refused without looking at the password, that a
// right password gives its try back and a wrong one does not, and that a
// username that does not exist is counted and refused the same way.
func TestPasswordTriesAreLimited(t *testing.T) {
	t.Parallel()

	pool := platformtest.StartPostgres(t)
	s := newDeletionService(t, pool)

	if _, err := s.Register(t.Context(), limitUser, lanPassword); err != nil {
		t.Fatal(err)
	}

	wrong := func(username string) {
		t.Helper()

		if _, err := s.SignInWithPassword(t.Context(), username, wrongPassword); !errors.Is(err, ErrCredentialsIncorrect) {
			t.Fatalf("a wrong password for %s: %v, want ErrCredentialsIncorrect", username, err)
		}
	}

	// Three wrong, one right (given back), two wrong: five wrong in all.
	for range 3 {
		wrong(limitUser)
	}

	if _, err := s.SignInWithPassword(t.Context(), limitUser, lanPassword); err != nil {
		t.Fatalf("the right password after three wrong ones: %v", err)
	}

	wrong(limitUser)
	wrong(limitUser)

	// The sixth try is refused, the right password included, and says when.
	_, err := s.SignInWithPassword(t.Context(), limitUser, lanPassword)
	if f, ok := platform.AsFailure(err); !ok || f.Code != ErrSignInLimitExceeded.Code || f.RetryAfter <= 0 {
		t.Fatalf("the sixth try: %v, want ErrSignInLimitExceeded with a wait", err)
	}

	// A name nobody has is counted too, so the refusal tells nothing about it.
	for range 5 {
		wrong(nobodyHere)
	}

	_, err = s.SignInWithPassword(t.Context(), nobodyHere, wrongPassword)
	if f, ok := platform.AsFailure(err); !ok || f.Code != ErrSignInLimitExceeded.Code {
		t.Errorf("the sixth try for an unknown username: %v, want ErrSignInLimitExceeded", err)
	}

	// Another username is not held back.
	if _, err := s.Register(t.Context(), "other.user", lanPassword); err != nil {
		t.Errorf("another username: %v", err)
	}
}

// TestDeleteAccountWithPassword checks the deletion of an account that has no
// address: the password confirms it, a wrong one deletes nothing and counts
// with the tries to sign in, no code can be asked for, and an account that
// signs in by email has no password to delete with.
func TestDeleteAccountWithPassword(t *testing.T) {
	t.Parallel()

	pool := platformtest.StartPostgres(t)
	s := newDeletionService(t, pool)

	session, err := s.Register(t.Context(), "leave.user", lanPassword)
	if err != nil {
		t.Fatal(err)
	}

	ctx := callerCtx(t, session)

	if _, err := s.RequestDeletionCode(ctx); !errors.Is(err, ErrNoEmail) {
		t.Errorf("asking for a deletion code without an address: %v, want ErrNoEmail", err)
	}

	if err := s.DeleteAccount(ctx, uuid.New(), "123456"); !errors.Is(err, ErrNoEmail) {
		t.Errorf("deleting with a code without an address: %v, want ErrNoEmail", err)
	}

	if err := s.DeleteAccountWithPassword(ctx, wrongPassword); !errors.Is(err, ErrPasswordIncorrect) {
		t.Fatalf("deleting with a wrong password: %v, want ErrPasswordIncorrect", err)
	}

	if _, err := s.Account(t.Context(), session.Account.ID); err != nil {
		t.Fatalf("a wrong password deleted the account: %v", err)
	}

	checkEmailAccountsHaveNoPassword(t, s)

	if err := s.DeleteAccountWithPassword(ctx, lanPassword); err != nil {
		t.Fatal(err)
	}

	var accounts, sessions, jobs int
	if err := pool.QueryRow(t.Context(), `SELECT
		(SELECT count(*) FROM identity_accounts WHERE id = $1),
		(SELECT count(*) FROM identity_sessions WHERE account_id = $1),
		(SELECT count(*) FROM river_job WHERE args->>'event' = 'identity.account_deleted')`,
		session.Account.ID,
	).Scan(&accounts, &sessions, &jobs); err != nil {
		t.Fatal(err)
	}

	// The event goes out at once and again two minutes later, as for any deletion.
	if accounts != 0 || sessions != 0 || jobs != 2 {
		t.Errorf("left: %d accounts, %d sessions, %d event jobs; want none, none, 2", accounts, sessions, jobs)
	}

	// The username is free again.
	if _, err := s.Register(t.Context(), "leave.user", lanPassword); err != nil {
		t.Errorf("registering the name again: %v", err)
	}
}

func checkEmailAccountsHaveNoPassword(t *testing.T, s *Service) {
	t.Helper()

	byEmail := signedIn(t, s, "has.email."+uuid.NewString()[:8]+"@example.com")
	if err := s.DeleteAccountWithPassword(callerCtx(t, byEmail), lanPassword); !errors.Is(err, ErrNoPassword) {
		t.Errorf("deleting an email account with a password: %v, want ErrNoPassword", err)
	}
}

// TestDeletionPasswordTriesCountWithSignIn checks that guessing the password
// through the deletion cannot beat the limit of signing in.
func TestDeletionPasswordTriesCountWithSignIn(t *testing.T) {
	t.Parallel()

	pool := platformtest.StartPostgres(t)
	s := newDeletionService(t, pool)

	session, err := s.Register(t.Context(), guessUser, lanPassword)
	if err != nil {
		t.Fatal(err)
	}

	for range 3 {
		if _, err := s.SignInWithPassword(t.Context(), guessUser, wrongPassword); !errors.Is(err, ErrCredentialsIncorrect) {
			t.Fatal(err)
		}
	}

	ctx := callerCtx(t, session)

	for range 2 {
		if err := s.DeleteAccountWithPassword(ctx, wrongPassword); !errors.Is(err, ErrPasswordIncorrect) {
			t.Fatal(err)
		}
	}

	// Five wrong tries in all: the right password is now refused, by either door.
	err = s.DeleteAccountWithPassword(ctx, lanPassword)
	if f, ok := platform.AsFailure(err); !ok || f.Code != ErrSignInLimitExceeded.Code {
		t.Errorf("deleting after five wrong tries: %v, want ErrSignInLimitExceeded", err)
	}

	_, err = s.SignInWithPassword(t.Context(), guessUser, lanPassword)
	if f, ok := platform.AsFailure(err); !ok || f.Code != ErrSignInLimitExceeded.Code {
		t.Errorf("signing in after five wrong tries: %v, want ErrSignInLimitExceeded", err)
	}
}

// TestAdminsSeeAccountsWithoutEmail checks that the admins' list shows an
// account made with a username by its username and finds it by words.
func TestAdminsSeeAccountsWithoutEmail(t *testing.T) {
	t.Parallel()

	pool := platformtest.StartPostgres(t)
	s := newDeletionService(t, pool)

	if _, err := s.Register(t.Context(), "Thu.Ha_88", lanPassword); err != nil {
		t.Fatal(err)
	}

	signedIn(t, s, "someone."+uuid.NewString()[:8]+"@example.com")

	admin := platform.WithCaller(context.Background(), platform.Caller{AccountID: uuid.New(), Role: platform.RoleAdmin})

	page, err := s.ListAccounts(admin, AccountFilter{Query: "thu.ha", Page: 1, Size: 25})
	if err != nil {
		t.Fatal(err)
	}

	if len(page.Accounts) != 1 || page.Accounts[0].Username != "thu.ha_88" || page.Accounts[0].Email != "" ||
		page.Accounts[0].LastSignInMethod != "password" {
		t.Fatalf("searching for the username: %+v", page.Accounts)
	}

	all, err := s.ListAccounts(admin, AccountFilter{Page: 1, Size: 25})
	if err != nil || all.Total != 2 {
		t.Errorf("every account: %d, %v; want 2", all.Total, err)
	}
}
