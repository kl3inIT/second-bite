-- A customer rates an order once it is collected (SEC-97): stars, some of a
-- fixed set of tags and an optional comment, one review for each order.
-- +goose Up
CREATE TABLE order_reviews (
    order_id    uuid        PRIMARY KEY REFERENCES order_orders ON DELETE CASCADE,
    stars       smallint    NOT NULL CHECK (stars BETWEEN 1 AND 5),
    -- Kept as the codes the web translates.
    tags        text[]      NOT NULL DEFAULT '{}'
                            CHECK (tags <@ ARRAY['fast_pickup', 'good_quality', 'good_variety', 'fair_portions']),
    comment     text        NOT NULL DEFAULT '' CHECK (char_length(comment) <= 500),
    created_at  timestamptz NOT NULL DEFAULT now()
);

-- +goose Down
DROP TABLE order_reviews;
