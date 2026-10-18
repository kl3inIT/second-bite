-- A seller's photo, kept by media.
-- +goose Up
ALTER TABLE seller_sellers ADD COLUMN photo_id uuid;

-- +goose Down
ALTER TABLE seller_sellers DROP COLUMN photo_id;
