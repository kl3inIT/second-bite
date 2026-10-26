-- A customer reports what went wrong with a collected or expired order, once,
-- and the seller's people answer it, once (SEC-84). The kinds are the codes the
-- web translates.
-- +goose Up
CREATE TABLE order_problems (
    order_id     uuid        PRIMARY KEY REFERENCES order_orders ON DELETE CASCADE,
    kind         text        NOT NULL CHECK (kind IN ('missing_item', 'wrong_item', 'poor_quality', 'store_closed')),
    note         text        NOT NULL DEFAULT '' CHECK (char_length(note) <= 500),
    reported_at  timestamptz NOT NULL DEFAULT now(),
    answer       text        CHECK (char_length(answer) BETWEEN 1 AND 500),
    answered_at  timestamptz,
    CHECK ((answer IS NULL) = (answered_at IS NULL))
);

-- +goose Down
DROP TABLE order_problems;
