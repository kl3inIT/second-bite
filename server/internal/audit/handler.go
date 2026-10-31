package audit

import (
	"context"
	"net/http"
	"time"

	"github.com/danielgtaylor/huma/v2"
	"github.com/google/uuid"
)

// listInput is what the trail is read by. The action enum is the catalog's
// names; a test keeps the two the same.
type listInput struct {
	Action  []string  `query:"action"  doc:"Keep these actions; every action when absent" enum:"offer_settings.change,email_settings.change,admin.grant,admin.revoke,seller.approve,seller.reject,seller.block,seller.unblock,seller.delete,seller.restore,seller.change_owner,review.hide,review.show,promotion.create,promotion.change,seller.mark_payout"`
	ActorID uuid.UUID `query:"actorId" doc:"Keep one admin's actions"`
	Since   time.Time `query:"since"   doc:"Keep what happened at or after this time"`
	Until   time.Time `query:"until"   doc:"Keep what happened before this time"`
	Q       string    `query:"q"       doc:"Words of the admin's or the resource's label, or the resource's identifier" maxLength:"100"`
	Page    int       `query:"page"    default:"1"  maximum:"10000" minimum:"1"`
	Size    int       `query:"size"    default:"25" minimum:"1" maximum:"100"`
}

type auditEventsOutput struct {
	Body struct {
		Items    []auditEventBody `json:"items"`
		Page     int              `json:"page"`
		PageSize int              `json:"pageSize"`
		Total    int              `json:"total"`
	}
}

type auditEventBody struct {
	ID         uuid.UUID `json:"id"`
	OccurredAt time.Time `json:"occurredAt"`
	Action     string    `json:"action"               enum:"offer_settings.change,email_settings.change,admin.grant,admin.revoke,seller.approve,seller.reject,seller.block,seller.unblock,seller.delete,seller.restore,seller.change_owner,review.hide,review.show,promotion.create,promotion.change,seller.mark_payout"`
	// ActorID is absent for the command line; the label also when the
	// admin's account was deleted.
	ActorID       *uuid.UUID       `json:"actorId,omitempty"`
	ActorLabel    string           `json:"actorLabel,omitempty"`
	ResourceType  string           `json:"resourceType"         enum:"account,seller,order,offer_settings,email_settings,promotion"`
	ResourceID    string           `json:"resourceId"`
	ResourceLabel string           `json:"resourceLabel,omitempty" doc:"The store's name, the account's address or the order's number at the time; absent once that account is deleted"`
	Details       auditDetailsBody `json:"details"`
}

type auditDetailsBody struct {
	Reason    string            `json:"reason,omitempty"   doc:"What the owner was told, for a rejection or a block; the admin's reason, for a hidden review"`
	Source    string            `json:"source,omitempty"   doc:"Where a change of admins came from" enum:"admin,command_line"`
	Provider  string            `json:"provider,omitempty" doc:"Who delivers email after the change" enum:"smtp,brevo"`
	Changes   []auditChangeBody `json:"changes,omitempty"  doc:"The settings changed"`
	Name      string            `json:"name,omitempty"      doc:"The name of a promotion set up"`
	WeekStart string            `json:"weekStart,omitempty" doc:"The Monday of a week of discounts marked paid"`
	AmountVND int64             `json:"amountVnd,omitempty" doc:"The amount marked paid"`
}

type auditChangeBody struct {
	Field string  `json:"field"`
	From  *string `json:"from,omitempty" doc:"The value before; absent for a secret or the SMTP user"`
	To    *string `json:"to,omitempty"   doc:"The value after; absent likewise"`
}

// RegisterAdminOperations adds the module's admin operations to admin, the
// group every admin operation is under.
func RegisterAdminOperations(admin huma.API, s *Service) {
	huma.Register(admin, huma.Operation{
		OperationID: "listAuditEvents", Method: http.MethodGet, Path: "/audit-events",
		Summary:     "What admins did, the latest first",
		Description: "Only the actions of the audit catalog are recorded. A page past the end is empty.",
	}, func(ctx context.Context, in *listInput) (*auditEventsOutput, error) {
		f := Filter{Actions: in.Action, Query: in.Q, Page: in.Page, Size: in.Size}
		if in.ActorID != uuid.Nil {
			f.ActorID = &in.ActorID
		}

		if !in.Since.IsZero() {
			f.Since = &in.Since
		}

		if !in.Until.IsZero() {
			f.Until = &in.Until
		}

		page, err := s.List(ctx, f)
		if err != nil {
			return nil, err
		}

		out := &auditEventsOutput{}
		out.Body.Items = make([]auditEventBody, 0, len(page.Events))
		out.Body.Page, out.Body.PageSize, out.Body.Total = in.Page, in.Size, page.Total

		for _, e := range page.Events {
			out.Body.Items = append(out.Body.Items, toBody(e))
		}

		return out, nil
	})
}

func toBody(e Event) auditEventBody {
	body := auditEventBody{
		ID: e.ID, OccurredAt: e.OccurredAt, Action: e.Action, ActorID: e.ActorID, ActorLabel: e.ActorLabel,
		ResourceType: e.ResourceType, ResourceID: e.ResourceID, ResourceLabel: e.ResourceLabel,
		Details: auditDetailsBody{
			Reason: e.Details.Reason, Source: e.Details.Source, Provider: e.Details.Provider, Name: e.Details.Name,
			WeekStart: e.Details.WeekStart, AmountVND: e.Details.AmountVND,
		},
	}

	for _, c := range e.Details.Changes {
		body.Details.Changes = append(body.Details.Changes, auditChangeBody(c))
	}

	return body
}
