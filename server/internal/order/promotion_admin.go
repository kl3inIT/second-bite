package order

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"slices"
	"strconv"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"

	"github.com/kl3inIT/second-bite/server/internal/audit"
	"github.com/kl3inIT/second-bite/server/internal/order/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// PromotionFilter is what an admin lists promotions by.
type PromotionFilter struct {
	// Status keeps the promotions in it; all when empty.
	Status PromotionStatus
	// Query keeps those whose name holds it, letter case ignored.
	Query string
	// SellerID keeps those that apply to a seller; all when nil.
	SellerID uuid.UUID
	// Page counts from 1; Size runs from 1 to 100.
	Page, Size int
}

// PromotionPage is one page of the admins' list of promotions, how many match
// in all and how many of each status match the other filters.
type PromotionPage struct {
	Promotions []Promotion
	Total      int
	Counts     map[PromotionStatus]int
}

// Promotions answers one page of the promotions matching f, to an admin, the
// latest start first, each with what its discounts come to.
func (s *Service) Promotions(ctx context.Context, f PromotionFilter) (PromotionPage, error) {
	if _, err := platform.RequireAdmin(ctx); err != nil {
		return PromotionPage{}, err
	}

	page, size := max(f.Page, 1), min(max(f.Size, 1), 100)
	seller := uuid.NullUUID{UUID: f.SellerID, Valid: f.SellerID != uuid.Nil}
	query := strings.TrimSpace(f.Query)

	rows, err := s.queries.ListPromotions(ctx, db.ListPromotionsParams{
		Status: string(f.Status), Query: query, SellerID: seller,
		MaxRows: int32(size), SkipRows: int32((page - 1) * size), //nolint:gosec // bounded above
	})
	if err != nil {
		return PromotionPage{}, fmt.Errorf("listing the promotions: %w", err)
	}

	counts, err := s.queries.CountPromotions(ctx, db.CountPromotionsParams{Status: string(f.Status), Query: query, SellerID: seller})
	if err != nil {
		return PromotionPage{}, fmt.Errorf("counting the promotions: %w", err)
	}

	promotions, err := s.promotionsOf(ctx, s.queries, rows)
	if err != nil {
		return PromotionPage{}, err
	}

	return PromotionPage{
		Promotions: promotions, Total: int(counts.Matching),
		Counts: map[PromotionStatus]int{
			PromotionRunning: int(counts.Running), PromotionScheduled: int(counts.Scheduled),
			PromotionPaused: int(counts.Paused), PromotionEnded: int(counts.Ended),
		},
	}, nil
}

// Promotion answers one promotion to an admin, with what its discounts come
// to.
func (s *Service) Promotion(ctx context.Context, id uuid.UUID) (Promotion, error) {
	if _, err := platform.RequireAdmin(ctx); err != nil {
		return Promotion{}, err
	}

	return s.readPromotion(ctx, s.queries, id)
}

// CreatePromotion sets up a promotion an admin gives, recorded in the audit.
// It runs from its start for the orders placed then.
func (s *Service) CreatePromotion(ctx context.Context, p Promotion) (Promotion, error) {
	if _, err := platform.RequireAdmin(ctx); err != nil {
		return Promotion{}, err
	}

	p, err := p.normalized()
	if err != nil {
		return Promotion{}, err
	}

	var created Promotion

	err = pgx.BeginFunc(ctx, s.pool, func(tx pgx.Tx) error {
		q := s.queries.WithTx(tx)

		params, err := p.stored()
		if err != nil {
			return err
		}

		id, err := q.InsertPromotion(ctx, params)
		if err != nil {
			return fmt.Errorf("storing the promotion: %w", err)
		}

		if err := q.InsertPromotionSellers(ctx, db.InsertPromotionSellersParams{PromotionID: id, SellerIds: p.SellerIDs}); err != nil {
			return fmt.Errorf("storing the promotion's sellers: %w", err)
		}

		if created, err = s.readPromotion(ctx, q, id); err != nil {
			return err
		}

		return s.trail.Record(ctx, tx, promotionResource(created), audit.PromotionCreated{Name: created.Name})
	})
	if err != nil {
		return Promotion{}, err
	}

	return created, nil
}

