package audit

import (
	"context"
	"encoding/json"
	"fmt"
	"slices"
	"strings"
	"time"
	"unicode/utf8"

	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/audit/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

const (
	// maxPageSize bounds one page of the trail.
	maxPageSize = 100
	// maxQueryRunes bounds what an admin searches for.
	maxQueryRunes = 100
)

// ErrListInvalid refuses filters out of bounds.
var ErrListInvalid = platform.NewFailure("AUDIT_LIST_INVALID", platform.CategoryValidation, platform.Words{
	VI: "Bộ lọc nhật ký không hợp lệ: kiểm tra hành động, khoảng thời gian, từ khoá tối đa 100 ký tự, trang từ 1 và cỡ trang từ 1 đến 100.",
	EN: "The log's filters are not valid: check the actions, the time range, a query of at most 100 characters, a page from 1 and a page size of 1 to 100.",
})

// Filter is what an admin reads the trail by.
type Filter struct {
	// Actions keeps the events of these names of the catalog; all when empty.
	Actions []string
	// ActorID keeps one admin's events; all when nil.
	ActorID *uuid.UUID
	// Since and Until bound when the events happened, Until excluded; open
	// when nil.
	Since, Until *time.Time
	// Query keeps the events whose admin or resource label holds it, or whose
	// resource it identifies.
	Query string
	// Page counts from 1; Size runs from 1 to 100.
	Page, Size int
}

// Event is one recorded action as admins read it. A label is empty when it
// named a deleted account; ActorID is nil for the command line.
type Event struct {
	ID            uuid.UUID
	OccurredAt    time.Time
	Action        string
	ActorID       *uuid.UUID
	ActorLabel    string
	ResourceType  string
	ResourceID    string
	ResourceLabel string
	Details       Details
}

// Details are the fields of every action of the catalog, each set only by
// the actions that have it.
type Details struct {
	Reason   string   `json:"reason,omitempty"`
	Source   string   `json:"source,omitempty"`
	Provider string   `json:"provider,omitempty"`
	Changes  []Change `json:"changes,omitempty"`
}

// Page is one page of the trail and how many events match in all.
type Page struct {
	Events []Event
	Total  int
}

// List answers one page of the events matching f, the latest first, to an
// admin.
func (s *Service) List(ctx context.Context, f Filter) (Page, error) {
	if _, err := platform.RequireAdmin(ctx); err != nil {
		return Page{}, err
	}

	params, err := f.params()
	if err != nil {
		return Page{}, err
	}

	rows, err := s.queries.ListEvents(ctx, params)
	if err != nil {
		return Page{}, fmt.Errorf("listing the audit events: %w", err)
	}

	page := Page{Events: make([]Event, 0, len(rows))}

	if len(rows) > 0 {
		page.Total = int(rows[0].Total)
	} else if params.SkipRows > 0 {
		// Past the end the window counts nothing; the total is still asked.
		total, err := s.queries.CountEvents(ctx, db.CountEventsParams{
			Actions: params.Actions, ActorID: params.ActorID, Since: params.Since, Until: params.Until, Query: params.Query,
		})
		if err != nil {
			return Page{}, fmt.Errorf("counting the audit events: %w", err)
		}

		page.Total = int(total)
	}

	for _, r := range rows {
		e := Event{
			ID: r.ID, OccurredAt: r.OccurredAt, Action: r.Action,
			ActorLabel: r.ActorLabel.String, ResourceType: r.ResourceType, ResourceID: r.ResourceID,
			ResourceLabel: r.ResourceLabel.String,
		}
		if r.ActorID.Valid {
			e.ActorID = &r.ActorID.UUID
		}

		if err := json.Unmarshal(r.Details, &e.Details); err != nil {
			return Page{}, fmt.Errorf("reading the details of event %s: %w", r.ID, err)
		}

		page.Events = append(page.Events, e)
	}

	return page, nil
}

func (f Filter) params() (db.ListEventsParams, error) {
	query := strings.TrimSpace(f.Query)

	names := ActionNames()
	for _, a := range f.Actions {
		if !slices.Contains(names, a) {
			return db.ListEventsParams{}, ErrListInvalid
		}
	}

	if f.Page < 1 || f.Size < 1 || f.Size > maxPageSize || utf8.RuneCountInString(query) > maxQueryRunes ||
		(f.Since != nil && f.Until != nil && !f.Since.Before(*f.Until)) {
		return db.ListEventsParams{}, ErrListInvalid
	}

	params := db.ListEventsParams{
		Actions:  f.Actions,
		Since:    f.Since,
		Until:    f.Until,
		Query:    escapeLike(query),
		SkipRows: int32((f.Page - 1) * f.Size), //nolint:gosec // bounded: a page is asked by a person
		MaxRows:  int32(f.Size),
	}
	if params.Actions == nil {
		params.Actions = []string{}
	}

	if f.ActorID != nil {
		params.ActorID = uuid.NullUUID{UUID: *f.ActorID, Valid: true}
	}

	return params, nil
}

// escapeLike makes s match itself in a LIKE pattern escaped by '\'.
func escapeLike(s string) string {
	return strings.NewReplacer(`\`, `\\`, `%`, `\%`, `_`, `\_`).Replace(s)
}
