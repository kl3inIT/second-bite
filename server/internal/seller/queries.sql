-- name: LockAccount :exec
-- Serializes the sellers an account opens, so the limit holds under concurrency.
SELECT pg_advisory_xact_lock(hashtextextended('seller:owner:' || @account_id::text, 0));

-- name: CountOwnedSellers :one
SELECT count(*)::integer FROM seller_members WHERE account_id = @account_id AND role = 'owner';

-- name: InsertSeller :one
INSERT INTO seller_sellers (name, address, latitude, longitude, phone)
VALUES (@name, @address, @latitude, @longitude, @phone)
RETURNING id;

-- name: InsertMember :execrows
INSERT INTO seller_members (seller_id, account_id, role)
VALUES (@seller_id, @account_id, @role)
ON CONFLICT (seller_id, account_id) DO NOTHING;

-- name: GetSeller :one
SELECT id, name, address, latitude, longitude, phone, status, status_changed_at, status_changed_by, created_at, updated_at
FROM seller_sellers WHERE id = @id;

-- name: SellersOfAccount :many
SELECT s.id, s.name, s.address, s.latitude, s.longitude, s.phone, s.status, s.status_changed_at, s.status_changed_by,
       s.created_at, s.updated_at, m.role
FROM seller_members m JOIN seller_sellers s ON s.id = m.seller_id
WHERE m.account_id = @account_id
ORDER BY s.created_at;

-- name: SellersByStatus :many
SELECT id, name, address, latitude, longitude, phone, status, status_changed_at, status_changed_by, created_at, updated_at
FROM seller_sellers
WHERE status = @status
ORDER BY created_at, id
LIMIT @max_rows OFFSET @skip_rows;

-- name: MemberRole :one
SELECT role FROM seller_members WHERE seller_id = @seller_id AND account_id = @account_id;

-- name: UpdateSeller :exec
UPDATE seller_sellers
SET name = @name, address = @address, latitude = @latitude, longitude = @longitude, phone = @phone, updated_at = now()
WHERE id = @id;

-- name: SetStatus :execrows
UPDATE seller_sellers
SET status = @status, status_changed_at = now(), status_changed_by = @changed_by, updated_at = now()
WHERE id = @id;

-- name: Members :many
SELECT account_id, role, created_at FROM seller_members WHERE seller_id = @seller_id ORDER BY created_at;

-- name: DeleteStaff :execrows
DELETE FROM seller_members WHERE seller_id = @seller_id AND account_id = @account_id AND role = 'staff';

-- name: CanPublish :one
SELECT EXISTS (
    SELECT 1 FROM seller_members m JOIN seller_sellers s ON s.id = m.seller_id
    WHERE m.seller_id = @seller_id AND m.account_id = @account_id AND s.status = 'active'
);
