-- A seller's four states and the reason given for the last refusal (SEC-75):
-- an admin approves a pending seller or rejects it with a reason, blocks an
-- active one with a reason, and approves a rejected or blocked one again.
-- Admins find sellers by name, address or phone without Vietnamese marks.
-- +goose Up
ALTER TABLE seller_sellers DROP CONSTRAINT seller_sellers_status_check;
ALTER TABLE seller_sellers
    ADD CONSTRAINT seller_sellers_status_check CHECK (status IN ('pending', 'active', 'rejected', 'blocked')),
    ADD COLUMN status_reason text CHECK (char_length(status_reason) BETWEEN 1 AND 500);

-- The words of a text as admins type them: in NFC, lower case, without
-- Vietnamese marks, đ as d. The query is folded by the same function.
CREATE FUNCTION seller_fold(t text) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE
    RETURN translate(lower(normalize(t, NFC)),
        'àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ',
        'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd');

ALTER TABLE seller_sellers
    ADD COLUMN search_text text GENERATED ALWAYS AS (seller_fold(name || ' ' || address || ' ' || phone)) STORED;

-- A seller blocked when its owner deleted their account says so.
UPDATE seller_sellers SET status_reason = 'Chủ cửa hàng đã xoá tài khoản'
WHERE status = 'blocked' AND status_changed_by IS NULL;

-- +goose Down
ALTER TABLE seller_sellers DROP COLUMN search_text;
DROP FUNCTION seller_fold(text);
UPDATE seller_sellers SET status = 'pending' WHERE status = 'rejected';
ALTER TABLE seller_sellers DROP CONSTRAINT seller_sellers_status_check;
ALTER TABLE seller_sellers
    DROP COLUMN status_reason,
    ADD CONSTRAINT seller_sellers_status_check CHECK (status IN ('pending', 'active', 'blocked'));
