package order

import (
	"context"
	"fmt"
	"slices"
	"strings"
	"time"
	"unicode/utf8"

	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/order/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

const (
	// recentForAdmins is how many of a customer's latest orders admins see.
	recentForAdmins = 5
	// maxAdminPageSize bounds one page of the admins' list.
	maxAdminPageSize = 100
	// maxAdminQueryRunes bounds what an admin searches for.
	maxAdminQueryRunes = 100
)

// The statuses an admin may list by.
var statuses = []Status{StatusConfirmed, StatusReady, StatusCollected, StatusCancelled, StatusRefused, StatusExpired}

// History is what a customer ordered, as admins see it on the account.
type History struct {
	Placed int
	// Collected and Missed count the orders handed over and those the
	// customer did not come for (MissedOrder); the rest are open, cancelled
	// or refused for the food.
	Collected, Missed int
	// Recent are the latest orders, newest first.
	Recent []Order
}

// HistoryForAdmins answers what the account ordered, to an admin; an
// account that never ordered, or does not exist, has none.
func (s *Service) HistoryForAdmins(ctx context.Context, accountID uuid.UUID) (History, error) {
	if _, err := platform.RequireAdmin(ctx); err != nil {
		return History{}, err
	}

	customer := uuid.NullUUID{UUID: accountID, Valid: true}

	counts, err := s.queries.CustomerOrderCounts(ctx, customer)
	if err != nil {
		return History{}, fmt.Errorf("counting the customer's orders: %w", err)
	}

	rows, err := s.queries.CustomerOrders(ctx, db.CustomerOrdersParams{CustomerID: customer, MaxRows: recentForAdmins})
	if err != nil {
		return History{}, fmt.Errorf("listing the customer's orders: %w", err)
	}

	h := History{
		Placed: int(counts.Placed), Collected: int(counts.Collected), Missed: int(counts.Missed),
		Recent: make([]Order, 0, len(rows)),
	}
	for _, r := range rows {
		h.Recent = append(h.Recent, s.fromRow(db.GetOrderRow(r)))
	}

	if err := s.withLines(ctx, s.queries, h.Recent); err != nil {
		return History{}, err
	}

	if err := s.withReviews(ctx, h.Recent); err != nil {
		return History{}, err
	}

	if err := s.withProblems(ctx, h.Recent); err != nil {
		return History{}, err
	}

	return h, nil
}

// AdminFilter is what an admin lists every seller's orders by.
type AdminFilter struct {
	// Statuses keeps the orders in them, read as fromRow reads them; all
	// when empty.
	Statuses []Status
	// Query keeps the orders whose number (SB-24831 or 24831), customer's
	// name or phone, or seller's name holds it, Vietnamese marks ignored.
	Query string
	// SellerID keeps one seller's orders; all when nil.
	SellerID uuid.UUID
	// CollectSince and CollectUntil keep the orders whose window starts in
	// [CollectSince, CollectUntil); either may be nil.
	CollectSince, CollectUntil *time.Time
	// Page counts from 1; Size runs from 1 to 100.
	Page, Size int
}

// AdminPage is one page of the admins' list, how many orders match in all,
// and how many of each status match the other filters.
type AdminPage struct {
	Orders []Order
	Total  int
	Counts map[Status]int
}

// ListForAdmins answers one page of every seller's orders matching f, to an
// admin, the latest window first (SEC-135). Admins read orders and never act
// for a seller.
func (s *Service) ListForAdmins(ctx context.Context, f AdminFilter) (AdminPage, error) {
	if _, err := platform.RequireAdmin(ctx); err != nil {
		return AdminPage{}, err
	}

	params, err := f.params()
	if err != nil {
		return AdminPage{}, err
	}

	rows, err := s.queries.OrdersForAdmins(ctx, params)
	if err != nil {
		return AdminPage{}, fmt.Errorf("listing the orders: %w", err)
	}

	total, err := s.queries.CountOrdersForAdmins(ctx, db.CountOrdersForAdminsParams{
		Statuses: params.Statuses, Query: params.Query, SellerID: params.SellerID,
		CollectSince: params.CollectSince, CollectUntil: params.CollectUntil,
	})
	if err != nil {
		return AdminPage{}, fmt.Errorf("counting the orders: %w", err)
	}

	counts, err := s.queries.CountOrdersByStatus(ctx, db.CountOrdersByStatusParams{
		Query: params.Query, SellerID: params.SellerID, CollectSince: params.CollectSince, CollectUntil: params.CollectUntil,
	})
	if err != nil {
		return AdminPage{}, fmt.Errorf("counting the orders by status: %w", err)
	}

	page := AdminPage{
		Orders: make([]Order, 0, len(rows)), Total: int(total),
		Counts: map[Status]int{
			StatusConfirmed: int(counts.Confirmed), StatusReady: int(counts.Ready), StatusCollected: int(counts.Collected),
			StatusCancelled: int(counts.Cancelled), StatusRefused: int(counts.Refused), StatusExpired: int(counts.Expired),
		},
	}

	for _, r := range rows {
		page.Orders = append(page.Orders, s.fromRow(db.GetOrderRow(r)))
	}

	if err := s.withLines(ctx, s.queries, page.Orders); err != nil {
		return AdminPage{}, err
	}

	if err := s.withReviews(ctx, page.Orders); err != nil {
		return AdminPage{}, err
	}

	if err := s.withProblems(ctx, page.Orders); err != nil {
		return AdminPage{}, err
	}

	return page, nil
}

func (f AdminFilter) params() (db.OrdersForAdminsParams, error) {
	if f.Page < 1 || f.Size < 1 || f.Size > maxAdminPageSize {
		return db.OrdersForAdminsParams{}, ErrAdminListInvalid
	}

	query := strings.TrimSpace(f.Query)
	if utf8.RuneCountInString(query) > maxAdminQueryRunes {
		return db.OrdersForAdminsParams{}, ErrAdminListInvalid
	}

	if f.CollectSince != nil && f.CollectUntil != nil && !f.CollectSince.Before(*f.CollectUntil) {
		return db.OrdersForAdminsParams{}, ErrAdminListInvalid
	}

	wanted := make([]string, 0, len(f.Statuses))

	for _, st := range f.Statuses {
		if !slices.Contains(statuses, st) {
			return db.OrdersForAdminsParams{}, ErrAdminListInvalid
		}

		wanted = append(wanted, string(st))
	}

	return db.OrdersForAdminsParams{
		Statuses:     wanted,
		Query:        escapeLike(query),
		SellerID:     uuid.NullUUID{UUID: f.SellerID, Valid: f.SellerID != uuid.Nil},
		CollectSince: f.CollectSince,
		CollectUntil: f.CollectUntil,
		MaxRows:      int32(f.Size),
		SkipRows:     int32((f.Page - 1) * f.Size), //nolint:gosec // a page past int32 finds nothing anyway
	}, nil
}

// escapeLike makes the characters LIKE reads as patterns plain.
func escapeLike(s string) string {
	return strings.NewReplacer(`\`, `\\`, `%`, `\%`, `_`, `\_`).Replace(s)
}
