package notification

import (
	"context"
	"net/http"
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
	Body emailSettingsBody
}

type saveEmailSettingsInput struct {
	Body struct {
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

// RegisterOperations adds the module's operations to api.
func RegisterOperations(api huma.API, s *Service) {
	security := platform.SignedIn()

	huma.Register(api, huma.Operation{
		OperationID: "getEmailSettings",
		Method:      http.MethodGet,
		Path:        "/admin/email-settings",
		Summary:     "Read who delivers email",
		Tags:        []string{"Admins"},
		Security:    security,
	}, func(ctx context.Context, _ *struct{}) (*emailSettingsOutput, error) {
		if _, err := platform.RequireAdmin(ctx); err != nil {
			return nil, err
		}

		settings, err := s.EmailSettings(ctx)
		if err != nil {
			return nil, err
		}

		return &emailSettingsOutput{Body: emailSettingsBody{
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

	huma.Register(api, huma.Operation{
		OperationID:   "saveEmailSettings",
		Method:        http.MethodPut,
		Path:          "/admin/email-settings",
		Summary:       "Choose who delivers email; the next email uses it",
		Tags:          []string{"Admins"},
		Security:      security,
		DefaultStatus: http.StatusNoContent,
	}, func(ctx context.Context, in *saveEmailSettingsInput) (*struct{}, error) {
		caller, err := platform.RequireAdmin(ctx)
		if err != nil {
			return nil, err
		}

		b := in.Body

		return nil, s.SaveEmailSettings(ctx, EmailSettingsChange{
			Provider: b.Provider, SenderAddress: b.SenderAddress, SenderName: b.SenderName,
			SMTPHost: b.SMTPHost, SMTPPort: b.SMTPPort, SMTPSecurity: b.SMTPSecurity,
			SMTPUsername: b.SMTPUsername, SMTPPassword: b.SMTPPassword, BrevoAPIKey: b.BrevoAPIKey,
		}, caller.AccountID)
	})
}
