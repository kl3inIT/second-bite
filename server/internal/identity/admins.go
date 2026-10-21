package identity

import (
	"context"
	"errors"
	"fmt"
	"log/slog"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"

	"github.com/kl3inIT/second-bite/server/internal/audit"
	"github.com/kl3inIT/second-bite/server/internal/identity/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// Admins lists the admins by address, to an admin.
func (s *Service) Admins(ctx context.Context) ([]Account, error) {
	if _, err := platform.RequireAdmin(ctx); err != nil {
		return nil, err
	}

	rows, err := s.queries.ListAdmins(ctx)
	if err != nil {
		return nil, fmt.Errorf("listing the admins: %w", err)
	}

	admins := make([]Account, 0, len(rows))
	for _, r := range rows {
		admins = append(admins, accountOf(db.GetAccountRow(r)))
	}

	return admins, nil
}

// GrantAdmin makes the account of email an admin, for the admin of ctx,
// creating the account when the address has never signed in; its owner signs
// in with an emailed code like anyone. An address an unvouched Google link
// holds is refused until its owner proves it (giveByAddress). Granting an
// admin again changes and records nothing.
func (s *Service) GrantAdmin(ctx context.Context, email string) (Account, error) {
	if _, err := platform.RequireAdmin(ctx); err != nil {
		return Account{}, err
	}

	return s.grantAdmin(ctx, email, audit.SourceAdmin)
}

// GrantAdminAsSystem is GrantAdmin with no admin behind it. Only the command
// line calls it: the first admin exists before anyone can sign in to name one.
func (s *Service) GrantAdminAsSystem(ctx context.Context, email string) (Account, error) {
	return s.grantAdmin(ctx, email, audit.SourceCommandLine)
}

func (s *Service) grantAdmin(ctx context.Context, email, source string) (Account, error) {
	granted := false

	a, err := s.giveByAddress(ctx, email, func(tx pgx.Tx, q *db.Queries, email string) (Account, error) {
		row, err := q.FindAccountByEmail(ctx, email)
		if err == nil && platform.Role(row.Role) == platform.RoleAdmin {
			return accountOf(db.GetAccountRow(row)), nil
		}

		if err != nil && !errors.Is(err, pgx.ErrNoRows) {
			return Account{}, fmt.Errorf("finding the account: %w", err)
		}

		made, err := q.GrantRole(ctx, db.GrantRoleParams{Email: email, Role: string(platform.RoleAdmin)})
		if err != nil {
			return Account{}, fmt.Errorf("granting the role: %w", err)
		}

		a := accountOf(db.GetAccountRow(made))
		granted = true

		return a, s.trail.Record(ctx, tx, accountResource(a), audit.AdminGranted{Source: source})
	})
	if err != nil {
		return Account{}, err
	}

	if granted {
		s.logger.InfoContext(ctx, "admin granted",
			slog.String("event", "identity.admin.granted"),
			slog.String("account_id", a.ID.String()),
			slog.String("source", source),
		)
	}

	return a, nil
}

// RevokeAdmin makes the admin id a customer again, for another admin. It
// refuses the caller's own account (ErrAdminSelf) and the last admin
// (ErrLastAdmin). The account's sessions stay: its role is read on every
// request, so its next request is a customer's. Revoking a customer changes
// and records nothing.
func (s *Service) RevokeAdmin(ctx context.Context, id uuid.UUID) (Account, error) {
	caller, err := platform.RequireAdmin(ctx)
	if err != nil {
		return Account{}, err
	}

	if id == caller.AccountID {
		return Account{}, ErrAdminSelf
	}

	return s.revokeAdmin(ctx, audit.SourceAdmin, func(q *db.Queries) (db.GetAccountRow, error) {
		return q.GetAccount(ctx, id)
	})
}

// RevokeAdminAsSystem is RevokeAdmin for the account of email with no admin
// behind it; only the command line calls it. The last admin stays.
func (s *Service) RevokeAdminAsSystem(ctx context.Context, email string) (Account, error) {
	email, err := normalizeEmail(email)
	if err != nil {
		return Account{}, err
	}

	return s.revokeAdmin(ctx, audit.SourceCommandLine, func(q *db.Queries) (db.GetAccountRow, error) {
		row, err := q.FindAccountByEmail(ctx, email)

		return db.GetAccountRow(row), err
	})
}

func (s *Service) revokeAdmin(
	ctx context.Context, source string, find func(*db.Queries) (db.GetAccountRow, error),
) (Account, error) {
	var (
		a       Account
		revoked bool
	)

	err := pgx.BeginFunc(ctx, s.pool, func(tx pgx.Tx) error {
		q := s.queries.WithTx(tx)

		if err := q.LockAdmins(ctx); err != nil {
			return fmt.Errorf("locking the admins: %w", err)
		}

		row, err := find(q)
		if errors.Is(err, pgx.ErrNoRows) {
			return ErrAccountNotFound
		}

		if err != nil {
			return fmt.Errorf("finding the account: %w", err)
		}

		a = accountOf(row)
		if a.Role != platform.RoleAdmin {
			return nil
		}

		admins, err := q.CountAdmins(ctx)
		if err != nil {
			return fmt.Errorf("counting the admins: %w", err)
		}

		if admins <= 1 {
			return ErrLastAdmin
		}

		changed, err := q.SetRole(ctx, db.SetRoleParams{ID: a.ID, Role: string(platform.RoleCustomer)})
		if err != nil {
			return fmt.Errorf("revoking the role: %w", err)
		}

		a, revoked = accountOf(db.GetAccountRow(changed)), true

		return s.trail.Record(ctx, tx, accountResource(a), audit.AdminRevoked{Source: source})
	})
	if err != nil {
		return Account{}, err
	}

	if revoked {
		s.logger.InfoContext(ctx, "admin revoked",
			slog.String("event", "identity.admin.revoked"),
			slog.String("account_id", a.ID.String()),
			slog.String("source", source),
		)
	}

	return a, nil
}

func accountOf(r db.GetAccountRow) Account {
	return Account{ID: r.ID, Email: r.Email, Role: platform.Role(r.Role), DisplayName: r.DisplayName}
}

// accountResource is the account as the audit trail names it.
func accountResource(a Account) audit.Resource {
	return audit.Resource{Type: audit.ResourceAccount, ID: a.ID.String(), Label: a.Email}
}
