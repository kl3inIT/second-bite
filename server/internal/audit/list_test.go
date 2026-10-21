package audit

import (
	"errors"
	"reflect"
	"strings"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/platform/platformtest"
)

func TestList(t *testing.T) {
	t.Parallel()

	pool := platformtest.StartPostgres(t)
	s := NewService(pool, platformtest.Logger())

	for name, check := range map[string]func(*testing.T, *pgxpool.Pool, *Service){
		"an admin's events, the latest first, with their details": checkListByActor,
		"filters by action, words and time, and pages":            checkListFilters,
		"filters out of bounds and customers are refused":         checkListRefused,
	} {
		t.Run(name, func(t *testing.T) {
			t.Parallel()
			check(t, pool, s)
		})
	}
}

// listWorld is one admin who blocked a store, changed the offer settings and
// granted an admin, in that order.
type listWorld struct {
	admin  platform.Caller
	seller string
}

func newListWorld(t *testing.T, pool *pgxpool.Pool, s *Service) listWorld {
	t.Helper()

	w := listWorld{
		admin:  platform.Caller{AccountID: uuid.New(), Role: platform.RoleAdmin, Label: "list@example.com"},
		seller: uuid.NewString(),
	}
	ctx := platform.WithCaller(t.Context(), w.admin)

	record(t, pool, s, ctx, Resource{Type: ResourceSeller, ID: w.seller, Label: "Quán Lọc Thử"},
		SellerBlocked{Reason: "Bán đồ quá hạn nhiều lần"})
	record(t, pool, s, ctx, Resource{Type: ResourceOfferSettings, ID: SingletonID},
		OfferSettingsChanged{Changes: []Change{ChangedFromTo("minDiscountPercent", "20", "30")}})
	record(t, pool, s, ctx, Resource{Type: ResourceAccount, ID: uuid.NewString(), Label: "new@example.com"},
		AdminGranted{Source: SourceAdmin})

	return w
}

func (w listWorld) list(t *testing.T, s *Service, f Filter) Page {
	t.Helper()

	f.ActorID = &w.admin.AccountID
	if f.Page == 0 {
		f.Page, f.Size = 1, 10
	}

	page, err := s.List(platform.WithCaller(t.Context(), w.admin), f)
	if err != nil {
		t.Fatal(err)
	}

	return page
}

func checkListByActor(t *testing.T, pool *pgxpool.Pool, s *Service) {
	t.Helper()

	w := newListWorld(t, pool, s)
	page := w.list(t, s, Filter{})

	actions := make([]string, 0, len(page.Events))
	for _, e := range page.Events {
		actions = append(actions, e.Action)
	}

	if page.Total != 3 || strings.Join(actions, " ") != "admin.grant offer_settings.change seller.block" {
		t.Fatalf("total %d, actions %v; want the three, the latest first", page.Total, actions)
	}

	checkListedDetails(t, w, page.Events)
}

// checkListedDetails checks the details of the three events of a listWorld,
// the latest first.
func checkListedDetails(t *testing.T, w listWorld, events []Event) {
	t.Helper()

	granted, changed, blocked := events[0], events[1], events[2]
	if granted.Details.Source != SourceAdmin || granted.ActorLabel != w.admin.Label || *granted.ActorID != w.admin.AccountID {
		t.Errorf("the grant: %+v", granted)
	}

	if c := changed.Details.Changes; len(c) != 1 || c[0].Field != "minDiscountPercent" || *c[0].From != "20" || *c[0].To != "30" {
		t.Errorf("the settings change: %+v", changed.Details)
	}

	if blocked.Details.Reason != "Bán đồ quá hạn nhiều lần" || blocked.ResourceLabel != "Quán Lọc Thử" || blocked.ResourceID != w.seller {
		t.Errorf("the block: %+v", blocked)
	}
}

func checkListFilters(t *testing.T, pool *pgxpool.Pool, s *Service) {
	t.Helper()

	w := newListWorld(t, pool, s)
	future := time.Now().Add(time.Hour)
	past := time.Now().Add(-time.Hour)

	for name, c := range map[string]struct {
		f     Filter
		total int
	}{
		"one action":                       {Filter{Actions: []string{"seller.block"}}, 1},
		"two actions":                      {Filter{Actions: []string{"seller.block", "admin.grant"}}, 2},
		"the store's name, any case":       {Filter{Query: "lọc thử"}, 1},
		"the store's identifier":           {Filter{Query: w.seller}, 1},
		"a percent sign matches only that": {Filter{Query: "%"}, 0},
		"since an hour from now":           {Filter{Since: &future}, 0},
		"until an hour ago":                {Filter{Until: &past}, 0},
		"between an hour ago and later":    {Filter{Since: &past, Until: &future}, 3},
	} {
		if page := w.list(t, s, c.f); page.Total != c.total || len(page.Events) != c.total {
			t.Errorf("%s: total %d with %d events, want %d", name, page.Total, len(page.Events), c.total)
		}
	}

	if page := w.list(t, s, Filter{Page: 2, Size: 2}); page.Total != 3 || len(page.Events) != 1 {
		t.Errorf("page 2 of 2: total %d with %d events, want 3 with 1", page.Total, len(page.Events))
	}

	if page := w.list(t, s, Filter{Page: 3, Size: 2}); page.Total != 3 || len(page.Events) != 0 {
		t.Errorf("past the end: total %d with %d events, want 3 with none", page.Total, len(page.Events))
	}
}

func checkListRefused(t *testing.T, _ *pgxpool.Pool, s *Service) {
	t.Helper()

	admin := platform.WithCaller(t.Context(), platform.Caller{AccountID: uuid.New(), Role: platform.RoleAdmin})
	now := time.Now()

	for name, f := range map[string]Filter{
		"an action not in the catalog": {Actions: []string{"seller.delete"}, Page: 1, Size: 10},
		"page 0":                       {Page: 0, Size: 10},
		"a page of 101":                {Page: 1, Size: 101},
		"a query of 101 characters":    {Query: strings.Repeat("a", 101), Page: 1, Size: 10},
		"since not before until":       {Since: &now, Until: &now, Page: 1, Size: 10},
	} {
		if _, err := s.List(admin, f); !errors.Is(err, ErrListInvalid) {
			t.Errorf("%s: %v, want ErrListInvalid", name, err)
		}
	}

	customer := platform.WithCaller(t.Context(), platform.Caller{AccountID: uuid.New(), Role: platform.RoleCustomer})
	if _, err := s.List(customer, Filter{Page: 1, Size: 10}); !errors.Is(err, platform.ErrAdminRequired) {
		t.Errorf("a customer: %v, want ErrAdminRequired", err)
	}
}

// TestActionEnums checks the API's lists of actions are the catalog's.
func TestActionEnums(t *testing.T) {
	t.Parallel()

	want := strings.Join(ActionNames(), ",")

	for _, f := range []reflect.StructField{
		field(t, reflect.TypeFor[listInput](), "Action"),
		field(t, reflect.TypeFor[auditEventBody](), "Action"),
	} {
		if got := f.Tag.Get("enum"); got != want {
			t.Errorf("%s's enum is %q, want the catalog's %q", f.Name, got, want)
		}
	}
}

func field(t *testing.T, typ reflect.Type, name string) reflect.StructField {
	t.Helper()

	f, ok := typ.FieldByName(name)
	if !ok {
		t.Fatalf("%s has no field %s", typ, name)
	}

	return f
}
