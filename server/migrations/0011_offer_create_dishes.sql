-- The seller's catalog: the stable base of a dish, which a post copies.
-- +goose Up
CREATE TABLE offer_dishes (
    id           uuid        PRIMARY KEY DEFAULT uuidv7(),
    -- seller's seller, identity's account and file's photo, without foreign keys across modules.
    seller_id    uuid        NOT NULL,
    created_by   uuid        NOT NULL,
    name         text        NOT NULL CHECK (char_length(name) BETWEEN 1 AND 80),
    kind         text        NOT NULL CHECK (kind IN ('bakery', 'prepared_food', 'ingredients', 'drinks', 'mixed_box', 'other')),
    unit         text        NOT NULL CHECK (char_length(unit) BETWEEN 1 AND 20),
    description  text        NOT NULL DEFAULT '' CHECK (char_length(description) <= 1000),
    ingredients  text        NOT NULL DEFAULT '' CHECK (char_length(ingredients) <= 500),
    photo_id     uuid        NOT NULL,
    hidden       boolean     NOT NULL DEFAULT false,
    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX offer_dishes_seller ON offer_dishes (seller_id, created_at DESC);

-- +goose Down
DROP TABLE offer_dishes;
