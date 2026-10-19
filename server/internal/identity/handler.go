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

// sessionAsCookie asks a sign-in for the session in the cookie (the web)
// rather than as a token in the body (the mobile application).
const sessionAsCookie = "cookie"

// tagSignIn groups the sign-in operations in the contract.
var tagSignIn = []string{"Sign-in"}

type signInInput struct {
	Body struct {
		ChallengeID uuid.UUID `json:"challengeId"`
		Code        string    `json:"code"              pattern:"^[0-9]{6}$" doc:"The six digits of the email"`
		Session     string    `json:"session,omitempty" enum:"token,cookie" default:"token" doc:"token: the token in the body (the mobile application); cookie: the session cookie instead (the web)"`
	}
}

type accountBody struct {
	ID          uuid.UUID     `json:"id"`
	Email       string        `json:"email"`
	Role        platform.Role `json:"role"        enum:"customer,admin"`
	DisplayName string        `json:"displayName" doc:"Empty until Google gives one or the person sets it"`
}

type sessionOutput struct {
	SetCookie []http.Cookie `header:"Set-Cookie" doc:"The session cookie, when it was asked for"`
	Body      struct {
		Token     string      `json:"token,omitempty" doc:"Send it as Authorization: Bearer <token>; it is shown only now, and not when the cookie was asked for"`
		ExpiresAt time.Time   `json:"expiresAt"       doc:"The session ends then unless it is used; each use moves the end 30 days on"`
		Account   accountBody `json:"account"`
	}
}

type googleSignInInput struct {
	Body struct {
		IDToken string `json:"idToken"         minLength:"1" maxLength:"8192" doc:"The ID token Google's sign-in handed the page or the application"`
		Nonce   string `json:"nonce,omitempty" maxLength:"256" doc:"The value whose SHA-256 was given to Google as the nonce; required when the token carries one"`
		Session string `json:"session,omitempty" enum:"token,cookie" default:"token" doc:"token: the token in the body (the mobile application); cookie: the session cookie instead (the web)"`
	}
}

type methodsOutput struct {
	Body struct {
		Google *googleMethodBody `json:"google,omitempty" doc:"Present when signing in with Google is available"`
	}
}

type googleMethodBody struct {
	ClientID string `json:"clientId" doc:"The OAuth client ID the web's Google button uses"`
}

type signOutOutput struct {
	SetCookie []http.Cookie `header:"Set-Cookie" doc:"Clears the session cookie"`
}

// handOver puts session in out: in the cookie when asked, otherwise in the body.
func handOver(out *sessionOutput, session Session, as string) {
	if as == sessionAsCookie {
		out.SetCookie = []http.Cookie{sessionCookie(session.Token)}
	} else {
		out.Body.Token = session.Token
	}

	out.Body.ExpiresAt = session.ExpiresAt
	out.Body.Account = toAccountBody(session.Account)
}

type accountOutput struct {
	Body accountBody
}

func toAccountBody(a Account) accountBody {
	return accountBody(a)
}

// RegisterOperations adds the module's operations to api.
func RegisterOperations(api huma.API, s *Service) {
	security := platform.SignedIn()

	huma.Register(api, huma.Operation{
		OperationID:   "requestSignInCode",
		Method:        http.MethodPost,
		Path:          "/auth/sign-in-codes",
		Summary:       "Email a six-digit sign-in code",
		Description:   "The answer is the same whether or not the address has an account.",
		Tags:          tagSignIn,
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
		Description:   "Creates the account on its first sign-in. The web asks for the session in a cookie.",
		Tags:          tagSignIn,
		DefaultStatus: http.StatusCreated,
	}, func(ctx context.Context, in *signInInput) (*sessionOutput, error) {
		session, err := s.SignIn(ctx, in.Body.ChallengeID, in.Body.Code)
		if err != nil {
			return nil, err
		}

		out := &sessionOutput{}
		handOver(out, session, in.Body.Session)

		return out, nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "signInWithGoogle",
		Method:      http.MethodPost,
		Path:        "/auth/google",
		Summary:     "Sign in with Google's ID token",
		Description: "Creates the account on a first sign-in with a verified address, or links an account with the address when Google speaks for it " +
			"(gmail.com or a Google Workspace account); otherwise the person signs in with an emailed code.",
		Tags:          tagSignIn,
		DefaultStatus: http.StatusCreated,
	}, func(ctx context.Context, in *googleSignInInput) (*sessionOutput, error) {
		session, err := s.SignInWithGoogle(ctx, in.Body.IDToken, in.Body.Nonce)
		if err != nil {
			return nil, err
		}

		out := &sessionOutput{}
		handOver(out, session, in.Body.Session)

		return out, nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "getSignInMethods",
		Method:      http.MethodGet,
		Path:        "/auth/methods",
		Summary:     "The ways to sign in besides the emailed code",
		Tags:        tagSignIn,
	}, func(_ context.Context, _ *struct{}) (*methodsOutput, error) {
		out := &methodsOutput{}
		if id := s.GoogleClientID(); id != "" {
			out.Body.Google = &googleMethodBody{ClientID: id}
		}

		return out, nil
	})

	huma.Register(api, huma.Operation{
		OperationID:   "signOut",
		Method:        http.MethodDelete,
		Path:          "/auth/sessions/current",
		Summary:       "Sign out: end this session and clear its cookie",
		Tags:          tagSignIn,
		Security:      security,
		DefaultStatus: http.StatusNoContent,
	}, func(ctx context.Context, _ *struct{}) (*signOutOutput, error) {
		if err := s.SignOut(ctx); err != nil {
			return nil, err
		}

		return &signOutOutput{SetCookie: []http.Cookie{clearedCookie()}}, nil
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
