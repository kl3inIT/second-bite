package order

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"

	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// The notices pushed on the live socket name what changed with identifiers and
// numbers only, never a message's text or a name: a client reads the rest
// through the operations, which authorize it.
const (
	noticeOrder   = "order"
	noticeMessage = "message"
	noticeSeen    = "seen"
)

// orderTopic is what a connection follows to hear of one order; sellerTopic, of
// the orders of one seller. The SQL that notifies by itself builds the same
// names.
func orderTopic(id uuid.UUID) string { return "order:" + id.String() }

func sellerTopic(id uuid.UUID) string { return "seller:" + id.String() }

type orderNotice struct {
	Type    string    `json:"type"`
	OrderID uuid.UUID `json:"orderId"`
	Status  Status    `json:"status"`
}

type messageNotice struct {
	Type    string    `json:"type"`
	OrderID uuid.UUID `json:"orderId"`
	Seq     int       `json:"seq"`
	From    Side      `json:"from"`
}

type seenNotice struct {
	Type    string    `json:"type"`
	OrderID uuid.UUID `json:"orderId"`
	By      Side      `json:"by"`
	Seq     int       `json:"seq"`
}

// notifyOrder tells the sockets following an order, and its seller's orders,
// that it is now in status. It is delivered when tx commits.
func notifyOrder(ctx context.Context, tx pgx.Tx, orderID, sellerID uuid.UUID, status Status) error {
	return platform.Notify(ctx, tx, orderNotice{Type: noticeOrder, OrderID: orderID, Status: status},
		orderTopic(orderID), sellerTopic(sellerID))
}
