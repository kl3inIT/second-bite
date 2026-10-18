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

type detailsBody struct {
	Name      string  `json:"name"      maxLength:"100" minLength:"1"`
	Address   string  `json:"address"   maxLength:"300" minLength:"1" doc:"The address as people write it"`
	Latitude  float64 `json:"latitude"  maximum:"90"    minimum:"-90" doc:"Where the seller is, pinned on a map"`
	Longitude float64 `json:"longitude" maximum:"180"   minimum:"-180"`
	Phone     string  `json:"phone"     maxLength:"30"  minLength:"9" doc:"Shown to the seller's members and admins"`
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
	Status          Status     `json:"status"                    enum:"pending,active,blocked"`
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
	registerAdminOperations(api, s)
}

var (
	security = []map[string][]string{{platform.SecurityBearer: {}}}
	// optional is for reads anyone may make.
	optional   = []map[string][]string{{}, {platform.SecurityBearer: {}}}
	tagSellers = []string{"Sellers"}
	tagAdmin   = []string{"Admin"}
)

func registerOwnerOperations(api huma.API, s *Service) {
	huma.Register(api, huma.Operation{
		OperationID: "openSeller", Method: http.MethodPost, Path: "/sellers",
		Summary: "Open a seller; it waits for an admin to activate it", Tags: tagSellers,
		Security: security, DefaultStatus: http.StatusCreated,
	}, func(ctx context.Context, in *struct{ Body detailsBody }) (*sellerOutput, error) {
		seller, err := s.Open(ctx, in.Body.details())
		if err != nil {
			return nil, err
		}

		return &sellerOutput{Body: toBody(seller)}, nil
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
		Summary: "Change a seller's details; only its owner may", Tags: tagSellers, Security: security,
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

func registerAdminOperations(api huma.API, s *Service) {
	huma.Register(api, huma.Operation{
		OperationID: "listSellersForAdmins", Method: http.MethodGet, Path: "/admin/sellers",
		Summary: "Sellers in a status, oldest first", Tags: tagAdmin, Security: security,
	}, func(ctx context.Context, in *struct {
		Status Status `query:"status" default:"pending" enum:"pending,active,blocked"`
		Limit  int    `query:"limit"  default:"50"      maximum:"100"                  minimum:"1"`
		Offset int    `query:"offset" default:"0"       minimum:"0"`
	},
	) (*sellersOutput, error) {
		sellers, err := s.ByStatus(ctx, in.Status, in.Limit, in.Offset)
		if err != nil {
			return nil, err
		}

		return toSellersOutput(sellers), nil
	})

	for _, action := range []struct {
		id, path, summary string
		do                func(context.Context, uuid.UUID) (Seller, error)
	}{
		{"activateSeller", "/admin/sellers/{sellerId}/activate", "Let a seller publish; also lifts a block", s.Activate},
		{"blockSeller", "/admin/sellers/{sellerId}/block", "Stop a seller from publishing", s.Block},
	} {
		huma.Register(api, huma.Operation{
			OperationID: action.id, Method: http.MethodPost, Path: action.path,
			Summary: action.summary, Tags: tagAdmin, Security: security,
		}, func(ctx context.Context, in *sellerPath) (*sellerOutput, error) {
			seller, err := action.do(ctx, in.SellerID)
			if err != nil {
				return nil, err
			}

			return &sellerOutput{Body: toBody(seller)}, nil
		})
	}
}
