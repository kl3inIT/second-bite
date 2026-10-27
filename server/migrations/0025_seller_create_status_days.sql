-- How the sellers stood each day, for the admins' cards (SEC-62). A row holds how many sellers stood in each
-- status at the last change of that day in Vietnam; a day with no row had no change, so it stands as the
-- day before. Counting starts today: no history is made up for the days before.
-- +goose Up
CREATE TABLE seller_status_days (
    day      date PRIMARY KEY,
    pending  integer NOT NULL CHECK (pending >= 0),
    active   integer NOT NULL CHECK (active >= 0),
    rejected integer NOT NULL CHECK (rejected >= 0),
    blocked  integer NOT NULL CHECK (blocked >= 0)
);

INSERT INTO seller_status_days (day, pending, active, rejected, blocked)
SELECT (now() AT TIME ZONE 'Asia/Ho_Chi_Minh')::date,
       count(*) FILTER (WHERE status = 'pending'),
       count(*) FILTER (WHERE status = 'active'),
       count(*) FILTER (WHERE status = 'rejected'),
       count(*) FILTER (WHERE status = 'blocked')
FROM seller_sellers;

-- +goose Down
DROP TABLE seller_status_days;
