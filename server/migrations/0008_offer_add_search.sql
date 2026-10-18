-- What customers search offers by: the words of an offer's name, its
-- seller's name and its description, written by the service with the
-- Vietnamese forms of each word (internal/offer/search_text.go), and the
-- distance to its collection point.
-- +goose Up
ALTER TABLE offer_offers
    -- Copied from the seller when the offer is posted, as the collection
    -- point is, for search; what customers see of a seller is read from it.
    ADD COLUMN seller_name   text     NOT NULL DEFAULT '',
    ADD COLUMN search_vector tsvector NOT NULL DEFAULT ''::tsvector;

CREATE INDEX offer_offers_search ON offer_offers USING gin (search_vector);
CREATE INDEX offer_offers_location ON offer_offers USING gist (location);

-- +goose Down
DROP INDEX offer_offers_location;
DROP INDEX offer_offers_search;
ALTER TABLE offer_offers DROP COLUMN search_vector, DROP COLUMN seller_name;
