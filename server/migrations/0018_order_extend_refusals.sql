-- The pilot's counter: a seller ends an order with the reason it did not
-- happen (no answer on the phone, no show, too late, out of food), and takes a
-- mistaken hand-over or cancellation back (SEC-78).
-- +goose Up
ALTER TABLE order_orders DROP CONSTRAINT order_orders_refuse_reason_check;
ALTER TABLE order_orders ADD CONSTRAINT order_orders_refuse_reason_check
    CHECK (refuse_reason IN ('not_suitable', 'wrong_items', 'no_answer', 'no_show', 'late', 'sold_out', 'other'));

ALTER TABLE order_events DROP CONSTRAINT order_events_kind_check;
ALTER TABLE order_events ADD CONSTRAINT order_events_kind_check
    CHECK (kind IN ('placed', 'ready', 'collected', 'cancelled', 'refused', 'reopened'));

-- +goose Down
DELETE FROM order_events WHERE kind = 'reopened';
UPDATE order_orders SET refuse_reason = 'other' WHERE refuse_reason IN ('no_answer', 'no_show', 'late', 'sold_out');

ALTER TABLE order_events DROP CONSTRAINT order_events_kind_check;
ALTER TABLE order_events ADD CONSTRAINT order_events_kind_check
    CHECK (kind IN ('placed', 'ready', 'collected', 'cancelled', 'refused'));

ALTER TABLE order_orders DROP CONSTRAINT order_orders_refuse_reason_check;
ALTER TABLE order_orders ADD CONSTRAINT order_orders_refuse_reason_check
    CHECK (refuse_reason IN ('not_suitable', 'wrong_items', 'other'));
