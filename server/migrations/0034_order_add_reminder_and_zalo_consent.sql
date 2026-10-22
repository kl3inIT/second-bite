-- SEC-25: when the customer was reminded that the window opens soon, so each order is reminded once; and when they
-- agreed at checkout to be told by Zalo, which waits for a legal entity to send from (none until then).
-- +goose Up
ALTER TABLE order_orders
    ADD COLUMN due_soon_at     timestamptz,
    ADD COLUMN zalo_consent_at timestamptz;

CREATE INDEX order_orders_due_soon ON order_orders (window_start)
    WHERE due_soon_at IS NULL AND state IN ('confirmed', 'ready');

-- +goose Down
DROP INDEX order_orders_due_soon;

ALTER TABLE order_orders
    DROP COLUMN zalo_consent_at,
    DROP COLUMN due_soon_at;
