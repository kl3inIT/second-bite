package order

import (
	"context"
	"net/http"
	"time"

	"github.com/danielgtaylor/huma/v2"
	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/platform"
)

type orderSettingsBody struct {
	OpenPerPhonePerSeller int        `json:"openPerPhonePerSeller" doc:"Orders still to collect one phone number may hold at a store" maximum:"20" minimum:"1"`
	OpenPerAddress        int        `json:"openPerAddress"        doc:"Orders still to collect that may have been placed from one address; loose, as a mall's Wi-Fi is shared" maximum:"500" minimum:"1"`
	MissedLimit           int        `json:"missedLimit"           doc:"Orders missed within missedDays that stop a phone number ordering" maximum:"20" minimum:"1"`
	MissedDays            int        `json:"missedDays"            doc:"The days missed orders are counted over; the block lifts as they pass" maximum:"60" minimum:"1"`
	UpdatedAt             *time.Time `json:"updatedAt,omitempty"   readOnly:"true"`
	UpdatedBy             *uuid.UUID `json:"updatedBy,omitempty"   readOnly:"true"`
}

type orderSettingsOutput struct {
	ETag string `header:"ETag" doc:"The settings' version, sent back in If-Match to save them"`
	Body orderSettingsBody
}

type saveOrderSettingsInput struct {
	IfMatch string `header:"If-Match" doc:"The ETag of the settings read" required:"true"`
	Body    orderSettingsBody
}

func toOrderSettingsOutput(set Settings) *orderSettingsOutput {
	return &orderSettingsOutput{ETag: platform.ETag(set.UpdatedAt), Body: orderSettingsBody{
		OpenPerPhonePerSeller: set.OpenPerPhonePerSeller, OpenPerAddress: set.OpenPerAddress,
		MissedLimit: set.MissedLimit, MissedDays: set.MissedDays, UpdatedAt: &set.UpdatedAt, UpdatedBy: set.UpdatedBy,
	}}
}

// registerAdminSettingsOperations adds the limits on what one person holds
// (SEC-158) to admin.
func registerAdminSettingsOperations(admin huma.API, s *Service) {
	huma.Register(admin, huma.Operation{
		OperationID: "getOrderSettings", Method: http.MethodGet, Path: "/order-settings",
		Summary: "The limits on the orders one person holds",
	}, func(ctx context.Context, _ *struct{}) (*orderSettingsOutput, error) {
		set, err := s.Settings(ctx)
		if err != nil {
			return nil, err
		}

		return toOrderSettingsOutput(set), nil
	})

	huma.Register(admin, huma.Operation{
		OperationID: "saveOrderSettings", Method: http.MethodPut, Path: "/order-settings",
		Summary: "Change the limits on the orders one person holds",
		Description: "New limits apply to orders placed after they are saved. " +
			"If-Match carries the ETag read; when someone saved since, the answer is 412 and nothing changes.",
	}, func(ctx context.Context, in *saveOrderSettingsInput) (*orderSettingsOutput, error) {
		version, ok := platform.VersionOf(in.IfMatch)
		if !ok {
			return nil, platform.ErrChangedSinceRead
		}

		set, err := s.SaveSettings(ctx, Settings{
			OpenPerPhonePerSeller: in.Body.OpenPerPhonePerSeller, OpenPerAddress: in.Body.OpenPerAddress,
			MissedLimit: in.Body.MissedLimit, MissedDays: in.Body.MissedDays,
		}, version)
		if err != nil {
			return nil, err
		}

		return toOrderSettingsOutput(set), nil
	})
}
