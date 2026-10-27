package seller

import (
	"context"
	"errors"
	"fmt"
	"log/slog"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"

	"github.com/kl3inIT/second-bite/server/internal/audit"
	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/seller/internal/db"
)

// Members returns the accounts that act for the seller, to its members and
// to admins.
func (s *Service) Members(ctx context.Context, sellerID uuid.UUID) ([]Member, error) {
	caller, err := platform.RequireCaller(ctx)
	if err != nil {
		return nil, err
	}

	if _, err := s.roleOf(ctx, sellerID, caller); err != nil {
		return nil, err
	}

	rows, err := s.queries.Members(ctx, sellerID)
	if err != nil {
		return nil, fmt.Errorf("reading the members: %w", err)
	}

	ids := make([]uuid.UUID, 0, len(rows))
	for _, r := range rows {
		ids = append(ids, r.AccountID)
	}

	accounts, err := s.accounts.Accounts(ctx, ids)
	if err != nil {
		return nil, err
	}

	members := make([]Member, 0, len(rows))
	for _, r := range rows {
		members = append(members, Member{
			AccountID: r.AccountID, Email: accounts[r.AccountID].Email, Role: Role(r.Role), AddedAt: r.CreatedAt,
		})
	}

	return members, nil
}

// AddStaff makes the account of email a staff member of the seller at once,
// creating the account when the address has never signed in, as Open Food
// Network adds a manager. Only the owner may.
func (s *Service) AddStaff(ctx context.Context, sellerID uuid.UUID, email string) (Member, error) {
	caller, err := s.requireOwner(ctx, sellerID)
	if err != nil {
		return Member{}, err
	}

	account, err := s.accounts.EnsureAccount(ctx, email)
	if err != nil {
		return Member{}, err
	}

	// The seller's row is locked while its people are counted and one is
	// added, so additions arriving together cannot pass the limit.
	err = pgx.BeginFunc(ctx, s.pool, func(tx pgx.Tx) error {
		q := s.queries.WithTx(tx)

		if err := q.LockSeller(ctx, sellerID); err != nil {
			return fmt.Errorf("locking the seller: %w", err)
		}

		count, err := q.CountMembers(ctx, sellerID)
		if err != nil {
			return fmt.Errorf("counting the people: %w", err)
		}

		if count >= maxMembers {
			return ErrStaffLimitReached
		}

		added, err := q.InsertMember(ctx, db.InsertMemberParams{SellerID: sellerID, AccountID: account.ID, Role: string(RoleStaff)})
		if err != nil {
			return fmt.Errorf("adding the staff member: %w", err)
		}

		if added == 0 {
			return ErrAlreadyMember
		}

		return nil
	})
	if err != nil {
		return Member{}, err
	}

	s.logger.InfoContext(ctx, "staff added",
		slog.String("event", "seller.staff.added"),
		slog.String("seller_id", sellerID.String()),
		slog.String("account_id", account.ID.String()),
		slog.String("by_account_id", caller.AccountID.String()),
	)

	all, err := s.Members(ctx, sellerID)
	if err != nil {
		return Member{}, err
	}

	for _, m := range all {
		if m.AccountID == account.ID {
			return m, nil
		}
	}

	return Member{}, ErrMemberNotFound
}

// RemoveMember removes a staff member: the owner removes anyone on the staff,
// a staff member removes themself. The owner cannot be removed.
func (s *Service) RemoveMember(ctx context.Context, sellerID, accountID uuid.UUID) error {
	caller, err := platform.RequireCaller(ctx)
	if err != nil {
		return err
	}

	role, err := s.roleOf(ctx, sellerID, caller)
	if err != nil {
		return err
	}

	if role != RoleOwner && caller.AccountID != accountID {
		return ErrOwnerRequired
	}

	if role == RoleOwner && caller.AccountID == accountID {
		return ErrOwnerCannotLeave
	}

	removed, err := s.queries.DeleteStaff(ctx, db.DeleteStaffParams{SellerID: sellerID, AccountID: accountID})
	if err != nil {
		return fmt.Errorf("removing the staff member: %w", err)
	}

	if removed == 0 {
		return ErrMemberNotFound
	}

	s.logger.InfoContext(ctx, "staff removed",
		slog.String("event", "seller.staff.removed"),
		slog.String("seller_id", sellerID.String()),
		slog.String("account_id", accountID.String()),
		slog.String("by_account_id", caller.AccountID.String()),
	)

	return nil
}

