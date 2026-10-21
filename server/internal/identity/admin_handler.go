package identity

import (
	"context"
	"net/http"
	"time"

	"github.com/danielgtaylor/huma/v2"
	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// recordBody is an account as admins see it.
type recordBody struct {
	accountBody

	CreatedAt        time.Time  `json:"createdAt"`
	LastSignedInAt   *time.Time `json:"lastSignedInAt,omitempty"   doc:"Absent until it signs in"`
	LastSignInMethod string     `json:"lastSignInMethod,omitempty" doc:"How it last signed in: an emailed code or Google" enum:"code,google"`
}

func toRecordBody(r Record) recordBody {
	return recordBody{
		accountBody: toAccountBody(r.Account), CreatedAt: r.CreatedAt,
		LastSignedInAt: r.LastSignedInAt, LastSignInMethod: r.LastSignInMethod,
	}
}

type adminsOutput struct {
	Body struct {
		Admins []recordBody `json:"admins" doc:"Every admin, by address"`
	}
}

type roleCountsBody struct {
	Customer int `json:"customer"`
	Admin    int `json:"admin"`
}

type adminAccountsOutput struct {
	Body struct {
		Items    []recordBody   `json:"items"`
		Page     int            `json:"page"`
		PageSize int            `json:"pageSize"`
		Total    int            `json:"total"  doc:"How many accounts match the role and the words"`
		Counts   roleCountsBody `json:"counts" doc:"How many accounts of each role match the words, whatever the role asked"`
	}
}

type recordOutput struct {
	Body recordBody
}

type accountPath struct {
	AccountID uuid.UUID `path:"accountId"`
}

// RegisterAdminOperations adds the module's admin operations to admin, the
// group platform.NewAdminGroup returns; their paths omit its prefix.
func RegisterAdminOperations(admin huma.API, s *Service) {
	huma.Register(admin, huma.Operation{
		OperationID: "listAdmins", Method: http.MethodGet, Path: "/admins",
		Summary: "Every admin, by address",
	}, func(ctx context.Context, _ *struct{}) (*adminsOutput, error) {
		admins, err := s.Admins(ctx)
		if err != nil {
			return nil, err
		}

		out := &adminsOutput{}
		out.Body.Admins = make([]recordBody, 0, len(admins))

		for _, a := range admins {
			out.Body.Admins = append(out.Body.Admins, toRecordBody(a))
		}

		return out, nil
	})

	huma.Register(admin, huma.Operation{
		OperationID: "listAccounts", Method: http.MethodGet, Path: "/accounts",
		Summary: "Accounts by role and words, the newest first",
		Description: "q matches the address or the name, Vietnamese marks ignored. " +
			"Sorted by last sign-in, those never signed in come last. A page past the end is empty.",
	}, func(ctx context.Context, in *struct {
		Role string `query:"role" doc:"Keep this role; every role when absent" enum:"customer,admin"`
		Q    string `query:"q"    doc:"Words of the address or the name" maxLength:"100"`
		Sort string `query:"sort" doc:"name, created or signedIn; a leading - is descending; the newest first when absent" enum:"name,-name,created,-created,signedIn,-signedIn"`
		Page int    `query:"page" default:"1" minimum:"1"`
		Size int    `query:"size" default:"25" maximum:"100" minimum:"1"`
	},
	) (*adminAccountsOutput, error) {
		page, err := s.ListAccounts(ctx, AccountFilter{
			Role: platform.Role(in.Role), Query: in.Q, Sort: in.Sort, Page: in.Page, Size: in.Size,
		})
		if err != nil {
			return nil, err
		}

		out := &adminAccountsOutput{}
		out.Body.Items = make([]recordBody, 0, len(page.Accounts))
		out.Body.Page, out.Body.PageSize, out.Body.Total = in.Page, in.Size, page.Total
		out.Body.Counts = roleCountsBody{
			Customer: page.Counts[platform.RoleCustomer], Admin: page.Counts[platform.RoleAdmin],
		}

		for _, r := range page.Accounts {
			out.Body.Items = append(out.Body.Items, toRecordBody(r))
		}

		return out, nil
	})

	huma.Register(admin, huma.Operation{
		OperationID: "getAccountForAdmins", Method: http.MethodGet, Path: "/accounts/{accountId}",
		Summary: "An account, with when and how it last signed in",
	}, func(ctx context.Context, in *accountPath) (*recordOutput, error) {
		r, err := s.AccountForAdmins(ctx, in.AccountID)
		if err != nil {
			return nil, err
		}

		return &recordOutput{Body: toRecordBody(r)}, nil
	})

	huma.Register(admin, huma.Operation{
		OperationID: "grantAdmin", Method: http.MethodPost, Path: "/admins",
		Summary: "Make the account of an address an admin",
		Description: "Creates the account when the address has never signed in; its owner signs in with an emailed code. " +
			"Granting an admin again changes nothing.",
	}, func(ctx context.Context, in *struct {
		Body struct {
			Email string `json:"email" doc:"The address of the account" maxLength:"254" minLength:"3"`
		}
	},
	) (*accountOutput, error) {
		a, err := s.GrantAdmin(ctx, in.Body.Email)
		if err != nil {
			return nil, err
		}

		return &accountOutput{Body: toAccountBody(a)}, nil
	})

	huma.Register(admin, huma.Operation{
		OperationID: "revokeAdmin", Method: http.MethodPost, Path: "/admins/{accountId}/revoke",
		Summary: "Make an admin a customer again; never oneself nor the last admin",
		Description: "The account's next request is a customer's; its sessions stay. " +
			"Revoking a customer changes nothing.",
	}, func(ctx context.Context, in *accountPath) (*accountOutput, error) {
		a, err := s.RevokeAdmin(ctx, in.AccountID)
		if err != nil {
			return nil, err
		}

		return &accountOutput{Body: toAccountBody(a)}, nil
	})
}
