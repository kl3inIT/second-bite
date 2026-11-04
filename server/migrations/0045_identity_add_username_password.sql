-- A person may sign in with a username and a password, and then has no email (SEC-193). An account has an email, or a
-- username with its password hash, or both. The username is 3 to 30 characters: lower case letters, digits, '.', '_'
-- and '-', the first and the last a letter or a digit. password_hash is an argon2id PHC string.
-- +goose Up
ALTER TABLE identity_accounts ALTER COLUMN email DROP NOT NULL;
ALTER TABLE identity_accounts
    ADD COLUMN username text UNIQUE CHECK (username ~ '^[a-z0-9][a-z0-9._-]{1,28}[a-z0-9]$'),
    ADD COLUMN password_hash text CHECK (password_hash <> ''),
    ADD CONSTRAINT identity_accounts_password_check CHECK ((username IS NULL) = (password_hash IS NULL)),
    ADD CONSTRAINT identity_accounts_way_in_check CHECK (email IS NOT NULL OR username IS NOT NULL);

ALTER TABLE identity_accounts
    DROP CONSTRAINT identity_accounts_last_sign_in_method_check,
    ADD CONSTRAINT identity_accounts_last_sign_in_method_check CHECK (last_sign_in_method IN ('code', 'google', 'password'));

-- The words the admins search by now hold the username too.
ALTER TABLE identity_accounts DROP COLUMN search_text;
ALTER TABLE identity_accounts
    ADD COLUMN search_text text GENERATED ALWAYS AS (
        identity_fold(coalesce(email, '') || ' ' || coalesce(username, '') || ' ' || display_name)
    ) STORED;

-- +goose Down
-- The accounts that have no email cannot be kept: they are deleted, with their sessions (a development convenience;
-- deployed environments only move forward).
DELETE FROM identity_accounts WHERE email IS NULL;
ALTER TABLE identity_accounts DROP COLUMN search_text;
ALTER TABLE identity_accounts
    ADD COLUMN search_text text GENERATED ALWAYS AS (identity_fold(email || ' ' || display_name)) STORED;
UPDATE identity_accounts SET last_sign_in_method = 'code' WHERE last_sign_in_method = 'password';
ALTER TABLE identity_accounts
    DROP CONSTRAINT identity_accounts_last_sign_in_method_check,
    ADD CONSTRAINT identity_accounts_last_sign_in_method_check CHECK (last_sign_in_method IN ('code', 'google'));
ALTER TABLE identity_accounts
    DROP CONSTRAINT identity_accounts_way_in_check,
    DROP CONSTRAINT identity_accounts_password_check,
    DROP COLUMN password_hash,
    DROP COLUMN username;
ALTER TABLE identity_accounts ALTER COLUMN email SET NOT NULL;
