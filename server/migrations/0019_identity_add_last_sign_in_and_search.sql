-- When and how each account last signed in, and the words admins find it by
-- (SEC-75, the accounts list): BeyondPilot, Saleor and Open Food Network keep
-- the last sign-in on the account, written at sign-in.
-- +goose Up
ALTER TABLE identity_accounts
    ADD COLUMN last_signed_in_at timestamptz,
    ADD COLUMN last_sign_in_method text CHECK (last_sign_in_method IN ('code', 'google')),
    ADD CONSTRAINT identity_accounts_last_sign_in_check
        CHECK ((last_signed_in_at IS NULL) = (last_sign_in_method IS NULL));

-- An account's newest session is its last sign-in, by Google when its Google
-- link was used then; an account whose sessions have all ended shows none.
UPDATE identity_accounts a
SET last_signed_in_at = s.opened_at,
    last_sign_in_method = CASE
        WHEN EXISTS (SELECT 1 FROM identity_external_logins l
                     WHERE l.account_id = a.id AND l.last_used_at >= s.opened_at - interval '1 minute')
        THEN 'google' ELSE 'code' END
FROM (SELECT account_id, max(created_at) AS opened_at FROM identity_sessions GROUP BY account_id) s
WHERE s.account_id = a.id;

-- The words of a text as admins type them: in NFC, lower case, without
-- Vietnamese marks, đ as d. The query is folded by the same function.
CREATE FUNCTION identity_fold(t text) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE
    RETURN translate(lower(normalize(t, NFC)),
        'àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ',
        'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd');

ALTER TABLE identity_accounts
    ADD COLUMN search_text text GENERATED ALWAYS AS (identity_fold(email || ' ' || display_name)) STORED;

-- +goose Down
ALTER TABLE identity_accounts
    DROP COLUMN search_text,
    DROP CONSTRAINT identity_accounts_last_sign_in_check,
    DROP COLUMN last_sign_in_method,
    DROP COLUMN last_signed_in_at;
DROP FUNCTION identity_fold(text);
