-- name: GetSettings :one
SELECT min_discount_percent, default_radius_km, max_radius_km, window_min_minutes, window_max_minutes,
       starts_within_hours, updated_at, updated_by
FROM offer_settings WHERE id = 1;

-- name: LockSettings :one
-- The settings, locked until the transaction saving them ends.
SELECT min_discount_percent, default_radius_km, max_radius_km, window_min_minutes, window_max_minutes,
       starts_within_hours, updated_at, updated_by
FROM offer_settings WHERE id = 1 FOR UPDATE;

-- name: PutSettings :exec
UPDATE offer_settings
SET min_discount_percent = @min_discount_percent, default_radius_km = @default_radius_km,
    max_radius_km = @max_radius_km, window_min_minutes = @window_min_minutes,
    window_max_minutes = @window_max_minutes, starts_within_hours = @starts_within_hours,
    updated_at = now(), updated_by = @updated_by
WHERE id = 1;

-- name: InsertOffer :one
INSERT INTO offer_offers (
    seller_id, posted_by, name, description, kind, kind_label, unit, units, units_left, price_vnd, original_price_vnd,
    weight_grams, photo_id, more_photo_ids, window_start, window_end, latitude, longitude, address, seller_name, search_vector
) VALUES (
    @seller_id, @posted_by, @name, @description, @kind, @kind_label, @unit, @units, @units, @price_vnd, @original_price_vnd,
    @weight_grams, @photo_id, @more_photo_ids, @window_start, @window_end, @latitude, @longitude, @address, @seller_name,
    (sqlc.arg(search_vector)::text)::tsvector
)
RETURNING id;

-- name: GetOffer :one
SELECT id, seller_id, posted_by, state, name, description, kind, kind_label, unit, units, units_left, price_vnd,
       original_price_vnd, weight_grams, photo_id, more_photo_ids, window_start, window_end, latitude, longitude, address,
       created_at, updated_at, withdrawn_at, seller_name
FROM offer_offers WHERE id = @id;

-- name: LockOffer :one
-- Serializes changes to one offer until the transaction ends.
SELECT id, seller_id, posted_by, state, name, description, kind, kind_label, unit, units, units_left, price_vnd,
       original_price_vnd, weight_grams, photo_id, more_photo_ids, window_start, window_end, latitude, longitude, address,
       created_at, updated_at, withdrawn_at, seller_name
FROM offer_offers WHERE id = @id FOR UPDATE;

-- name: UpdateOffer :exec
UPDATE offer_offers
SET name = @name, description = @description, kind = @kind, kind_label = @kind_label, unit = @unit, units = @units,
    units_left = @units_left, price_vnd = @price_vnd, original_price_vnd = @original_price_vnd,
    weight_grams = @weight_grams, photo_id = @photo_id, more_photo_ids = @more_photo_ids, window_start = @window_start, window_end = @window_end,
    search_vector = (sqlc.arg(search_vector)::text)::tsvector, updated_at = now()
WHERE id = @id;

-- name: CloseEnded :execrows
-- Closes the offers still on sale whose window is over. Reads compare the window too.
UPDATE offer_offers SET state = 'closed', updated_at = now()
WHERE state = 'on_sale' AND window_end <= now();

-- name: WindowsOf :many
SELECT id, window_start, window_end FROM offer_offers WHERE id = ANY (@ids::uuid[]);

-- name: WithdrawOffer :exec
UPDATE offer_offers SET state = 'withdrawn', withdrawn_at = now(), updated_at = now()
WHERE id = @id AND state = 'on_sale';

-- name: SellerUsesPhoto :one
SELECT (EXISTS (SELECT 1 FROM offer_offers AS o
                WHERE o.seller_id = @seller_id AND (o.photo_id = @photo_id OR @photo_id = ANY (o.more_photo_ids)))
    OR EXISTS (SELECT 1 FROM offer_dishes AS d
               WHERE d.seller_id = @seller_id AND (d.photo_id = @photo_id OR @photo_id = ANY (d.more_photo_ids))))::boolean;

-- name: SellerOffers :many
SELECT id, seller_id, posted_by, state, name, description, kind, kind_label, unit, units, units_left, price_vnd,
       original_price_vnd, weight_grams, photo_id, more_photo_ids, window_start, window_end, latitude, longitude, address,
       created_at, updated_at, withdrawn_at, seller_name
