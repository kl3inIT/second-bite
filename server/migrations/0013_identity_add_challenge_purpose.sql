-- What an emailed code is for (SEC-37): signing in, or confirming that the
-- account of the address is deleted. A code works only for its purpose.
-- +goose Up
ALTER TABLE identity_sign_in_challenges
    ADD COLUMN purpose text NOT NULL DEFAULT 'sign_in' CHECK (purpose IN ('sign_in', 'delete_account'));

-- +goose Down
ALTER TABLE identity_sign_in_challenges DROP COLUMN purpose;
