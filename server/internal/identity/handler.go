package identity

import (
	"context"
	"net/http"
	"time"

	"github.com/danielgtaylor/huma/v2"
	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/platform"
)

type requestCodeInput struct {
	Body struct {
		Email string `json:"email" doc:"The address to send the code to" maxLength:"254" minLength:"3"`
	}
}

type requestCodeOutput struct {
	Body struct {
		ChallengeID uuid.UUID `json:"challengeId" doc:"Send it back with the code"`
		ExpiresAt   time.Time `json:"expiresAt"`
	}
}

type signInInput struct {
	Body struct {
		ChallengeID uuid.UUID `json:"challengeId"`
		Code        string    `json:"code"        pattern:"^[0-9]{6}$" doc:"The six digits of the email"`
	}
}

type accountBody struct {
	ID    uuid.UUID     `json:"id"`
	Email string        `json:"email"`
	Role  platform.Role `json:"role" enum:"customer,admin"`
}

type sessionOutput struct {
	Body struct {
		Token     string      `json:"token"     doc:"Send it as Authorization: Bearer <token>; it is shown only now"`
		ExpiresAt time.Time   `json:"expiresAt" doc:"The session ends then unless it is used; each use moves the end 30 days on"`
		Account   accountBody `json:"account"`
	}
}

type accountOutput struct {
	Body accountBody
}

func toAccountBody(a Account) accountBody {
	return accountBody(a)
}

// RegisterOperations adds the module's operations to api.
func RegisterOperations(api huma.API, s *Service) {
	security := []map[string][]string{{platform.SecurityBearer: {}}}

	huma.Register(api, huma.Operation{
		OperationID:   "requestSignInCode",
		Method:        http.MethodPost,
		Path:          "/auth/sign-in-codes",
		Summary:       "Email a six-digit sign-in code",
		Description:   "The answer is the same whether or not the address has an account.",
		Tags:          []string{"Sign-in"},
		DefaultStatus: http.StatusAccepted,
	}, func(ctx context.Context, in *requestCodeInput) (*requestCodeOutput, error) {
		c, err := s.RequestCode(ctx, in.Body.Email)
		if err != nil {
			return nil, err
		}

		out := &requestCodeOutput{}
		out.Body.ChallengeID = c.ID
		out.Body.ExpiresAt = c.ExpiresAt

		return out, nil
	})

	huma.Register(api, huma.Operation{
		OperationID:   "signIn",
		Method:        http.MethodPost,
		Path:          "/auth/sessions",
		Summary:       "Sign in with the emailed code",
		Description:   "Creates the account on its first sign-in.",
		Tags:          []string{"Sign-in"},
		DefaultStatus: http.StatusCreated,
	}, func(ctx context.Context, in *signInInput) (*sessionOutput, error) {
		session, err := s.SignIn(ctx, in.Body.ChallengeID, in.Body.Code)
		if err != nil {
			return nil, err
		}

		out := &sessionOutput{}
		out.Body.Token = session.Token
		out.Body.ExpiresAt = session.ExpiresAt
		out.Body.Account = toAccountBody(session.Account)

		return out, nil
	})

	huma.Register(api, huma.Operation{
		OperationID:   "signOut",
		Method:        http.MethodDelete,
		Path:          "/auth/sessions/current",
		Summary:       "Sign out: end the session of this token",
		Tags:          []string{"Sign-in"},
		Security:      security,
		DefaultStatus: http.StatusNoContent,
	}, func(ctx context.Context, _ *struct{}) (*struct{}, error) {
		return nil, s.SignOut(ctx)
	})

	huma.Register(api, huma.Operation{
		OperationID: "getMyAccount",
		Method:      http.MethodGet,
		Path:        "/accounts/me",
		Summary:     "The signed-in account",
		Tags:        []string{"Accounts"},
		Security:    security,
	}, func(ctx context.Context, _ *struct{}) (*accountOutput, error) {
		caller, err := platform.RequireCaller(ctx)
		if err != nil {
			return nil, err
		}

		a, err := s.Account(ctx, caller.AccountID)
		if err != nil {
			return nil, err
		}

		return &accountOutput{Body: toAccountBody(a)}, nil
	})
}
