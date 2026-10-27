-- What a store's people tell the team, for the sponsor's check K-03 (SEC-82). It
-- keeps the store, not who wrote it, so an account's deletion leaves nothing to
-- forget here.
-- +goose Up
CREATE TABLE seller_feedback (
    id          uuid        PRIMARY KEY DEFAULT uuidv7(),
    seller_id   uuid        NOT NULL REFERENCES seller_sellers ON DELETE CASCADE,
    body        text        NOT NULL CHECK (char_length(body) BETWEEN 1 AND 1000),
    created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX seller_feedback_created ON seller_feedback (created_at DESC);
CREATE INDEX seller_feedback_seller_created ON seller_feedback (seller_id, created_at DESC);

-- +goose Down
DROP TABLE seller_feedback;
