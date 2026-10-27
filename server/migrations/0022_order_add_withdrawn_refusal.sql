-- A seller who withdraws an offer ends the orders still to collect on it; the
-- system refuses them with their own reason, which staff never choose (SEC-108).
-- +goose Up
ALTER TABLE order_orders DROP CONSTRAINT order_orders_refuse_reason_check;
ALTER TABLE order_orders ADD CONSTRAINT order_orders_refuse_reason_check
    CHECK (refuse_reason IN ('not_suitable', 'wrong_items', 'no_answer', 'no_show', 'late', 'sold_out', 'other', 'withdrawn'));

-- +goose Down
UPDATE order_orders SET refuse_reason = 'other' WHERE refuse_reason = 'withdrawn';

ALTER TABLE order_orders DROP CONSTRAINT order_orders_refuse_reason_check;
ALTER TABLE order_orders ADD CONSTRAINT order_orders_refuse_reason_check
    CHECK (refuse_reason IN ('not_suitable', 'wrong_items', 'no_answer', 'no_show', 'late', 'sold_out', 'other'));