FROM offer_offers
WHERE seller_id = @seller_id
  AND (@status::text = ''
       OR (@status = 'withdrawn' AND state = 'withdrawn')
       OR (@status = 'closed' AND (state = 'closed' OR (state = 'on_sale' AND window_end <= now())))
       OR (@status = 'sold_out' AND state = 'on_sale' AND window_end > now() AND units_left = 0)
       OR (@status = 'on_sale' AND state = 'on_sale' AND window_end > now() AND units_left > 0))
ORDER BY created_at DESC, id
LIMIT @max_rows OFFSET @skip_rows;

-- name: OffersForAdmins :many
-- One page of every seller's offers in the status given (all when empty),
-- matching the tsquery literal built by searchQuery (any when empty), of the
-- seller given and posted in [posted_since, posted_until) when given, newest
-- first; CountOffersForAdmins counts them all.
SELECT id, seller_id, posted_by, state, name, description, kind, kind_label, unit, units, units_left, price_vnd,
       original_price_vnd, weight_grams, photo_id, more_photo_ids, window_start, window_end, latitude, longitude, address,
       created_at, updated_at, withdrawn_at, seller_name
FROM offer_offers
WHERE (@status::text = ''
       OR (@status = 'withdrawn' AND state = 'withdrawn')
       OR (@status = 'closed' AND (state = 'closed' OR (state = 'on_sale' AND window_end <= now())))
       OR (@status = 'sold_out' AND state = 'on_sale' AND window_end > now() AND units_left = 0)
       OR (@status = 'on_sale' AND state = 'on_sale' AND window_end > now() AND units_left > 0))
  AND (@query::text = '' OR search_vector @@ (@query::text)::tsquery)
  AND (sqlc.narg(seller_id)::uuid IS NULL OR seller_id = sqlc.narg(seller_id)::uuid)
  AND (sqlc.narg(posted_since)::timestamptz IS NULL OR created_at >= sqlc.narg(posted_since)::timestamptz)
  AND (sqlc.narg(posted_until)::timestamptz IS NULL OR created_at < sqlc.narg(posted_until)::timestamptz)
ORDER BY created_at DESC, id
LIMIT @max_rows OFFSET @skip_rows;

-- name: CountOffersForAdmins :one
SELECT count(*) FROM offer_offers
WHERE (@status::text = ''
       OR (@status = 'withdrawn' AND state = 'withdrawn')
       OR (@status = 'closed' AND (state = 'closed' OR (state = 'on_sale' AND window_end <= now())))
       OR (@status = 'sold_out' AND state = 'on_sale' AND window_end > now() AND units_left = 0)
       OR (@status = 'on_sale' AND state = 'on_sale' AND window_end > now() AND units_left > 0))
  AND (@query::text = '' OR search_vector @@ (@query::text)::tsquery)
  AND (sqlc.narg(seller_id)::uuid IS NULL OR seller_id = sqlc.narg(seller_id)::uuid)
  AND (sqlc.narg(posted_since)::timestamptz IS NULL OR created_at >= sqlc.narg(posted_since)::timestamptz)
  AND (sqlc.narg(posted_until)::timestamptz IS NULL OR created_at < sqlc.narg(posted_until)::timestamptz);

-- name: CountOffersByStatus :one
-- How many offers of each status match the words, the seller and the day
-- posted, whatever the status asked, for the cards above the admins' list.
SELECT count(*) FILTER (WHERE state = 'on_sale' AND window_end > now() AND units_left > 0) AS on_sale,
       count(*) FILTER (WHERE state = 'on_sale' AND window_end > now() AND units_left = 0) AS sold_out,
       count(*) FILTER (WHERE state = 'closed' OR (state = 'on_sale' AND window_end <= now())) AS closed,
       count(*) FILTER (WHERE state = 'withdrawn') AS withdrawn
FROM offer_offers
WHERE (@query::text = '' OR search_vector @@ (@query::text)::tsquery)
  AND (sqlc.narg(seller_id)::uuid IS NULL OR seller_id = sqlc.narg(seller_id)::uuid)
  AND (sqlc.narg(posted_since)::timestamptz IS NULL OR created_at >= sqlc.narg(posted_since)::timestamptz)
  AND (sqlc.narg(posted_until)::timestamptz IS NULL OR created_at < sqlc.narg(posted_until)::timestamptz);

