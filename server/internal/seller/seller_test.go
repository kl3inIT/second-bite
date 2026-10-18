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

	"github.com/kl3inIT/second-bite/server/internal/identity"
	"github.com/kl3inIT/second-bite/server/internal/media"
	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/platform/platformtest"
	"github.com/kl3inIT/second-bite/server/internal/seller"
)

type fixture struct {
	sellers  *seller.Service
	accounts *identity.Service
	photos   *media.Service
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
	accounts, err := identity.NewService(pool, nil, identity.Config{CodeKey: make([]byte, 32)}, platformtest.Logger())
	if err != nil {
		t.Fatal(err)
	}

	photos, err := media.NewService(pool, media.Config{}, platformtest.Logger())
	if err != nil {
		t.Fatal(err)
	}

	return fixture{
		sellers: seller.NewService(pool, accounts, photos, platformtest.Logger()), accounts: accounts, photos: photos,
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

var shop = seller.Details{Name: "Bánh mì Tasco", Address: "Tasco Mall, Việt Hưng", Latitude: 21.0565, Longitude: 105.8964, Phone: "0912 345 678"}

func mustCanPublish(ctx context.Context, t *testing.T, f fixture, sellerID uuid.UUID, want bool) {
	t.Helper()

	caller, _ := platform.CallerFrom(ctx)

	got, err := f.sellers.CanPublish(t.Context(), sellerID, caller.AccountID)
	if err != nil {
		t.Fatal(err)
	}

	if got != want {
		t.Fatalf("CanPublish %v, want %v", got, want)
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

	if s.Status != seller.StatusPending || s.MyRole != seller.RoleOwner || s.Phone != "0912345678" {
		t.Fatalf("opened %+v", s)
	}

	mustCanPublish(owner, t, f, s.ID, false) // pending

	if _, err := f.sellers.AddStaff(owner, s.ID, strings.ToUpper(f.mail("staff"))); err != nil {
		t.Fatal(err)
	}

	if _, err := f.sellers.Activate(admin, s.ID); err != nil {
		t.Fatal(err)
	}

	mustCanPublish(owner, t, f, s.ID, true)
	mustCanPublish(staff, t, f, s.ID, true)
	mustCanPublish(stranger, t, f, s.ID, false)

	if _, err := f.sellers.Block(admin, s.ID); err != nil {
		t.Fatal(err)
	}

	mustCanPublish(owner, t, f, s.ID, false) // blocked
	mustCanPublish(staff, t, f, s.ID, false)

	if _, err := f.sellers.Activate(admin, s.ID); err != nil { // a block is lifted the same way
		t.Fatal(err)
	}

	caller, _ := platform.CallerFrom(staff)
	if err := f.sellers.RemoveMember(owner, s.ID, caller.AccountID); err != nil {
		t.Fatal(err)
	}

	mustCanPublish(staff, t, f, s.ID, false) // removed: the right ends at once
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
		{"a customer does not activate", activate(owner, f, s.ID), platform.ErrAdminRequired},
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

func activate(ctx context.Context, f fixture, id uuid.UUID) error {
	_, err := f.sellers.Activate(ctx, id)

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

	if _, err := f.sellers.SetPhoto(owner, s.ID, &theirs.ID); !errors.Is(err, media.ErrPhotoNotFound) {
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
