package identity

import (
	"context"
	"errors"
	"testing"

	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/platform/platformtest"
)

const (
	changeUser   = "change.user"
	guessChanger = "change.guess"
	newPassword  = "a better password"
	shortNewPass = "short"
)

// TestChangePassword checks the change of the password of an account made with
// a username (SEC-208): the old password is the only proof, the new one follows
// the rules of a registration and is judged before a try is spent, a wrong old
// one changes nothing, and a change ends the account's other sessions but not
// the one asking.
func TestChangePassword(t *testing.T) {
	t.Parallel()

	pool := platformtest.StartPostgres(t)
	s := newDeletionService(t, pool)

	session, err := s.Register(t.Context(), changeUser, lanPassword)
	if err != nil {
		t.Fatal(err)
	}

	other, err := s.SignInWithPassword(t.Context(), changeUser, lanPassword)
	if err != nil {
		t.Fatal(err)
	}

	ctx := sessionCtx(t, s, session)

	checkChangeRefusals(ctx, t, s)

	if err := s.ChangePassword(ctx, lanPassword, newPassword); err != nil {
		t.Fatal(err)
	}

	if _, err := s.SignInWithPassword(t.Context(), changeUser, lanPassword); !errors.Is(err, ErrCredentialsIncorrect) {
		t.Errorf("signing in with the old password: %v, want ErrCredentialsIncorrect", err)
	}

	if _, err := s.SignInWithPassword(t.Context(), changeUser, newPassword); err != nil {
		t.Errorf("signing in with the new password: %v", err)
	}

	if _, err := s.findCaller(t.Context(), session.Token); err != nil {
		t.Errorf("the session that asked for the change: %v, want it alive", err)
	}

	if _, err := s.findCaller(t.Context(), other.Token); !errors.Is(err, ErrSessionInvalid) {
		t.Errorf("another session of the account: %v, want ErrSessionInvalid", err)
	}

	byEmail := signedIn(t, s, "no.password."+uuid.NewString()[:8]+"@example.com")
	if err := s.ChangePassword(callerCtx(t, byEmail), lanPassword, newPassword); !errors.Is(err, ErrNoPassword) {
		t.Errorf("changing the password of an email account: %v, want ErrNoPassword", err)
	}
}

// checkChangeRefusals checks what a change refuses and that a refusal changes nothing: a new password that breaks
// the rules is refused before a try is spent, and a wrong old one is refused and leaves the password as it was.
func checkChangeRefusals(ctx context.Context, t *testing.T, s *Service) {
	t.Helper()

	// A new password that breaks the rules is refused before a try is spent:
	// six of them, with a wrong old password, leave the limit unreached.
	for range 6 {
		if err := s.ChangePassword(ctx, wrongPassword, shortNewPass); !errors.Is(err, ErrPasswordInvalid) {
			t.Fatalf("a short new password: %v, want ErrPasswordInvalid", err)
		}
	}

	if err := s.ChangePassword(ctx, lanPassword, changeUser); !errors.Is(err, ErrPasswordInvalid) {
		t.Errorf("the username as the new password: %v, want ErrPasswordInvalid", err)
	}

	if err := s.ChangePassword(ctx, wrongPassword, newPassword); !errors.Is(err, ErrPasswordIncorrect) {
		t.Fatalf("a wrong old password: %v, want ErrPasswordIncorrect", err)
	}

	if _, err := s.SignInWithPassword(t.Context(), changeUser, lanPassword); err != nil {
		t.Fatalf("a refused change replaced the password: %v", err)
	}
}

// TestChangePasswordTriesCountWithSignIn checks that guessing the old password
// through the change cannot beat the limit of signing in.
func TestChangePasswordTriesCountWithSignIn(t *testing.T) {
	t.Parallel()

	pool := platformtest.StartPostgres(t)
	s := newDeletionService(t, pool)

	session, err := s.Register(t.Context(), guessChanger, lanPassword)
	if err != nil {
		t.Fatal(err)
	}

	ctx := sessionCtx(t, s, session)

	for range 5 {
		if err := s.ChangePassword(ctx, wrongPassword, newPassword); !errors.Is(err, ErrPasswordIncorrect) {
			t.Fatal(err)
		}
	}

	// Five wrong tries: the right old password is refused too.
	err = s.ChangePassword(ctx, lanPassword, newPassword)
	if f, ok := platform.AsFailure(err); !ok || f.Code != ErrSignInLimitExceeded.Code {
		t.Errorf("changing after five wrong tries: %v, want ErrSignInLimitExceeded", err)
	}
}

// sessionCtx is a context holding the caller the session's own token gives, so
// that the session is the real one and not a made-up identifier.
func sessionCtx(t *testing.T, s *Service, session Session) context.Context {
	t.Helper()

	caller, err := s.findCaller(t.Context(), session.Token)
	if err != nil {
		t.Fatal(err)
	}

	return platform.WithCaller(t.Context(), caller)
}
