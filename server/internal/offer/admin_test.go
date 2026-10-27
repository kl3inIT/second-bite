package offer_test

import (
	"testing"
	"time"

	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/offer"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// testAdminsListOffers: an admin lists one seller's offers among every
// seller's, by status, words and the day posted, with the count of each
// status; others may not, and bad filters are refused (SEC-134). The checks
// keep to the seller made here, since other checks post beside them.
func testAdminsListOffers(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	sellerID := f.sellerAt(owner, t, "Quán Bánh Cuốn "+f.prefix, tasco)
	photo := f.photo(owner, t)

	kept, err := f.offers.Post(owner, sellerID, bread(photo))
	if err != nil {
		t.Fatal(err)
	}

	gone, err := f.offers.Post(owner, sellerID, bread(photo))
	if err != nil {
		t.Fatal(err)
	}

	if _, err := f.offers.Withdraw(owner, gone.ID); err != nil {
		t.Fatal(err)
	}

	admin := f.as(t, "admin", platform.RoleAdmin)
	checkAdminsSeeTheSellersOffers(t, f, sellerID, kept, gone)

	byWords, err := f.offers.ListForAdmins(admin, offer.AdminFilter{Query: "banh cuon " + f.prefix, Page: 1, Size: 10})
	if err != nil || byWords.Total != 2 {
		t.Errorf("by the seller's name without marks: total %d, %v", byWords.Total, err)
	}

	tomorrow := time.Now().AddDate(0, 0, 1)

	later, err := f.offers.ListForAdmins(admin, offer.AdminFilter{SellerID: sellerID, PostedSince: &tomorrow, Page: 1, Size: 10})
	if err != nil || later.Total != 0 || later.Counts[offer.StatusOnSale] != 0 {
		t.Errorf("posted from tomorrow: total %d, counts %v, %v", later.Total, later.Counts, err)
	}

	past, err := f.offers.ListForAdmins(admin, offer.AdminFilter{SellerID: sellerID, Page: 2, Size: 10})
	if err != nil || past.Total != 2 || len(past.Offers) != 0 {
		t.Errorf("a page past the end: total %d, %d offers, %v", past.Total, len(past.Offers), err)
	}

	_, err = f.offers.ListForAdmins(owner, offer.AdminFilter{Page: 1, Size: 10})
	mustFail(t, "a seller's owner", err, platform.ErrAdminRequired)

	_, err = f.offers.ListForAdmins(admin, offer.AdminFilter{Page: 1, Size: 101})
	mustFail(t, "a page of 101", err, offer.ErrAdminListInvalid)

	_, err = f.offers.ListForAdmins(admin, offer.AdminFilter{Status: "expired", Page: 1, Size: 10})
	mustFail(t, "an unknown status", err, offer.ErrAdminListInvalid)

	_, err = f.offers.ListForAdmins(admin, offer.AdminFilter{PostedSince: &tomorrow, PostedUntil: &tomorrow, Page: 1, Size: 10})
	mustFail(t, "a range that ends as it starts", err, offer.ErrAdminListInvalid)
}

// checkAdminsSeeTheSellersOffers: the seller's two offers, newest first with
// its name, counted by status, and one status.
func checkAdminsSeeTheSellersOffers(t *testing.T, f fixture, sellerID uuid.UUID, kept, gone offer.Offer) {
	t.Helper()

	admin := f.as(t, "admin", platform.RoleAdmin)

	all, err := f.offers.ListForAdmins(admin, offer.AdminFilter{SellerID: sellerID, Page: 1, Size: 10})
	if err != nil || all.Total != 2 || len(all.Offers) != 2 ||
		all.Counts[offer.StatusOnSale] != 1 || all.Counts[offer.StatusWithdrawn] != 1 {
		t.Fatalf("the seller's offers: total %d, counts %v, %v", all.Total, all.Counts, err)
	}

	if all.Offers[0].ID != gone.ID || all.Offers[0].SellerName != "Quán Bánh Cuốn "+f.prefix {
		t.Errorf("newest first, with its seller's name: %+v", all.Offers[0])
	}

	onSale, err := f.offers.ListForAdmins(admin, offer.AdminFilter{
		SellerID: sellerID, Status: offer.StatusOnSale, Page: 1, Size: 10,
	})
	if err != nil || len(onSale.Offers) != 1 || onSale.Offers[0].ID != kept.ID || onSale.Counts[offer.StatusWithdrawn] != 1 {
		t.Errorf("on sale: %d offers, counts %v, %v", len(onSale.Offers), onSale.Counts, err)
	}
}
