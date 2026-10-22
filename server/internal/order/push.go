package order

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"

	"github.com/kl3inIT/second-bite/server/internal/notification"
	"github.com/kl3inIT/second-bite/server/internal/order/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// dueSoonBefore is how long before its window opens a customer is reminded
// of an order (SEC-25 decision 2); an order placed later than that is not, as
// its customer has just seen the hours.
const dueSoonBefore = 30 * time.Minute

// The pushes an order sends (SEC-25 decisions 2 and 3): to its customer, on
// the order's topic, opening the order's page; to the seller's people, on the
// seller's topic, opening the order in the store. Each says what happened to
// which dish, and when or why, and never the customer's name or phone, an
// amount or a message's text. Pushes are written in the transaction of the
// change, so a change rolled back sends nothing.

func (s *Service) pushToCustomer(ctx context.Context, tx pgx.Tx, o Order, title, body platform.Words) error {
	if s.pushes == nil {
		return nil
	}

	return s.pushes.QueuePush(ctx, tx, notification.Push{
		Topic: orderTopic(o.ID), About: o.ID, Path: "/orders/" + o.ID.String(), Title: title, Body: body,
	})
}

func (s *Service) pushToSeller(ctx context.Context, tx pgx.Tx, o Order, title, body platform.Words) error {
	if s.pushes == nil {
		return nil
	}

	return s.pushes.QueuePush(ctx, tx, notification.Push{
		Topic: sellerTopic(o.SellerID), About: o.ID,
		Path: "/stores/" + o.SellerID.String() + "/orders/" + o.ID.String(), Title: title, Body: body,
	})
}

// pushPlaced tells the seller's people of a new order.
func (s *Service) pushPlaced(ctx context.Context, tx pgx.Tx, o Order) error {
	return s.pushToSeller(ctx, tx, o,
		platform.Words{VI: "Đơn mới " + Number(o.Number), EN: "New order " + Number(o.Number)},
		platform.Words{VI: dishesOf(o).VI + " · lấy " + hoursOf(o), EN: dishesOf(o).EN + " · collect " + hoursOf(o)})
}

// pushCancelled tells the seller's people that the customer cancelled.
func (s *Service) pushCancelled(ctx context.Context, tx pgx.Tx, o Order) error {
	return s.pushToSeller(ctx, tx, o,
		platform.Words{VI: "Khách huỷ đơn " + Number(o.Number), EN: "Order " + Number(o.Number) + " was cancelled"},
		dishesOf(o))
}

// pushReady tells the customer to come.
func (s *Service) pushReady(ctx context.Context, tx pgx.Tx, o Order) error {
	end := o.WindowEnd.In(vietnam).Format("15:04")

	return s.pushToCustomer(ctx, tx, o,
		platform.Words{VI: dishesOf(o).VI + " đã sẵn sàng", EN: dishesOf(o).EN + " is ready"},
		platform.Words{VI: "Đến " + o.SellerName + " lấy trước " + end, EN: "Collect at " + o.SellerName + " by " + end})
}

// pushRefused tells the customer that the seller ended their order, and why.
func (s *Service) pushRefused(ctx context.Context, tx pgx.Tx, o Order, reason RefuseReason) error {
	why := refusalWords[reason]
	if why.VI == "" {
		why = refusalWords[RefuseOther]
	}

	return s.pushToCustomer(ctx, tx, o,
		platform.Words{VI: "Đơn " + Number(o.Number) + " đã bị huỷ", EN: "Order " + Number(o.Number) + " was cancelled"},
		platform.Words{VI: o.SellerName + ": " + why.VI, EN: o.SellerName + ": " + why.EN})
}

// pushWindowMoved tells the customer the order's new hours.
func (s *Service) pushWindowMoved(ctx context.Context, tx pgx.Tx, o Order) error {
	return s.pushToCustomer(ctx, tx, o,
		platform.Words{VI: "Giờ lấy đã đổi: " + hoursOf(o), EN: "New collection time: " + hoursOf(o)},
		platform.Words{VI: o.SellerName + " · " + dishesOf(o).VI, EN: o.SellerName + " · " + dishesOf(o).EN})
}

// pushDueSoon reminds the customer that the window opens soon.
func (s *Service) pushDueSoon(ctx context.Context, tx pgx.Tx, o Order) error {
	return s.pushToCustomer(ctx, tx, o,
		platform.Words{VI: "Sắp đến giờ lấy " + dishesOf(o).VI, EN: "Collect " + dishesOf(o).EN + " soon"},
		platform.Words{VI: o.SellerName + ", " + hoursOf(o), EN: o.SellerName + ", " + hoursOf(o)})
}

