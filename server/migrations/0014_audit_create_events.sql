-- What admins did, kept for whoever answers a complaint (SEC-75). Only the
-- actions of the audit module's catalog are written, in the transaction of
-- the change. The module's code only inserts, and only nulls the labels that
-- name a deleted account; no other statement touches the table.
-- +goose Up
CREATE TABLE audit_events (
    id             uuid        PRIMARY KEY DEFAULT uuidv7(),
    occurred_at    timestamptz NOT NULL DEFAULT now(),
    action         text        NOT NULL CHECK (action ~ '^[a-z_]+\.[a-z_]+$'),
    -- The admin; NULL for the command line. No foreign key: the account can
    -- be deleted, and its actions stay.
    actor_id       uuid,
    actor_label    text,
    resource_type  text        NOT NULL CHECK (resource_type ~ '^[a-z_]+$'),
    resource_id    text        NOT NULL CHECK (char_length(resource_id) BETWEEN 1 AND 64),
    resource_label text,
    details        jsonb       NOT NULL DEFAULT '{}' CHECK (jsonb_typeof(details) = 'object'),
    request_id     text        CHECK (char_length(request_id) <= 64)
);

CREATE INDEX audit_events_recent ON audit_events (occurred_at DESC, id DESC);
CREATE INDEX audit_events_resource ON audit_events (resource_type, resource_id, occurred_at DESC);
CREATE INDEX audit_events_actor ON audit_events (actor_id, occurred_at DESC) WHERE actor_id IS NOT NULL;

-- +goose Down
DROP TABLE audit_events;
