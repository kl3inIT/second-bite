-- Admins read every review, the latest first, and hide one from every other
-- read or show it again (SEC-145). The reason is optional and kept here and
-- in the audit; hidden_by is the admin who hid it.
-- +goose Up
ALTER TABLE order_reviews
    ADD COLUMN hidden_at     timestamptz,
    ADD COLUMN hidden_by     uuid,
    ADD COLUMN hidden_reason text NOT NULL DEFAULT '' CHECK (char_length(hidden_reason) <= 500);

CREATE INDEX order_reviews_created ON order_reviews (created_at DESC);

-- +goose Down
DROP INDEX order_reviews_created;

ALTER TABLE order_reviews
    DROP COLUMN hidden_reason,
    DROP COLUMN hidden_by,
    DROP COLUMN hidden_at;
