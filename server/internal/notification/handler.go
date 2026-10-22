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

type pushKeyOutput struct {
	Body struct {
		PublicKey string `json:"publicKey" doc:"The VAPID public key, in base64url, for PushManager.subscribe's applicationServerKey"`
	}
}

type pushSubscriptionBody struct {
	Endpoint string `json:"endpoint" format:"uri" maxLength:"2048" doc:"The push service's address for this browser"`
	Keys     struct {
		P256dh string `json:"p256dh" maxLength:"255" minLength:"1"`
		Auth   string `json:"auth"   maxLength:"255" minLength:"1"`
	} `json:"keys"`
}

type subscribePushInput struct {
	Body struct {
		pushSubscriptionBody
		Tickets []string `json:"tickets" maxItems:"20" minItems:"1" doc:"Live tickets, one per topic to follow: an order's (POST /orders/{id}/live-ticket) or a seller's"`
	}
}

type unsubscribePushInput struct {
	Body struct {
		Endpoint string `json:"endpoint" format:"uri" maxLength:"2048"`
	}
}

var tagNotifications = []string{"Notifications"}

// RegisterOperations adds the module's Web Push operations to api. redeem is
// the live socket's ticket redemption, which proves the topics a browser may
// follow.
func RegisterOperations(api huma.API, s *Service, redeem platform.RedeemTicket) {
	huma.Register(api, huma.Operation{
		OperationID: "getPushKey",
		Tags:        tagNotifications,
		Method:      http.MethodGet,
		Path:        "/push/key",
		Summary:     "Read the key a browser subscribes to Web Push with",
		Description: "503 NOTIFICATION_PUSH_NOT_CONFIGURED while Web Push is off; the page then offers no notifications.",
	}, func(context.Context, *struct{}) (*pushKeyOutput, error) {
		key, err := s.PushKey()
		if err != nil {
			return nil, err
		}

		out := &pushKeyOutput{}
		out.Body.PublicKey = key

		return out, nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "subscribePush",
		Tags:        tagNotifications,
		Method:      http.MethodPost,
		Path:        "/push/subscriptions",
		Summary:     "Follow orders by Web Push in this browser",
		Description: "Keeps the browser's subscription, in the language of Accept-Language, following the topic each " +
			"live ticket proves for seven days. Subscribing again renews them. Each ticket is spent as the live socket " +
			"spends it; a ticket spent or expired answers NOTIFICATION_PUSH_TICKET_INVALID.",
		DefaultStatus: http.StatusNoContent,
	}, func(ctx context.Context, in *subscribePushInput) (*struct{}, error) {
		b := in.Body

		return nil, s.Subscribe(ctx, Subscription{Endpoint: b.Endpoint, P256dh: b.Keys.P256dh, Auth: b.Keys.Auth}, b.Tickets, redeem)
	})

	huma.Register(api, huma.Operation{
		OperationID:   "unsubscribePush",
		Tags:          tagNotifications,
		Method:        http.MethodPost,
		Path:          "/push/subscriptions/remove",
		Summary:       "Stop Web Push to this browser",
		Description:   "Forgets the subscription and every topic it follows; one not kept changes nothing.",
		DefaultStatus: http.StatusNoContent,
	}, func(ctx context.Context, in *unsubscribePushInput) (*struct{}, error) {
		return nil, s.Unsubscribe(ctx, in.Body.Endpoint)
	})
}
