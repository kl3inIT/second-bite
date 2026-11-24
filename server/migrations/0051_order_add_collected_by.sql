-- Who confirmed that an order was collected: the seller's people, pressing "Đã giao" at the counter, or its
-- customer, confirming "Đã nhận món" on their order's page (customer-confirms-collection increment). Every
-- order collected before this was handed over by staff.
-- +goose Up
ALTER TABLE order_orders ADD COLUMN collected_by text CHECK (collected_by IN ('seller', 'customer'));

UPDATE order_orders SET collected_by = 'seller' WHERE state = 'collected';

ALTER TABLE order_orders ADD CONSTRAINT order_orders_collected_by_state
    CHECK ((state = 'collected') = (collected_by IS NOT NULL));

-- +goose Down
-- The orders customers confirmed stay collected; only who confirmed them is lost.
ALTER TABLE order_orders DROP COLUMN collected_by;
