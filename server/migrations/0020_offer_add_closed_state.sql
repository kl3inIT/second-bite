-- A post whose collection window is over is closed in the table by a scheduled
-- job (SEC-96); reads still compare the window, so a post closes the moment its
-- window ends, not when the job next runs.
-- +goose Up
ALTER TABLE offer_offers DROP CONSTRAINT offer_offers_state_check;
ALTER TABLE offer_offers ADD CONSTRAINT offer_offers_state_check CHECK (state IN ('on_sale', 'withdrawn', 'closed'));

-- +goose Down
UPDATE offer_offers SET state = 'on_sale' WHERE state = 'closed';
ALTER TABLE offer_offers DROP CONSTRAINT offer_offers_state_check;
ALTER TABLE offer_offers ADD CONSTRAINT offer_offers_state_check CHECK (state IN ('on_sale', 'withdrawn'));
