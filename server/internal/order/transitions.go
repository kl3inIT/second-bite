package order

import (
	"cmp"
	"context"
	"errors"
	"fmt"
	"log/slog"
	"slices"
	"strings"
	"unicode/utf8"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"

	"github.com/kl3inIT/second-bite/server/internal/order/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// Cancel cancels an order for its customer, signed in or holding its access,
// free of charge until its window opens, and gives its units back to their
// offers in the same transaction.
func (s *Service) Cancel(ctx context.Context, id uuid.UUID, access, reason string) (Order, error) {
	caller, signedIn := platform.CallerFrom(ctx)

	reason = strings.TrimSpace(reason)
	if utf8.RuneCountInString(reason) > 200 {
		reason = string([]rune(reason)[:200])
	}

	err := s.transition(ctx, id, func(q *db.Queries, tx pgx.Tx, o Order) error {
		if !s.isCustomer(ctx, o, access) {
			return ErrNotFound
		}

		if !o.Status.open() || !s.now().Before(o.WindowStart) {
			return ErrCancelTooLate
		}

		if err := q.MarkCancelled(ctx, db.MarkCancelledParams{ID: id, CancelReason: reason}); err != nil {
			return fmt.Errorf("cancelling the order: %w", err)
		}

		for _, l := range o.Lines {
			if err := s.offers.Return(ctx, tx, l.OfferID, l.Units); err != nil {
				return err
			}
		}

		if err := q.InsertEvent(ctx, db.InsertEventParams{
			OrderID: id, Kind: "cancelled", ActorID: uuid.NullUUID{UUID: caller.AccountID, Valid: signedIn},
		}); err != nil {
			return err
		}

		return notifyOrder(ctx, tx, id, o.SellerID, StatusCancelled)
	})
	if err != nil {
		return Order{}, err
	}

	s.logged(ctx, "order cancelled", "order.order.cancelled", id, caller)

	return s.Get(ctx, id, access)
}

// Ready marks an order ready for collection, which tells its customer to come.
// Marking it ready again changes nothing.
func (s *Service) Ready(ctx context.Context, id uuid.UUID) (Order, error) {
	caller, err := s.staffOf(ctx, id)
	if err != nil {
		return Order{}, err
	}

	err = s.transition(ctx, id, func(q *db.Queries, tx pgx.Tx, o Order) error {
		switch o.Status {
		case StatusReady:
			return nil
		case StatusConfirmed:
		case StatusCollected, StatusCancelled, StatusRefused, StatusExpired:
			return ErrTransitionNotAllowed
		}

		if err := q.MarkReady(ctx, id); err != nil {
			return fmt.Errorf("marking the order ready: %w", err)
		}

		if err := q.InsertEvent(ctx, db.InsertEventParams{OrderID: id, Kind: "ready", ActorID: actor(caller)}); err != nil {
			return err
		}

		return notifyOrder(ctx, tx, id, o.SellerID, StatusReady)
	})
	if err != nil {
		return Order{}, err
	}

	s.logged(ctx, "order ready", "order.order.ready", id, caller)

	return s.Get(ctx, id, "")
}

// HandOver hands an order over within its window, once staff have matched the
// collector to it by its QR code or by the name and phone number on it.
func (s *Service) HandOver(ctx context.Context, id uuid.UUID) (Order, error) {
	caller, err := s.staffOf(ctx, id)
	if err != nil {
		return Order{}, err
	}

	err = s.transition(ctx, id, func(q *db.Queries, tx pgx.Tx, o Order) error {
		switch {
		case !o.Status.open():
			return ErrTransitionNotAllowed
		case s.now().Before(o.WindowStart):
			return ErrOutsideWindow
		}

		if err := q.MarkCollected(ctx, id); err != nil {
			return fmt.Errorf("handing the order over: %w", err)
		}

		if err := q.InsertEvent(ctx, db.InsertEventParams{OrderID: id, Kind: "collected", ActorID: actor(caller)}); err != nil {
			return err
		}

		return notifyOrder(ctx, tx, id, o.SellerID, StatusCollected)
	})
	if err != nil {
		return Order{}, err
	}

	s.logged(ctx, "order collected", "order.collection.confirmed", id, caller)

	return s.Get(ctx, id, "")
}

// Reopen takes a mistaken hand-over or refusal back: the order is open again,
// and the units a refusal had returned are taken again, or the call fails when
// they are gone. An order its customer cancelled stays cancelled, and so does
// one whose window is over.
func (s *Service) Reopen(ctx context.Context, id uuid.UUID) (Order, error) {
	caller, err := s.staffOf(ctx, id)
	if err != nil {
		return Order{}, err
	}

	err = s.transition(ctx, id, func(q *db.Queries, tx pgx.Tx, o Order) error {
		if (o.Status != StatusCollected && o.Status != StatusRefused) || !o.WindowEnd.After(s.now()) ||
			o.RefuseReason == RefuseWithdrawn {
			return ErrTransitionNotAllowed
		}

		if o.Status == StatusRefused && o.RefuseReason.foodKept() {
			// One order of identifiers, so two orders sharing offers never wait on each other's rows.
			lines := slices.SortedFunc(slices.Values(o.Lines), func(a, b Line) int {
				return cmp.Compare(a.OfferID.String(), b.OfferID.String())
			})

			for _, l := range lines {
				if _, err := s.offers.Take(ctx, tx, l.OfferID, l.Units); err != nil {
					return takeFailure(err)
				}
			}
		}

		if err := q.MarkReopened(ctx, id); err != nil {
			return fmt.Errorf("reopening the order: %w", err)
		}

		if err := q.InsertEvent(ctx, db.InsertEventParams{OrderID: id, Kind: "reopened", ActorID: actor(caller)}); err != nil {
			return err
		}

		return notifyOrder(ctx, tx, id, o.SellerID, StatusConfirmed)
	})
	if err != nil {
		return Order{}, err
	}

	s.logged(ctx, "order reopened", "order.order.reopened", id, caller)

	return s.Get(ctx, id, "")
}

// Refuse ends an order staff will not hand over: the food is no longer
// suitable, the order is wrong, the customer did not answer or come, or the
// food ran out. Its units go back to their offers when the customer did not
// come, and are not offered again otherwise.
func (s *Service) Refuse(ctx context.Context, id uuid.UUID, reason RefuseReason, note string) (Order, error) {
	note = strings.TrimSpace(note)
	if !reason.valid() || utf8.RuneCountInString(note) > 200 {
		return Order{}, ErrRefusalInvalid
	}

	caller, err := s.staffOf(ctx, id)
	if err != nil {
		return Order{}, err
	}

	err = s.transition(ctx, id, func(q *db.Queries, tx pgx.Tx, o Order) error {
		if !o.Status.open() {
			return ErrTransitionNotAllowed
		}

		if err := q.MarkRefused(ctx, db.MarkRefusedParams{ID: id, RefuseReason: textOf(string(reason)), RefuseNote: note}); err != nil {
			return fmt.Errorf("refusing the order: %w", err)
		}

		if reason.foodKept() {
			for _, l := range o.Lines {
				if err := s.offers.Return(ctx, tx, l.OfferID, l.Units); err != nil {
					return err
				}
			}
		}

		if err := q.InsertEvent(ctx, db.InsertEventParams{OrderID: id, Kind: "refused", ActorID: actor(caller)}); err != nil {
			return err
		}

		return notifyOrder(ctx, tx, id, o.SellerID, StatusRefused)
	})
	if err != nil {
		return Order{}, err
	}

	s.logged(ctx, "order refused", "order.order.refused", id, caller)

	return s.Get(ctx, id, "")
}

// staffOf returns the caller when they are one of the order's seller's people;
// anyone else, admins included, does not act on it.
func (s *Service) staffOf(ctx context.Context, id uuid.UUID) (platform.Caller, error) {
	caller, err := platform.RequireCaller(ctx)
	if err != nil {
		return platform.Caller{}, err
	}

	o, err := s.read(ctx, id)
	if err != nil {
		return platform.Caller{}, err
	}

	member, err := s.sellers.Get(ctx, o.SellerID)
	if err != nil || member.MyRole == "" {
		return platform.Caller{}, ErrNotFound
	}

	return caller, nil
}

// transition locks an order, reads it with its lines and applies change in
// one transaction.
func (s *Service) transition(ctx context.Context, id uuid.UUID, change func(*db.Queries, pgx.Tx, Order) error) error {
	return pgx.BeginFunc(ctx, s.pool, func(tx pgx.Tx) error {
		q := s.queries.WithTx(tx)

		row, err := q.LockOrder(ctx, id)
		if errors.Is(err, pgx.ErrNoRows) {
			return ErrNotFound
		}

		if err != nil {
			return fmt.Errorf("locking the order: %w", err)
		}

		orders := []Order{s.fromRow(db.GetOrderRow(row))}
		if err := s.withLines(ctx, orders); err != nil {
			return err
		}

		return change(q, tx, orders[0])
	})
}

func textOf(s string) pgtype.Text { return pgtype.Text{String: s, Valid: s != ""} }

func (s *Service) logged(ctx context.Context, msg, event string, id uuid.UUID, caller platform.Caller) {
	attrs := []any{slog.String("event", event), slog.String("order_id", id.String())}
	if caller.AccountID != uuid.Nil {
		attrs = append(attrs, slog.String("account_id", caller.AccountID.String()))
	}

	s.logger.InfoContext(ctx, msg, attrs...)
}

// actor is who made a transition, as order_events keeps them.
func actor(caller platform.Caller) uuid.NullUUID {
	return uuid.NullUUID{UUID: caller.AccountID, Valid: true}
}
