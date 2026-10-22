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
	ByZalo     bool              `json:"byZalo,omitempty" doc:"The customer agrees to be told about the order by Zalo once Second Bite sends there" required:"false"`
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
	Review        *reviewBody     `json:"review,omitempty"       doc:"The customer's rating of the collected order; none until they rate it, nor while admins hide it"`
	CanReview     bool            `json:"canReview"              doc:"The order is collected and was never rated, so its customer may rate it"`
	Unread        *int            `json:"unreadMessages,omitempty" doc:"Messages of its chat the reader has not read: from the seller for the customer, from the customer for the seller's people; none for admins"`
	Messages      *int            `json:"messageCount,omitempty" doc:"Messages its chat holds, with unreadMessages; none for admins"`
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
		CanReview: o.Status == StatusCollected && !o.Reviewed,
		Unread:    o.UnreadMessages, Messages: o.MessageCount,
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
	registerChatOperations(api, s)
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

		o, err := s.Place(ctx, in.IdempotencyKey, in.Body.CheckoutID, Contact{Name: in.Body.Name, Phone: in.Body.Phone, ByZalo: in.Body.ByZalo}, wanted)
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
		Summary:     "Cancel your order until the seller marks it ready",
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

type liveTicketOutput struct {
	Body struct {
		Ticket    string    `json:"ticket"    doc:"Sent once in a subscribe frame on GET /live; it works once"`
		ExpiresAt time.Time `json:"expiresAt" doc:"Thirty seconds after it was minted"`
	}
}

func toLiveTicket(t LiveTicket) *liveTicketOutput {
	out := &liveTicketOutput{}
	out.Body.Ticket, out.Body.ExpiresAt = t.Value, t.ExpiresAt

	return out
}

type messageBody struct {
	Seq    int       `json:"seq"    doc:"Its number in the chat, from 1"`
	From   Side      `json:"from"   enum:"customer,seller"`
	Text   string    `json:"text"`
	SentAt time.Time `json:"sentAt"`
}

func toMessageBody(m Message) messageBody {
	return messageBody(m)
}

type messageOutput struct {
	Body messageBody
}

type seenBody struct {
	Customer int `json:"customer" doc:"The highest message the customer has read"`
	Seller   int `json:"seller"   doc:"The highest message the seller's people have read"`
}

type messagesOutput struct {
	Body struct {
		Messages []messageBody `json:"messages"           doc:"Oldest first" nullable:"false"`
		Seen     seenBody      `json:"seen"`
		Open     bool          `json:"open"               doc:"Whether the chat takes messages"`
		ClosesAt *time.Time    `json:"closesAt,omitempty" doc:"Only once the order is collected: when its chat turns read-only"`
	}
}

