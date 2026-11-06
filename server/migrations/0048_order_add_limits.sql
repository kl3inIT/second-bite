-- Limits on what one person holds (SEC-158), beside the cap per order of each post (0047). The order settings bound
-- the orders still to collect of one phone number at a store and of one address, and refuse a phone number that missed
-- orders lately. An order remembers whether it was large, so the store sees it marked, and the address it was placed
-- from while it is open; the address is emptied when the order ends. A store may refuse an order it suspects, which
-- gives its units back.
-- +goose Up
CREATE TABLE order_settings (
    id                        smallint    PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    open_per_phone_per_seller integer     NOT NULL CHECK (open_per_phone_per_seller BETWEEN 1 AND 20),
    open_per_address          integer     NOT NULL CHECK (open_per_address BETWEEN 1 AND 500),
    missed_limit              integer     NOT NULL CHECK (missed_limit BETWEEN 1 AND 20),
    missed_days               integer     NOT NULL CHECK (missed_days BETWEEN 1 AND 60),
    updated_at                timestamptz NOT NULL DEFAULT now(),
    updated_by                uuid
);
INSERT INTO order_settings (open_per_phone_per_seller, open_per_address, missed_limit, missed_days) VALUES (2, 20, 2, 7);

ALTER TABLE order_orders
    ADD COLUMN large       boolean NOT NULL DEFAULT false,
    ADD COLUMN placed_from text CHECK (char_length(placed_from) <= 64);

-- The open orders of a phone number at a store and of an address; a phone number's orders by the end of their window,
-- for the ones it missed.
CREATE INDEX order_orders_open_phone ON order_orders (seller_id, customer_phone) WHERE state IN ('confirmed', 'ready');
CREATE INDEX order_orders_open_address ON order_orders (placed_from) WHERE placed_from IS NOT NULL;
CREATE INDEX order_orders_phone_window ON order_orders (customer_phone, window_end);

ALTER TABLE order_orders DROP CONSTRAINT order_orders_refuse_reason_check;
ALTER TABLE order_orders ADD CONSTRAINT order_orders_refuse_reason_check
    CHECK (refuse_reason IN ('not_suitable', 'wrong_items', 'no_answer', 'no_show', 'late', 'sold_out', 'other', 'withdrawn',
                             'suspected'));

-- +goose Down
UPDATE order_orders SET refuse_reason = 'other' WHERE refuse_reason = 'suspected';

ALTER TABLE order_orders DROP CONSTRAINT order_orders_refuse_reason_check;
ALTER TABLE order_orders ADD CONSTRAINT order_orders_refuse_reason_check
    CHECK (refuse_reason IN ('not_suitable', 'wrong_items', 'no_answer', 'no_show', 'late', 'sold_out', 'other', 'withdrawn'));

DROP INDEX order_orders_phone_window;
DROP INDEX order_orders_open_address;
DROP INDEX order_orders_open_phone;

ALTER TABLE order_orders DROP COLUMN placed_from, DROP COLUMN large;

DROP TABLE order_settings;
