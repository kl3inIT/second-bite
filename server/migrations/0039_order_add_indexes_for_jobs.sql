-- Indexes for the jobs that read orders often (SEC-167): expiring the orders still to collect each minute, finding
-- the open orders of an offer when it changes, and forgetting chats whose window ended long ago each night.
-- +goose Up
CREATE INDEX order_orders_open_window_end ON order_orders (window_end) WHERE state IN ('confirmed', 'ready');
CREATE INDEX order_orders_window_end ON order_orders (window_end);
CREATE INDEX order_lines_offer_id ON order_lines (offer_id);

-- +goose Down
DROP INDEX order_lines_offer_id;
DROP INDEX order_orders_window_end;
DROP INDEX order_orders_open_window_end;
