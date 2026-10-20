package offer_test

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"image"
	"image/png"
	"strings"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/kl3inIT/second-bite/server/internal/audit"
	"github.com/kl3inIT/second-bite/server/internal/file"
	"github.com/kl3inIT/second-bite/server/internal/identity"
	"github.com/kl3inIT/second-bite/server/internal/offer"
	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/platform/platformtest"
	"github.com/kl3inIT/second-bite/server/internal/seller"
)

type fixture struct {
	pool     *pgxpool.Pool
	accounts *identity.Service
	files    *file.Service
	sellers  *seller.Service
	offers   *offer.Service
	prefix   string
}

// TestOffer runs the module's checks in parallel against one PostgreSQL,
// each with accounts and sellers of its own, then the checks that change the
// settings every offer follows.
func TestOffer(t *testing.T) {
	t.Parallel()

	pool := platformtest.StartPostgres(t)

	t.Run("while the settings stay", func(t *testing.T) {
		for name, check := range map[string]func(*testing.T, fixture){
			"a post follows the rules of its fields":      testPostFollowsFieldRules,
			"only an active seller's people post":         testOnlyActiveSellersPeoplePost,
			"a photo is the poster's or the seller's":     testPhotoIsPostersOrSellers,
			"orders limit what changes":                   testOrdersLimitWhatChanges,
			"status follows units, window and withdrawal": testStatusFollowsUnitsWindowAndWithdrawal,
			"search reads Vietnamese as it is typed":      testSearchReadsVietnamese,
			"search keeps what is near and filtered":      testSearchNearAndFiltered,
			"a blocked seller's offers leave search":      testBlockedSellerLeavesSearch,
			"a seller keeps its dishes in a catalog":      testCatalogKeepsTheStableBase,
			"a catalog is private to its sellers people":  testCatalogIsPrivateToTheSellersPeople,
			"a post copies its dish":                      testPostsCopyTheirDish,
			"a catalog holds a hundred dishes":            testCatalogHoldsAHundredDishes,
		} {
			t.Run(name, func(t *testing.T) {
				t.Parallel()
				check(t, newFixture(t, pool))
			})
		}
	})

	t.Run("the settings bound every post", func(t *testing.T) { //nolint:paralleltest // it changes the settings the other checks post under
		testSettingsBoundEveryPost(t, newFixture(t, pool))
	})
}

func newFixture(t *testing.T, pool *pgxpool.Pool) fixture {
	t.Helper()

	accounts, err := identity.NewService(pool, nil, nil, nil, identity.Config{CodeKey: make([]byte, 32)}, platformtest.Logger())
	if err != nil {
		t.Fatal(err)
	}

	files, err := file.NewService(t.Context(), pool, file.Config{}, platformtest.Logger())
	if err != nil {
		t.Fatal(err)
	}

	sellers := seller.NewService(pool, accounts, files, platformtest.Logger())

	return fixture{
		pool: pool, accounts: accounts, files: files, sellers: sellers,
		offers: offer.NewService(pool, sellers, files, audit.NewService(pool, platformtest.Logger()), platformtest.Logger()),
		prefix: "offer." + strings.ReplaceAll(uuid.NewString(), "-", ""),
	}
}

// as returns a context whose caller is the account of name.
func (f fixture) as(t *testing.T, name string, role platform.Role) context.Context {
	t.Helper()

	a, err := f.accounts.EnsureAccount(t.Context(), f.prefix+"."+name+"@example.com")
	if err != nil {
		t.Fatal(err)
	}

	return platform.WithCaller(t.Context(), platform.Caller{AccountID: a.ID, SessionID: uuid.New(), Role: role})
}

// activeSeller opens a seller owned by owner, with staff, and has an admin
// activate it.
func (f fixture) activeSeller(owner context.Context, t *testing.T, staff ...string) uuid.UUID {
	t.Helper()

	return f.sellerAt(owner, t, "Quầy Tasco", tasco, staff...)
}

