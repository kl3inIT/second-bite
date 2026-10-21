// Package audit keeps what admins did: which admin, to which store, account
// or setting, when, and the words they gave (SEC-75). It records only the
// actions of its catalog, each a Go type, so a detail no type declares cannot
// be written. An event is written in the transaction of the change it
// records: both are kept or neither is. The log is for developers; this trail
// is for whoever answers a complaint.
package audit

import (
	"context"
	"encoding/json"
	"fmt"
	"log/slog"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/kl3inIT/second-bite/server/internal/audit/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// Action is one kind of thing an admin did. The catalog is closed: only this
// package's types satisfy it, and a recorded name never changes meaning. The
// fields of an action are its details, written as JSON; none may hold a
// secret or personal data.
type Action interface {
	// action names it as subject.verb.
	action() string
}

// Resource is what an action was done to. Label names it as people read it at
// that moment, a store's name or an account's address, and is forgotten when
// it names a deleted account.
type Resource struct {
	Type  string
	ID    string
	Label string
}

// The resource types.
const (
	ResourceAccount = "account"
	ResourceSeller  = "seller"
)

// Service records admins' actions.
type Service struct {
	queries *db.Queries
	logger  *slog.Logger
}

// NewService assembles the module.
func NewService(pool *pgxpool.Pool, logger *slog.Logger) *Service {
	return &Service{queries: db.New(pool), logger: logger}
}

// Record writes one event in tx, the transaction of the change it records.
// The actor is the caller of ctx, none for the command line, and the request
// is ctx's. It also logs the event with identifiers only.
func (s *Service) Record(ctx context.Context, tx pgx.Tx, r Resource, a Action) error {
	details, err := json.Marshal(a)
	if err != nil {
		return fmt.Errorf("writing the details of %s: %w", a.action(), err)
	}

	params := db.InsertEventParams{
		Action:        a.action(),
		ResourceType:  r.Type,
		ResourceID:    r.ID,
		ResourceLabel: text(r.Label),
		Details:       details,
		RequestID:     text(platform.RequestID(ctx)),
	}

	if caller, ok := platform.CallerFrom(ctx); ok {
		params.ActorID = uuid.NullUUID{UUID: caller.AccountID, Valid: true}
		params.ActorLabel = text(caller.Label)
	}

	if err := s.queries.WithTx(tx).InsertEvent(ctx, params); err != nil {
		return fmt.Errorf("recording %s: %w", a.action(), err)
	}

	s.logger.InfoContext(ctx, "audit event recorded",
		slog.String("event", "audit.event.recorded"),
		slog.String("action", a.action()),
		slog.String("resource_type", r.Type),
		slog.String("resource_id", r.ID),
		slog.String("actor_id", params.ActorID.UUID.String()),
	)

	return nil
}

// ForgetAccount nulls the labels that name the account, as the actor or as
// what was acted on, in tx, the transaction that deletes it. Its identifier
// and its actions are kept.
func (s *Service) ForgetAccount(ctx context.Context, tx pgx.Tx, accountID uuid.UUID) error {
	q := s.queries.WithTx(tx)

	if err := q.ForgetActor(ctx, uuid.NullUUID{UUID: accountID, Valid: true}); err != nil {
		return fmt.Errorf("forgetting the account as an actor: %w", err)
	}

	if err := q.ForgetResource(ctx, accountID.String()); err != nil {
		return fmt.Errorf("forgetting the account as a resource: %w", err)
	}

	return nil
}

func text(s string) pgtype.Text {
	return pgtype.Text{String: s, Valid: s != ""}
}
