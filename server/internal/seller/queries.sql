-- name: LockAccount :exec
-- Serializes the sellers an account opens, so the limit holds under concurrency.
SELECT pg_advisory_xact_lock(hashtextextended('seller:owner:' || @account_id::text, 0));

-- name: CountOwnedSellers :one
-- A deleted seller no longer counts.
SELECT count(*)::integer FROM seller_members m JOIN seller_sellers s ON s.id = m.seller_id
WHERE m.account_id = @account_id AND m.role = 'owner' AND s.status <> 'deleted';

-- name: InsertSeller :one
INSERT INTO seller_sellers (name, address, latitude, longitude, phone, status)
VALUES (@name, @address, @latitude, @longitude, @phone, 'active')
RETURNING id;

-- name: InsertMember :execrows
INSERT INTO seller_members (seller_id, account_id, role)
VALUES (@seller_id, @account_id, @role)
ON CONFLICT (seller_id, account_id) DO NOTHING;

-- name: GetSeller :one
SELECT id, name, address, latitude, longitude, phone, status, status_reason, status_changed_at, status_changed_by, created_at, updated_at, photo_id,
       deletion_requested_at
FROM seller_sellers WHERE id = @id;

-- name: SellersOfAccount :many
-- A deleted seller is gone for its members.
SELECT s.id, s.name, s.address, s.latitude, s.longitude, s.phone, s.status, s.status_reason, s.status_changed_at,
       s.status_changed_by, s.created_at, s.updated_at, s.photo_id, m.role
FROM seller_members m JOIN seller_sellers s ON s.id = m.seller_id
WHERE m.account_id = @account_id AND s.status <> 'deleted'
ORDER BY s.created_at;

-- name: SellersForAdmins :many
-- One page of the sellers in the statuses given (all but the deleted when none), whose
-- words, folded, hold the query's (any when empty), last changed in [changed_since, changed_until) when given, in the order sort names: by default pending ones first,
-- the oldest first, as a queue, then the latest change first; otherwise by
-- name, address or last change, '-' first for descending. total counts them
-- all; it is absent when the page is past the end.
SELECT id, name, address, latitude, longitude, phone, status, status_reason, status_changed_at, status_changed_by, created_at, updated_at, photo_id,
       deletion_requested_at, count(*) OVER () AS total
