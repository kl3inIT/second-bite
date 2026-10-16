-- Who delivers email, chosen by operators while the service runs, and the
-- emails sent with the identifier their provider gave them.
-- +goose Up
CREATE TABLE notification_email_settings (
    id                    smallint    PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    provider              text        NOT NULL CHECK (provider IN ('smtp', 'brevo')),
    sender_address        text        NOT NULL,
    sender_name           text        NOT NULL,
    smtp_host             text        NOT NULL DEFAULT '',
    smtp_port             integer     NOT NULL DEFAULT 0 CHECK (smtp_port BETWEEN 0 AND 65535),
    smtp_security         text        NOT NULL DEFAULT 'starttls' CHECK (smtp_security IN ('starttls', 'tls', 'none')),
    smtp_username         text        NOT NULL DEFAULT '',
    smtp_password_sealed  bytea,
    brevo_api_key_sealed  bytea,
    updated_at            timestamptz NOT NULL DEFAULT now(),
    updated_by            uuid
);

CREATE TABLE notification_emails (
    id                   uuid        PRIMARY KEY DEFAULT uuidv7(),
    kind                 text        NOT NULL,
    recipient            text        NOT NULL,
    provider             text        NOT NULL,
    provider_message_id  text        NOT NULL DEFAULT '',
    sent_at              timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX notification_emails_provider_message_id ON notification_emails (provider, provider_message_id);

-- +goose Down
DROP TABLE notification_emails;
DROP TABLE notification_email_settings;
