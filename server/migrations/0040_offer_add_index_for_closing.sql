-- An index for the job that closes, each minute, the offers on sale whose window is over (SEC-167).
-- +goose Up
CREATE INDEX offer_offers_on_sale_window_end ON offer_offers (window_end) WHERE state = 'on_sale';

-- +goose Down
DROP INDEX offer_offers_on_sale_window_end;
