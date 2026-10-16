package notification

import (
	"context"
	"errors"
	"fmt"
	"slices"
	"time"
)

// EmailProvider names who delivers email. It is stored in the settings, so
// the family is closed: a provider is added to this list and to the registry.
type EmailProvider string

// The providers admins can choose.
const (
	EmailProviderSMTP  EmailProvider = "smtp"
	EmailProviderBrevo EmailProvider = "brevo"
)

var emailProviders = []EmailProvider{EmailProviderSMTP, EmailProviderBrevo}

// SMTPSecurity is how an SMTP connection is protected.
type SMTPSecurity string

// The SMTP connection security choices.
const (
	SMTPSecuritySTARTTLS SMTPSecurity = "starttls"
	SMTPSecurityTLS      SMTPSecurity = "tls"
	SMTPSecurityNone     SMTPSecurity = "none"
)

// providerConfig is what a provider needs for one send, its secrets unsealed.
type providerConfig struct {
	senderAddress string
	senderName    string
	smtpHost      string
	smtpPort      int
	smtpSecurity  SMTPSecurity
	smtpUsername  string
	smtpPassword  string
	brevoAPIKey   string
}

// emailSender delivers one email through one provider and returns the
// identifier the provider gave it. It answers a *sendError.
type emailSender interface {
	Send(ctx context.Context, cfg providerConfig, e Email) (providerMessageID string, err error)
}

// sendOutcome classifies a failed send by what can be done about it.
type sendOutcome int

const (
	// sendRefused: the provider refused the request or the address; trying
	// again does not help.
	sendRefused sendOutcome = iota + 1
	// sendRateLimited: the provider asks to wait.
	sendRateLimited
	// sendUnavailable: the network or the provider failed.
	sendUnavailable
)

// sendError is a provider's failure. Its cause is for logs only and never
// carries the provider's own error text.
type sendError struct {
	outcome    sendOutcome
	retryAfter time.Duration
	cause      error
}

func (e *sendError) Error() string {
	return fmt.Sprintf("send failed (outcome %d): %v", e.outcome, e.cause)
}

func (e *sendError) Unwrap() error { return e.cause }

// emailSenders is the registry of providers, built once when the service is
// assembled.
type emailSenders map[EmailProvider]emailSender

// newEmailSenders checks that every provider has exactly one implementation.
func newEmailSenders(senders map[EmailProvider]emailSender) (emailSenders, error) {
	var errs []error

	for _, p := range emailProviders {
		if senders[p] == nil {
			errs = append(errs, fmt.Errorf("email provider %q has no implementation", p))
		}
	}

	for p := range senders {
		if !slices.Contains(emailProviders, p) {
			errs = append(errs, fmt.Errorf("email provider %q is not a known provider", p))
		}
	}

	return emailSenders(senders), errors.Join(errs...)
}
