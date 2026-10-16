-- Sellers, their status set by admins, and the accounts that act for them.
-- +goose Up
CREATE TABLE seller_sellers (
    id                 uuid        PRIMARY KEY DEFAULT uuidv7(),
    name               text        NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
    address            text        NOT NULL CHECK (char_length(address) BETWEEN 1 AND 300),
    latitude           double precision NOT NULL CHECK (latitude BETWEEN -90 AND 90),
    longitude          double precision NOT NULL CHECK (longitude BETWEEN -180 AND 180),
    location           geography(Point, 4326) GENERATED ALWAYS AS
                           (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography) STORED,
    phone              text        NOT NULL,
    status             text        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'blocked')),
    status_changed_at  timestamptz,
    status_changed_by  uuid,
    created_at         timestamptz NOT NULL DEFAULT now(),
    updated_at         timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX seller_sellers_status ON seller_sellers (status, created_at);

-- An account is the identifier of identity's account; the table is identity's.
CREATE TABLE seller_members (
    seller_id   uuid        NOT NULL REFERENCES seller_sellers (id) ON DELETE CASCADE,
    account_id  uuid        NOT NULL,
    role        text        NOT NULL CHECK (role IN ('owner', 'staff')),
    created_at  timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (seller_id, account_id)
);

-- Exactly one owner per seller.
CREATE UNIQUE INDEX seller_members_one_owner ON seller_members (seller_id) WHERE role = 'owner';
CREATE INDEX seller_members_account_id ON seller_members (account_id);

-- +goose Down
DROP TABLE seller_members;
DROP TABLE seller_sellers;
