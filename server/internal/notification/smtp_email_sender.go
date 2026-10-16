package notification

import (
	"context"
	"errors"
	"strings"

	gomail "github.com/wneessen/go-mail"
)

// smtpEmailSender delivers email to an SMTP server: Mailpit in development,
// any SMTP relay elsewhere.
type smtpEmailSender struct{}

// Send implements emailSender.
func (smtpEmailSender) Send(ctx context.Context, cfg providerConfig, e Email) (string, error) {
	opts := []gomail.Option{gomail.WithPort(cfg.smtpPort), gomail.WithTimeout(sendTimeout)}

	switch cfg.smtpSecurity {
	case SMTPSecurityTLS:
		opts = append(opts, gomail.WithSSL())
	case SMTPSecurityNone:
		opts = append(opts, gomail.WithTLSPolicy(gomail.NoTLS))
	case SMTPSecuritySTARTTLS:
		opts = append(opts, gomail.WithTLSPolicy(gomail.TLSMandatory))
	}

	if cfg.smtpUsername != "" {
		opts = append(opts,
			gomail.WithSMTPAuth(gomail.SMTPAuthPlain),
			gomail.WithUsername(cfg.smtpUsername),
			gomail.WithPassword(cfg.smtpPassword),
		)
	}

	client, err := gomail.NewClient(cfg.smtpHost, opts...)
	if err != nil {
		return "", &sendError{outcome: sendRefused, cause: err}
	}

	msg := gomail.NewMsg()
	if err := msg.FromFormat(cfg.senderName, cfg.senderAddress); err != nil {
		return "", &sendError{outcome: sendRefused, cause: err}
	}

	if err := msg.To(e.To); err != nil {
		return "", &sendError{outcome: sendRefused, cause: err}
	}

	msg.Subject(e.Subject)
	msg.SetBodyString(gomail.TypeTextPlain, e.Text)

	if e.HTML != "" {
		msg.AddAlternativeString(gomail.TypeTextHTML, e.HTML)
	}

	msg.SetMessageID()

	if err := client.DialAndSendWithContext(ctx, msg); err != nil {
		if se, ok := errors.AsType[*gomail.SendError](err); ok && !se.IsTemp() {
			return "", &sendError{outcome: sendRefused, cause: errors.New("the SMTP server refused the message")}
		}

		return "", &sendError{outcome: sendUnavailable, cause: errors.New("the SMTP server could not be reached or failed")}
	}

	return strings.Trim(msg.GetMessageID(), "<>"), nil
}
