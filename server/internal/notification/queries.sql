-- name: GetEmailSettings :one
SELECT * FROM notification_email_settings WHERE id = 1;

-- name: LockEmailSettings :one
-- The settings, locked until the transaction saving them ends.
SELECT * FROM notification_email_settings WHERE id = 1 FOR UPDATE;

-- name: PutEmailSettings :exec
INSERT INTO notification_email_settings (
    id, provider, sender_address, sender_name,
    smtp_host, smtp_port, smtp_security, smtp_username, smtp_password_sealed,
    brevo_api_key_sealed, updated_at, updated_by
) VALUES (
    1, @provider, @sender_address, @sender_name,
    @smtp_host, @smtp_port, @smtp_security, @smtp_username, @smtp_password_sealed,
    @brevo_api_key_sealed, now(), @updated_by
)
ON CONFLICT (id) DO UPDATE SET
    provider = EXCLUDED.provider,
    sender_address = EXCLUDED.sender_address,
    sender_name = EXCLUDED.sender_name,
    smtp_host = EXCLUDED.smtp_host,
    smtp_port = EXCLUDED.smtp_port,
    smtp_security = EXCLUDED.smtp_security,
    smtp_username = EXCLUDED.smtp_username,
    smtp_password_sealed = EXCLUDED.smtp_password_sealed,
    brevo_api_key_sealed = EXCLUDED.brevo_api_key_sealed,
    updated_at = now(),
    updated_by = EXCLUDED.updated_by;

-- name: RecordEmail :exec
INSERT INTO notification_emails (kind, recipient, provider, provider_message_id)
VALUES (@kind, @recipient, @provider, @provider_message_id);

-- name: DeleteEmailsTo :execrows
-- Forgets every email sent to an address, once its account is deleted.
DELETE FROM notification_emails WHERE lower(recipient) = lower(@recipient);

-- name: SaveSubscription :one
-- A browser's subscription, kept by its endpoint: subscribing again renews its keys and its language.
INSERT INTO notification_push_subscriptions (endpoint, p256dh, auth, language)
VALUES (@endpoint, @p256dh, @auth, @language)
ON CONFLICT (endpoint) DO UPDATE SET p256dh = EXCLUDED.p256dh, auth = EXCLUDED.auth, language = EXCLUDED.language
RETURNING id;

-- name: FollowTopic :exec
-- The subscription follows topic until expires_at; following it again moves that later.
INSERT INTO notification_push_topics (subscription_id, topic, expires_at)
VALUES (@subscription_id, @topic, @expires_at)
ON CONFLICT (subscription_id, topic) DO UPDATE SET expires_at = EXCLUDED.expires_at;

-- name: DeleteSubscription :execrows
DELETE FROM notification_push_subscriptions WHERE endpoint = @endpoint;

-- name: DeleteSubscriptionByID :exec
DELETE FROM notification_push_subscriptions WHERE id = @id;

-- name: TopicFollowed :one
-- Whether any browser follows topic now, so a push nobody would receive is not written.
SELECT EXISTS (SELECT 1 FROM notification_push_topics WHERE topic = @topic AND expires_at > @now) AS followed;

-- name: InsertPush :one
INSERT INTO notification_pushes (topic, about, path, title_vi, title_en, body_vi, body_en)
VALUES (@topic, @about, @path, @title_vi, @title_en, @body_vi, @body_en)
RETURNING id;

-- name: GetPush :one
SELECT * FROM notification_pushes WHERE id = @id;

-- name: PendingRecipients :many
-- The browsers following a push's topic now that it has not reached yet.
SELECT s.id, s.endpoint, s.p256dh, s.auth, s.language
FROM notification_push_topics AS t
JOIN notification_push_subscriptions AS s ON s.id = t.subscription_id
WHERE t.topic = @topic AND t.expires_at > @now
  AND NOT EXISTS (
      SELECT 1 FROM notification_push_deliveries AS d WHERE d.push_id = @push_id AND d.subscription_id = s.id
  )
ORDER BY s.id;

-- name: RecordDelivery :exec
INSERT INTO notification_push_deliveries (push_id, subscription_id) VALUES (@push_id, @subscription_id)
ON CONFLICT DO NOTHING;

-- name: DeletePush :exec
DELETE FROM notification_pushes WHERE id = @id;

-- name: PurgePushes :one
-- Forgets the topics that lapsed, the subscriptions left with none a day after they were made, and the pushes too
-- old to matter; returns how many of each.
WITH topics AS (
    DELETE FROM notification_push_topics AS lapsed WHERE lapsed.expires_at <= @now RETURNING 1
), subscriptions AS (
    DELETE FROM notification_push_subscriptions AS s
    WHERE s.created_at <= @subscription_before
      AND NOT EXISTS (
          SELECT 1 FROM notification_push_topics AS t WHERE t.subscription_id = s.id AND t.expires_at > @now
      )
    RETURNING 1
), pushes AS (
    DELETE FROM notification_pushes AS old WHERE old.created_at <= @push_before RETURNING 1
)
SELECT (SELECT count(*) FROM topics) AS topics,
       (SELECT count(*) FROM subscriptions) AS subscriptions,
       (SELECT count(*) FROM pushes) AS pushes;
