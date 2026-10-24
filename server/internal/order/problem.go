package order

import (
	"context"
	"fmt"
	"strings"
	"time"
	"unicode"
	"unicode/utf8"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"

	"github.com/kl3inIT/second-bite/server/internal/order/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// ProblemKind is what a customer says went wrong with an order (SEC-84); the
// web translates the codes.
type ProblemKind string

// The kinds of problem, as Figma D6 lists them.
const (
	ProblemMissingItem ProblemKind = "missing_item"
	ProblemWrongItem   ProblemKind = "wrong_item"
	ProblemPoorQuality ProblemKind = "poor_quality"
	ProblemStoreClosed ProblemKind = "store_closed"
)

// problemWords names each kind in a push to the store.
var problemWords = map[ProblemKind]platform.Words{
	ProblemMissingItem: {VI: "Thiếu món", EN: "A missing item"},
	ProblemWrongItem:   {VI: "Sai món", EN: "A wrong item"},
	ProblemPoorQuality: {VI: "Món không đạt", EN: "Poor quality"},
	ProblemStoreClosed: {VI: "Quán đóng cửa khi đến", EN: "The store was closed"},
}

const (
	maxProblemLetters = 500
	// problemGrace is how long after its collection, or after its window for an
	// expired order, a customer may report a problem.
	problemGrace = 48 * time.Hour
)

// Problem is a customer's report on an order and the store's answer, none
// until the store answers.
type Problem struct {
	Kind       ProblemKind
	Note       string
	ReportedAt time.Time
	Answer     string
	AnsweredAt *time.Time
}

// problemEnd is when the customer can no longer report a problem with o:
// two days after it was collected or, for an expired order, after its window.
// None for an order in any other state.
func problemEnd(o Order) (time.Time, bool) {
	switch {
	case o.Status == StatusCollected && o.CollectedAt != nil:
		return o.CollectedAt.Add(problemGrace), true
	case o.Status == StatusExpired:
		return o.WindowEnd.Add(problemGrace), true
	}

	return time.Time{}, false
}

// canReport tells whether o's customer may report a problem now.
func (s *Service) canReport(o Order) bool {
	end, ok := problemEnd(o)

	return ok && o.Problem == nil && s.now().Before(end)
}

// cleanWords trims text and tells whether it holds at most limit letters, at
// least one when required, and no control character but line breaks.
func cleanWords(text string, limit int, required bool) (string, bool) {
	text = strings.TrimSpace(text)

	n := utf8.RuneCountInString(text)
	if !utf8.ValidString(text) || n > limit || (required && n == 0) {
		return text, false
	}

	for _, r := range text {
		if unicode.IsControl(r) && r != '\n' {
			return text, false
		}
	}

	return text, true
}

// ReportProblem stores what went wrong with a collected or expired order, for
// its customer, signed in or holding its access, once and within two days, and
// tells the store.
func (s *Service) ReportProblem(ctx context.Context, id uuid.UUID, access string, kind ProblemKind, note string) (Order, error) {
	note, ok := cleanWords(note, maxProblemLetters, false)
	if _, known := problemWords[kind]; !known || !ok {
		return Order{}, ErrProblemInvalid
	}

	caller, _ := platform.CallerFrom(ctx)

	err := s.transition(ctx, id, func(q *db.Queries, tx pgx.Tx, o Order) error {
		if !s.isCustomer(ctx, o, access) {
			return ErrNotFound
		}

		if end, ok := problemEnd(o); !ok || !s.now().Before(end) {
			return ErrProblemNotAllowed
		}

		stored, err := q.InsertProblem(ctx, db.InsertProblemParams{OrderID: id, Kind: string(kind), Note: note})
		if err != nil {
			return fmt.Errorf("storing the problem: %w", err)
		}

		if stored == 0 {
			return ErrProblemAlreadyReported
		}

		if err := s.pushProblem(ctx, tx, o, kind); err != nil {
			return err
		}

		return notifyOrder(ctx, tx, id, o.SellerID, o.Status)
	})
	if err != nil {
		return Order{}, err
	}

	s.logged(ctx, "order problem reported", "order.problem.reported", id, caller)

	return s.Get(ctx, id, access)
}

// AnswerProblem stores the answer of the seller's people to the problem
// reported on one of their orders, once, and tells the customer.
func (s *Service) AnswerProblem(ctx context.Context, id uuid.UUID, answer string) (Order, error) {
	answer, ok := cleanWords(answer, maxProblemLetters, true)
	if !ok {
		return Order{}, ErrAnswerInvalid
	}

	caller, err := s.staffOf(ctx, id)
	if err != nil {
		return Order{}, err
	}

	err = s.transition(ctx, id, func(q *db.Queries, tx pgx.Tx, o Order) error {
		answered, err := q.AnswerProblem(ctx, db.AnswerProblemParams{OrderID: id, Answer: textOf(answer)})
		if err != nil {
			return fmt.Errorf("answering the problem: %w", err)
		}

		if answered == 0 {
			reported, err := q.ProblemExists(ctx, id)
			if err != nil {
				return fmt.Errorf("reading the problem: %w", err)
			}

			if !reported {
				return ErrProblemNotFound
			}

			return ErrProblemAlreadyAnswered
		}

		if err := s.pushAnswered(ctx, tx, o); err != nil {
			return err
		}

		return notifyOrder(ctx, tx, id, o.SellerID, o.Status)
	})
	if err != nil {
		return Order{}, err
	}

	s.logged(ctx, "order problem answered", "order.problem.answered", id, caller)

	return s.Get(ctx, id, "")
}

// pushProblem tells the seller's people what the customer reported, never the
// note.
func (s *Service) pushProblem(ctx context.Context, tx pgx.Tx, o Order, kind ProblemKind) error {
	return s.pushToSeller(ctx, tx, o,
		platform.Words{VI: "Khách báo vấn đề với đơn " + Number(o.Number), EN: "A problem with order " + Number(o.Number)},
		problemWords[kind])
}

// pushAnswered tells the customer that the store answered, never the answer.
func (s *Service) pushAnswered(ctx context.Context, tx pgx.Tx, o Order) error {
	return s.pushToCustomer(ctx, tx, o,
		platform.Words{VI: o.SellerName + " đã trả lời", EN: o.SellerName + " answered"},
		platform.Words{
			VI: "Về vấn đề bạn báo với đơn " + Number(o.Number),
			EN: "About the problem you reported with order " + Number(o.Number),
		})
}

// withProblems reads the problems of orders in one query, and whether each
// order's customer may still report one.
func (s *Service) withProblems(ctx context.Context, orders []Order) error {
	if len(orders) == 0 {
		return nil
	}

	ids := make([]uuid.UUID, len(orders))
	at := make(map[uuid.UUID]int, len(orders))

	for i, o := range orders {
		ids[i], at[o.ID] = o.ID, i
	}

	rows, err := s.queries.ProblemsOf(ctx, ids)
	if err != nil {
		return fmt.Errorf("reading the orders' problems: %w", err)
	}

	for _, r := range rows {
		orders[at[r.OrderID]].Problem = &Problem{
			Kind: ProblemKind(r.Kind), Note: r.Note, ReportedAt: r.ReportedAt,
			Answer: r.Answer.String, AnsweredAt: r.AnsweredAt,
		}
	}

	for i := range orders {
		orders[i].CanReportProblem = s.canReport(orders[i])
	}

	return nil
}
