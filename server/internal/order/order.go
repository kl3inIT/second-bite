// Package order holds what customers order: units of one seller's offers,
// collected at the counter with a code within one window. The rules are in
// the SEC-15 design: an order is confirmed when it is placed, as in Too Good
// To Go, Karrot and Open Food Network; expiry is read from the window in every
// query, as offer reads closed.
package order

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/kl3inIT/second-bite/server/internal/offer"
	"github.com/kl3inIT/second-bite/server/internal/order/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/seller"
)

// Status is where an order stands. expired is read from the window's end and
// never stored.
type Status string

// The statuses of an order.
const (
	StatusConfirmed Status = "confirmed"
	StatusReady     Status = "ready"
	StatusCollected Status = "collected"
	StatusCancelled Status = "cancelled"
	StatusRefused   Status = "refused"
	StatusExpired   Status = "expired"
)

// open tells whether an order is still to be collected.
func (s Status) open() bool { return s == StatusConfirmed || s == StatusReady }

// RefuseReason is why staff did not hand an order over.
type RefuseReason string

// The reasons to refuse an order.
const (
	RefuseNotSuitable RefuseReason = "not_suitable"
	RefuseWrongItems  RefuseReason = "wrong_items"
	RefuseOther       RefuseReason = "other"
)

// maxCodeAttempts is how many wrong codes lock an order's code.
const maxCodeAttempts = 3

// vietnam is the pilot's time zone, which keeps no daylight saving time.
var vietnam = time.FixedZone("Asia/Ho_Chi_Minh", 7*60*60)

// Order is a customer's order.
type Order struct {
	ID         uuid.UUID
	Number     int64
	CustomerID uuid.UUID
	SellerID   uuid.UUID
	SellerName string
	// CollectionPoint is copied from the offers when ordered.
	CollectionPoint seller.CollectionPoint
	Status          Status
	Lines           []Line
	TotalVND        int64
	WindowStart     time.Time
	WindowEnd       time.Time
	CreatedAt       time.Time
	ReadyAt         *time.Time
	CollectedAt     *time.Time
	CancelledAt     *time.Time
	RefusedAt       *time.Time
	CancelReason    string
	RefuseReason    RefuseReason
	RefuseNote      string
	// CodeAttemptsLeft is how many wrong codes staff may still enter.
	CodeAttemptsLeft int
	// Code is the collection code, set only for the order's customer once it
	// may be shown.
	Code string
}

// Number is how people read an order's number aloud and search for it.
func Number(n int64) string { return fmt.Sprintf("SB-%d", n) }

// Line is the units of one offer in an order, with what was copied from it.
type Line struct {
	OfferID          uuid.UUID
	Name             string
	Unit             string
	PriceVND         int64
	OriginalPriceVND int64
	PhotoID          uuid.UUID
	Units            int
}

// Service is the module's published API.
type Service struct {
	pool    *pgxpool.Pool
	queries *db.Queries
	offers  *offer.Service
	sellers *seller.Service
	codeKey []byte
	logger  *slog.Logger
	now     func() time.Time
}

// NewService assembles the module. codeKey keys the collection codes, which
// are derived from each order and never stored.
func NewService(pool *pgxpool.Pool, offers *offer.Service, sellers *seller.Service, codeKey []byte, logger *slog.Logger) (*Service, error) {
	if len(codeKey) < 32 {
		return nil, errors.New("order: the collection code key must be at least 32 bytes")
	}

	return &Service{
		pool: pool, queries: db.New(pool), offers: offers, sellers: sellers, codeKey: codeKey, logger: logger, now: time.Now,
	}, nil
}

// Get returns an order to its customer, the seller's people and admins; the
// code only to its customer, once it may be shown.
func (s *Service) Get(ctx context.Context, id uuid.UUID) (Order, error) {
	caller, err := platform.RequireCaller(ctx)
	if err != nil {
		return Order{}, err
	}

	o, err := s.read(ctx, id)
	if err != nil {
		return Order{}, err
	}

	if o.CustomerID != caller.AccountID {
		if _, err := s.sellers.Get(ctx, o.SellerID); err != nil {
			return Order{}, ErrNotFound
		}
	}

	return s.shown(o, caller), nil
}

// Which narrows a customer's orders: those still to collect, or those ended.
type Which string

// The customer's lists.
const (
	WhichAll   Which = ""
	WhichOpen  Which = "open"
	WhichEnded Which = "ended"
)

// maxListed bounds one page of a customer's orders.
const maxListed = 50

