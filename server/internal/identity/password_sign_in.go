package identity

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"strings"
	"unicode/utf8"

	"github.com/jackc/pgx/v5"

	"github.com/kl3inIT/second-bite/server/internal/identity/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// maxUsernameLength is the longest username there is; a longer one is never an
// account's, so a sign-in with it is refused without a lookup (SEC-193).
const maxUsernameLength = 30

// Register makes an account of a username and a password and signs it in, the
// session handed over like any other. The account has no email (SEC-193).
// A username that is taken is refused, whatever the case it was typed in.
func (s *Service) Register(ctx context.Context, username, password string) (Session, error) {
	if err := s.credentialsByAddress.TakeFor(ctx); err != nil {
		return Session{}, err
	}

	name, err := normalizeUsername(username)
	if err != nil {
		return Session{}, err
	}

	if err := checkPassword(password, name); err != nil {
		return Session{}, err
	}

	hash, err := s.hash(ctx, password)
	if err != nil {
		return Session{}, err
	}

	var session Session

	err = pgx.BeginFunc(ctx, s.pool, func(tx pgx.Tx) error {
		q := s.queries.WithTx(tx)

		row, err := q.InsertPasswordAccount(ctx, db.InsertPasswordAccountParams{Username: name, PasswordHash: hash})
		if errors.Is(err, pgx.ErrNoRows) {
			return ErrUsernameTaken
		}

		if err != nil {
			return fmt.Errorf("making the account: %w", err)
		}

		account := Account{
			ID: row.ID, Email: row.Email, Username: row.Username, Role: platform.Role(row.Role), DisplayName: row.DisplayName,
		}

		session, err = s.openSession(ctx, q, account, methodPassword)

		return err
	})
	if err != nil {
		return Session{}, err
	}

	s.logger.InfoContext(ctx, "account registered",
		slog.String("event", "identity.account.registered"),
		slog.String("account_id", session.Account.ID.String()),
		slog.String("method", methodPassword),
	)

	return session, nil
}

// SignInWithPassword opens a session for the username whose password is right.
// An unknown username and a wrong password get the same answer and take the
// same time, and both count against the username's wrong tries: its sixth try
// in a window is refused without comparing the password, so the limit cannot
// be used to test one (design of SEC-193, sections 3 and 4).
func (s *Service) SignInWithPassword(ctx context.Context, username, password string) (Session, error) {
	if err := s.credentialsByAddress.TakeFor(ctx); err != nil {
		return Session{}, err
	}

	name := strings.ToLower(username)
	if len(name) > maxUsernameLength || utf8.RuneCountInString(password) > maxPasswordLength {
		// Neither can belong to an account: nothing to look up, count or hash.
		return Session{}, ErrCredentialsIncorrect
	}

	start, wait := s.wrongPasswords.take(name)
	if wait > 0 {
		s.logger.InfoContext(ctx, "password sign-in refused",
			slog.String("event", "identity.sign_in.limited"),
			slog.String("error_code", ErrSignInLimitExceeded.Code),
		)

		return Session{}, ErrSignInLimitExceeded.WithRetryAfter(wait)
	}

	account, err := s.checkPassword(ctx, name, password)
	if err != nil {
		if !errors.Is(err, ErrCredentialsIncorrect) {
			// Not a wrong password: the try is given back.
			s.wrongPasswords.refund(name, start)
		}

		return Session{}, err
	}

	s.wrongPasswords.refund(name, start)

	var session Session

	err = pgx.BeginFunc(ctx, s.pool, func(tx pgx.Tx) (err error) {
		session, err = s.openSession(ctx, s.queries.WithTx(tx), account, methodPassword)

		return err
	})
	if err != nil {
		return Session{}, err
	}

	s.logger.InfoContext(ctx, "signed in",
		slog.String("event", "identity.sign_in.succeeded"),
		slog.String("account_id", session.Account.ID.String()),
		slog.String("method", methodPassword),
	)

	return session, nil
}

// checkPassword finds the account of name and compares password with its hash;
// for a name that has no account it compares against a hash that matches
// nothing, so the answer comes as late. Either failure is ErrCredentialsIncorrect.
func (s *Service) checkPassword(ctx context.Context, name, password string) (Account, error) {
	row, err := s.queries.FindAccountForPassword(ctx, name)
	known := err == nil

	if err != nil && !errors.Is(err, pgx.ErrNoRows) {
		return Account{}, fmt.Errorf("finding the account: %w", err)
	}

	encoded := unknownUserHash()
	if known {
		encoded = row.PasswordHash
	}

	right, err := s.verify(ctx, password, encoded)
	if err != nil {
		return Account{}, err
	}

	if !known || !right {
		s.logger.InfoContext(ctx, "password sign-in failed",
			slog.String("event", "identity.sign_in.failed"),
			slog.String("error_code", ErrCredentialsIncorrect.Code),
		)

		return Account{}, ErrCredentialsIncorrect
	}

	return Account{
		ID: row.ID, Email: row.Email, Username: row.Username, Role: platform.Role(row.Role), DisplayName: row.DisplayName,
	}, nil
}

// hash and verify run argon2 while holding one of a few places, each worth
// 19 MiB, so a crowd of sign-ins cannot hold the memory of the server; a request
// that is cancelled while it waits for a place gives up.
func (s *Service) hash(ctx context.Context, password string) (string, error) {
	release, err := s.takeHashingPlace(ctx)
	if err != nil {
		return "", err
	}
	defer release()

	return hashPassword(password)
}

func (s *Service) verify(ctx context.Context, password, encoded string) (bool, error) {
	release, err := s.takeHashingPlace(ctx)
	if err != nil {
		return false, err
	}
	defer release()

	right, err := verifyPassword(password, encoded)
	if err != nil {
		return false, fmt.Errorf("checking the password: %w", err)
	}

	return right, nil
}

func (s *Service) takeHashingPlace(ctx context.Context) (release func(), err error) {
	select {
	case s.hashing <- struct{}{}:
		return func() { <-s.hashing }, nil
	case <-ctx.Done():
		return nil, fmt.Errorf("waiting to check a password: %w", ctx.Err())
	}
}
