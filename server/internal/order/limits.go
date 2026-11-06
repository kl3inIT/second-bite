package order

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"

	"github.com/kl3inIT/second-bite/server/internal/offer"
	"github.com/kl3inIT/second-bite/server/internal/order/internal/db"
)

// The limits on what one person holds (SEC-158). Ordering needs no account
// and the phone number is not verified, so they count by phone number, and
// loosely by address: customers behind a mall's Wi-Fi or a carrier's NAT
// share one. A dish's own cap is offer's, checked when its units are taken.

// lockPlacing serializes the orders placed for the phone number, then for
// the address, until tx ends, so two placed at once cannot both pass a limit;
// every order locks them in this order, so none waits on another for ever.
// It then refuses a phone number that missed too many orders lately, and
// answers the settings the order is placed under.
func (s *Service) lockPlacing(ctx context.Context, q *db.Queries, phone, address string) (Settings, error) {
	if err := q.LockPlacing(ctx, "phone:"+phone); err != nil {
		return Settings{}, fmt.Errorf("locking the phone number's orders: %w", err)
	}

	if address != "" {
		if err := q.LockPlacing(ctx, "address:"+address); err != nil {
			return Settings{}, fmt.Errorf("locking the address's orders: %w", err)
		}
	}

	set, err := s.settings(ctx, q)
	if err != nil {
		return Settings{}, err
	}

	missed, err := q.MissedOfPhone(ctx, db.MissedOfPhoneParams{Phone: phone, Days: int32(set.MissedDays)}) //nolint:gosec // at most 60
	if err != nil {
		return Settings{}, fmt.Errorf("counting the phone number's missed orders: %w", err)
	}

	if missed >= int64(set.MissedLimit) {
		return Settings{}, ErrPhoneMissedOrders
	}

	return set, nil
}

// checkOpen refuses an order when the phone number already holds the orders
// one may hold at the seller, or the address those one may place; an order
// placed outside a request has no address and is not counted by it.
func (s *Service) checkOpen(ctx context.Context, q *db.Queries, set Settings, sellerID uuid.UUID, phone, address string) error {
	open, err := q.OpenOfPhoneAtSeller(ctx, db.OpenOfPhoneAtSellerParams{SellerID: sellerID, Phone: phone})
	if err != nil {
		return fmt.Errorf("counting the phone number's open orders: %w", err)
	}

	if open >= int64(set.OpenPerPhonePerSeller) {
		return ErrPhoneHoldsOrders
	}

	if address == "" {
		return nil
	}

	fromAddress, err := q.OpenFromAddress(ctx, pgtype.Text{String: address, Valid: true})
	if err != nil {
		return fmt.Errorf("counting the address's open orders: %w", err)
	}

	if fromAddress >= int64(set.OpenPerAddress) {
		return ErrAddressHoldsOrders
	}

	return nil
}

// large tells whether an order should be marked for its store to look at: a
// line of two units or more that reaches its dish's cap, or takes more than
// half the units posted. A cap of one makes every order reach it, so a single
// unit never counts.
func large(taken []offer.Taken, wanted []Wanted) bool {
	for i, t := range taken {
		units := wanted[i].Units
		if units >= 2 && (units >= t.PerOrderMax || units*2 > t.Units) {
			return true
		}
	}

	return false
}

// withPhoneHistory sets on orders of one seller what each phone number holds
// there still to collect and missed lately, for its people to judge a large
// order (SEC-158). An order whose contact was forgotten has none.
func (s *Service) withPhoneHistory(ctx context.Context, sellerID uuid.UUID, orders []Order) error {
	phones := make([]string, 0, len(orders))
	seen := make(map[string]bool, len(orders))

	for _, o := range orders {
		if p := o.Contact.Phone; p != "" && !seen[p] {
			seen[p] = true
			phones = append(phones, p)
		}
	}

	if len(phones) == 0 {
		return nil
	}

	set, err := s.settings(ctx, s.queries)
	if err != nil {
		return err
	}

	rows, err := s.queries.PhoneHistories(ctx, db.PhoneHistoriesParams{
		SellerID: sellerID, Days: int32(set.MissedDays), Phones: phones, //nolint:gosec // at most 60
	})
	if err != nil {
		return fmt.Errorf("reading the phone numbers' orders: %w", err)
	}

	histories := make(map[string]PhoneHistory, len(rows))
	for _, r := range rows {
		histories[r.Phone] = PhoneHistory{Open: int(r.Open), Missed: int(r.Missed)}
	}

	for i, o := range orders {
		if h, ok := histories[o.Contact.Phone]; ok {
			orders[i].Phone = &h
		}
	}

	return nil
}
