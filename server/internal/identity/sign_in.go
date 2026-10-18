package identity

import (
	"context"
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"errors"
	"fmt"
	"html"
	"log/slog"
	"math/big"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"

	"github.com/kl3inIT/second-bite/server/internal/identity/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/notification"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// Challenge is an emailed code waiting to be typed. Its identifier goes back
// with the code, so the code works only for the client that asked for it.
type Challenge struct {
	ID        uuid.UUID
	ExpiresAt time.Time
}

// Session is a signed-in client. Token is shown once, when it is created; only
// its hash is stored.
type Session struct {
	Token     string
	ExpiresAt time.Time
	Account   Account
}

// RequestCode emails a six-digit code to address. Whether the address has an
// account or not, the answer is the same, so it does not tell who has one.
// The email is sent before the request is answered and the code never
// reaches a queue (design of SEC-10).
func (s *Service) RequestCode(ctx context.Context, address string) (Challenge, error) {
	email, err := normalizeEmail(address)
	if err != nil {
		return Challenge{}, err
	}

	code, err := newCode()
	if err != nil {
		return Challenge{}, err
	}

	id, err := uuid.NewV7()
	if err != nil {
		return Challenge{}, fmt.Errorf("creating the challenge id: %w", err)
	}

	var expiresAt time.Time

	err = pgx.BeginFunc(ctx, s.pool, func(tx pgx.Tx) error {
		q := s.queries.WithTx(tx)

		// One request per address at a time, so requests arriving together
		// cannot all pass the limits.
		if err := q.LockEmail(ctx, email); err != nil {
			return fmt.Errorf("locking the address: %w", err)
		}

		usage, err := q.ChallengeUsage(ctx, email)
		if err != nil {
			return fmt.Errorf("reading the address's limits: %w", err)
		}

		if wait := limitWait(usage); wait > 0 {
			return ErrCodeLimitExceeded.WithRetryAfter(wait)
		}

		if err := q.DeleteOldChallenges(ctx); err != nil {
			return fmt.Errorf("deleting old challenges: %w", err)
		}

		// One live code per address: otherwise codes asked for within the
		// limits could each take five guesses, past the limits on wrong ones.
		if err := q.EndLiveChallenges(ctx, email); err != nil {
			return fmt.Errorf("ending earlier codes: %w", err)
		}

		expiresAt, err = q.InsertChallenge(ctx, db.InsertChallengeParams{
			ID:              id,
			Email:           email,
			CodeHash:        s.codeHash(id, code),
			LifetimeSeconds: int32(codeLifetime / time.Second),
		})
		if err != nil {
			return fmt.Errorf("storing the challenge: %w", err)
		}

		return nil
	})
	if err != nil {
		return Challenge{}, err
	}

	if err := s.email.SendEmail(ctx, signInCodeEmail(email, code)); err != nil {
		// A code that never left neither works nor counts toward the limits.
		if _, delErr := s.queries.DeleteChallenge(context.WithoutCancel(ctx), id); delErr != nil {
			return Challenge{}, errors.Join(err, fmt.Errorf("deleting the unsent challenge: %w", delErr))
		}

		return Challenge{}, err
	}

	s.logger.InfoContext(ctx, "sign-in code sent",
		slog.String("event", "identity.sign_in_code.sent"),
		slog.String("challenge_id", id.String()),
	)

	return Challenge{ID: id, ExpiresAt: expiresAt}, nil
}

// limitWait returns how long the address must wait before another code, or 0.
func limitWait(u db.ChallengeUsageRow) time.Duration {
	now := u.CheckedAt

	var wait time.Duration

	until := func(t time.Time) {
		if d := t.Sub(now); d > wait {
			wait = d
		}
	}

	until(u.NewestSentAt.Add(codeCooldown))

	if u.SentLastHour >= codesPerHour {
		until(u.OldestSentLastHour.Add(time.Hour))
	}

	if u.WrongLastHour >= wrongGuessesInHour {
		until(u.OldestWrongLastHour.Add(time.Hour))
	}

	if u.WrongLastDay >= wrongGuessesInDay {
		until(u.OldestWrongLastDay.Add(24 * time.Hour))
	}

	return wait
}

// SignIn checks the code typed for the challenge and, when it is right, opens
// a session, creating the account on its first sign-in. Each guess is paid
// before it is compared; a right code works once.
func (s *Service) SignIn(ctx context.Context, challengeID uuid.UUID, code string) (Session, error) {
	spent, err := s.queries.SpendAttempt(ctx, db.SpendAttemptParams{ID: challengeID, MaxAttempts: codeAttempts})
	if errors.Is(err, pgx.ErrNoRows) {
		exhausted, err := s.queries.ChallengeExhausted(ctx, db.ChallengeExhaustedParams{ID: challengeID, MaxAttempts: codeAttempts})
		if err != nil {
			return Session{}, fmt.Errorf("reading the challenge: %w", err)
		}

		if exhausted {
			return Session{}, ErrCodeAttemptsExhausted
		}

		return Session{}, ErrChallengeGone
	}

	if err != nil {
		return Session{}, fmt.Errorf("spending a guess: %w", err)
	}

	if !hmac.Equal(spent.CodeHash, s.codeHash(challengeID, code)) {
		s.logger.InfoContext(ctx, "sign-in code wrong",
			slog.String("event", "identity.sign_in.failed"),
			slog.String("challenge_id", challengeID.String()),
			slog.String("error_code", ErrCodeIncorrect.Code),
		)

		return Session{}, ErrCodeIncorrect
	}

	var session Session

	err = pgx.BeginFunc(ctx, s.pool, func(tx pgx.Tx) error {
		q := s.queries.WithTx(tx)

		deleted, err := q.DeleteChallenge(ctx, challengeID)
		if err != nil {
			return fmt.Errorf("using the challenge: %w", err)
		}

		if deleted == 0 {
			return ErrChallengeGone // another request used the code first
		}

		account, err := q.UpsertAccount(ctx, spent.Email)
		if err != nil {
			return fmt.Errorf("finding the account: %w", err)
		}

		session, err = s.openSession(ctx, q, Account{ID: account.ID, Email: account.Email, Role: platform.Role(account.Role), DisplayName: account.DisplayName})

		return err
	})
	if err != nil {
		return Session{}, err
	}

	s.logger.InfoContext(ctx, "signed in",
		slog.String("event", "identity.sign_in.succeeded"),
		slog.String("account_id", session.Account.ID.String()),
		slog.String("method", "email_code"),
	)

	return session, nil
}

func (s *Service) openSession(ctx context.Context, q *db.Queries, a Account) (Session, error) {
	token := rand.Text()

	row, err := q.InsertSession(ctx, db.InsertSessionParams{
		AccountID:       a.ID,
		TokenHash:       tokenHash(token),
		LifetimeSeconds: int32(sessionLifetime / time.Second),
	})
	if err != nil {
		return Session{}, fmt.Errorf("opening the session: %w", err)
	}

	if err := q.DeleteExpiredSessions(ctx, a.ID); err != nil {
		return Session{}, fmt.Errorf("deleting expired sessions: %w", err)
	}

	return Session{Token: token, ExpiresAt: row.ExpiresAt, Account: a}, nil
}

// codeHash is HMAC-SHA-256 of the challenge and the code under the code key,
// as Ory Kratos stores its codes.
func (s *Service) codeHash(challengeID uuid.UUID, code string) []byte {
	mac := hmac.New(sha256.New, s.codeKey)
	mac.Write(challengeID[:])
	mac.Write([]byte(code))

	return mac.Sum(nil)
}

func tokenHash(token string) []byte {
	sum := sha256.Sum256([]byte(token))

	return sum[:]
}

func newCode() (string, error) {
	n, err := rand.Int(rand.Reader, big.NewInt(1_000_000))
	if err != nil {
		return "", fmt.Errorf("drawing a code: %w", err)
	}

	return fmt.Sprintf("%06d", n.Int64()), nil
}

// signInCodeEmail is written in Vietnamese and English: the language of the
// person is not known before they sign in.
func signInCodeEmail(to, code string) notification.Email {
	minutes := int(codeLifetime / time.Minute)

	return notification.Email{
		Kind:    "sign-in-code",
		To:      to,
		Subject: "Mã đăng nhập Second Bite · Your Second Bite sign-in code",
		Text: fmt.Sprintf("Mã đăng nhập của bạn: %[1]s\n"+
			"Mã dùng được trong %[2]d phút. Nếu bạn không yêu cầu mã này, hãy bỏ qua email.\n\n"+
			"Your sign-in code: %[1]s\n"+
			"It works for %[2]d minutes. If you did not ask for it, ignore this email.\n", code, minutes),
		HTML: fmt.Sprintf(`<p>Mã đăng nhập của bạn:</p><p style="font-size:28px;font-weight:bold;letter-spacing:4px">%[1]s</p>`+
			`<p>Mã dùng được trong %[2]d phút. Nếu bạn không yêu cầu mã này, hãy bỏ qua email.</p><hr>`+
			`<p>Your sign-in code: <strong>%[1]s</strong></p>`+
			`<p>It works for %[2]d minutes. If you did not ask for it, ignore this email.</p>`, html.EscapeString(code), minutes),
	}
}
