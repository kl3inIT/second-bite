package order

import (
	"context"
	"fmt"
	"log/slog"
	"strconv"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"

	"github.com/kl3inIT/second-bite/server/internal/audit"
	"github.com/kl3inIT/second-bite/server/internal/order/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// Settings bound what one person holds (SEC-158), kept in one row. The
// first values are the user's of 6 November 2026.
type Settings struct {
	// OpenPerPhonePerSeller is how many orders still to collect one phone
	// number may hold at a store.
	OpenPerPhonePerSeller int
	// OpenPerAddress is how many orders still to collect may have been placed
	// from one address. Many customers share one behind a mall's Wi-Fi or a
	// carrier's NAT, so it is loose.
	OpenPerAddress int
	// MissedLimit orders missed within MissedDays refuse a phone number until
	// the older of them leaves those days.
	MissedLimit int
	MissedDays  int
	UpdatedAt   time.Time
	UpdatedBy   *uuid.UUID
}

// Settings returns the order settings, to admins.
func (s *Service) Settings(ctx context.Context) (Settings, error) {
	if _, err := platform.RequireAdmin(ctx); err != nil {
		return Settings{}, err
	}

	return s.settings(ctx, s.queries)
}

// SaveSettings replaces the order settings for an admin, when they are still
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

		current, err := q.LockOrderSettings(ctx)
		if err != nil {
			return fmt.Errorf("reading the order settings: %w", err)
		}

		if !platform.SameVersion(current.UpdatedAt, version) {
			return platform.ErrChangedSinceRead
		}

		next := db.PutOrderSettingsParams{
			OpenPerPhonePerSeller: int32(in.OpenPerPhonePerSeller), //nolint:gosec // bounded by valid
			OpenPerAddress:        int32(in.OpenPerAddress),        //nolint:gosec // likewise
			MissedLimit:           int32(in.MissedLimit),           //nolint:gosec // likewise
			MissedDays:            int32(in.MissedDays),            //nolint:gosec // likewise
			UpdatedBy:             uuid.NullUUID{UUID: caller.AccountID, Valid: true},
		}

		changed = changedSettings(current, next)
		if len(changed) == 0 {
			return nil
		}

		if err := q.PutOrderSettings(ctx, next); err != nil {
			return fmt.Errorf("saving the order settings: %w", err)
		}

		return s.trail.Record(ctx, tx,
			audit.Resource{Type: audit.ResourceOrderSettings, ID: audit.SingletonID},
			audit.OrderSettingsChanged{Changes: changed})
	})
	if err != nil {
		return Settings{}, err
	}

	if len(changed) > 0 {
		s.logger.InfoContext(ctx, "order settings changed",
			slog.String("event", "order.settings.changed"),
			slog.String("account_id", caller.AccountID.String()),
		)
	}

	return s.settings(ctx, s.queries)
}

// changedSettings names, as the API does, the settings next changes.
func changedSettings(current db.LockOrderSettingsRow, next db.PutOrderSettingsParams) []audit.Change {
	var changed []audit.Change

	for _, f := range []struct {
		name     string
		was, now int32
	}{
		{"openPerPhonePerSeller", current.OpenPerPhonePerSeller, next.OpenPerPhonePerSeller},
		{"openPerAddress", current.OpenPerAddress, next.OpenPerAddress},
		{"missedLimit", current.MissedLimit, next.MissedLimit},
		{"missedDays", current.MissedDays, next.MissedDays},
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
	return in.OpenPerPhonePerSeller >= 1 && in.OpenPerPhonePerSeller <= 20 &&
		in.OpenPerAddress >= 1 && in.OpenPerAddress <= 500 &&
		in.MissedLimit >= 1 && in.MissedLimit <= 20 &&
		in.MissedDays >= 1 && in.MissedDays <= 60
}

// settings reads the settings with q: the pool's, or a transaction's.
func (s *Service) settings(ctx context.Context, q *db.Queries) (Settings, error) {
	row, err := q.GetOrderSettings(ctx)
	if err != nil {
		return Settings{}, fmt.Errorf("reading the order settings: %w", err)
	}

	out := Settings{
		OpenPerPhonePerSeller: int(row.OpenPerPhonePerSeller), OpenPerAddress: int(row.OpenPerAddress),
		MissedLimit: int(row.MissedLimit), MissedDays: int(row.MissedDays), UpdatedAt: row.UpdatedAt,
	}

	if row.UpdatedBy.Valid {
		out.UpdatedBy = &row.UpdatedBy.UUID
	}

	return out, nil
}
