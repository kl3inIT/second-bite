package order

import (
	"context"
	"fmt"

	"github.com/kl3inIT/second-bite/server/internal/offer"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// OfferUnits is what became of the units of the offers an admin lists, for
// the portions above the admins' list of posts.
type OfferUnits struct {
	// Posts are the offers matching the filter; Posted their units; Left the
	// units nobody holds, and Leftover those of them on offers that ended.
	Posts, Posted, Left, Leftover int
	// Collected, Held and Missed are the units handed over, held by orders
	// still to collect, and lost to orders ended without a hand-over that
	// did not give them back; each with how many orders hold them, which the
	// screen calls customers.
	Collected, CollectedOrders int
	Held, HeldOrders           int
	Missed, MissedOrders       int
}

// UnitsForAdmins answers, to an admin, what became of the units of every
// offer matching f, whatever page it asks: offer reads the offers and their
// units, this module the orders that took them.
func (s *Service) UnitsForAdmins(ctx context.Context, f offer.AdminFilter) (OfferUnits, error) {
	if _, err := platform.RequireAdmin(ctx); err != nil {
		return OfferUnits{}, err
	}

	posted, err := s.offers.UnitsForAdmins(ctx, f)
	if err != nil {
		return OfferUnits{}, err
	}

	row, err := s.queries.OutcomesOfOffers(ctx, posted.IDs)
	if err != nil {
		return OfferUnits{}, fmt.Errorf("counting what became of the units: %w", err)
	}

	return OfferUnits{
		Posts: posted.Posts, Posted: posted.Units, Left: posted.UnitsLeft, Leftover: posted.Leftover,
		Collected: int(row.Collected), CollectedOrders: int(row.CollectedOrders),
		Held: int(row.Held), HeldOrders: int(row.HeldOrders),
		Missed: int(row.Missed), MissedOrders: int(row.MissedOrders),
	}, nil
}
