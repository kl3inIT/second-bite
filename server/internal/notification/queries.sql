-- name: GetEmailSettings :one
SELECT * FROM notification_email_settings WHERE id = 1;

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
