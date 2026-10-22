package identity

import (
	"context"
	"crypto/hmac"
	"errors"
	"fmt"
	"html"
	"log/slog"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"

	"github.com/kl3inIT/second-bite/server/internal/identity/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/notification"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// AccountDeletedEvent tells the other modules that an account no longer
// exists, so they forget what they keep about it (SEC-37). It carries the
// identifier only; the address is gone with the account.
type AccountDeletedEvent struct {
	AccountID uuid.UUID `json:"accountId"`
}

// EventKey names the event where it is stored, delivered and logged.
func (AccountDeletedEvent) EventKey() string { return "identity.account_deleted" }

// deletionSweep is how long after a deletion AccountDeletedEvent is delivered
// again. A request authenticated just before the deletion committed can commit
// after the first delivery (opening a store, uploading a photo); the second one
// forgets what it wrote. No request lives that long: the server stops writing
// an answer after 30 seconds (SEC-126).
const deletionSweep = 2 * time.Minute

// RequestDeletionCode emails the caller's address a code that confirms the
// deletion of their account and nothing else. Deletion codes have limits of
// their own and one live code of their own, so asking for one neither ends
// the person's sign-in code nor spends its allowance (SEC-126).
func (s *Service) RequestDeletionCode(ctx context.Context) (Challenge, error) {
	caller, err := platform.RequireCaller(ctx)
	if err != nil {
		return Challenge{}, err
	}

	account, err := s.Account(ctx, caller.AccountID)
	if err != nil {
		return Challenge{}, err
	}

	c, err := s.sendCode(ctx, account.Email, purposeDeleteAccount, deletionCodeEmail)
	if err != nil {
		return Challenge{}, err
	}

	s.logger.InfoContext(ctx, "account deletion code sent",
		slog.String("event", "identity.deletion_code.sent"),
		slog.String("account_id", account.ID.String()),
		slog.String("challenge_id", c.ID.String()),
	)

	return c, nil
}

// DeleteAccount deletes the caller's account when the code is the one emailed
// for its deletion: the account, its sessions, its external logins and the
// codes sent to its address at once, the record of emails sent to the address
// just before, and AccountDeletedEvent tells the other modules to forget it.
func (s *Service) DeleteAccount(ctx context.Context, challengeID uuid.UUID, code string) error {
	caller, err := platform.RequireCaller(ctx)
	if err != nil {
		return err
	}

	account, err := s.Account(ctx, caller.AccountID)
	if err != nil {
		return err
	}

	email, err := s.checkCode(ctx, challengeID, code, purposeDeleteAccount)
	if err != nil {
		return err
	}

	// A code sent to another address says nothing about this account.
	if email != account.Email {
		return ErrChallengeGone
	}

	// The address is known only until the account is gone. Forgetting the
	// emails first does no harm if the deletion then fails.
	if err := s.email.ForgetRecipient(ctx, account.Email); err != nil {
		return err
	}

	err = pgx.BeginFunc(ctx, s.pool, func(tx pgx.Tx) error {
		return s.deleteAccountIn(ctx, tx, account, challengeID)
	})
	if err != nil {
		return err
	}

	s.logger.InfoContext(ctx, "account deleted",
		slog.String("event", "identity.account.deleted"),
		slog.String("account_id", account.ID.String()),
	)

	return nil
}

// deleteAccountIn uses the challenge and deletes the account in tx: its
// address's codes, the account with its sessions and links, its name in the
// audit trail; and writes AccountDeletedEvent, at once and again after
// deletionSweep.
func (s *Service) deleteAccountIn(ctx context.Context, tx pgx.Tx, account Account, challengeID uuid.UUID) error {
	q := s.queries.WithTx(tx)

	if err := q.LockEmail(ctx, account.Email); err != nil {
		return fmt.Errorf("locking the address: %w", err)
	}

	used, err := q.DeleteChallenge(ctx, challengeID)
	if err != nil {
		return fmt.Errorf("using the challenge: %w", err)
	}

	if used == 0 {
		return ErrChallengeGone // another request used the code first
	}

	if err := q.DeleteChallengesOf(ctx, account.Email); err != nil {
		return fmt.Errorf("deleting the address's codes: %w", err)
	}

	deleted, err := q.DeleteAccount(ctx, account.ID)
	if err != nil {
		return fmt.Errorf("deleting the account: %w", err)
	}

	if deleted == 0 {
		return ErrAccountNotFound
	}

	if err := s.trail.ForgetAccount(ctx, tx, account.ID); err != nil {
		return err
	}

	event := AccountDeletedEvent{AccountID: account.ID}
	if err := platform.Publish(ctx, tx, s.events, event); err != nil {
		return err
	}

	return platform.PublishAfter(ctx, tx, s.events, event, deletionSweep)
}

// checkCode spends a guess on the challenge of purpose and compares the code,
// answering the address the code was sent to.
func (s *Service) checkCode(ctx context.Context, challengeID uuid.UUID, code string, purpose codePurpose) (string, error) {
	spent, err := s.queries.SpendAttempt(ctx, db.SpendAttemptParams{
		ID: challengeID, Purpose: string(purpose), MaxAttempts: codeAttempts,
	})
	if errors.Is(err, pgx.ErrNoRows) {
		exhausted, err := s.queries.ChallengeExhausted(ctx, db.ChallengeExhaustedParams{
			ID: challengeID, Purpose: string(purpose), MaxAttempts: codeAttempts,
		})
		if err != nil {
			return "", fmt.Errorf("reading the challenge: %w", err)
		}

		if exhausted {
			return "", ErrCodeAttemptsExhausted
		}

		return "", ErrChallengeGone
	}

	if err != nil {
		return "", fmt.Errorf("spending a guess: %w", err)
	}

	if !hmac.Equal(spent.CodeHash, s.codeHash(challengeID, code)) {
		s.logger.InfoContext(ctx, "emailed code wrong",
			slog.String("event", "identity."+string(purpose)+".failed"),
			slog.String("challenge_id", challengeID.String()),
			slog.String("error_code", ErrCodeIncorrect.Code),
		)

		return "", ErrCodeIncorrect
	}

	return spent.Email, nil
}

func deletionCodeEmail(to, code string) notification.Email {
	minutes := int(codeLifetime / time.Minute)

	return notification.Email{
		Kind:    "account-deletion-code",
		To:      to,
		Subject: "Mã xác nhận xoá tài khoản Second Bite · Your Second Bite account deletion code",
		Text: fmt.Sprintf("Mã xác nhận xoá tài khoản của bạn: %[1]s\n"+
			"Nhập mã này để xoá vĩnh viễn tài khoản Second Bite. Mã dùng được trong %[2]d phút. "+
			"Nếu bạn không yêu cầu xoá tài khoản, hãy bỏ qua email và tài khoản vẫn giữ nguyên.\n\n"+
			"Your account deletion code: %[1]s\n"+
			"Enter it to delete your Second Bite account for good. It works for %[2]d minutes. "+
			"If you did not ask to delete your account, ignore this email and it stays as it is.\n", code, minutes),
		HTML: fmt.Sprintf(`<p>Mã xác nhận xoá tài khoản của bạn:</p>`+
			`<p style="font-size:28px;font-weight:bold;letter-spacing:4px">%[1]s</p>`+
			`<p>Nhập mã này để xoá vĩnh viễn tài khoản Second Bite. Mã dùng được trong %[2]d phút. `+
			`Nếu bạn không yêu cầu xoá tài khoản, hãy bỏ qua email và tài khoản vẫn giữ nguyên.</p><hr>`+
			`<p>Your account deletion code: <strong>%[1]s</strong></p>`+
			`<p>Enter it to delete your Second Bite account for good. It works for %[2]d minutes. `+
			`If you did not ask to delete your account, ignore this email and it stays as it is.</p>`,
			html.EscapeString(code), minutes),
	}
}
