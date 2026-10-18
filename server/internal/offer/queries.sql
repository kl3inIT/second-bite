-- name: GetSettings :one
SELECT min_discount_percent, default_radius_km, max_radius_km, window_min_minutes, window_max_minutes,
       starts_within_hours, updated_at, updated_by
FROM offer_settings WHERE id = 1;

-- name: PutSettings :exec
UPDATE offer_settings
SET min_discount_percent = @min_discount_percent, default_radius_km = @default_radius_km,
    max_radius_km = @max_radius_km, window_min_minutes = @window_min_minutes,
    window_max_minutes = @window_max_minutes, starts_within_hours = @starts_within_hours,
    updated_at = now(), updated_by = @updated_by
WHERE id = 1;

-- name: InsertOffer :one
INSERT INTO offer_offers (
    seller_id, posted_by, name, description, kind, unit, units, units_left, price_vnd, original_price_vnd,
    weight_grams, photo_id, window_start, window_end, latitude, longitude, address, seller_name, search_vector
) VALUES (
    @seller_id, @posted_by, @name, @description, @kind, @unit, @units, @units, @price_vnd, @original_price_vnd,
    @weight_grams, @photo_id, @window_start, @window_end, @latitude, @longitude, @address, @seller_name,
    (sqlc.arg(search_vector)::text)::tsvector
)
RETURNING id;

-- name: GetOffer :one
SELECT id, seller_id, posted_by, state, name, description, kind, unit, units, units_left, price_vnd,
       original_price_vnd, weight_grams, photo_id, window_start, window_end, latitude, longitude, address,
       created_at, updated_at, withdrawn_at, seller_name
FROM offer_offers WHERE id = @id;

-- name: LockOffer :one
-- Serializes changes to one offer until the transaction ends.
SELECT id, seller_id, posted_by, state, name, description, kind, unit, units, units_left, price_vnd,
       original_price_vnd, weight_grams, photo_id, window_start, window_end, latitude, longitude, address,
       created_at, updated_at, withdrawn_at, seller_name
FROM offer_offers WHERE id = @id FOR UPDATE;

-- name: UpdateOffer :exec
UPDATE offer_offers
SET name = @name, description = @description, kind = @kind, unit = @unit, units = @units,
    units_left = @units_left, price_vnd = @price_vnd, original_price_vnd = @original_price_vnd,
    weight_grams = @weight_grams, photo_id = @photo_id, window_start = @window_start, window_end = @window_end,
    search_vector = (sqlc.arg(search_vector)::text)::tsvector, updated_at = now()
WHERE id = @id;

-- name: WithdrawOffer :exec
UPDATE offer_offers SET state = 'withdrawn', withdrawn_at = now(), updated_at = now()
WHERE id = @id AND state = 'on_sale';

-- name: SellerUsesPhoto :one
SELECT EXISTS (SELECT 1 FROM offer_offers WHERE seller_id = @seller_id AND photo_id = @photo_id);

-- name: SellerOffers :many
SELECT id, seller_id, posted_by, state, name, description, kind, unit, units, units_left, price_vnd,
       original_price_vnd, weight_grams, photo_id, window_start, window_end, latitude, longitude, address,
       created_at, updated_at, withdrawn_at, seller_name
FROM offer_offers
WHERE seller_id = @seller_id
  AND (@status::text = ''
       OR (@status = 'withdrawn' AND state = 'withdrawn')
       OR (@status = 'closed' AND state = 'on_sale' AND window_end <= now())
       OR (@status = 'sold_out' AND state = 'on_sale' AND window_end > now() AND units_left = 0)
       OR (@status = 'on_sale' AND state = 'on_sale' AND window_end > now() AND units_left > 0))
ORDER BY created_at DESC, id
LIMIT @max_rows OFFSET @skip_rows;

-- name: SearchOffers :many
-- Offers customers may order or see sold out: on sale, the window not over,
-- the seller not blocked; filtered before they are ordered and paged. The
-- query is a tsquery literal built by searchQuery, empty for none.
SELECT id, seller_id, posted_by, state, name, description, kind, unit, units, units_left, price_vnd,
       original_price_vnd, weight_grams, photo_id, window_start, window_end, latitude, longitude, address,
       created_at, updated_at, withdrawn_at, seller_name,
       COALESCE(distance_m, 0)::float8 AS distance_m, rank::float4 AS rank
FROM (
    SELECT o.*,
           CASE WHEN sqlc.narg(latitude)::float8 IS NULL THEN NULL
                ELSE ST_Distance(o.location, ST_SetSRID(ST_MakePoint(sqlc.narg(longitude)::float8, sqlc.narg(latitude)::float8), 4326)::geography)
           END AS distance_m,
           CASE WHEN sqlc.arg(query)::text = '' THEN 0 ELSE ts_rank_cd(o.search_vector, (sqlc.arg(query)::text)::tsquery) END AS rank
    FROM offer_offers o
    WHERE o.state = 'on_sale' AND o.window_end > now()
      -- An empty list arrives as NULL, which ANY would turn into no row at all.
      AND NOT (o.seller_id = ANY (COALESCE(sqlc.arg(excluded_sellers)::uuid[], '{}')))
      AND (sqlc.arg(query)::text = '' OR o.search_vector @@ (sqlc.arg(query)::text)::tsquery)
      AND (sqlc.narg(latitude)::float8 IS NULL
           OR ST_DWithin(o.location, ST_SetSRID(ST_MakePoint(sqlc.narg(longitude)::float8, sqlc.narg(latitude)::float8), 4326)::geography, sqlc.arg(radius_m)::float8))
      AND (COALESCE(cardinality(sqlc.arg(kinds)::text[]), 0) = 0 OR o.kind = ANY (sqlc.arg(kinds)::text[]))
      AND (sqlc.narg(max_price)::bigint IS NULL OR o.price_vnd <= sqlc.narg(max_price)::bigint)
      AND (sqlc.narg(collect_from)::timestamptz IS NULL OR o.window_end > sqlc.narg(collect_from)::timestamptz)
      AND (sqlc.narg(collect_to)::timestamptz IS NULL OR o.window_start <= sqlc.narg(collect_to)::timestamptz)
      AND (sqlc.narg(seller_id)::uuid IS NULL OR o.seller_id = sqlc.narg(seller_id)::uuid)
      AND (NOT sqlc.arg(available_only)::boolean OR o.units_left > 0)
) found
ORDER BY
    CASE WHEN sqlc.arg(sort)::text = 'relevance' THEN rank END DESC,
    CASE WHEN sqlc.arg(sort)::text IN ('relevance', 'distance') THEN distance_m END ASC NULLS LAST,
    CASE WHEN sqlc.arg(sort)::text = 'price' THEN price_vnd END ASC,
    CASE WHEN sqlc.arg(sort)::text = 'discount' THEN (original_price_vnd - price_vnd)::float8 / original_price_vnd END DESC,
    window_end ASC, id
LIMIT @max_rows OFFSET @skip_rows;
