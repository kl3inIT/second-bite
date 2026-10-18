-- The files the system keeps, and the bytes the PostgreSQL store holds for them.
-- +goose Up
-- Every file the system keeps, one row each, whatever it is for.
CREATE TABLE file_files (
    id           uuid        PRIMARY KEY DEFAULT uuidv7(),
    -- What the file is for; it decides the rules of its upload.
    purpose      text        NOT NULL CHECK (purpose IN ('photo')),
    -- The store that holds the file; files kept before a switch stay
    -- readable from theirs.
    store        text        NOT NULL CHECK (store IN ('postgres', 's3')),
    -- The file's key in its store; for a photo, the prefix its sizes are
    -- kept under. Never derived from a name a person gave.
    object_key   text        NOT NULL UNIQUE,
    media_type   text        NOT NULL,
    -- Every byte kept for the file, a photo's sizes together.
    size_bytes   bigint      NOT NULL CHECK (size_bytes > 0),
    -- identity's account, without a foreign key across modules.
    uploaded_by  uuid        NOT NULL,
    -- A photo's size as uploaded, turned the way it was taken.
    width        integer     CHECK (width > 0),
    height       integer     CHECK (height > 0),
    used_at      timestamptz,
    created_at   timestamptz NOT NULL DEFAULT now(),
    CHECK ((purpose = 'photo') = (width IS NOT NULL AND height IS NOT NULL))
);

CREATE INDEX file_files_unused ON file_files (uploaded_by) WHERE used_at IS NULL;
CREATE INDEX file_files_uploaded_by ON file_files (uploaded_by, created_at);

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
DROP TABLE file_files;
