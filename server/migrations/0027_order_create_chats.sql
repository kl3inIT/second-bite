-- The chat of an order between its customer and its seller's people, and its
-- messages (SEC-117). One order has at most one chat, created by its first
-- message; its messages are numbered from 1 in the order they commit.
-- +goose Up
CREATE TABLE order_chats (
    order_id           uuid    PRIMARY KEY REFERENCES order_orders ON DELETE CASCADE,
    -- The number of the latest message; the next message takes the next one.
    last_seq           integer NOT NULL DEFAULT 0 CHECK (last_seq >= 0),
    -- The highest message each side has read, only ever raised.
    customer_seen_seq  integer NOT NULL DEFAULT 0,
    seller_seen_seq    integer NOT NULL DEFAULT 0,
    CHECK (customer_seen_seq BETWEEN 0 AND last_seq),
    CHECK (seller_seen_seq BETWEEN 0 AND last_seq)
);

CREATE TABLE order_messages (
    order_id         uuid        NOT NULL REFERENCES order_chats ON DELETE CASCADE,
    seq              integer     NOT NULL CHECK (seq > 0),
    -- A message comes from a side, not from a person: any of the seller's
    -- people writes as the seller.
    sender           text        NOT NULL CHECK (sender IN ('customer', 'seller')),
    body             text        NOT NULL CHECK (char_length(body) BETWEEN 1 AND 1000),
    idempotency_key  text        NOT NULL CHECK (char_length(idempotency_key) BETWEEN 1 AND 255),
    sent_at          timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (order_id, seq),
    UNIQUE (order_id, sender, idempotency_key)
);

-- Serves the bound on how many messages one side sends in a minute.
CREATE INDEX order_messages_sender_sent ON order_messages (order_id, sender, sent_at);

-- +goose Down
DROP TABLE order_messages;
DROP TABLE order_chats;
