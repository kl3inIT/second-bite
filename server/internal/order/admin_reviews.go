package order

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"strings"
	"time"
	"unicode/utf8"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"

	"github.com/kl3inIT/second-bite/server/internal/audit"
	"github.com/kl3inIT/second-bite/server/internal/order/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// maxHideReasonLetters bounds the reason an admin hides a review for.
const maxHideReasonLetters = 500

// Visibility is whether a review shows to everyone or only to admins.
type Visibility string

// The visibilities an admin may list by.
const (
	VisibilityShown  Visibility = "visible"
	VisibilityHidden Visibility = "hidden"
)

// AdminReview is a customer's review as admins list it, with its order and,
// once hidden, when and why. An order has one review at most, so the order
// names it.
type AdminReview struct {
	Review

	OrderID      uuid.UUID
	Number       int64
	SellerID     uuid.UUID
	SellerName   string
	CustomerName string
	// HiddenAt is when an admin hid it, nil while it shows; HiddenReason is
	// their reason, empty when they gave none.
	HiddenAt     *time.Time
	HiddenReason string
}

// ReviewFilter is what an admin lists the reviews by.
type ReviewFilter struct {
	// Stars keeps the reviews giving one of them; all when empty.
	Stars []int
	// Query keeps the reviews whose comment, order's number (SB-24831 or
	// 24831), customer's name or phone, or seller's name holds it,
	// Vietnamese marks ignored.
	Query string
	// SellerID keeps one seller's reviews; all when nil.
	SellerID uuid.UUID
	// Visibility keeps the shown or the hidden reviews; all when empty.
	Visibility Visibility
	// ReviewedSince and ReviewedUntil keep the reviews given in
	// [ReviewedSince, ReviewedUntil); either may be nil.
	ReviewedSince, ReviewedUntil *time.Time
	// Page counts from 1; Size runs from 1 to 100.
	Page, Size int
}

// ReviewCounts are the reviews matching the words, the seller and the days:
// how many give each number of stars (Stars[0] one star), shown or hidden as
// the filter asks, and how many are hidden, of the stars it asks.
type ReviewCounts struct {
	Stars  [maxStars]int
	Hidden int
}

// ReviewPage is one page of the admins' list of reviews, how many match in
// all, the counts for the cards, and the mean stars of the shown reviews
// matching every filter, nil when none does.
type ReviewPage struct {
	Reviews []AdminReview
	Total   int
	Counts  ReviewCounts
	Average *float64
}

// ListReviewsForAdmins answers one page of every review matching f, hidden
// or not, to an admin, the latest first (SEC-145).
func (s *Service) ListReviewsForAdmins(ctx context.Context, f ReviewFilter) (ReviewPage, error) {
	if _, err := platform.RequireAdmin(ctx); err != nil {
		return ReviewPage{}, err
	}

	params, err := f.params()
	if err != nil {
		return ReviewPage{}, err
	}

	rows, err := s.queries.ReviewsForAdmins(ctx, params)
	if err != nil {
		return ReviewPage{}, fmt.Errorf("listing the reviews: %w", err)
	}

	total, err := s.queries.CountReviewsForAdmins(ctx, db.CountReviewsForAdminsParams{
		Stars: params.Stars, Visibility: params.Visibility, Query: params.Query, SellerID: params.SellerID,
		ReviewedSince: params.ReviewedSince, ReviewedUntil: params.ReviewedUntil,
	})
	if err != nil {
		return ReviewPage{}, fmt.Errorf("counting the reviews: %w", err)
	}

	counts, err := s.queries.CountReviewsByStars(ctx, db.CountReviewsByStarsParams{
		Stars: params.Stars, Visibility: params.Visibility, Query: params.Query, SellerID: params.SellerID,
		ReviewedSince: params.ReviewedSince, ReviewedUntil: params.ReviewedUntil,
	})
	if err != nil {
		return ReviewPage{}, fmt.Errorf("counting the reviews by stars: %w", err)
	}

	page := ReviewPage{
		Reviews: make([]AdminReview, 0, len(rows)), Total: int(total),
		Counts: ReviewCounts{
			Stars:  [maxStars]int{int(counts.One), int(counts.Two), int(counts.Three), int(counts.Four), int(counts.Five)},
			Hidden: int(counts.Hidden),
		},
	}

	if counts.Shown > 0 {
		average := float64(counts.ShownStars) / float64(counts.Shown)
		page.Average = &average
	}

	for _, r := range rows {
		page.Reviews = append(page.Reviews, fromReviewRow(db.LockReviewForAdminsRow(r)))
	}

	return page, nil
}

// HideReview hides the review of an order from every read but the admins',
// for reason, which may be empty, and records it in the audit. Its customer
// is not told and cannot rate the order again.
func (s *Service) HideReview(ctx context.Context, orderID uuid.UUID, reason string) (AdminReview, error) {
	caller, err := platform.RequireAdmin(ctx)
	if err != nil {
		return AdminReview{}, err
	}

	reason = strings.TrimSpace(reason)
	if utf8.RuneCountInString(reason) > maxHideReasonLetters {
		return AdminReview{}, ErrReviewReasonInvalid
	}

	review, err := s.changeReview(ctx, orderID, func(q *db.Queries, tx pgx.Tx, r *AdminReview) error {
		if r.HiddenAt != nil {
			return ErrReviewAlreadyHidden
		}

		at, err := q.HideReview(ctx, db.HideReviewParams{
			OrderID: orderID, HiddenBy: uuid.NullUUID{UUID: caller.AccountID, Valid: true}, HiddenReason: reason,
		})
		if err != nil {
			return fmt.Errorf("hiding the review: %w", err)
		}

		r.HiddenAt, r.HiddenReason = at, reason

		return s.trail.Record(ctx, tx, reviewResource(*r), audit.ReviewHidden{Reason: reason})
	})
	if err != nil {
		return AdminReview{}, err
	}

	s.reviewLogged(ctx, "review hidden", "order.review.hidden", orderID, caller)

	return review, nil
}

