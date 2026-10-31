package order_test

import (
	"bytes"
	"context"
	"errors"
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
	"github.com/kl3inIT/second-bite/server/internal/order"
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
	orders   *order.Service
	trail    *audit.Service
	prefix   string
}

// TestOrder runs the module's checks in parallel against one PostgreSQL, each
// with accounts, sellers and offers of its own.
func TestOrder(t *testing.T) {
	t.Parallel()

	pool := platformtest.StartPostgres(t)

	for name, check := range map[string]func(*testing.T, fixture){
		"placing takes units and confirms at once": testPlacingTakesUnits,
		"a cart refused takes nothing":             testRefusedCartTakesNothing,
		"two customers race for the last unit":     testRaceForTheLastUnit,
		"who reads an order":                       testWhoReadsAnOrder,
		"cancelling until the order is ready":      testCancelUntilReady,
		"handing over":                             testHandOver,
		"a collected order is rated once":          testRateOnce,
		"staff refuse an order":                    testStaffRefuse,
		"expiry is read from the window":           testExpiryReadFromTheWindow,
		"a seller lists the orders of a day":       testSellerListsADay,
		"the customer lists open and ended orders": testCustomerLists,
		"an order without an account":              testOrderWithoutAccount,
		"no answer or no show gives units back":    testNoShowGivesUnitsBack,
		"a mistake is taken back":                  testReopen,
		"some orders are not reopened":             testReopenStaysShut,
		"admins read what an account ordered":      testHistoryForAdmins,
		"orders follow their offer's window":       testOrdersFollowTheWindow,
		"orders and offers follow their seller":    testOrdersAndOffersFollowTheSeller,
		"ended orders expire in the table":         testEndedOrdersExpire,
		"withdrawing an offer refuses its orders":  testWithdrawRefusesOrders,
		"the two sides of an order talk":           testChatConversation,
		"who takes part in a chat":                 testChatWhoTakesPart,
		"a chat closes with its order":             testChatClosesWithTheOrder,
		"a chat is bounded":                        testChatBounds,
		"messages are numbered in commit order":    testChatNumbersInCommitOrder,
		"live tickets work once, for who may":      testLiveTickets,
		"every change of an order notifies":        testEveryChangeNotifies,
		"old chats are forgotten":                  testOldChatsAreForgotten,
		"admins list every seller's orders":        testAdminsListOrders,
		"admins hide a review and show it again":   testAdminsHideReviews,
		"sellers read the reviews of their store":  testSellerReadsReviews,
		"the report counts the days":               testReportCounts,
		"pushes tell of each change":               testPushesTellOfEachChange,
		"pushes tell of time":                      testPushesTellOfTime,
		"a problem is reported and answered":       testProblemReportedAndAnswered,
		"a problem is reported within two days":    testProblemWithinTwoDays,
		"a seller deleted waits for its orders":    testSellerDeletionWaitsForOrders,
		"a promotion takes its discounts":          testPromotionDiscounts,
		"a promotion stops at its budget":          testPromotionBudget,
		"an order takes the best promotion":        testPromotionBestRule,
		"admins run promotions and pay sellers":    testPromotionsForAdmins,
	} {
		t.Run(name, func(t *testing.T) {
			t.Parallel()
			check(t, newFixture(t, pool))
		})
	}
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

	trail := audit.NewService(pool, platformtest.Logger())

	events, err := platform.NewEvents(pool, platformtest.Logger())
	if err != nil {
		t.Fatal(err)
	}

	sellers := seller.NewService(pool, accounts, files, nil, events, trail, platformtest.Logger()) // its listeners do not run here
	offers := offer.NewService(pool, sellers, files, events, trail, platformtest.Logger())

	orders := order.NewService(pool, offers, sellers, nil, trail, platformtest.Logger())

	return fixture{
		pool: pool, accounts: accounts, files: files, sellers: sellers, offers: offers, orders: orders, trail: trail,
		prefix: "order." + strings.ReplaceAll(uuid.NewString(), "-", ""),
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

// shop opens a seller of that name owned by owner, with staff; a seller is
// active once opened.
func (f fixture) shop(owner context.Context, t *testing.T, name string, staff ...string) uuid.UUID {
	t.Helper()

	s, err := f.sellers.Open(owner, seller.Details{
		Name: name, Address: "Tasco Mall, Việt Hưng", Latitude: 21.0565, Longitude: 105.8964, Phone: "0912345678",
	})
	if err != nil {
		t.Fatal(err)
	}

	for _, name := range staff {
		if _, err := f.sellers.AddStaff(owner, s.ID, f.prefix+"."+name+"@example.com"); err != nil {
			t.Fatal(err)
		}
	}

	return s.ID
}

// post puts an offer of units on sale for a seller, at a price, collected
// from start for two hours.
func (f fixture) post(owner context.Context, t *testing.T, sellerID uuid.UUID, name string, units int, price int64, start time.Time) offer.Offer {
	t.Helper()

	var buf bytes.Buffer
	if err := png.Encode(&buf, image.NewGray(image.Rect(0, 0, 8, 8))); err != nil {
		t.Fatal(err)
	}

	p, err := f.files.Upload(owner, buf.Bytes())
	if err != nil {
		t.Fatal(err)
	}

	o, err := f.offers.Post(owner, sellerID, offer.Details{
		Name: name, Kind: offer.KindBakery, Units: units, PriceVND: price, OriginalPriceVND: price * 2,
		PhotoID: p.ID, WindowStart: start, WindowEnd: start.Add(2 * time.Hour),
	})
	if err != nil {
		t.Fatal(err)
	}

	return o
}

func (f fixture) unitsLeft(owner context.Context, t *testing.T, offerID uuid.UUID) int {
	t.Helper()

	o, err := f.offers.Get(owner, offerID)
	if err != nil {
		t.Fatal(err)
	}

	return o.UnitsLeft
}

// shift moves an order's window by d, as time passing would.
func (f fixture) shift(t *testing.T, orderID uuid.UUID, d time.Duration) {
	t.Helper()

	if _, err := f.pool.Exec(t.Context(),
		`UPDATE order_orders SET window_start = window_start + $2::interval, window_end = window_end + $2::interval WHERE id = $1`,
		orderID, d.String()); err != nil {
		t.Fatal(err)
	}
}

func mustFail(t *testing.T, what string, err, want error) {
	t.Helper()

	if !errors.Is(err, want) {
		t.Errorf("%s: %v, want %v", what, err, want)
	}
}

// rated places an order of one unit of o for customer, has owner hand it over and has customer rate it.
func (f fixture) rated(owner, customer context.Context, t *testing.T, o offer.Offer, review order.Review) order.Order {
	t.Helper()

	placed, err := f.orders.Place(customer, key(), uuid.Nil, someone, []order.Wanted{{o.ID, 1}})
	if err != nil {
		t.Fatal(err)
	}

	if _, err := f.orders.HandOver(owner, placed.ID); err != nil {
		t.Fatal(err)
	}

	if _, err := f.orders.Rate(customer, placed.ID, "", review); err != nil {
		t.Fatal(err)
	}

	return placed
}

func key() string { return uuid.NewString() }

// someone is who collects the orders of these checks.
var someone = order.Contact{Name: "Minh Anh", Phone: "0900000000"}

func testPlacingTakesUnits(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	customer := f.as(t, "customer", platform.RoleCustomer)
	shop := f.shop(owner, t, "La Paris")
	now := time.Now()
	croissant := f.post(owner, t, shop, "Croissant", 5, 20_000, now)
	bread := f.post(owner, t, shop, "Bánh mì chà bông", 3, 30_000, now.Add(30*time.Minute))

	k := key()

	o, err := f.orders.Place(customer, k, uuid.Nil, someone, []order.Wanted{{OfferID: croissant.ID, Units: 2}, {OfferID: bread.ID, Units: 1}})
	if err != nil {
		t.Fatal(err)
	}

	if o.Status != order.StatusConfirmed || o.TotalVND != 70_000 || len(o.Lines) != 2 || o.SellerName != "La Paris" {
		t.Fatalf("placed %+v", o)
	}

	// The window both offers share; the number people read aloud.
	if !o.WindowStart.Equal(bread.WindowStart) || !o.WindowEnd.Equal(croissant.WindowEnd) || o.Number < 10_001 {
		t.Errorf("placed %+v", o)
	}

	if got := f.unitsLeft(owner, t, croissant.ID); got != 3 {
		t.Errorf("croissants left: %d", got)
	}

	again, err := f.orders.Place(customer, k, uuid.Nil, someone, []order.Wanted{{OfferID: croissant.ID, Units: 2}})
	if err != nil || again.ID != o.ID {
		t.Errorf("the same key again: %v, %v", again.ID, err)
	}

	if got := f.unitsLeft(owner, t, croissant.ID); got != 3 {
		t.Errorf("croissants left after the same key again: %d", got)
	}

	keyAndContactRequired(customer, t, f, croissant.ID)
}

// keyAndContactRequired places an order without a key, then without a name
// or with a phone number that is not Vietnamese.
func keyAndContactRequired(customer context.Context, t *testing.T, f fixture, offerID uuid.UUID) {
	t.Helper()

	for _, k := range []string{"", "short-key-15chr"} {
		_, err := f.orders.Place(customer, k, uuid.Nil, someone, []order.Wanted{{OfferID: offerID, Units: 1}})
		mustFail(t, "the key "+k, err, order.ErrIdempotencyKeyInvalid)
	}

	for _, c := range []order.Contact{{Name: " ", Phone: "0900000000"}, {Name: "Minh Anh", Phone: "12345"}} {
		_, err := f.orders.Place(customer, key(), uuid.Nil, c, []order.Wanted{{OfferID: offerID, Units: 1}})
		mustFail(t, "contact "+c.Name+" "+c.Phone, err, order.ErrContactInvalid)
	}
}

// testOrderWithoutAccount places an order with nobody signed in: it is read
// and cancelled with its access only, and the same key from another phone
// number places another order.
func testOrderWithoutAccount(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	shop := f.shop(owner, t, "Panda Chef")
	later := f.post(owner, t, shop, "Bánh bao", 5, 20_000, time.Now().Add(2*time.Hour))
	guest := t.Context()
	k := key()

	o, err := f.orders.Place(guest, k, uuid.Nil, order.Contact{Name: " Hà ", Phone: "+84 900 000 001"}, []order.Wanted{{later.ID, 1}})
	if err != nil {
		t.Fatal(err)
	}

	if o.CustomerID.Valid || o.Contact != (order.Contact{Name: "Hà", Phone: "0900000001"}) || o.Access == "" {
		t.Fatalf("placed without an account: %+v", o)
	}

	again, err := f.orders.Place(guest, k, uuid.Nil, order.Contact{Name: "Hà", Phone: "0900000001"}, []order.Wanted{{later.ID, 1}})
	if err != nil || again.ID != o.ID {
		t.Fatalf("the same key and phone again: %v, %v", again.ID, err)
	}

	other, err := f.orders.Place(guest, k, uuid.Nil, order.Contact{Name: "Lan", Phone: "0900000002"}, []order.Wanted{{later.ID, 1}})
	if err != nil || other.ID == o.ID || other.Access == o.Access {
		t.Fatalf("the same key from another phone: %v, %v", other.ID, err)
	}

	readAndCancelWithAccess(guest, t, f, o, other.Access)
}

// readAndCancelWithAccess reads and cancels o, placed without an account,
// with nothing, another order's access, then its own.
func readAndCancelWithAccess(guest context.Context, t *testing.T, f fixture, o order.Order, another string) {
	t.Helper()

	_, err := f.orders.Get(guest, o.ID, "")
	mustFail(t, "reading without the access", err, order.ErrNotFound)

	_, err = f.orders.Get(guest, o.ID, another)
	mustFail(t, "reading with another order's access", err, order.ErrNotFound)

	read, err := f.orders.Get(guest, o.ID, o.Access)
	if err != nil || read.Access != o.Access {
		t.Fatalf("reading with the access: %+v, %v", read, err)
	}

	_, err = f.orders.Cancel(guest, o.ID, "", "")
	mustFail(t, "cancelling without the access", err, order.ErrNotFound)

	cancelled, err := f.orders.Cancel(guest, o.ID, o.Access, "")
	if err != nil || cancelled.Status != order.StatusCancelled {
		t.Fatalf("cancelling with the access: %+v, %v", cancelled, err)
	}
}

func testRefusedCartTakesNothing(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	other := f.as(t, "other", platform.RoleCustomer)
	customer := f.as(t, "customer", platform.RoleCustomer)
	shop := f.shop(owner, t, "La Paris")
	elsewhere := f.shop(other, t, "Quầy xôi")
	now := time.Now()
	croissant := f.post(owner, t, shop, "Croissant", 5, 20_000, now)
	bread := f.post(owner, t, shop, "Bánh mì", 1, 30_000, now)
	xoi := f.post(other, t, elsewhere, "Xôi xéo", 4, 15_000, now)
	late := f.post(owner, t, shop, "Bánh bao", 4, 15_000, now.Add(3*time.Hour))

	for name, c := range map[string]struct {
		wanted []order.Wanted
		want   error
	}{
		"more than the units left":   {[]order.Wanted{{croissant.ID, 1}, {bread.ID, 2}}, order.ErrOfferSoldOut},
		"two sellers in one cart":    {[]order.Wanted{{croissant.ID, 1}, {xoi.ID, 1}}, order.ErrLinesInvalid},
		"one offer twice":            {[]order.Wanted{{croissant.ID, 1}, {croissant.ID, 1}}, order.ErrLinesInvalid},
		"no unit":                    {[]order.Wanted{{croissant.ID, 0}}, order.ErrLinesInvalid},
		"no line":                    {nil, order.ErrLinesInvalid},
		"windows that do not meet":   {[]order.Wanted{{croissant.ID, 1}, {late.ID, 1}}, order.ErrWindowsDoNotMeet},
		"an offer that is not there": {[]order.Wanted{{uuid.New(), 1}}, order.ErrOfferUnavailable},
	} {
		_, err := f.orders.Place(customer, key(), uuid.Nil, someone, c.wanted)
		mustFail(t, name, err, c.want)
	}

	if got := f.unitsLeft(owner, t, croissant.ID); got != 5 {
		t.Errorf("croissants left after refused carts: %d", got)
	}

	if _, err := f.offers.Withdraw(owner, bread.ID); err != nil {
		t.Fatal(err)
	}

	_, err := f.orders.Place(customer, key(), uuid.Nil, someone, []order.Wanted{{bread.ID, 1}})
	mustFail(t, "a withdrawn offer", err, order.ErrOfferUnavailable)

	if _, err := f.sellers.Block(f.as(t, "admin", platform.RoleAdmin), shop, "Bán món đã quá hạn sử dụng"); err != nil {
		t.Fatal(err)
	}

	_, err = f.orders.Place(customer, key(), uuid.Nil, someone, []order.Wanted{{croissant.ID, 1}})
	mustFail(t, "a blocked seller", err, order.ErrOfferUnavailable)
}

func testRaceForTheLastUnit(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	shop := f.shop(owner, t, "La Paris")
	last := f.post(owner, t, shop, "Croissant", 1, 20_000, time.Now())
	first, second := f.as(t, "first", platform.RoleCustomer), f.as(t, "second", platform.RoleCustomer)

	errs := make(chan error, 2)

	for _, customer := range []context.Context{first, second} {
		go func() {
			_, err := f.orders.Place(customer, key(), uuid.Nil, someone, []order.Wanted{{last.ID, 1}})
			errs <- err
		}()
	}

	a, b := <-errs, <-errs
	if (a == nil) == (b == nil) {
		t.Fatalf("two customers for the last unit: %v, %v", a, b)
	}

	mustFail(t, "the second customer", errors.Join(a, b), order.ErrOfferSoldOut)
}

func testWhoReadsAnOrder(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	staff := f.as(t, "staff", platform.RoleCustomer)
	customer := f.as(t, "customer", platform.RoleCustomer)
	stranger := f.as(t, "stranger", platform.RoleCustomer)
	admin := f.as(t, "admin", platform.RoleAdmin)
	shop := f.shop(owner, t, "La Paris", "staff")
	later := f.post(owner, t, shop, "Croissant", 5, 20_000, time.Now().Add(time.Hour))

	o, err := f.orders.Place(customer, key(), uuid.Nil, someone, []order.Wanted{{later.ID, 1}})
	if err != nil {
		t.Fatal(err)
	}

	for name, reader := range map[string]context.Context{"its seller's staff": staff, "an admin": admin} {
		if _, err := f.orders.Get(reader, o.ID, ""); err != nil {
			t.Errorf("%s: %v", name, err)
		}
	}

	_, err = f.orders.Get(stranger, o.ID, "")
	mustFail(t, "a stranger", err, order.ErrNotFound)

	if _, err := f.orders.Ready(staff, o.ID); err != nil {
		t.Fatal(err)
	}

	mine, err := f.orders.Get(customer, o.ID, "")
	if err != nil || mine.Status != order.StatusReady || mine.Access == "" {
		t.Fatalf("the customer's order once ready: %+v, %v", mine, err)
	}

	if theirs, _ := f.orders.Get(staff, o.ID, ""); theirs.Access != "" {
		t.Errorf("staff were shown the customer's access")
	}

	_, err = f.orders.Ready(admin, o.ID)
	mustFail(t, "an admin acting for the seller", err, order.ErrNotFound)
}

func testCancelUntilReady(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	customer := f.as(t, "customer", platform.RoleCustomer)
	shop := f.shop(owner, t, "La Paris")
	later := f.post(owner, t, shop, "Croissant", 5, 20_000, time.Now().Add(time.Hour))
	now := f.post(owner, t, shop, "Bánh mì", 5, 20_000, time.Now())

	o, err := f.orders.Place(customer, key(), uuid.Nil, someone, []order.Wanted{{later.ID, 3}})
	if err != nil {
		t.Fatal(err)
	}

	_, err = f.orders.Cancel(owner, o.ID, "", "")
	mustFail(t, "the seller cancelling", err, order.ErrNotFound)

	cancelled, err := f.orders.Cancel(customer, o.ID, "", "không đến kịp")
	if err != nil || cancelled.Status != order.StatusCancelled || cancelled.CancelReason != "không đến kịp" {
		t.Fatalf("cancelled %+v, %v", cancelled, err)
	}

	if got := f.unitsLeft(owner, t, later.ID); got != 5 {
		t.Errorf("units back after cancelling: %d", got)
	}

	_, err = f.orders.Cancel(customer, o.ID, "", "")
	mustFail(t, "cancelling twice", err, order.ErrCancelTooLate)

	open, err := f.orders.Place(customer, key(), uuid.Nil, someone, []order.Wanted{{now.ID, 1}})
	if err != nil {
		t.Fatal(err)
	}

	// Until the seller marks it ready, the window's opening does not stop the customer (SEC-121).
	if _, err := f.orders.Cancel(customer, open.ID, "", ""); err != nil {
		t.Fatalf("cancelling once the window has opened, before ready: %v", err)
	}

	ready, err := f.orders.Place(customer, key(), uuid.Nil, someone, []order.Wanted{{now.ID, 1}})
	if err != nil {
		t.Fatal(err)
	}

	if _, err := f.orders.Ready(owner, ready.ID); err != nil {
		t.Fatal(err)
	}

	_, err = f.orders.Cancel(customer, ready.ID, "", "")
	mustFail(t, "cancelling once ready", err, order.ErrCancelTooLate)
}

func testHandOver(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	customer := f.as(t, "customer", platform.RoleCustomer)
	stranger := f.as(t, "stranger", platform.RoleCustomer)
	shop := f.shop(owner, t, "La Paris")
	croissant := f.post(owner, t, shop, "Croissant", 5, 20_000, time.Now())
	later := f.post(owner, t, shop, "Bánh mì", 5, 20_000, time.Now().Add(time.Hour))

	o, err := f.orders.Place(customer, key(), uuid.Nil, someone, []order.Wanted{{croissant.ID, 1}})
	if err != nil {
		t.Fatal(err)
	}

	_, err = f.orders.HandOver(stranger, o.ID)
	mustFail(t, "a stranger", err, order.ErrNotFound)

	collected, err := f.orders.HandOver(owner, o.ID)
	if err != nil || collected.Status != order.StatusCollected || collected.CollectedAt == nil {
		t.Fatalf("handed over %+v, %v", collected, err)
	}

	_, err = f.orders.HandOver(owner, o.ID)
	mustFail(t, "handing over twice", err, order.ErrTransitionNotAllowed)

	_, err = f.orders.Refuse(owner, o.ID, order.RefuseOther, "")
	mustFail(t, "refusing a collected order", err, order.ErrTransitionNotAllowed)

	early, err := f.orders.Place(customer, key(), uuid.Nil, someone, []order.Wanted{{later.ID, 1}})
	if err != nil {
		t.Fatal(err)
	}

	_, err = f.orders.HandOver(owner, early.ID)
	mustFail(t, "before the window opens", err, order.ErrOutsideWindow)
}

func testStaffRefuse(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	staff := f.as(t, "staff", platform.RoleCustomer)
	customer := f.as(t, "customer", platform.RoleCustomer)
	shop := f.shop(owner, t, "La Paris", "staff")
	croissant := f.post(owner, t, shop, "Croissant", 5, 20_000, time.Now())

	o, err := f.orders.Place(customer, key(), uuid.Nil, someone, []order.Wanted{{croissant.ID, 2}})
	if err != nil {
		t.Fatal(err)
	}

	_, err = f.orders.Refuse(staff, o.ID, "bad", "")
	mustFail(t, "an unknown reason", err, order.ErrRefusalInvalid)

	_, err = f.orders.Refuse(customer, o.ID, order.RefuseNotSuitable, "")
	mustFail(t, "the customer refusing", err, order.ErrNotFound)

	refused, err := f.orders.Refuse(staff, o.ID, order.RefuseNotSuitable, "bánh bị móp")
	if err != nil || refused.Status != order.StatusRefused || refused.RefuseReason != order.RefuseNotSuitable ||
		refused.RefuseNote != "bánh bị móp" {
		t.Fatalf("refused %+v, %v", refused, err)
	}

	if got := f.unitsLeft(owner, t, croissant.ID); got != 3 {
		t.Errorf("units after a refusal, which are not offered again: %d", got)
	}

	_, err = f.orders.Ready(staff, o.ID)
	mustFail(t, "ready once refused", err, order.ErrTransitionNotAllowed)
}

func testNoShowGivesUnitsBack(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	customer := f.as(t, "customer", platform.RoleCustomer)
	shop := f.shop(owner, t, "La Paris")
	croissant := f.post(owner, t, shop, "Croissant", 5, 20_000, time.Now())

	for reason, back := range map[order.RefuseReason]bool{
		order.RefuseNoAnswer: true, order.RefuseNoShow: true, order.RefuseLate: true,
		order.RefuseSoldOut: false, order.RefuseOther: false,
	} {
		o, err := f.orders.Place(customer, key(), uuid.Nil, someone, []order.Wanted{{croissant.ID, 1}})
		if err != nil {
			t.Fatal(err)
		}

		before := f.unitsLeft(owner, t, croissant.ID)

		refused, err := f.orders.Refuse(owner, o.ID, reason, "")
		if err != nil || refused.Status != order.StatusRefused || refused.RefuseReason != reason {
			t.Fatalf("refused for %s: %+v, %v", reason, refused, err)
		}

		want := before
		if back {
			want++
		}

		if got := f.unitsLeft(owner, t, croissant.ID); got != want {
			t.Errorf("units after %s: %d, want %d", reason, got, want)
		}
	}
}

func testReopen(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	customer := f.as(t, "customer", platform.RoleCustomer)
	stranger := f.as(t, "stranger", platform.RoleCustomer)
	shop := f.shop(owner, t, "La Paris")
	// The window opens in an hour, so its customer may still cancel; the order's own window is moved to
	// now, so that it can be handed over.
	croissant := f.post(owner, t, shop, "Croissant", 2, 20_000, time.Now().Add(time.Hour))

	o, err := f.orders.Place(customer, key(), uuid.Nil, someone, []order.Wanted{{croissant.ID, 2}})
	if err != nil {
		t.Fatal(err)
	}

	f.shift(t, o.ID, -2*time.Hour)

	_, err = f.orders.Reopen(owner, o.ID)
	mustFail(t, "reopening an open order", err, order.ErrTransitionNotAllowed)

	if _, err := f.orders.HandOver(owner, o.ID); err != nil {
		t.Fatal(err)
	}

	_, err = f.orders.Reopen(stranger, o.ID)
	mustFail(t, "a stranger reopening", err, order.ErrNotFound)

	again, err := f.orders.Reopen(owner, o.ID)
	if err != nil || again.Status != order.StatusConfirmed || again.CollectedAt != nil {
		t.Fatalf("a hand-over taken back: %+v, %v", again, err)
	}

	// A no-show gave its units back; someone took them; taking the refusal back fails.
	if _, err := f.orders.Refuse(owner, o.ID, order.RefuseNoShow, ""); err != nil {
		t.Fatal(err)
	}

	other, err := f.orders.Place(customer, key(), uuid.Nil, someone, []order.Wanted{{croissant.ID, 2}})
	if err != nil {
		t.Fatal(err)
	}

	_, err = f.orders.Reopen(owner, o.ID)
	mustFail(t, "reopening when the units are gone", err, order.ErrOfferSoldOut)

	if _, err := f.orders.Cancel(customer, other.ID, "", ""); err != nil {
		t.Fatal(err)
	}

	back, err := f.orders.Reopen(owner, o.ID)
	if err != nil || back.Status != order.StatusConfirmed || back.RefuseReason != "" {
		t.Fatalf("a no-show taken back: %+v, %v", back, err)
	}

	if got := f.unitsLeft(owner, t, croissant.ID); got != 0 {
		t.Errorf("units once the refusal is taken back: %d", got)
	}
}

func testReopenStaysShut(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	customer := f.as(t, "customer", platform.RoleCustomer)
	shop := f.shop(owner, t, "La Paris")
	croissant := f.post(owner, t, shop, "Croissant", 3, 20_000, time.Now().Add(time.Hour))

	cancelled, err := f.orders.Place(customer, key(), uuid.Nil, someone, []order.Wanted{{croissant.ID, 1}})
	if err != nil {
		t.Fatal(err)
	}

	// What its customer cancelled, or whose window is over, stays as it is.
	if _, err := f.orders.Cancel(customer, cancelled.ID, "", ""); err != nil {
		t.Fatal(err)
	}

	_, err = f.orders.Reopen(owner, cancelled.ID)
	mustFail(t, "reopening what its customer cancelled", err, order.ErrTransitionNotAllowed)

	late, err := f.orders.Place(customer, key(), uuid.Nil, someone, []order.Wanted{{croissant.ID, 1}})
	if err != nil {
		t.Fatal(err)
	}

	f.shift(t, late.ID, -2*time.Hour)

	if _, err := f.orders.HandOver(owner, late.ID); err != nil {
		t.Fatal(err)
	}

	f.shift(t, late.ID, -4*time.Hour)

	_, err = f.orders.Reopen(owner, late.ID)
	mustFail(t, "reopening once the window is over", err, order.ErrTransitionNotAllowed)
}

func testOrdersFollowTheWindow(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	customer := f.as(t, "customer", platform.RoleCustomer)
	shop := f.shop(owner, t, "La Paris")
	croissant := f.post(owner, t, shop, "Croissant", 5, 20_000, time.Now())

	open, err := f.orders.Place(customer, key(), uuid.Nil, someone, []order.Wanted{{croissant.ID, 1}})
	if err != nil {
		t.Fatal(err)
	}

	handed, err := f.orders.Place(customer, key(), uuid.Nil, someone, []order.Wanted{{croissant.ID, 1}})
	if err != nil {
		t.Fatal(err)
	}

	if _, err := f.orders.HandOver(owner, handed.ID); err != nil {
		t.Fatal(err)
	}

	start, end := time.Now().Add(time.Hour), time.Now().Add(3*time.Hour)
	if _, err := f.offers.Change(owner, croissant.ID, offer.Change{WindowStart: &start, WindowEnd: &end}); err != nil {
		t.Fatal(err)
	}

	// The listener does not run in this check; its handler is called as the event would.
	event := offer.WindowChangedEvent{OfferID: croissant.ID}
	for range 2 { // delivered twice, it changes nothing more
		if err := f.orders.FollowOfferWindow(t.Context(), event); err != nil {
			t.Fatal(err)
		}
	}

	moved, err := f.orders.Get(customer, open.ID, "")
	if err != nil || moved.WindowStart.Sub(start).Abs() > time.Second || moved.WindowEnd.Sub(end).Abs() > time.Second {
		t.Fatalf("the open order's window: %v to %v, want %v to %v (%v)", moved.WindowStart, moved.WindowEnd, start, end, err)
	}

	kept, err := f.orders.Get(customer, handed.ID, "")
	if err != nil || kept.WindowStart.Sub(start).Abs() < time.Minute {
		t.Fatalf("the handed-over order's window moved: %v (%v)", kept.WindowStart, err)
	}
}

func testWithdrawRefusesOrders(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	customer := f.as(t, "customer", platform.RoleCustomer)
	shop := f.shop(owner, t, "La Paris")
	croissant := f.post(owner, t, shop, "Croissant", 5, 20_000, time.Now())
	eclair := f.post(owner, t, shop, "Eclair", 5, 25_000, time.Now())

	both, err := f.orders.Place(customer, key(), uuid.Nil, someone, []order.Wanted{{croissant.ID, 2}, {eclair.ID, 1}})
	if err != nil {
		t.Fatal(err)
	}

	handed, err := f.orders.Place(customer, key(), uuid.Nil, someone, []order.Wanted{{croissant.ID, 1}})
	if err != nil {
		t.Fatal(err)
	}

	if _, err := f.orders.HandOver(owner, handed.ID); err != nil {
		t.Fatal(err)
	}

	if _, err := f.offers.Withdraw(owner, croissant.ID); err != nil {
		t.Fatal(err)
	}

	// The listener does not run in this check; its handler is called as the event would.
	event := offer.WithdrawnEvent{OfferID: croissant.ID}
	for range 2 { // delivered twice, it changes nothing more
		if err := f.orders.RefuseWithdrawnOffer(t.Context(), event); err != nil {
			t.Fatal(err)
		}
	}

	refused, err := f.orders.Get(customer, both.ID, "")
	if err != nil || refused.Status != order.StatusRefused || refused.RefuseReason != order.RefuseWithdrawn {
		t.Fatalf("the open order: %+v (%v)", refused, err)
	}

	kept, err := f.orders.Get(customer, handed.ID, "")
	if err != nil || kept.Status != order.StatusCollected {
		t.Fatalf("the handed-over order: %+v (%v)", kept, err)
	}

	// The units it held of the seller's other offer are back; those of the withdrawn one are not offered again.
	if left := f.unitsLeft(owner, t, eclair.ID); left != 5 {
		t.Fatalf("the other offer's units left: %d, want 5", left)
	}

	_, err = f.orders.Reopen(owner, both.ID)
	mustFail(t, "reopening an order refused as withdrawn", err, order.ErrTransitionNotAllowed)
}

// expectState fails the check unless an order is stored in the state, whatever it reads as.
func (f fixture) expectState(t *testing.T, id uuid.UUID, want, what string) {
	t.Helper()

	var state string
	if err := f.pool.QueryRow(t.Context(), "SELECT state FROM order_orders WHERE id = $1", id).Scan(&state); err != nil {
		t.Fatal(err)
	}

	if state != want {
		t.Errorf("%s: stored %s, want %s", what, state, want)
	}
}

func testEndedOrdersExpire(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	customer := f.as(t, "customer", platform.RoleCustomer)
	shop := f.shop(owner, t, "La Paris")
	croissant := f.post(owner, t, shop, "Croissant", 5, 20_000, time.Now())

	var placed []order.Order

	for range 3 {
		o, err := f.orders.Place(customer, key(), uuid.Nil, someone, []order.Wanted{{croissant.ID, 1}})
		if err != nil {
			t.Fatal(err)
		}

		placed = append(placed, o)
	}

	ended, running, handed := placed[0], placed[1], placed[2]

	if _, err := f.orders.HandOver(owner, handed.ID); err != nil {
		t.Fatal(err)
	}

	f.shift(t, ended.ID, -3*time.Hour)
	f.shift(t, handed.ID, -3*time.Hour)

	// Read as expired already, whatever the job has done.
	before, err := f.orders.Get(customer, ended.ID, "")
	if err != nil || before.Status != order.StatusExpired {
		t.Fatalf("read before the job: %+v, %v", before, err)
	}

	f.expectState(t, ended.ID, "confirmed", "before the job")

	for range 2 { // run twice, it changes nothing more
		if err := f.orders.ExpireEnded(t.Context()); err != nil {
			t.Fatal(err)
		}
	}

	f.expectState(t, ended.ID, "expired", "the ended order once the job ran")
	f.expectState(t, running.ID, "confirmed", "an order still running")
	f.expectState(t, handed.ID, "collected", "an order handed over before its window ended")

	var events int
	if err := f.pool.QueryRow(t.Context(),
		"SELECT count(*) FROM order_events WHERE order_id = $1 AND kind = 'expired'", ended.ID).Scan(&events); err != nil {
		t.Fatal(err)
	}

	if events != 1 {
		t.Errorf("expired events: %d", events)
	}

	_, err = f.orders.Reopen(owner, ended.ID)
	mustFail(t, "reopening an expired order", err, order.ErrTransitionNotAllowed)
}

func testExpiryReadFromTheWindow(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	customer := f.as(t, "customer", platform.RoleCustomer)
	shop := f.shop(owner, t, "La Paris")
	croissant := f.post(owner, t, shop, "Croissant", 5, 20_000, time.Now())

	o, err := f.orders.Place(customer, key(), uuid.Nil, someone, []order.Wanted{{croissant.ID, 1}})
	if err != nil {
		t.Fatal(err)
	}

	f.shift(t, o.ID, -3*time.Hour)

	expired, err := f.orders.Get(customer, o.ID, "")
	if err != nil || expired.Status != order.StatusExpired {
		t.Fatalf("after the window: %+v, %v", expired, err)
	}

	_, err = f.orders.HandOver(owner, o.ID)
	mustFail(t, "handing over once expired", err, order.ErrTransitionNotAllowed)

	_, err = f.orders.Ready(owner, o.ID)
	mustFail(t, "ready once expired", err, order.ErrTransitionNotAllowed)

	_, err = f.orders.Cancel(customer, o.ID, "", "")
	mustFail(t, "cancelling once expired", err, order.ErrCancelTooLate)
}

func testSellerListsADay(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	customer := f.as(t, "customer", platform.RoleCustomer)
	stranger := f.as(t, "stranger", platform.RoleCustomer)
	shop := f.shop(owner, t, "La Paris")
	croissant := f.post(owner, t, shop, "Croissant", 5, 20_000, time.Now())

	o, err := f.orders.Place(customer, key(), uuid.Nil, someone, []order.Wanted{{croissant.ID, 1}})
	if err != nil {
		t.Fatal(err)
	}

	today, err := f.orders.OfSeller(owner, shop, f.orders.Today())
	if err != nil || len(today) != 1 || today[0].ID != o.ID || len(today[0].Lines) != 1 || today[0].Access != "" {
		t.Fatalf("today's orders: %+v, %v", today, err)
	}

	if tomorrow, err := f.orders.OfSeller(owner, shop, f.orders.Today().AddDate(0, 0, 1)); err != nil || len(tomorrow) != 0 {
		t.Errorf("tomorrow's orders: %+v, %v", tomorrow, err)
	}

	_, err = f.orders.OfSeller(stranger, shop, f.orders.Today())
	mustFail(t, "a stranger", err, seller.ErrNotFound)
}

func testCustomerLists(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	customer := f.as(t, "customer", platform.RoleCustomer)
	shop := f.shop(owner, t, "La Paris")
	croissant := f.post(owner, t, shop, "Croissant", 5, 20_000, time.Now())

	ended, err := f.orders.Place(customer, key(), uuid.Nil, someone, []order.Wanted{{croissant.ID, 1}})
	if err != nil {
		t.Fatal(err)
	}

	f.shift(t, ended.ID, -3*time.Hour)

	cart := uuid.New()

	open, err := f.orders.Place(customer, key(), cart, someone, []order.Wanted{{croissant.ID, 1}})
	if err != nil {
		t.Fatal(err)
	}

	checkoutKept(owner, customer, t, f, croissant.ID, open, ended)

	for which, want := range map[order.Which][]uuid.UUID{
		order.WhichAll:   {open.ID, ended.ID},
		order.WhichOpen:  {open.ID},
		order.WhichEnded: {ended.ID},
	} {
		got, err := f.orders.Mine(customer, which, uuid.Nil, 20, 0)
		if err != nil {
			t.Fatal(err)
		}

		ids := make([]uuid.UUID, 0, len(got))
		for _, o := range got {
			ids = append(ids, o.ID)
		}

		if len(ids) != len(want) || (len(want) > 0 && ids[0] != want[0]) {
			t.Errorf("%q: %v, want %v", which, ids, want)
		}
	}

	if others, _ := f.orders.Mine(owner, order.WhichAll, uuid.Nil, 20, 0); len(others) != 1 {
		t.Errorf("the owner's own orders, not the customer's: %d", len(others))
	}
}

// checkoutKept checks open was placed under the checkout given and ended
// under a new one, and that someone else naming the same checkout never joins
// the customer's.
func checkoutKept(owner, customer context.Context, t *testing.T, f fixture, offerID uuid.UUID, open, ended order.Order) {
	t.Helper()

	cart := open.CheckoutID
	if cart == uuid.Nil || ended.CheckoutID == uuid.Nil || ended.CheckoutID == cart {
		t.Errorf("checkouts: given %v; a new one %v", cart, ended.CheckoutID)
	}

	if _, err := f.orders.Place(owner, key(), cart, someone, []order.Wanted{{offerID, 1}}); err != nil {
		t.Fatal(err)
	}

	mine, err := f.orders.Mine(customer, order.WhichAll, cart, 20, 0)
	if err != nil || len(mine) != 1 || mine[0].ID != open.ID {
		t.Errorf("the customer's orders of one checkout: %v, %v", mine, err)
	}
}

func testHistoryForAdmins(t *testing.T, f fixture) {
	t.Helper()

	customer := f.as(t, "customer", platform.RoleCustomer)
	admin := f.as(t, "admin", platform.RoleAdmin)
	orderSevenWays(customer, t, f)

	caller, _ := platform.CallerFrom(customer)

	h, err := f.orders.HistoryForAdmins(admin, caller.AccountID)
	if err != nil || h.Placed != 7 || h.Collected != 1 || h.Missed != 2 || len(h.Recent) != 5 {
		t.Fatalf("the history: placed %d, collected %d, missed %d, %d recent, %v; want 7, 1, 2, 5",
			h.Placed, h.Collected, h.Missed, len(h.Recent), err)
	}

	if h.Recent[0].Status != order.StatusConfirmed || len(h.Recent[0].Lines) != 1 || h.Recent[0].Access != "" {
		t.Errorf("the newest order: %+v; want confirmed, with its line, without its access", h.Recent[0])
	}

	_, err = f.orders.HistoryForAdmins(customer, caller.AccountID)
	mustFail(t, "a customer reading a history", err, platform.ErrAdminRequired)
}

// orderSevenWays has customer place seven orders at one seller: one handed
// over, one refused as a no-show, one refused as sold out, one whose window
// ended, and three still open.
func orderSevenWays(customer context.Context, t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	shop := f.shop(owner, t, "La Paris")
	croissant := f.post(owner, t, shop, "Croissant", 9, 20_000, time.Now())

	place := func() uuid.UUID {
		o, err := f.orders.Place(customer, key(), uuid.Nil, someone, []order.Wanted{{croissant.ID, 1}})
		if err != nil {
			t.Fatal(err)
		}

		return o.ID
	}

	if _, err := f.orders.HandOver(owner, place()); err != nil {
		t.Fatal(err)
	}

	for _, reason := range []order.RefuseReason{order.RefuseNoShow, order.RefuseSoldOut} {
		if _, err := f.orders.Refuse(owner, place(), reason, ""); err != nil {
			t.Fatal(err)
		}
	}

	f.shift(t, place(), -3*time.Hour)

	for range 3 {
		place()
	}
}

func testRateOnce(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	customer := f.as(t, "customer", platform.RoleCustomer)
	stranger := f.as(t, "stranger", platform.RoleCustomer)
	shop := f.shop(owner, t, "La Paris")
	croissant := f.post(owner, t, shop, "Croissant", 5, 20_000, time.Now())
	good := order.Review{Stars: 5, Tags: []order.Tag{order.TagFastPickup, order.TagGoodQuality}, Comment: " Ngon "}

	o, err := f.orders.Place(customer, key(), uuid.Nil, someone, []order.Wanted{{croissant.ID, 1}})
	if err != nil {
		t.Fatal(err)
	}

	_, err = f.orders.Rate(customer, o.ID, "", good)
	mustFail(t, "an order not collected", err, order.ErrNotCollected)

	if _, err := f.orders.HandOver(owner, o.ID); err != nil {
		t.Fatal(err)
	}

	_, err = f.orders.Rate(stranger, o.ID, "", good)
	mustFail(t, "a stranger", err, order.ErrNotFound)

	_, err = f.orders.Rate(owner, o.ID, "", good)
	mustFail(t, "the seller", err, order.ErrNotFound)

	invalid(customer, t, f, o.ID, order.Review{Stars: 0})
	invalid(customer, t, f, o.ID, order.Review{Stars: 6})
	invalid(customer, t, f, o.ID, order.Review{Stars: 4, Tags: []order.Tag{"cheap"}})
	invalid(customer, t, f, o.ID, order.Review{Stars: 4, Tags: []order.Tag{order.TagGoodVariety, order.TagGoodVariety}})
	invalid(customer, t, f, o.ID, order.Review{Stars: 4, Comment: strings.Repeat("ế", 501)})

	rated, err := f.orders.Rate(customer, o.ID, "", good)
	if err != nil || rated.Review == nil || rated.Review.Stars != 5 || rated.Review.Comment != "Ngon" ||
		len(rated.Review.Tags) != 2 || rated.Review.CreatedAt.IsZero() {
		t.Fatalf("rated %+v, %v", rated.Review, err)
	}

	_, err = f.orders.Rate(customer, o.ID, "", order.Review{Stars: 1})
	mustFail(t, "rating twice", err, order.ErrAlreadyReviewed)

	listed, err := f.orders.Mine(customer, order.WhichAll, uuid.Nil, 10, 0)
	if err != nil || len(listed) != 1 || listed[0].Review == nil || listed[0].Review.Stars != 5 {
		t.Fatalf("listed %+v, %v", listed, err)
	}

	rateWithAccess(owner, t, f, croissant.ID, good)
}

// invalid rates o with review, which is refused.
func invalid(customer context.Context, t *testing.T, f fixture, id uuid.UUID, review order.Review) {
	t.Helper()

	_, err := f.orders.Rate(customer, id, "", review)
	mustFail(t, "an invalid review", err, order.ErrReviewInvalid)
}

// rateWithAccess rates a collected order placed without an account: with
// nothing it is not found, with its access it is rated.
func rateWithAccess(owner context.Context, t *testing.T, f fixture, offerID uuid.UUID, review order.Review) {
	t.Helper()

	guest := t.Context()

	o, err := f.orders.Place(guest, key(), uuid.Nil, someone, []order.Wanted{{offerID, 1}})
	if err != nil {
		t.Fatal(err)
	}

	if _, err := f.orders.HandOver(owner, o.ID); err != nil {
		t.Fatal(err)
	}

	_, err = f.orders.Rate(guest, o.ID, "", review)
	mustFail(t, "without the access", err, order.ErrNotFound)

	rated, err := f.orders.Rate(guest, o.ID, o.Access, review)
	if err != nil || rated.Review == nil || rated.Access != o.Access {
		t.Fatalf("rating with the access: %+v, %v", rated, err)
	}
}

// testOrdersAndOffersFollowTheSeller moves a seller's pin and checks that the
// offers still on sale and the orders still to collect copy the new point,
// while a withdrawn offer and a handed-over order keep the old one (SEC-66).
func testOrdersAndOffersFollowTheSeller(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	customer := f.as(t, "customer", platform.RoleCustomer)
	shop := f.shop(owner, t, "La Paris")
	croissant := f.post(owner, t, shop, "Croissant", 5, 20_000, time.Now())
	eclair := f.post(owner, t, shop, "Eclair", 5, 25_000, time.Now())

	open, err := f.orders.Place(customer, key(), uuid.Nil, someone, []order.Wanted{{croissant.ID, 1}})
	if err != nil {
		t.Fatal(err)
	}

	handed, err := f.orders.Place(customer, key(), uuid.Nil, someone, []order.Wanted{{croissant.ID, 1}})
	if err != nil {
		t.Fatal(err)
	}

	if _, err := f.orders.HandOver(owner, handed.ID); err != nil {
		t.Fatal(err)
	}

	if _, err := f.offers.Withdraw(owner, eclair.ID); err != nil {
		t.Fatal(err)
	}

	before := croissant.CollectionPoint
	after := seller.CollectionPoint{Latitude: 21.0453, Longitude: 105.8738, Address: "12 Ngọc Lâm, Long Biên"}

	if _, err := f.sellers.Update(owner, shop, seller.Details{
		Name: "La Paris", Address: after.Address, Latitude: after.Latitude, Longitude: after.Longitude, Phone: "0912345678",
	}); err != nil {
		t.Fatal(err)
	}

	// The listeners do not run in this check; their handlers are called as the event would.
	event := seller.LocationChangedEvent{SellerID: shop}
	for range 2 { // delivered twice, it changes nothing more
		if err := f.offers.FollowSellerLocation(t.Context(), event); err != nil {
			t.Fatal(err)
		}

		if err := f.orders.FollowSellerLocation(t.Context(), event); err != nil {
			t.Fatal(err)
		}
	}

	for _, c := range []struct {
		name      string
		got, want seller.CollectionPoint
	}{
		{"the offer on sale", f.offerPoint(owner, t, croissant.ID), after},
		{"the withdrawn offer", f.offerPoint(owner, t, eclair.ID), before},
		{"the order to collect", f.orderPoint(customer, t, open.ID), after},
		{"the handed-over order", f.orderPoint(customer, t, handed.ID), before},
	} {
		if c.got != c.want {
			t.Errorf("%s at %+v, want %+v", c.name, c.got, c.want)
		}
	}

	// An unknown seller is nothing to follow.
	gone := seller.LocationChangedEvent{SellerID: uuid.New()}
	if err := f.offers.FollowSellerLocation(t.Context(), gone); err != nil {
		t.Errorf("offers following an unknown seller: %v", err)
	}

	if err := f.orders.FollowSellerLocation(t.Context(), gone); err != nil {
		t.Errorf("orders following an unknown seller: %v", err)
	}
}

// offerPoint reads where an offer is collected.
func (f fixture) offerPoint(owner context.Context, t *testing.T, id uuid.UUID) seller.CollectionPoint {
	t.Helper()

	o, err := f.offers.Get(owner, id)
	if err != nil {
		t.Fatal(err)
	}

	return o.CollectionPoint
}

// orderPoint reads where an order is collected.
func (f fixture) orderPoint(customer context.Context, t *testing.T, id uuid.UUID) seller.CollectionPoint {
	t.Helper()

	o, err := f.orders.Get(customer, id, "")
	if err != nil {
		t.Fatal(err)
	}

	return o.CollectionPoint
}
