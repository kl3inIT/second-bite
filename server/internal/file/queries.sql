-- name: LockUploader :exec
-- Serializes an account's uploads, so the limit of unused photos holds.
SELECT pg_advisory_xact_lock(hashtextextended('file:uploader:' || @account_id::text, 0));

-- name: CountUnusedPhotos :one
SELECT count(*)::integer FROM file_photos WHERE uploaded_by = @account_id AND used_at IS NULL;

-- name: CountPhotosSince :one
SELECT count(*)::integer FROM file_photos WHERE uploaded_by = @account_id AND created_at >= @since;

-- name: InsertPhoto :exec
INSERT INTO file_photos (id, store, uploaded_by, width, height)
VALUES (@id, @store, @uploaded_by, @width, @height);

-- name: GetPhoto :one
SELECT id, store, uploaded_by, width, height, used_at, created_at FROM file_photos WHERE id = @id;

-- name: ClaimPhoto :execrows
UPDATE file_photos SET used_at = coalesce(used_at, now())
WHERE id = @id AND uploaded_by = @account_id;

-- name: PutBlob :exec
INSERT INTO file_blobs (key, content_type, data) VALUES (@key, @content_type, @data)
ON CONFLICT (key) DO UPDATE SET content_type = EXCLUDED.content_type, data = EXCLUDED.data;

-- name: GetBlob :one
SELECT content_type, data FROM file_blobs WHERE key = @key;

-- name: DeleteBlob :exec
DELETE FROM file_blobs WHERE key = @key;