// Mine lists the caller's orders, newest first.
func (s *Service) Mine(ctx context.Context, which Which, limit, offset int) ([]Order, error) {
	caller, err := platform.RequireCaller(ctx)
	if err != nil {
		return nil, err
	}

	rows, err := s.queries.CustomerOrders(ctx, db.CustomerOrdersParams{
		CustomerID: caller.AccountID, Which: string(which),
		MaxRows: int32(min(max(limit, 1), maxListed)), SkipRows: int32(max(offset, 0)), //nolint:gosec // bounded above
	})
	if err != nil {
		return nil, fmt.Errorf("listing the customer's orders: %w", err)
	}

	orders := make([]Order, 0, len(rows))
	for _, r := range rows {
		orders = append(orders, s.fromRow(db.GetOrderRow(r)))
	}

	if err := s.withLines(ctx, orders); err != nil {
		return nil, err
	}

	for i := range orders {
		orders[i] = s.shown(orders[i], caller)
	}

	return orders, nil
}

// OfSeller lists a seller's orders whose window starts on day, in Vietnam
// time, to its people and admins.
func (s *Service) OfSeller(ctx context.Context, sellerID uuid.UUID, day time.Time) ([]Order, error) {
	if _, err := s.sellers.Get(ctx, sellerID); err != nil {
		return nil, err
	}

	y, m, d := day.In(vietnam).Date()
	start := time.Date(y, m, d, 0, 0, 0, 0, vietnam)

	rows, err := s.queries.SellerOrders(ctx, db.SellerOrdersParams{SellerID: sellerID, DayStart: start, DayEnd: start.AddDate(0, 0, 1)})
	if err != nil {
		return nil, fmt.Errorf("listing the seller's orders: %w", err)
	}

	orders := make([]Order, 0, len(rows))
	for _, r := range rows {
		orders = append(orders, s.fromRow(db.GetOrderRow(r)))
	}

	if err := s.withLines(ctx, orders); err != nil {
		return nil, err
	}

	return orders, nil
}

// Today is the day a seller's list shows when none is asked for.
func (s *Service) Today() time.Time { return s.now().In(vietnam) }

// read returns an order with its lines, as stored.
func (s *Service) read(ctx context.Context, id uuid.UUID) (Order, error) {
	row, err := s.queries.GetOrder(ctx, id)
	if errors.Is(err, pgx.ErrNoRows) {
		return Order{}, ErrNotFound
	}

	if err != nil {
		return Order{}, fmt.Errorf("reading the order: %w", err)
	}

	orders := []Order{s.fromRow(row)}
	if err := s.withLines(ctx, orders); err != nil {
		return Order{}, err
	}

	return orders[0], nil
}

// withLines reads the lines of orders in one query.
func (s *Service) withLines(ctx context.Context, orders []Order) error {
	if len(orders) == 0 {
		return nil
	}

	ids := make([]uuid.UUID, len(orders))
	at := make(map[uuid.UUID]int, len(orders))

	for i, o := range orders {
		ids[i], at[o.ID] = o.ID, i
	}

	rows, err := s.queries.LinesOf(ctx, ids)
	if err != nil {
		return fmt.Errorf("reading the orders' lines: %w", err)
	}

	for _, r := range rows {
		i := at[r.OrderID]
		orders[i].Lines = append(orders[i].Lines, Line{
			OfferID: r.OfferID, Name: r.Name, Unit: r.Unit, PriceVND: r.PriceVnd, OriginalPriceVND: r.OriginalPriceVnd,
			PhotoID: r.PhotoID, Units: int(r.Units),
		})
	}

	return nil
}

// shown is what caller may see of o: the code only when caller is its
// customer and the code may be shown.
func (s *Service) shown(o Order, caller platform.Caller) Order {
	if caller.AccountID == o.CustomerID && s.codeShown(o) {
		o.Code = s.code(o.ID)
	}

	return o
}

// codeShown tells whether an order's customer sees its code: once the order is
// ready or its window has opened, while it is open and its code not locked.
func (s *Service) codeShown(o Order) bool {
	return o.Status.open() && o.CodeAttemptsLeft > 0 && (o.Status == StatusReady || !s.now().Before(o.WindowStart))
}

func (s *Service) fromRow(r db.GetOrderRow) Order {
	o := Order{
		ID: r.ID, Number: r.Number.Int64, CustomerID: r.CustomerID, SellerID: r.SellerID, SellerName: r.SellerName,
		CollectionPoint: seller.CollectionPoint{Latitude: r.Latitude, Longitude: r.Longitude, Address: r.Address},
		Status:          Status(r.State), TotalVND: r.TotalVnd, WindowStart: r.WindowStart, WindowEnd: r.WindowEnd,
		CreatedAt: r.CreatedAt, ReadyAt: r.ReadyAt, CollectedAt: r.CollectedAt, CancelledAt: r.CancelledAt,
		RefusedAt: r.RefusedAt, CancelReason: r.CancelReason, RefuseReason: RefuseReason(r.RefuseReason.String),
		RefuseNote: r.RefuseNote, CodeAttemptsLeft: maxCodeAttempts - int(r.WrongCodeAttempts),
	}

	if o.Status.open() && !o.WindowEnd.After(s.now()) {
		o.Status = StatusExpired
	}

	return o
}