// pushMessage tells the other side that a message arrived, never its text.
func (s *Service) pushMessage(ctx context.Context, tx pgx.Tx, o Order, from Side) error {
	if from == SideCustomer {
		return s.pushToSeller(ctx, tx, o,
			platform.Words{VI: "Khách nhắn về đơn " + Number(o.Number), EN: "Message about order " + Number(o.Number)},
			platform.Words{VI: "Mở đơn để đọc và trả lời.", EN: "Open the order to read and reply."})
	}

	return s.pushToCustomer(ctx, tx, o,
		platform.Words{VI: o.SellerName + " nhắn bạn", EN: o.SellerName + " sent you a message"},
		platform.Words{VI: "Về đơn " + Number(o.Number) + ". Mở đơn để đọc.", EN: "About order " + Number(o.Number) + ". Open it to read."})
}

// refusalWords say why the seller ended an order, as the order's page says it.
var refusalWords = map[RefuseReason]platform.Words{
	RefuseNotSuitable: {VI: "món không còn phù hợp để giao", EN: "the food is no longer fit to hand over"},
	RefuseWrongItems:  {VI: "đơn bị sai món", EN: "the order had the wrong dishes"},
	RefuseNoAnswer:    {VI: "quán không liên lạc được bạn", EN: "the store could not reach you"},
	RefuseNoShow:      {VI: "bạn không đến lấy", EN: "you did not come"},
	RefuseLate:        {VI: "bạn đến quá giờ lấy", EN: "you came after the collection time"},
	RefuseSoldOut:     {VI: "món đã hết", EN: "the dish ran out"},
	RefuseOther:       {VI: "quán không giao được đơn này", EN: "the store cannot hand this order over"},
	RefuseWithdrawn:   {VI: "quán đã rút bài", EN: "the store withdrew the dish"},
}

// dishesOf names an order's first dish, and how many others it holds.
func dishesOf(o Order) platform.Words {
	if len(o.Lines) == 0 {
		return platform.Words{VI: "Đơn " + Number(o.Number), EN: "Order " + Number(o.Number)}
	}

	first := o.Lines[0].Name
	if more := len(o.Lines) - 1; more > 0 {
		return platform.Words{VI: fmt.Sprintf("%s và %d món khác", first, more), EN: fmt.Sprintf("%s and %d more", first, more)}
	}

	return platform.Words{VI: first, EN: first}
}

// hoursOf is an order's window in the pilot's time zone: 17:30–18:00.
func hoursOf(o Order) string {
	return o.WindowStart.In(vietnam).Format("15:04") + "–" + o.WindowEnd.In(vietnam).Format("15:04")
}

// readIn reads an order with its lines inside a transaction.
func (s *Service) readIn(ctx context.Context, q *db.Queries, id uuid.UUID) (Order, error) {
	row, err := q.GetOrder(ctx, id)
	if errors.Is(err, pgx.ErrNoRows) {
		return Order{}, ErrNotFound
	}

	if err != nil {
		return Order{}, fmt.Errorf("reading the order: %w", err)
	}

	orders := []Order{s.fromRow(row)}
	if err := s.withLines(ctx, q, orders); err != nil {
		return Order{}, err
	}

	return orders[0], nil
}

// RemindDueSoon reminds the customers whose orders open within dueSoonBefore,
// once each (SEC-25). An order placed after that point is marked without a
// reminder. It changes nothing a second run would not, so it may run twice.
func (s *Service) RemindDueSoon(ctx context.Context) error {
	var reminded int

	err := pgx.BeginFunc(ctx, s.pool, func(tx pgx.Tx) error {
		q := s.queries.WithTx(tx)

		now := s.now()

		due, err := q.MarkDueSoon(ctx, db.MarkDueSoonParams{Now: &now, Before: now.Add(dueSoonBefore)})
		if err != nil {
			return fmt.Errorf("marking the orders due soon: %w", err)
		}

		for _, d := range due {
			if d.CreatedAt.Add(dueSoonBefore).After(d.WindowStart) {
				continue
			}

			o, err := s.readIn(ctx, q, d.ID)
			if err != nil {
				return err
			}

			if err := s.pushDueSoon(ctx, tx, o); err != nil {
				return err
			}

			reminded++
		}

		return nil
	})
	if err != nil {
		return err
	}

	if reminded > 0 {
		s.logger.InfoContext(ctx, "customers reminded of their orders",
			slog.String("event", "order.orders.due_soon"),
			slog.Int("orders_reminded", reminded),
		)
	}

	return nil
}
