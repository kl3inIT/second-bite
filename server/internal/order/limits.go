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
// ends, so two placed at once cannot both pass a limit. It then answers the
// order the same key placed while this one waited for the lock, which stands
// and is not held to the limits again (SEC-205); otherwise it refuses a phone
// number that missed too many orders lately, and answers the settings the
// order is placed under.
func (s *Service) lockPlacing(
	ctx context.Context, q *db.Queries, customer uuid.NullUUID, key, phone string,
) (Settings, uuid.UUID, error) {
	if err := q.LockPlacing(ctx, phone); err != nil {
		return Settings{}, uuid.Nil, fmt.Errorf("locking the phone number's orders: %w", err)
	}

	if earlier, found, err := orderOfKey(ctx, q, customer, key, phone); err != nil || found {
		return Settings{}, earlier, err
	}

	set, err := s.settings(ctx, q)
	if err != nil {
		return Settings{}, uuid.Nil, err
	}

	missed, err := q.MissedOfPhone(ctx, db.MissedOfPhoneParams{Phone: phone, Days: int32(set.MissedDays)}) //nolint:gosec // at most 60
	if err != nil {
		return Settings{}, uuid.Nil, fmt.Errorf("counting the phone number's missed orders: %w", err)
	}

	if missed >= int64(set.MissedLimit) {
		return Settings{}, uuid.Nil, ErrPhoneMissedOrders
	}

	return set, uuid.Nil, nil
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
