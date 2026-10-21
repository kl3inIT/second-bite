-- What the admins' dashboard reads of offers: those posted in a range of
-- days, the newest first, and those still open now, which search reads too.
-- +goose Up
CREATE INDEX offer_offers_created_at ON offer_offers (created_at);
CREATE INDEX offer_offers_open ON offer_offers (window_end) WHERE state = 'on_sale';

-- +goose Down
DROP INDEX offer_offers_open;
DROP INDEX offer_offers_created_at;
