-- Promotions an admin runs: a discount taken off an order when it is placed (buyer-discount increment). A promotion
-- runs from starts_at to ends_at for every seller or those listed, within a budget and a number of discounts per phone
-- number and day (0 for no limit); its rules, each conditions and a reward, are JSON the module checks. An order copies
-- the promotion, the rule's name, whether its customer was new and the discount it took. What a budget has used is
-- read from the orders' states, so a cancelled, refused or expired order gives its discount back. A payout marks a
-- seller's week of discounts as paid back to it.
-- +goose Up
CREATE TABLE order_promotions (
    id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    name              text        NOT NULL CHECK (char_length(name) BETWEEN 1 AND 80),
    starts_at         timestamptz NOT NULL,
    ends_at           timestamptz NOT NULL,
    all_sellers       boolean     NOT NULL DEFAULT true,
    budget_vnd        bigint      NOT NULL CHECK (budget_vnd BETWEEN 1 AND 10000000000),
    per_phone_per_day integer     NOT NULL DEFAULT 0 CHECK (per_phone_per_day BETWEEN 0 AND 100),
    enabled           boolean     NOT NULL DEFAULT true,
    rules             jsonb       NOT NULL CHECK (jsonb_typeof(rules) = 'array'),
    created_at        timestamptz NOT NULL DEFAULT now(),
    updated_at        timestamptz NOT NULL DEFAULT now(),
    CHECK (ends_at > starts_at)
);

CREATE INDEX order_promotions_running ON order_promotions (ends_at) WHERE enabled;

CREATE TABLE order_promotion_sellers (
    promotion_id uuid NOT NULL REFERENCES order_promotions (id) ON DELETE CASCADE,
    seller_id    uuid NOT NULL,
    PRIMARY KEY (promotion_id, seller_id)
);

CREATE INDEX order_promotion_sellers_seller ON order_promotion_sellers (seller_id);

ALTER TABLE order_orders
    ADD COLUMN promotion_id       uuid    REFERENCES order_promotions (id),
    ADD COLUMN promotion_name     text    NOT NULL DEFAULT '',
    ADD COLUMN promotion_rule     text    NOT NULL DEFAULT '',
    ADD COLUMN promotion_new      boolean NOT NULL DEFAULT false,
    ADD COLUMN discount_vnd       bigint  NOT NULL DEFAULT 0,
    ADD CONSTRAINT order_orders_discount_check CHECK (
        discount_vnd BETWEEN 0 AND total_vnd
        AND (promotion_id IS NULL) = (discount_vnd = 0)
    );

-- Whether a phone number has had an order handed over, and the discounts of a promotion by number and day.
CREATE INDEX order_orders_phone_collected ON order_orders (customer_phone) WHERE state = 'collected';
CREATE INDEX order_orders_promotion ON order_orders (promotion_id, customer_phone, created_at) WHERE promotion_id IS NOT NULL;

CREATE TABLE order_promotion_payouts (
    seller_id  uuid        NOT NULL,
    week_start date        NOT NULL CHECK (extract(isodow FROM week_start) = 1),
    amount_vnd bigint      NOT NULL CHECK (amount_vnd >= 0),
    paid_at    timestamptz NOT NULL DEFAULT now(),
    paid_by    uuid,
    PRIMARY KEY (seller_id, week_start)
);

-- +goose Down
DROP TABLE order_promotion_payouts;
DROP INDEX order_orders_promotion;
DROP INDEX order_orders_phone_collected;
ALTER TABLE order_orders
    DROP CONSTRAINT order_orders_discount_check,
    DROP COLUMN discount_vnd,
    DROP COLUMN promotion_new,
    DROP COLUMN promotion_rule,
    DROP COLUMN promotion_name,
    DROP COLUMN promotion_id;
DROP TABLE order_promotion_sellers;
DROP TABLE order_promotions;
