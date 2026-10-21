-- Admins list every seller's offers, newest first, and by the day they were posted (SEC-134); the seller's
-- index serves one seller only.
-- +goose Up
CREATE INDEX offer_offers_created ON offer_offers (created_at DESC);

-- +goose Down
DROP INDEX offer_offers_created;
