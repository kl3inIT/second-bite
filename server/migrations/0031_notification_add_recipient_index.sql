-- Forgetting a deleted account's emails finds them by address, folded (SEC-126); without this, the deletion scans
-- the whole table.
-- +goose Up
CREATE INDEX notification_emails_recipient ON notification_emails (lower(recipient));

-- +goose Down
DROP INDEX notification_emails_recipient;
