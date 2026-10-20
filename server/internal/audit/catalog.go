package audit

// The catalog of what admins do. Each type is one action; its fields are the
// event's details. A name, once recorded, never changes meaning.

// The resource types of the catalog. A setting kept in one row has the
// identifier SingletonID.
const (
	ResourceOfferSettings = "offer_settings"
	ResourceEmailSettings = "email_settings"
	SingletonID           = "current"
)

// OfferSettingsChanged is a change of the rules every offer follows.
type OfferSettingsChanged struct {
	// Fields name the settings that changed, as the API names them.
	Fields []string `json:"fields"`
}

func (OfferSettingsChanged) action() string { return "offer_settings.change" }

// EmailSettingsChanged is a change of who delivers email. It names what
// changed, never a value: a password or a key is a secret.
type EmailSettingsChanged struct {
	Provider string   `json:"provider"`
	Fields   []string `json:"fields"`
}

func (EmailSettingsChanged) action() string { return "email_settings.change" }

// Where a change of who is an admin came from.
const (
	SourceAdmin       = "admin"
	SourceCommandLine = "command_line"
)

// AdminGranted is an account made an admin.
type AdminGranted struct {
	Source string `json:"source"`
}

func (AdminGranted) action() string { return "admin.grant" }

// AdminRevoked is an admin made a customer again.
type AdminRevoked struct {
	Source string `json:"source"`
}

func (AdminRevoked) action() string { return "admin.revoke" }
