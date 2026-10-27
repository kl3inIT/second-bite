-- A live ticket proves its holder may follow one topic on the live socket
-- (SEC-117): 256 random bits, valid for seconds and used once. Only its
-- SHA-256 is stored, so any instance can redeem it and a copy of the table is
-- useless.
-- +goose Up
CREATE TABLE order_live_tickets (
    ticket_hash  bytea       PRIMARY KEY CHECK (octet_length(ticket_hash) = 32),
    -- order:{orderId} or seller:{sellerId}.
    topic        text        NOT NULL,
    expires_at   timestamptz NOT NULL
);

CREATE INDEX order_live_tickets_expires ON order_live_tickets (expires_at);

-- +goose Down
DROP TABLE order_live_tickets;
