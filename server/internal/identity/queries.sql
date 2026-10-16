-- name: LockEmail :exec
-- Serializes the requests for one address until the transaction ends.
SELECT pg_advisory_xact_lock(hashtextextended('identity:' || @email::text, 0));

-- name: ChallengeUsage :one
-- What the codes sent to an address in the last day have used, for its limits.
SELECT
    (count(*) FILTER (WHERE created_at > now() - interval '1 hour'))::integer AS sent_last_hour,
    coalesce(max(created_at), 'epoch')::timestamptz AS newest_sent_at,
    coalesce(min(created_at) FILTER (WHERE created_at > now() - interval '1 hour'), 'epoch')::timestamptz AS oldest_sent_last_hour,
    (coalesce(sum(failed_attempts) FILTER (WHERE created_at > now() - interval '1 hour'), 0))::integer AS wrong_last_hour,
    (coalesce(sum(failed_attempts), 0))::integer AS wrong_last_day,
    coalesce(min(created_at) FILTER (WHERE failed_attempts > 0 AND created_at > now() - interval '1 hour'), 'epoch')::timestamptz AS oldest_wrong_last_hour,
    coalesce(min(created_at) FILTER (WHERE failed_attempts > 0), 'epoch')::timestamptz AS oldest_wrong_last_day,
    now()::timestamptz AS checked_at
FROM identity_sign_in_challenges
WHERE email = @email AND created_at > now() - interval '1 day';

-- name: DeleteOldChallenges :exec
DELETE FROM identity_sign_in_challenges WHERE created_at < now() - interval '1 day';

-- name: EndLiveChallenges :exec
-- A new code replaces the address's earlier ones; their wrong guesses still count.
UPDATE identity_sign_in_challenges SET expires_at = now()
WHERE email = @email AND expires_at > now();

-- name: InsertChallenge :one
INSERT INTO identity_sign_in_challenges (id, email, code_hash, expires_at)
VALUES (@id, @email, @code_hash, now() + make_interval(secs => @lifetime_seconds::integer))
RETURNING expires_at;

-- name: DeleteChallenge :execrows
DELETE FROM identity_sign_in_challenges WHERE id = @id;

-- name: SpendAttempt :one
-- Pays for a guess before the code is compared, so every guess is counted.
UPDATE identity_sign_in_challenges
SET failed_attempts = failed_attempts + 1
WHERE id = @id AND expires_at > now() AND failed_attempts < @max_attempts::integer
RETURNING email, code_hash;

-- name: ChallengeExhausted :one
SELECT EXISTS (
    SELECT 1 FROM identity_sign_in_challenges
    WHERE id = @id AND expires_at > now() AND failed_attempts >= @max_attempts::integer
);

-- name: UpsertAccount :one
INSERT INTO identity_accounts (email) VALUES (@email)
ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
RETURNING id, email, role;

-- name: GrantRole :one
INSERT INTO identity_accounts (email, role) VALUES (@email, @role)
ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role
RETURNING id, email, role;

-- name: GetAccounts :many
SELECT id, email, role FROM identity_accounts WHERE id = ANY(@ids::uuid[]);

-- name: GetAccount :one
SELECT id, email, role FROM identity_accounts WHERE id = @id;

-- name: InsertSession :one
INSERT INTO identity_sessions (account_id, token_hash, expires_at)
VALUES (@account_id, @token_hash, now() + make_interval(secs => @lifetime_seconds::integer))
RETURNING id, expires_at;

-- name: FindSession :one
SELECT s.id, s.account_id, s.last_seen_at, a.role
FROM identity_sessions s JOIN identity_accounts a ON a.id = s.account_id
WHERE s.token_hash = @token_hash AND s.expires_at > now();

-- name: TouchSession :exec
UPDATE identity_sessions
SET last_seen_at = now(), expires_at = now() + make_interval(secs => @lifetime_seconds::integer)
WHERE id = @id;

-- name: DeleteSession :exec
DELETE FROM identity_sessions WHERE id = @id;

-- name: DeleteExpiredSessions :exec
DELETE FROM identity_sessions WHERE account_id = @account_id AND expires_at <= now();
