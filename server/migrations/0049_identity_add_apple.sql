-- Signing in with Apple (SEC-38): Apple is a provider beside Google and a way in the admins' list names. A link to
-- Apple keeps the refresh token Apple answered at its last sign-in, sealed with AES-256-GCM, so the access can be
-- revoked when the link goes; no other provider has one.
-- +goose Up
ALTER TABLE identity_external_logins
    DROP CONSTRAINT identity_external_logins_provider_check,
    ADD CONSTRAINT identity_external_logins_provider_check CHECK (provider IN ('google', 'apple')),
    ADD COLUMN refresh_token_sealed bytea,
    ADD CONSTRAINT identity_external_logins_refresh_token_check CHECK (refresh_token_sealed IS NULL OR provider = 'apple');

ALTER TABLE identity_accounts
    DROP CONSTRAINT identity_accounts_last_sign_in_method_check,
    ADD CONSTRAINT identity_accounts_last_sign_in_method_check CHECK (last_sign_in_method IN ('code', 'google', 'password', 'apple'));

-- +goose Down
UPDATE identity_accounts SET last_sign_in_method = 'code' WHERE last_sign_in_method = 'apple';
ALTER TABLE identity_accounts
    DROP CONSTRAINT identity_accounts_last_sign_in_method_check,
    ADD CONSTRAINT identity_accounts_last_sign_in_method_check CHECK (last_sign_in_method IN ('code', 'google', 'password'));

DELETE FROM identity_external_logins WHERE provider = 'apple';
ALTER TABLE identity_external_logins
    DROP CONSTRAINT identity_external_logins_refresh_token_check,
    DROP COLUMN refresh_token_sealed,
    DROP CONSTRAINT identity_external_logins_provider_check,
    ADD CONSTRAINT identity_external_logins_provider_check CHECK (provider IN ('google'));
