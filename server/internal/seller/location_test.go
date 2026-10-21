package seller_test

import (
	"context"
	"errors"
	"testing"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/seller"
)

// testLocationIsHanoiAndAMoveIsTold holds a seller's point to Hanoi, on opening
// and on a change, and publishes LocationChangedEvent only when the point or the
// written address moves (SEC-66).
func testLocationIsHanoiAndAMoveIsTold(t *testing.T, pool *pgxpool.Pool) {
	t.Helper()

	f := newFixture(t, pool)
	platform.Listen(f.events, "seller_test.location", func(context.Context, seller.LocationChangedEvent) error { return nil })

	owner := f.as(t, "owner@example.com", platform.RoleCustomer)

	outside := map[string][2]float64{
		"Ho Chi Minh City":         {10.7769, 106.7009},
		"Hoàng Sa":                 {16.5, 112.0},
		"Hải Phòng, east of Hanoi": {20.8449, 106.6881},
		"just north of the box":    {21.4201, 105.85},
		"just west of the box":     {21.0, 105.2499},
		"the origin":               {0, 0},
	}
	for name, at := range outside {
		d := shop
		d.Latitude, d.Longitude = at[0], at[1]

		if _, err := f.sellers.Open(owner, d); !errors.Is(err, seller.ErrLocationOutside) {
			t.Errorf("opening at %s: %v, want ErrLocationOutside", name, err)
		}
	}

	corner := shop
	corner.Latitude, corner.Longitude = 21.42, 106.06

	s, err := f.sellers.Open(owner, corner)
	if err != nil {
		t.Fatalf("opening on the box's corner: %v", err)
	}

	d := corner
	d.Latitude, d.Longitude = 10.7769, 106.7009

	if _, err := f.sellers.Update(owner, s.ID, d); !errors.Is(err, seller.ErrLocationOutside) {
		t.Errorf("moving to Ho Chi Minh City: %v, want ErrLocationOutside", err)
	}

	steps := []struct {
		name string
		edit func(*seller.Details)
		jobs int
	}{
		{"renamed only", func(d *seller.Details) { d.Name = "Bánh mì Ngọc Lâm" }, 0},
		{"pin moved", func(d *seller.Details) { d.Latitude, d.Longitude = 21.0453, 105.8738 }, 1},
		{"the same again", func(*seller.Details) {}, 1},
		{"address only", func(d *seller.Details) { d.Address = "12 Ngọc Lâm, Long Biên" }, 2},
	}

	d = corner
	for _, step := range steps {
		step.edit(&d)

		if _, err := f.sellers.Update(owner, s.ID, d); err != nil {
			t.Fatalf("%s: %v", step.name, err)
		}

		if got := locationJobs(t, pool, s.ID); got != step.jobs {
			t.Errorf("%s: %d events, want %d", step.name, got, step.jobs)
		}
	}

	point, err := f.sellers.CollectionPointOf(t.Context(), s.ID)
	if err != nil {
		t.Fatal(err)
	}

	if want := (seller.CollectionPoint{Latitude: 21.0453, Longitude: 105.8738, Address: "12 Ngọc Lâm, Long Biên"}); point != want {
		t.Errorf("collection point %+v, want %+v", point, want)
	}

	if _, err := f.sellers.CollectionPointOf(t.Context(), uuid.New()); !errors.Is(err, seller.ErrNotFound) {
		t.Errorf("an unknown seller's point: %v, want ErrNotFound", err)
	}
}

// locationJobs counts the jobs LocationChangedEvent left for the seller.
func locationJobs(t *testing.T, pool *pgxpool.Pool, id uuid.UUID) int {
	t.Helper()

	var jobs int
	if err := pool.QueryRow(t.Context(),
		`SELECT count(*) FROM river_job WHERE args->>'event' = 'seller.location_changed' AND args->'payload'->>'sellerId' = $1::text`,
		id).Scan(&jobs); err != nil {
		t.Fatal(err)
	}

	return jobs
}
