-- name: InsertView :exec
INSERT INTO stats_views (day, kind, subject_id, source, visitor)
VALUES (@day, @kind, @subject_id, @source, @visitor);

-- name: InsertSalt :exec
INSERT INTO stats_salts (day, salt) VALUES (@day, @salt)
ON CONFLICT (day) DO NOTHING;

-- name: GetSalt :one
SELECT salt FROM stats_salts WHERE day = @day;

-- name: DeleteSaltsBefore :execrows
DELETE FROM stats_salts WHERE day < @day;

-- name: DeleteViewsBefore :execrows
DELETE FROM stats_views WHERE day < @day;
