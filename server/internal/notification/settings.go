package notification

import (
	"context"
	"crypto/rand"
	"errors"
	"fmt"
	"net/mail"
	"slices"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"

	"github.com/kl3inIT/second-bite/server/internal/notification/internal/db"
)

// EmailSettings is who delivers email, as operators read it. Secrets are never
// returned; the settings say only whether one is stored.
type EmailSettings struct {
	Provider         EmailProvider
	SenderAddress    string
	SenderName       string
	SMTPHost         string
	SMTPPort         int
	SMTPSecurity     SMTPSecurity
	SMTPUsername     string
	SMTPPasswordSet  bool
	BrevoAPIKeySet   bool
	UpdatedAt        time.Time
	UpdatedByAccount uuid.NullUUID
}

// EmailSettingsChange is what an operator saves. An empty secret keeps the one
// stored.
type EmailSettingsChange struct {
	Provider      EmailProvider
	SenderAddress string
	SenderName    string
	SMTPHost      string
	SMTPPort      int
	SMTPSecurity  SMTPSecurity
	SMTPUsername  string
	SMTPPassword  string
	BrevoAPIKey   string
}

// EmailSettings returns the current settings, or ErrEmailNotConfigured.
func (s *Service) EmailSettings(ctx context.Context) (EmailSettings, error) {
	row, err := s.queries.GetEmailSettings(ctx)
	if errors.Is(err, pgx.ErrNoRows) {
		return EmailSettings{}, ErrEmailNotConfigured
	}

	if err != nil {
		return EmailSettings{}, fmt.Errorf("reading the email settings: %w", err)
	}

	return EmailSettings{
		Provider:         EmailProvider(row.Provider),
		SenderAddress:    row.SenderAddress,
		SenderName:       row.SenderName,
		SMTPHost:         row.SmtpHost,
		SMTPPort:         int(row.SmtpPort),
		SMTPSecurity:     SMTPSecurity(row.SmtpSecurity),
		SMTPUsername:     row.SmtpUsername,
		SMTPPasswordSet:  row.SmtpPasswordSealed != nil,
		BrevoAPIKeySet:   row.BrevoApiKeySealed != nil,
		UpdatedAt:        row.UpdatedAt,
		UpdatedByAccount: row.UpdatedBy,
	}, nil
}

// SaveEmailSettings validates and stores c; the next email uses it. by is the
// operator who saved it, or uuid.Nil from the command line.
func (s *Service) SaveEmailSettings(ctx context.Context, c EmailSettingsChange, by uuid.UUID) error {
	c.SenderAddress = strings.TrimSpace(c.SenderAddress)
	c.SMTPHost = strings.TrimSpace(c.SMTPHost)

	if c.SMTPSecurity == "" {
		c.SMTPSecurity = SMTPSecuritySTARTTLS
	}

	return pgx.BeginFunc(ctx, s.pool, func(tx pgx.Tx) error {
		q := s.queries.WithTx(tx)

		current, err := q.GetEmailSettings(ctx)
		if err != nil && !errors.Is(err, pgx.ErrNoRows) {
			return fmt.Errorf("reading the email settings: %w", err)
		}

		params := db.PutEmailSettingsParams{
			Provider:           string(c.Provider),
			SenderAddress:      c.SenderAddress,
			SenderName:         strings.TrimSpace(c.SenderName),
			SmtpHost:           c.SMTPHost,
			SmtpPort:           int32(c.SMTPPort), //nolint:gosec // validated to 1..65535 below
			SmtpSecurity:       string(c.SMTPSecurity),
			SmtpUsername:       strings.TrimSpace(c.SMTPUsername),
			SmtpPasswordSealed: current.SmtpPasswordSealed,
			BrevoApiKeySealed:  current.BrevoApiKeySealed,
			UpdatedBy:          uuid.NullUUID{UUID: by, Valid: by != uuid.Nil},
		}

		if c.SMTPPassword != "" {
			if params.SmtpPasswordSealed, err = s.seal("smtp_password", c.SMTPPassword); err != nil {
				return err
			}
		}

		if c.BrevoAPIKey != "" {
			if params.BrevoApiKeySealed, err = s.seal("brevo_api_key", c.BrevoAPIKey); err != nil {
				return err
			}
		}

		if err := validateSettings(params); err != nil {
			return err
		}

		if err := q.PutEmailSettings(ctx, params); err != nil {
			return fmt.Errorf("saving the email settings: %w", err)
		}

		return nil
	})
}

