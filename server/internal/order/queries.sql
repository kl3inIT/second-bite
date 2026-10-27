-- name: InsertOrder :one
INSERT INTO order_orders (
    customer_id, customer_name, customer_phone, seller_id, checkout_id, seller_name, latitude, longitude, address,
    window_start, window_end, total_vnd, idempotency_key, zalo_consent_at
) VALUES (
    @customer_id, @customer_name, @customer_phone, @seller_id, @checkout_id, @seller_name, @latitude, @longitude,
    @address, @window_start, @window_end, @total_vnd, @idempotency_key, sqlc.narg('zalo_consent_at')
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

-- name: LockOrderShared :one
-- Holds an order against a transition (which locks it for update) until the
-- transaction ends, while other readers of it go on.
SELECT id, number, customer_id, customer_name, customer_phone, seller_id, checkout_id, seller_name, latitude,
       longitude, address, state, window_start, window_end, total_vnd, access, cancel_reason, refuse_reason, refuse_note,
       created_at, ready_at, collected_at, cancelled_at, refused_at
FROM order_orders WHERE id = @id FOR SHARE;

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

-- name: OrdersForAdmins :many
-- One page of every seller's orders in the statuses given (all when empty),
-- read as fromRow reads them: one still to collect whose window is over is
-- expired. Matching the words folded by order_fold (any when empty), of the
-- seller given and collected from a window starting in [collect_since,
-- collect_until) when given; the latest window first. GetOrder's columns, so
-- the rows convert to its row; CountOrdersForAdmins counts them all.
SELECT id, number, customer_id, customer_name, customer_phone, seller_id, checkout_id, seller_name, latitude,
       longitude, address, state, window_start, window_end, total_vnd, access, cancel_reason, refuse_reason, refuse_note,
       created_at, ready_at, collected_at, cancelled_at, refused_at
FROM order_orders
WHERE (cardinality(@statuses::text[]) = 0
       OR (CASE WHEN state IN ('confirmed', 'ready') AND window_end <= now() THEN 'expired' ELSE state END)
          = ANY (@statuses::text[]))
  AND (@query::text = '' OR search_text LIKE '%' || order_fold(@query::text) || '%' ESCAPE '\')
  AND (sqlc.narg(seller_id)::uuid IS NULL OR seller_id = sqlc.narg(seller_id)::uuid)
  AND (sqlc.narg(collect_since)::timestamptz IS NULL OR window_start >= sqlc.narg(collect_since)::timestamptz)
  AND (sqlc.narg(collect_until)::timestamptz IS NULL OR window_start < sqlc.narg(collect_until)::timestamptz)
ORDER BY window_start DESC, number DESC
LIMIT @max_rows OFFSET @skip_rows;

-- name: CountOrdersForAdmins :one
SELECT count(*) FROM order_orders
WHERE (cardinality(@statuses::text[]) = 0
       OR (CASE WHEN state IN ('confirmed', 'ready') AND window_end <= now() THEN 'expired' ELSE state END)
          = ANY (@statuses::text[]))
  AND (@query::text = '' OR search_text LIKE '%' || order_fold(@query::text) || '%' ESCAPE '\')
  AND (sqlc.narg(seller_id)::uuid IS NULL OR seller_id = sqlc.narg(seller_id)::uuid)
  AND (sqlc.narg(collect_since)::timestamptz IS NULL OR window_start >= sqlc.narg(collect_since)::timestamptz)
  AND (sqlc.narg(collect_until)::timestamptz IS NULL OR window_start < sqlc.narg(collect_until)::timestamptz);

-- name: CountOrdersByStatus :one
-- How many orders of each status match the words, the seller and the day
-- collected, whatever the statuses asked, for the cards above the admins'
-- list.
SELECT count(*) FILTER (WHERE state = 'confirmed' AND window_end > now()) AS confirmed,
       count(*) FILTER (WHERE state = 'ready' AND window_end > now()) AS ready,
       count(*) FILTER (WHERE state = 'collected') AS collected,
       count(*) FILTER (WHERE state = 'cancelled') AS cancelled,
       count(*) FILTER (WHERE state = 'refused') AS refused,
       count(*) FILTER (WHERE state = 'expired' OR (state IN ('confirmed', 'ready') AND window_end <= now())) AS expired
FROM order_orders
WHERE true
  AND (@query::text = '' OR search_text LIKE '%' || order_fold(@query::text) || '%' ESCAPE '\')
  AND (sqlc.narg(seller_id)::uuid IS NULL OR seller_id = sqlc.narg(seller_id)::uuid)
  AND (sqlc.narg(collect_since)::timestamptz IS NULL OR window_start >= sqlc.narg(collect_since)::timestamptz)
  AND (sqlc.narg(collect_until)::timestamptz IS NULL OR window_start < sqlc.narg(collect_until)::timestamptz);

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

-- name: CustomerOrderCounts :one
-- How many orders a customer placed, collected, and missed: their window
-- ended with no hand-over, whether ExpireEnded has marked them expired yet or
-- not, or staff ended them as no answer, no show or late.
SELECT count(*) AS placed,
       count(*) FILTER (WHERE state = 'collected') AS collected,
       count(*) FILTER (WHERE state = 'expired'
                           OR (state IN ('confirmed', 'ready') AND window_end <= now())
                           OR (state = 'refused' AND refuse_reason IN ('no_answer', 'no_show', 'late'))) AS missed
FROM order_orders WHERE customer_id = @customer_id;

-- name: OpenOrdersOfOffer :many
-- The orders still to collect that hold units of an offer.
SELECT DISTINCT o.id
FROM order_orders AS o
JOIN order_lines AS l ON l.order_id = o.id
WHERE l.offer_id = @offer_id AND o.state IN ('confirmed', 'ready');

-- name: SetWindow :execrows
-- Moves an order still to collect to a new window, and tells the sockets
-- following it (channel secondbite_live); one that ended, or already has that
-- window, stays as it was. Returns whether it moved.
WITH moved AS (
    UPDATE order_orders SET window_start = @window_start::timestamptz, window_end = @window_end::timestamptz
    WHERE id = @id AND state IN ('confirmed', 'ready')
      AND (window_start, window_end) IS DISTINCT FROM (@window_start::timestamptz, @window_end::timestamptz)
    RETURNING id, seller_id, state
)
SELECT pg_notify('secondbite_live', json_build_object(
    'topics', json_build_array('order:' || id::text, 'seller:' || seller_id::text),
    'notice', json_build_object('type', 'order', 'orderId', id, 'status', state)
)::text)
FROM moved;

-- name: ExpireEnded :one
-- Expires the orders still to collect whose window is over, each with an event
-- and a notice to the sockets following it (channel secondbite_live), and
-- returns how many. Reads compare the window too.
WITH ended AS (
    UPDATE order_orders SET state = 'expired'
    WHERE state IN ('confirmed', 'ready') AND window_end <= now()
    RETURNING id, seller_id
), recorded AS (
    INSERT INTO order_events (order_id, kind) SELECT id, 'expired' FROM ended
)
SELECT count(*) AS expired
FROM (
    SELECT pg_notify('secondbite_live', json_build_object(
        'topics', json_build_array('order:' || id::text, 'seller:' || seller_id::text),
        'notice', json_build_object('type', 'order', 'orderId', id, 'status', 'expired')
    )::text)
    FROM ended
) AS notified;

-- name: InsertReview :execrows
-- Nothing is inserted when the order was already reviewed.
INSERT INTO order_reviews (order_id, stars, tags, comment) VALUES (@order_id, @stars, @tags, @comment)
ON CONFLICT (order_id) DO NOTHING;

-- name: ReviewsOf :many
-- A hidden review is read too: its order was rated, and cannot be again.
SELECT order_id, stars, tags, comment, created_at, hidden_at
FROM order_reviews WHERE order_id = ANY (@order_ids::uuid[]);

-- name: ReviewsForAdmins :many
-- One page of every review, hidden or not, with its order: of the stars given
-- (any when empty), shown or hidden when visibility asks, matching the words
-- folded by order_fold in the order's search text or the comment (any when
-- empty), of the seller given and given in [reviewed_since, reviewed_until)
-- when given; the latest first. CountReviewsByStars counts them.
SELECT r.order_id, o.number, o.seller_id, o.seller_name, o.customer_name, r.stars, r.tags, r.comment, r.created_at,
       r.hidden_at, r.hidden_reason
FROM order_reviews r JOIN order_orders o ON o.id = r.order_id
WHERE (cardinality(@stars::int[]) = 0 OR r.stars = ANY (@stars::int[]))
  AND (@visibility::text = '' OR (@visibility::text = 'hidden') = (r.hidden_at IS NOT NULL))
  AND (@query::text = '' OR o.search_text LIKE '%' || order_fold(@query::text) || '%' ESCAPE '\'
       OR order_fold(r.comment) LIKE '%' || order_fold(@query::text) || '%' ESCAPE '\')
  AND (sqlc.narg(seller_id)::uuid IS NULL OR o.seller_id = sqlc.narg(seller_id)::uuid)
  AND (sqlc.narg(reviewed_since)::timestamptz IS NULL OR r.created_at >= sqlc.narg(reviewed_since)::timestamptz)
  AND (sqlc.narg(reviewed_until)::timestamptz IS NULL OR r.created_at < sqlc.narg(reviewed_until)::timestamptz)
ORDER BY r.created_at DESC, o.number DESC
LIMIT @max_rows OFFSET @skip_rows;

-- name: ReviewsOfSeller :many
-- One page of the shown reviews of one seller's orders, of the stars given (any
-- when empty), each with the names of its order's dishes; the latest first.
-- CountReviewsByStars counts them.
SELECT r.order_id, o.number, o.customer_name, r.stars, r.tags, r.comment, r.created_at,
       coalesce((SELECT string_agg(l.name, ', ' ORDER BY l.name) FROM order_lines l WHERE l.order_id = o.id), '')::text AS dishes
FROM order_reviews r JOIN order_orders o ON o.id = r.order_id
WHERE o.seller_id = @seller_id AND r.hidden_at IS NULL
  AND (cardinality(@stars::int[]) = 0 OR r.stars = ANY (@stars::int[]))
ORDER BY r.created_at DESC, o.number DESC
LIMIT @max_rows OFFSET @skip_rows;

-- name: CountReviewsByStars :one
-- For the cards above the admins' list, the reviews matching the words, the
-- seller and the days: how many give each number of stars, shown or hidden as
-- visibility asks; how many are hidden, of the stars asked; and how many are
-- shown matching every filter with their stars added up, for the mean.
SELECT count(*) FILTER (WHERE r.stars = 1 AND (@visibility::text = '' OR (@visibility::text = 'hidden') = (r.hidden_at IS NOT NULL))) AS one,
       count(*) FILTER (WHERE r.stars = 2 AND (@visibility::text = '' OR (@visibility::text = 'hidden') = (r.hidden_at IS NOT NULL))) AS two,
       count(*) FILTER (WHERE r.stars = 3 AND (@visibility::text = '' OR (@visibility::text = 'hidden') = (r.hidden_at IS NOT NULL))) AS three,
       count(*) FILTER (WHERE r.stars = 4 AND (@visibility::text = '' OR (@visibility::text = 'hidden') = (r.hidden_at IS NOT NULL))) AS four,
       count(*) FILTER (WHERE r.stars = 5 AND (@visibility::text = '' OR (@visibility::text = 'hidden') = (r.hidden_at IS NOT NULL))) AS five,
       count(*) FILTER (WHERE r.hidden_at IS NOT NULL
                          AND (cardinality(@stars::int[]) = 0 OR r.stars = ANY (@stars::int[]))) AS hidden,
       count(*) FILTER (WHERE r.hidden_at IS NULL AND @visibility::text <> 'hidden'
                          AND (cardinality(@stars::int[]) = 0 OR r.stars = ANY (@stars::int[]))) AS shown,
       coalesce(sum(r.stars) FILTER (WHERE r.hidden_at IS NULL AND @visibility::text <> 'hidden'
                                       AND (cardinality(@stars::int[]) = 0 OR r.stars = ANY (@stars::int[]))), 0)::bigint
           AS shown_stars
FROM order_reviews r JOIN order_orders o ON o.id = r.order_id
WHERE (@query::text = '' OR o.search_text LIKE '%' || order_fold(@query::text) || '%' ESCAPE '\'
       OR order_fold(r.comment) LIKE '%' || order_fold(@query::text) || '%' ESCAPE '\')
  AND (sqlc.narg(seller_id)::uuid IS NULL OR o.seller_id = sqlc.narg(seller_id)::uuid)
  AND (sqlc.narg(reviewed_since)::timestamptz IS NULL OR r.created_at >= sqlc.narg(reviewed_since)::timestamptz)
  AND (sqlc.narg(reviewed_until)::timestamptz IS NULL OR r.created_at < sqlc.narg(reviewed_until)::timestamptz);

-- name: LockReviewForAdmins :one
-- ReviewsForAdmins' columns for one order, locked until the transaction ends.
SELECT r.order_id, o.number, o.seller_id, o.seller_name, o.customer_name, r.stars, r.tags, r.comment, r.created_at,
       r.hidden_at, r.hidden_reason
FROM order_reviews r JOIN order_orders o ON o.id = r.order_id
WHERE r.order_id = @order_id
FOR UPDATE OF r;

-- name: HideReview :one
UPDATE order_reviews SET hidden_at = now(), hidden_by = @hidden_by, hidden_reason = @hidden_reason
WHERE order_id = @order_id
RETURNING hidden_at;

-- name: ShowReview :exec
UPDATE order_reviews SET hidden_at = NULL, hidden_by = NULL, hidden_reason = '' WHERE order_id = @order_id;

-- name: InsertLiveTicket :exec
INSERT INTO order_live_tickets (ticket_hash, topic, expires_at) VALUES (@ticket_hash, @topic, @expires_at);

-- name: RedeemLiveTicket :one
-- Spends a ticket: it is deleted as it is read, so it works once, and only
-- before it expires.
DELETE FROM order_live_tickets WHERE ticket_hash = @ticket_hash AND expires_at > @now
RETURNING topic;

-- name: PurgeLiveTickets :execrows
DELETE FROM order_live_tickets WHERE expires_at <= @now;

-- name: NextChatSeq :one
-- Numbers the next message of an order's chat, creating the chat for its first.
-- The row lock it takes lasts until the transaction ends, so the messages of
-- one chat are numbered in the order they commit. Nothing is returned once the
-- chat holds max_messages.
INSERT INTO order_chats (order_id, last_seq) VALUES (@order_id, 1)
ON CONFLICT (order_id) DO UPDATE SET last_seq = order_chats.last_seq + 1
WHERE order_chats.last_seq < @max_messages::int
RETURNING last_seq;

-- name: InsertMessage :exec
INSERT INTO order_messages (order_id, seq, sender, body, idempotency_key, sent_at)
VALUES (@order_id, @seq, @sender, @body, @idempotency_key, @sent_at);

-- name: MessageOfKey :one
-- The message a side already sent with this idempotency key.
SELECT seq, sender, body, sent_at FROM order_messages
WHERE order_id = @order_id AND sender = @sender AND idempotency_key = @idempotency_key;

-- name: NthRecentMessageTime :one
-- When a side's message was sent that has skip_rows newer ones, among those
-- sent since a moment; nothing when the side sent fewer since.
SELECT sent_at FROM order_messages
WHERE order_id = @order_id AND sender = @sender AND sent_at > @since
ORDER BY sent_at DESC
LIMIT 1 OFFSET @skip_rows;

-- name: ListMessages :many
SELECT seq, sender, body, sent_at FROM order_messages
WHERE order_id = @order_id AND seq > @after
ORDER BY seq
LIMIT @max_rows;

-- name: ChatSeen :one
SELECT customer_seen_seq, seller_seen_seq FROM order_chats WHERE order_id = @order_id;

-- name: RaiseSeen :one
-- Raises what a side has seen, never lowers it and never beyond the latest
-- message; nothing is returned when it did not rise.
UPDATE order_chats
SET customer_seen_seq = CASE WHEN @side::text = 'customer' THEN LEAST(@up_to::int, last_seq) ELSE customer_seen_seq END,
    seller_seen_seq = CASE WHEN @side::text = 'seller' THEN LEAST(@up_to::int, last_seq) ELSE seller_seen_seq END
WHERE order_id = @order_id
  AND CASE WHEN @side::text = 'customer' THEN customer_seen_seq ELSE seller_seen_seq END < LEAST(@up_to::int, last_seq)
RETURNING (CASE WHEN @side::text = 'customer' THEN customer_seen_seq ELSE seller_seen_seq END)::int AS seen_seq;

-- name: UnreadOf :many
-- For each order with a chat: how many messages it holds, what its customer
-- has not read from the seller, and what its seller's people have not read
-- from the customer.
SELECT c.order_id,
       c.last_seq AS messages,
       (SELECT count(*) FROM order_messages AS m
        WHERE m.order_id = c.order_id AND m.sender = 'seller' AND m.seq > c.customer_seen_seq) AS customer_unread,
       (SELECT count(*) FROM order_messages AS m
        WHERE m.order_id = c.order_id AND m.sender = 'customer' AND m.seq > c.seller_seen_seq) AS seller_unread
FROM order_chats AS c
WHERE c.order_id = ANY (@order_ids::uuid[]);

-- name: DeleteChatsOfCustomer :execrows
-- The messages go with their chat.
DELETE FROM order_chats
WHERE order_id IN (SELECT id FROM order_orders WHERE customer_id = @customer_id);

-- name: ForgetContactsOfCustomer :execrows
-- Takes a deleted account's name and phone number, and its consent to Zalo, off its orders. The orders it already
-- left alone are not counted, so running it again changes nothing.
UPDATE order_orders
SET customer_name = '', customer_phone = '', zalo_consent_at = NULL, contact_forgotten_at = now()
WHERE customer_id = @customer_id AND contact_forgotten_at IS NULL;

-- name: DeleteChatsEndedBefore :execrows
DELETE FROM order_chats
WHERE order_id IN (SELECT id FROM order_orders WHERE window_end < @before);

-- name: MoveSellerOrders :execrows
-- Copies a seller's collection point onto its orders still to collect, and
-- tells the sockets following each (channel secondbite_live). Orders handed
-- over, cancelled, refused or expired keep what they copied.
WITH moved AS (
    UPDATE order_orders
    SET latitude = @latitude, longitude = @longitude, address = @address
    WHERE seller_id = @seller_id AND state IN ('confirmed', 'ready')
      AND (latitude, longitude, address) IS DISTINCT FROM (@latitude, @longitude, @address::text)
    RETURNING id, seller_id, state
)
SELECT pg_notify('secondbite_live', json_build_object(
    'topics', json_build_array('order:' || id::text, 'seller:' || seller_id::text),
    'notice', json_build_object('type', 'order', 'orderId', id, 'status', state)
)::text)
FROM moved;

-- name: MarkDueSoon :many
-- Marks the orders still to collect whose window opens between now and before,
-- once each, returning when each was placed and opens (SEC-25).
UPDATE order_orders SET due_soon_at = @now
WHERE due_soon_at IS NULL AND state IN ('confirmed', 'ready')
  AND window_start > @now AND window_start <= @before
RETURNING id, created_at, window_start;

-- name: OrderDays :many
-- The orders per collection day in Vietnam and seller, by how they ended, for the admin's report (SEC-80). An order
-- confirmed or ready whose window is over counts as expired, as every read of an order reads it.
WITH placed AS (
    SELECT o.*, (SELECT sum(units) FROM order_lines l WHERE l.order_id = o.id)::bigint AS units
    FROM order_orders o
    WHERE o.window_start >= @since AND o.window_start < @until
      AND (sqlc.narg(seller_id)::uuid IS NULL OR o.seller_id = sqlc.narg(seller_id)::uuid)
)
SELECT (window_start AT TIME ZONE 'Asia/Ho_Chi_Minh')::date AS day, seller_id,
       count(*) AS held,
       sum(units)::bigint AS units_held,
       count(*) FILTER (WHERE state = 'collected') AS collected,
       coalesce(sum(units) FILTER (WHERE state = 'collected'), 0)::bigint AS units_collected,
       coalesce(sum(total_vnd) FILTER (WHERE state = 'collected'), 0)::bigint AS collected_vnd,
       count(*) FILTER (WHERE state = 'cancelled') AS cancelled,
       count(*) FILTER (WHERE state = 'refused') AS refused,
       count(*) FILTER (WHERE state = 'expired'
                           OR (state IN ('confirmed', 'ready') AND window_end <= now())) AS expired
FROM placed
GROUP BY 1, 2
ORDER BY 1, 2;

-- name: InsertProblem :execrows
-- Nothing is inserted when the order was already reported (SEC-84).
INSERT INTO order_problems (order_id, kind, note) VALUES (@order_id, @kind, @note)
ON CONFLICT (order_id) DO NOTHING;

-- name: AnswerProblem :execrows
-- Nothing is answered when there is no report or it was answered already.
UPDATE order_problems SET answer = @answer, answered_at = now()
WHERE order_id = @order_id AND answer IS NULL;

-- name: ProblemExists :one
SELECT EXISTS (SELECT 1 FROM order_problems WHERE order_id = @order_id);

-- name: ProblemsOf :many
SELECT order_id, kind, note, reported_at, answer, answered_at
FROM order_problems WHERE order_id = ANY (@order_ids::uuid[]);
