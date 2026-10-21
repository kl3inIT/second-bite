package seller_test

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"image"
	"image/png"
	"strings"
	"sync"
	"testing"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/kl3inIT/second-bite/server/internal/audit"
	"github.com/kl3inIT/second-bite/server/internal/file"
	"github.com/kl3inIT/second-bite/server/internal/identity"
	"github.com/kl3inIT/second-bite/server/internal/notification"
	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/platform/platformtest"
	"github.com/kl3inIT/second-bite/server/internal/seller"
)

type fixture struct {
	sellers  *seller.Service
	accounts *identity.Service
	photos   *file.Service
	events   *platform.Events
	prefix   string
}

// TestSeller runs the module's checks in parallel against one PostgreSQL,
// each with addresses of its own: one container rather than one per check.
func TestSeller(t *testing.T) {
	t.Parallel()

	pool := platformtest.StartPostgres(t)

	for name, check := range map[string]func(*testing.T, *pgxpool.Pool){
		"publishing follows status and membership": testPublishingFollowsStatusAndMembership,
		"only the right people act on a seller":    testOnlyTheRightPeopleActOnASeller,
		"an owner opens at most five sellers":      testAnOwnerOpensAtMostFiveSellers,
		"details are checked":                      testDetailsAreChecked,
		"additions arriving together keep the cap": testStaffCapUnderConcurrency,
		"the owner sets a photo they uploaded":     testOwnerSetsAPhoto,
		"admins read who belongs to which seller":  testMembershipsForAdmins,
	} {
		t.Run(name, func(t *testing.T) {
			t.Parallel()
			check(t, pool)
		})
	}
}

func newFixture(t *testing.T, pool *pgxpool.Pool) fixture {
	t.Helper()

	// Sending sign-in codes is not exercised here, so identity has no email.
	accounts, err := identity.NewService(pool, nil, nil, nil, identity.Config{CodeKey: make([]byte, 32)}, platformtest.Logger())
	if err != nil {
		t.Fatal(err)
	}

	photos, err := file.NewService(t.Context(), pool, file.Config{}, platformtest.Logger())
	if err != nil {
		t.Fatal(err)
	}

	trail := audit.NewService(pool, platformtest.Logger())

	notifications, err := notification.NewService(pool, trail, notification.Config{SettingsKey: make([]byte, 32)}, platformtest.Logger())
	if err != nil {
		t.Fatal(err)
	}

	events, err := platform.NewEvents(pool, platformtest.Logger())
	if err != nil {
		t.Fatal(err)
	}

	return fixture{
		sellers:  seller.NewService(pool, accounts, photos, notifications, events, trail, platformtest.Logger()),
		accounts: accounts, photos: photos, events: events,
		prefix: strings.ToLower(t.Name()),
	}
}

// mail makes an address unique to the test, from its local part.
func (f fixture) mail(local string) string {
	name, _, _ := strings.Cut(local, "@")

	return strings.NewReplacer("/", ".", "_", ".").Replace(f.prefix) + "." + name + "@example.com"
}

// as returns a context whose caller is the account of email.
func (f fixture) as(t *testing.T, email string, role platform.Role) context.Context {
	t.Helper()

	a, err := f.accounts.EnsureAccount(t.Context(), f.mail(email))
	if err != nil {
		t.Fatal(err)
	}

	return platform.WithCaller(t.Context(), platform.Caller{AccountID: a.ID, SessionID: uuid.New(), Role: role})
}

// blockReason is what an admin tells an owner in these tests.
const blockReason = "Bán món đã quá hạn sử dụng"

var shop = seller.Details{Name: "Bánh mì Tasco", Address: "Tasco Mall, Việt Hưng", Latitude: 21.0565, Longitude: 105.8964, Phone: "0912 345 678"}

