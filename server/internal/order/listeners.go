package order

import (
	"context"
	"fmt"
	"log/slog"

	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/offer"
	"github.com/kl3inIT/second-bite/server/internal/order/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// RegisterListeners makes the module follow the events of the modules it
// depends on.
func RegisterListeners(events *platform.Events, s *Service) {
	platform.Listen(events, "order.follow_offer_window", s.FollowOfferWindow)
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
