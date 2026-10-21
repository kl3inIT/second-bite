package identity

import (
	"context"
	"errors"
	"sync"
	"testing"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/kl3inIT/second-bite/server/internal/audit"
	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/platform/platformtest"
)

// TestAdmins checks granting and revoking admins (SEC-75) on a database of
// its own, since who is the last admin is a fact of the whole database.
func TestAdmins(t *testing.T) {
	t.Parallel()

	pool := platformtest.StartPostgres(t)

	s, err := NewService(pool, nil, nil, audit.NewService(pool, platformtest.Logger()),
		Config{CodeKey: make([]byte, 32)}, platformtest.Logger())
	if err != nil {
		t.Fatal(err)
	}

	first, err := s.GrantAdminAsSystem(t.Context(), "first.admin@example.com")
	if err != nil || first.Role != platform.RoleAdmin {
		t.Fatalf("the first admin: %+v, %v", first, err)
	}

	checkFirstAdminStays(t, s, first)
	second := checkGrantByAddress(t, s, pool, first)
	checkCustomersNeitherGrantNorRevoke(t, s, second)
	checkConcurrentRevokes(t, s, first, second)

	admins, err := s.Admins(adminCtx(t.Context(), first))
	if err != nil || len(admins) != 1 {
		t.Fatalf("admins after the revokes: %+v, %v; want one", admins, err)
	}

	gone := first
	if admins[0].ID == first.ID {
		gone = second
	}

	checkRevokeIdempotent(t, s, pool, admins[0].Account, gone)
}

// checkFirstAdminStays: the only admin cannot be revoked, alone or by themselves.
func checkFirstAdminStays(t *testing.T, s *Service, first Account) {
	t.Helper()

	if _, err := s.RevokeAdminAsSystem(t.Context(), first.Email); !errors.Is(err, ErrLastAdmin) {
		t.Errorf("revoking the last admin: %v, want ErrLastAdmin", err)
	}

	if _, err := s.RevokeAdmin(adminCtx(t.Context(), first), first.ID); !errors.Is(err, ErrAdminSelf) {
		t.Errorf("revoking oneself: %v, want ErrAdminSelf", err)
	}
}

// checkGrantByAddress: an admin grants an address that has never signed in,
// then again; the second grant records nothing.
func checkGrantByAddress(t *testing.T, s *Service, pool *pgxpool.Pool, by Account) Account {
	t.Helper()

	ctx := adminCtx(t.Context(), by)

	second, err := s.GrantAdmin(ctx, "Second.Admin@Example.com")
	if err != nil || second.Role != platform.RoleAdmin || second.Email != "second.admin@example.com" {
		t.Fatalf("granting a new address: %+v, %v", second, err)
	}

	if _, err := s.GrantAdmin(ctx, second.Email); err != nil {
		t.Fatal(err)
	}

	checkAdminEvents(t, pool, second.ID, "admin.grant", 1)

	return second
}

// checkCustomersNeitherGrantNorRevoke: a customer may do neither.
func checkCustomersNeitherGrantNorRevoke(t *testing.T, s *Service, admin Account) {
	t.Helper()

	customer := platform.WithCaller(t.Context(), platform.Caller{AccountID: uuid.New(), Role: platform.RoleCustomer})
	if _, err := s.GrantAdmin(customer, "third@example.com"); !errors.Is(err, platform.ErrAdminRequired) {
		t.Errorf("a customer granting: %v", err)
	}

	if _, err := s.RevokeAdmin(customer, admin.ID); !errors.Is(err, platform.ErrAdminRequired) {
		t.Errorf("a customer revoking: %v", err)
	}
}

// checkRevokeIdempotent: revoking a customer changes and records nothing;
// an unknown account is not found.
func checkRevokeIdempotent(t *testing.T, s *Service, pool *pgxpool.Pool, admin, customer Account) {
	t.Helper()

	ctx := adminCtx(t.Context(), admin)

	if a, err := s.RevokeAdmin(ctx, customer.ID); err != nil || a.Role != platform.RoleCustomer {
		t.Errorf("revoking a customer: %+v, %v", a, err)
	}

	checkAdminEvents(t, pool, customer.ID, "admin.revoke", 1)

	if _, err := s.RevokeAdmin(ctx, uuid.New()); !errors.Is(err, ErrAccountNotFound) {
		t.Errorf("revoking an unknown account: %v", err)
	}
}

// checkConcurrentRevokes has the two admins revoke each other at once: one
// revoke passes, the other finds the last admin.
func checkConcurrentRevokes(t *testing.T, s *Service, a, b Account) {
	t.Helper()

	var wg sync.WaitGroup

	errs := make([]error, 2)

	for i, pair := range [][2]Account{{a, b}, {b, a}} {
		wg.Go(func() {
			_, errs[i] = s.RevokeAdmin(adminCtx(t.Context(), pair[0]), pair[1].ID)
		})
	}

	wg.Wait()

	passed, last := 0, 0

	for _, err := range errs {
		switch {
		case err == nil:
			passed++
		case errors.Is(err, ErrLastAdmin):
			last++
		default:
			t.Errorf("revoking at once: %v", err)
		}
	}

	if passed != 1 || last != 1 {
		t.Errorf("revoking each other at once: %d passed and %d found the last admin, want 1 and 1", passed, last)
	}
}

// checkAdminEvents checks that action was recorded want times on account.
func checkAdminEvents(t *testing.T, pool *pgxpool.Pool, account uuid.UUID, action string, want int) {
	t.Helper()

	var got int
	if err := pool.QueryRow(t.Context(),
		`SELECT count(*) FROM audit_events WHERE resource_type = 'account' AND resource_id = $1::text AND action = $2`,
		account, action).Scan(&got); err != nil {
		t.Fatal(err)
	}

	if got != want {
		t.Errorf("%d %s events on %s, want %d", got, action, account, want)
	}
}

func adminCtx(ctx context.Context, a Account) context.Context {
	return platform.WithCaller(ctx, platform.Caller{AccountID: a.ID, Role: platform.RoleAdmin, Label: a.Email})
}