func mustPublish(ctx context.Context, t *testing.T, f fixture, sellerID uuid.UUID, want bool) {
	t.Helper()

	caller, _ := platform.CallerFrom(ctx)

	_, err := f.sellers.Publishing(t.Context(), sellerID, caller.AccountID)
	if err != nil && !errors.Is(err, seller.ErrNotFound) && !errors.Is(err, seller.ErrNotActive) {
		t.Fatal(err)
	}

	if got := err == nil; got != want {
		t.Fatalf("may publish %v, want %v (%v)", got, want, err)
	}
}

// TestPublishingFollowsStatusAndMembership walks a seller through its life:
// rights to publish exist only for its members while it is active.
func testPublishingFollowsStatusAndMembership(t *testing.T, pool *pgxpool.Pool) {
	t.Helper()

	f := newFixture(t, pool)
	owner := f.as(t, "owner@example.com", platform.RoleCustomer)
	staff := f.as(t, "staff@example.com", platform.RoleCustomer)
	stranger := f.as(t, "stranger@example.com", platform.RoleCustomer)
	admin := f.as(t, "admin@example.com", platform.RoleAdmin)

	s, err := f.sellers.Open(owner, shop)
	if err != nil {
		t.Fatal(err)
	}

	if s.Status != seller.StatusActive || s.MyRole != seller.RoleOwner || s.Phone != "0912345678" {
		t.Fatalf("opened %+v", s)
	}

	mustPublish(owner, t, f, s.ID, true) // active as soon as it is opened

	if _, err := f.sellers.AddStaff(owner, s.ID, strings.ToUpper(f.mail("staff"))); err != nil {
		t.Fatal(err)
	}

	mustPublish(owner, t, f, s.ID, true)
	mustPublish(staff, t, f, s.ID, true)
	mustPublish(stranger, t, f, s.ID, false)

	if _, err := f.sellers.Block(admin, s.ID, blockReason); err != nil {
		t.Fatal(err)
	}

	mustPublish(owner, t, f, s.ID, false) // blocked
	mustPublish(staff, t, f, s.ID, false)

	if _, err := f.sellers.Approve(admin, s.ID); err != nil { // a block is lifted by approving again
		t.Fatal(err)
	}

	caller, _ := platform.CallerFrom(staff)
	if err := f.sellers.RemoveMember(owner, s.ID, caller.AccountID); err != nil {
		t.Fatal(err)
	}

	mustPublish(staff, t, f, s.ID, false) // removed: the right ends at once
}

func testOnlyTheRightPeopleActOnASeller(t *testing.T, pool *pgxpool.Pool) {
	t.Helper()

	f := newFixture(t, pool)
	owner := f.as(t, "owner@example.com", platform.RoleCustomer)
	staff := f.as(t, "staff@example.com", platform.RoleCustomer)
	stranger := f.as(t, "stranger@example.com", platform.RoleCustomer)

	s, err := f.sellers.Open(owner, shop)
	if err != nil {
		t.Fatal(err)
	}

	if _, err := f.sellers.AddStaff(owner, s.ID, f.mail("staff")); err != nil {
		t.Fatal(err)
	}

	checks := []struct {
		name string
		err  error
		want error
	}{
		{"a stranger does not see the seller", get(stranger, f, s.ID), seller.ErrNotFound},
		{"staff do not change it", update(staff, f, s.ID), seller.ErrOwnerRequired},
		{"staff do not add staff", addStaff(staff, f, s.ID, f.mail("other")), seller.ErrOwnerRequired},
		{"the same person is not added twice", addStaff(owner, f, s.ID, strings.ToUpper(f.mail("staff"))), seller.ErrAlreadyMember},
		{"a customer does not approve", approve(owner, f, s.ID), platform.ErrAdminRequired},
		{"the owner does not leave", leave(owner, f, s.ID), seller.ErrOwnerCannotLeave},
		{"an address must be one address", addStaff(owner, f, s.ID, "not an address"), identity.ErrEmailInvalid},
	}

	for _, c := range checks {
		if !errors.Is(c.err, c.want) {
			t.Errorf("%s: %v, want %v", c.name, c.err, c.want)
		}
	}

	if err := leave(staff, f, s.ID); err != nil {
		t.Errorf("staff leave: %v", err)
	}
}

