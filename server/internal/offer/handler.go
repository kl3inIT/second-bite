package offer

import (
	"context"
	"net/http"
	"time"

	"github.com/danielgtaylor/huma/v2"
	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/file"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

type offerDetailsBody struct {
	Name        string `json:"name"                  maxLength:"80"  minLength:"1"`
	Description string `json:"description,omitempty" doc:"Required for a mixed_box, which is described by what it may hold; allergens are written here" maxLength:"1000"`
	Kind        Kind   `json:"kind"                  enum:"bakery,prepared_food,ingredients,drinks,mixed_box,other"`
	Unit        string `json:"unit,omitempty"        doc:"What one unit is called; \"suất\" when empty" maxLength:"20"`
	Units       int    `json:"units"                 maximum:"999"   minimum:"1"`
	PriceVND    int64  `json:"priceVnd"              doc:"Price of one unit, in whole đồng" minimum:"1000"`
	// OriginalPriceVND is checked against the minimum discount in the
	// settings, which may change, so only its floor is in the contract.
	OriginalPriceVND int64       `json:"originalPriceVnd"      doc:"What one unit normally sells for; the price must be the minimum discount below it" minimum:"1001"`
	WeightGrams      *int        `json:"weightGrams,omitempty" doc:"Weight of one unit, to measure food saved" maximum:"100000" minimum:"1"`
	PhotoID          uuid.UUID   `json:"photoId"               doc:"The cover: from POST /photos, or the photo of an earlier offer of the seller"`
	MorePhotoIDs     []uuid.UUID `json:"morePhotoIds,omitempty" doc:"Up to two more photos after the cover" maxItems:"2" nullable:"false"`
	WindowStart      time.Time   `json:"windowStart"           doc:"When the offer is ready to collect"`
	WindowEnd        time.Time   `json:"windowEnd"             doc:"The last handover"`
}

func (b offerDetailsBody) details() Details {
	return Details(b)
}

type offerChangeBody struct {
	Name             *string      `json:"name,omitempty"             maxLength:"80"  minLength:"1"`
	Description      *string      `json:"description,omitempty"      maxLength:"1000"`
	Kind             *Kind        `json:"kind,omitempty"             enum:"bakery,prepared_food,ingredients,drinks,mixed_box,other"`
	Unit             *string      `json:"unit,omitempty"             maxLength:"20"`
	Units            *int         `json:"units,omitempty"            maximum:"999"   minimum:"1"`
	PriceVND         *int64       `json:"priceVnd,omitempty"         minimum:"1000"`
	OriginalPriceVND *int64       `json:"originalPriceVnd,omitempty" minimum:"1001"`
	WeightGrams      *int         `json:"weightGrams,omitempty"      maximum:"100000" minimum:"1"`
	PhotoID          *uuid.UUID   `json:"photoId,omitempty"`
	MorePhotoIDs     *[]uuid.UUID `json:"morePhotoIds,omitempty" doc:"Replaces the photos after the cover; at most two" maxItems:"2"`
	WindowStart      *time.Time   `json:"windowStart,omitempty"`
	WindowEnd        *time.Time   `json:"windowEnd,omitempty"`
}

func (b offerChangeBody) change() Change { return Change(b) }

type offerPhotoBody struct {
	ID        uuid.UUID `json:"id"`
	LargePath string    `json:"largePath"`
	SmallPath string    `json:"smallPath"`
}

type collectionPointBody struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	Address   string  `json:"address"`
}

type offerBody struct {
	ID               uuid.UUID           `json:"id"`
	SellerID         uuid.UUID           `json:"sellerId"`
	Status           Status              `json:"status"                doc:"sold_out and closed are read from the units left and the window" enum:"on_sale,sold_out,closed,withdrawn"`
	Name             string              `json:"name"`
	Description      string              `json:"description"`
	Kind             Kind                `json:"kind"                  enum:"bakery,prepared_food,ingredients,drinks,mixed_box,other"`
	Unit             string              `json:"unit"`
	Units            int                 `json:"units"`
	UnitsLeft        int                 `json:"unitsLeft"`
	PriceVND         int64               `json:"priceVnd"`
	OriginalPriceVND int64               `json:"originalPriceVnd"`
	DiscountPercent  int                 `json:"discountPercent"`
	WeightGrams      *int                `json:"weightGrams,omitempty"`
	Photo            offerPhotoBody      `json:"photo"                 doc:"The cover, which lists and orders show"`
	Photos           []offerPhotoBody    `json:"photos"                doc:"Every photo, the cover first" nullable:"false"`
	WindowStart      time.Time           `json:"windowStart"`
	WindowEnd        time.Time           `json:"windowEnd"`
	CollectionPoint  collectionPointBody `json:"collectionPoint"       doc:"Where the offer is collected, copied from the seller when it was posted"`
	CreatedAt        time.Time           `json:"createdAt"`
	UpdatedAt        time.Time           `json:"updatedAt"`
	WithdrawnAt      *time.Time          `json:"withdrawnAt,omitempty"`
}

