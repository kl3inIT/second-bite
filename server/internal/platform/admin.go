package platform

import (
	"net/http"

	"github.com/danielgtaylor/huma/v2"
)

// AdminPrefix is the path every admin operation is registered under.
const AdminPrefix = "/admin"

// NewAdminGroup returns the group of api that every admin operation is
// registered on, its paths written without the prefix (SEC-75). The group
// tags each operation Admin, documents that it needs a session, and refuses a
// caller who is not an admin before the request is read, so a customer never
// learns how an admin operation validates its input. The service still checks
// with RequireAdmin: the group keeps every admin route in one place, the
// service decides.
func NewAdminGroup(api huma.API) huma.API {
	g := huma.NewGroup(api, AdminPrefix)

	g.UseSimpleModifier(func(o *huma.Operation) {
		o.Tags = []string{"Admin"}
		o.Security = SignedIn()
	})

	g.UseMiddleware(func(ctx huma.Context, next func(huma.Context)) {
		if _, err := RequireAdmin(ctx.Context()); err != nil {
			// The status comes from the failure; huma logs a response it
			// could not write, and nothing is left to tell the client.
			_ = huma.WriteErr(api, ctx, http.StatusForbidden, "", err)

			return
		}

		next(ctx)
	})

	return g
}
