-- Orders customers place for units of one seller's offers, their lines, and
-- every transition they went through.
-- +goose Up
CREATE TABLE order_orders (
    id                   uuid        PRIMARY KEY DEFAULT uuidv7(),
    -- What people read aloud and search for, shown as SB-<number>.
    number               bigint      GENERATED ALWAYS AS IDENTITY (START WITH 10001) UNIQUE,
    -- identity's account and seller's seller, without foreign keys across
    -- modules.
    customer_id          uuid        NOT NULL,
    seller_id            uuid        NOT NULL,
    -- Copied from the offers when ordered.
    seller_name          text        NOT NULL,
    latitude             double precision NOT NULL CHECK (latitude BETWEEN -90 AND 90),
    longitude            double precision NOT NULL CHECK (longitude BETWEEN -180 AND 180),
    address              text        NOT NULL,
    -- expired is read from the window's end, never stored.
    state                text        NOT NULL DEFAULT 'confirmed'
                                     CHECK (state IN ('confirmed', 'ready', 'collected', 'cancelled', 'refused')),
    window_start         timestamptz NOT NULL,
    window_end           timestamptz NOT NULL CHECK (window_end > window_start),
    total_vnd            bigint      NOT NULL CHECK (total_vnd > 0),
    idempotency_key      text        NOT NULL CHECK (char_length(idempotency_key) BETWEEN 1 AND 255),
    wrong_code_attempts  integer     NOT NULL DEFAULT 0 CHECK (wrong_code_attempts BETWEEN 0 AND 3),
    cancel_reason        text        NOT NULL DEFAULT '' CHECK (char_length(cancel_reason) <= 200),
    refuse_reason        text        CHECK (refuse_reason IN ('not_suitable', 'wrong_items', 'other')),
    refuse_note          text        NOT NULL DEFAULT '' CHECK (char_length(refuse_note) <= 200),
    created_at           timestamptz NOT NULL DEFAULT now(),
    ready_at             timestamptz,
    collected_at         timestamptz,
    cancelled_at         timestamptz,
    refused_at           timestamptz,
    UNIQUE (customer_id, idempotency_key),
    CHECK ((state = 'collected') = (collected_at IS NOT NULL)),
    CHECK ((state = 'cancelled') = (cancelled_at IS NOT NULL)),
    CHECK ((state = 'refused') = (refused_at IS NOT NULL AND refuse_reason IS NOT NULL))
);

CREATE INDEX order_orders_customer ON order_orders (customer_id, created_at DESC);
CREATE INDEX order_orders_seller ON order_orders (seller_id, window_start);

CREATE TABLE order_lines (
    order_id            uuid        NOT NULL REFERENCES order_orders ON DELETE CASCADE,
    -- offer's offer, without a foreign key across modules.
    offer_id            uuid        NOT NULL,
    -- Copied from the offer when ordered.
    name                text        NOT NULL,
    unit                text        NOT NULL,
    price_vnd           bigint      NOT NULL CHECK (price_vnd > 0),
    original_price_vnd  bigint      NOT NULL CHECK (original_price_vnd > price_vnd),
    photo_id            uuid        NOT NULL,
    units               integer     NOT NULL CHECK (units BETWEEN 1 AND 999),
    PRIMARY KEY (order_id, offer_id)
);

CREATE TABLE order_events (
    id          bigint      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id    uuid        NOT NULL REFERENCES order_orders ON DELETE CASCADE,
    kind        text        NOT NULL CHECK (kind IN ('placed', 'ready', 'collected', 'cancelled', 'refused', 'code_wrong')),
    -- identity's account, without a foreign key across modules.
    actor_id    uuid        NOT NULL,
    at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX order_events_order ON order_events (order_id, at);

-- +goose Down
DROP TABLE order_events;
DROP TABLE order_lines;
DROP TABLE order_orders;
