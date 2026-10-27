-- A customer who deletes their account takes their name and phone number off their orders; the rest of each order
-- stays for the store and the reports (SEC-165). forgotten_at says when, and lets the contact be empty.
-- +goose Up
ALTER TABLE order_orders ADD COLUMN contact_forgotten_at timestamptz;
ALTER TABLE order_orders DROP CONSTRAINT order_orders_customer_name_check;
ALTER TABLE order_orders DROP CONSTRAINT order_orders_customer_phone_check;
ALTER TABLE order_orders ADD CONSTRAINT order_orders_contact_check CHECK (
    CASE WHEN contact_forgotten_at IS NULL
        THEN char_length(customer_name) BETWEEN 1 AND 50 AND customer_phone ~ '^0[0-9]{9}$'
        ELSE customer_name = '' AND customer_phone = '' AND zalo_consent_at IS NULL
    END
);

-- +goose Down
ALTER TABLE order_orders DROP CONSTRAINT order_orders_contact_check;
ALTER TABLE order_orders ADD CONSTRAINT order_orders_customer_phone_check CHECK (customer_phone ~ '^0[0-9]{9}$');
ALTER TABLE order_orders ADD CONSTRAINT order_orders_customer_name_check CHECK (char_length(customer_name) BETWEEN 1 AND 50);
ALTER TABLE order_orders DROP COLUMN contact_forgotten_at;
