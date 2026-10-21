-- A dish and an offer show up to three photos: photo_id is the cover, and these are the others (SEC-119).
-- +goose Up
ALTER TABLE offer_dishes ADD COLUMN more_photo_ids uuid[] NOT NULL DEFAULT '{}' CHECK (cardinality(more_photo_ids) <= 2);
ALTER TABLE offer_offers ADD COLUMN more_photo_ids uuid[] NOT NULL DEFAULT '{}' CHECK (cardinality(more_photo_ids) <= 2);

-- +goose Down
ALTER TABLE offer_offers DROP COLUMN more_photo_ids;
ALTER TABLE offer_dishes DROP COLUMN more_photo_ids;
