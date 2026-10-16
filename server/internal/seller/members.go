package seller

import (
	"context"
	"fmt"
	"log/slog"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"

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
