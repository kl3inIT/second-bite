package identity

import (
	"context"
	"net/http"

	"github.com/danielgtaylor/huma/v2"
	"github.com/google/uuid"
)

type adminsOutput struct {
	Body struct {
		Admins []accountBody `json:"admins" doc:"Every admin, by address"`
	}
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
		out.Body.Admins = make([]accountBody, 0, len(admins))

		for _, a := range admins {
			out.Body.Admins = append(out.Body.Admins, toAccountBody(a))
		}

		return out, nil
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
