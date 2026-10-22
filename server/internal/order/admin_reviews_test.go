package order_test

import (
	"strings"
	"testing"
	"time"

	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/audit"
	"github.com/kl3inIT/second-bite/server/internal/order"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// testAdminsHideReviews: an admin lists one seller's reviews among every
// seller's, by stars, words and visibility, with the counts and the mean;
// hides one, which leaves the customer's order unrated but closed to a second
// review, and shows it again, each recorded in the audit; others may not, and
// bad requests are refused (SEC-145). The checks keep to the seller made here.
func testAdminsHideReviews(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	customer := f.as(t, "customer", platform.RoleCustomer)
	sellerID := f.shop(owner, t, "Quán Phở Gà "+f.prefix)
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

	bad, good := rated(1, "Bánh nguội quá"), rated(5, "")

	checkReviewsListed(t, f, sellerID, bad, good)
	checkHidingAReview(t, f, sellerID, bad)
	checkHiddenFromTheCustomer(t, f, bad)
	checkShowingAgain(t, f, bad)
	checkReviewRefusals(t, f, good)
}

// checkReviewsListed: the seller's two reviews, the latest first, counted by
// stars with their mean, and found by the comment without marks.
func checkReviewsListed(t *testing.T, f fixture, sellerID uuid.UUID, bad, good order.Order) {
	t.Helper()

	admin := f.as(t, "admin", platform.RoleAdmin)

	all, err := f.orders.ListReviewsForAdmins(admin, order.ReviewFilter{SellerID: sellerID, Page: 1, Size: 10})
	if err != nil || all.Total != 2 || all.Reviews[0].OrderID != good.ID || all.Counts.Stars[0] != 1 ||
		all.Counts.Stars[4] != 1 || all.Counts.Hidden != 0 || all.Average == nil || *all.Average != 3 {
		t.Fatalf("the seller's reviews, the latest first: %+v, %v", all, err)
	}

	byComment, err := f.orders.ListReviewsForAdmins(admin, order.ReviewFilter{SellerID: sellerID, Query: "banh nguoi", Page: 1, Size: 10})
	if err != nil || byComment.Total != 1 || byComment.Reviews[0].OrderID != bad.ID || byComment.Reviews[0].SellerName == "" {
		t.Errorf("by the comment without marks: %+v, %v", byComment, err)
	}
}

// checkHidingAReview hides o's review, once: the hidden ones list it, and
// the mean is of the shown ones only.
func checkHidingAReview(t *testing.T, f fixture, sellerID uuid.UUID, o order.Order) {
	t.Helper()

	admin := f.as(t, "admin", platform.RoleAdmin)

	hidden, err := f.orders.HideReview(admin, o.ID, " Lời lẽ xúc phạm ")
	if err != nil || hidden.HiddenAt == nil || hidden.HiddenReason != "Lời lẽ xúc phạm" || hidden.Stars != 1 {
		t.Fatalf("hiding: %+v, %v", hidden, err)
	}

	_, err = f.orders.HideReview(admin, o.ID, "")
	mustFail(t, "hiding twice", err, order.ErrReviewAlreadyHidden)

	page, err := f.orders.ListReviewsForAdmins(admin, order.ReviewFilter{
		SellerID: sellerID, Visibility: order.VisibilityHidden, Page: 1, Size: 10,
	})
	if err != nil || page.Total != 1 || page.Reviews[0].OrderID != o.ID || page.Counts.Hidden != 1 || page.Average != nil {
		t.Errorf("the hidden ones, with no mean: %+v, %v", page, err)
	}

	shown, err := f.orders.ListReviewsForAdmins(admin, order.ReviewFilter{SellerID: sellerID, Page: 1, Size: 10})
	if err != nil || shown.Average == nil || *shown.Average != 5 {
		t.Errorf("the mean of the shown ones: %+v, %v", shown.Average, err)
	}
}

// checkHiddenFromTheCustomer: the customer reads o without its hidden review,
// and cannot rate it again.
func checkHiddenFromTheCustomer(t *testing.T, f fixture, o order.Order) {
	t.Helper()

	customer := f.as(t, "customer", platform.RoleCustomer)

	read, err := f.orders.Get(customer, o.ID, "")
	if err != nil || read.Review != nil || !read.Reviewed {
		t.Errorf("the customer reads no review but a rated order: %+v, %v", read.Review, err)
	}

	_, err = f.orders.Rate(customer, o.ID, "", order.Review{Stars: 5})
	mustFail(t, "rating a hidden review's order again", err, order.ErrAlreadyReviewed)
}

// checkShowingAgain shows o's review again, once, to everyone; the audit
// holds the hiding with its reason and the showing.
func checkShowingAgain(t *testing.T, f fixture, o order.Order) {
	t.Helper()

	admin := f.as(t, "admin", platform.RoleAdmin)
	customer := f.as(t, "customer", platform.RoleCustomer)

	again, err := f.orders.ShowReview(admin, o.ID)
	if err != nil || again.HiddenAt != nil || again.HiddenReason != "" {
		t.Fatalf("showing again: %+v, %v", again, err)
	}

	_, err = f.orders.ShowReview(admin, o.ID)
	mustFail(t, "showing twice", err, order.ErrReviewNotHidden)

	if read, err := f.orders.Get(customer, o.ID, ""); err != nil || read.Review == nil || read.Review.Stars != 1 {
		t.Errorf("the customer reads it again: %+v, %v", read.Review, err)
	}

	events, err := f.trail.List(admin, audit.Filter{Actions: []string{"review.hide", "review.show"}, Query: o.ID.String(), Page: 1, Size: 10})
	if err != nil || events.Total != 2 || events.Events[0].Action != "review.show" ||
		events.Events[1].ResourceType != audit.ResourceOrder || events.Events[1].ResourceLabel != order.Number(o.Number) ||
		events.Events[1].Details.Reason != "Lời lẽ xúc phạm" {
		t.Errorf("the audit: %+v, %v", events, err)
	}
}

// checkReviewRefusals: only admins list, hide and show; a reason over 500
// characters, an order without a review and bad filters are refused.
func checkReviewRefusals(t *testing.T, f fixture, o order.Order) {
	t.Helper()

	admin := f.as(t, "admin", platform.RoleAdmin)
	customer := f.as(t, "customer", platform.RoleCustomer)

	_, err := f.orders.ListReviewsForAdmins(customer, order.ReviewFilter{Page: 1, Size: 10})
	mustFail(t, "a customer listing", err, platform.ErrAdminRequired)

	_, err = f.orders.HideReview(customer, o.ID, "")
	mustFail(t, "a customer hiding", err, platform.ErrAdminRequired)

	_, err = f.orders.ShowReview(customer, o.ID)
	mustFail(t, "a customer showing", err, platform.ErrAdminRequired)

	_, err = f.orders.HideReview(admin, o.ID, strings.Repeat("ế", 501))
	mustFail(t, "a reason too long", err, order.ErrReviewReasonInvalid)

	_, err = f.orders.HideReview(admin, uuid.New(), "")
	mustFail(t, "no review", err, order.ErrNotReviewed)

	tomorrow := time.Now().AddDate(0, 0, 1)
	today := time.Now()

	for name, bad := range map[string]order.ReviewFilter{
		"no page":               {Size: 10},
		"a page too big":        {Page: 1, Size: 101},
		"six stars":             {Stars: []int{6}, Page: 1, Size: 10},
		"an unknown visibility": {Visibility: "gone", Page: 1, Size: 10},
		"a range backwards":     {ReviewedSince: &tomorrow, ReviewedUntil: &today, Page: 1, Size: 10},
		"a query too long":      {Query: strings.Repeat("a", 101), Page: 1, Size: 10},
	} {
		_, err := f.orders.ListReviewsForAdmins(admin, bad)
		mustFail(t, name, err, order.ErrReviewListInvalid)
	}
}
