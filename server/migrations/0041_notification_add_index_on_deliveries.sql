-- Deleting a push subscription cascades to its deliveries, which are keyed by push first; this index finds them
-- without reading the table (SEC-167).
-- +goose Up
CREATE INDEX notification_push_deliveries_subscription_id ON notification_push_deliveries (subscription_id);

-- +goose Down
DROP INDEX notification_push_deliveries_subscription_id;
