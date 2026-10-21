package order

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"errors"
	"fmt"
	"log/slog"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"

	"github.com/kl3inIT/second-bite/server/internal/order/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/seller"
)

const (
	// liveTicketLifetime is how long a ticket may be redeemed after it is minted.
	liveTicketLifetime = 30 * time.Second
	// liveTicketBytes is the 256 random bits of a ticket.
	liveTicketBytes = 32
)

// LiveTicket is a short-lived, single-use proof that its holder may follow one
// topic on the live socket. The socket reads no cookie or Order-Access, so
// knowing an order's identifier grants nothing.
type LiveTicket struct {
	Value     string
	ExpiresAt time.Time
}

// OrderLiveTicket mints a ticket to follow one order, for its customer, signed
// in or holding its access, and for the seller's people; admins are left out,
// as they do not read the chat.
func (s *Service) OrderLiveTicket(ctx context.Context, id uuid.UUID, access string) (LiveTicket, error) {
	o, err := s.readHeader(ctx, id)
	if err != nil {
		return LiveTicket{}, err
	}

	if _, err := s.partyOf(ctx, o, access); err != nil {
		return LiveTicket{}, err
	}

	return s.mint(ctx, orderTopic(id))
}

// SellerLiveTicket mints a ticket to follow the orders of one seller, for its
// people.
func (s *Service) SellerLiveTicket(ctx context.Context, sellerID uuid.UUID) (LiveTicket, error) {
	member, err := s.sellers.Get(ctx, sellerID)
	if err != nil {
		return LiveTicket{}, err
	}

	if member.MyRole == "" {
		return LiveTicket{}, seller.ErrNotFound
	}

	return s.mint(ctx, sellerTopic(sellerID))
}

// mint stores a new ticket for topic; only its SHA-256 is kept, so any instance
// can redeem it and a copy of the table is useless.
func (s *Service) mint(ctx context.Context, topic string) (LiveTicket, error) {
	secret := make([]byte, liveTicketBytes)
	if _, err := rand.Read(secret); err != nil {
		return LiveTicket{}, fmt.Errorf("making a live ticket: %w", err)
	}

	ticket := LiveTicket{Value: base64.RawURLEncoding.EncodeToString(secret), ExpiresAt: s.now().Add(liveTicketLifetime)}

	if err := s.queries.InsertLiveTicket(ctx, db.InsertLiveTicketParams{
		TicketHash: hashOf(ticket.Value), Topic: topic, ExpiresAt: ticket.ExpiresAt,
	}); err != nil {
		return LiveTicket{}, fmt.Errorf("storing a live ticket: %w", err)
	}

	return ticket, nil
}

// RedeemLiveTicket spends a ticket and returns the topic it follows; ok is false
// when the ticket is unknown, used or expired. It is the function the live
// socket is given.
func (s *Service) RedeemLiveTicket(ctx context.Context, ticket string) (topic string, ok bool, err error) {
	topic, err = s.queries.RedeemLiveTicket(ctx, db.RedeemLiveTicketParams{TicketHash: hashOf(ticket), Now: s.now()})
	if errors.Is(err, pgx.ErrNoRows) {
		return "", false, nil
	}

	if err != nil {
		return "", false, fmt.Errorf("redeeming a live ticket: %w", err)
	}

	return topic, true, nil
}

// PurgeLiveTickets deletes the tickets that expired unspent. It changes nothing
// a second run would not, so it may run twice.
func (s *Service) PurgeLiveTickets(ctx context.Context) error {
	purged, err := s.queries.PurgeLiveTickets(ctx, s.now())
	if err != nil {
		return fmt.Errorf("purging the live tickets: %w", err)
	}

	if purged > 0 {
		s.logger.DebugContext(ctx, "expired live tickets purged",
			slog.String("event", "order.live_tickets.purged"),
			slog.Int64("tickets_purged", purged),
		)
	}

	return nil
}

func hashOf(ticket string) []byte {
	sum := sha256.Sum256([]byte(ticket))

	return sum[:]
}
