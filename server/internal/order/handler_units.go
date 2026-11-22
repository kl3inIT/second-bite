package order

import (
	"context"
	"net/http"
	"time"

	"github.com/danielgtaylor/huma/v2"
	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/offer"
)

type offerUnitsOutput struct {
	Body struct {
		Posts           int `json:"posts"           doc:"Offers matching the filters"`
		Posted          int `json:"posted"          doc:"Their units"`
		Left            int `json:"left"            doc:"Units nobody holds: units_left of the offers"`
		Leftover        int `json:"leftover"        doc:"Of left, those on offers closed, withdrawn or whose window is over"`
		Collected       int `json:"collected"       doc:"Units handed over"`
		CollectedOrders int `json:"collectedOrders" doc:"Orders handed over that hold them"`
		Held            int `json:"held"            doc:"Units of orders still to collect, their window not over"`
		HeldOrders      int `json:"heldOrders"      doc:"Orders still to collect that hold them"`
		Missed          int `json:"missed"          doc:"Units of orders ended without a hand-over that did not come back: expired, or refused for anything but the customer not coming"`
		MissedOrders    int `json:"missedOrders"    doc:"Orders that lost them"`
	}
}

// registerAdminUnitsOperations adds what became of the units of the posts an
// admin lists, read with the same filters as listOffersForAdmins.
func registerAdminUnitsOperations(admin huma.API, s *Service) {
	huma.Register(admin, huma.Operation{
		OperationID: "getOfferUnitsForAdmins", Method: http.MethodGet, Path: "/offer-units",
		Summary: "What became of the units of every offer matching the posts list's filters",
		Description: "The filters are listOffersForAdmins's, without its page. Posted is left plus collected, held and missed: " +
			"units an order gave back (cancelled, or the customer did not come) are left again.",
	}, func(ctx context.Context, in *struct {
		Status   offer.Status `query:"status"      doc:"Keep this status; every status when absent" enum:"on_sale,sold_out,closed,withdrawn"`
		Q        string       `query:"q"           doc:"Words of the dish, the seller's name or the description" maxLength:"100"`
		SellerID uuid.UUID    `query:"sellerId"    doc:"Keep this seller's offers"`

		PostedSince time.Time `query:"postedSince" doc:"Keep the offers posted at or after this time"`
		PostedUntil time.Time `query:"postedUntil" doc:"Keep the offers posted before this time"`
	},
	) (*offerUnitsOutput, error) {
		f := offer.AdminFilter{Status: in.Status, Query: in.Q, SellerID: in.SellerID}
		if !in.PostedSince.IsZero() {
			f.PostedSince = &in.PostedSince
		}

		if !in.PostedUntil.IsZero() {
			f.PostedUntil = &in.PostedUntil
		}

		u, err := s.UnitsForAdmins(ctx, f)
		if err != nil {
			return nil, err
		}

		out := &offerUnitsOutput{}
		out.Body.Posts, out.Body.Posted, out.Body.Left, out.Body.Leftover = u.Posts, u.Posted, u.Left, u.Leftover
		out.Body.Collected, out.Body.CollectedOrders = u.Collected, u.CollectedOrders
		out.Body.Held, out.Body.HeldOrders = u.Held, u.HeldOrders
		out.Body.Missed, out.Body.MissedOrders = u.Missed, u.MissedOrders

		return out, nil
	})
}
