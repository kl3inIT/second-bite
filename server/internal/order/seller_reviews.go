package order

import (
	"context"
	"fmt"
	"slices"

	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/order/internal/db"
)

// SellerReview is a shown review as the seller's people read it: with the
// order it belongs to, who collected it and the dishes it held.
type SellerReview struct {
	Review

	OrderID      uuid.UUID
	Number       int64
	CustomerName string
	// Dishes are the names of the order's lines, joined by commas.
	Dishes string
}

// SellerReviewPage is one page of a seller's shown reviews, how many match
// the stars asked, how many give each number of stars (Stars[0] one star)
// whatever stars asks, and the mean stars of the reviews matching, nil when
// none does.
type SellerReviewPage struct {
	Reviews []SellerReview
	Total   int
	Stars   [maxStars]int
	Average *float64
}

// ListReviewsOfSeller answers one page of the reviews of a seller's orders
// that show, giving one of stars (any when empty), the latest first, to its
// people and admins. A review an admin hid is left out (SEC-154).
func (s *Service) ListReviewsOfSeller(ctx context.Context, sellerID uuid.UUID, stars []int, page, size int) (SellerReviewPage, error) {
	if _, err := s.sellers.Get(ctx, sellerID); err != nil {
		return SellerReviewPage{}, err
	}

	if page < 1 || size < 1 || size > maxAdminPageSize {
		return SellerReviewPage{}, ErrReviewListInvalid
	}

	asked, ok := starsOf(stars)
	if !ok {
		return SellerReviewPage{}, ErrReviewListInvalid
	}

	seller := uuid.NullUUID{UUID: sellerID, Valid: true}

	rows, err := s.queries.ReviewsOfSeller(ctx, db.ReviewsOfSellerParams{
		SellerID: sellerID, Stars: asked,
		MaxRows: int32(size), SkipRows: int32((page - 1) * size), //nolint:gosec // a page past int32 finds nothing anyway
	})
	if err != nil {
		return SellerReviewPage{}, fmt.Errorf("listing the seller's reviews: %w", err)
	}

	counts, err := s.queries.CountReviewsByStars(ctx, db.CountReviewsByStarsParams{
		Stars: asked, Visibility: string(VisibilityShown), SellerID: seller,
	})
	if err != nil {
		return SellerReviewPage{}, fmt.Errorf("counting the seller's reviews by stars: %w", err)
	}

	out := SellerReviewPage{
		Reviews: make([]SellerReview, 0, len(rows)),
		Stars:   [maxStars]int{int(counts.One), int(counts.Two), int(counts.Three), int(counts.Four), int(counts.Five)},
	}

	for i, n := range out.Stars {
		if len(asked) == 0 || slices.Contains(asked, int32(i+1)) {
			out.Total += n
		}
	}

	if counts.Shown > 0 {
		average := float64(counts.ShownStars) / float64(counts.Shown)
		out.Average = &average
	}

	for _, r := range rows {
		review := SellerReview{
			Review:  Review{Stars: int(r.Stars), Tags: make([]Tag, 0, len(r.Tags)), Comment: r.Comment, CreatedAt: r.CreatedAt},
			OrderID: r.OrderID, Number: r.Number.Int64, CustomerName: r.CustomerName, Dishes: r.Dishes,
		}

		for _, t := range r.Tags {
			review.Tags = append(review.Tags, Tag(t))
		}

		out.Reviews = append(out.Reviews, review)
	}

	return out, nil
}
