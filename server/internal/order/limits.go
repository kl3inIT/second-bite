package order

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/order/internal/db"
)

// The limits on what one person holds (SEC-158). Ordering needs no account
// and the phone number is not verified, so they count by phone number. A
// dish's own cap is offer's, checked when its units are taken.

// lockPlacing serializes the orders placed for the phone number until tx
// ends, so two placed at once cannot both pass a limit. It then refuses a
// phone number that missed too many orders lately, and answers the settings
// the order is placed under.
func (s *Service) lockPlacing(ctx context.Context, q *db.Queries, phone string) (Settings, error) {
	if err := q.LockPlacing(ctx, phone); err != nil {
		return Settings{}, fmt.Errorf("locking the phone number's orders: %w", err)
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
// one may hold at the seller.
func (s *Service) checkOpen(ctx context.Context, q *db.Queries, set Settings, sellerID uuid.UUID, phone string) error {
	open, err := q.OpenOfPhoneAtSeller(ctx, db.OpenOfPhoneAtSellerParams{SellerID: sellerID, Phone: phone})
	if err != nil {
		return fmt.Errorf("counting the phone number's open orders: %w", err)
	}

	if open >= int64(set.OpenPerPhonePerSeller) {
		return ErrPhoneHoldsOrders
	}

	return nil
}
