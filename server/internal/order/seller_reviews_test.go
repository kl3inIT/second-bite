package order_test

import (
	"context"
	"testing"
	"time"

	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/order"
	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/seller"
)

// testSellerReadsReviews: a seller's people list the reviews of their store,
// the latest first, with the customer's name and the dishes, counted by stars
// with the mean; stars narrow the list and not the counts; an admin hid one,
// which leaves their reads; strangers and bad requests are refused (SEC-154).
func testSellerReadsReviews(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	customer := f.as(t, "customer", platform.RoleCustomer)
	admin := f.as(t, "admin", platform.RoleAdmin)
	sellerID := f.shop(owner, t, "Quán Bún Chả "+f.prefix)
	croissant := f.post(owner, t, sellerID, "Croissant", 9, 20_000, time.Now())

	one := f.rated(owner, customer, t, croissant, order.Review{Stars: 1, Comment: "Bánh nguội"})
	five := f.rated(owner, customer, t, croissant, order.Review{Stars: 5, Comment: "Rất ngon"})
	rude := f.rated(owner, customer, t, croissant, order.Review{Stars: 2, Comment: "Lời lẽ xúc phạm"})

	if _, err := f.orders.HideReview(admin, rude.ID, ""); err != nil {
		t.Fatal(err)
	}

	checkSellerReviewsListed(owner, t, f, sellerID, one, five)
	checkSellerReviewsPaging(owner, t, f, sellerID)
	checkSellerReviewsByStars(owner, t, f, sellerID, one)
	checkSellerReviewsRefused(owner, t, f, sellerID)
}

// checkSellerReviewsListed: the two shown reviews, the latest first, without
// the hidden one, counted by stars with their mean.
func checkSellerReviewsListed(owner context.Context, t *testing.T, f fixture, sellerID uuid.UUID, one, five order.Order) {
	t.Helper()

	all, err := f.orders.ListReviewsOfSeller(owner, sellerID, nil, 1, 10)
	if err != nil || all.Total != 2 || len(all.Reviews) != 2 || all.Reviews[0].OrderID != five.ID || all.Reviews[1].OrderID != one.ID {
		t.Fatalf("the shown reviews, the latest first, without the hidden: %+v, %v", all, err)
	}

	if first := all.Reviews[0]; first.CustomerName != someone.Name || first.Dishes != "Croissant" {
		t.Errorf("who collected and what: %+v", first)
	}

	if all.Stars != [5]int{1, 0, 0, 0, 1} || all.Average == nil || *all.Average != 3 {
		t.Errorf("the counts and the mean: %+v, %v", all.Stars, all.Average)
	}
}

// checkSellerReviewsPaging: a page past the end is empty, and an admin reads the reviews too.
func checkSellerReviewsPaging(owner context.Context, t *testing.T, f fixture, sellerID uuid.UUID) {
	t.Helper()

	past, err := f.orders.ListReviewsOfSeller(owner, sellerID, nil, 2, 10)
	if err != nil || len(past.Reviews) != 0 || past.Total != 2 {
		t.Errorf("a page past the end: %+v, %v", past, err)
	}

	admin := f.as(t, "admin", platform.RoleAdmin)
	if byAdmin, err := f.orders.ListReviewsOfSeller(admin, sellerID, nil, 1, 10); err != nil || byAdmin.Total != 2 {
		t.Errorf("an admin reads them too: %+v, %v", byAdmin, err)
	}
}

// checkSellerReviewsByStars: three stars or fewer keeps the poor review, and
// leaves the counts of every number of stars as they were.
func checkSellerReviewsByStars(owner context.Context, t *testing.T, f fixture, sellerID uuid.UUID, one order.Order) {
	t.Helper()

	low, err := f.orders.ListReviewsOfSeller(owner, sellerID, []int{1, 2, 3}, 1, 10)
	if err != nil || low.Total != 1 || low.Reviews[0].OrderID != one.ID || low.Stars != [5]int{1, 0, 0, 0, 1} ||
		low.Average == nil || *low.Average != 1 {
		t.Errorf("three stars or fewer: %+v, %v", low, err)
	}
}

// checkSellerReviewsRefused: a stranger, stars out of range, a page of zero
// and a size past 100.
func checkSellerReviewsRefused(owner context.Context, t *testing.T, f fixture, sellerID uuid.UUID) {
	t.Helper()

	stranger := f.as(t, "stranger", platform.RoleCustomer)

	_, err := f.orders.ListReviewsOfSeller(stranger, sellerID, nil, 1, 10)
	mustFail(t, "a stranger", err, seller.ErrNotFound)

	_, err = f.orders.ListReviewsOfSeller(owner, sellerID, []int{6}, 1, 10)
	mustFail(t, "stars out of range", err, order.ErrReviewListInvalid)

	_, err = f.orders.ListReviewsOfSeller(owner, sellerID, nil, 0, 10)
	mustFail(t, "page zero", err, order.ErrReviewListInvalid)

	_, err = f.orders.ListReviewsOfSeller(owner, sellerID, nil, 1, 101)
	mustFail(t, "a size past 100", err, order.ErrReviewListInvalid)
}
