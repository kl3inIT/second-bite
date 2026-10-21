-- A dish may keep what it normally sells for, which a post starts from; the post still sets its own.
-- +goose Up
ALTER TABLE offer_dishes ADD COLUMN original_price_vnd bigint CHECK (original_price_vnd > 1000);

-- +goose Down
ALTER TABLE offer_dishes DROP COLUMN original_price_vnd;
