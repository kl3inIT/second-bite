-- The pages people open on the site, counted for the prototype's numbers (SEC-80). One row per view; the visitor is
-- a key that changes every day and cannot be traced back to anyone, since the day's salt is deleted after its day.
-- +goose Up
CREATE TABLE stats_views (
    id          bigint      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    viewed_at   timestamptz NOT NULL DEFAULT now(),
    -- The calendar day in Vietnam the view belongs to.
    day         date        NOT NULL,
    kind        text        NOT NULL CHECK (kind IN ('home', 'seller', 'offer', 'other')),
    -- seller's seller or offer's offer named in the path, without a foreign key across modules.
    subject_id  uuid,
    -- utm_source of the address that opened the site, such as qr on the poster; empty for everything else.
    source      text        NOT NULL DEFAULT '' CHECK (source ~ '^[a-z0-9_-]{0,40}$'),
    -- sha256 of the day's salt, the address and the browser: one browser on one day.
    visitor     bytea       NOT NULL CHECK (length(visitor) = 32),
    CHECK ((kind IN ('seller', 'offer')) = (subject_id IS NOT NULL))
);
CREATE INDEX stats_views_day ON stats_views (day);

-- The salt of each day; deleted once its day is over.
CREATE TABLE stats_salts (
    day   date  PRIMARY KEY,
    salt  bytea NOT NULL CHECK (length(salt) = 32)
);

-- +goose Down
DROP TABLE stats_salts;
DROP TABLE stats_views;