// tasco is Tasco Mall, Việt Hưng, where the pilot runs.
var tasco = offer.Point{Latitude: 21.0565, Longitude: 105.8964}

// sellerAt opens a seller of that name at a point, with staff, and has an
// admin activate it.
func (f fixture) sellerAt(owner context.Context, t *testing.T, name string, at offer.Point, staff ...string) uuid.UUID {
	t.Helper()

	s, err := f.sellers.Open(owner, seller.Details{
		Name: name, Address: "Tasco Mall, Việt Hưng", Latitude: at.Latitude, Longitude: at.Longitude, Phone: "0912345678",
	})
	if err != nil {
		t.Fatal(err)
	}

	for _, name := range staff {
		if _, err := f.sellers.AddStaff(owner, s.ID, f.prefix+"."+name+"@example.com"); err != nil {
			t.Fatal(err)
		}
	}

	if _, err := f.sellers.Activate(f.as(t, "admin", platform.RoleAdmin), s.ID); err != nil {
		t.Fatal(err)
	}

	return s.ID
}

// photo uploads a photo as the caller of ctx.
func (f fixture) photo(ctx context.Context, t *testing.T) uuid.UUID {
	t.Helper()

	var buf bytes.Buffer
	if err := png.Encode(&buf, image.NewGray(image.Rect(0, 0, 8, 8))); err != nil {
		t.Fatal(err)
	}

	p, err := f.files.Upload(ctx, buf.Bytes())
	if err != nil {
		t.Fatal(err)
	}

	return p.ID
}

// bread is an offer that follows every rule: ready now, collected within two
// hours, 40% below its original price.
func bread(photo uuid.UUID) offer.Details {
	now := time.Now()

	return offer.Details{
		Name: breadMixed, Kind: offer.KindBakery, Units: 5, PriceVND: 15_000, OriginalPriceVND: 25_000,
		PhotoID: photo, WindowStart: now, WindowEnd: now.Add(2 * time.Hour),
	}
}

func mustFail(t *testing.T, what string, err, want error) {
	t.Helper()

	if !errors.Is(err, want) {
		t.Errorf("%s: %v, want %v", what, err, want)
	}
}

func testPostFollowsFieldRules(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	sellerID := f.activeSeller(owner, t)
	photo := f.photo(owner, t)

	o, err := f.offers.Post(owner, sellerID, bread(photo))
	if err != nil {
		t.Fatal(err)
	}

	if o.Status != offer.StatusOnSale || o.UnitsLeft != 5 || o.Unit != "suất" || o.DiscountPercent != 40 ||
		o.CollectionPoint.Address != "Tasco Mall, Việt Hưng" || o.CollectionPoint.Latitude != 21.0565 {
		t.Fatalf("posted %+v", o)
	}

	now := time.Now()

	for name, c := range map[string]struct {
		change func(*offer.Details)
		want   error
	}{
		"a blank name":                         {func(d *offer.Details) { d.Name = "  " }, offer.ErrDetailsInvalid},
		"no unit":                              {func(d *offer.Details) { d.Units = 0 }, offer.ErrDetailsInvalid},
		"a thousand units":                     {func(d *offer.Details) { d.Units = 1000 }, offer.ErrDetailsInvalid},
		"an unknown kind":                      {func(d *offer.Details) { d.Kind = "fruit" }, offer.ErrDetailsInvalid},
		"a mixed box without what it holds":    {func(d *offer.Details) { d.Kind = offer.KindMixedBox }, offer.ErrDetailsInvalid},
		"an original price below the price":    {func(d *offer.Details) { d.OriginalPriceVND = 10_000 }, offer.ErrDetailsInvalid},
		"a weight of nothing":                  {func(d *offer.Details) { g := 0; d.WeightGrams = &g }, offer.ErrDetailsInvalid},
		"10% off":                              {func(d *offer.Details) { d.PriceVND = 22_500 }, offer.ErrDiscountTooSmall},
		"a window of 20 minutes":               {func(d *offer.Details) { d.WindowEnd = now.Add(20 * time.Minute) }, offer.ErrWindowInvalid},
		"a window of 7 hours":                  {func(d *offer.Details) { d.WindowEnd = now.Add(7 * time.Hour) }, offer.ErrWindowInvalid},
		"a window already over":                {func(d *offer.Details) { d.WindowStart, d.WindowEnd = now.Add(-3*time.Hour), now.Add(-time.Hour) }, offer.ErrWindowInvalid},
		"a window starting in more than a day": {func(d *offer.Details) { d.WindowStart, d.WindowEnd = now.Add(25*time.Hour), now.Add(26*time.Hour) }, offer.ErrWindowInvalid},
	} {
		d := bread(photo)
		c.change(&d)
		_, err := f.offers.Post(owner, sellerID, d)
		mustFail(t, name, err, c.want)
	}

	box := bread(photo)
	box.Kind, box.Description = offer.KindMixedBox, "2 to 4 pastries of the day"

	if _, err := f.offers.Post(owner, sellerID, box); err != nil {
		t.Errorf("a mixed box with what it holds: %v", err)
	}
}

