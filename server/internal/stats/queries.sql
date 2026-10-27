-- name: InsertView :exec
INSERT INTO stats_views (day, kind, subject_id, source, visitor)
VALUES (@day, @kind, @subject_id, @source, @visitor);

-- name: InsertSalt :exec
INSERT INTO stats_salts (day, salt) VALUES (@day, @salt)
ON CONFLICT (day) DO NOTHING;

-- name: GetSalt :one
SELECT salt FROM stats_salts WHERE day = @day;

-- name: DeleteSaltsBefore :execrows
DELETE FROM stats_salts WHERE day < @day;

-- name: DeleteViewsBefore :execrows
DELETE FROM stats_views WHERE day < @day;

-- name: ViewDays :many
-- Every view of each day, for the site's cards and bars.
SELECT day, count(*) AS views, count(DISTINCT visitor) AS people,
       count(*) FILTER (WHERE kind = 'home') AS home_views,
       count(*) FILTER (WHERE source = 'qr') AS qr_views
FROM stats_views
WHERE day BETWEEN @since AND @until
GROUP BY day
ORDER BY day;

-- name: OfferSubjects :many
-- The dishes whose pages were opened, whose store the report asks offer for.
SELECT DISTINCT subject_id::uuid FROM stats_views
WHERE kind = 'offer' AND day BETWEEN @since AND @until;

-- name: StoreViewDays :many
-- The views of a store's page and of its dishes' pages, per day and store; a visitor who opened both counts once.
WITH owner AS (
    -- Two arrays of one length, zipped: each dish and its store.
    SELECT unnest(@offer_ids::uuid[]) AS offer_id, unnest(@offer_sellers::uuid[]) AS seller_id
), viewed AS (
    SELECT v.day, v.visitor, v.source,
           CASE WHEN v.kind = 'seller' THEN v.subject_id ELSE owner.seller_id END AS seller_id
    FROM stats_views v
    LEFT JOIN owner ON v.kind = 'offer' AND owner.offer_id = v.subject_id
    WHERE v.day BETWEEN @since AND @until AND v.kind IN ('seller', 'offer')
)
SELECT day, seller_id::uuid AS seller_id, count(*) AS views, count(DISTINCT visitor) AS people,
       count(*) FILTER (WHERE source = 'qr') AS qr_views
FROM viewed
WHERE seller_id IS NOT NULL
GROUP BY day, seller_id
ORDER BY day, seller_id;
