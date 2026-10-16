-- Accounts, the emailed sign-in codes they ask for, and their sessions.
-- +goose Up
CREATE TABLE identity_accounts (
    id          uuid        PRIMARY KEY DEFAULT uuidv7(),
    email       text        NOT NULL UNIQUE CHECK (email = lower(email)),
    role        text        NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'operator')),
    created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE identity_sign_in_challenges (
    id               uuid        PRIMARY KEY DEFAULT uuidv7(),
    email            text        NOT NULL CHECK (email = lower(email)),
    code_hash        bytea       NOT NULL,
    failed_attempts  integer     NOT NULL DEFAULT 0 CHECK (failed_attempts >= 0),
    expires_at       timestamptz NOT NULL,
    created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX identity_sign_in_challenges_email_created_at ON identity_sign_in_challenges (email, created_at);

CREATE TABLE identity_sessions (
    id            uuid        PRIMARY KEY DEFAULT uuidv7(),
    account_id    uuid        NOT NULL REFERENCES identity_accounts (id) ON DELETE CASCADE,
    token_hash    bytea       NOT NULL UNIQUE,
    created_at    timestamptz NOT NULL DEFAULT now(),
    last_seen_at  timestamptz NOT NULL DEFAULT now(),
    expires_at    timestamptz NOT NULL
);

CREATE INDEX identity_sessions_account_id ON identity_sessions (account_id);

-- +goose Down
DROP TABLE identity_sessions;
DROP TABLE identity_sign_in_challenges;
DROP TABLE identity_accounts;
