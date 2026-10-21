-- name: InsertEvent :exec
INSERT INTO audit_events (action, actor_id, actor_label, resource_type, resource_id, resource_label, details, request_id)
VALUES (@action, @actor_id, sqlc.narg(actor_label), @resource_type, @resource_id, sqlc.narg(resource_label), @details, sqlc.narg(request_id));

-- name: ForgetActor :exec
UPDATE audit_events SET actor_label = NULL WHERE actor_id = @account_id AND actor_label IS NOT NULL;

-- name: ForgetResource :exec
UPDATE audit_events SET resource_label = NULL
WHERE resource_type = 'account' AND resource_id = @account_id::text AND resource_label IS NOT NULL;
