package order

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"strings"
	"time"
	"unicode/utf8"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"

	"github.com/kl3inIT/second-bite/server/internal/order/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/seller"
)

// Side is who wrote a message: the order's customer, or the seller's people,
// any of whom writes as the seller.
type Side string

// The sides of a chat.
const (
	SideCustomer Side = "customer"
	SideSeller   Side = "seller"
)

const (
	maxMessageLetters    = 1000
	maxChatMessages      = 500
	maxMessagesPerMinute = 20
	// chatGrace is how long a chat stays writable once its order is collected,
	// to report a missing or wrong dish.
	chatGrace = 2 * time.Hour
	// maxMessagesListed bounds one page of a chat's messages.
	maxMessagesListed = 100
)

// Message is a text one side wrote in an order's chat, numbered in its chat
// from 1.
type Message struct {
	Seq    int
	From   Side
	Text   string
	SentAt time.Time
}

// Conversation is what a reader of an order's chat gets: the messages after
// one, what each side has read, and whether the chat still takes messages.
type Conversation struct {
	Messages []Message
	// SeenCustomer and SeenSeller are the highest message each side has read.
	SeenCustomer, SeenSeller int
	Open                     bool
	// ClosesAt is when a collected order's chat turns read-only; none otherwise.
	ClosesAt *time.Time
}

// chatOpen tells whether an order's chat takes messages: while the order is
// open, and for chatGrace after it is collected. A cancelled, refused or
// expired order's chat is closed at once.
func (s *Service) chatOpen(o Order) bool {
	if o.Status.open() {
		return true
	}

	closes := chatClosesAt(o)

	return closes != nil && s.now().Before(*closes)
}

// chatClosesAt is when a collected order's chat turns read-only.
func chatClosesAt(o Order) *time.Time {
	if o.Status != StatusCollected || o.CollectedAt == nil {
		return nil
	}

	closes := o.CollectedAt.Add(chatGrace)

	return &closes
}

// partyOf tells which side of o's chat the reader is: the customer, signed in
// or holding the order's access, or one of the seller's people. Anyone else,
// admins included, gets ErrNotFound.
func (s *Service) partyOf(ctx context.Context, o Order, access string) (Side, error) {
	if s.isCustomer(ctx, o, access) {
		return SideCustomer, nil
	}

	if _, signedIn := platform.CallerFrom(ctx); !signedIn {
		return "", ErrNotFound
	}

	member, err := s.sellers.Get(ctx, o.SellerID)
	if errors.Is(err, seller.ErrNotFound) {
		return "", ErrNotFound
	}

	if err != nil {
		return "", err
	}

	if member.MyRole == "" {
		return "", ErrNotFound
	}

	return SideSeller, nil
}

// Messages returns an order's chat after the message numbered after, oldest
// first, to its customer and to the seller's people; limit is bounded.
func (s *Service) Messages(ctx context.Context, id uuid.UUID, access string, after, limit int) (Conversation, error) {
	o, err := s.readHeader(ctx, id)
	if err != nil {
		return Conversation{}, err
	}

	if _, err := s.partyOf(ctx, o, access); err != nil {
		return Conversation{}, err
	}

	rows, err := s.queries.ListMessages(ctx, db.ListMessagesParams{
		OrderID: id, After: int32(max(after, 0)), MaxRows: int32(min(max(limit, 1), maxMessagesListed)), //nolint:gosec // bounded above
	})
	if err != nil {
		return Conversation{}, fmt.Errorf("listing the messages: %w", err)
	}

	c := Conversation{Messages: make([]Message, 0, len(rows)), Open: s.chatOpen(o), ClosesAt: chatClosesAt(o)}
	for _, r := range rows {
		c.Messages = append(c.Messages, Message{Seq: int(r.Seq), From: Side(r.Sender), Text: r.Body, SentAt: r.SentAt})
	}

	seen, err := s.queries.ChatSeen(ctx, id)
	if err != nil && !errors.Is(err, pgx.ErrNoRows) {
		return Conversation{}, fmt.Errorf("reading what each side has seen: %w", err)
	}

	c.SeenCustomer, c.SeenSeller = int(seen.CustomerSeenSeq), int(seen.SellerSeenSeq)

	return c, nil
}

// SendMessage adds a message to an order's chat, from its customer or from the
// seller's people, while the chat is open. The same key from the same side
// returns the message sent first, even after the chat has closed.
func (s *Service) SendMessage(ctx context.Context, id uuid.UUID, access, key, text string) (Message, error) {
	if n := utf8.RuneCountInString(key); n < 1 || n > 255 {
		return Message{}, ErrIdempotencyKeyInvalid
	}

	text = strings.TrimSpace(text)
	if n := utf8.RuneCountInString(text); n < 1 || n > maxMessageLetters {
		return Message{}, ErrMessageInvalid
	}

	var (
		sent    Message
		created bool
	)

	err := pgx.BeginFunc(ctx, s.pool, func(tx pgx.Tx) error {
		var err error

		sent, created, err = s.sendIn(ctx, tx, id, access, key, text)

		return err
	})
	if err != nil {
		return Message{}, err
	}

	if created {
		caller, _ := platform.CallerFrom(ctx)

		// Never the text: only who wrote and which message.
		attrs := []any{
			slog.String("event", "order.message.sent"),
			slog.String("order_id", id.String()),
			slog.String("side", string(sent.From)),
			slog.Int("seq", sent.Seq),
		}
		if caller.AccountID != uuid.Nil {
			attrs = append(attrs, slog.String("account_id", caller.AccountID.String()))
		}

		s.logger.InfoContext(ctx, "order message sent", attrs...)
	}

	return sent, nil
}

