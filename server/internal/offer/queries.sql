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
    weight_grams, photo_id, window_start, window_end, latitude, longitude, address
) VALUES (
    @seller_id, @posted_by, @name, @description, @kind, @unit, @units, @units, @price_vnd, @original_price_vnd,
    @weight_grams, @photo_id, @window_start, @window_end, @latitude, @longitude, @address
)
RETURNING id;

-- name: GetOffer :one
SELECT id, seller_id, posted_by, state, name, description, kind, unit, units, units_left, price_vnd,
       original_price_vnd, weight_grams, photo_id, window_start, window_end, latitude, longitude, address,
       created_at, updated_at, withdrawn_at
FROM offer_offers WHERE id = @id;

-- name: LockOffer :one
-- Serializes changes to one offer until the transaction ends.
SELECT id, seller_id, posted_by, state, name, description, kind, unit, units, units_left, price_vnd,
       original_price_vnd, weight_grams, photo_id, window_start, window_end, latitude, longitude, address,
       created_at, updated_at, withdrawn_at
FROM offer_offers WHERE id = @id FOR UPDATE;

-- name: UpdateOffer :exec
UPDATE offer_offers
SET name = @name, description = @description, kind = @kind, unit = @unit, units = @units,
    units_left = @units_left, price_vnd = @price_vnd, original_price_vnd = @original_price_vnd,
    weight_grams = @weight_grams, photo_id = @photo_id, window_start = @window_start, window_end = @window_end,
    updated_at = now()
WHERE id = @id;

-- name: WithdrawOffer :exec
UPDATE offer_offers SET state = 'withdrawn', withdrawn_at = now(), updated_at = now()
WHERE id = @id AND state = 'on_sale';

-- name: SellerUsesPhoto :one
SELECT EXISTS (SELECT 1 FROM offer_offers WHERE seller_id = @seller_id AND photo_id = @photo_id);

-- name: SellerOffers :many
SELECT id, seller_id, posted_by, state, name, description, kind, unit, units, units_left, price_vnd,
       original_price_vnd, weight_grams, photo_id, window_start, window_end, latitude, longitude, address,
       created_at, updated_at, withdrawn_at
FROM offer_offers
WHERE seller_id = @seller_id
  AND (@status::text = ''
       OR (@status = 'withdrawn' AND state = 'withdrawn')
       OR (@status = 'closed' AND state = 'on_sale' AND window_end <= now())
       OR (@status = 'sold_out' AND state = 'on_sale' AND window_end > now() AND units_left = 0)
       OR (@status = 'on_sale' AND state = 'on_sale' AND window_end > now() AND units_left > 0))
ORDER BY created_at DESC, id
LIMIT @max_rows OFFSET @skip_rows;
