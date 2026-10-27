-- Web Push (SEC-25): the browsers that asked to be told, the topics each follows, and the pushes waiting to reach
-- them. A topic is a live socket's (order:{orderId} or seller:{sellerId}), proven with a live ticket when the browser
-- subscribes; it lapses seven days later unless proven again.
-- +goose Up
CREATE TABLE notification_push_subscriptions (
    id          uuid        PRIMARY KEY DEFAULT uuidv7(),
    -- The push service's address for this browser, which is the subscription's identity.
    endpoint    text        NOT NULL UNIQUE CHECK (char_length(endpoint) BETWEEN 1 AND 2048),
    p256dh      text        NOT NULL CHECK (char_length(p256dh) BETWEEN 1 AND 255),
    auth        text        NOT NULL CHECK (char_length(auth) BETWEEN 1 AND 255),
    -- The language the browser asked for when it subscribed; the pushes are written in it.
    language    text        NOT NULL CHECK (language IN ('vi', 'en')),
    created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE notification_push_topics (
    subscription_id uuid        NOT NULL REFERENCES notification_push_subscriptions (id) ON DELETE CASCADE,
    topic           text        NOT NULL CHECK (char_length(topic) BETWEEN 1 AND 100),
    expires_at      timestamptz NOT NULL,
    PRIMARY KEY (subscription_id, topic)
);

CREATE INDEX notification_push_topics_topic ON notification_push_topics (topic, expires_at);
CREATE INDEX notification_push_topics_expires ON notification_push_topics (expires_at);

-- A push written in the transaction of the change it tells of, sent after the commit; deleted once every browser
-- following its topic has it, or once it is too old to matter.
CREATE TABLE notification_pushes (
    id          uuid        PRIMARY KEY DEFAULT uuidv7(),
    topic       text        NOT NULL,
    -- What it is about: a newer push about the same thing replaces one still waiting on the device.
    about       uuid        NOT NULL,
    -- The page it opens, after the language: /orders/{id}.
    path        text        NOT NULL CHECK (path LIKE '/%'),
    title_vi    text        NOT NULL,
    title_en    text        NOT NULL,
    body_vi     text        NOT NULL,
    body_en     text        NOT NULL,
    created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX notification_pushes_created ON notification_pushes (created_at);

-- The browsers a push already reached, so a retry after a passing failure sends only to the others.
CREATE TABLE notification_push_deliveries (
    push_id         uuid NOT NULL REFERENCES notification_pushes (id) ON DELETE CASCADE,
    subscription_id uuid NOT NULL REFERENCES notification_push_subscriptions (id) ON DELETE CASCADE,
    PRIMARY KEY (push_id, subscription_id)
);

-- +goose Down
DROP TABLE notification_push_deliveries;
DROP TABLE notification_pushes;
DROP TABLE notification_push_topics;
DROP TABLE notification_push_subscriptions;
