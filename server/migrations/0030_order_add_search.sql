-- Admins list every seller's orders by the day they are collected, and find
-- them by number, the customer's name or phone, or the seller's name, without
-- Vietnamese marks (SEC-135); the seller's index serves one seller only.
-- +goose Up

-- The words of a text as admins type them: in NFC, lower case, without
-- Vietnamese marks, đ as d. The query is folded by the same function; the
-- seller module keeps its own (seller_fold).
CREATE FUNCTION order_fold(t text) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE
    RETURN translate(lower(normalize(t, NFC)),
        'àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ',
        'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd');

-- The number is an identity, never null; it is held as "sb-24831 24831" so
-- either is found.
ALTER TABLE order_orders
    ADD COLUMN search_text text GENERATED ALWAYS AS (order_fold(
        'sb-' || number::text || ' ' || number::text || ' ' || customer_name || ' ' || customer_phone || ' ' || seller_name
    )) STORED;

CREATE INDEX order_orders_window ON order_orders (window_start DESC);

-- +goose Down
DROP INDEX order_orders_window;
ALTER TABLE order_orders DROP COLUMN search_text;
DROP FUNCTION order_fold(text);