func testAnOwnerOpensAtMostFiveSellers(t *testing.T, pool *pgxpool.Pool) {
	t.Helper()

	f := newFixture(t, pool)
	owner := f.as(t, "owner@example.com", platform.RoleCustomer)

	for i := range 5 {
		if _, err := f.sellers.Open(owner, shop); err != nil {
			t.Fatalf("seller %d: %v", i+1, err)
		}
	}

	if _, err := f.sellers.Open(owner, shop); !errors.Is(err, seller.ErrLimitReached) {
		t.Fatalf("sixth seller: %v, want ErrLimitReached", err)
	}
}

func testDetailsAreChecked(t *testing.T, pool *pgxpool.Pool) {
	t.Helper()

	f := newFixture(t, pool)
	owner := f.as(t, "owner@example.com", platform.RoleCustomer)

	for _, phone := range []string{"12345", "0912-abc-678", "1234567890123456", "09+12345678"} {
		d := shop
		d.Phone = phone

		if _, err := f.sellers.Open(owner, d); !errors.Is(err, seller.ErrPhoneInvalid) {
			t.Errorf("phone %q: %v, want ErrPhoneInvalid", phone, err)
		}
	}

	d := shop
	d.Name = "   "

	if _, err := f.sellers.Open(owner, d); !errors.Is(err, seller.ErrDetailsInvalid) {
		t.Errorf("blank name: %v", err)
	}
}

func testStaffCapUnderConcurrency(t *testing.T, pool *pgxpool.Pool) {
	t.Helper()

	f := newFixture(t, pool)
	owner := f.as(t, "owner@example.com", platform.RoleCustomer)

	s, err := f.sellers.Open(owner, shop)
	if err != nil {
		t.Fatal(err)
	}

	// A hundred additions at once to a seller that holds thirty people, the owner
	// among them.
	var wg sync.WaitGroup
	for i := range 100 {
		wg.Go(func() { _ = addStaff(owner, f, s.ID, f.mail(fmt.Sprintf("staff%d", i))) })
	}

	wg.Wait()

	members, err := f.sellers.Members(owner, s.ID)
	if err != nil {
		t.Fatal(err)
	}

	if len(members) != 30 {
		t.Fatalf("%d people, want 30", len(members))
	}
}

func get(ctx context.Context, f fixture, id uuid.UUID) error {
	_, err := f.sellers.Get(ctx, id)

	return err
}

func update(ctx context.Context, f fixture, id uuid.UUID) error {
	_, err := f.sellers.Update(ctx, id, shop)

	return err
}

func addStaff(ctx context.Context, f fixture, id uuid.UUID, email string) error {
	_, err := f.sellers.AddStaff(ctx, id, email)

	return err
}

func approve(ctx context.Context, f fixture, id uuid.UUID) error {
	_, err := f.sellers.Approve(ctx, id)

	return err
}

func leave(ctx context.Context, f fixture, id uuid.UUID) error {
	caller, _ := platform.CallerFrom(ctx)

	return f.sellers.RemoveMember(ctx, id, caller.AccountID)
}

