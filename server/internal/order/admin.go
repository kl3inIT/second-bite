package order

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/order/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// recentForAdmins is how many of a customer's latest orders admins see.
const recentForAdmins = 5

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

	if err := s.withLines(ctx, h.Recent); err != nil {
		return History{}, err
	}

	return h, nil
}
