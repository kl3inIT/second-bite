-- An admin deletes a seller softly: it is blocked and waits until its orders still to finish are done, then it is
-- deleted, and an admin may restore it, blocked. Nothing of the seller is removed, so its orders, reviews and offers
-- stay as they were. deletion_requested_at is set while it waits.
-- +goose Up
ALTER TABLE seller_sellers DROP CONSTRAINT seller_sellers_status_check;
ALTER TABLE seller_sellers
    ADD CONSTRAINT seller_sellers_status_check CHECK (status IN ('pending', 'active', 'rejected', 'blocked', 'deleted')),
    ADD COLUMN deletion_requested_at timestamptz,
    ADD CONSTRAINT seller_sellers_deletion_check CHECK (deletion_requested_at IS NULL OR status = 'blocked');
ALTER TABLE seller_status_days ADD COLUMN deleted integer NOT NULL DEFAULT 0 CHECK (deleted >= 0);

-- +goose Down
ALTER TABLE seller_status_days DROP COLUMN deleted;
UPDATE seller_sellers SET status = 'blocked' WHERE status = 'deleted';
ALTER TABLE seller_sellers DROP CONSTRAINT seller_sellers_deletion_check;
ALTER TABLE seller_sellers DROP CONSTRAINT seller_sellers_status_check;
ALTER TABLE seller_sellers
    DROP COLUMN deletion_requested_at,
    ADD CONSTRAINT seller_sellers_status_check CHECK (status IN ('pending', 'active', 'rejected', 'blocked'));
