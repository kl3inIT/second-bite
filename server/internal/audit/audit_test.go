package audit

import (
	"context"
	"errors"
	"testing"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/platform/platformtest"
)

// testBlocked stands for a catalog action; only this package can declare one.
type testBlocked struct {
	Reason string `json:"reason"`
}

func (testBlocked) action() string { return "test_seller.block" }

type event struct {
	action, resourceType, resourceID, details string
	actorID                                   *uuid.UUID
	actorLabel, resourceLabel, requestID      *string
}

// storeName is a store's name, which the trail keeps whoever is deleted.
const storeName = "Bếp Cô Ba"

func TestService(t *testing.T) {
	t.Parallel()

	pool := platformtest.StartPostgres(t)
	s := NewService(pool, platformtest.Logger())

	for name, check := range map[string]func(*testing.T, *pgxpool.Pool, *Service){
		"Record keeps the admin, the request and the details":    checkRecordKeepsActor,
		"Record from the command line has no actor":              checkRecordWithoutActor,
		"an event goes with its change when the change fails":    checkRecordRollsBack,
		"ForgetAccount nulls only the labels naming the account": checkForgetAccount,
	} {
		t.Run(name, func(t *testing.T) {
			t.Parallel()
			check(t, pool, s)
		})
	}
}

func checkRecordKeepsActor(t *testing.T, pool *pgxpool.Pool, s *Service) {
	t.Helper()

	admin := platform.Caller{AccountID: uuid.New(), Role: platform.RoleAdmin, Label: "admin@example.com"}
	ctx := platform.WithCaller(t.Context(), admin)
	seller := uuid.NewString()

	record(t, pool, s, ctx, Resource{Type: ResourceSeller, ID: seller, Label: storeName}, testBlocked{Reason: "Bán đồ quá hạn"})

	got := eventsOn(t, pool, seller)
	if len(got) != 1 {
		t.Fatalf("%d events, want 1", len(got))
	}

	e := got[0]
	if e.action != "test_seller.block" || e.resourceType != ResourceSeller || deref(e.resourceLabel) != storeName {
		t.Errorf("event %+v", e)
	}

	if e.actorID == nil || *e.actorID != admin.AccountID || deref(e.actorLabel) != admin.Label {
		t.Errorf("actor %v %q, want %v %q", e.actorID, deref(e.actorLabel), admin.AccountID, admin.Label)
	}

	if e.details != `{"reason": "Bán đồ quá hạn"}` {
		t.Errorf("details %s", e.details)
	}
}

func checkRecordWithoutActor(t *testing.T, pool *pgxpool.Pool, s *Service) {
	t.Helper()

	account := uuid.NewString()
	record(t, pool, s, t.Context(), Resource{Type: ResourceAccount, ID: account}, testBlocked{})

	got := eventsOn(t, pool, account)
	if len(got) != 1 || got[0].actorID != nil || got[0].actorLabel != nil || got[0].requestID != nil {
		t.Errorf("events %+v, want one without actor or request", got)
	}
}

func checkRecordRollsBack(t *testing.T, pool *pgxpool.Pool, s *Service) {
	t.Helper()

	seller := uuid.NewString()
	failed := errors.New("the change failed")

	err := pgx.BeginFunc(t.Context(), pool, func(tx pgx.Tx) error {
		if err := s.Record(t.Context(), tx, Resource{Type: ResourceSeller, ID: seller}, testBlocked{}); err != nil {
			return err
		}

		return failed
	})
	if !errors.Is(err, failed) {
		t.Fatalf("transaction: %v", err)
	}

	if got := eventsOn(t, pool, seller); len(got) != 0 {
		t.Errorf("%d events kept after the change failed, want 0", len(got))
	}
}

func checkForgetAccount(t *testing.T, pool *pgxpool.Pool, s *Service) {
	t.Helper()

	gone := platform.Caller{AccountID: uuid.New(), Role: platform.RoleAdmin, Label: "gone@example.com"}
	kept := platform.Caller{AccountID: uuid.New(), Role: platform.RoleAdmin, Label: "kept@example.com"}
	seller := uuid.NewString()

	record(t, pool, s, platform.WithCaller(t.Context(), gone), Resource{Type: ResourceSeller, ID: seller, Label: storeName}, testBlocked{})
	record(t, pool, s, platform.WithCaller(t.Context(), kept),
		Resource{Type: ResourceAccount, ID: gone.AccountID.String(), Label: gone.Label}, testBlocked{})
	record(t, pool, s, platform.WithCaller(t.Context(), gone),
		Resource{Type: ResourceAccount, ID: kept.AccountID.String(), Label: kept.Label}, testBlocked{})

	if err := pgx.BeginFunc(t.Context(), pool, func(tx pgx.Tx) error {
		return s.ForgetAccount(t.Context(), tx, gone.AccountID)
	}); err != nil {
		t.Fatal(err)
	}

	bySeller := eventsOn(t, pool, seller)[0]
	if bySeller.actorLabel != nil || deref(bySeller.resourceLabel) != storeName || *bySeller.actorID != gone.AccountID {
		t.Errorf("the deleted admin's action: %+v, want its id kept, its address gone, the store's name kept", bySeller)
	}

	onGone := eventsOn(t, pool, gone.AccountID.String())[0]
	if onGone.resourceLabel != nil || deref(onGone.actorLabel) != kept.Label {
		t.Errorf("the action on the deleted account: %+v, want its address gone, the actor kept", onGone)
	}

	onKept := eventsOn(t, pool, kept.AccountID.String())[0]
	if deref(onKept.resourceLabel) != kept.Label || onKept.actorLabel != nil {
		t.Errorf("the deleted admin's action on another account: %+v", onKept)
	}
}

func record(t *testing.T, pool *pgxpool.Pool, s *Service, ctx context.Context, r Resource, a Action) { //nolint:revive // t first, as every helper
	t.Helper()

	if err := pgx.BeginFunc(ctx, pool, func(tx pgx.Tx) error { return s.Record(ctx, tx, r, a) }); err != nil {
		t.Fatal(err)
	}
}

func eventsOn(t *testing.T, pool *pgxpool.Pool, resourceID string) []event {
	t.Helper()

	rows, err := pool.Query(t.Context(), `SELECT action, resource_type, resource_id, details::text,
		actor_id, actor_label, resource_label, request_id
		FROM audit_events WHERE resource_id = $1 ORDER BY occurred_at, id`, resourceID)
	if err != nil {
		t.Fatal(err)
	}

	got, err := pgx.CollectRows(rows, func(row pgx.CollectableRow) (event, error) {
		var e event

		err := row.Scan(&e.action, &e.resourceType, &e.resourceID, &e.details,
			&e.actorID, &e.actorLabel, &e.resourceLabel, &e.requestID)

		return e, err
	})
	if err != nil {
		t.Fatal(err)
	}

	return got
}

func deref(s *string) string {
	if s == nil {
		return ""
	}

	return *s
}
