package seller_test

import (
	"context"
	"errors"
	"testing"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/kl3inIT/second-bite/server/internal/identity"
	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/platform/platformtest"
	"github.com/kl3inIT/second-bite/server/internal/seller"
)

type fixture struct {
	sellers  *seller.Service
	accounts *identity.Service
}

func newFixture(t *testing.T, pool *pgxpool.Pool) fixture {
	t.Helper()

	// Sending sign-in codes is not exercised here, so identity has no email.
	accounts, err := identity.NewService(pool, nil, identity.Config{CodeKey: make([]byte, 32)}, platformtest.Logger())
	if err != nil {
		t.Fatal(err)
	}

	return fixture{sellers: seller.NewService(pool, accounts, platformtest.Logger()), accounts: accounts}
}

// as returns a context whose caller is the account of email.
func (f fixture) as(t *testing.T, email string, role platform.Role) context.Context {
	t.Helper()

	a, err := f.accounts.EnsureAccount(t.Context(), email)
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
func TestPublishingFollowsStatusAndMembership(t *testing.T) {
	t.Parallel()

	f := newFixture(t, platformtest.StartPostgres(t))
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

	if _, err := f.sellers.AddStaff(owner, s.ID, "Staff@Example.com"); err != nil {
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

func TestOnlyTheRightPeopleActOnASeller(t *testing.T) {
	t.Parallel()

	f := newFixture(t, platformtest.StartPostgres(t))
	owner := f.as(t, "owner@example.com", platform.RoleCustomer)
	staff := f.as(t, "staff@example.com", platform.RoleCustomer)
	stranger := f.as(t, "stranger@example.com", platform.RoleCustomer)

	s, err := f.sellers.Open(owner, shop)
	if err != nil {
		t.Fatal(err)
	}

	if _, err := f.sellers.AddStaff(owner, s.ID, "staff@example.com"); err != nil {
		t.Fatal(err)
	}

	checks := []struct {
		name string
		err  error
		want error
	}{
		{"a stranger does not see the seller", get(stranger, f, s.ID), seller.ErrNotFound},
		{"staff do not change it", update(staff, f, s.ID), seller.ErrOwnerRequired},
		{"staff do not add staff", addStaff(staff, f, s.ID, "other@example.com"), seller.ErrOwnerRequired},
		{"the same person is not added twice", addStaff(owner, f, s.ID, "STAFF@example.com"), seller.ErrAlreadyMember},
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

func TestAnOwnerOpensAtMostFiveSellers(t *testing.T) {
	t.Parallel()

	f := newFixture(t, platformtest.StartPostgres(t))
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

func TestDetailsAreChecked(t *testing.T) {
	t.Parallel()

	f := newFixture(t, platformtest.StartPostgres(t))
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
