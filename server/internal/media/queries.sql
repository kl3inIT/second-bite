-- name: LockUploader :exec
-- Serializes an account's uploads, so the limit of unused photos holds.
SELECT pg_advisory_xact_lock(hashtextextended('media:uploader:' || @account_id::text, 0));

-- name: CountUnusedPhotos :one
SELECT count(*)::integer FROM media_photos WHERE uploaded_by = @account_id AND used_at IS NULL;

-- name: InsertPhoto :exec
INSERT INTO media_photos (id, store, uploaded_by, width, height)
VALUES (@id, @store, @uploaded_by, @width, @height);

-- name: GetPhoto :one
SELECT id, store, uploaded_by, width, height, used_at, created_at FROM media_photos WHERE id = @id;

-- name: ClaimPhoto :execrows
UPDATE media_photos SET used_at = coalesce(used_at, now())
WHERE id = @id AND uploaded_by = @account_id;

-- name: PutFile :exec
INSERT INTO media_files (key, content_type, data) VALUES (@key, @content_type, @data)
ON CONFLICT (key) DO UPDATE SET content_type = EXCLUDED.content_type, data = EXCLUDED.data;

-- name: GetFile :one
SELECT content_type, data FROM media_files WHERE key = @key;

-- name: DeleteFile :exec
DELETE FROM media_files WHERE key = @key;
