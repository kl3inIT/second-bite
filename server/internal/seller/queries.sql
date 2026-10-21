-- name: LockAccount :exec
-- Serializes the sellers an account opens, so the limit holds under concurrency.
SELECT pg_advisory_xact_lock(hashtextextended('seller:owner:' || @account_id::text, 0));

-- name: CountOwnedSellers :one
SELECT count(*)::integer FROM seller_members WHERE account_id = @account_id AND role = 'owner';

-- name: InsertSeller :one
INSERT INTO seller_sellers (name, address, latitude, longitude, phone, status)
VALUES (@name, @address, @latitude, @longitude, @phone, 'active')
RETURNING id;

-- name: InsertMember :execrows
INSERT INTO seller_members (seller_id, account_id, role)
VALUES (@seller_id, @account_id, @role)
ON CONFLICT (seller_id, account_id) DO NOTHING;

-- name: GetSeller :one
SELECT id, name, address, latitude, longitude, phone, status, status_reason, status_changed_at, status_changed_by, created_at, updated_at, photo_id
FROM seller_sellers WHERE id = @id;

-- name: SellersOfAccount :many
SELECT s.id, s.name, s.address, s.latitude, s.longitude, s.phone, s.status, s.status_reason, s.status_changed_at,
       s.status_changed_by, s.created_at, s.updated_at, s.photo_id, m.role
FROM seller_members m JOIN seller_sellers s ON s.id = m.seller_id
WHERE m.account_id = @account_id
ORDER BY s.created_at;

-- name: SellersForAdmins :many
-- One page of the sellers in the statuses given (all when none), whose
-- words, folded, hold the query's (any when empty), in the order sort names: by default pending ones first,
-- the oldest first, as a queue, then the latest change first; otherwise by
-- name, address or last change, '-' first for descending. total counts them
-- all; it is absent when the page is past the end.
SELECT id, name, address, latitude, longitude, phone, status, status_reason, status_changed_at, status_changed_by, created_at, updated_at, photo_id,
       count(*) OVER () AS total
FROM seller_sellers
WHERE (cardinality(@statuses::text[]) = 0 OR status = ANY (@statuses::text[]))
  AND (@query::text = '' OR search_text LIKE '%' || seller_fold(@query::text) || '%' ESCAPE '\')
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
WHERE (cardinality(@statuses::text[]) = 0 OR status = ANY (@statuses::text[]))
  AND (@query::text = '' OR search_text LIKE '%' || seller_fold(@query::text) || '%' ESCAPE '\');

-- name: CountSellersByStatus :many
-- How many sellers of each status match the words, whatever the statuses
-- asked, for the counts above the list.
SELECT status, count(*) AS sellers FROM seller_sellers
WHERE (@query::text = '' OR search_text LIKE '%' || seller_fold(@query::text) || '%' ESCAPE '\')
GROUP BY status;

-- name: MemberRole :one
SELECT role FROM seller_members WHERE seller_id = @seller_id AND account_id = @account_id;

-- name: UpdateSeller :exec
UPDATE seller_sellers
SET name = @name, address = @address, latitude = @latitude, longitude = @longitude, phone = @phone, updated_at = now()
WHERE id = @id;

-- name: ChangeStatus :one
-- Moves the seller to status when it stands in one of from, and answers the
-- status it left; no row when it does not.
UPDATE seller_sellers s
SET status = @status, status_reason = sqlc.narg(reason), status_changed_at = now(),
    status_changed_by = @changed_by, updated_at = now()
FROM (SELECT x.id, x.status FROM seller_sellers x WHERE x.id = @id FOR UPDATE) was
WHERE s.id = was.id AND was.status = ANY (@from_statuses::text[])
RETURNING was.status AS was;

-- name: SellerExists :one
SELECT EXISTS (SELECT 1 FROM seller_sellers WHERE id = @id);

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
SELECT id FROM seller_sellers WHERE status = 'blocked';

-- name: SellersOwnedBy :many
SELECT seller_id FROM seller_members WHERE account_id = @account_id AND role = 'owner';

-- name: DeleteMembershipsOf :execrows
-- Every membership of an account, once the account is deleted (SEC-37).
DELETE FROM seller_members WHERE account_id = @account_id;

-- name: BlockOwnerless :execrows
-- A seller whose owner's account was deleted stops showing until admins decide;
-- no one set the status, so it names no one.
UPDATE seller_sellers
SET status = 'blocked', status_reason = @reason, status_changed_at = now(), status_changed_by = NULL, updated_at = now()
WHERE id = ANY (sqlc.arg(ids)::uuid[]) AND status <> 'blocked';

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
