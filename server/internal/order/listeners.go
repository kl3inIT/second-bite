package order

import (
	"context"
	"fmt"
	"log/slog"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"

	"github.com/kl3inIT/second-bite/server/internal/offer"
	"github.com/kl3inIT/second-bite/server/internal/order/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// RegisterListeners makes the module follow the events of the modules it
// depends on.
func RegisterListeners(events *platform.Events, s *Service) {
	platform.Listen(events, "order.follow_offer_window", s.FollowOfferWindow)
	platform.Listen(events, "order.refuse_withdrawn_offer", s.RefuseWithdrawnOffer)
}

// RegisterSchedules makes the module run what it does on the clock.
func RegisterSchedules(events *platform.Events, s *Service) {
	events.Every("order.expire_ended", time.Minute, s.ExpireEnded)
}

// ExpireEnded expires the orders still to collect whose window is over, each
// with an event (SEC-96). An order reads as expired the moment its window ends,
// since reads compare the window; this keeps the table in step, so a report on
// it, and later a message to the customer, can follow. It changes nothing a
// second run would not, so it may run twice.
func (s *Service) ExpireEnded(ctx context.Context) error {
	expired, err := s.queries.ExpireEnded(ctx)
	if err != nil {
		return fmt.Errorf("expiring the ended orders: %w", err)
	}

	if expired > 0 {
		s.logger.InfoContext(ctx, "ended orders expired",
			slog.String("event", "order.orders.expired"),
			slog.Int64("orders_expired", expired),
		)
	}

	return nil
}

// RefuseWithdrawnOffer ends the orders still to collect that hold units of an
// offer the seller withdrew (SEC-108): each is refused as withdrawn, so the
// customer reads why, and the units it held of the seller's other offers go
// back to them. An order already ended stays as it was, so the same event
// delivered twice changes nothing more.
func (s *Service) RefuseWithdrawnOffer(ctx context.Context, e offer.WithdrawnEvent) error {
	ids, err := s.queries.OpenOrdersOfOffer(ctx, e.OfferID)
	if err != nil {
		return fmt.Errorf("reading the offer's orders: %w", err)
	}

	for _, id := range ids {
		err := s.transition(ctx, id, func(q *db.Queries, tx pgx.Tx, o Order) error {
			if !o.Status.open() {
				return nil
			}

			if err := q.MarkRefused(ctx, db.MarkRefusedParams{ID: id, RefuseReason: textOf(string(RefuseWithdrawn))}); err != nil {
				return fmt.Errorf("refusing the order: %w", err)
			}

			for _, l := range o.Lines {
				if l.OfferID == e.OfferID {
					continue
				}

				if err := s.offers.Return(ctx, tx, l.OfferID, l.Units); err != nil {
					return err
				}
			}

			return q.InsertEvent(ctx, db.InsertEventParams{OrderID: id, Kind: "refused"})
		})
		if err != nil {
			return err
		}
	}

	if len(ids) > 0 {
		s.logger.InfoContext(ctx, "orders of a withdrawn offer refused",
			slog.String("event", "order.orders.refused_withdrawn"),
			slog.String("offer_id", e.OfferID.String()),
			slog.Int("orders_refused", len(ids)),
		)
	}

	return nil
}

// FollowOfferWindow moves the orders still to collect to the new window of an
// offer they hold units of (SEC-91): the window an order has is the part all
// its offers' windows share, read again from the offers, so the same event
// delivered twice changes nothing more. An order whose offers no longer share
// a time keeps the window it had, and the seller serves or refuses it at the
// counter. Orders handed over, cancelled or refused are history and stay.
func (s *Service) FollowOfferWindow(ctx context.Context, e offer.WindowChangedEvent) error {
	ids, err := s.queries.OpenOrdersOfOffer(ctx, e.OfferID)
	if err != nil {
		return fmt.Errorf("reading the offer's orders: %w", err)
	}

	if len(ids) == 0 {
		return nil
	}

	lines, err := s.queries.LinesOf(ctx, ids)
	if err != nil {
		return fmt.Errorf("reading the orders' lines: %w", err)
	}

	offerIDs := make([]uuid.UUID, 0, len(lines))
	byOrder := make(map[uuid.UUID][]uuid.UUID, len(ids))

	for _, l := range lines {
		offerIDs = append(offerIDs, l.OfferID)
		byOrder[l.OrderID] = append(byOrder[l.OrderID], l.OfferID)
	}

	windows, err := s.offers.WindowsOf(ctx, offerIDs)
	if err != nil {
		return err
	}

	moved := 0

	for _, id := range ids {
		var start, end offer.Window

		for i, offerID := range byOrder[id] {
			w, ok := windows[offerID]
			if !ok {
				continue
			}

			if i == 0 {
				start, end = w, w
				continue
			}

			start.Start, end.End = later(start.Start, w.Start), earlier(end.End, w.End)
		}

		if !end.End.After(start.Start) {
			s.logger.WarnContext(ctx, "order window kept",
				slog.String("event", "order.order.window_kept"),
				slog.String("order_id", id.String()),
				slog.String("offer_id", e.OfferID.String()),
			)

			continue
		}

		if err := s.queries.SetWindow(ctx, db.SetWindowParams{ID: id, WindowStart: start.Start, WindowEnd: end.End}); err != nil {
			return fmt.Errorf("moving the order's window: %w", err)
		}

		moved++
	}

	s.logger.InfoContext(ctx, "orders followed their offer's window",
		slog.String("event", "order.orders.window_followed"),
		slog.String("offer_id", e.OfferID.String()),
		slog.Int("orders_moved", moved),
	)

	return nil
}
