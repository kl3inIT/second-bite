-- Food given away free: an offer may cost 0 đồng, any other price staying at 1,000 or more, and an order of free food
-- comes to 0. An offer and an order line still keep an original price above the price.
-- +goose Up
ALTER TABLE offer_offers
    DROP CONSTRAINT offer_offers_price_vnd_check,
    ADD CONSTRAINT offer_offers_price_vnd_check CHECK (price_vnd = 0 OR price_vnd >= 1000);

ALTER TABLE order_lines
    DROP CONSTRAINT order_lines_price_vnd_check,
    ADD CONSTRAINT order_lines_price_vnd_check CHECK (price_vnd >= 0);

ALTER TABLE order_orders
    DROP CONSTRAINT order_orders_total_vnd_check,
    ADD CONSTRAINT order_orders_total_vnd_check CHECK (total_vnd >= 0);

-- +goose Down
-- Free offers and orders posted meanwhile are kept: the old rules hold again for new rows only (NOT VALID).
ALTER TABLE order_orders
    DROP CONSTRAINT order_orders_total_vnd_check,
    ADD CONSTRAINT order_orders_total_vnd_check CHECK (total_vnd > 0) NOT VALID;

ALTER TABLE order_lines
    DROP CONSTRAINT order_lines_price_vnd_check,
    ADD CONSTRAINT order_lines_price_vnd_check CHECK (price_vnd > 0) NOT VALID;

ALTER TABLE offer_offers
    DROP CONSTRAINT offer_offers_price_vnd_check,
    ADD CONSTRAINT offer_offers_price_vnd_check CHECK (price_vnd >= 1000) NOT VALID;
