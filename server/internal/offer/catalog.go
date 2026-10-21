package offer

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
	"github.com/jackc/pgx/v5/pgtype"

	"github.com/kl3inIT/second-bite/server/internal/offer/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// maxDishes is how many dishes a seller's catalog holds.
const maxDishes = 100

// DishDetails are what a seller keeps of a dish in its catalog: the stable
// base of what it sells, as Karma's items and Too Good To Go's listings split
// it from the daily post. A price, hours or units belong to a post, never
// here.
type DishDetails struct {
	Name        string
	Kind        Kind
	Unit        string
	Description string
	// Ingredients is one text of what the dish is made of and what it may
	// contain, which allergy sufferers read.
	Ingredients string
	// OriginalPriceVND is what the dish normally sells for, optional: a post starts from
	// it, and still sets its own.
	OriginalPriceVND *int64
	PhotoID          uuid.UUID
	// MorePhotoIDs are up to two more photos after the cover (SEC-119).
	MorePhotoIDs []uuid.UUID
	// Hidden keeps the dish out of the list a post is picked from, without
	// deleting it.
	Hidden bool
}

// Dish is a dish in a seller's catalog.
type Dish struct {
	ID       uuid.UUID
	SellerID uuid.UUID
	DishDetails
	CreatedAt time.Time
	UpdatedAt time.Time
}

// DishChange is a dish's new details; a field left nil stays as it was.
type DishChange struct {
	Name        *string
	Kind        *Kind
	Unit        *string
	Description *string
	Ingredients *string
	// OriginalPriceVND of 0 takes the price away.
	OriginalPriceVND *int64
	PhotoID          *uuid.UUID
	MorePhotoIDs     *[]uuid.UUID
	Hidden           *bool
}

// normalized trims the details, names the unit when the seller named none, and
// checks each field's own bounds.
func (d DishDetails) normalized() (DishDetails, error) {
	d.Name = strings.TrimSpace(d.Name)
	d.Unit = strings.TrimSpace(d.Unit)
	d.Description = strings.TrimSpace(d.Description)
	d.Ingredients = strings.TrimSpace(d.Ingredients)

	if d.Unit == "" {
		d.Unit = defaultUnit
	}

	if !between(utf8.RuneCountInString(d.Name), 1, 80) || !between(utf8.RuneCountInString(d.Unit), 1, 20) ||
		utf8.RuneCountInString(d.Description) > 1000 || utf8.RuneCountInString(d.Ingredients) > 500 ||
		!knownKind(d.Kind) || d.PhotoID == uuid.Nil || !morePhotosValid(d.PhotoID, d.MorePhotoIDs) ||
		(d.OriginalPriceVND != nil && *d.OriginalPriceVND <= 1000) {
		return DishDetails{}, ErrDetailsInvalid
	}

	if d.MorePhotoIDs == nil {
		d.MorePhotoIDs = []uuid.UUID{}
	}

	return d, nil
}

// apply returns the details once c is applied.
func (d DishDetails) apply(c DishChange) DishDetails {
	replace(&d.Name, c.Name)
	replace(&d.Kind, c.Kind)
	replace(&d.Unit, c.Unit)
	replace(&d.Description, c.Description)
	replace(&d.Ingredients, c.Ingredients)

	if c.OriginalPriceVND != nil {
		d.OriginalPriceVND = c.OriginalPriceVND
		if *c.OriginalPriceVND == 0 {
			d.OriginalPriceVND = nil
		}
	}

	replace(&d.PhotoID, c.PhotoID)
	replace(&d.Hidden, c.Hidden)

	if c.MorePhotoIDs != nil {
		d.MorePhotoIDs = *c.MorePhotoIDs
	}

	return d
}

// AddDish adds a dish to the catalog of a seller the caller owns or works for.
// Its photo is one the caller uploaded, or one the seller already shows.
func (s *Service) AddDish(ctx context.Context, sellerID uuid.UUID, d DishDetails) (Dish, error) {
	caller, err := platform.RequireCaller(ctx)
	if err != nil {
		return Dish{}, err
	}

	if _, err := s.sellers.Publishing(ctx, sellerID, caller.AccountID); err != nil {
		return Dish{}, err
	}

	d, err = d.normalized()
	if err != nil {
		return Dish{}, err
	}

	if err := s.usePhotos(ctx, sellerID, caller.AccountID, d.PhotoID, d.MorePhotoIDs, uuid.Nil, nil); err != nil {
		return Dish{}, err
	}

	var id uuid.UUID

	err = pgx.BeginFunc(ctx, s.pool, func(tx pgx.Tx) error {
		q := s.queries.WithTx(tx)

		if err := q.LockDishes(ctx, sellerID.String()); err != nil {
			return fmt.Errorf("locking the catalog: %w", err)
		}

		held, err := q.CountDishes(ctx, sellerID)
		if err != nil {
			return fmt.Errorf("counting the dishes: %w", err)
		}

		if held >= maxDishes {
			return ErrDishLimitReached
		}

		id, err = q.InsertDish(ctx, db.InsertDishParams{
			SellerID: sellerID, CreatedBy: caller.AccountID, Name: d.Name, Kind: string(d.Kind), Unit: d.Unit,
			Description: d.Description, Ingredients: d.Ingredients, OriginalPriceVnd: originalPrice(d.OriginalPriceVND),
			PhotoID: d.PhotoID, MorePhotoIds: d.MorePhotoIDs, Hidden: d.Hidden,
		})
		if err != nil {
			return fmt.Errorf("storing the dish: %w", err)
		}

		return nil
	})
	if err != nil {
		return Dish{}, err
	}

	s.logger.InfoContext(ctx, "dish added",
		slog.String("event", "offer.dish.added"),
		slog.String("dish_id", id.String()),
		slog.String("seller_id", sellerID.String()),
		slog.String("account_id", caller.AccountID.String()),
	)

	return s.dish(ctx, id)
}