func testOnlyActiveSellersPeoplePost(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	staff := f.as(t, "staff", platform.RoleCustomer)
	stranger := f.as(t, "stranger", platform.RoleCustomer)
	admin := f.as(t, "admin", platform.RoleAdmin)

	sellerID := f.activeSeller(owner, t, "staff")

	if _, err := f.offers.Post(staff, sellerID, bread(f.photo(staff, t))); err != nil {
		t.Errorf("staff posting: %v", err)
	}

	_, err := f.offers.Post(stranger, sellerID, bread(f.photo(stranger, t)))
	mustFail(t, "a stranger", err, seller.ErrNotFound)

	_, err = f.offers.Post(admin, sellerID, bread(f.photo(admin, t)))
	mustFail(t, "an admin, who does not publish", err, seller.ErrNotFound)

	_, err = f.offers.Post(t.Context(), sellerID, bread(uuid.New()))
	mustFail(t, "nobody signed in", err, platform.ErrAuthenticationRequired)

	if _, err := f.sellers.Block(admin, sellerID); err != nil {
		t.Fatal(err)
	}

	_, err = f.offers.Post(owner, sellerID, bread(f.photo(owner, t)))
	mustFail(t, "a blocked seller", err, seller.ErrNotActive)

	_, err = f.offers.OfSeller(stranger, sellerID, "", 20, 0)
	mustFail(t, "a stranger listing the seller's offers", err, seller.ErrNotFound)
}

func testPhotoIsPostersOrSellers(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	staff := f.as(t, "staff", platform.RoleCustomer)
	other := f.as(t, "other", platform.RoleCustomer)
	sellerID := f.activeSeller(owner, t, "staff")
	otherSeller := f.activeSeller(other, t)

	_, err := f.offers.Post(owner, sellerID, bread(f.photo(other, t)))
	mustFail(t, "a photo someone else uploaded", err, file.ErrPhotoNotFound)

	first, err := f.offers.Post(owner, sellerID, bread(f.photo(owner, t)))
	if err != nil {
		t.Fatal(err)
	}

	// Posting again: staff send the earlier offer's photo with new units.
	again := bread(first.PhotoID)
	again.Units = 3

	if _, err := f.offers.Post(staff, sellerID, again); err != nil {
		t.Errorf("staff posting again with the seller's photo: %v", err)
	}

	_, err = f.offers.Post(other, otherSeller, bread(first.PhotoID))
	mustFail(t, "another seller taking the photo", err, file.ErrPhotoNotFound)

	list, err := f.offers.OfSeller(staff, sellerID, "", 20, 0)
	if err != nil || len(list) != 2 || list[0].Units != 3 {
		t.Fatalf("the seller's offers, newest first: %d, %v", len(list), err)
	}
}

