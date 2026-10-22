package seller

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"slices"
	"strings"
	"time"
	"unicode"
	"unicode/utf8"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"

	"github.com/kl3inIT/second-bite/server/internal/audit"
	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/seller/internal/db"
)

const (
	// maxPageSize bounds one page of the admins' list.
	maxPageSize = 100
	// maxQueryRunes bounds what an admin searches for.
	maxQueryRunes = 100
	// The bounds of a reason, as the table checks the upper one.
	minReasonRunes = 10
	maxReasonRunes = 500
)

// The statuses an admin may list.
var statuses = []Status{StatusPending, StatusActive, StatusRejected, StatusBlocked}

// Filter is what an admin lists sellers by.
type Filter struct {
	// Statuses keeps the sellers in these; all when empty.
	Statuses []Status
	// Query keeps the sellers whose name, address or phone holds it, marks
	// ignored.
	Query string
	// ChangedSince and ChangedUntil keep the sellers last changed in
	// [ChangedSince, ChangedUntil); either may be nil.
	ChangedSince, ChangedUntil *time.Time
	// Sort orders the page: one of sorts, empty for the queue order.
	Sort string
	// Page counts from 1; Size runs from 1 to 100.
	Page, Size int
}

// The orders an admin may sort by; a leading '-' is descending.
var sorts = []string{"", "name", "-name", "address", "-address", "changed", "-changed"}

// Listed is a seller as admins list it, with its owner's address.
type Listed struct {
	Seller
	// OwnerEmail is empty when the owner deleted their account.
	OwnerEmail string
}

// Page is one page of the admins' list, how many sellers match in all, how
// many of each status match the words, and how many stood in each status on
// each of the last days, whatever the filters.
type Page struct {
	Sellers []Listed
	Total   int
	Counts  map[Status]int
	Days    []StatusDay
}

// List answers one page of the sellers matching f, to an admin: pending
// ones first, the oldest first, then the latest change first.
func (s *Service) List(ctx context.Context, f Filter) (Page, error) {
	if _, err := platform.RequireAdmin(ctx); err != nil {
		return Page{}, err
	}

	params, err := f.params()
	if err != nil {
		return Page{}, err
	}

	rows, err := s.queries.SellersForAdmins(ctx, params)
	if err != nil {
		return Page{}, fmt.Errorf("listing the sellers: %w", err)
	}

	page := Page{Sellers: make([]Listed, 0, len(rows))}

	if len(rows) > 0 {
		page.Total = int(rows[0].Total)
	} else if params.SkipRows > 0 {
		// Past the end the window counts nothing; the total is still asked.
		total, err := s.queries.CountSellersForAdmins(ctx, db.CountSellersForAdminsParams{
			Statuses: params.Statuses, Query: params.Query,
			ChangedSince: params.ChangedSince, ChangedUntil: params.ChangedUntil,
		})
		if err != nil {
			return Page{}, fmt.Errorf("counting the sellers: %w", err)
		}

		page.Total = int(total)
	}

	if page.Counts, err = s.statusCounts(ctx, params); err != nil {
		return Page{}, err
	}

	if page.Days, err = s.statusDays(ctx, trendDays); err != nil {
		return Page{}, err
	}

	owners, err := s.ownerEmails(ctx, rows)
	if err != nil {
		return Page{}, err
	}

	for _, r := range rows {
		page.Sellers = append(page.Sellers, Listed{
			Seller: fromRow(db.GetSellerRow{
				ID: r.ID, Name: r.Name, Address: r.Address, Latitude: r.Latitude, Longitude: r.Longitude, Phone: r.Phone,
				Status: r.Status, StatusReason: r.StatusReason, StatusChangedAt: r.StatusChangedAt,
				StatusChangedBy: r.StatusChangedBy, CreatedAt: r.CreatedAt, UpdatedAt: r.UpdatedAt, PhotoID: r.PhotoID,
			}, ""),
			OwnerEmail: owners[r.ID],
		})
	}

	return page, nil
}

// statusCounts counts the sellers of each status matching the words and the
// time of the last change of params; a status none has counts 0.
func (s *Service) statusCounts(ctx context.Context, params db.SellersForAdminsParams) (map[Status]int, error) {
	rows, err := s.queries.CountSellersByStatus(ctx, db.CountSellersByStatusParams{
		Query: params.Query, ChangedSince: params.ChangedSince, ChangedUntil: params.ChangedUntil,
	})
	if err != nil {
		return nil, fmt.Errorf("counting the sellers by status: %w", err)
	}

	counts := make(map[Status]int, len(statuses))
	for _, st := range statuses {
		counts[st] = 0
	}

	for _, r := range rows {
		counts[Status(r.Status)] = int(r.Sellers)
	}

	return counts, nil
}