func toBody(o Offer) offerBody {
	return offerBody{
		ID: o.ID, SellerID: o.SellerID, Status: o.Status, Name: o.Name, Description: o.Description, Kind: o.Kind,
		Unit: o.Unit, Units: o.Units, UnitsLeft: o.UnitsLeft, PriceVND: o.PriceVND, OriginalPriceVND: o.OriginalPriceVND,
		DiscountPercent: o.DiscountPercent, WeightGrams: o.WeightGrams,
		Photo: offerPhotoBody{
			ID: o.PhotoID, LargePath: file.Path(o.PhotoID, file.SizeLarge), SmallPath: file.Path(o.PhotoID, file.SizeSmall),
		},
		Photos:      photosOf(o.PhotoID, o.MorePhotoIDs),
		WindowStart: o.WindowStart, WindowEnd: o.WindowEnd,
		CollectionPoint: collectionPointBody{
			Latitude: o.CollectionPoint.Latitude, Longitude: o.CollectionPoint.Longitude, Address: o.CollectionPoint.Address,
		},
		CreatedAt: o.CreatedAt, UpdatedAt: o.UpdatedAt, WithdrawnAt: o.WithdrawnAt,
	}
}

type offerOutput struct {
	Body offerBody
}

// adminOfferBody is an offer as admins list it, with its seller's name.
type adminOfferBody struct {
	Offer      offerBody `json:"offer"`
	SellerName string    `json:"sellerName" doc:"Copied from the seller when the offer was posted"`
}

type offerCountsBody struct {
	OnSale    int `json:"onSale"`
	SoldOut   int `json:"soldOut"`
	Closed    int `json:"closed"`
	Withdrawn int `json:"withdrawn"`
}

type adminOffersOutput struct {
	Body struct {
		Items    []adminOfferBody `json:"items"    nullable:"false"`
		Page     int              `json:"page"`
		PageSize int              `json:"pageSize"`
		Total    int              `json:"total"`
		Counts   offerCountsBody  `json:"counts"   doc:"Offers of each status matching the other filters, whatever status asks"`
	}
}

type offerPath struct {
	OfferID uuid.UUID `path:"offerId"`
}

type offerSettingsBody struct {
	MinDiscountPercent int        `json:"minDiscountPercent" doc:"How far below its original price an offer must be priced" maximum:"90" minimum:"0"`
	DefaultRadiusKm    int        `json:"defaultRadiusKm"    doc:"The search radius when a customer names none"   maximum:"100" minimum:"1"`
	MaxRadiusKm        int        `json:"maxRadiusKm"        maximum:"100"                                         minimum:"1"`
	WindowMinMinutes   int        `json:"windowMinMinutes"   doc:"The shortest collection window"                  maximum:"1440" minimum:"15"`
	WindowMaxMinutes   int        `json:"windowMaxMinutes"   doc:"The longest collection window"                   maximum:"1440" minimum:"15"`
	StartsWithinHours  int        `json:"startsWithinHours"  doc:"How far ahead of posting a window may start"     maximum:"72"   minimum:"1"`
	UpdatedAt          *time.Time `json:"updatedAt,omitempty" readOnly:"true"`
	UpdatedBy          *uuid.UUID `json:"updatedBy,omitempty" readOnly:"true"`
}

func toOfferSettingsBody(s Settings) offerSettingsBody {
	return offerSettingsBody{
		MinDiscountPercent: s.MinDiscountPercent, DefaultRadiusKm: s.DefaultRadiusKm, MaxRadiusKm: s.MaxRadiusKm,
		WindowMinMinutes: int(s.WindowMin.Minutes()), WindowMaxMinutes: int(s.WindowMax.Minutes()),
		StartsWithinHours: int(s.StartsWithin.Hours()), UpdatedAt: &s.UpdatedAt, UpdatedBy: s.UpdatedBy,
	}
}

