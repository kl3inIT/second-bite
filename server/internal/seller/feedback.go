package seller

import (
	"context"
	"fmt"
	"log/slog"
	"strings"
	"time"
	"unicode"
	"unicode/utf8"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"

	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/seller/internal/db"
)

const (
	maxFeedbackLetters = 1000
	// feedbackPerDay bounds what one store sends in a day, so a stuck button
	// cannot flood the admins' list.
	feedbackPerDay = 20
	// maxFeedbackListed bounds one read of the admins' list.
	maxFeedbackListed = 200
)

// Feedback is what a store's people told the team (SEC-82).
type Feedback struct {
	ID         uuid.UUID
	SellerID   uuid.UUID
	SellerName string
	Text       string
	SentAt     time.Time
}

// SendFeedback keeps what the seller's people, owner or staff, tell the team:
// 1 to 1,000 characters, at most feedbackPerDay a day for one seller. It keeps
// the seller and not who wrote it.
func (s *Service) SendFeedback(ctx context.Context, sellerID uuid.UUID, text string) error {
	text = strings.TrimSpace(text)
	if !feedbackValid(text) {
		return ErrFeedbackInvalid
	}

	caller, err := platform.RequireCaller(ctx)
	if err != nil {
		return err
	}

	role, err := s.roleOf(ctx, sellerID, caller)
	if err != nil {
		return err
	}

	// An admin who is not one of its people does not speak for the store.
	if role == "" {
		return ErrNotFound
	}

	err = pgx.BeginFunc(ctx, s.pool, func(tx pgx.Tx) error {
		q := s.queries.WithTx(tx)

		// One sender at a time, so feedback sent together cannot pass the bound.
		if err := q.LockSeller(ctx, sellerID); err != nil {
			return fmt.Errorf("locking the seller: %w", err)
		}

		sent, err := q.RecentFeedbackCount(ctx, sellerID)
		if err != nil {
			return fmt.Errorf("counting the seller's feedback: %w", err)
		}

		if sent >= feedbackPerDay {
			return ErrFeedbackLimitReached
		}

		if err := q.InsertFeedback(ctx, db.InsertFeedbackParams{SellerID: sellerID, Body: text}); err != nil {
			return fmt.Errorf("keeping the feedback: %w", err)
		}

		return nil
	})
	if err != nil {
		return err
	}

	s.logger.InfoContext(ctx, "seller feedback sent",
		slog.String("event", "seller.feedback.sent"),
		slog.String("seller_id", sellerID.String()),
		slog.String("account_id", caller.AccountID.String()),
	)

	return nil
}

// feedbackValid tells whether text holds 1 to 1,000 characters and no control
// character but line breaks.
func feedbackValid(text string) bool {
	n := utf8.RuneCountInString(text)
	if !utf8.ValidString(text) || n == 0 || n > maxFeedbackLetters {
		return false
	}

	for _, r := range text {
		if unicode.IsControl(r) && r != '\n' {
			return false
		}
	}

	return true
}

// FeedbackFilter is the stores' feedback an admin reads: sent in [Since,
// Until), of one seller when SellerID is not nil.
type FeedbackFilter struct {
	Since, Until time.Time
	SellerID     uuid.UUID
}

// FeedbackForAdmins answers the feedback the filter keeps, the latest first,
// at most maxFeedbackListed, to an admin.
func (s *Service) FeedbackForAdmins(ctx context.Context, f FeedbackFilter) ([]Feedback, error) {
	if _, err := platform.RequireAdmin(ctx); err != nil {
		return nil, err
	}

	if !f.Until.After(f.Since) {
		return nil, ErrFeedbackListInvalid
	}

	rows, err := s.queries.FeedbackForAdmins(ctx, db.FeedbackForAdminsParams{
		Since: f.Since, Until: f.Until,
		SellerID: uuid.NullUUID{UUID: f.SellerID, Valid: f.SellerID != uuid.Nil},
		MaxRows:  maxFeedbackListed,
	})
	if err != nil {
		return nil, fmt.Errorf("listing the stores' feedback: %w", err)
	}

	out := make([]Feedback, 0, len(rows))
	for _, r := range rows {
		out = append(out, Feedback{ID: r.ID, SellerID: r.SellerID, SellerName: r.SellerName, Text: r.Body, SentAt: r.CreatedAt})
	}

	return out, nil
}