-- name: SearchOffers :many
-- Offers customers may order or see sold out: on sale, the window not over,
-- the seller not blocked; filtered before they are ordered and paged. The
-- query is a tsquery literal built by searchQuery, empty for none.
SELECT id, seller_id, posted_by, state, name, description, kind, kind_label, unit, units, units_left, price_vnd,
       original_price_vnd, weight_grams, photo_id, more_photo_ids, window_start, window_end, latitude, longitude, address,
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
      AND (sqlc.narg(min_price)::bigint IS NULL OR o.price_vnd >= sqlc.narg(min_price)::bigint)
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

-- name: LockDishes :exec
-- Serializes the dishes a seller adds, so the limit holds under concurrency.
SELECT pg_advisory_xact_lock(hashtextextended('offer:dishes:' || @seller_id::text, 0));

-- name: CountDishes :one
SELECT count(*)::integer FROM offer_dishes WHERE seller_id = @seller_id;

-- name: InsertDish :one
INSERT INTO offer_dishes (seller_id, created_by, name, kind, kind_label, unit, description, ingredients, original_price_vnd, photo_id, more_photo_ids, hidden)
VALUES (@seller_id, @created_by, @name, @kind, @kind_label, @unit, @description, @ingredients, @original_price_vnd, @photo_id, @more_photo_ids, @hidden)
RETURNING id;

-- name: GetDish :one
SELECT id, seller_id, created_by, name, kind, kind_label, unit, description, ingredients, original_price_vnd, photo_id, more_photo_ids, hidden, created_at, updated_at
FROM offer_dishes WHERE id = @id;

-- name: SellerDishes :many
SELECT id, seller_id, created_by, name, kind, kind_label, unit, description, ingredients, original_price_vnd, photo_id, more_photo_ids, hidden, created_at, updated_at
FROM offer_dishes WHERE seller_id = @seller_id
ORDER BY created_at DESC, id DESC;

-- name: UpdateDish :exec
UPDATE offer_dishes
SET name = @name, kind = @kind, kind_label = @kind_label, unit = @unit, description = @description, ingredients = @ingredients,
    original_price_vnd = @original_price_vnd, photo_id = @photo_id, more_photo_ids = @more_photo_ids, hidden = @hidden, updated_at = now()
WHERE id = @id;

-- name: DeleteDish :execrows
DELETE FROM offer_dishes WHERE id = @id;

-- name: TakeUnits :one
-- Takes units for an order in the order's transaction: only from an offer on
-- sale whose window is not over and that has them, so the last unit goes to
-- one order.
UPDATE offer_offers SET units_left = units_left - @units, updated_at = now()
WHERE id = @id AND state = 'on_sale' AND window_end > now() AND units_left >= @units
RETURNING id, seller_id, name, unit, price_vnd, original_price_vnd, photo_id, window_start, window_end,
          latitude, longitude, address, seller_name;

-- name: ReturnUnits :exec
-- Gives back the units of a cancelled order, never above the offer's units.
UPDATE offer_offers SET units_left = LEAST(units, units_left + @units), updated_at = now()
WHERE id = @id;

-- name: MoveSellerOffers :execrows
-- Copies a seller's collection point onto its offers still to come: on sale
-- with a window not yet over. Offers withdrawn or ended keep what they copied.
UPDATE offer_offers
SET latitude = @latitude, longitude = @longitude, address = @address, updated_at = now()
WHERE seller_id = @seller_id AND state = 'on_sale' AND window_end > now()
  AND (latitude, longitude, address) IS DISTINCT FROM (@latitude, @longitude, @address::text);

-- name: PostDays :many
-- The offers posted and their units, per collection day in Vietnam and seller, for the admin's report (SEC-80).
SELECT (window_start AT TIME ZONE 'Asia/Ho_Chi_Minh')::date AS day, seller_id,
       count(*) AS offers, sum(units)::bigint AS units
FROM offer_offers
WHERE window_start >= @since AND window_start < @until
  AND (sqlc.narg(seller_id)::uuid IS NULL OR seller_id = sqlc.narg(seller_id)::uuid)
GROUP BY 1, 2
ORDER BY 1, 2;

-- name: SellersOfOffers :many
SELECT id, seller_id FROM offer_offers WHERE id = ANY(@ids::uuid[]);