// Dishes returns a seller's catalog, the newest first, hidden dishes included,
// to its owner and staff.
func (s *Service) Dishes(ctx context.Context, sellerID uuid.UUID) ([]Dish, error) {
	caller, err := platform.RequireCaller(ctx)
	if err != nil {
		return nil, err
	}

	if _, err := s.sellers.Publishing(ctx, sellerID, caller.AccountID); err != nil {
		return nil, err
	}

	rows, err := s.queries.SellerDishes(ctx, sellerID)
	if err != nil {
		return nil, fmt.Errorf("reading the dishes: %w", err)
	}

	dishes := make([]Dish, 0, len(rows))
	for _, r := range rows {
		dishes = append(dishes, dishFromRow(db.GetDishRow(r)))
	}

	return dishes, nil
}

// ChangeDish changes a dish of a seller the caller owns or works for. A dish
// of another seller is not found.
func (s *Service) ChangeDish(ctx context.Context, id uuid.UUID, c DishChange) (Dish, error) {
	caller, err := platform.RequireCaller(ctx)
	if err != nil {
		return Dish{}, err
	}

	current, err := s.ownDish(ctx, id, caller.AccountID)
	if err != nil {
		return Dish{}, err
	}

	next, err := current.DishDetails.apply(c).normalized()
	if err != nil {
		return Dish{}, err
	}

	err = s.usePhotos(
		ctx, current.SellerID, caller.AccountID, next.PhotoID, next.MorePhotoIDs, current.PhotoID, current.MorePhotoIDs,
	)
	if err != nil {
		return Dish{}, err
	}

	err = s.queries.UpdateDish(ctx, db.UpdateDishParams{
		ID: id, Name: next.Name, Kind: string(next.Kind), Unit: next.Unit, Description: next.Description,
		Ingredients: next.Ingredients, OriginalPriceVnd: originalPrice(next.OriginalPriceVND), PhotoID: next.PhotoID,
		MorePhotoIds: next.MorePhotoIDs, Hidden: next.Hidden,
	})
	if err != nil {
		return Dish{}, fmt.Errorf("storing the dish: %w", err)
	}

	s.logger.InfoContext(ctx, "dish changed",
		slog.String("event", "offer.dish.changed"),
		slog.String("dish_id", id.String()),
		slog.String("account_id", caller.AccountID.String()),
	)

	return s.dish(ctx, id)
}

// RemoveDish deletes a dish from the catalog; the offers posted from it stay as
// they were, since an offer keeps its own copy.
func (s *Service) RemoveDish(ctx context.Context, id uuid.UUID) error {
	caller, err := platform.RequireCaller(ctx)
	if err != nil {
		return err
	}

	if _, err := s.ownDish(ctx, id, caller.AccountID); err != nil {
		return err
	}

	if _, err := s.queries.DeleteDish(ctx, id); err != nil {
		return fmt.Errorf("deleting the dish: %w", err)
	}

	s.logger.InfoContext(ctx, "dish removed",
		slog.String("event", "offer.dish.removed"),
		slog.String("dish_id", id.String()),
		slog.String("account_id", caller.AccountID.String()),
	)

	return nil
}

// ownDish reads a dish for someone who owns or works for its seller.
func (s *Service) ownDish(ctx context.Context, id, accountID uuid.UUID) (Dish, error) {
	d, err := s.dish(ctx, id)
	if err != nil {
		return Dish{}, err
	}

	if _, err := s.sellers.Publishing(ctx, d.SellerID, accountID); err != nil {
		// A stranger learns nothing of another seller's dish.
		return Dish{}, ErrDishNotFound
	}

	return d, nil
}

func (s *Service) dish(ctx context.Context, id uuid.UUID) (Dish, error) {
	row, err := s.queries.GetDish(ctx, id)
	if errors.Is(err, pgx.ErrNoRows) {
		return Dish{}, ErrDishNotFound
	}

	if err != nil {
		return Dish{}, fmt.Errorf("reading the dish: %w", err)
	}

	return dishFromRow(row), nil
}

func dishFromRow(r db.GetDishRow) Dish {
	return Dish{
		ID: r.ID, SellerID: r.SellerID, Name: r.Name, Kind: Kind(r.Kind), Unit: r.Unit, Description: r.Description,
		Ingredients: r.Ingredients, OriginalPriceVND: pricePtr(r.OriginalPriceVnd), PhotoID: r.PhotoID, MorePhotoIDs: r.MorePhotoIds,
		Hidden: r.Hidden, CreatedAt: r.CreatedAt, UpdatedAt: r.UpdatedAt,
	}
}

// originalPrice is a dish's optional original price as the database takes it.
func originalPrice(p *int64) pgtype.Int8 {
	if p == nil {
		return pgtype.Int8{}
	}

	return pgtype.Int8{Int64: *p, Valid: true}
}

func pricePtr(v pgtype.Int8) *int64 {
	if !v.Valid {
		return nil
	}

	return &v.Int64
}
