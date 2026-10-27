package seller_test

import (
	"context"
	"errors"
	"slices"
	"testing"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/seller"
)

// testFollowing follows and unfollows sellers: both are idempotent, the list
// shows the latest followed first and only to the one who follows, and a
// seller not active cannot be followed and drops out once blocked.
func testFollowing(t *testing.T, pool *pgxpool.Pool) {
	t.Helper()

	f := newFixture(t, pool)
	owner := f.as(t, "owner@example.com", platform.RoleCustomer)
	admin := f.as(t, "admin@example.com", platform.RoleAdmin)
	me := f.as(t, "me@example.com", platform.RoleCustomer)
	other := f.as(t, "other@example.com", platform.RoleCustomer)

	first := mustOpen(owner, t, f)
	second := mustOpen(owner, t, f)
	third := mustOpen(owner, t, f)

	if err := f.sellers.Follow(t.Context(), first); !errors.Is(err, platform.ErrAuthenticationRequired) {
		t.Fatalf("followed without signing in: %v", err)
	}

	if _, err := f.sellers.Followed(t.Context()); !errors.Is(err, platform.ErrAuthenticationRequired) {
		t.Fatalf("listed without signing in: %v", err)
	}

	for _, id := range []uuid.UUID{first, second, first, third} {
		mustFollow(me, t, f, id)
	}

	wantFollowed(me, t, f, third, second, first)
	wantFollowed(other, t, f)

	if err := f.sellers.Unfollow(me, second); err != nil {
		t.Fatal(err)
	}

	if err := f.sellers.Unfollow(me, second); err != nil {
		t.Fatalf("unfollowed again: %v", err)
	}

	if err := f.sellers.Unfollow(other, first); err != nil {
		t.Fatalf("unfollowed a seller never followed: %v", err)
	}

	wantFollowed(me, t, f, third, first)

	if _, err := f.sellers.Block(admin, third, blockReason); err != nil {
		t.Fatal(err)
	}

	wantFollowed(me, t, f, first)

	if err := f.sellers.Follow(me, third); !errors.Is(err, seller.ErrNotFound) {
		t.Fatalf("followed a blocked seller: %v", err)
	}

	if _, err := pool.Exec(t.Context(), `UPDATE seller_sellers SET status = 'pending' WHERE id = $1`, first); err != nil {
		t.Fatal(err)
	}

	if err := f.sellers.Follow(other, first); !errors.Is(err, seller.ErrNotFound) {
		t.Fatalf("followed a pending seller: %v", err)
	}

	if err := f.sellers.Follow(me, uuid.New()); !errors.Is(err, seller.ErrNotFound) {
		t.Fatalf("followed an unknown seller: %v", err)
	}

	wantFollowed(me, t, f)
}

func mustOpen(ctx context.Context, t *testing.T, f fixture) uuid.UUID {
	t.Helper()

	s, err := f.sellers.Open(ctx, shop)
	if err != nil {
		t.Fatal(err)
	}

	return s.ID
}

func mustFollow(ctx context.Context, t *testing.T, f fixture, id uuid.UUID) {
	t.Helper()

	if err := f.sellers.Follow(ctx, id); err != nil {
		t.Fatal(err)
	}
}

// wantFollowed checks the sellers the caller follows, in order.
func wantFollowed(ctx context.Context, t *testing.T, f fixture, want ...uuid.UUID) {
	t.Helper()

	followed, err := f.sellers.Followed(ctx)
	if err != nil {
		t.Fatal(err)
	}

	got := make([]uuid.UUID, 0, len(followed))
	for _, p := range followed {
		got = append(got, p.ID)
	}

	if !slices.Equal(got, want) {
		t.Fatalf("followed %v, want %v", got, want)
	}
}
