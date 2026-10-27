package offer

import (
	"context"
	"fmt"
	"slices"
	"strings"
	"time"
	"unicode/utf8"

	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/offer/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

const (
	// maxAdminPageSize bounds one page of the admins' list.
	maxAdminPageSize = 100
	// maxAdminQueryRunes bounds what an admin searches for.
	maxAdminQueryRunes = 100
)

// The statuses an admin may list by.
var statuses = []Status{StatusOnSale, StatusSoldOut, StatusClosed, StatusWithdrawn}

// AdminFilter is what an admin lists every seller's offers by.
type AdminFilter struct {
	// Status keeps the offers in it; all when empty.
	Status Status
	// Query keeps the offers whose dish, seller or description holds its
	// words, as customers search (searchQuery).
	Query string
	// SellerID keeps one seller's offers; all when nil.
	SellerID uuid.UUID
	// PostedSince and PostedUntil keep the offers posted in
	// [PostedSince, PostedUntil); either may be nil.
	PostedSince, PostedUntil *time.Time
	// Page counts from 1; Size runs from 1 to 100.
	Page, Size int
}

// AdminListed is an offer as admins list it, with its seller's name.
type AdminListed struct {
	Offer
	SellerName string
}

// AdminPage is one page of the admins' list, how many offers match in all,
// and how many of each status match the other filters.
type AdminPage struct {
	Offers []AdminListed
	Total  int
	Counts map[Status]int
}

// ListForAdmins answers one page of every seller's offers matching f, to an
// admin, newest first (SEC-134). Admins read offers and never change them.
func (s *Service) ListForAdmins(ctx context.Context, f AdminFilter) (AdminPage, error) {
	if _, err := platform.RequireAdmin(ctx); err != nil {
		return AdminPage{}, err
	}

	params, err := f.params()
	if err != nil {
		return AdminPage{}, err
	}

	rows, err := s.queries.OffersForAdmins(ctx, params)
	if err != nil {
		return AdminPage{}, fmt.Errorf("listing the offers: %w", err)
	}

	total, err := s.queries.CountOffersForAdmins(ctx, db.CountOffersForAdminsParams{
		Status: params.Status, Query: params.Query, SellerID: params.SellerID,
		PostedSince: params.PostedSince, PostedUntil: params.PostedUntil,
	})
	if err != nil {
		return AdminPage{}, fmt.Errorf("counting the offers: %w", err)
	}

	page := AdminPage{Offers: make([]AdminListed, 0, len(rows)), Total: int(total)}

	counts, err := s.queries.CountOffersByStatus(ctx, db.CountOffersByStatusParams{
		Query: params.Query, SellerID: params.SellerID, PostedSince: params.PostedSince, PostedUntil: params.PostedUntil,
	})
	if err != nil {
		return AdminPage{}, fmt.Errorf("counting the offers by status: %w", err)
	}

	page.Counts = map[Status]int{
		StatusOnSale: int(counts.OnSale), StatusSoldOut: int(counts.SoldOut),
		StatusClosed: int(counts.Closed), StatusWithdrawn: int(counts.Withdrawn),
	}

	for _, r := range rows {
		page.Offers = append(page.Offers, AdminListed{Offer: s.fromRow(db.GetOfferRow(r)), SellerName: r.SellerName})
	}

	return page, nil
}

func (f AdminFilter) params() (db.OffersForAdminsParams, error) {
	if f.Page < 1 || f.Size < 1 || f.Size > maxAdminPageSize {
		return db.OffersForAdminsParams{}, ErrAdminListInvalid
	}

	if f.Status != "" && !slices.Contains(statuses, f.Status) {
		return db.OffersForAdminsParams{}, ErrAdminListInvalid
	}

	query := strings.TrimSpace(f.Query)
	if utf8.RuneCountInString(query) > maxAdminQueryRunes {
		return db.OffersForAdminsParams{}, ErrAdminListInvalid
	}

	if f.PostedSince != nil && f.PostedUntil != nil && !f.PostedSince.Before(*f.PostedUntil) {
		return db.OffersForAdminsParams{}, ErrAdminListInvalid
	}

	return db.OffersForAdminsParams{
		Status:      string(f.Status),
		Query:       searchQuery(query),
		SellerID:    uuid.NullUUID{UUID: f.SellerID, Valid: f.SellerID != uuid.Nil},
		PostedSince: f.PostedSince,
		PostedUntil: f.PostedUntil,
		MaxRows:     int32(f.Size),
		SkipRows:    int32((f.Page - 1) * f.Size), //nolint:gosec // a page past int32 finds nothing anyway
	}, nil
}