// ChangePromotion replaces a promotion with what an admin gives, recorded in
// the audit with what changed. The orders placed before keep the discount
// they took; it waits for an order being placed with it.
func (s *Service) ChangePromotion(ctx context.Context, id uuid.UUID, p Promotion) (Promotion, error) {
	if _, err := platform.RequireAdmin(ctx); err != nil {
		return Promotion{}, err
	}

	p, err := p.normalized()
	if err != nil {
		return Promotion{}, err
	}

	var changed Promotion

	err = pgx.BeginFunc(ctx, s.pool, func(tx pgx.Tx) error {
		q := s.queries.WithTx(tx)

		if _, err := q.LockPromotion(ctx, id); errors.Is(err, pgx.ErrNoRows) {
			return ErrPromotionNotFound
		} else if err != nil {
			return fmt.Errorf("locking the promotion: %w", err)
		}

		before, err := s.readPromotion(ctx, q, id)
		if err != nil {
			return err
		}

		params, err := p.stored()
		if err != nil {
			return err
		}

		if err := q.UpdatePromotion(ctx, db.UpdatePromotionParams{
			ID: id, Name: params.Name, StartsAt: params.StartsAt, EndsAt: params.EndsAt, AllSellers: params.AllSellers,
			BudgetVnd: params.BudgetVnd, PerPhonePerDay: params.PerPhonePerDay, Enabled: params.Enabled, Rules: params.Rules,
		}); err != nil {
			return fmt.Errorf("changing the promotion: %w", err)
		}

		if err := q.DeletePromotionSellers(ctx, id); err != nil {
			return fmt.Errorf("clearing the promotion's sellers: %w", err)
		}

		if err := q.InsertPromotionSellers(ctx, db.InsertPromotionSellersParams{PromotionID: id, SellerIds: p.SellerIDs}); err != nil {
			return fmt.Errorf("storing the promotion's sellers: %w", err)
		}

		if changed, err = s.readPromotion(ctx, q, id); err != nil {
			return err
		}

		changes := promotionChanges(before, changed)
		if len(changes) == 0 {
			return nil
		}

		return s.trail.Record(ctx, tx, promotionResource(changed), audit.PromotionChanged{Changes: changes})
	})
	if err != nil {
		return Promotion{}, err
	}

	return changed, nil
}

// RunningPromotions answers anyone the promotions running now for any of the
// sellers, soonest to end first, so a cart tells what it may take off; never
// what a phone number would get, which would tell who has bought before.
func (s *Service) RunningPromotions(ctx context.Context, sellerIDs []uuid.UUID) ([]Promotion, error) {
	if len(sellerIDs) == 0 {
		return []Promotion{}, nil
	}

	rows, err := s.queries.PromotionsRunningFor(ctx, sellerIDs)
	if err != nil {
		return nil, fmt.Errorf("listing the running promotions: %w", err)
	}

	promotions := make([]Promotion, 0, len(rows))
	ids := make([]uuid.UUID, 0, len(rows))

	for _, r := range rows {
		p, err := promotionOf(r)
		if err != nil {
			return nil, err
		}

		promotions, ids = append(promotions, p), append(ids, p.ID)
	}

	if err := s.withPromotionSellers(ctx, s.queries, promotions, ids); err != nil {
		return nil, err
	}

	return promotions, nil
}

// readPromotion reads one promotion with its sellers and use, with q.
func (s *Service) readPromotion(ctx context.Context, q *db.Queries, id uuid.UUID) (Promotion, error) {
	row, err := q.GetPromotion(ctx, id)
	if errors.Is(err, pgx.ErrNoRows) {
		return Promotion{}, ErrPromotionNotFound
	}

	if err != nil {
		return Promotion{}, fmt.Errorf("reading the promotion: %w", err)
	}

	promotions, err := s.promotionsOf(ctx, q, []db.OrderPromotion{row})
	if err != nil {
		return Promotion{}, err
	}

	return promotions[0], nil
}

