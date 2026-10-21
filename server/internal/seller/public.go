package seller

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"

	"github.com/kl3inIT/second-bite/server/internal/seller/internal/db"
)

// Public is what anyone sees of an active seller: its page, and its name and
// photo beside its offers. Its phone and people are not shown.
type Public struct {
	ID        uuid.UUID
	Name      string
	Address   string
	Latitude  float64
	Longitude float64
	PhotoID   *uuid.UUID
}

// PublicOf returns an active seller's public page; ErrNotFound for a seller
// pending or blocked, which customers do not see.
func (s *Service) PublicOf(ctx context.Context, id uuid.UUID) (Public, error) {
	found, err := s.Publics(ctx, []uuid.UUID{id})
	if err != nil {
		return Public{}, err
	}

	p, ok := found[id]
	if !ok {
		return Public{}, ErrNotFound
	}

	return p, nil
}

// Publics returns the active sellers among ids, for what customers read
// beside offers; a seller not active is left out.
func (s *Service) Publics(ctx context.Context, ids []uuid.UUID) (map[uuid.UUID]Public, error) {
	rows, err := s.queries.ActiveSellers(ctx, ids)
	if err != nil {
		return nil, fmt.Errorf("reading the sellers: %w", err)
	}

	found := make(map[uuid.UUID]Public, len(rows))
	for _, r := range rows {
		found[r.ID] = publicFromRow(r)
	}

	return found, nil
}

// IsActiveIn says whether the seller is active, read in tx, for a module that
// checks it while it writes: placing an order reads it in the order's
// transaction rather than asking the pool for a second connection while it
// holds one, which froze the pool once as many orders came at once as it had
// connections (SEC-128).
func (s *Service) IsActiveIn(ctx context.Context, tx pgx.Tx, id uuid.UUID) (bool, error) {
	rows, err := s.queries.WithTx(tx).ActiveSellers(ctx, []uuid.UUID{id})
	if err != nil {
		return false, fmt.Errorf("reading the seller: %w", err)
	}

	return len(rows) > 0, nil
}

// Blocked returns the sellers admins have blocked, whose offers customers no
// longer see; few, so search leaves them out by identifier.
func (s *Service) Blocked(ctx context.Context) ([]uuid.UUID, error) {
	ids, err := s.queries.BlockedSellers(ctx)
	if err != nil {
		return nil, fmt.Errorf("reading the blocked sellers: %w", err)
	}

	return ids, nil
}

func publicFromRow(r db.ActiveSellersRow) Public {
	return Public{
		ID: r.ID, Name: r.Name, Address: r.Address, Latitude: r.Latitude, Longitude: r.Longitude,
		PhotoID: nullUUID(r.PhotoID),
	}
}
