-- name: InsertOrder :one
INSERT INTO order_orders (
    customer_id, customer_name, customer_phone, seller_id, checkout_id, seller_name, latitude, longitude, address,
    window_start, window_end, total_vnd, idempotency_key
) VALUES (
    @customer_id, @customer_name, @customer_phone, @seller_id, @checkout_id, @seller_name, @latitude, @longitude,
    @address, @window_start, @window_end, @total_vnd, @idempotency_key
)
RETURNING id;

-- name: InsertLine :exec
INSERT INTO order_lines (order_id, offer_id, name, unit, price_vnd, original_price_vnd, photo_id, units)
VALUES (@order_id, @offer_id, @name, @unit, @price_vnd, @original_price_vnd, @photo_id, @units);

-- name: InsertEvent :exec
INSERT INTO order_events (order_id, kind, actor_id) VALUES (@order_id, @kind, @actor_id);

-- name: OrderOfKey :one
-- The order a customer already placed with this idempotency key; without an
-- account, only with the same phone number.
SELECT id FROM order_orders
WHERE customer_id IS NOT DISTINCT FROM sqlc.narg(customer_id)::uuid AND idempotency_key = @idempotency_key
  AND (customer_id IS NOT NULL OR customer_phone = @customer_phone);

-- name: GetOrder :one
SELECT id, number, customer_id, customer_name, customer_phone, seller_id, checkout_id, seller_name, latitude,
       longitude, address, state, window_start, window_end, total_vnd, access, cancel_reason, refuse_reason, refuse_note,
       created_at, ready_at, collected_at, cancelled_at, refused_at
FROM order_orders WHERE id = @id;

-- name: LockOrder :one
-- Serializes the transitions of one order until the transaction ends.
SELECT id, number, customer_id, customer_name, customer_phone, seller_id, checkout_id, seller_name, latitude,
       longitude, address, state, window_start, window_end, total_vnd, access, cancel_reason, refuse_reason, refuse_note,
       created_at, ready_at, collected_at, cancelled_at, refused_at
FROM order_orders WHERE id = @id FOR UPDATE;

-- name: LinesOf :many
SELECT order_id, offer_id, name, unit, price_vnd, original_price_vnd, photo_id, units
FROM order_lines WHERE order_id = ANY (@order_ids::uuid[])
ORDER BY order_id, name, offer_id;

-- name: CustomerOrders :many
-- A customer's orders, newest first: open ones are confirmed or ready with
-- their window not over; ended ones are every other; those of one checkout
-- when it is given.
SELECT id, number, customer_id, customer_name, customer_phone, seller_id, checkout_id, seller_name, latitude,
       longitude, address, state, window_start, window_end, total_vnd, access, cancel_reason, refuse_reason, refuse_note,
       created_at, ready_at, collected_at, cancelled_at, refused_at
FROM order_orders
WHERE customer_id = @customer_id
  AND (sqlc.narg(checkout_id)::uuid IS NULL OR checkout_id = sqlc.narg(checkout_id))
  AND (@which::text = ''
       OR (@which = 'open' AND state IN ('confirmed', 'ready') AND window_end > now())
       OR (@which = 'ended' AND NOT (state IN ('confirmed', 'ready') AND window_end > now())))
ORDER BY created_at DESC, id
LIMIT @max_rows OFFSET @skip_rows;

-- name: SellerOrders :many
-- A seller's orders whose window starts within [day_start, day_end), soonest
-- first.
SELECT id, number, customer_id, customer_name, customer_phone, seller_id, checkout_id, seller_name, latitude,
       longitude, address, state, window_start, window_end, total_vnd, access, cancel_reason, refuse_reason, refuse_note,
       created_at, ready_at, collected_at, cancelled_at, refused_at
FROM order_orders
WHERE seller_id = @seller_id AND window_start >= @day_start AND window_start < @day_end
ORDER BY window_start, number
LIMIT 500;

-- name: MarkReady :exec
UPDATE order_orders SET state = 'ready', ready_at = now() WHERE id = @id;

-- name: MarkCollected :exec
UPDATE order_orders SET state = 'collected', collected_at = now() WHERE id = @id;

-- name: MarkCancelled :exec
UPDATE order_orders SET state = 'cancelled', cancelled_at = now(), cancel_reason = @cancel_reason WHERE id = @id;

-- name: MarkReopened :exec
-- Takes a hand-over or a refusal back: the order is open again.
UPDATE order_orders
SET state = 'confirmed', ready_at = NULL, collected_at = NULL, refused_at = NULL, refuse_reason = NULL, refuse_note = ''
WHERE id = @id;

-- name: MarkRefused :exec
UPDATE order_orders
SET state = 'refused', refused_at = now(), refuse_reason = @refuse_reason, refuse_note = @refuse_note
WHERE id = @id;

-- name: InsertReview :execrows
-- Nothing is inserted when the order was already reviewed.
INSERT INTO order_reviews (order_id, stars, tags, comment) VALUES (@order_id, @stars, @tags, @comment)
ON CONFLICT (order_id) DO NOTHING;

-- name: ReviewsOf :many
SELECT order_id, stars, tags, comment, created_at
FROM order_reviews WHERE order_id = ANY (@order_ids::uuid[]);
