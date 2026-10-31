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

// checkDeletion: an admin deletes a seller from any status but deleted; it is
// blocked at once and waits, then FinishDeletion deletes it, which takes it
// from its members and from the admins' list unless asked; restoring it, while
// it waits or once deleted, leaves it blocked; approving it ends the wait too.
func checkDeletion(t *testing.T, pool *pgxpool.Pool, f fixture) {
	t.Helper()

	admin := f.as(t, "admin", platform.RoleAdmin)

	for _, from := range []seller.Status{
		seller.StatusPending, seller.StatusActive, seller.StatusRejected, seller.StatusBlocked,
	} {
		t.Run("delete a "+string(from)+" seller", func(t *testing.T) {
			id := sellerIn(t, pool, f, from)

			got, err := f.sellers.Delete(admin, id, blockReason)
			if err != nil || got.Status != seller.StatusBlocked || got.DeletionRequestedAt == nil ||
				got.StatusReason != blockReason {
				t.Fatalf("%+v, %v; want blocked, waiting, with the reason", got, err)
			}

			checkRecorded(t, pool, id, "seller.delete", 1)

			if _, err := f.sellers.Delete(admin, id, blockReason); !errors.Is(err, seller.ErrStatusChangeNotAllowed) {
				t.Errorf("deleting a seller already waiting: %v", err)
			}
		})
	}

	t.Run("a waiting seller is deleted, then restored blocked", func(t *testing.T) {
		checkDeletedThenRestored(admin, t, pool, f)
	})

	t.Run("restoring or approving a waiting seller ends the wait", func(t *testing.T) {
		checkWaitEnded(admin, t, pool, f)
	})

	customer := f.as(t, "customer", platform.RoleCustomer)
	if _, err := f.sellers.Delete(customer, sellerIn(t, pool, f, seller.StatusActive), blockReason); !errors.Is(err, platform.ErrAdminRequired) {
		t.Errorf("a customer deleting: %v", err)
	}

	if _, err := f.sellers.Restore(admin, uuid.New()); !errors.Is(err, seller.ErrNotFound) {
		t.Errorf("restoring an unknown seller: %v", err)
	}
}

// checkDeletedThenRestored: a waiting seller still reads for its owner, then
// is deleted, gone, and restored blocked.
func checkDeletedThenRestored(admin context.Context, t *testing.T, pool *pgxpool.Pool, f fixture) {
	t.Helper()

	owner := f.as(t, "deleted.owner", platform.RoleCustomer)
	id := openNamed(owner, t, pool, f, "Quán Sắp Xoá", "0977 000 222", seller.StatusActive)

	if _, err := f.sellers.Delete(admin, id, blockReason); err != nil {
		t.Fatal(err)
	}

	checkWaiting(owner, t, f, id)

	if err := f.sellers.FinishDeletion(t.Context(), id); err != nil {
		t.Fatal(err)
	}

	checkGone(owner, t, f, id)

	if err := f.sellers.FinishDeletion(t.Context(), id); err != nil {
		t.Errorf("finishing again: %v", err)
	}

	if _, err := f.sellers.Delete(admin, id, blockReason); !errors.Is(err, seller.ErrStatusChangeNotAllowed) {
		t.Errorf("deleting a deleted seller: %v", err)
	}

	restored, err := f.sellers.Restore(admin, id)
	if err != nil || restored.Status != seller.StatusBlocked || restored.DeletionRequestedAt != nil {
		t.Fatalf("restored: %+v, %v; want blocked, not waiting", restored, err)
	}

	if _, err := f.sellers.Get(owner, id); err != nil {
		t.Errorf("the owner reads the restored seller: %v", err)
	}

	if _, err := f.sellers.Restore(admin, id); !errors.Is(err, seller.ErrStatusChangeNotAllowed) {
		t.Errorf("restoring a blocked seller that does not wait: %v", err)
	}

	checkRestoreRecorded(t, pool, id)
}

