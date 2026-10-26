package order_test

import (
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
	stranger := f.as(t, "stranger", platform.RoleCustomer)
	admin := f.as(t, "admin", platform.RoleAdmin)
	sellerID := f.shop(owner, t, "Quán Bún Chả "+f.prefix)
	croissant := f.post(owner, t, sellerID, "Croissant", 9, 20_000, time.Now())

	rated := func(stars int, comment string) order.Order {
		placed, err := f.orders.Place(customer, key(), uuid.Nil, someone, []order.Wanted{{croissant.ID, 1}})
		if err != nil {
			t.Fatal(err)
		}

		if _, err := f.orders.HandOver(owner, placed.ID); err != nil {
			t.Fatal(err)
		}

		if _, err := f.orders.Rate(customer, placed.ID, "", order.Review{Stars: stars, Comment: comment}); err != nil {
			t.Fatal(err)
		}

		return placed
	}

	one, five, rude := rated(1, "Bánh nguội"), rated(5, "Rất ngon"), rated(2, "Lời lẽ xúc phạm")

	if _, err := f.orders.HideReview(admin, rude.ID, ""); err != nil {
		t.Fatal(err)
	}

	all, err := f.orders.ListReviewsOfSeller(owner, sellerID, nil, 1, 10)
	if err != nil || all.Total != 2 || len(all.Reviews) != 2 || all.Reviews[0].OrderID != five.ID ||
		all.Reviews[0].CustomerName != someone.Name || all.Reviews[0].Dishes != "Croissant" ||
		all.Stars != [5]int{1, 0, 0, 0, 1} || all.Average == nil || *all.Average != 3 {
		t.Fatalf("the shown reviews, the latest first, without the hidden: %+v, %v", all, err)
	}

	low, err := f.orders.ListReviewsOfSeller(owner, sellerID, []int{1, 2, 3}, 1, 10)
	if err != nil || low.Total != 1 || low.Reviews[0].OrderID != one.ID || low.Stars != all.Stars ||
		low.Average == nil || *low.Average != 1 {
		t.Errorf("three stars or fewer: %+v, %v", low, err)
	}

	past, err := f.orders.ListReviewsOfSeller(owner, sellerID, nil, 2, 10)
	if err != nil || len(past.Reviews) != 0 || past.Total != 2 {
		t.Errorf("a page past the end: %+v, %v", past, err)
	}

	if byAdmin, err := f.orders.ListReviewsOfSeller(admin, sellerID, nil, 1, 10); err != nil || byAdmin.Total != 2 {
		t.Errorf("an admin reads them too: %+v, %v", byAdmin, err)
	}

	_, err = f.orders.ListReviewsOfSeller(stranger, sellerID, nil, 1, 10)
	mustFail(t, "a stranger", err, seller.ErrNotFound)

	_, err = f.orders.ListReviewsOfSeller(owner, sellerID, []int{6}, 1, 10)
	mustFail(t, "stars out of range", err, order.ErrReviewListInvalid)

	_, err = f.orders.ListReviewsOfSeller(owner, sellerID, nil, 0, 10)
	mustFail(t, "page zero", err, order.ErrReviewListInvalid)

	_, err = f.orders.ListReviewsOfSeller(owner, sellerID, nil, 1, 101)
	mustFail(t, "a size past 100", err, order.ErrReviewListInvalid)
}
