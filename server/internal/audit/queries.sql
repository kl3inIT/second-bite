-- name: InsertEvent :exec
INSERT INTO audit_events (action, actor_id, actor_label, resource_type, resource_id, resource_label, details, request_id)
VALUES (@action, @actor_id, sqlc.narg(actor_label), @resource_type, @resource_id, sqlc.narg(resource_label), @details, sqlc.narg(request_id));

-- name: ForgetActor :exec
UPDATE audit_events SET actor_label = NULL WHERE actor_id = @account_id AND actor_label IS NOT NULL;

-- name: ForgetResource :exec
UPDATE audit_events SET resource_label = NULL
WHERE resource_type = 'account' AND resource_id = @account_id::text AND resource_label IS NOT NULL;

-- name: ListEvents :many
-- One page of the events of the actions given (all when none), by one admin
-- (any when null), between two times (open when null), whose labels hold the
-- query or whose resource it names (any when empty), the latest first. total
-- counts them all; it is absent when the page is past the end.
SELECT id, occurred_at, action, actor_id, actor_label, resource_type, resource_id, resource_label, details,
       count(*) OVER () AS total
FROM audit_events
WHERE (cardinality(@actions::text[]) = 0 OR action = ANY (@actions::text[]))
  AND (sqlc.narg(actor_id)::uuid IS NULL OR actor_id = sqlc.narg(actor_id)::uuid)
  AND (sqlc.narg(since)::timestamptz IS NULL OR occurred_at >= sqlc.narg(since)::timestamptz)
  AND (sqlc.narg(until)::timestamptz IS NULL OR occurred_at < sqlc.narg(until)::timestamptz)
  AND (@query::text = ''
       OR actor_label ILIKE '%' || @query::text || '%' ESCAPE '\'
       OR resource_label ILIKE '%' || @query::text || '%' ESCAPE '\'
       OR resource_id = @query::text)
ORDER BY occurred_at DESC, id DESC
LIMIT @max_rows OFFSET @skip_rows;

-- name: CountEvents :one
SELECT count(*) FROM audit_events
WHERE (cardinality(@actions::text[]) = 0 OR action = ANY (@actions::text[]))
  AND (sqlc.narg(actor_id)::uuid IS NULL OR actor_id = sqlc.narg(actor_id)::uuid)
  AND (sqlc.narg(since)::timestamptz IS NULL OR occurred_at >= sqlc.narg(since)::timestamptz)
  AND (sqlc.narg(until)::timestamptz IS NULL OR occurred_at < sqlc.narg(until)::timestamptz)
  AND (@query::text = ''
       OR actor_label ILIKE '%' || @query::text || '%' ESCAPE '\'
       OR resource_label ILIKE '%' || @query::text || '%' ESCAPE '\'
       OR resource_id = @query::text);
