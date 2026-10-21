package order

import (
	"context"
	"fmt"
	"slices"
	"strings"
	"time"
	"unicode/utf8"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"

	"github.com/kl3inIT/second-bite/server/internal/order/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// Tag is what a customer says went well with a collected order; the web
// translates the codes.
type Tag string

// The tags of a review.
const (
	TagFastPickup   Tag = "fast_pickup"
	TagGoodQuality  Tag = "good_quality"
	TagGoodVariety  Tag = "good_variety"
	TagFairPortions Tag = "fair_portions"
)

var allTags = []Tag{TagFastPickup, TagGoodQuality, TagGoodVariety, TagFairPortions}

const (
	minStars          = 1
	maxStars          = 5
	maxCommentLetters = 500
)

// Review is a customer's rating of an order they collected.
type Review struct {
	Stars     int
	Tags      []Tag
	Comment   string
	CreatedAt time.Time
}

// valid tells whether r can be stored: stars within range, known tags, none
// twice, and a comment of a bounded length.
func (r Review) valid() bool {
	if r.Stars < minStars || r.Stars > maxStars || utf8.RuneCountInString(r.Comment) > maxCommentLetters {
		return false
	}

	for i, t := range r.Tags {
		if !slices.Contains(allTags, t) || slices.Contains(r.Tags[:i], t) {
			return false
		}
	}

	return true
}

// Rate stores the customer's review of a collected order, signed in or holding
// its access, once.
func (s *Service) Rate(ctx context.Context, id uuid.UUID, access string, review Review) (Order, error) {
	review.Comment = strings.TrimSpace(review.Comment)
	if !review.valid() {
		return Order{}, ErrReviewInvalid
	}

	caller, _ := platform.CallerFrom(ctx)

	err := s.transition(ctx, id, func(q *db.Queries, _ pgx.Tx, o Order) error {
		if !s.isCustomer(ctx, o, access) {
			return ErrNotFound
		}

		if o.Status != StatusCollected {
			return ErrNotCollected
		}

		stored, err := q.InsertReview(ctx, db.InsertReviewParams{
			OrderID: id, Stars: int16(review.Stars), Tags: tagCodes(review.Tags), Comment: review.Comment, //nolint:gosec // bounded by valid
		})
		if err != nil {
			return fmt.Errorf("storing the review: %w", err)
		}

		if stored == 0 {
			return ErrAlreadyReviewed
		}

		return nil
	})
	if err != nil {
		return Order{}, err
	}

	s.logged(ctx, "order reviewed", "order.review.created", id, caller)

	return s.Get(ctx, id, access)
}

func tagCodes(of []Tag) []string {
	codes := make([]string, len(of))
	for i, t := range of {
		codes[i] = string(t)
	}

	return codes
}

// withReviews reads the reviews of orders in one query.
func (s *Service) withReviews(ctx context.Context, orders []Order) error {
	if len(orders) == 0 {
		return nil
	}

	ids := make([]uuid.UUID, len(orders))
	at := make(map[uuid.UUID]int, len(orders))

	for i, o := range orders {
		ids[i], at[o.ID] = o.ID, i
	}

	rows, err := s.queries.ReviewsOf(ctx, ids)
	if err != nil {
		return fmt.Errorf("reading the orders' reviews: %w", err)
	}

	for _, r := range rows {
		review := Review{Stars: int(r.Stars), Tags: make([]Tag, 0, len(r.Tags)), Comment: r.Comment, CreatedAt: r.CreatedAt}
		for _, t := range r.Tags {
			review.Tags = append(review.Tags, Tag(t))
		}

		orders[at[r.OrderID]].Review = &review
	}

	return nil
}
