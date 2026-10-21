-- An order still to collect whose window is over is expired in the table by a
-- scheduled job, with an event of its own (SEC-96); reads still compare the
-- window, so an order expires the moment its window ends, not when the job next
-- runs.
-- +goose Up
ALTER TABLE order_orders DROP CONSTRAINT order_orders_state_check;
ALTER TABLE order_orders ADD CONSTRAINT order_orders_state_check
    CHECK (state IN ('confirmed', 'ready', 'collected', 'cancelled', 'refused', 'expired'));

ALTER TABLE order_events DROP CONSTRAINT order_events_kind_check;
ALTER TABLE order_events ADD CONSTRAINT order_events_kind_check
    CHECK (kind IN ('placed', 'ready', 'collected', 'cancelled', 'refused', 'reopened', 'expired'));

-- +goose Down
DELETE FROM order_events WHERE kind = 'expired';
UPDATE order_orders SET state = 'confirmed' WHERE state = 'expired';

ALTER TABLE order_events DROP CONSTRAINT order_events_kind_check;
ALTER TABLE order_events ADD CONSTRAINT order_events_kind_check
    CHECK (kind IN ('placed', 'ready', 'collected', 'cancelled', 'refused', 'reopened'));

ALTER TABLE order_orders DROP CONSTRAINT order_orders_state_check;
ALTER TABLE order_orders ADD CONSTRAINT order_orders_state_check
    CHECK (state IN ('confirmed', 'ready', 'collected', 'cancelled', 'refused'));
