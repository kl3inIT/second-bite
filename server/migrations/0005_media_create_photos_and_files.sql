-- Photos uploaded by sellers' staff, and the files of the PostgreSQL store.
-- +goose Up
CREATE TABLE media_photos (
    id           uuid        PRIMARY KEY DEFAULT uuidv7(),
    -- The store that holds the photo's files; photos kept before a switch
    -- stay readable from theirs.
    store        text        NOT NULL CHECK (store IN ('postgres')),
    -- identity's account, without a foreign key across modules.
    uploaded_by  uuid        NOT NULL,
    width        integer     NOT NULL CHECK (width > 0),
    height       integer     NOT NULL CHECK (height > 0),
    used_at      timestamptz,
    created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX media_photos_unused ON media_photos (uploaded_by) WHERE used_at IS NULL;

CREATE TABLE media_files (
    key           text        PRIMARY KEY,
    content_type  text        NOT NULL,
    data          bytea       NOT NULL,
    created_at    timestamptz NOT NULL DEFAULT now()
);

-- JPEG does not compress: keep the bytes out of line without trying.
ALTER TABLE media_files ALTER COLUMN data SET STORAGE EXTERNAL;

-- +goose Down
DROP TABLE media_files;
DROP TABLE media_photos;
