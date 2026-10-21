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
	Lines []orderWantedBody `json:"lines" doc:"One to ten different offers of one seller" maxItems:"10" minItems:"1"`
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

type orderBody struct {
	ID               uuid.UUID       `json:"id"`
	Number           string          `json:"number"                 doc:"What people read aloud, SB- and a number"`
	Status           Status          `json:"status"                 doc:"expired is read from the window's end" enum:"confirmed,ready,collected,cancelled,refused,expired"`
	Seller           orderSellerBody `json:"seller"                 doc:"Where the order is collected, copied when it was placed"`
	Lines            []orderLineBody `json:"lines"                  nullable:"false"`
	TotalVND         int64           `json:"totalVnd"               doc:"Paid to the seller at the counter"`
	WindowStart      time.Time       `json:"windowStart"`
	WindowEnd        time.Time       `json:"windowEnd"`
	CreatedAt        time.Time       `json:"createdAt"`
	ReadyAt          *time.Time      `json:"readyAt,omitempty"`
	CollectedAt      *time.Time      `json:"collectedAt,omitempty"`
	CancelledAt      *time.Time      `json:"cancelledAt,omitempty"`
	RefusedAt        *time.Time      `json:"refusedAt,omitempty"`
	CancelReason     string          `json:"cancelReason,omitempty"`
	RefuseReason     RefuseReason    `json:"refuseReason,omitempty" enum:"not_suitable,wrong_items,other"`
	RefuseNote       string          `json:"refuseNote,omitempty"`
	CodeAttemptsLeft int             `json:"codeAttemptsLeft"       doc:"How many wrong codes staff may still enter"`
	Code             string          `json:"code,omitempty"         doc:"The collection code, to its customer once the order is ready or its window has opened"`
}

func toBody(o Order) orderBody {
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
		CodeAttemptsLeft: o.CodeAttemptsLeft, Code: o.Code,
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

var (
	security  = platform.SignedIn()
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
		Summary:     "Order units of one seller's offers, collected at the counter",
		Description: "Confirmed at once. Sending the same Idempotency-Key again returns the order placed first.",
		Tags:        tagOrders, Security: security, DefaultStatus: http.StatusCreated,
	}, func(ctx context.Context, in *struct {
		IdempotencyKey string `header:"Idempotency-Key" maxLength:"255" minLength:"1" required:"true"`
		Body           placeOrderBody
	},
	) (*orderOutput, error) {
		wanted := make([]Wanted, 0, len(in.Body.Lines))
		for _, l := range in.Body.Lines {
			wanted = append(wanted, Wanted(l))
		}

		o, err := s.Place(ctx, in.IdempotencyKey, wanted)
		if err != nil {
			return nil, err
		}

		return &orderOutput{Body: toBody(o)}, nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "listMyOrders", Method: http.MethodGet, Path: "/orders",
		Summary: "Your orders, newest first", Tags: tagOrders, Security: security,
	}, func(ctx context.Context, in *struct {
		State  Which `doc:"open: still to collect; ended: every other" enum:"open,ended" query:"state"`
		Limit  int   `default:"20"                                     maximum:"50"      minimum:"1" query:"limit"`
		Offset int   `default:"0"                                      minimum:"0"       query:"offset"`
	},
	) (*ordersOutput, error) {
		orders, err := s.Mine(ctx, in.State, in.Limit, in.Offset)
		if err != nil {
			return nil, err
		}

		return toOrders(orders), nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "getOrder", Method: http.MethodGet, Path: "/orders/{orderId}",
		Summary:     "An order",
		Description: "To its customer, with the code once it may be shown, to the seller's people and to admins.",
		Tags:        tagOrders, Security: security,
	}, func(ctx context.Context, in *orderPath) (*orderOutput, error) {
		o, err := s.Get(ctx, in.OrderID)
		if err != nil {
			return nil, err
		}

		return &orderOutput{Body: toBody(o)}, nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "cancelOrder", Method: http.MethodPost, Path: "/orders/{orderId}/cancel",
		Summary:     "Cancel your order, free of charge until its window opens",
		Description: "Its units go back on sale.",
		Tags:        tagOrders, Security: security,
	}, func(ctx context.Context, in *struct {
		OrderID uuid.UUID `path:"orderId"`
		Body    struct {
			Reason string `json:"reason,omitempty" maxLength:"200"`
		}
	},
	) (*orderOutput, error) {
		o, err := s.Cancel(ctx, in.OrderID, in.Body.Reason)
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
		Summary: "Mark an order ready, which shows its customer the code", Tags: tagOrders, Security: security,
	}, func(ctx context.Context, in *orderPath) (*orderOutput, error) {
		o, err := s.Ready(ctx, in.OrderID)
		if err != nil {
			return nil, err
		}

		return &orderOutput{Body: toBody(o)}, nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "handOverOrder", Method: http.MethodPost, Path: "/orders/{orderId}/hand-over",
		Summary:     "Hand an order over against its collection code",
		Description: "Within the window. A wrong code is counted; the third locks the code.",
		Tags:        tagOrders, Security: security,
	}, func(ctx context.Context, in *struct {
		OrderID uuid.UUID `path:"orderId"`
		Body    struct {
			Code string `json:"code" pattern:"^[0-9]{4}$"`
		}
	},
	) (*orderOutput, error) {
		o, err := s.HandOver(ctx, in.OrderID, in.Body.Code)
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
			Reason RefuseReason `json:"reason"         enum:"not_suitable,wrong_items,other"`
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
