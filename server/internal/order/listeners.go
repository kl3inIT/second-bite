package order

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"

	"github.com/kl3inIT/second-bite/server/internal/identity"
	"github.com/kl3inIT/second-bite/server/internal/offer"
	"github.com/kl3inIT/second-bite/server/internal/order/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/seller"
)

// RegisterListeners makes the module follow the events of the modules it
// depends on.
func RegisterListeners(events *platform.Events, s *Service) {
	platform.Listen(events, "order.follow_offer_window", s.FollowOfferWindow)
	platform.Listen(events, "order.refuse_withdrawn_offer", s.RefuseWithdrawnOffer)
	platform.Listen(events, "order.forget_account", s.forgetAccount)
	platform.Listen(events, "order.follow_seller_location", s.FollowSellerLocation)
}

// FollowSellerLocation copies a seller's moved collection point onto its
// orders still to collect (SEC-66), so a customer on the way reads where the
// seller now is, and tells the sockets following them. The point is read as it
// stands, so the same event delivered twice, or two moves delivered out of
// order, end on the seller's current point. Orders handed over, cancelled,
// refused or expired are history and keep what they copied.
func (s *Service) FollowSellerLocation(ctx context.Context, e seller.LocationChangedEvent) error {
	point, err := s.sellers.CollectionPointOf(ctx, e.SellerID)
	if errors.Is(err, seller.ErrNotFound) {
		return nil
	}

	if err != nil {
		return err
	}

	moved, err := s.queries.MoveSellerOrders(ctx, db.MoveSellerOrdersParams{
		SellerID: e.SellerID, Latitude: point.Latitude, Longitude: point.Longitude, Address: point.Address,
	})
	if err != nil {
		return fmt.Errorf("moving the seller's orders: %w", err)
	}

	s.logger.InfoContext(ctx, "orders followed their seller's location",
		slog.String("event", "order.orders.location_followed"),
		slog.String("seller_id", e.SellerID.String()),
		slog.Int64("orders_moved", moved),
	)

	return nil
}

// RegisterSchedules makes the module run what it does on the clock.
func RegisterSchedules(events *platform.Events, s *Service) {
	events.Every("order.expire_ended", time.Minute, s.ExpireEnded)
	events.Every("order.purge_live_tickets", liveTicketPurgeEvery, s.PurgeLiveTickets)
	events.Every("order.forget_old_chats", 24*time.Hour, s.ForgetOldChats)
	events.Every("order.remind_due_soon", time.Minute, s.RemindDueSoon)
	events.Every("order.finish_seller_deletions", time.Minute, s.FinishSellerDeletions)
}

// FinishSellerDeletions deletes the sellers admins deleted once none of their
// orders is left to finish: while one may still be handed over or opened again,
// the seller, blocked, waits, so its customers still collect what they ordered.
// A seller restored meanwhile no longer waits; running it twice changes nothing
// more.
func (s *Service) FinishSellerDeletions(ctx context.Context) error {
	ids, err := s.sellers.AwaitingDeletion(ctx)
	if err != nil {
		return err
	}

	for _, id := range ids {
		busy, err := s.queries.SellerHasOrdersToFinish(ctx, id)
		if err != nil {
			return fmt.Errorf("reading the seller's orders: %w", err)
		}

		if busy {
			continue
		}

		if err := s.sellers.FinishDeletion(ctx, id); err != nil {
			return err
		}
	}

	return nil
}

// liveTicketPurgeEvery is how often the tickets that expired unspent are deleted.
const liveTicketPurgeEvery = 10 * time.Minute

// chatKept is how long a chat is kept after its order's window ends.
const chatKept = 30 * 24 * time.Hour

// ForgetOldChats deletes the chats, with their messages, of the orders whose
// window ended more than chatKept ago: a chat is about collecting one order and
// holds personal free text, while the order and its events are kept. It changes
// nothing a second run would not, so it may run twice.
func (s *Service) ForgetOldChats(ctx context.Context) error {
	forgotten, err := s.queries.DeleteChatsEndedBefore(ctx, s.now().Add(-chatKept))
	if err != nil {
		return fmt.Errorf("forgetting the old chats: %w", err)
	}

	if forgotten > 0 {
		s.logger.InfoContext(ctx, "old chats forgotten",
			slog.String("event", "order.chats.forgotten_old"),
			slog.Int64("chats_forgotten", forgotten),
		)
	}

	return nil
}

// forgetAccount deletes the chats of the orders a deleted account placed, as
// its favourites and memberships go with it (SEC-37), and takes its name and
// phone number off those orders, which the store and the reports keep without
// them (SEC-165). A message stores its side and not the staff member who wrote
// it, so a staff account's deletion leaves nothing to remove. Running it again
// changes nothing more.
func (s *Service) forgetAccount(ctx context.Context, e identity.AccountDeletedEvent) error {
	customer := uuid.NullUUID{UUID: e.AccountID, Valid: true}

	forgotten, err := s.queries.DeleteChatsOfCustomer(ctx, customer)
	if err != nil {
		return fmt.Errorf("forgetting the account's chats: %w", err)
	}

	contacts, err := s.queries.ForgetContactsOfCustomer(ctx, customer)
	if err != nil {
		return fmt.Errorf("forgetting the account's name and phone number on its orders: %w", err)
	}

	s.logger.InfoContext(ctx, "deleted account's chats and contacts forgotten",
		slog.String("event", "order.account.forgotten"),
		slog.String("account_id", e.AccountID.String()),
		slog.Int64("chats_forgotten", forgotten),
		slog.Int64("contacts_forgotten", contacts),
	)

	return nil
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

			if err := q.InsertEvent(ctx, db.InsertEventParams{OrderID: id, Kind: "refused"}); err != nil {
				return err
			}

			if err := s.pushRefused(ctx, tx, o, RefuseWithdrawn); err != nil {
				return err
			}

			return notifyOrder(ctx, tx, id, o.SellerID, StatusRefused)
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

		changed, err := s.moveWindow(ctx, id, start.Start, end.End)
		if err != nil {
			return err
		}

		if changed {
			moved++
		}
	}

	s.logger.InfoContext(ctx, "orders followed their offer's window",
		slog.String("event", "order.orders.window_followed"),
		slog.String("offer_id", e.OfferID.String()),
		slog.Int("orders_moved", moved),
	)

	return nil
}

// moveWindow moves one order to a new window and tells its customer the new
// hours, in one transaction; an order that ended, or already has the window,
// stays as it was and hears nothing.
func (s *Service) moveWindow(ctx context.Context, id uuid.UUID, start, end time.Time) (bool, error) {
	var changed bool

	err := pgx.BeginFunc(ctx, s.pool, func(tx pgx.Tx) error {
		q := s.queries.WithTx(tx)

		n, err := q.SetWindow(ctx, db.SetWindowParams{ID: id, WindowStart: start, WindowEnd: end})
		if err != nil {
			return fmt.Errorf("moving the order's window: %w", err)
		}

		if changed = n > 0; !changed {
			return nil
		}

		o, err := s.readIn(ctx, q, id)
		if err != nil {
			return err
		}

		return s.pushWindowMoved(ctx, tx, o)
	})

	return changed, err
}
