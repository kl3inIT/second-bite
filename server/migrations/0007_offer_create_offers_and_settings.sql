-- Offers sellers post, and the settings admins change for every offer.
-- +goose Up
CREATE TABLE offer_offers (
    id                  uuid        PRIMARY KEY DEFAULT uuidv7(),
    -- seller's seller and identity's account, without foreign keys across
    -- modules.
    seller_id           uuid        NOT NULL,
    posted_by           uuid        NOT NULL,
    state               text        NOT NULL DEFAULT 'on_sale' CHECK (state IN ('on_sale', 'withdrawn')),
    name                text        NOT NULL CHECK (char_length(name) BETWEEN 1 AND 80),
    description         text        NOT NULL DEFAULT '' CHECK (char_length(description) <= 1000),
    kind                text        NOT NULL CHECK (kind IN ('bakery', 'prepared_food', 'ingredients', 'drinks', 'mixed_box', 'other')),
    unit                text        NOT NULL CHECK (char_length(unit) BETWEEN 1 AND 20),
    units               integer     NOT NULL CHECK (units BETWEEN 1 AND 999),
    -- Never below zero, whatever orders take.
    units_left          integer     NOT NULL CHECK (units_left >= 0 AND units_left <= units),
    price_vnd           bigint      NOT NULL CHECK (price_vnd >= 1000),
    original_price_vnd  bigint      NOT NULL CHECK (original_price_vnd > price_vnd),
    weight_grams        integer     CHECK (weight_grams BETWEEN 1 AND 100000),
    -- file's photo, without a foreign key across modules.
    photo_id            uuid        NOT NULL,
    window_start        timestamptz NOT NULL,
    window_end          timestamptz NOT NULL CHECK (window_end > window_start),
    -- Copied from the seller when the offer is posted.
    latitude            double precision NOT NULL CHECK (latitude BETWEEN -90 AND 90),
    longitude           double precision NOT NULL CHECK (longitude BETWEEN -180 AND 180),
    location            geography(Point, 4326) GENERATED ALWAYS AS
                            (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography) STORED,
    address             text        NOT NULL,
    created_at          timestamptz NOT NULL DEFAULT now(),
    updated_at          timestamptz NOT NULL DEFAULT now(),
    withdrawn_at        timestamptz,
    CHECK ((state = 'withdrawn') = (withdrawn_at IS NOT NULL))
);

CREATE INDEX offer_offers_seller ON offer_offers (seller_id, created_at DESC);
CREATE INDEX offer_offers_seller_photo ON offer_offers (seller_id, photo_id);

CREATE TABLE offer_settings (
    id                       smallint    PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    min_discount_percent     integer     NOT NULL CHECK (min_discount_percent BETWEEN 0 AND 90),
    default_radius_km        integer     NOT NULL CHECK (default_radius_km >= 1),
    max_radius_km            integer     NOT NULL CHECK (max_radius_km BETWEEN default_radius_km AND 100),
    window_min_minutes       integer     NOT NULL CHECK (window_min_minutes >= 15),
    window_max_minutes       integer     NOT NULL CHECK (window_max_minutes BETWEEN window_min_minutes AND 1440),
    starts_within_hours      integer     NOT NULL CHECK (starts_within_hours BETWEEN 1 AND 72),
    updated_at               timestamptz NOT NULL DEFAULT now(),
    updated_by               uuid
);

-- The first values, decided with the team on 18 October 2026.
INSERT INTO offer_settings (min_discount_percent, default_radius_km, max_radius_km, window_min_minutes, window_max_minutes, starts_within_hours)
VALUES (20, 5, 30, 30, 360, 24);

-- +goose Down
DROP TABLE offer_settings;
DROP TABLE offer_offers;