FROM seller_sellers
WHERE (cardinality(@statuses::text[]) = 0 AND status <> 'deleted' OR status = ANY (@statuses::text[]))
  AND (@query::text = '' OR search_text LIKE '%' || seller_fold(@query::text) || '%' ESCAPE '\')
  AND (sqlc.narg(changed_since)::timestamptz IS NULL OR updated_at >= sqlc.narg(changed_since)::timestamptz)
  AND (sqlc.narg(changed_until)::timestamptz IS NULL OR updated_at < sqlc.narg(changed_until)::timestamptz)
ORDER BY CASE WHEN @sort::text = '' THEN status = 'pending' END DESC,
         CASE WHEN @sort::text = '' AND status = 'pending' THEN created_at END,
         CASE WHEN @sort::text = 'name' THEN seller_fold(name) END,
         CASE WHEN @sort::text = '-name' THEN seller_fold(name) END DESC,
         CASE WHEN @sort::text = 'address' THEN seller_fold(address) END,
         CASE WHEN @sort::text = '-address' THEN seller_fold(address) END DESC,
         CASE WHEN @sort::text = 'changed' THEN updated_at END,
         updated_at DESC,
         id
LIMIT @max_rows OFFSET @skip_rows;

-- name: CountSellersForAdmins :one
SELECT count(*) FROM seller_sellers
WHERE (cardinality(@statuses::text[]) = 0 AND status <> 'deleted' OR status = ANY (@statuses::text[]))
  AND (@query::text = '' OR search_text LIKE '%' || seller_fold(@query::text) || '%' ESCAPE '\')
  AND (sqlc.narg(changed_since)::timestamptz IS NULL OR updated_at >= sqlc.narg(changed_since)::timestamptz)
  AND (sqlc.narg(changed_until)::timestamptz IS NULL OR updated_at < sqlc.narg(changed_until)::timestamptz);

-- name: CountSellersByStatus :many
-- How many sellers of each status match the words and the time of the
-- last change, whatever the statuses asked, for the cards above
-- the list.
SELECT status, count(*) AS sellers FROM seller_sellers
WHERE (@query::text = '' OR search_text LIKE '%' || seller_fold(@query::text) || '%' ESCAPE '\')
  AND (sqlc.narg(changed_since)::timestamptz IS NULL OR updated_at >= sqlc.narg(changed_since)::timestamptz)
  AND (sqlc.narg(changed_until)::timestamptz IS NULL OR updated_at < sqlc.narg(changed_until)::timestamptz)
GROUP BY status;

-- name: LockStatusDays :exec
-- Serializes the writes of the day's counts, so each reads the changes
-- committed before it.
SELECT pg_advisory_xact_lock(hashtextextended('seller:status_days', 0));

-- name: RecordStatusDay :exec
-- Keeps how many sellers stand in each status now as today's, in Vietnam.
INSERT INTO seller_status_days (day, pending, active, rejected, blocked, deleted)
SELECT (now() AT TIME ZONE 'Asia/Ho_Chi_Minh')::date,
       count(*) FILTER (WHERE status = 'pending'),
       count(*) FILTER (WHERE status = 'active'),
       count(*) FILTER (WHERE status = 'rejected'),
       count(*) FILTER (WHERE status = 'blocked'),
       count(*) FILTER (WHERE status = 'deleted')
FROM seller_sellers
ON CONFLICT (day) DO UPDATE
SET pending = excluded.pending, active = excluded.active, rejected = excluded.rejected, blocked = excluded.blocked,
    deleted = excluded.deleted;

-- name: StatusDays :many
-- The days recorded from the last one on or before first, so the first day
-- asked stands as it was, to today.
SELECT day, pending, active, rejected, blocked, deleted FROM seller_status_days
WHERE day >= coalesce((SELECT max(d.day) FROM seller_status_days d WHERE d.day <= @first::date), @first::date)
ORDER BY day;


-- name: MemberRole :one
-- The members of a deleted seller have no role in it any more.
SELECT m.role FROM seller_members m JOIN seller_sellers s ON s.id = m.seller_id
WHERE m.seller_id = @seller_id AND m.account_id = @account_id AND s.status <> 'deleted';

-- name: UpdateSeller :one
-- Changes a seller's details under a row lock, and answers whether its
-- collection point (the point or the written address) moved.
WITH old AS (
    SELECT cur.id, cur.latitude, cur.longitude, cur.address FROM seller_sellers AS cur WHERE cur.id = @id FOR UPDATE
)
UPDATE seller_sellers AS s
SET name = @name, address = @address, latitude = @latitude, longitude = @longitude, phone = @phone, updated_at = now()
FROM old
WHERE s.id = old.id
RETURNING (old.latitude, old.longitude, old.address) IS DISTINCT FROM (s.latitude, s.longitude, s.address) AS moved;

-- name: ChangeStatus :one
-- Moves the seller to status when it stands in one of from, and answers the
-- status it left; no row when it does not. deleting marks the seller, blocked,
-- as waiting to be deleted, and is refused for one already waiting; any other
-- change ends the wait.
UPDATE seller_sellers s
SET status = @status, status_reason = sqlc.narg(reason), status_changed_at = now(),
    status_changed_by = @changed_by, updated_at = now(),
    deletion_requested_at = CASE WHEN @deleting::boolean THEN now() END
FROM (SELECT x.id, x.status, x.deletion_requested_at FROM seller_sellers x WHERE x.id = @id FOR UPDATE) was
WHERE s.id = was.id AND was.status = ANY (@from_statuses::text[])
  AND NOT (@deleting::boolean AND was.deletion_requested_at IS NOT NULL)
RETURNING was.status AS was;

-- name: RestoreSeller :one
-- Brings back a deleted seller, or one waiting to be deleted, blocked as it
-- was, and answers the status it left; no row when it is neither.
UPDATE seller_sellers s
SET status = 'blocked', deletion_requested_at = NULL, status_changed_at = now(),
    status_changed_by = @changed_by, updated_at = now()
FROM (SELECT x.id, x.status, x.deletion_requested_at FROM seller_sellers x WHERE x.id = @id FOR UPDATE) was
WHERE s.id = was.id AND (was.status = 'deleted' OR was.deletion_requested_at IS NOT NULL)
RETURNING was.status AS was;

-- name: SellersAwaitingDeletion :many
SELECT id FROM seller_sellers WHERE deletion_requested_at IS NOT NULL ORDER BY deletion_requested_at;

-- name: FinishDeletion :one
-- Deletes a seller still waiting for it; no row when it no longer waits.
UPDATE seller_sellers
SET status = 'deleted', deletion_requested_at = NULL, status_changed_at = now(), updated_at = now()
WHERE id = @id AND deletion_requested_at IS NOT NULL
RETURNING name;

-- name: SellerExists :one
SELECT EXISTS (SELECT 1 FROM seller_sellers WHERE id = @id);

-- name: HasOwner :one
SELECT EXISTS (SELECT 1 FROM seller_members WHERE seller_id = @seller_id AND role = 'owner');

-- name: OwnersOf :many
SELECT seller_id, account_id FROM seller_members WHERE seller_id = ANY (@seller_ids::uuid[]) AND role = 'owner';

-- name: LockSeller :exec
-- Serializes changes to a seller's members until the transaction ends.
SELECT 1 FROM seller_sellers WHERE id = @id FOR UPDATE;

-- name: CountMembers :one
SELECT count(*)::integer FROM seller_members WHERE seller_id = @seller_id;

-- name: Members :many
SELECT account_id, role, created_at FROM seller_members WHERE seller_id = @seller_id ORDER BY created_at;

-- name: DeleteStaff :execrows
DELETE FROM seller_members WHERE seller_id = @seller_id AND account_id = @account_id AND role = 'staff';

-- name: SetPhoto :exec
UPDATE seller_sellers SET photo_id = @photo_id, updated_at = now() WHERE id = @id;

-- name: ActiveSellers :many
SELECT id, name, address, latitude, longitude, photo_id
FROM seller_sellers WHERE id = ANY (sqlc.arg(ids)::uuid[]) AND status = 'active';

-- name: BlockedSellers :many
-- The blocked sellers and the deleted ones, whose offers customers no longer see.
SELECT id FROM seller_sellers WHERE status IN ('blocked', 'deleted');

-- name: SellersOwnedBy :many
SELECT seller_id FROM seller_members WHERE account_id = @account_id AND role = 'owner';

-- name: DeleteMembershipsOf :execrows
-- Every membership of an account, once the account is deleted (SEC-37).
DELETE FROM seller_members WHERE account_id = @account_id;

-- name: BlockOwnerless :execrows
-- A seller whose owner's account was deleted stops showing until admins decide;
-- no one set the status, so it names no one. A deleted seller stays deleted.
UPDATE seller_sellers
SET status = 'blocked', status_reason = @reason, status_changed_at = now(), status_changed_by = NULL, updated_at = now()
WHERE id = ANY (sqlc.arg(ids)::uuid[]) AND status NOT IN ('blocked', 'deleted');

-- name: MembershipsOfAccounts :many
-- The sellers the accounts own or work at, owners first, for admins.
SELECT m.account_id, m.role, s.id, s.name, s.status
FROM seller_members m JOIN seller_sellers s ON s.id = m.seller_id
WHERE m.account_id = ANY (@account_ids::uuid[])
ORDER BY m.account_id, m.role, s.name, s.id;

-- name: InsertFollow :exec
INSERT INTO seller_follows (account_id, seller_id)
VALUES (@account_id, @seller_id)
ON CONFLICT (account_id, seller_id) DO NOTHING;

-- name: DeleteFollow :exec
DELETE FROM seller_follows WHERE account_id = @account_id AND seller_id = @seller_id;

-- name: FollowedSellers :many
-- The active sellers an account follows, the latest followed first.
SELECT s.id, s.name, s.address, s.latitude, s.longitude, s.photo_id
FROM seller_follows f JOIN seller_sellers s ON s.id = f.seller_id
WHERE f.account_id = @account_id AND s.status = 'active'
ORDER BY f.created_at DESC, s.id;

-- name: DeleteFollowsOf :execrows
-- Every favourite of an account, once the account is deleted (SEC-109).
DELETE FROM seller_follows WHERE account_id = @account_id;

-- name: SellerNames :many
SELECT id, name FROM seller_sellers WHERE id = ANY(@ids::uuid[]);

-- name: RecentFeedbackCount :one
-- How many times the seller sent feedback in the last day (SEC-82).
SELECT count(*)::integer FROM seller_feedback
WHERE seller_id = @seller_id AND created_at > now() - interval '1 day';

-- name: InsertFeedback :exec
INSERT INTO seller_feedback (seller_id, body) VALUES (@seller_id, @body);

-- name: FeedbackForAdmins :many
-- The feedback sent in [since, until), of one seller when given, the latest
-- first, with the seller's name.
SELECT f.id, f.seller_id, s.name AS seller_name, f.body, f.created_at
FROM seller_feedback f JOIN seller_sellers s ON s.id = f.seller_id
WHERE f.created_at >= @since AND f.created_at < @until
  AND (sqlc.narg(seller_id)::uuid IS NULL OR f.seller_id = sqlc.narg(seller_id)::uuid)
ORDER BY f.created_at DESC, f.id
LIMIT @max_rows;

-- name: OwnerOf :one
SELECT account_id FROM seller_members WHERE seller_id = @seller_id AND role = 'owner';

-- name: SetRole :execrows
UPDATE seller_members SET role = @role WHERE seller_id = @seller_id AND account_id = @account_id;
