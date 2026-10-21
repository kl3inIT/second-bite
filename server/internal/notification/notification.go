// Package notification tells people what happened: it owns who delivers
// email, chosen by admins while the service runs, and the emails sent.
package notification

import (
	"context"
	"crypto/aes"
	"crypto/cipher"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/kl3inIT/second-bite/server/internal/audit"
	"github.com/kl3inIT/second-bite/server/internal/notification/internal/db"
)

// sendTimeout bounds one delivery, so a request that waits for an email (a
// sign-in code) answers within it.
const sendTimeout = 10 * time.Second

// Email is one message to one person. Kind names it in logs and in the
// record of what was sent, such as "sign-in-code".
type Email struct {
	Kind    string
	To      string
	Subject string
	Text    string
	HTML    string
}

// Config is what the module needs from the environment.
type Config struct {
	// SettingsKey seals the secrets of the email settings: 32 bytes.
	SettingsKey []byte
}

// Service is the module's published API.
type Service struct {
	pool    *pgxpool.Pool
	queries *db.Queries
	senders emailSenders
	aead    cipher.AEAD
	trail   *audit.Service
	logger  *slog.Logger
}

// NewService assembles the module and its registry of email providers.
func NewService(pool *pgxpool.Pool, trail *audit.Service, cfg Config, logger *slog.Logger) (*Service, error) {
	block, err := aes.NewCipher(cfg.SettingsKey)
	if err != nil {
		return nil, fmt.Errorf("the email settings key: %w", err)
	}

	aead, err := cipher.NewGCM(block)
	if err != nil {
		return nil, fmt.Errorf("the email settings key: %w", err)
	}

	senders, err := newEmailSenders(map[EmailProvider]emailSender{
		EmailProviderSMTP:  smtpEmailSender{},
		EmailProviderBrevo: brevoEmailSender{client: &http.Client{Timeout: sendTimeout}, baseURL: brevoBaseURL},
	})
	if err != nil {
		return nil, err
	}

	return &Service{pool: pool, queries: db.New(pool), senders: senders, aead: aead, trail: trail, logger: logger}, nil
}

// SendEmail delivers e through the provider admins chose and records it.
// It answers ErrEmailNotConfigured or ErrEmailUnavailable; the reason is
// logged here, never returned.
func (s *Service) SendEmail(ctx context.Context, e Email) error {
	row, err := s.queries.GetEmailSettings(ctx)
	if errors.Is(err, pgx.ErrNoRows) {
		s.logger.WarnContext(ctx, "email not configured",
			slog.String("event", "notification.email.not_configured"),
			slog.String("kind", e.Kind),
			slog.String("error_code", ErrEmailNotConfigured.Code),
		)

		return ErrEmailNotConfigured
	}

	if err != nil {
		return fmt.Errorf("reading the email settings: %w", err)
	}

	cfg, err := s.unsealConfig(row)
	if err != nil {
		return err
	}

	provider := EmailProvider(row.Provider)

	sendCtx, cancel := context.WithTimeout(ctx, sendTimeout)
	defer cancel()

	start := time.Now()

	messageID, err := s.senders[provider].Send(sendCtx, cfg, e)
	if err != nil {
		return s.sendFailed(ctx, e, provider, err)
	}

	if err := s.queries.RecordEmail(ctx, db.RecordEmailParams{
		Kind: e.Kind, Recipient: e.To, Provider: string(provider), ProviderMessageID: messageID,
	}); err != nil {
		return fmt.Errorf("recording the email: %w", err)
	}

	s.logger.InfoContext(ctx, "email sent",
		slog.String("event", "notification.email.sent"),
		slog.String("kind", e.Kind),
		slog.String("provider", string(provider)),
		slog.Int64("duration_ms", time.Since(start).Milliseconds()),
	)

	return nil
}

// ForgetRecipient deletes the record of every email sent to address, when
// the account of the address is deleted (SEC-37). Forgetting twice does
// nothing more.
func (s *Service) ForgetRecipient(ctx context.Context, address string) error {
	n, err := s.queries.DeleteEmailsTo(ctx, address)
	if err != nil {
		return fmt.Errorf("forgetting the emails sent to an address: %w", err)
	}

	s.logger.InfoContext(ctx, "emails to a recipient forgotten",
		slog.String("event", "notification.recipient.forgotten"),
		slog.Int64("emails", n),
	)

	return nil
}

func (s *Service) sendFailed(ctx context.Context, e Email, provider EmailProvider, err error) error {
	failure := ErrEmailUnavailable

	var se *sendError
	if errors.As(err, &se) && se.outcome == sendRateLimited {
		failure = failure.WithRetryAfter(se.retryAfter)
	}

	s.logger.WarnContext(ctx, "email not sent",
		slog.String("event", "notification.email.failed"),
		slog.String("kind", e.Kind),
		slog.String("provider", string(provider)),
		slog.String("error_type", fmt.Sprintf("%T", errors.Unwrap(err))),
		slog.String("error_code", failure.Code),
		slog.String("error", err.Error()),
	)

	return failure.WithCause(err)
}
