# notification

Owns who delivers email, chosen by admins while the service runs, and the record of emails sent (tables `notification_*`). Decided in the [SEC-10 design](../increments/completed/sec-10-backend-foundation/design.md#email-delivery). Checks: [docs/tests/notification.md](../tests/notification.md).

## Operations

| Operation | Who | Answer |
| --- | --- | --- |
| `GET /admin/email-settings` | Admins | `200` with the provider, the sender, the SMTP server, and whether the SMTP password and the Brevo API key are set, never a secret; their version in `ETag` |
| `PUT /admin/email-settings`, with `If-Match` or `If-None-Match: *` | Admins | `204`; the next email uses the new settings. `If-Match` carries the `ETag` read; `If-None-Match: *` saves the first settings, when the read answered `NOTIFICATION_EMAIL_NOT_CONFIGURED`. `412` when saved since; `400 PLATFORM_VERSION_REQUIRED` without either |
| `POST /admin/email-settings/test` | Admins | `204` once one email went through the settings saved to `to`, or to the admin's own address without it. A failed send says which: `409 NOTIFICATION_TEST_EMAIL_REFUSED` when the provider refused (user, password, key or sender), `503 NOTIFICATION_TEST_EMAIL_UNREACHABLE` when it could not be reached, otherwise as `SendEmail` answers; never the provider's own words. Not recorded in the audit trail: it changes nothing |

Published to other modules: `SendEmail`, which sends one email now and records it.

Administrative command: `secondbite email configure` with `-provider`, `-sender-address`, `-sender-name`, the SMTP flags and `-secret-stdin`, which reads the SMTP password or the Brevo API key from standard input.

## Rules

- Providers: `smtp` (any SMTP server; Mailpit in development) and `brevo` (Brevo's HTTP API, `POST /v3/smtp/email`). Each send reads the current settings and resolves the provider through a registry built at startup; startup fails when a provider has no implementation or two.
- A fresh database sends nothing until a provider is chosen.
- The SMTP password and the Brevo API key are sealed with AES-256-GCM under `SECONDBITE_EMAIL_SETTINGS_KEY`, each with its field's name as additional data. An empty secret on save keeps the stored one. Replacing the key makes the stored secrets unreadable; an admin enters them again.
- A stored SMTP password follows only its server: changing the host, port, security or user drops it unless a new password comes with the change. A password is refused with security `none`.
- A send has a 10-second bound. A provider's failure is classified as refused, rate limited (with the wait it asks for) or unavailable; a provider's error text is never logged.
- Each change of the settings is recorded in the audit trail with the provider and the names of the fields changed, never a value; from the command line it has no actor (SEC-75). A save that changes nothing writes nothing. A secret counts as changed when a new one is given or the stored one is dropped.
- Each email sent is recorded with its kind, recipient, provider and the provider's message id.
- `ForgetRecipient` deletes the record of every email sent to an address, which identity calls when it deletes the address's account (SEC-37). The index `notification_emails_recipient` on `lower(recipient)` finds them (SEC-126).

## Web Push

Decided in the [SEC-25 design](../increments/active/sec-25-web-push/design.md).

| Operation | Who | Answer |
| --- | --- | --- |
| `GET /push/key` | Anyone | `200` with the VAPID public key; `503 NOTIFICATION_PUSH_NOT_CONFIGURED` while Web Push is off |
| `POST /push/subscriptions` | Anyone holding live tickets | `204`. The browser's subscription is saved by its endpoint, with its keys and the language of `Accept-Language`. It follows the topic each ticket proves (1 to 20 tickets) for seven days; subscribing again renews the topics. A spent or expired ticket answers `400 NOTIFICATION_PUSH_TICKET_INVALID` |
| `POST /push/subscriptions/remove` | Anyone | `204`; the subscription and its topics are forgotten |

Published to other modules: `QueuePush(ctx, tx, Push)`.

- **On the web** (`web/src/features/notification`):
  - **Where it is offered:** the order page of an order still to collect offers "Báo tôi khi món sẵn sàng" for it and the other orders of its cart. Following the founder's phone review on 23 October 2026, the store's Đơn tab hides the entire seller notification card, including setup instructions, errors and status. It still quietly renews the store's topics when the browser already allows notifications.
  - **Asking:** the browser's prompt comes only from that button. Once notifications are allowed in a browser, every visit to those pages follows their topics again without asking, which renews them for seven days.
  - **What a customer sees instead of the button:**
    - an iPhone or iPad outside a Home Screen app sees the three steps to add the site;
    - a browser that blocks notifications sees how to allow them again;
    - without push in the browser, or with Web Push off on the server, nothing is shown.
  - **The service worker,** `public/sw.js`, served uncached, shows a push on browsers that do not read Declarative Web Push themselves. A tap opens the push's page on this site, in a tab already showing it or led there.
  - **Installing:** the manifest (`app/manifest.ts`) and the icons in `public/icons` let a phone add the site to its Home Screen.

- **Writing a push.** `QueuePush` writes a push in the caller's transaction, with its topic, what it is about, the page it opens and its title and body in Vietnamese and English. It also publishes `notification.push_queued`, so nothing is sent when the change rolls back. A push no browser follows, and every push while Web Push is off, is not written.
- **Sending.** The module's own listener (`notification.deliver_push`) sends each push with `webpush-go`:
  - the VAPID keys, with `SECONDBITE_SITE_URL` as the sender;
  - Topic set to what the push is about, so a newer push replaces one still waiting on the device;
  - Urgency `high` and a TTL of 30 minutes;
  - one HTTP client, bounded to 10 seconds and following no redirect.
- **The payload** is Declarative Web Push JSON (`web_push: 8030`) with the title, body, language, tag and `navigate`, the page at `SECONDBITE_SITE_URL/{language}{path}`.
- **The push service's answer:**
  - 2xx is delivered;
  - 404 or 410 forgets the subscription;
  - 429, 5xx or no answer fails the delivery, so River tries again, and the browsers already reached (`notification_push_deliveries`) are skipped;
  - any other answer is logged and not tried again;
  - a push older than 30 minutes is dropped.
- **Endpoints** are HTTPS on the default port, at the push services of Chrome and Edge (`fcm.googleapis.com`), Firefox (`push.services.mozilla.com`), Apple (`push.apple.com`) and Windows (`notify.windows.com`), or a host under them. The server posts nowhere else.
- **Logs** hold the push, the subscription's identifier and the status, never the endpoint.
- **Purging.** `notification.purge_pushes`, every hour, deletes:
  - lapsed topics;
  - subscriptions that follow nothing, a day after they were made;
  - pushes older than 30 minutes.
- `secondbite push keys -private-key-file PATH` makes a VAPID key pair. It writes the private key to a new file that only its owner may read, and prints the public key.

## Data

| Table | Holds | Lifecycle |
| --- | --- | --- |
| `notification_email_settings` | One row: provider, sender, SMTP server and user, sealed secrets, who changed it and when | Replaced on save |
| `notification_emails` | Kind, recipient, provider, provider's message id, time sent | Kept; retention not decided yet |
| `notification_push_subscriptions` | A browser's endpoint (unique), its keys, its language, when made | Deleted when its push service says it is gone, when the browser unsubscribes, or a day after it follows nothing |
| `notification_push_topics` | A subscription, a topic it follows, when that lapses | Deleted when lapsed |
| `notification_pushes` | Topic, what it is about, the page, title and body in both languages, when written | Deleted once sent, or after 30 minutes |
| `notification_push_deliveries` | The subscriptions a push reached | With the push |

## Failures

| Code | Status | When |
| --- | --- | --- |
| `NOTIFICATION_EMAIL_SETTINGS_INVALID` | 400 | Settings incomplete for the chosen provider, or a password with security `none` |
| `NOTIFICATION_EMAIL_NOT_CONFIGURED` | 503 | No provider chosen yet; `Retry-After` 60 seconds |
| `NOTIFICATION_EMAIL_UNAVAILABLE` | 503 | The provider refused or could not be reached; `Retry-After` 30 seconds, or the provider's wait |
| `NOTIFICATION_PUSH_NOT_CONFIGURED` | 503 | Web Push is off |
| `NOTIFICATION_PUSH_SUBSCRIPTION_INVALID` | 400 | The endpoint is not a known push service's HTTPS address, or no ticket was given |
| `NOTIFICATION_PUSH_TICKET_INVALID` | 400 | A ticket was spent, expired or unknown |

## Not yet

- Brevo's delivery reports and suppressed addresses (SEC-24).
- Retention of the record of emails sent, which holds addresses.
- Emails sent later through a job queue with retries, for everything but sign-in codes.
- Push to the Flutter app through APNs and FCM; Zalo for customers once a legal entity exists (SEC-25).
