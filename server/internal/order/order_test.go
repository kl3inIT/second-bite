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
		"who reads an order and its code":          testWhoReadsAnOrder,
		"cancelling until the window opens":        testCancelUntilTheWindowOpens,
		"handing over against the code":            testHandOverAgainstTheCode,
		"three wrong codes lock it":                testWrongCodesLock,
		"staff refuse an order":                    testStaffRefuse,
		"expiry is read from the window":           testExpiryReadFromTheWindow,
		"a seller lists the orders of a day":       testSellerListsADay,
		"the customer lists open and ended orders": testCustomerLists,
	} {
		t.Run(name, func(t *testing.T) {
			t.Parallel()
			check(t, newFixture(t, pool))
		})
	}
}

func newFixture(t *testing.T, pool *pgxpool.Pool) fixture {
	t.Helper()

	accounts, err := identity.NewService(pool, nil, nil, identity.Config{CodeKey: make([]byte, 32)}, platformtest.Logger())
	if err != nil {
		t.Fatal(err)
	}

	files, err := file.NewService(t.Context(), pool, file.Config{}, platformtest.Logger())
	if err != nil {
		t.Fatal(err)
	}

	sellers := seller.NewService(pool, accounts, files, platformtest.Logger())
	offers := offer.NewService(pool, sellers, files, platformtest.Logger())

	orders, err := order.NewService(pool, offers, sellers, bytes.Repeat([]byte{7}, 32), platformtest.Logger())
	if err != nil {
		t.Fatal(err)
	}

	return fixture{
		pool: pool, accounts: accounts, files: files, sellers: sellers, offers: offers, orders: orders,
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

// shop opens a seller of that name owned by owner, with staff, activated by
// an admin.
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

	if _, err := f.sellers.Activate(f.as(t, "admin", platform.RoleAdmin), s.ID); err != nil {
		t.Fatal(err)
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

func key() string { return uuid.NewString() }

func testPlacingTakesUnits(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	customer := f.as(t, "customer", platform.RoleCustomer)
	shop := f.shop(owner, t, "La Paris")
	now := time.Now()
	croissant := f.post(owner, t, shop, "Croissant", 5, 20_000, now)
	bread := f.post(owner, t, shop, "Bánh mì chà bông", 3, 30_000, now.Add(30*time.Minute))

	k := key()

	o, err := f.orders.Place(customer, k, []order.Wanted{{OfferID: croissant.ID, Units: 2}, {OfferID: bread.ID, Units: 1}})
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

	again, err := f.orders.Place(customer, k, []order.Wanted{{OfferID: croissant.ID, Units: 2}})
	if err != nil || again.ID != o.ID {
		t.Errorf("the same key again: %v, %v", again.ID, err)
	}

	if got := f.unitsLeft(owner, t, croissant.ID); got != 3 {
		t.Errorf("croissants left after the same key again: %d", got)
	}

	keyAndCallerRequired(customer, t, f, croissant.ID)
}

// keyAndCallerRequired places an order without a key, then with nobody
// signed in.
func keyAndCallerRequired(customer context.Context, t *testing.T, f fixture, offerID uuid.UUID) {
	t.Helper()

	_, err := f.orders.Place(customer, "", []order.Wanted{{OfferID: offerID, Units: 1}})
	mustFail(t, "no key", err, order.ErrIdempotencyKeyInvalid)

	_, err = f.orders.Place(t.Context(), key(), []order.Wanted{{OfferID: offerID, Units: 1}})
	mustFail(t, "nobody signed in", err, platform.ErrAuthenticationRequired)
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
		_, err := f.orders.Place(customer, key(), c.wanted)
		mustFail(t, name, err, c.want)
	}

	if got := f.unitsLeft(owner, t, croissant.ID); got != 5 {
		t.Errorf("croissants left after refused carts: %d", got)
	}

	if _, err := f.offers.Withdraw(owner, bread.ID); err != nil {
		t.Fatal(err)
	}

	_, err := f.orders.Place(customer, key(), []order.Wanted{{bread.ID, 1}})
	mustFail(t, "a withdrawn offer", err, order.ErrOfferUnavailable)

	if _, err := f.sellers.Block(f.as(t, "admin", platform.RoleAdmin), shop); err != nil {
		t.Fatal(err)
	}

	_, err = f.orders.Place(customer, key(), []order.Wanted{{croissant.ID, 1}})
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
			_, err := f.orders.Place(customer, key(), []order.Wanted{{last.ID, 1}})
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

	o, err := f.orders.Place(customer, key(), []order.Wanted{{later.ID, 1}})
	if err != nil {
		t.Fatal(err)
	}

	if o.Code != "" {
		t.Errorf("a code before the order is ready or its window opens: %q", o.Code)
	}

	for name, reader := range map[string]context.Context{"its seller's staff": staff, "an admin": admin} {
		if _, err := f.orders.Get(reader, o.ID); err != nil {
			t.Errorf("%s: %v", name, err)
		}
	}

	_, err = f.orders.Get(stranger, o.ID)
	mustFail(t, "a stranger", err, order.ErrNotFound)

	if _, err := f.orders.Ready(staff, o.ID); err != nil {
		t.Fatal(err)
	}

	mine, err := f.orders.Get(customer, o.ID)
	if err != nil || len(mine.Code) != 4 {
		t.Fatalf("the customer's code once ready: %q, %v", mine.Code, err)
	}

	if theirs, _ := f.orders.Get(staff, o.ID); theirs.Code != "" {
		t.Errorf("staff were shown the code")
	}

	_, err = f.orders.Ready(admin, o.ID)
	mustFail(t, "an admin acting for the seller", err, order.ErrNotFound)
}

func testCancelUntilTheWindowOpens(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	customer := f.as(t, "customer", platform.RoleCustomer)
	shop := f.shop(owner, t, "La Paris")
	later := f.post(owner, t, shop, "Croissant", 5, 20_000, time.Now().Add(time.Hour))
	now := f.post(owner, t, shop, "Bánh mì", 5, 20_000, time.Now())

	o, err := f.orders.Place(customer, key(), []order.Wanted{{later.ID, 3}})
	if err != nil {
		t.Fatal(err)
	}

	_, err = f.orders.Cancel(owner, o.ID, "")
	mustFail(t, "the seller cancelling", err, order.ErrNotFound)

	cancelled, err := f.orders.Cancel(customer, o.ID, "không đến kịp")
	if err != nil || cancelled.Status != order.StatusCancelled || cancelled.CancelReason != "không đến kịp" {
		t.Fatalf("cancelled %+v, %v", cancelled, err)
	}

	if got := f.unitsLeft(owner, t, later.ID); got != 5 {
		t.Errorf("units back after cancelling: %d", got)
	}

	_, err = f.orders.Cancel(customer, o.ID, "")
	mustFail(t, "cancelling twice", err, order.ErrCancelTooLate)

	open, err := f.orders.Place(customer, key(), []order.Wanted{{now.ID, 1}})
	if err != nil {
		t.Fatal(err)
	}

	_, err = f.orders.Cancel(customer, open.ID, "")
	mustFail(t, "cancelling once the window has opened", err, order.ErrCancelTooLate)
}

func testHandOverAgainstTheCode(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	customer := f.as(t, "customer", platform.RoleCustomer)
	stranger := f.as(t, "stranger", platform.RoleCustomer)
	shop := f.shop(owner, t, "La Paris")
	croissant := f.post(owner, t, shop, "Croissant", 5, 20_000, time.Now())
	later := f.post(owner, t, shop, "Bánh mì", 5, 20_000, time.Now().Add(time.Hour))

	o, err := f.orders.Place(customer, key(), []order.Wanted{{croissant.ID, 1}})
	if err != nil {
		t.Fatal(err)
	}

	// The window has opened, so the customer sees the code before ready.
	code := o.Code
	if len(code) != 4 {
		t.Fatalf("the code once the window has opened: %q", code)
	}

	_, err = f.orders.HandOver(stranger, o.ID, code)
	mustFail(t, "a stranger", err, order.ErrNotFound)

	_, err = f.orders.HandOver(owner, o.ID, wrong(code))
	mustFail(t, "a wrong code", err, order.ErrCodeWrong)

	if got, _ := f.orders.Get(owner, o.ID); got.CodeAttemptsLeft != 2 {
		t.Errorf("attempts left after a wrong code: %d", got.CodeAttemptsLeft)
	}

	collected, err := f.orders.HandOver(owner, o.ID, code)
	if err != nil || collected.Status != order.StatusCollected || collected.CollectedAt == nil {
		t.Fatalf("handed over %+v, %v", collected, err)
	}

	_, err = f.orders.HandOver(owner, o.ID, code)
	mustFail(t, "handing over twice", err, order.ErrTransitionNotAllowed)

	_, err = f.orders.Refuse(owner, o.ID, order.RefuseOther, "")
	mustFail(t, "refusing a collected order", err, order.ErrTransitionNotAllowed)

	early, err := f.orders.Place(customer, key(), []order.Wanted{{later.ID, 1}})
	if err != nil {
		t.Fatal(err)
	}

	_, err = f.orders.HandOver(owner, early.ID, "0000")
	mustFail(t, "before the window opens", err, order.ErrOutsideWindow)
}

// wrong is a four-digit code other than code.
func wrong(code string) string {
	if code == "0000" {
		return "0001"
	}

	return "0000"
}

func testWrongCodesLock(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	customer := f.as(t, "customer", platform.RoleCustomer)
	shop := f.shop(owner, t, "La Paris")
	croissant := f.post(owner, t, shop, "Croissant", 5, 20_000, time.Now())

	o, err := f.orders.Place(customer, key(), []order.Wanted{{croissant.ID, 1}})
	if err != nil {
		t.Fatal(err)
	}

	for i, want := range []error{order.ErrCodeWrong, order.ErrCodeWrong, order.ErrCodeLocked, order.ErrCodeLocked} {
		_, err := f.orders.HandOver(owner, o.ID, wrong(o.Code))
		mustFail(t, "wrong code "+string(rune('1'+i)), err, want)
	}

	_, err = f.orders.HandOver(owner, o.ID, o.Code)
	mustFail(t, "the right code once locked", err, order.ErrCodeLocked)

	if locked, _ := f.orders.Get(customer, o.ID); locked.Code != "" || locked.CodeAttemptsLeft != 0 {
		t.Errorf("a locked order: code %q, attempts %d", locked.Code, locked.CodeAttemptsLeft)
	}
}

func testStaffRefuse(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	staff := f.as(t, "staff", platform.RoleCustomer)
	customer := f.as(t, "customer", platform.RoleCustomer)
	shop := f.shop(owner, t, "La Paris", "staff")
	croissant := f.post(owner, t, shop, "Croissant", 5, 20_000, time.Now())

	o, err := f.orders.Place(customer, key(), []order.Wanted{{croissant.ID, 2}})
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

func testExpiryReadFromTheWindow(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	customer := f.as(t, "customer", platform.RoleCustomer)
	shop := f.shop(owner, t, "La Paris")
	croissant := f.post(owner, t, shop, "Croissant", 5, 20_000, time.Now())

	o, err := f.orders.Place(customer, key(), []order.Wanted{{croissant.ID, 1}})
	if err != nil {
		t.Fatal(err)
	}

	f.shift(t, o.ID, -3*time.Hour)

	expired, err := f.orders.Get(customer, o.ID)
	if err != nil || expired.Status != order.StatusExpired || expired.Code != "" {
		t.Fatalf("after the window: %+v, %v", expired, err)
	}

	_, err = f.orders.HandOver(owner, o.ID, o.Code)
	mustFail(t, "handing over once expired", err, order.ErrTransitionNotAllowed)

	_, err = f.orders.Ready(owner, o.ID)
	mustFail(t, "ready once expired", err, order.ErrTransitionNotAllowed)

	_, err = f.orders.Cancel(customer, o.ID, "")
	mustFail(t, "cancelling once expired", err, order.ErrCancelTooLate)
}

func testSellerListsADay(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	customer := f.as(t, "customer", platform.RoleCustomer)
	stranger := f.as(t, "stranger", platform.RoleCustomer)
	shop := f.shop(owner, t, "La Paris")
	croissant := f.post(owner, t, shop, "Croissant", 5, 20_000, time.Now())

	o, err := f.orders.Place(customer, key(), []order.Wanted{{croissant.ID, 1}})
	if err != nil {
		t.Fatal(err)
	}

	today, err := f.orders.OfSeller(owner, shop, f.orders.Today())
	if err != nil || len(today) != 1 || today[0].ID != o.ID || len(today[0].Lines) != 1 || today[0].Code != "" {
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

	ended, err := f.orders.Place(customer, key(), []order.Wanted{{croissant.ID, 1}})
	if err != nil {
		t.Fatal(err)
	}

	f.shift(t, ended.ID, -3*time.Hour)

	open, err := f.orders.Place(customer, key(), []order.Wanted{{croissant.ID, 1}})
	if err != nil {
		t.Fatal(err)
	}

	for which, want := range map[order.Which][]uuid.UUID{
		order.WhichAll:   {open.ID, ended.ID},
		order.WhichOpen:  {open.ID},
		order.WhichEnded: {ended.ID},
	} {
		got, err := f.orders.Mine(customer, which, 20, 0)
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

	if others, _ := f.orders.Mine(owner, order.WhichAll, 20, 0); len(others) != 0 {
		t.Errorf("another account's orders: %d", len(others))
	}
}
