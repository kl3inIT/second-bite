-- name: LockUploader :exec
-- Serializes an account's uploads, so the limit of unused files holds.
SELECT pg_advisory_xact_lock(hashtextextended('file:uploader:' || @account_id::text, 0));

-- name: CountUnusedFiles :one
SELECT count(*)::integer FROM file_files WHERE uploaded_by = @account_id AND used_at IS NULL;

-- name: CountFilesSince :one
SELECT count(*)::integer FROM file_files WHERE uploaded_by = @account_id AND created_at >= @since;

-- name: InsertFile :exec
INSERT INTO file_files (id, purpose, store, object_key, media_type, size_bytes, uploaded_by, width, height)
VALUES (@id, @purpose, @store, @object_key, @media_type, @size_bytes, @uploaded_by, @width, @height);

-- name: GetFile :one
SELECT id, purpose, store, object_key, media_type, size_bytes, uploaded_by, width, height, used_at, created_at
FROM file_files WHERE id = @id;

-- name: ClaimFile :execrows
UPDATE file_files SET used_at = coalesce(used_at, now())
WHERE id = @id AND purpose = @purpose AND uploaded_by = @account_id;

-- name: PutBlob :exec
INSERT INTO file_blobs (key, content_type, data) VALUES (@key, @content_type, @data)
ON CONFLICT (key) DO UPDATE SET content_type = EXCLUDED.content_type, data = EXCLUDED.data;

-- name: GetBlob :one
SELECT content_type, data FROM file_blobs WHERE key = @key;

-- name: DeleteBlob :exec
DELETE FROM file_blobs WHERE key = @key;

-- name: UnusedFilesOf :many
-- The files an account uploaded that no offer or seller uses, to delete once
-- the account is deleted (SEC-37), in a set order so a run that fails part-way
-- is retried from where it stopped.
SELECT id, store, object_key FROM file_files WHERE uploaded_by = @account_id AND used_at IS NULL ORDER BY id;

-- name: DeleteUnusedFile :exec
DELETE FROM file_files WHERE id = @id AND used_at IS NULL;