// ChangeOwner hands the seller to the account of email, for an admin, so a
// store the team opened is run by the person who owns it (SEC-162). The
// address that never signed in gets its account then, as when staff are added.
// The previous owner, when there is one, stays on as staff; a seller whose
// owner deleted their account gets an owner again.
func (s *Service) ChangeOwner(ctx context.Context, sellerID uuid.UUID, email string) ([]Member, error) {
	caller, err := platform.RequireAdmin(ctx)
	if err != nil {
		return nil, err
	}

	account, err := s.accounts.EnsureAccount(ctx, email)
	if err != nil {
		return nil, err
	}

	var previous uuid.NullUUID

	err = pgx.BeginFunc(ctx, s.pool, func(tx pgx.Tx) error {
		previous, err = s.changeOwnerIn(ctx, tx, sellerID, account.ID)

		return err
	})
	if err != nil {
		return nil, err
	}

	attrs := []any{
		slog.String("event", "seller.owner.changed"),
		slog.String("seller_id", sellerID.String()),
		slog.String("account_id", account.ID.String()),
		slog.String("by_account_id", caller.AccountID.String()),
	}
	if previous.Valid {
		attrs = append(attrs, slog.String("previous_account_id", previous.UUID.String()))
	}

	s.logger.InfoContext(ctx, "seller owner changed", attrs...)

	return s.Members(ctx, sellerID)
}

// changeOwnerIn makes accountID the seller's owner in tx and returns the
// previous owner. The seller's row is locked before the new owner's sellers are
// counted, the order opening a seller takes, so the limits hold under
// concurrency.
func (s *Service) changeOwnerIn(ctx context.Context, tx pgx.Tx, sellerID, accountID uuid.UUID) (uuid.NullUUID, error) {
	q := s.queries.WithTx(tx)

	row, err := q.GetSeller(ctx, sellerID)
	if errors.Is(err, pgx.ErrNoRows) {
		return uuid.NullUUID{}, ErrNotFound
	}

	if err != nil {
		return uuid.NullUUID{}, fmt.Errorf("reading the seller: %w", err)
	}

	if err := q.LockSeller(ctx, sellerID); err != nil {
		return uuid.NullUUID{}, fmt.Errorf("locking the seller: %w", err)
	}

	was, err := previousOwner(ctx, q, sellerID, accountID)
	if err != nil {
		return was, err
	}

	if err := ownsRoomFor(ctx, q, accountID); err != nil {
		return was, err
	}

	// The previous owner steps down first: one owner per seller holds at every
	// statement.
	if was.Valid {
		if _, err := q.SetRole(ctx, db.SetRoleParams{SellerID: sellerID, AccountID: was.UUID, Role: string(RoleStaff)}); err != nil {
			return was, fmt.Errorf("making the previous owner staff: %w", err)
		}
	}

	if err := s.makeOwner(ctx, q, sellerID, accountID); err != nil {
		return was, err
	}

	change := audit.SellerOwnerChanged{To: accountID.String()}
	if was.Valid {
		change.From = was.UUID.String()
	}

	return was, s.trail.Record(ctx, tx, audit.Resource{Type: audit.ResourceSeller, ID: sellerID.String(), Label: row.Name}, change)
}

// makeOwner turns a member into the owner, or adds the account as the owner
// when the seller has room for one more person.
func (s *Service) makeOwner(ctx context.Context, q *db.Queries, sellerID, accountID uuid.UUID) error {
	promoted, err := q.SetRole(ctx, db.SetRoleParams{SellerID: sellerID, AccountID: accountID, Role: string(RoleOwner)})
	if err != nil {
		return fmt.Errorf("making the member the owner: %w", err)
	}

	if promoted > 0 {
		return nil
	}

	count, err := q.CountMembers(ctx, sellerID)
	if err != nil {
		return fmt.Errorf("counting the people: %w", err)
	}

	if count >= maxMembers {
		return ErrStaffLimitReached
	}

	if _, err := q.InsertMember(ctx, db.InsertMemberParams{SellerID: sellerID, AccountID: accountID, Role: string(RoleOwner)}); err != nil {
		return fmt.Errorf("adding the owner: %w", err)
	}

	return nil
}

// previousOwner reads the seller's owner, if it has one, refusing an account
// that already owns it.
func previousOwner(ctx context.Context, q *db.Queries, sellerID, accountID uuid.UUID) (uuid.NullUUID, error) {
	previous, err := q.OwnerOf(ctx, sellerID)
	if errors.Is(err, pgx.ErrNoRows) {
		return uuid.NullUUID{}, nil
	}

	if err != nil {
		return uuid.NullUUID{}, fmt.Errorf("reading the owner: %w", err)
	}

	was := uuid.NullUUID{UUID: previous, Valid: true}
	if previous == accountID {
		return was, ErrAlreadyOwner
	}

	return was, nil
}

// ownsRoomFor takes the new owner's lock and refuses one who owns five sellers.
func ownsRoomFor(ctx context.Context, q *db.Queries, accountID uuid.UUID) error {
	if err := q.LockAccount(ctx, accountID.String()); err != nil {
		return fmt.Errorf("locking the new owner: %w", err)
	}

	owned, err := q.CountOwnedSellers(ctx, accountID)
	if err != nil {
		return fmt.Errorf("counting the new owner's sellers: %w", err)
	}

	if owned >= maxOwnedSellers {
		return ErrNewOwnerLimitReached
	}

	return nil
}