func (f Filter) params() (db.SellersForAdminsParams, error) {
	if f.Page < 1 || f.Size < 1 || f.Size > maxPageSize || !slices.Contains(sorts, f.Sort) {
		return db.SellersForAdminsParams{}, ErrListInvalid
	}

	query := strings.TrimSpace(f.Query)
	if utf8.RuneCountInString(query) > maxQueryRunes {
		return db.SellersForAdminsParams{}, ErrListInvalid
	}

	if f.ChangedSince != nil && f.ChangedUntil != nil && !f.ChangedSince.Before(*f.ChangedUntil) {
		return db.SellersForAdminsParams{}, ErrListInvalid
	}

	wanted := make([]string, 0, len(f.Statuses))

	for _, st := range f.Statuses {
		if !slices.Contains(statuses, st) {
			return db.SellersForAdminsParams{}, ErrListInvalid
		}

		wanted = append(wanted, string(st))
	}

	return db.SellersForAdminsParams{
		Statuses:     wanted,
		Query:        escapeLike(query),
		ChangedSince: f.ChangedSince,
		ChangedUntil: f.ChangedUntil,
		Sort:         f.Sort,
		MaxRows:      int32(f.Size),
		SkipRows:     int32((f.Page - 1) * f.Size), //nolint:gosec // a page past int32 finds nothing anyway
	}, nil
}

