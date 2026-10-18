-- Photos, and the bytes of the files the PostgreSQL store keeps for every module.
-- +goose Up
CREATE TABLE file_photos (
    id           uuid        PRIMARY KEY DEFAULT uuidv7(),
    -- The store that holds the photo's files; photos kept before a switch
    -- stay readable from theirs.
    store        text        NOT NULL CHECK (store IN ('postgres', 's3')),
    -- identity's account, without a foreign key across modules.
    uploaded_by  uuid        NOT NULL,
    width        integer     NOT NULL CHECK (width > 0),
    height       integer     NOT NULL CHECK (height > 0),
    used_at      timestamptz,
    created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX file_photos_unused ON file_photos (uploaded_by) WHERE used_at IS NULL;
CREATE INDEX file_photos_uploaded_by ON file_photos (uploaded_by, created_at);

CREATE TABLE file_blobs (
    key           text        PRIMARY KEY,
    content_type  text        NOT NULL,
    data          bytea       NOT NULL,
    created_at    timestamptz NOT NULL DEFAULT now()
);

-- JPEG does not compress: keep the bytes out of line without trying.
ALTER TABLE file_blobs ALTER COLUMN data SET STORAGE EXTERNAL;

-- +goose Down
DROP TABLE file_blobs;
DROP TABLE file_photos;
