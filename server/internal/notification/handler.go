package notification

import (
	"context"
	"net/http"
	"strings"
	"time"

	"github.com/danielgtaylor/huma/v2"

	"github.com/kl3inIT/second-bite/server/internal/platform"
)

type emailSettingsBody struct {
	Provider        EmailProvider `json:"provider"        enum:"smtp,brevo"`
	SenderAddress   string        `json:"senderAddress"   format:"email" maxLength:"254"`
	SenderName      string        `json:"senderName"      maxLength:"100"`
	SMTPHost        string        `json:"smtpHost"        maxLength:"253"`
	SMTPPort        int           `json:"smtpPort"        maximum:"65535" minimum:"0"`
	SMTPSecurity    SMTPSecurity  `json:"smtpSecurity"    enum:"starttls,tls,none"`
	SMTPUsername    string        `json:"smtpUsername"    maxLength:"254"`
	SMTPPasswordSet bool          `json:"smtpPasswordSet" doc:"Whether an SMTP password is stored; it is never returned"`
	BrevoAPIKeySet  bool          `json:"brevoApiKeySet"  doc:"Whether a Brevo API key is stored; it is never returned"`
	UpdatedAt       time.Time     `json:"updatedAt"`
}

type emailSettingsOutput struct {
	ETag string `header:"ETag" doc:"The settings' version, sent back in If-Match to save them"`
	Body emailSettingsBody
}

type saveEmailSettingsInput struct {
	IfMatch     string `header:"If-Match"      doc:"The ETag of the settings read"`
	IfNoneMatch string `header:"If-None-Match" doc:"* to save the first settings, when none were read"`
	Body        struct {
		Provider      EmailProvider `json:"provider"               enum:"smtp,brevo"`
		SenderAddress string        `json:"senderAddress"          format:"email" maxLength:"254"`
		SenderName    string        `json:"senderName"             maxLength:"100" minLength:"1"`
		SMTPHost      string        `json:"smtpHost,omitempty"     maxLength:"253"`
		SMTPPort      int           `json:"smtpPort,omitempty"     maximum:"65535" minimum:"0"`
		SMTPSecurity  SMTPSecurity  `json:"smtpSecurity,omitempty" enum:"starttls,tls,none"`
		SMTPUsername  string        `json:"smtpUsername,omitempty" maxLength:"254"`
		SMTPPassword  string        `json:"smtpPassword,omitempty" doc:"Empty keeps the stored password" maxLength:"1024"`
		BrevoAPIKey   string        `json:"brevoApiKey,omitempty"  doc:"Empty keeps the stored key"      maxLength:"1024"`
	}
}

// sendTestEmailInput names who receives the test email; without a body, or
// without to, it is the admin sending it.
type sendTestEmailInput struct {
	Body *struct {
		To string `json:"to,omitempty" format:"email" maxLength:"254" doc:"Who receives it; the admin sending it when empty"`
	} `required:"false"`
}

// RegisterAdminOperations adds the module's admin operations to admin, the
// group platform.NewAdminGroup returns; their paths omit its prefix.
func RegisterAdminOperations(admin huma.API, s *Service) {
	huma.Register(admin, huma.Operation{
		OperationID: "getEmailSettings",
		Method:      http.MethodGet,
		Path:        "/email-settings",
		Summary:     "Read who delivers email",
	}, func(ctx context.Context, _ *struct{}) (*emailSettingsOutput, error) {
		settings, err := s.EmailSettings(ctx)
		if err != nil {
			return nil, err
		}

		return &emailSettingsOutput{ETag: platform.ETag(settings.UpdatedAt), Body: emailSettingsBody{
			Provider:        settings.Provider,
			SenderAddress:   settings.SenderAddress,
			SenderName:      settings.SenderName,
			SMTPHost:        settings.SMTPHost,
			SMTPPort:        settings.SMTPPort,
			SMTPSecurity:    settings.SMTPSecurity,
			SMTPUsername:    settings.SMTPUsername,
			SMTPPasswordSet: settings.SMTPPasswordSet,
			BrevoAPIKeySet:  settings.BrevoAPIKeySet,
			UpdatedAt:       settings.UpdatedAt,
		}}, nil
	})

	huma.Register(admin, huma.Operation{
		OperationID: "saveEmailSettings",
		Method:      http.MethodPut,
		Path:        "/email-settings",
		Summary:     "Choose who delivers email; the next email uses it",
		Description: "If-Match carries the ETag read, or If-None-Match: * saves the first settings; when someone saved " +
			"since, the answer is 412 and nothing changes. Without either the answer is 400.",
		DefaultStatus: http.StatusNoContent,
	}, func(ctx context.Context, in *saveEmailSettingsInput) (*struct{}, error) {
		b := in.Body
		c := EmailSettingsChange{
			Provider: b.Provider, SenderAddress: b.SenderAddress, SenderName: b.SenderName,
			SMTPHost: b.SMTPHost, SMTPPort: b.SMTPPort, SMTPSecurity: b.SMTPSecurity,
			SMTPUsername: b.SMTPUsername, SMTPPassword: b.SMTPPassword, BrevoAPIKey: b.BrevoAPIKey,
		}

		switch {
		case in.IfMatch != "":
			version, ok := platform.VersionOf(in.IfMatch)
			if !ok {
				return nil, platform.ErrChangedSinceRead
			}

			return nil, s.SaveEmailSettings(ctx, c, version)
		case strings.TrimSpace(in.IfNoneMatch) == "*":
			return nil, s.CreateEmailSettings(ctx, c)
		default:
			return nil, platform.ErrVersionRequired
		}
	})

	huma.Register(admin, huma.Operation{
		OperationID:   "sendTestEmail",
		Method:        http.MethodPost,
		Path:          "/email-settings/test",
		Summary:       "Send one email through the settings saved, to an address or to oneself",
		DefaultStatus: http.StatusNoContent,
	}, func(ctx context.Context, in *sendTestEmailInput) (*struct{}, error) {
		var to string
		if in.Body != nil {
			to = in.Body.To
		}

		return nil, s.SendTestEmail(ctx, to)
	})
}
