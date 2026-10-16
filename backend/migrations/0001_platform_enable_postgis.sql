-- PostGIS gives locations their geography type and distance queries.
-- +goose Up
CREATE EXTENSION IF NOT EXISTS postgis;

-- +goose Down
DROP EXTENSION IF EXISTS postgis;
