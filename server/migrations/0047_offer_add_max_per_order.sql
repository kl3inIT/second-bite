-- A post may cap the units of it one order takes (SEC-158); a post without its own cap takes the settings' default,
-- 5 to start. The store's cap wins over the default, above or below it.
-- +goose Up
ALTER TABLE offer_offers ADD COLUMN max_per_order integer CHECK (max_per_order BETWEEN 1 AND 999);

ALTER TABLE offer_settings
    ADD COLUMN default_max_per_order integer NOT NULL DEFAULT 5 CHECK (default_max_per_order BETWEEN 1 AND 999);

-- +goose Down
ALTER TABLE offer_settings DROP COLUMN default_max_per_order;

ALTER TABLE offer_offers DROP COLUMN max_per_order;