func (b offerSettingsBody) settings() Settings {
	return Settings{
		MinDiscountPercent: b.MinDiscountPercent, DefaultRadiusKm: b.DefaultRadiusKm, MaxRadiusKm: b.MaxRadiusKm,
		WindowMin: time.Duration(b.WindowMinMinutes) * time.Minute, WindowMax: time.Duration(b.WindowMaxMinutes) * time.Minute,
		StartsWithin: time.Duration(b.StartsWithinHours) * time.Hour,
	}
}

var (
	security = platform.SignedIn()
	// optional is for reads anyone may make; a signed-in caller may see more.
	optional  = platform.MaybeSignedIn()
	tagOffers = []string{"Offers"}
)

// RegisterOperations adds the module's operations to api.
func RegisterOperations(api huma.API, s *Service) {
	registerStaffOperations(api, s)
	registerReadOperations(api, s)
	registerCatalogOperations(api, s)
	registerSearchOperations(api, s)
}

func registerStaffOperations(api huma.API, s *Service) {
	huma.Register(api, huma.Operation{
		OperationID: "postOffer", Method: http.MethodPost, Path: "/sellers/{sellerId}/offers",
		Summary:     "Put surplus on sale for a seller you own or work for",
		Description: "Posting again: send the details of an earlier offer, its photo included, with new units and window.",
		Tags:        tagOffers, Security: security, DefaultStatus: http.StatusCreated,
	}, func(ctx context.Context, in *struct {
		SellerID uuid.UUID `path:"sellerId"`
		Body     offerDetailsBody
	},
	) (*offerOutput, error) {
		o, err := s.Post(ctx, in.SellerID, in.Body.details())
		if err != nil {
			return nil, err
		}

		return &offerOutput{Body: toBody(o)}, nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "changeOffer", Method: http.MethodPatch, Path: "/offers/{offerId}",
		Summary:     "Change an offer",
		Description: "Once units are ordered, only the description, the photo, the units (never below those ordered) and the collection window change; the orders still to collect follow the new window.",
		Tags:        tagOffers, Security: security,
	}, func(ctx context.Context, in *struct {
		OfferID uuid.UUID `path:"offerId"`
		Body    offerChangeBody
	},
	) (*offerOutput, error) {
		o, err := s.Change(ctx, in.OfferID, in.Body.change())
		if err != nil {
			return nil, err
		}

		return &offerOutput{Body: toBody(o)}, nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "withdrawOffer", Method: http.MethodPost, Path: "/offers/{offerId}/withdraw",
		Summary: "Take an offer off sale for good", Tags: tagOffers, Security: security,
	}, func(ctx context.Context, in *offerPath) (*offerOutput, error) {
		o, err := s.Withdraw(ctx, in.OfferID)
		if err != nil {
			return nil, err
		}

		return &offerOutput{Body: toBody(o)}, nil
	})

	type offersOutput struct {
		Body struct {
			Offers []offerBody `json:"offers" nullable:"false"`
		}
	}

	huma.Register(api, huma.Operation{
		OperationID: "listSellerOffers", Method: http.MethodGet, Path: "/sellers/{sellerId}/offers",
		Summary: "A seller's offers, newest first, to its people and admins", Tags: tagOffers, Security: security,
	}, func(ctx context.Context, in *struct {
		SellerID uuid.UUID `path:"sellerId"`
		Status   Status    `enum:"on_sale,sold_out,closed,withdrawn" query:"status"`
		Limit    int       `default:"20"                             maximum:"100" minimum:"1" query:"limit"`
		Offset   int       `default:"0"                              minimum:"0"   query:"offset"`
	},
	) (*offersOutput, error) {
		offers, err := s.OfSeller(ctx, in.SellerID, in.Status, in.Limit, in.Offset)
		if err != nil {
			return nil, err
		}

		out := &offersOutput{}
		out.Body.Offers = make([]offerBody, 0, len(offers))

		for _, o := range offers {
			out.Body.Offers = append(out.Body.Offers, toBody(o))
		}

		return out, nil
	})
}

func registerReadOperations(api huma.API, s *Service) {
	huma.Register(api, huma.Operation{
		OperationID: "getOffer", Method: http.MethodGet, Path: "/offers/{offerId}",
		Summary:     "An offer",
		Description: "Anyone reads an offer while its window is open and it is not withdrawn; its seller's people read it always.",
		Tags:        tagOffers, Security: optional,
	}, func(ctx context.Context, in *offerPath) (*offerOutput, error) {
		o, err := s.Get(ctx, in.OfferID)
		if err != nil {
			return nil, err
		}

		return &offerOutput{Body: toBody(o)}, nil
	})
}

