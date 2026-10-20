package offer_test

import (
	"context"
	"errors"
	"slices"
	"strings"
	"testing"
	"time"

	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/offer"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// Names of the offers search is checked with.
const (
	breadMixed     = "Bánh mì thập cẩm"
	breadPate      = "Bánh mỳ pate"
	noodlesAndBuns = "Mì xào, bánh bao"
	croissant      = "Bánh croissant"
	milkTea        = "Trà sữa"
	friedRice      = "Cơm rang"
	stickyRice     = "Xôi xéo"
)

// post puts an offer on sale with a name, a kind, a price and an original
// price, the rest as bread's.
func (f fixture) post(ctx context.Context, t *testing.T, sellerID, photo uuid.UUID, name string, kind offer.Kind, price, original int64) offer.Offer {
	t.Helper()

	d := bread(photo)
	d.Name, d.Kind, d.PriceVND, d.OriginalPriceVND = name, kind, price, original

	if kind == offer.KindMixedBox {
		d.Description = "Có trứng, bơ và bánh của ngày"
	}

	o, err := f.offers.Post(ctx, sellerID, d)
	if err != nil {
		t.Fatalf("posting %q: %v", name, err)
	}

	return o
}

// names returns the names of what search found, in its order.
func (f fixture) search(t *testing.T, q offer.Query) []string {
	t.Helper()

	found, err := f.offers.Search(t.Context(), q)
	if err != nil {
		t.Fatalf("searching %+v: %v", q, err)
	}

	names := make([]string, 0, len(found))
	for _, o := range found {
		names = append(names, o.Name)
	}

	return names
}

func testSearchReadsVietnamese(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	sellerID := f.activeSeller(owner, t)
	photo := f.photo(owner, t)

	for _, o := range []struct {
		name  string
		kind  offer.Kind
		price int64
	}{
		{breadMixed, offer.KindBakery, 15_000},
		{breadPate, offer.KindBakery, 16_000},
		{noodlesAndBuns, offer.KindPreparedFood, 17_000},
		{"Cà phê sữa", offer.KindDrinks, 18_000},
		{"Cá kho tộ", offer.KindPreparedFood, 19_000},
		{"Hộp bánh ngọt", offer.KindMixedBox, 20_000},
	} {
		f.post(owner, t, sellerID, photo, o.name, o.kind, o.price, 40_000)
	}

	for words, want := range map[string][]string{
		// Without marks every spelling matches; the words side by side first.
		"banh mi": {breadMixed, breadPate, noodlesAndBuns},
		"bánh mì": {breadMixed, breadPate, noodlesAndBuns},
		"banh m":  {breadMixed, breadPate, noodlesAndBuns},
		// With marks, only those marks.
		"cá": {"Cá kho tộ"},
		// The last word typed without marks is a prefix: "ca" may become "cẩm".
		"ca": {breadMixed, "Cà phê sữa", "Cá kho tộ"},
		// The description, and the seller's name.
		"trung":    {"Hộp bánh ngọt"},
		"thap cam": {breadMixed},
		"xyz":      {},
	} {
		got := f.search(t, offer.Query{SellerID: &sellerID, Words: words})

		// Equal ranks follow the window's end, which is the order of posting
		// within a millisecond or two; compare those as sets.
		switch words {
		case "ca":
			slices.Sort(got)
		case "banh mi", "bánh mì", "banh m":
			if len(got) == 3 {
				slices.Sort(got[:2])
			}
		}

		if !slices.Equal(got, want) {
			t.Errorf("%q found %q, want %q", words, got, want)
		}
	}

	if got := f.search(t, offer.Query{SellerID: &sellerID, Words: "tasco"}); len(got) != 6 {
		t.Errorf("the seller's name found %q", got)
	}
}

// Points around Tasco Mall: about 2 km and 12 km north.
var (
	twoKmNorth    = offer.Point{Latitude: tasco.Latitude + 0.018, Longitude: tasco.Longitude}
	twelveKmNorth = offer.Point{Latitude: tasco.Latitude + 0.108, Longitude: tasco.Longitude}
)

func testSearchNearAndFiltered(t *testing.T, f fixture) {
	t.Helper()

	// A word in the sellers' names keeps this check to its own offers.
	tag := "q" + strings.ReplaceAll(uuid.NewString(), "-", "")[:10]
	owner := f.as(t, "owner", platform.RoleCustomer)
	here := f.sellerAt(owner, t, "Quầy "+tag+" gần", tasco)
	near := f.sellerAt(owner, t, "Quầy "+tag+" vừa", twoKmNorth)
	far := f.sellerAt(owner, t, "Quầy "+tag+" xa", twelveKmNorth)
	photo := f.photo(owner, t)

	f.post(owner, t, near, photo, stickyRice, offer.KindPreparedFood, 10_000, 20_000)
	f.post(owner, t, here, photo, croissant, offer.KindBakery, 30_000, 40_000)
	f.post(owner, t, far, photo, milkTea, offer.KindDrinks, 20_000, 50_000)
	soldOut := f.post(owner, t, here, photo, friedRice, offer.KindPreparedFood, 25_000, 35_000)
	f.order(t, soldOut.ID, 5)

	withdrawn := f.post(owner, t, here, photo, "Phở bò", offer.KindPreparedFood, 25_000, 35_000)
	if _, err := f.offers.Withdraw(owner, withdrawn.ID); err != nil {
		t.Fatal(err)
	}

	at := func(q offer.Query) []string {
		q.Words = tag
		if q.Sort == "" && q.Near == nil {
			q.Sort = offer.SortEndingSoon
		}

		return f.search(t, q)
	}

	for name, c := range map[string]struct {
		q    offer.Query
		want []string
	}{
		"within the default 5 km, nearest first": {
			offer.Query{Near: &tasco, Sort: offer.SortDistance}, []string{croissant, friedRice, stickyRice},
		},
		"within 30 km": {
			offer.Query{Near: &tasco, RadiusKm: 30, Sort: offer.SortDistance}, []string{croissant, friedRice, stickyRice, milkTea},
		},
		"within 1 km": {
			offer.Query{Near: &tasco, RadiusKm: 1, Sort: offer.SortDistance}, []string{croissant, friedRice},
		},
		"sold out left out": {
			offer.Query{Near: &tasco, Sort: offer.SortDistance, AvailableOnly: true}, []string{croissant, stickyRice},
		},
		"by kinds": {
			offer.Query{Kinds: []offer.Kind{offer.KindBakery, offer.KindDrinks}, Sort: offer.SortPrice}, []string{milkTea, croissant},
		},
		"by price": {
			offer.Query{MaxPriceVND: 20_000, Sort: offer.SortPrice}, []string{stickyRice, milkTea},
		},
		"by discount": {
			offer.Query{Sort: offer.SortDiscount}, []string{milkTea, stickyRice, friedRice, croissant},
		},
		"one seller": {
			offer.Query{SellerID: &near}, []string{stickyRice},
		},
		"a window that has not begun": {
			offer.Query{CollectFrom: new(time.Now().Add(3 * time.Hour)), CollectTo: new(time.Now().Add(4 * time.Hour))}, []string{},
		},
	} {
		if got := at(c.q); !slices.Equal(got, c.want) {
			t.Errorf("%s: %q, want %q", name, got, c.want)
		}
	}

	found, err := f.offers.Search(t.Context(), offer.Query{Words: tag, Near: &tasco, SellerID: &near})
	if err != nil || len(found) != 1 || found[0].DistanceMeters == nil ||
		*found[0].DistanceMeters < 1900 || *found[0].DistanceMeters > 2100 || found[0].Seller.Name != "Quầy "+tag+" vừa" {
		t.Errorf("a found offer's seller and distance: %+v, %v", found, err)
	}

	testSearchRefusals(t, f)
}

func testBlockedSellerLeavesSearch(t *testing.T, f fixture) {
	t.Helper()

	tag := "q" + strings.ReplaceAll(uuid.NewString(), "-", "")[:10]
	owner := f.as(t, "owner", platform.RoleCustomer)
	sellerID := f.sellerAt(owner, t, "Quầy "+tag, tasco)
	o := f.post(owner, t, sellerID, f.photo(owner, t), "Bánh bao", offer.KindBakery, 10_000, 20_000)

	if got := f.search(t, offer.Query{Words: tag}); len(got) != 1 {
		t.Fatalf("before the block: %q", got)
	}

	if _, err := f.sellers.Block(f.as(t, "admin", platform.RoleAdmin), sellerID, "Bán món đã quá hạn sử dụng"); err != nil {
		t.Fatal(err)
	}

	if got := f.search(t, offer.Query{Words: tag}); len(got) != 0 {
		t.Errorf("a blocked seller's offer found: %q", got)
	}

	_, err := f.offers.Get(t.Context(), o.ID)
	mustFail(t, "anyone reading a blocked seller's offer", err, offer.ErrNotFound)

	if _, err := f.offers.Get(owner, o.ID); err != nil {
		t.Errorf("its owner reading it: %v", err)
	}
}

func testSearchRefusals(t *testing.T, f fixture) {
	t.Helper()

	for name, q := range map[string]offer.Query{
		"by distance from no point": {Sort: offer.SortDistance},
		"a range ending before it starts": {
			CollectFrom: new(time.Now().Add(time.Hour)), CollectTo: new(time.Now()),
		},
		"a point off the map": {Near: &offer.Point{Latitude: 91}},
	} {
		if _, err := f.offers.Search(t.Context(), q); !errors.Is(err, offer.ErrSearchInvalid) {
			t.Errorf("%s: %v", name, err)
		}
	}
}
