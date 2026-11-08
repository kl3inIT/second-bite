-- Limits on what one person holds (SEC-158), beside the cap per order of each post (0047). The order settings bound
-- the orders still to collect of one phone number at a store, and refuse a phone number that missed orders lately.
-- The first values are Đạt's of 8 November 2026: 2 open orders per phone number at a store, and 3 missed in 30 days.
-- +goose Up
CREATE TABLE order_settings (
    id                        smallint    PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    open_per_phone_per_seller integer     NOT NULL CHECK (open_per_phone_per_seller BETWEEN 1 AND 20),
    missed_limit              integer     NOT NULL CHECK (missed_limit BETWEEN 1 AND 20),
    missed_days               integer     NOT NULL CHECK (missed_days BETWEEN 1 AND 60),
    updated_at                timestamptz NOT NULL DEFAULT now(),
    updated_by                uuid
);
INSERT INTO order_settings (open_per_phone_per_seller, missed_limit, missed_days) VALUES (2, 3, 30);

-- The open orders of a phone number at a store; a phone number's orders by the end of their window, for the ones it
-- missed.
CREATE INDEX order_orders_open_phone ON order_orders (seller_id, customer_phone) WHERE state IN ('confirmed', 'ready');
CREATE INDEX order_orders_phone_window ON order_orders (customer_phone, window_end);

-- +goose Down
DROP INDEX order_orders_phone_window;
DROP INDEX order_orders_open_phone;

DROP TABLE order_settings;