// RegisterAdminOperations adds the module's admin operations to admin, the
// group platform.NewAdminGroup returns; their paths omit its prefix.
func RegisterAdminOperations(admin huma.API, s *Service) {
	huma.Register(admin, huma.Operation{
		OperationID: "listOffersForAdmins", Method: http.MethodGet, Path: "/offers",
		Summary: "Every seller's offers by status, words, seller and day posted, newest first",
		Description: "q matches the dish, the seller's name or the description, as customers search. " +
			"counts holds the offers of each status matching the other filters. A page past the end is empty.",
	}, func(ctx context.Context, in *struct {
		Status   Status    `query:"status"      doc:"Keep this status; every status when absent" enum:"on_sale,sold_out,closed,withdrawn"`
		Q        string    `query:"q"           doc:"Words of the dish, the seller's name or the description" maxLength:"100"`
		SellerID uuid.UUID `query:"sellerId"    doc:"Keep this seller's offers"`
		Page     int       `query:"page"        default:"1" minimum:"1"`
		Size     int       `query:"size"        default:"25" maximum:"100" minimum:"1"`

		PostedSince time.Time `query:"postedSince" doc:"Keep the offers posted at or after this time"`
		PostedUntil time.Time `query:"postedUntil" doc:"Keep the offers posted before this time"`
	},
	) (*adminOffersOutput, error) {
		f := AdminFilter{Status: in.Status, Query: in.Q, SellerID: in.SellerID, Page: in.Page, Size: in.Size}
		if !in.PostedSince.IsZero() {
			f.PostedSince = &in.PostedSince
		}

		if !in.PostedUntil.IsZero() {
			f.PostedUntil = &in.PostedUntil
		}

		page, err := s.ListForAdmins(ctx, f)
		if err != nil {
			return nil, err
		}

		out := &adminOffersOutput{}
		out.Body.Items = make([]adminOfferBody, 0, len(page.Offers))
		out.Body.Page, out.Body.PageSize, out.Body.Total = in.Page, in.Size, page.Total
		out.Body.Counts = offerCountsBody{
			OnSale: page.Counts[StatusOnSale], SoldOut: page.Counts[StatusSoldOut],
			Closed: page.Counts[StatusClosed], Withdrawn: page.Counts[StatusWithdrawn],
		}

		for _, l := range page.Offers {
			out.Body.Items = append(out.Body.Items, adminOfferBody{Offer: toBody(l.Offer), SellerName: l.SellerName})
		}

		return out, nil
	})

	huma.Register(admin, huma.Operation{
		OperationID: "getOfferSettings", Method: http.MethodGet, Path: "/offer-settings",
		Summary: "The rules every offer follows",
	}, func(ctx context.Context, _ *struct{}) (*offerSettingsOutput, error) {
		set, err := s.Settings(ctx)
		if err != nil {
			return nil, err
		}

		return toOfferSettingsOutput(set), nil
	})

	huma.Register(admin, huma.Operation{
		OperationID: "saveOfferSettings", Method: http.MethodPut, Path: "/offer-settings",
		Summary: "Change the rules every offer follows",
		Description: "New rules apply to offers posted, and to the prices and windows changed, after they are saved. " +
			"If-Match carries the ETag read; when someone saved since, the answer is 412 and nothing changes.",
	}, func(ctx context.Context, in *saveOfferSettingsInput) (*offerSettingsOutput, error) {
		version, ok := platform.VersionOf(in.IfMatch)
		if !ok {
			return nil, platform.ErrChangedSinceRead
		}

		set, err := s.SaveSettings(ctx, in.Body.settings(), version)
		if err != nil {
			return nil, err
		}

		return toOfferSettingsOutput(set), nil
	})
}

type offerSettingsOutput struct {
	ETag string `header:"ETag" doc:"The settings' version, sent back in If-Match to save them"`
	Body offerSettingsBody
}

type saveOfferSettingsInput struct {
	IfMatch string `header:"If-Match" doc:"The ETag of the settings read" required:"true"`
	Body    offerSettingsBody
}

func toOfferSettingsOutput(set Settings) *offerSettingsOutput {
	return &offerSettingsOutput{ETag: platform.ETag(set.UpdatedAt), Body: toOfferSettingsBody(set)}
}
