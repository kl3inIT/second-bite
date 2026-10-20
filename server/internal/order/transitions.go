package order

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"strings"
	"unicode/utf8"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"

	"github.com/kl3inIT/second-bite/server/internal/order/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// Cancel cancels the caller's order free of charge until its window opens,
// and gives its units back to their offers in the same transaction.
func (s *Service) Cancel(ctx context.Context, id uuid.UUID, reason string) (Order, error) {
	caller, err := platform.RequireCaller(ctx)
	if err != nil {
		return Order{}, err
	}

	reason = strings.TrimSpace(reason)
	if utf8.RuneCountInString(reason) > 200 {
		reason = string([]rune(reason)[:200])
	}

	err = s.transition(ctx, id, func(q *db.Queries, tx pgx.Tx, o Order) error {
		if o.CustomerID != caller.AccountID {
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

		return q.InsertEvent(ctx, db.InsertEventParams{OrderID: id, Kind: "cancelled", ActorID: caller.AccountID})
	})
	if err != nil {
		return Order{}, err
	}

	s.logged(ctx, "order cancelled", "order.order.cancelled", id, caller)

	return s.Get(ctx, id)
}

// Ready marks an order ready for collection, which shows its customer the
// code. Marking it ready again changes nothing.
func (s *Service) Ready(ctx context.Context, id uuid.UUID) (Order, error) {
	caller, err := s.staffOf(ctx, id)
	if err != nil {
		return Order{}, err
	}

	err = s.transition(ctx, id, func(q *db.Queries, _ pgx.Tx, o Order) error {
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

		return q.InsertEvent(ctx, db.InsertEventParams{OrderID: id, Kind: "ready", ActorID: caller.AccountID})
	})
	if err != nil {
		return Order{}, err
	}

	s.logged(ctx, "order ready", "order.order.ready", id, caller)

	return s.Get(ctx, id)
}

// HandOver hands an order over when the collector gives its code within the
// window. A wrong code is counted, and the third locks the order's code.
func (s *Service) HandOver(ctx context.Context, id uuid.UUID, code string) (Order, error) {
	caller, err := s.staffOf(ctx, id)
	if err != nil {
		return Order{}, err
	}

	var wrong error

	err = s.transition(ctx, id, func(q *db.Queries, _ pgx.Tx, o Order) error {
		switch {
		case !o.Status.open():
			return ErrTransitionNotAllowed
		case o.CodeAttemptsLeft <= 0:
			return ErrCodeLocked
		case s.now().Before(o.WindowStart):
			return ErrOutsideWindow
		}

		if !s.codeMatches(id, strings.TrimSpace(code)) {
			attempts, err := q.CountWrongCode(ctx, id)
			if err != nil {
				return fmt.Errorf("counting a wrong code: %w", err)
			}

			wrong = ErrCodeWrong
			if attempts >= maxCodeAttempts {
				wrong = ErrCodeLocked
			}

			// The wrong attempt is kept: the transaction commits.
			return q.InsertEvent(ctx, db.InsertEventParams{OrderID: id, Kind: "code_wrong", ActorID: caller.AccountID})
		}

		if err := q.MarkCollected(ctx, id); err != nil {
			return fmt.Errorf("handing the order over: %w", err)
		}

		return q.InsertEvent(ctx, db.InsertEventParams{OrderID: id, Kind: "collected", ActorID: caller.AccountID})
	})
	if err != nil {
		return Order{}, err
	}

	if wrong != nil {
		s.logger.WarnContext(ctx, "wrong collection code",
			slog.String("event", "order.collection.code_wrong"),
			slog.String("order_id", id.String()),
			slog.String("account_id", caller.AccountID.String()),
			slog.String("error_code", failureCode(wrong)),
		)

		return Order{}, wrong
	}

	s.logged(ctx, "order collected", "order.collection.confirmed", id, caller)

	return s.Get(ctx, id)
}

// Refuse ends an order staff will not hand over: the food is no longer
// suitable, or the order is wrong. Its units are not offered again.
func (s *Service) Refuse(ctx context.Context, id uuid.UUID, reason RefuseReason, note string) (Order, error) {
	note = strings.TrimSpace(note)
	if (reason != RefuseNotSuitable && reason != RefuseWrongItems && reason != RefuseOther) || utf8.RuneCountInString(note) > 200 {
		return Order{}, ErrRefusalInvalid
	}

	caller, err := s.staffOf(ctx, id)
	if err != nil {
		return Order{}, err
	}

	err = s.transition(ctx, id, func(q *db.Queries, _ pgx.Tx, o Order) error {
		if !o.Status.open() {
			return ErrTransitionNotAllowed
		}

		if err := q.MarkRefused(ctx, db.MarkRefusedParams{ID: id, RefuseReason: textOf(string(reason)), RefuseNote: note}); err != nil {
			return fmt.Errorf("refusing the order: %w", err)
		}

		return q.InsertEvent(ctx, db.InsertEventParams{OrderID: id, Kind: "refused", ActorID: caller.AccountID})
	})
	if err != nil {
		return Order{}, err
	}

	s.logged(ctx, "order refused", "order.order.refused", id, caller)

	return s.Get(ctx, id)
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

// failureCode is the code of a module failure, for logs.
func failureCode(err error) string {
	if f, ok := platform.AsFailure(err); ok {
		return f.Code
	}

	return ""
}

func textOf(s string) pgtype.Text { return pgtype.Text{String: s, Valid: s != ""} }

func (s *Service) logged(ctx context.Context, msg, event string, id uuid.UUID, caller platform.Caller) {
	s.logger.InfoContext(ctx, msg,
		slog.String("event", event),
		slog.String("order_id", id.String()),
		slog.String("account_id", caller.AccountID.String()),
	)
}
