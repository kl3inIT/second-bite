-- A customer follows a seller to find it again among their favourites (SEC-109).
-- An account is the identifier of identity's account; the table is identity's.
-- +goose Up
CREATE TABLE seller_follows (
    account_id  uuid        NOT NULL,
    seller_id   uuid        NOT NULL REFERENCES seller_sellers (id) ON DELETE CASCADE,
    created_at  timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (account_id, seller_id)
);

-- +goose Down
DROP TABLE seller_follows;
