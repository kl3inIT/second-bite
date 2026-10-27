-- Three more kinds of food, and the name a seller gives a dish of the kind "other" (SEC-175).
-- +goose Up
ALTER TABLE offer_offers DROP CONSTRAINT offer_offers_kind_check;
ALTER TABLE offer_offers ADD CONSTRAINT offer_offers_kind_check
    CHECK (kind IN ('bakery', 'prepared_food', 'ingredients', 'drinks', 'mixed_box', 'dessert', 'snacks', 'produce', 'other'));
ALTER TABLE offer_offers ADD COLUMN kind_label text NOT NULL DEFAULT ''
    CHECK (char_length(kind_label) <= 30 AND (kind = 'other' OR kind_label = ''));

ALTER TABLE offer_dishes DROP CONSTRAINT offer_dishes_kind_check;
ALTER TABLE offer_dishes ADD CONSTRAINT offer_dishes_kind_check
    CHECK (kind IN ('bakery', 'prepared_food', 'ingredients', 'drinks', 'mixed_box', 'dessert', 'snacks', 'produce', 'other'));
ALTER TABLE offer_dishes ADD COLUMN kind_label text NOT NULL DEFAULT ''
    CHECK (char_length(kind_label) <= 30 AND (kind = 'other' OR kind_label = ''));

-- +goose Down
ALTER TABLE offer_dishes DROP COLUMN kind_label;
ALTER TABLE offer_offers DROP COLUMN kind_label;