// promotionsOf reads stored promotions with their sellers and use, with q.
func (s *Service) promotionsOf(ctx context.Context, q *db.Queries, rows []db.OrderPromotion) ([]Promotion, error) {
	promotions := make([]Promotion, 0, len(rows))
	ids := make([]uuid.UUID, 0, len(rows))

	for _, r := range rows {
		p, err := promotionOf(r)
		if err != nil {
			return nil, err
		}

		promotions, ids = append(promotions, p), append(ids, p.ID)
	}

	if err := s.withPromotionSellers(ctx, q, promotions, ids); err != nil {
		return nil, err
	}

	uses, err := s.usesOf(ctx, q, ids)
	if err != nil {
		return nil, err
	}

	for i := range promotions {
		promotions[i].Use = uses[promotions[i].ID]
	}

	return promotions, nil
}

func (s *Service) withPromotionSellers(ctx context.Context, q *db.Queries, promotions []Promotion, ids []uuid.UUID) error {
	rows, err := q.PromotionSellers(ctx, ids)
	if err != nil {
		return fmt.Errorf("reading the promotions' sellers: %w", err)
	}

	at := make(map[uuid.UUID]int, len(promotions))
	for i, p := range promotions {
		at[p.ID] = i
	}

	for _, r := range rows {
		i := at[r.PromotionID]
		promotions[i].SellerIDs = append(promotions[i].SellerIDs, r.SellerID)
	}

	return nil
}

// stored is p as the table keeps it.
func (p Promotion) stored() (db.InsertPromotionParams, error) {
	rules, err := json.Marshal(p.Rules)
	if err != nil {
		return db.InsertPromotionParams{}, fmt.Errorf("writing the promotion's rules: %w", err)
	}

	return db.InsertPromotionParams{
		Name: p.Name, StartsAt: p.StartsAt, EndsAt: p.EndsAt, AllSellers: p.AllSellers, BudgetVnd: p.BudgetVND,
		PerPhonePerDay: int32(p.PerPhonePerDay), Enabled: p.Enabled, Rules: rules, //nolint:gosec // at most 100
	}, nil
}

// promotionChanges is what changed from before to after, as the audit keeps
// it.
func promotionChanges(before, after Promotion) []audit.Change {
	var changes []audit.Change

	field := func(name, from, to string) {
		if from != to {
			changes = append(changes, audit.ChangedFromTo(name, from, to))
		}
	}

	field("name", before.Name, after.Name)
	field("startsAt", before.StartsAt.UTC().Format(time.RFC3339), after.StartsAt.UTC().Format(time.RFC3339))
	field("endsAt", before.EndsAt.UTC().Format(time.RFC3339), after.EndsAt.UTC().Format(time.RFC3339))
	field("allSellers", strconv.FormatBool(before.AllSellers), strconv.FormatBool(after.AllSellers))
	field("budgetVnd", strconv.FormatInt(before.BudgetVND, 10), strconv.FormatInt(after.BudgetVND, 10))
	field("perPhonePerDay", strconv.Itoa(before.PerPhonePerDay), strconv.Itoa(after.PerPhonePerDay))
	field("enabled", strconv.FormatBool(before.Enabled), strconv.FormatBool(after.Enabled))

	if !slices.Equal(before.SellerIDs, after.SellerIDs) {
		changes = append(changes, audit.Changed("sellerIds"))
	}

	if string(mustJSON(before.Rules)) != string(mustJSON(after.Rules)) {
		changes = append(changes, audit.Changed("rules"))
	}

	return changes
}

func mustJSON(v any) []byte {
	b, _ := json.Marshal(v)

	return b
}

func promotionResource(p Promotion) audit.Resource {
	return audit.Resource{Type: audit.ResourcePromotion, ID: p.ID.String(), Label: p.Name}
}