func validateSettings(p db.PutEmailSettingsParams) error {
	problems := append(senderProblems(p), providerProblems(p)...)

	if len(problems) > 0 {
		return ErrEmailSettingsInvalid.WithCause(errors.New(strings.Join(problems, "; ")))
	}

	return nil
}

func senderProblems(p db.PutEmailSettingsParams) []string {
	var problems []string

	if a, err := mail.ParseAddress(p.SenderAddress); err != nil || a.Address != p.SenderAddress {
		problems = append(problems, "the sender address is not a plain email address")
	}

	if p.SenderName == "" {
		problems = append(problems, "the sender name is empty")
	}

	return problems
}

func providerProblems(p db.PutEmailSettingsParams) []string {
	var problems []string

	switch EmailProvider(p.Provider) {
	case EmailProviderSMTP:
		if p.SmtpHost == "" || p.SmtpPort < 1 || p.SmtpPort > 65535 {
			problems = append(problems, "SMTP needs a host and a port")
		}

		if !slices.Contains([]SMTPSecurity{SMTPSecuritySTARTTLS, SMTPSecurityTLS, SMTPSecurityNone}, SMTPSecurity(p.SmtpSecurity)) {
			problems = append(problems, "unknown SMTP security")
		}

		if p.SmtpUsername != "" && p.SmtpPasswordSealed == nil {
			problems = append(problems, "an SMTP user needs a password")
		}
	case EmailProviderBrevo:
		if p.BrevoApiKeySealed == nil {
			problems = append(problems, "Brevo needs an API key")
		}
	default:
		problems = append(problems, "unknown provider")
	}

	return problems
}

func (s *Service) unsealConfig(row db.NotificationEmailSetting) (providerConfig, error) {
	cfg := providerConfig{
		senderAddress: row.SenderAddress,
		senderName:    row.SenderName,
		smtpHost:      row.SmtpHost,
		smtpPort:      int(row.SmtpPort),
		smtpSecurity:  SMTPSecurity(row.SmtpSecurity),
		smtpUsername:  row.SmtpUsername,
	}

	var err error

	if row.SmtpPasswordSealed != nil {
		if cfg.smtpPassword, err = s.unseal("smtp_password", row.SmtpPasswordSealed); err != nil {
			return providerConfig{}, err
		}
	}

	if row.BrevoApiKeySealed != nil {
		if cfg.brevoAPIKey, err = s.unseal("brevo_api_key", row.BrevoApiKeySealed); err != nil {
			return providerConfig{}, err
		}
	}

	return cfg, nil
}

// seal encrypts one secret with AES-256-GCM. The field's name is the
// additional data, so a sealed value cannot be moved to another field.
func (s *Service) seal(field, plaintext string) ([]byte, error) {
	nonce := make([]byte, s.aead.NonceSize())
	if _, err := rand.Read(nonce); err != nil {
		return nil, fmt.Errorf("sealing %s: %w", field, err)
	}

	return s.aead.Seal(nonce, nonce, []byte(plaintext), []byte(field)), nil
}

func (s *Service) unseal(field string, sealed []byte) (string, error) {
	n := s.aead.NonceSize()
	if len(sealed) < n {
		return "", fmt.Errorf("unsealing %s: too short", field)
	}

	plaintext, err := s.aead.Open(nil, sealed[:n], sealed[n:], []byte(field))
	if err != nil {
		return "", fmt.Errorf("unsealing %s, sealed under another key: %w", field, err)
	}

	return string(plaintext), nil
}