func registerChatOperations(api huma.API, s *Service) {
	huma.Register(api, huma.Operation{
		OperationID: "createOrderLiveTicket", Method: http.MethodPost, Path: "/orders/{orderId}/live-ticket",
		Summary: "A ticket to follow an order on the live socket",
		Description: "To its customer, signed in or sending its access, and to the seller's people; admins are left out. " +
			"The socket reads no cookie, so the ticket is what authorizes it.",
		Tags: tagOrders, Security: anyone,
	}, func(ctx context.Context, in *customerPath) (*liveTicketOutput, error) {
		t, err := s.OrderLiveTicket(ctx, in.OrderID, in.Access)
		if err != nil {
			return nil, err
		}

		return toLiveTicket(t), nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "createSellerLiveTicket", Method: http.MethodPost, Path: "/sellers/{sellerId}/orders/live-ticket",
		Summary: "A ticket to follow a seller's orders on the live socket", Tags: tagOrders, Security: security,
	}, func(ctx context.Context, in *struct {
		SellerID uuid.UUID `path:"sellerId"`
	},
	) (*liveTicketOutput, error) {
		t, err := s.SellerLiveTicket(ctx, in.SellerID)
		if err != nil {
			return nil, err
		}

		return toLiveTicket(t), nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "listOrderMessages", Method: http.MethodGet, Path: "/orders/{orderId}/messages",
		Summary:     "The messages of an order's chat, oldest first",
		Description: "To its customer, signed in or sending its access, and to the seller's people; admins are left out.",
		Tags:        tagOrders, Security: anyone,
	}, func(ctx context.Context, in *struct {
		OrderID uuid.UUID `path:"orderId"`
		Access  string    `doc:"The order's access, for its customer who did not sign in" header:"Order-Access" maxLength:"64"`
		After   int       `default:"0"                                                    doc:"Only messages numbered after this one" minimum:"0" query:"after"`
		Limit   int       `default:"50"                                                   maximum:"100"                               minimum:"1" query:"limit"`
	},
	) (*messagesOutput, error) {
		c, err := s.Messages(ctx, in.OrderID, in.Access, in.After, in.Limit)
		if err != nil {
			return nil, err
		}

		out := &messagesOutput{}
		out.Body.Messages = make([]messageBody, 0, len(c.Messages))

		for _, m := range c.Messages {
			out.Body.Messages = append(out.Body.Messages, toMessageBody(m))
		}

		out.Body.Seen = seenBody{Customer: c.SeenCustomer, Seller: c.SeenSeller}
		out.Body.Open, out.Body.ClosesAt = c.Open, c.ClosesAt

		return out, nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "sendOrderMessage", Method: http.MethodPost, Path: "/orders/{orderId}/messages",
		Summary: "Write in an order's chat",
		Description: "By its customer, signed in or sending its access, and by the seller's people, while the order is open " +
			"and for two hours after it is collected. Sending the same Idempotency-Key again returns the message sent first.",
		Tags: tagOrders, Security: anyone, DefaultStatus: http.StatusCreated,
	}, func(ctx context.Context, in *struct {
		OrderID        uuid.UUID `path:"orderId"`
		Access         string    `doc:"The order's access, for its customer who did not sign in" header:"Order-Access" maxLength:"64"`
		IdempotencyKey string    `header:"Idempotency-Key" maxLength:"255" minLength:"1" required:"true"`
		Body           struct {
			Text string `json:"text" doc:"Trimmed; 1 to 1,000 characters" maxLength:"1000" minLength:"1"`
		}
	},
	) (*messageOutput, error) {
		m, err := s.SendMessage(ctx, in.OrderID, in.Access, in.IdempotencyKey, in.Body.Text)
		if err != nil {
			return nil, err
		}

		return &messageOutput{Body: toMessageBody(m)}, nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "markOrderMessagesSeen", Method: http.MethodPost, Path: "/orders/{orderId}/messages/seen",
		Summary:     "Say you have read an order's chat up to a message",
		Description: "Also once the chat is read-only. An upTo beyond the latest message counts as the latest.",
		Tags:        tagOrders, Security: anyone, DefaultStatus: http.StatusNoContent,
	}, func(ctx context.Context, in *struct {
		OrderID uuid.UUID `path:"orderId"`
		Access  string    `doc:"The order's access, for its customer who did not sign in" header:"Order-Access" maxLength:"64"`
		Body    struct {
			UpTo int `json:"upTo" minimum:"0"`
		}
	},
	) (*struct{}, error) {
		if err := s.MarkSeen(ctx, in.OrderID, in.Access, in.Body.UpTo); err != nil {
			return nil, err
		}

		return &struct{}{}, nil
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

type orderCountsBody struct {
	Confirmed int `json:"confirmed"`
	Ready     int `json:"ready"`
	Collected int `json:"collected"`
	Cancelled int `json:"cancelled"`
	Refused   int `json:"refused"`
	Expired   int `json:"expired"`
}

type adminOrdersOutput struct {
	Body struct {
		Items    []orderBody     `json:"items"    nullable:"false"`
		Page     int             `json:"page"`
		PageSize int             `json:"pageSize"`
		Total    int             `json:"total"`
		Counts   orderCountsBody `json:"counts"   doc:"Orders of each status matching the other filters, whatever status asks"`
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

	huma.Register(admin, huma.Operation{
		OperationID: "listOrdersForAdmins", Method: http.MethodGet, Path: "/orders",
		Summary: "Every seller's orders by status, words, seller and day collected, the latest window first",
		Description: "q matches the number (SB-24831 or 24831), the customer's name or phone, or the seller's name, " +
			"Vietnamese marks ignored. An order still to collect whose window is over is expired. " +
			"counts holds the orders of each status matching the other filters. A page past the end is empty.",
	}, func(ctx context.Context, in *struct {
		Status   []Status  `query:"status"   doc:"Keep these statuses; every status when absent" enum:"confirmed,ready,collected,cancelled,refused,expired"`
		Q        string    `query:"q"        doc:"The number, the customer's name or phone, or the seller's name" maxLength:"100"`
		SellerID uuid.UUID `query:"sellerId" doc:"Keep this seller's orders"`
		Page     int       `query:"page"     default:"1" minimum:"1"`
		Size     int       `query:"size"     default:"25" maximum:"100" minimum:"1"`

		CollectSince time.Time `query:"collectSince" doc:"Keep the orders whose window starts at or after this time"`
		CollectUntil time.Time `query:"collectUntil" doc:"Keep the orders whose window starts before this time"`
	},
	) (*adminOrdersOutput, error) {
		f := AdminFilter{Statuses: in.Status, Query: in.Q, SellerID: in.SellerID, Page: in.Page, Size: in.Size}
		if !in.CollectSince.IsZero() {
			f.CollectSince = &in.CollectSince
		}

		if !in.CollectUntil.IsZero() {
			f.CollectUntil = &in.CollectUntil
		}

		page, err := s.ListForAdmins(ctx, f)
		if err != nil {
			return nil, err
		}

		out := &adminOrdersOutput{}
		out.Body.Items = make([]orderBody, 0, len(page.Orders))
		out.Body.Page, out.Body.PageSize, out.Body.Total = in.Page, in.Size, page.Total
		out.Body.Counts = orderCountsBody{
			Confirmed: page.Counts[StatusConfirmed], Ready: page.Counts[StatusReady],
			Collected: page.Counts[StatusCollected], Cancelled: page.Counts[StatusCancelled],
			Refused: page.Counts[StatusRefused], Expired: page.Counts[StatusExpired],
		}

		for _, o := range page.Orders {
			out.Body.Items = append(out.Body.Items, toBody(o))
		}

		return out, nil
	})

	registerAdminReviewOperations(admin, s)
}

type adminReviewBody struct {
	OrderID      uuid.UUID  `json:"orderId"                doc:"The order reviewed, which names its review"`
	OrderNumber  string     `json:"orderNumber"            doc:"SB- and a number"`
	SellerID     uuid.UUID  `json:"sellerId"`
	SellerName   string     `json:"sellerName"`
	CustomerName string     `json:"customerName"           doc:"Who collected, as given with the order"`
	Stars        int        `json:"stars"`
	Tags         []Tag      `json:"tags"                   nullable:"false"`
	Comment      string     `json:"comment,omitempty"`
	CreatedAt    time.Time  `json:"createdAt"              doc:"When the customer rated the order"`
	HiddenAt     *time.Time `json:"hiddenAt,omitempty"     doc:"When an admin hid it; absent while it shows"`
	HiddenReason string     `json:"hiddenReason,omitempty" doc:"Why an admin hid it, when they said"`
}

func toAdminReviewBody(r AdminReview) adminReviewBody {
	return adminReviewBody{
		OrderID: r.OrderID, OrderNumber: Number(r.Number), SellerID: r.SellerID, SellerName: r.SellerName,
		CustomerName: r.CustomerName, Stars: r.Stars, Tags: r.Tags, Comment: r.Comment, CreatedAt: r.CreatedAt,
		HiddenAt: r.HiddenAt, HiddenReason: r.HiddenReason,
	}
}

type adminReviewOutput struct {
	Body adminReviewBody
}

type reviewCountsBody struct {
	OneStar    int `json:"oneStar"`
	TwoStars   int `json:"twoStars"`
	ThreeStars int `json:"threeStars"`
	FourStars  int `json:"fourStars"`
	FiveStars  int `json:"fiveStars"`
	Hidden     int `json:"hidden"     doc:"Hidden reviews of the stars asked, whatever visibility asks"`
}

type adminReviewsOutput struct {
	Body struct {
		Items    []adminReviewBody `json:"items"             nullable:"false"`
		Page     int               `json:"page"`
		PageSize int               `json:"pageSize"`
		Total    int               `json:"total"`
		Counts   reviewCountsBody  `json:"counts"            doc:"Reviews of each number of stars matching the other filters, whatever stars asks"`
		Average  *float64          `json:"average,omitempty" doc:"The mean stars of the shown reviews matching every filter; absent when none does"`
	}
}

// registerAdminReviewOperations adds the admins' list of reviews, and hiding
// and showing one, to admin (SEC-145).
func registerAdminReviewOperations(admin huma.API, s *Service) {
	huma.Register(admin, huma.Operation{
		OperationID: "listReviewsForAdmins", Method: http.MethodGet, Path: "/reviews",
		Summary: "Every customer's review, hidden or not, by stars, words, seller, visibility and day, the latest first",
		Description: "q matches the comment, the order's number (SB-24831 or 24831), the customer's name or phone, " +
			"or the seller's name, Vietnamese marks ignored. A page past the end is empty.",
	}, func(ctx context.Context, in *struct {
		Stars      []int      `query:"stars"      doc:"Keep the reviews giving these stars; any when absent" maximum:"5" minimum:"1"`
		Q          string     `query:"q"          doc:"The comment, the order's number, the customer's name or phone, or the seller's name" maxLength:"100"`
		SellerID   uuid.UUID  `query:"sellerId"   doc:"Keep this seller's reviews"`
		Visibility Visibility `query:"visibility" doc:"Keep the shown or the hidden reviews; both when absent" enum:"visible,hidden"`
		Page       int        `query:"page"       default:"1" minimum:"1"`
		Size       int        `query:"size"       default:"25" maximum:"100" minimum:"1"`

		ReviewedSince time.Time `query:"reviewedSince" doc:"Keep the reviews given at or after this time"`
		ReviewedUntil time.Time `query:"reviewedUntil" doc:"Keep the reviews given before this time"`
	},
	) (*adminReviewsOutput, error) {
		f := ReviewFilter{Stars: in.Stars, Query: in.Q, SellerID: in.SellerID, Visibility: in.Visibility, Page: in.Page, Size: in.Size}
		if !in.ReviewedSince.IsZero() {
			f.ReviewedSince = &in.ReviewedSince
		}

		if !in.ReviewedUntil.IsZero() {
			f.ReviewedUntil = &in.ReviewedUntil
		}

		page, err := s.ListReviewsForAdmins(ctx, f)
		if err != nil {
			return nil, err
		}

		out := &adminReviewsOutput{}
		out.Body.Items = make([]adminReviewBody, 0, len(page.Reviews))
		out.Body.Page, out.Body.PageSize, out.Body.Total, out.Body.Average = in.Page, in.Size, page.Total, page.Average
		out.Body.Counts = reviewCountsBody{
			OneStar: page.Counts.Stars[0], TwoStars: page.Counts.Stars[1], ThreeStars: page.Counts.Stars[2],
			FourStars: page.Counts.Stars[3], FiveStars: page.Counts.Stars[4], Hidden: page.Counts.Hidden,
		}

		for _, r := range page.Reviews {
			out.Body.Items = append(out.Body.Items, toAdminReviewBody(r))
		}

		return out, nil
	})

	huma.Register(admin, huma.Operation{
		OperationID: "hideReview", Method: http.MethodPost, Path: "/reviews/{orderId}/hide",
		Summary: "Hide a review from every read but the admins'; its customer is not told",
		Description: "The reason is optional, at most 500 characters, and kept in the audit only. " +
			"The order cannot be rated again while its review is hidden.",
	}, func(ctx context.Context, in *struct {
		OrderID uuid.UUID `path:"orderId"`
		Body    *struct {
			Reason string `json:"reason,omitempty" doc:"Why it is hidden, at most 500 characters" required:"false"`
		} `required:"false"`
	},
	) (*adminReviewOutput, error) {
		var reason string
		if in.Body != nil {
			reason = in.Body.Reason
		}

		r, err := s.HideReview(ctx, in.OrderID, reason)
		if err != nil {
			return nil, err
		}

		return &adminReviewOutput{Body: toAdminReviewBody(r)}, nil
	})

	huma.Register(admin, huma.Operation{
		OperationID: "showReview", Method: http.MethodPost, Path: "/reviews/{orderId}/show",
		Summary: "Show a hidden review again everywhere",
	}, func(ctx context.Context, in *orderPath) (*adminReviewOutput, error) {
		r, err := s.ShowReview(ctx, in.OrderID)
		if err != nil {
			return nil, err
		}

		return &adminReviewOutput{Body: toAdminReviewBody(r)}, nil
	})
}
