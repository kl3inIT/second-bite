package stats

import (
	"context"
	"net/http"

	"github.com/danielgtaylor/huma/v2"
	"zgo.at/isbot"

	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// viewInput is a page the browser shows. The request's address and headers are
// read by Resolve, since the contract names none of them.
type viewInput struct {
	Body struct {
		Path   string `json:"path"             doc:"The page's path, as the address bar shows it, such as /vi/sellers/{id}" maxLength:"300" minLength:"1"`
		Source string `json:"source,omitempty" doc:"utm_source of the address that opened the site, such as qr; anything else than 1 to 40 of a-z, 0-9, _ and - counts as none" maxLength:"100"`
	}

	address, userAgent string
	prefetch           bool
}

// Resolve reads who sent the view: the first address of X-Forwarded-For, as
// the site is reached only through the proxy, else the connection's; the
// browser; and whether it only fetched the page ahead.
func (in *viewInput) Resolve(ctx huma.Context) []error {
	in.address = platform.ClientAddressOf(ctx.Header("X-Forwarded-For"), ctx.RemoteAddr())
	in.userAgent = ctx.Header("User-Agent")

	header := http.Header{}

	for _, name := range []string{"Purpose", "Sec-Purpose", "X-Purpose", "X-Moz"} {
		if value := ctx.Header(name); value != "" {
			header.Set(name, value)
		}
	}

	in.prefetch = isbot.Prefetch(header)

	return nil
}

// RegisterOperations adds the module's operations to api.
func RegisterOperations(api huma.API, s *Service) {
	huma.Register(api, huma.Operation{
		OperationID:   "recordView",
		Method:        http.MethodPost,
		Path:          "/stats/views",
		Tags:          []string{"Stats"},
		DefaultStatus: http.StatusNoContent,
		Summary:       "Count a page on screen",
		Description: "Sent by the web when a page is shown, without a session. A bot or a prefetch is not counted, " +
			"and is answered the same.",
	}, func(ctx context.Context, in *viewInput) (*struct{}, error) {
		err := s.Record(ctx, Visit{
			Path: in.Body.Path, Source: in.Body.Source,
			Address: in.address, UserAgent: in.userAgent, Prefetch: in.prefetch,
		})

		return nil, err
	})
}