// sendIn writes the message inside tx, which holds the order against a
// transition that would close the chat at the same moment.
func (s *Service) sendIn(ctx context.Context, tx pgx.Tx, id uuid.UUID, access, key, text string) (Message, bool, error) {
	q := s.queries.WithTx(tx)

	row, err := q.LockOrderShared(ctx, id)
	if errors.Is(err, pgx.ErrNoRows) {
		return Message{}, false, ErrNotFound
	}

	if err != nil {
		return Message{}, false, fmt.Errorf("locking the order: %w", err)
	}

	o := s.fromRow(db.GetOrderRow(row))

	side, err := s.partyOf(ctx, o, access)
	if err != nil {
		return Message{}, false, err
	}

	earlier, err := q.MessageOfKey(ctx, db.MessageOfKeyParams{OrderID: id, Sender: string(side), IdempotencyKey: key})
	if err == nil {
		return Message{Seq: int(earlier.Seq), From: side, Text: earlier.Body, SentAt: earlier.SentAt}, false, nil
	}

	if !errors.Is(err, pgx.ErrNoRows) {
		return Message{}, false, fmt.Errorf("reading an earlier message: %w", err)
	}

	if !s.chatOpen(o) {
		return Message{}, false, ErrChatClosed
	}

	// Numbering locks the chat until the commit, so the count below sees every
	// message the other senders of this side have committed.
	seq, err := q.NextChatSeq(ctx, db.NextChatSeqParams{OrderID: id, MaxMessages: maxChatMessages})
	if errors.Is(err, pgx.ErrNoRows) {
		return Message{}, false, ErrChatFull
	}

	if err != nil {
		return Message{}, false, fmt.Errorf("numbering the message: %w", err)
	}

	now := s.now()

	if err := s.checkPace(ctx, q, id, side, now); err != nil {
		return Message{}, false, err
	}

	if err := q.InsertMessage(ctx, db.InsertMessageParams{
		OrderID: id, Seq: seq, Sender: string(side), Body: text, IdempotencyKey: key, SentAt: now,
	}); err != nil {
		return Message{}, false, fmt.Errorf("storing the message: %w", err)
	}

	err = platform.Notify(ctx, tx, messageNotice{Type: noticeMessage, OrderID: id, Seq: int(seq), From: side},
		orderTopic(id), sellerTopic(o.SellerID))
	if err != nil {
		return Message{}, false, err
	}

	return Message{Seq: int(seq), From: side, Text: text, SentAt: now}, true, nil
}

// checkPace refuses a side that already sent maxMessagesPerMinute in the last
// minute, telling it when its oldest of them is a minute old.
func (s *Service) checkPace(ctx context.Context, q *db.Queries, id uuid.UUID, side Side, now time.Time) error {
	oldest, err := q.NthRecentMessageTime(ctx, db.NthRecentMessageTimeParams{
		OrderID: id, Sender: string(side), Since: now.Add(-time.Minute), SkipRows: maxMessagesPerMinute - 1,
	})
	if errors.Is(err, pgx.ErrNoRows) {
		return nil
	}

	if err != nil {
		return fmt.Errorf("counting the recent messages: %w", err)
	}

	return ErrMessagesTooFast.WithRetryAfter(max(oldest.Add(time.Minute).Sub(now), time.Second))
}

// MarkSeen raises what the reader's side has read of an order's chat up to
// upTo, or to the latest message when upTo is beyond it. It works on a chat
// that has closed, and never lowers what was seen.
func (s *Service) MarkSeen(ctx context.Context, id uuid.UUID, access string, upTo int) error {
	o, err := s.readHeader(ctx, id)
	if err != nil {
		return err
	}

	side, err := s.partyOf(ctx, o, access)
	if err != nil {
		return err
	}

	if upTo <= 0 {
		return nil
	}

	return pgx.BeginFunc(ctx, s.pool, func(tx pgx.Tx) error {
		seq, err := s.queries.WithTx(tx).RaiseSeen(ctx, db.RaiseSeenParams{
			OrderID: id, Side: string(side), UpTo: int32(min(upTo, maxChatMessages)), //nolint:gosec // bounded above
		})
		if errors.Is(err, pgx.ErrNoRows) {
			return nil
		}

		if err != nil {
			return fmt.Errorf("marking the messages seen: %w", err)
		}

		return platform.Notify(ctx, tx, seenNotice{Type: noticeSeen, OrderID: id, By: side, Seq: int(seq)}, orderTopic(id))
	})
}

// withUnread sets, on each of orders, what the reader's side has not read of
// its chat.
func (s *Service) withUnread(ctx context.Context, orders []Order, side Side) error {
	if len(orders) == 0 {
		return nil
	}

	ids := make([]uuid.UUID, len(orders))
	at := make(map[uuid.UUID]int, len(orders))

	for i, o := range orders {
		ids[i], at[o.ID] = o.ID, i
		orders[i].UnreadMessages = new(int)
	}

	rows, err := s.queries.UnreadOf(ctx, ids)
	if err != nil {
		return fmt.Errorf("counting the unread messages: %w", err)
	}

	for _, r := range rows {
		unread := r.CustomerUnread
		if side == SideSeller {
			unread = r.SellerUnread
		}

		*orders[at[r.OrderID]].UnreadMessages = int(unread)
	}

	return nil
}

// readHeader returns an order without its lines and review, for what needs only
// who it belongs to and where it stands.
func (s *Service) readHeader(ctx context.Context, id uuid.UUID) (Order, error) {
	row, err := s.queries.GetOrder(ctx, id)
	if errors.Is(err, pgx.ErrNoRows) {
		return Order{}, ErrNotFound
	}

	if err != nil {
		return Order{}, fmt.Errorf("reading the order: %w", err)
	}

	return s.fromRow(row), nil
}