func testOwnerSetsAPhoto(t *testing.T, pool *pgxpool.Pool) {
	t.Helper()

	f := newFixture(t, pool)
	owner := f.as(t, "owner@example.com", platform.RoleCustomer)
	staff := f.as(t, "staff@example.com", platform.RoleCustomer)

	s, err := f.sellers.Open(owner, shop)
	if err != nil {
		t.Fatal(err)
	}

	if _, err := f.sellers.AddStaff(owner, s.ID, f.mail("staff")); err != nil {
		t.Fatal(err)
	}

	var buf bytes.Buffer
	if err := png.Encode(&buf, image.NewGray(image.Rect(0, 0, 8, 8))); err != nil {
		t.Fatal(err)
	}

	mine, err := f.photos.Upload(owner, buf.Bytes())
	if err != nil {
		t.Fatal(err)
	}

	theirs, err := f.photos.Upload(staff, buf.Bytes())
	if err != nil {
		t.Fatal(err)
	}

	if _, err := f.sellers.SetPhoto(staff, s.ID, &theirs.ID); !errors.Is(err, seller.ErrOwnerRequired) {
		t.Fatalf("staff set the photo: %v", err)
	}

	if _, err := f.sellers.SetPhoto(owner, s.ID, &theirs.ID); !errors.Is(err, file.ErrPhotoNotFound) {
		t.Fatalf("the owner used a photo someone else uploaded: %v", err)
	}

	got, err := f.sellers.SetPhoto(owner, s.ID, &mine.ID)
	if err != nil || got.PhotoID == nil || *got.PhotoID != mine.ID {
		t.Fatalf("set %+v, %v", got, err)
	}

	got, err = f.sellers.SetPhoto(owner, s.ID, nil)
	if err != nil || got.PhotoID != nil {
		t.Fatalf("removed %+v, %v", got, err)
	}
}

func testMembershipsForAdmins(t *testing.T, pool *pgxpool.Pool) {
	t.Helper()

	f := newFixture(t, pool)
	owner := f.as(t, "owner@example.com", platform.RoleCustomer)
	stranger := f.as(t, "stranger@example.com", platform.RoleCustomer)
	admin := f.as(t, "admin@example.com", platform.RoleAdmin)

	first, err := f.sellers.Open(owner, shop)
	if err != nil {
		t.Fatal(err)
	}

	second, err := f.sellers.Open(stranger, seller.Details{
		Name: "Bánh mì Hội An", Address: shop.Address, Latitude: shop.Latitude, Longitude: shop.Longitude, Phone: shop.Phone,
	})
	if err != nil {
		t.Fatal(err)
	}

	if _, err := f.sellers.AddStaff(stranger, second.ID, f.mail("owner")); err != nil {
		t.Fatal(err)
	}

	ownerID, strangerID := callerID(owner), callerID(stranger)

	got, err := f.sellers.MembershipsForAdmins(admin, []uuid.UUID{ownerID, strangerID, uuid.New()})
	if err != nil {
		t.Fatal(err)
	}

	want := map[uuid.UUID][]seller.Role{ownerID: {seller.RoleOwner, seller.RoleStaff}, strangerID: {seller.RoleOwner}}
	for _, m := range got {
		roles := want[m.AccountID]
		if len(roles) == 0 || m.Role != roles[0] {
			t.Errorf("unexpected membership %+v", m)

			continue
		}

		want[m.AccountID] = roles[1:]

		if m.AccountID == ownerID && m.Role == seller.RoleOwner && (m.SellerID != first.ID || m.SellerName != first.Name) {
			t.Errorf("the owner's seller: %+v, want %s", m, first.Name)
		}
	}

	for id, left := range want {
		if len(left) > 0 {
			t.Errorf("%s misses %v", id, left)
		}
	}

	if _, err := f.sellers.MembershipsForAdmins(owner, []uuid.UUID{ownerID}); !errors.Is(err, platform.ErrAdminRequired) {
		t.Errorf("a customer reading memberships: %v, want ErrAdminRequired", err)
	}

	if _, err := f.sellers.MembershipsForAdmins(admin, make([]uuid.UUID, 101)); !errors.Is(err, seller.ErrListInvalid) {
		t.Errorf("101 accounts: %v, want ErrListInvalid", err)
	}
}

func callerID(ctx context.Context) uuid.UUID {
	c, _ := platform.CallerFrom(ctx)

	return c.AccountID
}