// order stands in for order (SEC-15), which takes units through offer's
// published API: units ordered are units taken from units_left.
func (f fixture) order(t *testing.T, id uuid.UUID, units int) {
	t.Helper()

	if _, err := f.pool.Exec(t.Context(), "UPDATE offer_offers SET units_left = units_left - $2 WHERE id = $1", id, units); err != nil {
		t.Fatal(err)
	}
}

func testOrdersLimitWhatChanges(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	stranger := f.as(t, "stranger", platform.RoleCustomer)
	sellerID := f.activeSeller(owner, t)

	o, err := f.offers.Post(owner, sellerID, bread(f.photo(owner, t)))
	if err != nil {
		t.Fatal(err)
	}

	price, later := int64(12_000), time.Now().Add(3*time.Hour)

	o, err = f.offers.Change(owner, o.ID, offer.Change{PriceVND: &price, WindowEnd: &later})
	if err != nil || o.PriceVND != 12_000 || o.DiscountPercent != 52 {
		t.Fatalf("a change before any order: %+v, %v", o, err)
	}

	_, err = f.offers.Change(stranger, o.ID, offer.Change{PriceVND: &price})
	mustFail(t, "a stranger changing it", err, offer.ErrNotFound)

	f.order(t, o.ID, 2)

	_, err = f.offers.Change(owner, o.ID, offer.Change{PriceVND: &price})
	mustFail(t, "the price once units are ordered", err, offer.ErrChangeNotAllowed)

	one := 1
	_, err = f.offers.Change(owner, o.ID, offer.Change{Units: &one})
	mustFail(t, "fewer units than ordered", err, offer.ErrChangeNotAllowed)

	eight, note := 8, "Ít cay"

	o, err = f.offers.Change(owner, o.ID, offer.Change{Units: &eight, Description: &note})
	if err != nil || o.Units != 8 || o.UnitsLeft != 6 || o.Description != note {
		t.Fatalf("units and description once units are ordered: %+v, %v", o, err)
	}

	if _, err := f.offers.Withdraw(owner, o.ID); err != nil {
		t.Fatal(err)
	}

	_, err = f.offers.Change(owner, o.ID, offer.Change{Description: &note})
	mustFail(t, "a withdrawn offer", err, offer.ErrChangeNotAllowed)
}

func testStatusFollowsUnitsWindowAndWithdrawal(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	stranger := f.as(t, "stranger", platform.RoleCustomer)
	sellerID := f.activeSeller(owner, t)
	photo := f.photo(owner, t)

	soldOut, err := f.offers.Post(owner, sellerID, bread(photo))
	if err != nil {
		t.Fatal(err)
	}

	f.order(t, soldOut.ID, 5)

	if o, err := f.offers.Get(t.Context(), soldOut.ID); err != nil || o.Status != offer.StatusSoldOut {
		t.Errorf("a sold-out offer stays visible to anyone: %+v, %v", o, err)
	}

	closed, err := f.offers.Post(owner, sellerID, bread(photo))
	if err != nil {
		t.Fatal(err)
	}

	if _, err := f.pool.Exec(t.Context(),
		"UPDATE offer_offers SET window_start = now() - interval '3 hours', window_end = now() - interval '1 hour' WHERE id = $1",
		closed.ID); err != nil {
		t.Fatal(err)
	}

	_, err = f.offers.Get(stranger, closed.ID)
	mustFail(t, "a closed offer read by a stranger", err, offer.ErrNotFound)

	if o, err := f.offers.Get(owner, closed.ID); err != nil || o.Status != offer.StatusClosed {
		t.Errorf("a closed offer read by its owner: %+v, %v", o, err)
	}

	_, err = f.offers.Withdraw(owner, closed.ID)
	mustFail(t, "withdrawing a closed offer", err, offer.ErrChangeNotAllowed)

	testWithdrawal(owner, stranger, t, f, sellerID, photo)

	for status, want := range map[offer.Status]uuid.UUID{offer.StatusSoldOut: soldOut.ID, offer.StatusClosed: closed.ID} {
		list, err := f.offers.OfSeller(owner, sellerID, status, 20, 0)
		if err != nil || len(list) != 1 || list[0].ID != want {
			t.Errorf("the seller's %s offers: %v, %v", status, list, err)
		}
	}
}

