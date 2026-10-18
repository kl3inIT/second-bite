-- Whether Google speaks for the address an identity was linked with
-- (gmail.com or a Workspace account). An emailed code proves the address and
-- removes the links Google does not speak for, against pre-hijacking (SEC-29).
-- +goose Up
ALTER TABLE identity_external_logins ADD COLUMN email_trusted boolean NOT NULL DEFAULT false;

UPDATE identity_external_logins SET email_trusted = true WHERE linked_email LIKE '%@gmail.com';

ALTER TABLE identity_external_logins ALTER COLUMN email_trusted DROP DEFAULT;

-- +goose Down
ALTER TABLE identity_external_logins DROP COLUMN email_trusted;
