package order

import (
	"context"
	"net/http"
	"time"

	"github.com/danielgtaylor/huma/v2"
	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/file"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

type orderWantedBody struct {
	OfferID uuid.UUID `json:"offerId"`
	Units   int       `json:"units"   maximum:"999" minimum:"1"`
}

type placeOrderBody struct {
	CheckoutID uuid.UUID         `json:"checkoutId,omitempty" doc:"Shared by the orders placed together from one cart, one per seller; a new one when omitted" required:"false"`
	Lines      []orderWantedBody `json:"lines" doc:"One to ten different offers of one seller"                            maxItems:"10" minItems:"1"`
	Name       string            `json:"name"  doc:"The name the seller calls at the counter"                             maxLength:"50" minLength:"1"`
	Phone      string            `json:"phone" doc:"A Vietnamese phone number, 0 and nine digits; spaces, dots, dashes and +84 are accepted" maxLength:"20" minLength:"1"`
}

type orderLinePhotoBody struct {
	ID        uuid.UUID `json:"id"`
	LargePath string    `json:"largePath"`
	SmallPath string    `json:"smallPath"`
}

type orderLineBody struct {
	OfferID          uuid.UUID          `json:"offerId"`
	Name             string             `json:"name"`
	Unit             string             `json:"unit"`
	PriceVND         int64              `json:"priceVnd"`
	OriginalPriceVND int64              `json:"originalPriceVnd"`
	Units            int                `json:"units"`
	Photo            orderLinePhotoBody `json:"photo"`
}

type orderSellerBody struct {
	ID        uuid.UUID `json:"id"`
	Name      string    `json:"name"`
	Address   string    `json:"address"`
	Latitude  float64   `json:"latitude"`
	Longitude float64   `json:"longitude"`
}

type reviewBody struct {
	Stars     int       `json:"stars"`
	Tags      []Tag     `json:"tags"      nullable:"false"`
	Comment   string    `json:"comment,omitempty"`
	CreatedAt time.Time `json:"createdAt"`
}

type orderBody struct {
	ID            uuid.UUID       `json:"id"`
	Number        string          `json:"number"                 doc:"What people read aloud, SB- and a number"`
	Status        Status          `json:"status"                 doc:"expired is read from the window's end" enum:"confirmed,ready,collected,cancelled,refused,expired"`
	Seller        orderSellerBody `json:"seller"                 doc:"Where the order is collected, copied when it was placed"`
	Lines         []orderLineBody `json:"lines"                  nullable:"false"`
	TotalVND      int64           `json:"totalVnd"               doc:"Paid to the seller at the counter"`
	WindowStart   time.Time       `json:"windowStart"`
	WindowEnd     time.Time       `json:"windowEnd"`
	CreatedAt     time.Time       `json:"createdAt"`
	ReadyAt       *time.Time      `json:"readyAt,omitempty"`
	CollectedAt   *time.Time      `json:"collectedAt,omitempty"`
	CancelledAt   *time.Time      `json:"cancelledAt,omitempty"`
	RefusedAt     *time.Time      `json:"refusedAt,omitempty"`
	CancelReason  string          `json:"cancelReason,omitempty"`
	RefuseReason  RefuseReason    `json:"refuseReason,omitempty" enum:"not_suitable,wrong_items,no_answer,no_show,late,sold_out,other,withdrawn"`
	RefuseNote    string          `json:"refuseNote,omitempty"`
	CheckoutID    uuid.UUID       `json:"checkoutId"             doc:"Shared by the orders placed together from one cart"`
	CustomerName  string          `json:"customerName"           doc:"Who collects, as given with the order"`
	CustomerPhone string          `json:"customerPhone"          doc:"Their phone number, 0 and nine digits"`
	Review        *reviewBody     `json:"review,omitempty"       doc:"The customer's rating of the collected order; none until they rate it"`
	Access        string          `json:"access,omitempty"       doc:"To its customer: proves the order is theirs without signing in, sent back as Order-Access"`
}

func toBody(o Order) orderBody {
	var review *reviewBody
	if o.Review != nil {
		review = &reviewBody{Stars: o.Review.Stars, Tags: o.Review.Tags, Comment: o.Review.Comment, CreatedAt: o.Review.CreatedAt}
	}

	lines := make([]orderLineBody, 0, len(o.Lines))
	for _, l := range o.Lines {
		lines = append(lines, orderLineBody{
			OfferID: l.OfferID, Name: l.Name, Unit: l.Unit, PriceVND: l.PriceVND, OriginalPriceVND: l.OriginalPriceVND,
			Units: l.Units,
			Photo: orderLinePhotoBody{ID: l.PhotoID, LargePath: file.Path(l.PhotoID, file.SizeLarge), SmallPath: file.Path(l.PhotoID, file.SizeSmall)},
		})
	}

	return orderBody{
		ID: o.ID, Number: Number(o.Number), Status: o.Status,
		Seller: orderSellerBody{
			ID: o.SellerID, Name: o.SellerName, Address: o.CollectionPoint.Address,
			Latitude: o.CollectionPoint.Latitude, Longitude: o.CollectionPoint.Longitude,
		},
		Lines: lines, TotalVND: o.TotalVND, WindowStart: o.WindowStart, WindowEnd: o.WindowEnd, CreatedAt: o.CreatedAt,
		ReadyAt: o.ReadyAt, CollectedAt: o.CollectedAt, CancelledAt: o.CancelledAt, RefusedAt: o.RefusedAt,
		CancelReason: o.CancelReason, RefuseReason: o.RefuseReason, RefuseNote: o.RefuseNote,
		CheckoutID: o.CheckoutID, CustomerName: o.Contact.Name, CustomerPhone: o.Contact.Phone, Review: review, Access: o.Access,
	}
}

type orderOutput struct {
	Body orderBody
}

type ordersOutput struct {
	Body struct {
		Orders []orderBody `json:"orders" nullable:"false"`
	}
}

func toOrders(orders []Order) *ordersOutput {
	out := &ordersOutput{}
	out.Body.Orders = make([]orderBody, 0, len(orders))

	for _, o := range orders {
		out.Body.Orders = append(out.Body.Orders, toBody(o))
	}

	return out
}

type orderPath struct {
	OrderID uuid.UUID `path:"orderId"`
}

// customerPath names an order and, for a customer who did not sign in, its
// access.
type customerPath struct {
	OrderID uuid.UUID `path:"orderId"`
	Access  string    `doc:"The order's access, for its customer who did not sign in" header:"Order-Access" maxLength:"64"`
}

var (
	security  = platform.SignedIn()
	anyone    = platform.MaybeSignedIn()
	tagOrders = []string{"Orders"}
)

// RegisterOperations adds the module's operations to api.
func RegisterOperations(api huma.API, s *Service) {
	registerCustomerOperations(api, s)
	registerStaffOperations(api, s)
}

func registerCustomerOperations(api huma.API, s *Service) {
	huma.Register(api, huma.Operation{
		OperationID: "placeOrder", Method: http.MethodPost, Path: "/orders",
		Summary: "Order units of one seller's offers, collected at the counter",
		Description: "Confirmed at once, signed in or not; for the account when someone is signed in. Sending the same " +
			"Idempotency-Key again, without an account with the same phone number, returns the order placed first.",
		Tags: tagOrders, Security: anyone, DefaultStatus: http.StatusCreated,
	}, func(ctx context.Context, in *struct {
		IdempotencyKey string `header:"Idempotency-Key" maxLength:"255" minLength:"1" required:"true"`
		Body           placeOrderBody
	},
	) (*orderOutput, error) {
		wanted := make([]Wanted, 0, len(in.Body.Lines))
		for _, l := range in.Body.Lines {
			wanted = append(wanted, Wanted(l))
		}

		o, err := s.Place(ctx, in.IdempotencyKey, in.Body.CheckoutID, Contact{Name: in.Body.Name, Phone: in.Body.Phone}, wanted)
		if err != nil {
			return nil, err
		}

		return &orderOutput{Body: toBody(o)}, nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "listMyOrders", Method: http.MethodGet, Path: "/orders",
		Summary: "Your orders, newest first", Tags: tagOrders, Security: security,
	}, func(ctx context.Context, in *struct {
		State    Which     `doc:"open: still to collect; ended: every other" enum:"open,ended" query:"state"`
		Checkout uuid.UUID `doc:"Only the orders placed together from this cart" query:"checkout" required:"false"`
		Limit    int       `default:"20"                                     maximum:"50"      minimum:"1" query:"limit"`
		Offset   int       `default:"0"                                      minimum:"0"       query:"offset"`
	},
	) (*ordersOutput, error) {
		orders, err := s.Mine(ctx, in.State, in.Checkout, in.Limit, in.Offset)
		if err != nil {
			return nil, err
		}

		return toOrders(orders), nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "getOrder", Method: http.MethodGet, Path: "/orders/{orderId}",
		Summary:     "An order",
		Description: "To its customer, signed in or sending its access; to the seller's people and to admins.",
		Tags:        tagOrders, Security: anyone,
	}, func(ctx context.Context, in *customerPath) (*orderOutput, error) {
		o, err := s.Get(ctx, in.OrderID, in.Access)
		if err != nil {
			return nil, err
		}

		return &orderOutput{Body: toBody(o)}, nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "cancelOrder", Method: http.MethodPost, Path: "/orders/{orderId}/cancel",
		Summary:     "Cancel your order, free of charge until the seller marks it ready",
		Description: "By its customer, signed in or sending its access. Its units go back on sale.",
		Tags:        tagOrders, Security: anyone,
	}, func(ctx context.Context, in *struct {
		OrderID uuid.UUID `path:"orderId"`
		Access  string    `doc:"The order's access, for its customer who did not sign in" header:"Order-Access" maxLength:"64"`
		Body    struct {
			Reason string `json:"reason,omitempty" maxLength:"200"`
		}
	},
	) (*orderOutput, error) {
		o, err := s.Cancel(ctx, in.OrderID, in.Access, in.Body.Reason)
		if err != nil {
			return nil, err
		}

		return &orderOutput{Body: toBody(o)}, nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "reviewOrder", Method: http.MethodPost, Path: "/orders/{orderId}/review",
		Summary:     "Rate your collected order, once",
		Description: "By its customer, signed in or sending its access, after the order was handed over.",
		Tags:        tagOrders, Security: anyone,
	}, func(ctx context.Context, in *struct {
		OrderID uuid.UUID `path:"orderId"`
		Access  string    `doc:"The order's access, for its customer who did not sign in" header:"Order-Access" maxLength:"64"`
		Body    struct {
			Stars   int    `json:"stars"             maximum:"5" minimum:"1"`
			Tags    []Tag  `json:"tags"              doc:"What went well" enum:"fast_pickup,good_quality,good_variety,fair_portions" maxItems:"4" nullable:"false" uniqueItems:"true"`
			Comment string `json:"comment,omitempty" maxLength:"500"`
		}
	},
	) (*orderOutput, error) {
		o, err := s.Rate(ctx, in.OrderID, in.Access, Review{Stars: in.Body.Stars, Tags: in.Body.Tags, Comment: in.Body.Comment})
		if err != nil {
			return nil, err
		}

		return &orderOutput{Body: toBody(o)}, nil
	})
}

func registerStaffOperations(api huma.API, s *Service) {
	huma.Register(api, huma.Operation{
		OperationID: "listSellerOrders", Method: http.MethodGet, Path: "/sellers/{sellerId}/orders",
		Summary: "A seller's orders of one day, soonest first, to its people and admins", Tags: tagOrders, Security: security,
	}, func(ctx context.Context, in *struct {
		SellerID uuid.UUID `path:"sellerId"`
		Day      string    `doc:"A day in Vietnam time, YYYY-MM-DD; today when empty" pattern:"^[0-9]{4}-[0-9]{2}-[0-9]{2}$" query:"day"`
	},
	) (*ordersOutput, error) {
		day := s.Today()

		if in.Day != "" {
			parsed, err := time.ParseInLocation(time.DateOnly, in.Day, vietnam)
			if err != nil {
				return nil, ErrDayInvalid
			}

			day = parsed
		}

		orders, err := s.OfSeller(ctx, in.SellerID, day)
		if err != nil {
			return nil, err
		}

		return toOrders(orders), nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "markOrderReady", Method: http.MethodPost, Path: "/orders/{orderId}/ready",
		Summary: "Mark an order ready, which tells its customer to come", Tags: tagOrders, Security: security,
	}, func(ctx context.Context, in *orderPath) (*orderOutput, error) {
		o, err := s.Ready(ctx, in.OrderID)
		if err != nil {
			return nil, err
		}

		return &orderOutput{Body: toBody(o)}, nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "handOverOrder", Method: http.MethodPost, Path: "/orders/{orderId}/hand-over",
		Summary: "Hand an order over",
		Description: "Within the window, once staff have matched the collector to the order by its QR code or by " +
			"the name and phone number on it.",
		Tags: tagOrders, Security: security,
	}, func(ctx context.Context, in *orderPath) (*orderOutput, error) {
		o, err := s.HandOver(ctx, in.OrderID)
		if err != nil {
			return nil, err
		}

		return &orderOutput{Body: toBody(o)}, nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "reopenOrder", Method: http.MethodPost, Path: "/orders/{orderId}/reopen",
		Summary: "Take a hand-over or a refusal back",
		Description: "The order is open again, and the units a refusal had returned are taken again, or it fails when they " +
			"are gone. An order its customer cancelled, or whose window is over, stays as it is.",
		Tags: tagOrders, Security: security,
	}, func(ctx context.Context, in *orderPath) (*orderOutput, error) {
		o, err := s.Reopen(ctx, in.OrderID)
		if err != nil {
			return nil, err
		}

		return &orderOutput{Body: toBody(o)}, nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "refuseOrder", Method: http.MethodPost, Path: "/orders/{orderId}/refuse",
		Summary: "Refuse to hand an order over, with a reason", Tags: tagOrders, Security: security,
	}, func(ctx context.Context, in *struct {
		OrderID uuid.UUID `path:"orderId"`
		Body    struct {
			Reason RefuseReason `json:"reason"         enum:"not_suitable,wrong_items,no_answer,no_show,late,sold_out,other"`
			Note   string       `json:"note,omitempty" maxLength:"200"`
		}
	},
	) (*orderOutput, error) {
		o, err := s.Refuse(ctx, in.OrderID, in.Body.Reason, in.Body.Note)
		if err != nil {
			return nil, err
		}

		return &orderOutput{Body: toBody(o)}, nil
	})
}

type historyOutput struct {
	Body struct {
		Placed    int         `json:"placed"`
		Collected int         `json:"collected" doc:"Orders handed over"`
		Missed    int         `json:"missed"    doc:"Orders the customer did not come for: the window ended, or staff ended them as no answer, no show or late"`
		Recent    []orderBody `json:"recent"    doc:"The latest five, newest first" nullable:"false"`
	}
}

// RegisterAdminOperations adds the module's admin operations to admin, the
// group platform.NewAdminGroup returns; their paths omit its prefix.
func RegisterAdminOperations(admin huma.API, s *Service) {
	huma.Register(admin, huma.Operation{
		OperationID: "getAccountOrderHistory", Method: http.MethodGet, Path: "/accounts/{accountId}/orders",
		Summary: "What an account ordered: counts and the latest five orders",
	}, func(ctx context.Context, in *struct {
		AccountID uuid.UUID `path:"accountId"`
	},
	) (*historyOutput, error) {
		h, err := s.HistoryForAdmins(ctx, in.AccountID)
		if err != nil {
			return nil, err
		}

		out := &historyOutput{}
		out.Body.Placed, out.Body.Collected, out.Body.Missed = h.Placed, h.Collected, h.Missed
		out.Body.Recent = make([]orderBody, 0, len(h.Recent))

		for _, o := range h.Recent {
			out.Body.Recent = append(out.Body.Recent, toBody(o))
		}

		return out, nil
	})
}