func testWithdrawal(owner, stranger context.Context, t *testing.T, f fixture, sellerID, photo uuid.UUID) {
	t.Helper()

	withdrawn, err := f.offers.Post(owner, sellerID, bread(photo))
	if err != nil {
		t.Fatal(err)
	}

	_, err = f.offers.Withdraw(stranger, withdrawn.ID)
	mustFail(t, "a stranger withdrawing", err, offer.ErrNotFound)

	for range 2 {
		if o, err := f.offers.Withdraw(owner, withdrawn.ID); err != nil || o.Status != offer.StatusWithdrawn || o.WithdrawnAt == nil {
			t.Fatalf("withdrawing, twice: %+v, %v", o, err)
		}
	}

	_, err = f.offers.Get(t.Context(), withdrawn.ID)
	mustFail(t, "a withdrawn offer read by anyone", err, offer.ErrNotFound)

	list, err := f.offers.OfSeller(owner, sellerID, offer.StatusWithdrawn, 20, 0)
	if err != nil || len(list) != 1 || list[0].ID != withdrawn.ID {
		t.Errorf("the seller's withdrawn offers: %v, %v", list, err)
	}
}

func testSettingsBoundEveryPost(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	admin := f.as(t, "admin", platform.RoleAdmin)
	sellerID := f.activeSeller(owner, t)
	photo := f.photo(owner, t)

	_, err := f.offers.Settings(owner)
	mustFail(t, "a customer reading the settings", err, platform.ErrAdminRequired)

	set, err := f.offers.Settings(admin)
	if err != nil || set.MinDiscountPercent != 20 || set.WindowMax != 6*time.Hour {
		t.Fatalf("the first settings: %+v, %v", set, err)
	}

	t.Cleanup(func() {
		ctx := context.WithoutCancel(admin)

		now, err := f.offers.Settings(ctx)
		if err == nil {
			_, err = f.offers.SaveSettings(ctx, set, now.UpdatedAt)
		}

		if err != nil {
			t.Error(err)
		}
	})

	stricter := set
	stricter.MinDiscountPercent = 50
	stricter.MaxRadiusKm = set.MaxRadiusKm + 1

	saved, err := f.offers.SaveSettings(admin, stricter, set.UpdatedAt)
	if err != nil {
		t.Fatal(err)
	}

	checkSettingsAudited(t, f, `["minDiscountPercent", "maxRadiusKm"]`)

	_, err = f.offers.Post(owner, sellerID, bread(photo))
	mustFail(t, "40% off under a 50% minimum", err, offer.ErrDiscountTooSmall)

	// Saving against the version read before the change is refused, and
	// saving what is there changes and records nothing (SEC-75).
	_, err = f.offers.SaveSettings(admin, set, set.UpdatedAt)
	mustFail(t, "saving over a change made since reading", err, platform.ErrChangedSinceRead)

	same, err := f.offers.SaveSettings(admin, stricter, saved.UpdatedAt)
	if err != nil || !same.UpdatedAt.Equal(saved.UpdatedAt) {
		t.Errorf("saving the same settings: %v, changed at %v, want %v unchanged", err, same.UpdatedAt, saved.UpdatedAt)
	}

	checkSettingsAudited(t, f, `["minDiscountPercent", "maxRadiusKm"]`)

	broken := set
	broken.MaxRadiusKm = set.DefaultRadiusKm - 1
	_, err = f.offers.SaveSettings(admin, broken, saved.UpdatedAt)
	mustFail(t, "a maximum radius below the default", err, offer.ErrSettingsInvalid)

	_, err = f.offers.SaveSettings(owner, set, saved.UpdatedAt)
	mustFail(t, "a customer saving the settings", err, platform.ErrAdminRequired)
}

