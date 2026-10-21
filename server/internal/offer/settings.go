package offer

import (
	"context"
	"fmt"
	"log/slog"
	"strconv"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"

	"github.com/kl3inIT/second-bite/server/internal/audit"
	"github.com/kl3inIT/second-bite/server/internal/offer/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// Settings are the rules admins change for every offer, kept in one row.
type Settings struct {
	// MinDiscountPercent is how far below its original price an offer must
	// be priced: 20 to start, as the founder decided on 18 October 2026.
	MinDiscountPercent int
	DefaultRadiusKm    int
	MaxRadiusKm        int
	WindowMin          time.Duration
	WindowMax          time.Duration
	// StartsWithin bounds how far ahead a collection window may start.
	StartsWithin time.Duration
	UpdatedAt    time.Time
	UpdatedBy    *uuid.UUID
}

// Settings returns the offer settings, to admins.
func (s *Service) Settings(ctx context.Context) (Settings, error) {
	if _, err := platform.RequireAdmin(ctx); err != nil {
		return Settings{}, err
	}

	return s.settings(ctx)
}

// SaveSettings replaces the offer settings for an admin, when they are still
// at version, the UpdatedAt the admin read; otherwise it answers
// platform.ErrChangedSinceRead. A save that changes nothing writes nothing.
func (s *Service) SaveSettings(ctx context.Context, in Settings, version time.Time) (Settings, error) {
	caller, err := platform.RequireAdmin(ctx)
	if err != nil {
		return Settings{}, err
	}

	if !in.valid() {
		return Settings{}, ErrSettingsInvalid
	}

	var changed []audit.Change

	err = pgx.BeginFunc(ctx, s.pool, func(tx pgx.Tx) error {
		q := s.queries.WithTx(tx)

		current, err := q.LockSettings(ctx)
		if err != nil {
			return fmt.Errorf("reading the offer settings: %w", err)
		}

		if !platform.SameVersion(current.UpdatedAt, version) {
			return platform.ErrChangedSinceRead
		}

		next := db.PutSettingsParams{
			MinDiscountPercent: int32(in.MinDiscountPercent), //nolint:gosec // bounded by valid
			DefaultRadiusKm:    int32(in.DefaultRadiusKm),    //nolint:gosec // likewise
			MaxRadiusKm:        int32(in.MaxRadiusKm),        //nolint:gosec // likewise
			WindowMinMinutes:   int32(in.WindowMin.Minutes()),
			WindowMaxMinutes:   int32(in.WindowMax.Minutes()),
			StartsWithinHours:  int32(in.StartsWithin.Hours()),
			UpdatedBy:          uuid.NullUUID{UUID: caller.AccountID, Valid: true},
		}

		changed = changedSettings(current, next)
		if len(changed) == 0 {
			return nil
		}

		if err := q.PutSettings(ctx, next); err != nil {
			return fmt.Errorf("saving the offer settings: %w", err)
		}

		return s.trail.Record(ctx, tx,
			audit.Resource{Type: audit.ResourceOfferSettings, ID: audit.SingletonID},
			audit.OfferSettingsChanged{Changes: changed})
	})
	if err != nil {
		return Settings{}, err
	}

	if len(changed) > 0 {
		s.logger.InfoContext(ctx, "offer settings changed",
			slog.String("event", "offer.settings.changed"),
			slog.String("account_id", caller.AccountID.String()),
		)
	}

	return s.settings(ctx)
}

// changedSettings names, as the API does, the settings next changes.
func changedSettings(current db.LockSettingsRow, next db.PutSettingsParams) []audit.Change {
	var changed []audit.Change

	for _, f := range []struct {
		name     string
		was, now int32
	}{
		{"minDiscountPercent", current.MinDiscountPercent, next.MinDiscountPercent},
		{"defaultRadiusKm", current.DefaultRadiusKm, next.DefaultRadiusKm},
		{"maxRadiusKm", current.MaxRadiusKm, next.MaxRadiusKm},
		{"windowMinMinutes", current.WindowMinMinutes, next.WindowMinMinutes},
		{"windowMaxMinutes", current.WindowMaxMinutes, next.WindowMaxMinutes},
		{"startsWithinHours", current.StartsWithinHours, next.StartsWithinHours},
	} {
		if f.was != f.now {
			changed = append(changed, audit.ChangedFromTo(f.name, strconv.Itoa(int(f.was)), strconv.Itoa(int(f.now))))
		}
	}

	return changed
}

// valid holds the bounds the table's checks hold, so a mistake is a
// validation failure rather than a database error.
func (in Settings) valid() bool {
	return in.MinDiscountPercent >= 0 && in.MinDiscountPercent <= 90 &&
		in.DefaultRadiusKm >= 1 && in.MaxRadiusKm >= in.DefaultRadiusKm && in.MaxRadiusKm <= 100 &&
		in.WindowMin >= 15*time.Minute && in.WindowMax >= in.WindowMin && in.WindowMax <= 24*time.Hour &&
		in.WindowMin%time.Minute == 0 && in.WindowMax%time.Minute == 0 &&
		in.StartsWithin >= time.Hour && in.StartsWithin <= 72*time.Hour && in.StartsWithin%time.Hour == 0
}

func (s *Service) settings(ctx context.Context) (Settings, error) {
	row, err := s.queries.GetSettings(ctx)
	if err != nil {
		return Settings{}, fmt.Errorf("reading the offer settings: %w", err)
	}

	out := Settings{
		MinDiscountPercent: int(row.MinDiscountPercent),
		DefaultRadiusKm:    int(row.DefaultRadiusKm),
		MaxRadiusKm:        int(row.MaxRadiusKm),
		WindowMin:          time.Duration(row.WindowMinMinutes) * time.Minute,
		WindowMax:          time.Duration(row.WindowMaxMinutes) * time.Minute,
		StartsWithin:       time.Duration(row.StartsWithinHours) * time.Hour,
		UpdatedAt:          row.UpdatedAt,
	}

	if row.UpdatedBy.Valid {
		out.UpdatedBy = &row.UpdatedBy.UUID
	}

	return out, nil
}