// checkWaitEnded: restoring or approving a waiting seller ends the wait, so
// FinishDeletion leaves it as it is.
func checkWaitEnded(admin context.Context, t *testing.T, pool *pgxpool.Pool, f fixture) {
	t.Helper()

	for _, end := range []func(context.Context, uuid.UUID) (seller.Seller, error){f.sellers.Restore, f.sellers.Approve} {
		id := sellerIn(t, pool, f, seller.StatusActive)
		if _, err := f.sellers.Delete(admin, id, blockReason); err != nil {
			t.Fatal(err)
		}

		got, err := end(admin, id)
		if err != nil || got.DeletionRequestedAt != nil {
			t.Fatalf("%+v, %v; want the wait over", got, err)
		}

		if err := f.sellers.FinishDeletion(t.Context(), id); err != nil {
			t.Fatal(err)
		}

		if s, err := f.sellers.Get(admin, id); err != nil || s.Status == seller.StatusDeleted {
			t.Errorf("a seller no longer waiting was deleted: %+v, %v", s.Status, err)
		}
	}
}

// checkWaiting: a seller waiting to be deleted no longer shows to customers,
// is among those order finishes, and still reads for its owner, who hands
// over its orders.
func checkWaiting(owner context.Context, t *testing.T, f fixture, id uuid.UUID) {
	t.Helper()

	if _, err := f.sellers.PublicOf(t.Context(), id); !errors.Is(err, seller.ErrNotFound) {
		t.Errorf("a waiting seller shows to customers: %v", err)
	}

	if ids, err := f.sellers.AwaitingDeletion(t.Context()); err != nil || !slices.Contains(ids, id) {
		t.Errorf("awaiting deletion: %v, %v", ids, err)
	}

	if _, err := f.sellers.Get(owner, id); err != nil {
		t.Errorf("the owner reads a waiting seller, to hand over its orders: %v", err)
	}
}

// checkGone: a deleted seller is gone for its owner, left out of the admins'
// list unless asked for, and counted.
func checkGone(owner context.Context, t *testing.T, f fixture, id uuid.UUID) {
	t.Helper()

	if _, err := f.sellers.Get(owner, id); !errors.Is(err, seller.ErrNotFound) {
		t.Errorf("the owner reads a deleted seller: %v", err)
	}

	mine, err := f.sellers.Mine(owner)
	if err != nil || slices.ContainsFunc(mine, func(s seller.Seller) bool { return s.ID == id }) {
		t.Errorf("a deleted seller among the owner's: %v", err)
	}

	admin := f.as(t, "admin", platform.RoleAdmin)

	all, err := f.sellers.List(admin, seller.Filter{Query: "0977000222", Page: 1, Size: 10})
	if err != nil || all.Total != 0 || all.Counts[seller.StatusDeleted] != 1 {
		t.Errorf("the list by default: total %d, counts %v, %v; want none listed, one deleted counted",
			all.Total, all.Counts, err)
	}

	deleted, err := f.sellers.List(admin, seller.Filter{
		Statuses: []seller.Status{seller.StatusDeleted}, Query: "0977000222", Page: 1, Size: 10,
	})
	if err != nil || deleted.Total != 1 || deleted.Sellers[0].Status != seller.StatusDeleted {
		t.Errorf("the deleted ones asked: total %d, %v", deleted.Total, err)
	}
}

// checkRestoreRecorded: the seller's trail ends with its restoring, and only
// the deletion told the owner.
func checkRestoreRecorded(t *testing.T, pool *pgxpool.Pool, id uuid.UUID) {
	t.Helper()

	var last string

	var jobs int
	if err := pool.QueryRow(t.Context(), `SELECT
		(SELECT action FROM audit_events WHERE resource_type = 'seller' AND resource_id = $1::text ORDER BY occurred_at DESC LIMIT 1),
		(SELECT count(*) FROM river_job WHERE args->>'event' = 'seller.status_changed' AND args->'payload'->>'sellerId' = $1::text)`,
		id).Scan(&last, &jobs); err != nil {
		t.Fatal(err)
	}

	if last != "seller.restore" || jobs != 1 {
		t.Errorf("last action %q and %d jobs to tell the owner; want seller.restore and the deletion's one", last, jobs)
	}
}
