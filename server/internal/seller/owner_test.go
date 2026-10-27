package seller_test

import (
	"context"
	"errors"
	"testing"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/platform/platformtest"
	"github.com/kl3inIT/second-bite/server/internal/seller"
)

// TestChangeOwner: admins hand a store the team opened to the person who runs
// it, the previous owner staying on as staff (SEC-162).
func TestChangeOwner(t *testing.T) {
	t.Parallel()

	pool := platformtest.StartPostgres(t)

	for name, check := range map[string]func(*testing.T, *pgxpool.Pool){
		"a store is handed to a new address and the team member stays as staff": checkHandedToNewAddress,
		"staff become the owner and nobody else may change it":                  checkStaffPromotedAndRefusals,
		"an owner of five and a full store are refused":                         checkOwnerLimits,
		"a store left without an owner gets one and may be approved again":      checkOwnerlessGetsOwner,
	} {
		t.Run(name, func(t *testing.T) {
			t.Parallel()
			check(t, pool)
		})
	}
}

func checkHandedToNewAddress(t *testing.T, pool *pgxpool.Pool) {
	t.Helper()

	f := newFixture(t, pool)
	admin := f.as(t, "admin", platform.RoleAdmin)
	team := f.as(t, "team", platform.RoleCustomer)

	store, err := f.sellers.Open(team, shop)
	if err != nil {
		t.Fatal(err)
	}

	members, err := f.sellers.ChangeOwner(admin, store.ID, f.mail("chu.that"))
	if err != nil {
		t.Fatal(err)
	}

	roles := rolesOf(members)
	if len(members) != 2 || roles[f.mail("chu.that")] != seller.RoleOwner || roles[f.mail("team")] != seller.RoleStaff {
		t.Fatalf("members after the change: %v", roles)
	}

	// The new owner signs in with the address and runs the store.
	owner := f.as(t, "chu.that", platform.RoleCustomer)
	if s, err := f.sellers.Get(owner, store.ID); err != nil || s.MyRole != seller.RoleOwner {
		t.Errorf("the new owner reads %v, %v", s.MyRole, err)
	}

	mustPublish(owner, t, f, store.ID, true)

	// The previous owner may leave now, as staff do, or be removed.
	if err := f.sellers.RemoveMember(team, store.ID, callerID(team)); err != nil {
		t.Errorf("the previous owner leaving: %v", err)
	}

	checkOwnerChangesRecorded(t, pool, store.ID, 1)

	if _, err := f.sellers.ChangeOwner(admin, store.ID, f.mail("chu.that")); !errors.Is(err, seller.ErrAlreadyOwner) {
		t.Errorf("handing it to its owner again: %v, want ErrAlreadyOwner", err)
	}
}

func checkStaffPromotedAndRefusals(t *testing.T, pool *pgxpool.Pool) {
	t.Helper()

	f := newFixture(t, pool)
	admin := f.as(t, "admin", platform.RoleAdmin)
	owner := f.as(t, "owner", platform.RoleCustomer)

	store, err := f.sellers.Open(owner, shop)
	if err != nil {
		t.Fatal(err)
	}

	if _, err := f.sellers.AddStaff(owner, store.ID, f.mail("staff")); err != nil {
		t.Fatal(err)
	}

	// Neither the owner nor anyone but an admin may change the owner.
	for who, ctx := range map[string]context.Context{"the owner": owner, "staff": f.as(t, "staff", platform.RoleCustomer)} {
		if _, err := f.sellers.ChangeOwner(ctx, store.ID, f.mail("staff")); !errors.Is(err, platform.ErrAdminRequired) {
			t.Errorf("%s changing the owner: %v, want ErrAdminRequired", who, err)
		}
	}

	if _, err := f.sellers.ChangeOwner(admin, uuid.New(), f.mail("staff")); !errors.Is(err, seller.ErrNotFound) {
		t.Errorf("an unknown store: %v, want ErrNotFound", err)
	}

	members, err := f.sellers.ChangeOwner(admin, store.ID, f.mail("staff"))
	if err != nil {
		t.Fatal(err)
	}

	roles := rolesOf(members)
	if len(members) != 2 || roles[f.mail("staff")] != seller.RoleOwner || roles[f.mail("owner")] != seller.RoleStaff {
		t.Errorf("members after promoting staff: %v", roles)
	}

	checkOwnerChangesRecorded(t, pool, store.ID, 1)
}

func checkOwnerLimits(t *testing.T, pool *pgxpool.Pool) {
	t.Helper()

	f := newFixture(t, pool)
	admin := f.as(t, "admin", platform.RoleAdmin)
	busy := f.as(t, "busy", platform.RoleCustomer)

	for range 5 {
		if _, err := f.sellers.Open(busy, shop); err != nil {
			t.Fatal(err)
		}
	}

	store, err := f.sellers.Open(f.as(t, "team", platform.RoleCustomer), shop)
	if err != nil {
		t.Fatal(err)
	}

	if _, err := f.sellers.ChangeOwner(admin, store.ID, f.mail("busy")); !errors.Is(err, seller.ErrNewOwnerLimitReached) {
		t.Errorf("an owner of five: %v, want ErrNewOwnerLimitReached", err)
	}

	// Thirty people already: someone from outside cannot join as the owner.
	if _, err := pool.Exec(t.Context(), `INSERT INTO seller_members (seller_id, account_id, role)
		SELECT $1, gen_random_uuid(), 'staff' FROM generate_series(1, 29)`, store.ID); err != nil {
		t.Fatal(err)
	}

	if _, err := f.sellers.ChangeOwner(admin, store.ID, f.mail("outsider")); !errors.Is(err, seller.ErrStaffLimitReached) {
		t.Errorf("a full store: %v, want ErrStaffLimitReached", err)
	}

	checkOwnerChangesRecorded(t, pool, store.ID, 0)
}

func checkOwnerlessGetsOwner(t *testing.T, pool *pgxpool.Pool) {
	t.Helper()

	f := newFixture(t, pool)
	admin := f.as(t, "admin", platform.RoleAdmin)
	id := sellerIn(t, pool, f, seller.StatusBlocked)

	if _, err := pool.Exec(t.Context(), `DELETE FROM seller_members WHERE seller_id = $1`, id); err != nil {
		t.Fatal(err)
	}

	members, err := f.sellers.ChangeOwner(admin, id, f.mail("chu.moi"))
	if err != nil {
		t.Fatal(err)
	}

	if roles := rolesOf(members); len(members) != 1 || roles[f.mail("chu.moi")] != seller.RoleOwner {
		t.Errorf("members of the store that had none: %v", roles)
	}

	if s, err := f.sellers.Approve(admin, id); err != nil || s.Status != seller.StatusActive {
		t.Errorf("approving it with its new owner: %v, %v", s.Status, err)
	}
}

func rolesOf(members []seller.Member) map[string]seller.Role {
	roles := make(map[string]seller.Role, len(members))
	for _, m := range members {
		roles[m.Email] = m.Role
	}

	return roles
}

// checkOwnerChangesRecorded counts the store's seller.change_owner events.
func checkOwnerChangesRecorded(t *testing.T, pool *pgxpool.Pool, id uuid.UUID, want int) {
	t.Helper()

	var got int
	if err := pool.QueryRow(t.Context(), `SELECT count(*) FROM audit_events
		WHERE resource_type = 'seller' AND resource_id = $1::text AND action = 'seller.change_owner'`, id).Scan(&got); err != nil {
		t.Fatal(err)
	}

	if got != want {
		t.Errorf("%d seller.change_owner events, want %d", got, want)
	}
}
