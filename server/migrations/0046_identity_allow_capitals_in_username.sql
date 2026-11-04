-- A username keeps the capitals it was typed with, and two names that differ in case are two names (SEC-193): Lan and lan
-- are two accounts, and a sign-in must give the name exactly. The form of a username allows capitals as well as lower
-- case letters; accounts made before are all in lower case and stay valid.
-- +goose Up
ALTER TABLE identity_accounts
    DROP CONSTRAINT identity_accounts_username_check,
    ADD CONSTRAINT identity_accounts_username_check CHECK (username ~ '^[A-Za-z0-9][A-Za-z0-9._-]{1,28}[A-Za-z0-9]$');

-- +goose Down
-- A name with capitals goes back to lower case (a development convenience: two names that differed only in case would
-- then collide, and the later one fails the migration; deployed environments only move forward).
UPDATE identity_accounts SET username = lower(username) WHERE username <> lower(username);
ALTER TABLE identity_accounts
    DROP CONSTRAINT identity_accounts_username_check,
    ADD CONSTRAINT identity_accounts_username_check CHECK (username ~ '^[a-z0-9][a-z0-9._-]{1,28}[a-z0-9]$');