// checkSettingsAudited checks that one change of the offer settings is
// recorded, the last naming fields.
func checkSettingsAudited(t *testing.T, f fixture, fields string) {
	t.Helper()

	var count int

	var last string
	if err := f.pool.QueryRow(t.Context(), `SELECT count(*),
		(SELECT details->>'fields' FROM audit_events WHERE action = 'offer_settings.change' ORDER BY occurred_at DESC, id DESC LIMIT 1)
		FROM audit_events WHERE action = 'offer_settings.change' AND actor_id IS NOT NULL`).Scan(&count, &last); err != nil {
		t.Fatal(err)
	}

	if count != 1 || last != fields {
		t.Errorf("%d changes of the offer settings recorded, the last naming %s; want 1 naming %s", count, last, fields)
	}
}

// catalogWorld is a seller with its people and one dish in its catalog, which the catalog's checks start from.
type catalogWorld struct {
	sellerID uuid.UUID
	photo    uuid.UUID
	dish     offer.Dish
}

func newCatalogWorld(owner context.Context, t *testing.T, f fixture) catalogWorld {
	t.Helper()

	var w catalogWorld

	w.sellerID = f.activeSeller(owner, t, "staff")
	w.photo = f.photo(owner, t)

	dish, err := f.offers.AddDish(owner, w.sellerID, offer.DishDetails{
		Name: "  Túi bánh mì  ", Kind: offer.KindBakery, Ingredients: "bột mì, trứng, sữa", PhotoID: w.photo,
	})
	if err != nil {
		t.Fatal(err)
	}

	if dish.Name != "Túi bánh mì" || dish.Unit != "suất" || dish.Hidden || dish.Ingredients != "bột mì, trứng, sữa" {
		t.Fatalf("added %+v", dish)
	}

	w.dish = dish

	return w
}

func testCatalogKeepsTheStableBase(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	w := newCatalogWorld(owner, t, f)

	for name, change := range map[string]func(*offer.DishDetails){
		"a blank name":             func(d *offer.DishDetails) { d.Name = " " },
		"an unknown kind":          func(d *offer.DishDetails) { d.Kind = "fruit" },
		"too many ingredients":     func(d *offer.DishDetails) { d.Ingredients = strings.Repeat("x", 501) },
		"a unit of 21 letters":     func(d *offer.DishDetails) { d.Unit = strings.Repeat("x", 21) },
		"an original price of 500": func(d *offer.DishDetails) { p := int64(500); d.OriginalPriceVND = &p },
		"no photo":                 func(d *offer.DishDetails) { d.PhotoID = uuid.Nil },
		"a description too long":   func(d *offer.DishDetails) { d.Description = strings.Repeat("x", 1001) },
	} {
		d := offer.DishDetails{Name: "Xôi", Kind: offer.KindPreparedFood, PhotoID: w.photo}
		change(&d)
		_, err := f.offers.AddDish(owner, w.sellerID, d)
		mustFail(t, name, err, offer.ErrDetailsInvalid)
	}

	// The original price is optional, and taken away by sending 0.
	price := int64(95_000)

	priced, err := f.offers.AddDish(owner, w.sellerID, offer.DishDetails{
		Name: "Xôi thập cẩm", Kind: offer.KindPreparedFood, PhotoID: w.photo, OriginalPriceVND: &price,
	})
	if err != nil || priced.OriginalPriceVND == nil || *priced.OriginalPriceVND != 95_000 || w.dish.OriginalPriceVND != nil {
		t.Fatalf("priced %+v, %v", priced, err)
	}

	zero := int64(0)

	if cleared, err := f.offers.ChangeDish(owner, priced.ID, offer.DishChange{OriginalPriceVND: &zero}); err != nil || cleared.OriginalPriceVND != nil {
		t.Fatalf("cleared %+v, %v", cleared, err)
	}

	if err := f.offers.RemoveDish(owner, priced.ID); err != nil {
		t.Fatal(err)
	}
}