// escapeLike makes the characters LIKE reads as patterns plain.
func escapeLike(s string) string {
	return strings.NewReplacer(`\`, `\\`, `%`, `\%`, `_`, `\_`).Replace(s)
}

// ownerEmails answers the address of each listed seller's owner.
func (s *Service) ownerEmails(ctx context.Context, rows []db.SellersForAdminsRow) (map[uuid.UUID]string, error) {
	sellerIDs := make([]uuid.UUID, 0, len(rows))
	for _, r := range rows {
		sellerIDs = append(sellerIDs, r.ID)
	}

	owners, err := s.queries.OwnersOf(ctx, sellerIDs)
	if err != nil {
		return nil, fmt.Errorf("reading the owners: %w", err)
	}

	accountIDs := make([]uuid.UUID, 0, len(owners))
	for _, o := range owners {
		accountIDs = append(accountIDs, o.AccountID)
	}

	accounts, err := s.accounts.Accounts(ctx, accountIDs)
	if err != nil {
		return nil, err
	}

	emails := make(map[uuid.UUID]string, len(owners))
	for _, o := range owners {
		emails[o.SellerID] = accounts[o.AccountID].Email
	}

	return emails, nil
}

// Approve lets a pending, rejected or blocked seller publish, for an admin,
// and tells its owner. A seller whose owner deleted their account has no one
// to run it, so it stays as it is (ErrOwnerless).
func (s *Service) Approve(ctx context.Context, id uuid.UUID) (Seller, error) {
	return s.changeStatus(ctx, id, StatusActive, []Status{StatusPending, StatusRejected, StatusBlocked}, "",
		func(was Status) audit.Action {
			if was == StatusBlocked {
				return audit.SellerUnblocked{}
			}

			return audit.SellerApproved{}
		})
}

// Reject refuses a pending seller, for an admin, telling its owner why.
func (s *Service) Reject(ctx context.Context, id uuid.UUID, reason string) (Seller, error) {
	reason, err := normalizedReason(reason)
	if err != nil {
		return Seller{}, err
	}

	return s.changeStatus(ctx, id, StatusRejected, []Status{StatusPending}, reason,
		func(Status) audit.Action { return audit.SellerRejected{Reason: reason} })
}

// Block stops an active seller from publishing and showing, for an admin,
// telling its owner why.
func (s *Service) Block(ctx context.Context, id uuid.UUID, reason string) (Seller, error) {
	reason, err := normalizedReason(reason)
	if err != nil {
		return Seller{}, err
	}

	return s.changeStatus(ctx, id, StatusBlocked, []Status{StatusActive}, reason,
		func(Status) audit.Action { return audit.SellerBlocked{Reason: reason} })
}

// normalizedReason trims a reason and checks its length; line breaks are
// kept, other control characters refused.
func normalizedReason(reason string) (string, error) {
	reason = strings.TrimSpace(strings.ReplaceAll(reason, "\r\n", "\n"))

	n := utf8.RuneCountInString(reason)
	if n < minReasonRunes || n > maxReasonRunes || !utf8.ValidString(reason) ||
		strings.ContainsFunc(reason, func(r rune) bool { return unicode.IsControl(r) && r != '\n' }) {
		return "", ErrReasonInvalid
	}

	return reason, nil
}

// changeStatus moves the seller to status when it stands in one of from, in
// one transaction with its audit event and the event that tells its owner.
func (s *Service) changeStatus(
	ctx context.Context, id uuid.UUID, status Status, from []Status, reason string, action func(was Status) audit.Action,
) (Seller, error) {
	caller, err := platform.RequireAdmin(ctx)
	if err != nil {
		return Seller{}, err
	}

	fromStatuses := make([]string, 0, len(from))
	for _, f := range from {
		fromStatuses = append(fromStatuses, string(f))
	}

	var was Status

	err = pgx.BeginFunc(ctx, s.pool, func(tx pgx.Tx) error {
		q := s.queries.WithTx(tx)

		if status == StatusActive {
			if err := ownerPresent(ctx, q, id); err != nil {
				return err
			}
		}

		left, err := q.ChangeStatus(ctx, db.ChangeStatusParams{
			ID: id, Status: string(status), FromStatuses: fromStatuses,
			Reason:    pgtype.Text{String: reason, Valid: reason != ""},
			ChangedBy: uuid.NullUUID{UUID: caller.AccountID, Valid: true},
		})
		if errors.Is(err, pgx.ErrNoRows) {
			return s.refusedChange(ctx, q, id)
		}

		if err != nil {
			return fmt.Errorf("changing the status: %w", err)
		}

		was = Status(left)

		row, err := q.GetSeller(ctx, id)
		if err != nil {
			return fmt.Errorf("reading the seller: %w", err)
		}

		if err := s.trail.Record(ctx, tx,
			audit.Resource{Type: audit.ResourceSeller, ID: id.String(), Label: row.Name}, action(was)); err != nil {
			return err
		}

		if err := recordStatusDay(ctx, q); err != nil {
			return err
		}

		return platform.Publish(ctx, tx, s.events, StatusChangedEvent{SellerID: id, Status: status})
	})
	if err != nil {
		return Seller{}, err
	}

	s.logger.InfoContext(ctx, "seller status changed",
		slog.String("event", "seller.status.changed"),
		slog.String("seller_id", id.String()),
		slog.String("from", string(was)),
		slog.String("to", string(status)),
		slog.String("by_account_id", caller.AccountID.String()),
	)

	return s.Get(ctx, id)
}

// ownerPresent refuses to activate a seller left without an owner when the
// owner deleted their account (SEC-65). It locks the seller's row first, so an
// owner's deletion either commits before the owner is read or blocks the seller
// again after this transaction.
func ownerPresent(ctx context.Context, q *db.Queries, id uuid.UUID) error {
	if err := q.LockSeller(ctx, id); err != nil {
		return fmt.Errorf("locking the seller: %w", err)
	}

	has, err := q.HasOwner(ctx, id)
	if err != nil {
		return fmt.Errorf("reading the seller's owner: %w", err)
	}

	if has {
		return nil
	}

	exists, err := q.SellerExists(ctx, id)
	if err != nil {
		return fmt.Errorf("reading the seller: %w", err)
	}

	if !exists {
		return ErrNotFound
	}

	return ErrOwnerless
}

// refusedChange tells a seller that does not exist from one in another state.
func (s *Service) refusedChange(ctx context.Context, q *db.Queries, id uuid.UUID) error {
	exists, err := q.SellerExists(ctx, id)
	if err != nil {
		return fmt.Errorf("reading the seller: %w", err)
	}

	if !exists {
		return ErrNotFound
	}

	return ErrStatusChangeNotAllowed
}

// Membership is a seller an account owns or works at, as admins see it.
type Membership struct {
	AccountID    uuid.UUID
	Role         Role
	SellerID     uuid.UUID
	SellerName   string
	SellerStatus Status
}

// MembershipsForAdmins answers the sellers each account owns or works at,
// owners first, to an admin; at most maxPageSize accounts at once.
func (s *Service) MembershipsForAdmins(ctx context.Context, accountIDs []uuid.UUID) ([]Membership, error) {
	if _, err := platform.RequireAdmin(ctx); err != nil {
		return nil, err
	}

	if len(accountIDs) > maxPageSize {
		return nil, ErrListInvalid
	}

	rows, err := s.queries.MembershipsOfAccounts(ctx, accountIDs)
	if err != nil {
		return nil, fmt.Errorf("reading the memberships: %w", err)
	}

	memberships := make([]Membership, 0, len(rows))
	for _, r := range rows {
		memberships = append(memberships, Membership{
			AccountID: r.AccountID, Role: Role(r.Role), SellerID: r.ID, SellerName: r.Name, SellerStatus: Status(r.Status),
		})
	}

	return memberships, nil
}