// Payout is what Second Bite owes a seller for one week's discounts: those of
// its orders handed over that week, and whether an admin marked it paid.
type Payout struct {
	SellerID     uuid.UUID
	SellerName   string
	AmountVND    int64
	Orders       int
	NewCustomers int
	// PaidAt is when an admin marked the week paid, with the amount then;
	// nil until they do.
	PaidAt  *time.Time
	PaidVND int64
}

// Payouts answers an admin what each seller is owed for the week starting on
// weekStart, a Monday in Vietnam time, from every promotion or one; the most
// owed first.
func (s *Service) Payouts(ctx context.Context, weekStart time.Time, promotionID uuid.UUID) ([]Payout, error) {
	if _, err := platform.RequireAdmin(ctx); err != nil {
		return nil, err
	}

	return s.payouts(ctx, s.queries, weekStart, promotionID)
}

// MarkPayout records that Second Bite paid a seller back for the week
// starting on weekStart, the amount it is owed now, in the audit too. A week
// is marked once.
func (s *Service) MarkPayout(ctx context.Context, sellerID uuid.UUID, weekStart time.Time) (Payout, error) {
	caller, err := platform.RequireAdmin(ctx)
	if err != nil {
		return Payout{}, err
	}

	var marked Payout

	err = pgx.BeginFunc(ctx, s.pool, func(tx pgx.Tx) error {
		q := s.queries.WithTx(tx)

		payouts, err := s.payouts(ctx, q, weekStart, uuid.Nil)
		if err != nil {
			return err
		}

		i := slices.IndexFunc(payouts, func(p Payout) bool { return p.SellerID == sellerID })
		if i < 0 {
			return ErrPayoutNothingOwed
		}

		monday := mondayOf(weekStart)

		n, err := q.InsertPayout(ctx, db.InsertPayoutParams{
			SellerID: sellerID, WeekStart: pgtype.Date{Time: monday, Valid: true}, AmountVnd: payouts[i].AmountVND,
			PaidBy: uuid.NullUUID{UUID: caller.AccountID, Valid: true},
		})
		if err != nil {
			return fmt.Errorf("marking the payout: %w", err)
		}

		if n == 0 {
			return ErrPayoutAlreadyMarked
		}

		now := s.now()
		marked = payouts[i]
		marked.PaidAt, marked.PaidVND = &now, payouts[i].AmountVND

		return s.trail.Record(ctx, tx,
			audit.Resource{Type: audit.ResourceSeller, ID: sellerID.String(), Label: marked.SellerName},
			audit.PayoutMarked{WeekStart: monday.Format(time.DateOnly), AmountVND: marked.AmountVND})
	})
	if err != nil {
		return Payout{}, err
	}

	return marked, nil
}

func (s *Service) payouts(ctx context.Context, q *db.Queries, weekStart time.Time, promotionID uuid.UUID) ([]Payout, error) {
	y, m, d := weekStart.Date()
	since := time.Date(y, m, d, 0, 0, 0, 0, vietnam)

	if since.Weekday() != time.Monday {
		return nil, ErrPayoutWeekInvalid
	}

	until := since.AddDate(0, 0, 7)

	rows, err := q.PayoutsBetween(ctx, db.PayoutsBetweenParams{
		WeekStart: pgtype.Date{Time: mondayOf(weekStart), Valid: true}, Since: &since, Until: &until,
		PromotionID: uuid.NullUUID{UUID: promotionID, Valid: promotionID != uuid.Nil},
	})
	if err != nil {
		return nil, fmt.Errorf("reading the payouts: %w", err)
	}

	payouts := make([]Payout, 0, len(rows))
	for _, r := range rows {
		payouts = append(payouts, Payout{
			SellerID: r.SellerID, SellerName: r.SellerName, AmountVND: r.AmountVnd, Orders: int(r.Orders),
			NewCustomers: int(r.NewCustomers), PaidAt: r.PaidAt, PaidVND: r.PaidVnd.Int64,
		})
	}

	return payouts, nil
}

// mondayOf is the date of weekStart as a date column keeps it.
func mondayOf(weekStart time.Time) time.Time {
	y, m, d := weekStart.Date()

	return time.Date(y, m, d, 0, 0, 0, 0, time.UTC)
}
