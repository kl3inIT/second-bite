-- Signing in with Google (SEC-29): the identities an account is linked to,
-- found by the provider's subject, and the name the account shows.
-- +goose Up
ALTER TABLE identity_accounts ADD COLUMN display_name text NOT NULL DEFAULT '';

CREATE TABLE identity_external_logins (
    id            uuid        PRIMARY KEY DEFAULT uuidv7(),
    account_id    uuid        NOT NULL REFERENCES identity_accounts (id) ON DELETE CASCADE,
    provider      text        NOT NULL CHECK (provider IN ('google')),
    subject       text        NOT NULL,
    linked_email  text        NOT NULL,
    name          text        NOT NULL DEFAULT '',
    picture_url   text        NOT NULL DEFAULT '',
    linked_at     timestamptz NOT NULL DEFAULT now(),
    last_used_at  timestamptz NOT NULL DEFAULT now(),
    UNIQUE (provider, subject)
);

CREATE INDEX identity_external_logins_account_id ON identity_external_logins (account_id);

-- +goose Down
DROP TABLE identity_external_logins;
ALTER TABLE identity_accounts DROP COLUMN display_name;
