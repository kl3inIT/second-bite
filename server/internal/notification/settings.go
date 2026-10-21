package notification

import (
	"context"
	"crypto/rand"
	"errors"
	"fmt"
	"net/mail"
	"slices"
	"strconv"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"

	"github.com/kl3inIT/second-bite/server/internal/audit"
	"github.com/kl3inIT/second-bite/server/internal/notification/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// EmailSettings is who delivers email, as admins read it. Secrets are never
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

// EmailSettingsChange is what an admin saves. An empty secret keeps the one
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

// EmailSettings returns the current settings to an admin, or
// ErrEmailNotConfigured.
func (s *Service) EmailSettings(ctx context.Context) (EmailSettings, error) {
	if _, err := platform.RequireAdmin(ctx); err != nil {
		return EmailSettings{}, err
	}

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

// SaveEmailSettings validates and stores c for the admin of ctx, when the
// settings are still at version, the UpdatedAt the admin read; otherwise it
// answers platform.ErrChangedSinceRead. The next email uses them. A save that
// changes nothing writes nothing.
func (s *Service) SaveEmailSettings(ctx context.Context, c EmailSettingsChange, version time.Time) error {
	caller, err := platform.RequireAdmin(ctx)
	if err != nil {
		return err
	}

	return s.saveEmailSettings(ctx, c, caller.AccountID, &version)
}

// CreateEmailSettings stores the first settings for the admin of ctx, as
// SaveEmailSettings does; when settings exist already, someone saved them
// since the admin saw none, and it answers platform.ErrChangedSinceRead.
func (s *Service) CreateEmailSettings(ctx context.Context, c EmailSettingsChange) error {
	caller, err := platform.RequireAdmin(ctx)
	if err != nil {
		return err
	}

	return s.saveEmailSettings(ctx, c, caller.AccountID, &time.Time{})
}

// SaveEmailSettingsAsSystem stores c with no admin behind it, whatever was
// saved before. Only the command line calls it: whoever runs it already has
// the server's own access.
func (s *Service) SaveEmailSettingsAsSystem(ctx context.Context, c EmailSettingsChange) error {
	return s.saveEmailSettings(ctx, c, uuid.Nil, nil)
}

// saveEmailSettings validates and stores c and records the change; by is the
// admin who saved it, or uuid.Nil for the command line, and version, when
// given, the version the settings must still be at, the zero time when there
// must be none yet.
func (s *Service) saveEmailSettings(ctx context.Context, c EmailSettingsChange, by uuid.UUID, version *time.Time) error {
	c.SenderAddress = strings.TrimSpace(c.SenderAddress)
	c.SMTPHost = strings.TrimSpace(c.SMTPHost)

	if c.SMTPSecurity == "" {
		c.SMTPSecurity = SMTPSecuritySTARTTLS
	}

	return pgx.BeginFunc(ctx, s.pool, func(tx pgx.Tx) error {
		q := s.queries.WithTx(tx)

		current, err := q.LockEmailSettings(ctx)

		switch {
		case errors.Is(err, pgx.ErrNoRows):
			if version != nil && !version.IsZero() {
				return platform.ErrChangedSinceRead // nothing was there to read
			}
		case err != nil:
			return fmt.Errorf("reading the email settings: %w", err)
		case version != nil && (version.IsZero() || !platform.SameVersion(current.UpdatedAt, *version)):
			return platform.ErrChangedSinceRead
		}

		params := db.PutEmailSettingsParams{
			Provider:      string(c.Provider),
			SenderAddress: c.SenderAddress,
			SenderName:    strings.TrimSpace(c.SenderName),
			SmtpHost:      c.SMTPHost,
			SmtpPort:      int32(c.SMTPPort), //nolint:gosec // validated to 1..65535 below
			SmtpSecurity:  string(c.SMTPSecurity),
			SmtpUsername:  strings.TrimSpace(c.SMTPUsername),
			UpdatedBy:     uuid.NullUUID{UUID: by, Valid: by != uuid.Nil},
		}

		if err := s.setSecrets(&params, current, c); err != nil {
			return err
		}

		if err := validateSettings(params); err != nil {
			return err
		}

		changed := changedEmailSettings(current, params, c)
		if len(changed) == 0 {
			return nil
		}

		if err := q.PutEmailSettings(ctx, params); err != nil {
			return fmt.Errorf("saving the email settings: %w", err)
		}

		return s.trail.Record(ctx, tx,
			audit.Resource{Type: audit.ResourceEmailSettings, ID: audit.SingletonID},
			audit.EmailSettingsChanged{Provider: params.Provider, Changes: changed})
	})
}

// changedEmailSettings names, as the API does, what next changes, with the
// values before and after. A secret is changed when a new one is given or the
// stored one is dropped; its value is never compared, since sealing it again
// gives other bytes, and never kept. Nor is the SMTP user, which may be a
// person's address.
func changedEmailSettings(current db.NotificationEmailSetting, next db.PutEmailSettingsParams, c EmailSettingsChange) []audit.Change {
	var changed []audit.Change

	for _, f := range []struct {
		name     string
		was, now string
	}{
		{"provider", current.Provider, next.Provider},
		{"senderAddress", current.SenderAddress, next.SenderAddress},
		{"senderName", current.SenderName, next.SenderName},
		{"smtpHost", current.SmtpHost, next.SmtpHost},
		{"smtpPort", strconv.Itoa(int(current.SmtpPort)), strconv.Itoa(int(next.SmtpPort))},
		{"smtpSecurity", current.SmtpSecurity, next.SmtpSecurity},
	} {
		if f.was != f.now {
			changed = append(changed, audit.ChangedFromTo(f.name, f.was, f.now))
		}
	}

	for _, f := range []struct {
		name string
		same bool
	}{
		{"smtpUsername", current.SmtpUsername == next.SmtpUsername},
		{"smtpPassword", c.SMTPPassword == "" && (current.SmtpPasswordSealed == nil) == (next.SmtpPasswordSealed == nil)},
		{"brevoApiKey", c.BrevoAPIKey == ""},
	} {
		if !f.same {
			changed = append(changed, audit.Changed(f.name))
		}
	}

	return changed
}

// setSecrets seals the secrets of c, or keeps the stored ones. A stored
// password goes only to the server it was entered for: a change of server,
// port, security or user drops it unless a new one comes with the change, so
// a stolen admin session cannot point the password at a server of its own.
// Brevo's key needs no such rule: its address is fixed in the code.
func (s *Service) setSecrets(p *db.PutEmailSettingsParams, current db.NotificationEmailSetting, c EmailSettingsChange) error {
	var err error

	sameServer := current.SmtpHost == p.SmtpHost && current.SmtpPort == p.SmtpPort &&
		current.SmtpSecurity == p.SmtpSecurity && current.SmtpUsername == p.SmtpUsername

	switch {
	case c.SMTPPassword != "":
		if p.SmtpPasswordSealed, err = s.seal("smtp_password", c.SMTPPassword); err != nil {
			return err
		}
	case sameServer:
		p.SmtpPasswordSealed = current.SmtpPasswordSealed
	}

	p.BrevoApiKeySealed = current.BrevoApiKeySealed
	if c.BrevoAPIKey != "" {
		if p.BrevoApiKeySealed, err = s.seal("brevo_api_key", c.BrevoAPIKey); err != nil {
			return err
		}
	}

	return nil
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
			problems = append(problems, "an SMTP user needs a password, entered again when the server, port, security or user changes")
		}

		if p.SmtpUsername != "" && SMTPSecurity(p.SmtpSecurity) == SMTPSecurityNone {
			problems = append(problems, "a password is never sent without TLS")
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

// SendTestEmail sends one email to the admin of ctx through the settings
// saved, so the admin sees they work. It answers ErrEmailNotConfigured or
// ErrEmailUnavailable as SendEmail does.
func (s *Service) SendTestEmail(ctx context.Context) error {
	caller, err := platform.RequireAdmin(ctx)
	if err != nil {
		return err
	}

	return s.SendEmail(ctx, Email{
		Kind:    "settings-test",
		To:      caller.Label,
		Subject: "Second Bite: email thử / test email",
		Text: "Cấu hình gửi email của Second Bite đang hoạt động.\n\n" +
			"Second Bite's email settings work.",
		HTML: "<p>Cấu hình gửi email của Second Bite đang hoạt động.</p><p>Second Bite's email settings work.</p>",
	})
}
