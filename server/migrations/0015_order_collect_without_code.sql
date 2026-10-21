-- Orders are collected without a four-digit code (SEC-86): staff hand an order
-- over against its QR code, or the collector's name and phone number, so
-- nothing counts wrong codes. The access that proves an order is theirs to
-- whoever placed it without signing in is stored with the order, random,
-- instead of derived under a secret key.
-- +goose Up
DELETE FROM order_events WHERE kind = 'code_wrong';
ALTER TABLE order_events DROP CONSTRAINT order_events_kind_check,
    ADD CONSTRAINT order_events_kind_check CHECK (kind IN ('placed', 'ready', 'collected', 'cancelled', 'refused'));
ALTER TABLE order_orders DROP COLUMN wrong_code_attempts,
    ADD COLUMN access text NOT NULL DEFAULT replace(gen_random_uuid()::text, '-', '');

-- +goose Down
ALTER TABLE order_orders DROP COLUMN access,
    ADD COLUMN wrong_code_attempts integer NOT NULL DEFAULT 0 CHECK (wrong_code_attempts BETWEEN 0 AND 3);
ALTER TABLE order_events DROP CONSTRAINT order_events_kind_check,
    ADD CONSTRAINT order_events_kind_check
        CHECK (kind IN ('placed', 'ready', 'collected', 'cancelled', 'refused', 'code_wrong'));