func testCatalogIsPrivateToTheSellersPeople(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	staff := f.as(t, "staff", platform.RoleCustomer)
	stranger := f.as(t, "stranger", platform.RoleCustomer)
	admin := f.as(t, "admin", platform.RoleAdmin)
	w := newCatalogWorld(owner, t, f)

	if got, err := f.offers.Dishes(staff, w.sellerID); err != nil || len(got) != 1 {
		t.Errorf("staff reading: %v, %v", got, err)
	}

	_, err := f.offers.Dishes(stranger, w.sellerID)
	mustFail(t, "a stranger reading", err, seller.ErrNotFound)

	_, err = f.offers.Dishes(admin, w.sellerID)
	mustFail(t, "an admin, who does not publish", err, seller.ErrNotFound)

	_, err = f.offers.AddDish(stranger, w.sellerID, offer.DishDetails{Name: "Xôi", Kind: offer.KindPreparedFood, PhotoID: w.photo})
	mustFail(t, "a stranger adding", err, seller.ErrNotFound)

	_, err = f.offers.ChangeDish(stranger, w.dish.ID, offer.DishChange{})
	mustFail(t, "a stranger changing", err, offer.ErrDishNotFound)
}

func testPostsCopyTheirDish(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	staff := f.as(t, "staff", platform.RoleCustomer)
	w := newCatalogWorld(owner, t, f)

	// A post copies the dish, and may show its photo; changing the dish later leaves the post alone.
	posted, err := f.offers.Post(staff, w.sellerID, offer.Details{
		Name: w.dish.Name, Kind: w.dish.Kind, Units: 3, PriceVND: 15_000, OriginalPriceVND: 25_000,
		PhotoID: w.dish.PhotoID, WindowStart: time.Now(), WindowEnd: time.Now().Add(time.Hour),
	})
	if err != nil {
		t.Fatalf("posting from the dish: %v", err)
	}

	name, hidden := "Túi bánh mì lớn", true

	changed, err := f.offers.ChangeDish(staff, w.dish.ID, offer.DishChange{Name: &name, Hidden: &hidden})
	if err != nil || changed.Name != name || !changed.Hidden || changed.Unit != "suất" {
		t.Fatalf("changed %+v, %v", changed, err)
	}

	if got, err := f.offers.Get(owner, posted.ID); err != nil || got.Name != "Túi bánh mì" {
		t.Errorf("the offer after the dish changed: %+v, %v", got, err)
	}

	if err := f.offers.RemoveDish(owner, w.dish.ID); err != nil {
		t.Fatal(err)
	}

	if got, err := f.offers.Get(owner, posted.ID); err != nil || got.Name != "Túi bánh mì" {
		t.Errorf("the offer after the dish was deleted: %+v, %v", got, err)
	}

	mustFail(t, "deleting twice", f.offers.RemoveDish(owner, w.dish.ID), offer.ErrDishNotFound)

	if got, err := f.offers.Dishes(owner, w.sellerID); err != nil || len(got) != 0 {
		t.Errorf("the catalog after deleting: %v, %v", got, err)
	}
}

func testCatalogHoldsAHundredDishes(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	sellerID := f.activeSeller(owner, t)
	photo := f.photo(owner, t)

	for n := range 100 {
		d := offer.DishDetails{Name: fmt.Sprintf("Món %d", n), Kind: offer.KindOther, PhotoID: photo}
		if _, err := f.offers.AddDish(owner, sellerID, d); err != nil {
			t.Fatalf("dish %d: %v", n, err)
		}
	}

	_, err := f.offers.AddDish(owner, sellerID, offer.DishDetails{Name: "Một món nữa", Kind: offer.KindOther, PhotoID: photo})
	mustFail(t, "the 101st dish", err, offer.ErrDishLimitReached)
}
