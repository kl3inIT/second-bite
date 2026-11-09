package identity

import (
	"context"
	"errors"
	"fmt"
	"log/slog"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"

	"github.com/kl3inIT/second-bite/server/internal/identity/internal/db"
)

// externalIdentity is a person as a provider's verified token names them:
// Google's or Apple's (SEC-29, SEC-38).
type externalIdentity struct {
	provider string
	subject  string
	email    string
	// emailVerified is the provider's word that the person receives mail at
	// email.
	emailVerified bool
	// authoritative tells whether the provider speaks for the address, so that
	// an account already holding it may be linked without an emailed code.
	authoritative bool
	name          string
	picture       string
	// linkRequired is the provider's failure when the address has an account
	// the provider does not speak for.
	linkRequired error
}

// externalAccount returns the account of the identity, linking it on its first
// sign-in, and fills the account's name when it has none. The identity is found
// by the provider's subject, never by address.
func (s *Service) externalAccount(ctx context.Context, q *db.Queries, id externalIdentity) (Account, error) {
	if err := q.LockSubject(ctx, db.LockSubjectParams{Provider: id.provider, Subject: id.subject}); err != nil {
		return Account{}, fmt.Errorf("locking the identity: %w", err)
	}

	accountID, err := q.FindExternalLogin(ctx, db.FindExternalLoginParams{Provider: id.provider, Subject: id.subject})

	switch {
	case err == nil:
		refreshed, err := q.RefreshExternalLogin(ctx, db.RefreshExternalLoginParams{
			Name: id.name, PictureUrl: id.picture, Provider: id.provider, Subject: id.subject,
		})
		if err != nil {
			return Account{}, fmt.Errorf("refreshing the identity: %w", err)
		}

		// An emailed code removed the link while this sign-in was reading it,
		// and ended the account's sessions: the identity is unlinked again.
		if refreshed == 0 {
			return s.linkExternal(ctx, q, id)
		}

		return fillName(ctx, q, accountID, id.name)
	case errors.Is(err, pgx.ErrNoRows):
		return s.linkExternal(ctx, q, id)
	default:
		return Account{}, fmt.Errorf("finding the identity: %w", err)
	}
}

// linkExternal links the identity on its first sign-in: to a new account, or to
// the account of its address when the provider speaks for it (design of SEC-29,
// decision 4).
func (s *Service) linkExternal(ctx context.Context, q *db.Queries, id externalIdentity) (Account, error) {
	if !id.emailVerified {
		return Account{}, ErrEmailNotVerified
	}

	email, err := normalizeEmail(id.email)
	if err != nil {
		return Account{}, ErrEmailNotVerified
	}

	if err := q.LockEmail(ctx, email); err != nil {
		return Account{}, fmt.Errorf("locking the address: %w", err)
	}

	var accountID uuid.UUID

	existing, err := q.FindAccountByEmail(ctx, email)

	switch {
	case err == nil:
		if !id.authoritative {
			return Account{}, id.linkRequired
		}

		accountID = existing.ID
	case errors.Is(err, pgx.ErrNoRows):
		created, err := q.InsertAccount(ctx, email)
		if err != nil {
			return Account{}, fmt.Errorf("creating the account: %w", err)
		}

		accountID = created.ID
	default:
		return Account{}, fmt.Errorf("finding the account: %w", err)
	}

	if err := q.InsertExternalLogin(ctx, db.InsertExternalLoginParams{
		AccountID: accountID, Provider: id.provider, Subject: id.subject,
		LinkedEmail: email, EmailTrusted: id.authoritative, Name: id.name, PictureUrl: id.picture,
	}); err != nil {
		return Account{}, fmt.Errorf("linking the identity: %w", err)
	}

	s.logger.InfoContext(ctx, "external identity linked",
		slog.String("event", "identity.external_login.linked"),
		slog.String("account_id", accountID.String()),
		slog.String("provider", id.provider),
	)

	return fillName(ctx, q, accountID, id.name)
}