// ShowReview shows a hidden review again everywhere, and records it in the
// audit.
func (s *Service) ShowReview(ctx context.Context, orderID uuid.UUID) (AdminReview, error) {
	caller, err := platform.RequireAdmin(ctx)
	if err != nil {
		return AdminReview{}, err
	}

	review, err := s.changeReview(ctx, orderID, func(q *db.Queries, tx pgx.Tx, r *AdminReview) error {
		if r.HiddenAt == nil {
			return ErrReviewNotHidden
		}

		if err := q.ShowReview(ctx, orderID); err != nil {
			return fmt.Errorf("showing the review: %w", err)
		}

		r.HiddenAt, r.HiddenReason = nil, ""

		return s.trail.Record(ctx, tx, reviewResource(*r), audit.ReviewShown{})
	})
	if err != nil {
		return AdminReview{}, err
	}

	s.reviewLogged(ctx, "review shown", "order.review.shown", orderID, caller)

	return review, nil
}

// changeReview locks the review of an order and applies change to it in one
// transaction, answering the review as change leaves it.
func (s *Service) changeReview(
	ctx context.Context, orderID uuid.UUID, change func(*db.Queries, pgx.Tx, *AdminReview) error,
) (AdminReview, error) {
	var review AdminReview

	err := pgx.BeginFunc(ctx, s.pool, func(tx pgx.Tx) error {
		q := s.queries.WithTx(tx)

		row, err := q.LockReviewForAdmins(ctx, orderID)
		if errors.Is(err, pgx.ErrNoRows) {
			return ErrNotReviewed
		}

		if err != nil {
			return fmt.Errorf("locking the review: %w", err)
		}

		review = fromReviewRow(row)

		return change(q, tx, &review)
	})
	if err != nil {
		return AdminReview{}, err
	}

	return review, nil
}

// reviewResource is what the audit names a review by: its order, labelled
// with the order's number.
func reviewResource(r AdminReview) audit.Resource {
	return audit.Resource{Type: audit.ResourceOrder, ID: r.OrderID.String(), Label: Number(r.Number)}
}

func (s *Service) reviewLogged(ctx context.Context, msg, event string, orderID uuid.UUID, caller platform.Caller) {
	s.logger.InfoContext(ctx, msg,
		slog.String("event", event),
		slog.String("order_id", orderID.String()),
		slog.String("by_account_id", caller.AccountID.String()),
	)
}

func fromReviewRow(r db.LockReviewForAdminsRow) AdminReview {
	review := AdminReview{
		Stars: int(r.Stars), Tags: make([]Tag, 0, len(r.Tags)), Comment: r.Comment, CreatedAt: r.CreatedAt,
		OrderID: r.OrderID, Number: r.Number.Int64, SellerID: r.SellerID, SellerName: r.SellerName,
		CustomerName: r.CustomerName, HiddenAt: r.HiddenAt, HiddenReason: r.HiddenReason,
	}

	for _, t := range r.Tags {
		review.Tags = append(review.Tags, Tag(t))
	}

	return review
}

func (f ReviewFilter) params() (db.ReviewsForAdminsParams, error) {
	if f.Page < 1 || f.Size < 1 || f.Size > maxAdminPageSize {
		return db.ReviewsForAdminsParams{}, ErrReviewListInvalid
	}

	query := strings.TrimSpace(f.Query)
	if utf8.RuneCountInString(query) > maxAdminQueryRunes {
		return db.ReviewsForAdminsParams{}, ErrReviewListInvalid
	}

	if f.ReviewedSince != nil && f.ReviewedUntil != nil && !f.ReviewedSince.Before(*f.ReviewedUntil) {
		return db.ReviewsForAdminsParams{}, ErrReviewListInvalid
	}

	if f.Visibility != "" && f.Visibility != VisibilityShown && f.Visibility != VisibilityHidden {
		return db.ReviewsForAdminsParams{}, ErrReviewListInvalid
	}

	stars, ok := starsOf(f.Stars)
	if !ok {
		return db.ReviewsForAdminsParams{}, ErrReviewListInvalid
	}

	return db.ReviewsForAdminsParams{
		Stars:         stars,
		Visibility:    string(f.Visibility),
		Query:         escapeLike(query),
		SellerID:      uuid.NullUUID{UUID: f.SellerID, Valid: f.SellerID != uuid.Nil},
		ReviewedSince: f.ReviewedSince,
		ReviewedUntil: f.ReviewedUntil,
		MaxRows:       int32(f.Size),
		SkipRows:      int32((f.Page - 1) * f.Size), //nolint:gosec // a page past int32 finds nothing anyway
	}, nil
}

// starsOf turns the stars asked into the query's, false when one is not 1 to
// 5.
func starsOf(asked []int) ([]int32, bool) {
	stars := make([]int32, 0, len(asked))

	for _, n := range asked {
		if n < minStars || n > maxStars {
			return nil, false
		}

		stars = append(stars, int32(n))
	}

	return stars, true
}
