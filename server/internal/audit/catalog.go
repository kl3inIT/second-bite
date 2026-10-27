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

// Change is one setting changed, named as the API names it, with its value
// before and after. A secret, or a value that may name a person, has neither:
// only that it changed is kept.
type Change struct {
	Field string  `json:"field"`
	From  *string `json:"from,omitempty"`
	To    *string `json:"to,omitempty"`
}

// ChangedFromTo is a change whose values may be kept.
func ChangedFromTo(field, from, to string) Change {
	return Change{Field: field, From: &from, To: &to}
}

// Changed is a change kept without its values.
func Changed(field string) Change {
	return Change{Field: field}
}

// OfferSettingsChanged is a change of the rules every offer follows.
type OfferSettingsChanged struct {
	Changes []Change `json:"changes"`
}

func (OfferSettingsChanged) action() string { return "offer_settings.change" }

// EmailSettingsChanged is a change of who delivers email. A password, a key
// and the SMTP user are kept without their values.
type EmailSettingsChanged struct {
	Provider string   `json:"provider"`
	Changes  []Change `json:"changes"`
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

// SellerApproved is a pending or rejected seller let publish.
type SellerApproved struct{}

func (SellerApproved) action() string { return "seller.approve" }

// SellerRejected is a pending seller refused, with what the owner is told.
type SellerRejected struct {
	Reason string `json:"reason"`
}

func (SellerRejected) action() string { return "seller.reject" }

// SellerBlocked is an active seller stopped, with what the owner is told.
type SellerBlocked struct {
	Reason string `json:"reason"`
}

func (SellerBlocked) action() string { return "seller.block" }

// SellerUnblocked is a blocked seller let publish again.
type SellerUnblocked struct{}

func (SellerUnblocked) action() string { return "seller.unblock" }

// SellerOwnerChanged is a seller handed to another owner, by account: the
// previous owner, when there was one, stays on as staff (SEC-162).
type SellerOwnerChanged struct {
	From string `json:"from,omitempty"`
	To   string `json:"to"`
}

func (SellerOwnerChanged) action() string { return "seller.change_owner" }

// ReviewHidden is a customer's review of an order hidden from every read but
// the admins', with the admin's reason when they gave one.
type ReviewHidden struct {
	Reason string `json:"reason,omitempty"`
}

func (ReviewHidden) action() string { return "review.hide" }

// ReviewShown is a hidden review shown again.
type ReviewShown struct{}

func (ReviewShown) action() string { return "review.show" }

// catalog is every action above; a type added there is added here, which
// gives the names admins filter by.
var catalog = []Action{
	OfferSettingsChanged{},
	EmailSettingsChanged{},
	AdminGranted{},
	AdminRevoked{},
	SellerApproved{},
	SellerRejected{},
	SellerBlocked{},
	SellerUnblocked{},
	SellerOwnerChanged{},
	ReviewHidden{},
	ReviewShown{},
}

// ActionNames are the names of the catalog, as events record them.
func ActionNames() []string {
	names := make([]string, 0, len(catalog))
	for _, a := range catalog {
		names = append(names, a.action())
	}

	return names
}
