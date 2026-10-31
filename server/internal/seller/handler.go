package seller

import (
	"context"
	"net/http"
	"time"

	"github.com/danielgtaylor/huma/v2"
	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/file"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// addressInput is the point whose address is asked.
type addressInput struct {
	Latitude  float64 `query:"latitude"  required:"true" maximum:"90"  minimum:"-90"`
	Longitude float64 `query:"longitude" required:"true" maximum:"180" minimum:"-180"`
}

// addressOutput is the address at a point.
type addressOutput struct {
	Body struct {
		Address string `json:"address" doc:"As people write it; empty when the point has no known address"`
	}
}

// placesInput is what someone typed: a store's address, or where a customer looks for dishes.
type placesInput struct {
	Query string `query:"q" required:"true" minLength:"2" maxLength:"200" doc:"The words of an address or a place, with or without Vietnamese marks"`
}

// placeBody is a suggested place.
type placeBody struct {
	Address   string  `json:"address"   doc:"As people write it; a house number typed first goes before a street that has none"`
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}

// toPlaceBodies is the suggestions as the API gives them, an empty list for none.
func toPlaceBodies(found []Place) []placeBody {
	out := make([]placeBody, len(found))
	for i, p := range found {
		out[i] = placeBody(p)
	}

	return out
}

// placesOutput is up to five suggestions.
type placesOutput struct {
	Body struct {
		Places []placeBody `json:"places" doc:"Up to five places in Hanoi; none when nothing matches or the search does not answer"`
	}
}

type detailsBody struct {
	Name      string  `json:"name"      maxLength:"100" minLength:"1"`
	Address   string  `json:"address"   maxLength:"300" minLength:"1" doc:"The address as people write it"`
	Latitude  float64 `json:"latitude"  maximum:"90"    minimum:"-90" doc:"Where the seller is, pinned on a map; inside Hanoi, or SELLER_LOCATION_OUTSIDE"`
	Longitude float64 `json:"longitude" maximum:"180"   minimum:"-180"`
	Phone     string  `json:"phone"     maxLength:"30" doc:"Shown to the seller's members and admins"`
}

func (b detailsBody) details() Details {
	return Details(b)
}

type sellerBody struct {
	ID              uuid.UUID  `json:"id"`
	Name            string     `json:"name"`
	Address         string     `json:"address"`
	Latitude        float64    `json:"latitude"`
	Longitude       float64    `json:"longitude"`
	Phone           string     `json:"phone"`
	Status          Status     `json:"status"                    enum:"pending,active,rejected,blocked"`
	StatusReason    string     `json:"statusReason,omitempty"    doc:"Why an admin rejected or blocked the seller, as the owner is told"`
	StatusChangedAt *time.Time `json:"statusChangedAt,omitempty"`
	CreatedAt       time.Time  `json:"createdAt"`
	UpdatedAt       time.Time  `json:"updatedAt"`
	PhotoID         *uuid.UUID `json:"photoId,omitempty"         doc:"Served at /photos/{photoId}/1600.jpg and /400.jpg"`
	MyRole          Role       `json:"myRole,omitempty"          enum:"owner,staff" doc:"The caller's role; absent for an admin who is not a member"`
}

func toBody(s Seller) sellerBody {
	return sellerBody(s)
}

type sellerOutput struct {
	Body sellerBody
}

type sellersOutput struct {
	Body struct {
		Sellers []sellerBody `json:"sellers"`
	}
}

func toSellersOutput(sellers []Seller) *sellersOutput {
	out := &sellersOutput{}
	out.Body.Sellers = make([]sellerBody, 0, len(sellers))

	for _, s := range sellers {
		out.Body.Sellers = append(out.Body.Sellers, toBody(s))
	}

	return out
}

type sellerPath struct {
	SellerID uuid.UUID `path:"sellerId"`
}

type memberBody struct {
	AccountID uuid.UUID `json:"accountId"`
	Email     string    `json:"email"`
	Role      Role      `json:"role"      enum:"owner,staff"`
	AddedAt   time.Time `json:"addedAt"`
}

func toMemberBody(m Member) memberBody {
	return memberBody(m)
}

// RegisterOperations adds the module's operations to api.
func RegisterOperations(api huma.API, s *Service) {
	registerOwnerOperations(api, s)
	registerMemberOperations(api, s)
	registerPhotoOperations(api, s)
	registerPublicOperations(api, s)
	registerFollowOperations(api, s)
	registerFeedbackOperations(api, s)
}

var (
	security = platform.SignedIn()
	// optional is for reads anyone may make.
	optional   = platform.MaybeSignedIn()
	tagSellers = []string{"Sellers"}
	tagPlaces  = []string{"Places"}
)

func registerOwnerOperations(api huma.API, s *Service) {
	huma.Register(api, huma.Operation{
		OperationID: "openSeller", Method: http.MethodPost, Path: "/sellers",
		Summary: "Open a seller, active at once, pinned inside Hanoi", Tags: tagSellers,
		Security: security, DefaultStatus: http.StatusCreated,
	}, func(ctx context.Context, in *struct{ Body detailsBody }) (*sellerOutput, error) {
		seller, err := s.Open(ctx, in.Body.details())
		if err != nil {
			return nil, err
		}

		return &sellerOutput{Body: toBody(seller)}, nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "addressAt", Method: http.MethodGet, Path: "/sellers/address",
		Summary: "The address at a point, to fill the form that opens a store; empty when it is not known",
		Tags:    tagSellers, Security: security,
	}, func(ctx context.Context, in *addressInput) (*addressOutput, error) {
		address, err := s.AddressAt(ctx, in.Latitude, in.Longitude)
		if err != nil {
			return nil, err
		}

		out := &addressOutput{}
		out.Body.Address = address

		return out, nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "searchPlaces", Method: http.MethodGet, Path: "/sellers/places",
		Summary: "Places in Hanoi for the words of a store's address, to pin it as it is typed",
		Tags:    tagSellers, Security: security,
	}, func(ctx context.Context, in *placesInput) (*placesOutput, error) {
		found, err := s.Places(ctx, in.Query)
		out := &placesOutput{}
		out.Body.Places = toPlaceBodies(found)

		return out, err
	})

	huma.Register(api, huma.Operation{
		OperationID: "searchCustomerPlaces", Method: http.MethodGet, Path: "/places",
		Summary: "Places in Hanoi for the words a customer typed, to look for dishes around; signed in or not",
		Tags:    tagPlaces,
	}, func(ctx context.Context, in *placesInput) (*placesOutput, error) {
		found, err := s.PlacesForCustomer(ctx, in.Query)
		out := &placesOutput{}
		out.Body.Places = toPlaceBodies(found)

		return out, err
	})

	huma.Register(api, huma.Operation{
		OperationID: "listMySellers", Method: http.MethodGet, Path: "/sellers/mine",
		Summary: "The sellers I own or work for", Tags: tagSellers, Security: security,
	}, func(ctx context.Context, _ *struct{}) (*sellersOutput, error) {
		sellers, err := s.Mine(ctx)
		if err != nil {
			return nil, err
		}

		return toSellersOutput(sellers), nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "getSeller", Method: http.MethodGet, Path: "/sellers/{sellerId}",
		Summary: "A seller, to its members and admins", Tags: tagSellers, Security: security,
	}, func(ctx context.Context, in *sellerPath) (*sellerOutput, error) {
		seller, err := s.Get(ctx, in.SellerID)
		if err != nil {
			return nil, err
		}

		return &sellerOutput{Body: toBody(seller)}, nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "updateSeller", Method: http.MethodPut, Path: "/sellers/{sellerId}",
		Summary: "Change a seller's details; only its owner may. A moved pin or address moves its offers on sale and its orders still to collect", Tags: tagSellers, Security: security,
	}, func(ctx context.Context, in *struct {
		SellerID uuid.UUID `path:"sellerId"`
		Body     detailsBody
	},
	) (*sellerOutput, error) {
		seller, err := s.Update(ctx, in.SellerID, in.Body.details())
		if err != nil {
			return nil, err
		}

		return &sellerOutput{Body: toBody(seller)}, nil
	})
}

type sellerProfileBody struct {
	ID        uuid.UUID        `json:"id"`
	Name      string           `json:"name"`
	Address   string           `json:"address"`
	Latitude  float64          `json:"latitude"`
	Longitude float64          `json:"longitude"`
	Photo     *sellerPhotoBody `json:"photo,omitempty"`
}

type sellerPhotoBody struct {
	ID        uuid.UUID `json:"id"`
	LargePath string    `json:"largePath"`
	SmallPath string    `json:"smallPath"`
}

// toProfileBody is what customers read of a seller, here and beside offers.
func toProfileBody(p Public) sellerProfileBody {
	b := sellerProfileBody{ID: p.ID, Name: p.Name, Address: p.Address, Latitude: p.Latitude, Longitude: p.Longitude}
	if p.PhotoID != nil {
		b.Photo = &sellerPhotoBody{
			ID: *p.PhotoID, LargePath: file.Path(*p.PhotoID, file.SizeLarge), SmallPath: file.Path(*p.PhotoID, file.SizeSmall),
		}
	}

	return b
}

func registerPublicOperations(api huma.API, s *Service) {
	huma.Register(api, huma.Operation{
		OperationID: "getSellerProfile", Method: http.MethodGet, Path: "/sellers/{sellerId}/profile",
		Summary:     "What anyone sees of an active seller",
		Description: "Its offers are GET /offers?sellerId=. A seller pending or blocked answers 404.",
		Tags:        tagSellers, Security: optional,
	}, func(ctx context.Context, in *sellerPath) (*struct{ Body sellerProfileBody }, error) {
		p, err := s.PublicOf(ctx, in.SellerID)
		if err != nil {
			return nil, err
		}

		return &struct{ Body sellerProfileBody }{Body: toProfileBody(p)}, nil
	})
}

func registerPhotoOperations(api huma.API, s *Service) {
	huma.Register(api, huma.Operation{
		OperationID: "setSellerPhoto", Method: http.MethodPut, Path: "/sellers/{sellerId}/photo",
		Summary: "Set the seller's photo, uploaded by its owner; only the owner may", Tags: tagSellers, Security: security,
	}, func(ctx context.Context, in *struct {
		SellerID uuid.UUID `path:"sellerId"`
		Body     struct {
			PhotoID uuid.UUID `json:"photoId" doc:"From POST /photos"`
		}
	},
	) (*sellerOutput, error) {
		seller, err := s.SetPhoto(ctx, in.SellerID, &in.Body.PhotoID)
		if err != nil {
			return nil, err
		}

		return &sellerOutput{Body: toBody(seller)}, nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "removeSellerPhoto", Method: http.MethodDelete, Path: "/sellers/{sellerId}/photo",
		Summary: "Remove the seller's photo; only the owner may", Tags: tagSellers,
		Security: security, DefaultStatus: http.StatusNoContent,
	}, func(ctx context.Context, in *sellerPath) (*struct{}, error) {
		if _, err := s.SetPhoto(ctx, in.SellerID, nil); err != nil {
			return nil, err
		}

		return &struct{}{}, nil
	})
}

// adminMembersOutput answers a seller's people after an admin changed them.
type adminMembersOutput struct {
	Body struct {
		Members []memberBody `json:"members"`
	}
}

func registerMemberOperations(api huma.API, s *Service) {
	type membersOutput struct {
		Body struct {
			Members []memberBody `json:"members"`
		}
	}

	huma.Register(api, huma.Operation{
		OperationID: "listSellerMembers", Method: http.MethodGet, Path: "/sellers/{sellerId}/members",
		Summary: "The owner and staff of a seller", Tags: tagSellers, Security: security,
	}, func(ctx context.Context, in *sellerPath) (*membersOutput, error) {
		members, err := s.Members(ctx, in.SellerID)
		if err != nil {
			return nil, err
		}

		out := &membersOutput{}
		out.Body.Members = make([]memberBody, 0, len(members))

		for _, m := range members {
			out.Body.Members = append(out.Body.Members, toMemberBody(m))
		}

		return out, nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "addSellerStaff", Method: http.MethodPost, Path: "/sellers/{sellerId}/members",
		Summary:     "Add a staff member by email; only the owner may",
		Description: "The person is staff at once and signs in with an emailed code to that address.",
		Tags:        tagSellers, Security: security, DefaultStatus: http.StatusCreated,
	}, func(ctx context.Context, in *struct {
		SellerID uuid.UUID `path:"sellerId"`
		Body     struct {
			Email string `json:"email" maxLength:"254" minLength:"3"`
		}
	},
	) (*struct{ Body memberBody }, error) {
		m, err := s.AddStaff(ctx, in.SellerID, in.Body.Email)
		if err != nil {
			return nil, err
		}

		return &struct{ Body memberBody }{Body: toMemberBody(m)}, nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "removeSellerMember", Method: http.MethodDelete, Path: "/sellers/{sellerId}/members/{accountId}",
		Summary: "Remove a staff member, or leave the seller", Tags: tagSellers,
		Security: security, DefaultStatus: http.StatusNoContent,
	}, func(ctx context.Context, in *struct {
		SellerID  uuid.UUID `path:"sellerId"`
		AccountID uuid.UUID `path:"accountId"`
	},
	) (*struct{}, error) {
		return nil, s.RemoveMember(ctx, in.SellerID, in.AccountID)
	})
}

// RegisterAdminOperations adds the module's admin operations to admin, the
// group platform.NewAdminGroup returns; their paths omit its prefix.
func RegisterAdminOperations(admin huma.API, s *Service) {
	registerFeedbackAdminOperations(admin, s)
	registerOwnerAdminOperation(admin, s)

	huma.Register(admin, huma.Operation{
		OperationID: "listSellersForAdmins", Method: http.MethodGet, Path: "/sellers",
		Summary: "Sellers by status and words, pending ones first",
		Description: "Pending sellers come first, the oldest first; then the latest change first. " +
			"q matches the name, address or phone, Vietnamese marks ignored. A page past the end is empty.",
	}, func(ctx context.Context, in *struct {
		Status []Status `query:"status" doc:"Keep these statuses; every status when absent" enum:"pending,active,rejected,blocked"`
		Q      string   `query:"q"            doc:"Words of the name, address or phone" maxLength:"100"`
		Sort   string   `query:"sort"         doc:"name, address or changed; a leading - is descending; the queue order when absent" enum:"name,-name,address,-address,changed,-changed"`
		Page   int      `query:"page"         default:"1" maximum:"10000" minimum:"1"`
		Size   int      `query:"size"   default:"25"                                        maximum:"100" minimum:"1"`

		ChangedSince time.Time `query:"changedSince" doc:"Keep the sellers last changed at or after this time"`
		ChangedUntil time.Time `query:"changedUntil" doc:"Keep the sellers last changed before this time"`
	},
	) (*adminSellersOutput, error) {
		f := Filter{Statuses: in.Status, Query: in.Q, Sort: in.Sort, Page: in.Page, Size: in.Size}
		if !in.ChangedSince.IsZero() {
			f.ChangedSince = &in.ChangedSince
		}

		if !in.ChangedUntil.IsZero() {
			f.ChangedUntil = &in.ChangedUntil
		}

		page, err := s.List(ctx, f)
		if err != nil {
			return nil, err
		}

		out := &adminSellersOutput{}
		out.Body.Items = make([]adminSellerBody, 0, len(page.Sellers))
		out.Body.Page, out.Body.PageSize, out.Body.Total = in.Page, in.Size, page.Total
		out.Body.Counts = statusCountsBody{
			Pending: page.Counts[StatusPending], Active: page.Counts[StatusActive],
			Rejected: page.Counts[StatusRejected], Blocked: page.Counts[StatusBlocked],
		}

		for _, l := range page.Sellers {
			out.Body.Items = append(out.Body.Items, toAdminSellerBody(l))
		}

		out.Body.Days = make([]statusDayBody, 0, len(page.Days))
		for _, d := range page.Days {
			out.Body.Days = append(out.Body.Days, statusDayBody{
				Day:     d.Day.Format(time.DateOnly),
				Pending: d.Counts[StatusPending], Active: d.Counts[StatusActive],
				Rejected: d.Counts[StatusRejected], Blocked: d.Counts[StatusBlocked],
			})
		}

		return out, nil
	})

	huma.Register(admin, huma.Operation{
		OperationID: "listMembershipsForAdmins", Method: http.MethodGet, Path: "/memberships",
		Summary: "The sellers some accounts own or work at, owners first",
	}, func(ctx context.Context, in *struct {
		// Exploded, as the generated clients send an array: accountId=a&accountId=b.
		AccountID []uuid.UUID `query:"accountId,explode" doc:"The accounts, at most 100" maxItems:"100" minItems:"1" required:"true"`
	},
	) (*membershipsOutput, error) {
		memberships, err := s.MembershipsForAdmins(ctx, in.AccountID)
		if err != nil {
			return nil, err
		}

		out := &membershipsOutput{}
		out.Body.Memberships = make([]membershipBody, 0, len(memberships))

		for _, m := range memberships {
			out.Body.Memberships = append(out.Body.Memberships, membershipBody(m))
		}

		return out, nil
	})

	huma.Register(admin, huma.Operation{
		OperationID: "approveSeller", Method: http.MethodPost, Path: "/sellers/{sellerId}/approve",
		Summary: "Let a pending, rejected or blocked seller publish; its owner is emailed. A seller whose owner deleted their account is refused",
	}, func(ctx context.Context, in *sellerPath) (*sellerOutput, error) {
		seller, err := s.Approve(ctx, in.SellerID)
		if err != nil {
			return nil, err
		}

		return &sellerOutput{Body: toBody(seller)}, nil
	})

	for _, action := range []struct {
		id, path, summary string
		do                func(context.Context, uuid.UUID, string) (Seller, error)
	}{
		{"rejectSeller", "/sellers/{sellerId}/reject", "Refuse a pending seller; its owner is emailed the reason", s.Reject},
		{"blockSeller", "/sellers/{sellerId}/block", "Stop an active seller; its owner is emailed the reason", s.Block},
	} {
		huma.Register(admin, huma.Operation{
			OperationID: action.id, Method: http.MethodPost, Path: action.path, Summary: action.summary,
		}, func(ctx context.Context, in *struct {
			SellerID uuid.UUID `path:"sellerId"`
			Body     struct {
				Reason string `json:"reason" doc:"What the owner is told, 10 to 500 characters" maxLength:"500" minLength:"10"`
			}
		},
		) (*sellerOutput, error) {
			seller, err := action.do(ctx, in.SellerID, in.Body.Reason)
			if err != nil {
				return nil, err
			}

			return &sellerOutput{Body: toBody(seller)}, nil
		})
	}
}

// adminSellerBody is a seller in the admins' list. It lists its own fields rather than embedding sellerBody,
// which is unexported, so huma leaves it out of the contract.
type adminSellerBody struct {
	ID              uuid.UUID  `json:"id"`
	Name            string     `json:"name"`
	Address         string     `json:"address"`
	Latitude        float64    `json:"latitude"`
	Longitude       float64    `json:"longitude"`
	Phone           string     `json:"phone"`
	Status          Status     `json:"status"                    enum:"pending,active,rejected,blocked"`
	StatusReason    string     `json:"statusReason,omitempty"    doc:"Why an admin rejected or blocked the seller, as the owner is told"`
	StatusChangedAt *time.Time `json:"statusChangedAt,omitempty"`
	CreatedAt       time.Time  `json:"createdAt"`
	UpdatedAt       time.Time  `json:"updatedAt"`
	PhotoID         *uuid.UUID `json:"photoId,omitempty"         doc:"Served at /photos/{photoId}/1600.jpg and /400.jpg"`
	OwnerEmail      string     `json:"ownerEmail,omitempty"      doc:"Absent when the owner deleted their account"`
}

func toAdminSellerBody(l Listed) adminSellerBody {
	s := l.Seller

	return adminSellerBody{
		ID: s.ID, Name: s.Name, Address: s.Address, Latitude: s.Latitude, Longitude: s.Longitude, Phone: s.Phone,
		Status: s.Status, StatusReason: s.StatusReason, StatusChangedAt: s.StatusChangedAt,
		CreatedAt: s.CreatedAt, UpdatedAt: s.UpdatedAt, PhotoID: s.PhotoID, OwnerEmail: l.OwnerEmail,
	}
}

type membershipBody struct {
	AccountID    uuid.UUID `json:"accountId"`
	Role         Role      `json:"role"         enum:"owner,staff"`
	SellerID     uuid.UUID `json:"sellerId"`
	SellerName   string    `json:"sellerName"`
	SellerStatus Status    `json:"sellerStatus" enum:"pending,active,rejected,blocked"`
}

type membershipsOutput struct {
	Body struct {
		Memberships []membershipBody `json:"memberships"`
	}
}

type adminSellersOutput struct {
	Body struct {
		Items    []adminSellerBody `json:"items"`
		Page     int               `json:"page"`
		PageSize int               `json:"pageSize"`
		Total    int               `json:"total"`
		Counts   statusCountsBody  `json:"counts"   doc:"Sellers of each status matching q, whatever status asks"`
		Days     []statusDayBody   `json:"days"     doc:"Sellers of each status on each of the last 14 days in Vietnam, the oldest first, whatever the filters; a day before counting started is absent"`
	}
}

// statusDayBody lists its own fields, as huma leaves an embedded unexported
// struct out of the contract.
type statusDayBody struct {
	Day      string `json:"day"      doc:"The day in Vietnam, as YYYY-MM-DD" format:"date"`
	Pending  int    `json:"pending"`
	Active   int    `json:"active"`
	Rejected int    `json:"rejected"`
	Blocked  int    `json:"blocked"`
}

type statusCountsBody struct {
	Pending  int `json:"pending"`
	Active   int `json:"active"`
	Rejected int `json:"rejected"`
	Blocked  int `json:"blocked"`
}

func registerFollowOperations(api huma.API, s *Service) {
	type followedOutput struct {
		Body struct {
			Sellers []sellerProfileBody `json:"sellers"`
		}
	}

	huma.Register(api, huma.Operation{
		OperationID: "followSeller", Method: http.MethodPut, Path: "/sellers/{sellerId}/follow",
		Summary:     "Make an active seller one of my favourites",
		Description: "Following again changes nothing. A seller pending or blocked answers 404.",
		Tags:        tagSellers, Security: security, DefaultStatus: http.StatusNoContent,
	}, func(ctx context.Context, in *sellerPath) (*struct{}, error) {
		return nil, s.Follow(ctx, in.SellerID)
	})

	huma.Register(api, huma.Operation{
		OperationID: "unfollowSeller", Method: http.MethodDelete, Path: "/sellers/{sellerId}/follow",
		Summary:     "Take a seller out of my favourites",
		Description: "A seller I do not follow is left as it is.",
		Tags:        tagSellers, Security: security, DefaultStatus: http.StatusNoContent,
	}, func(ctx context.Context, in *sellerPath) (*struct{}, error) {
		return nil, s.Unfollow(ctx, in.SellerID)
	})

	huma.Register(api, huma.Operation{
		OperationID: "listFollowedSellers", Method: http.MethodGet, Path: "/sellers/followed",
		Summary:     "The active sellers I follow, the latest followed first",
		Description: "A seller blocked since is left out.",
		Tags:        tagSellers, Security: security,
	}, func(ctx context.Context, _ *struct{}) (*followedOutput, error) {
		followed, err := s.Followed(ctx)
		if err != nil {
			return nil, err
		}

		out := &followedOutput{}
		out.Body.Sellers = make([]sellerProfileBody, 0, len(followed))

		for _, p := range followed {
			out.Body.Sellers = append(out.Body.Sellers, toProfileBody(p))
		}

		return out, nil
	})
}

// registerOwnerAdminOperation lets admins hand a seller to its owner (SEC-162).
func registerOwnerAdminOperation(admin huma.API, s *Service) {
	huma.Register(admin, huma.Operation{
		OperationID: "changeSellerOwner", Method: http.MethodPost, Path: "/sellers/{sellerId}/owner",
		Summary: "Hand a seller to the account of an email; the previous owner stays on as staff",
		Description: "An address that never signed in gets its account at once. The new owner may own at most five " +
			"sellers. A seller whose owner deleted their account gets an owner this way (SEC-162).",
	}, func(ctx context.Context, in *struct {
		SellerID uuid.UUID `path:"sellerId"`
		Body     struct {
			Email string `json:"email" doc:"The new owner's address" maxLength:"254" minLength:"3"`
		}
	},
	) (*adminMembersOutput, error) {
		members, err := s.ChangeOwner(ctx, in.SellerID, in.Body.Email)
		if err != nil {
			return nil, err
		}

		out := &adminMembersOutput{}
		out.Body.Members = make([]memberBody, 0, len(members))

		for _, m := range members {
			out.Body.Members = append(out.Body.Members, toMemberBody(m))
		}

		return out, nil
	})
}
