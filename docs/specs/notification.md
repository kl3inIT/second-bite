# notification

Owns who delivers email, chosen by admins while the service runs, and the record of emails sent (tables `notification_*`). Decided in the [SEC-10 design](../increments/completed/sec-10-backend-foundation/design.md#email-delivery). Checks: [docs/tests/notification.md](../tests/notification.md).

## Operations

| Operation | Who | Answer |
| --- | --- | --- |
| `GET /admin/email-settings` | Admins | `200` with the provider, the sender, the SMTP server, and whether the SMTP password and the Brevo API key are set, never a secret; their version in `ETag` |
| `PUT /admin/email-settings`, with `If-Match` or `If-None-Match: *` | Admins | `204`; the next email uses the new settings. `If-Match` carries the `ETag` read; `If-None-Match: *` saves the first settings, when the read answered `NOTIFICATION_EMAIL_NOT_CONFIGURED`. `412` when saved since; `400 PLATFORM_VERSION_REQUIRED` without either |
| `POST /admin/email-settings/test` | Admins | `204` once one email went to the admin's own address through the settings saved; `503` as `SendEmail` answers. Not recorded in the audit trail: it changes nothing |

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
- `ForgetRecipient` deletes the record of every email sent to an address, which identity calls when it deletes the address's account (SEC-37).

## Data

| Table | Holds | Lifecycle |
| --- | --- | --- |
| `notification_email_settings` | One row: provider, sender, SMTP server and user, sealed secrets, who changed it and when | Replaced on save |
| `notification_emails` | Kind, recipient, provider, provider's message id, time sent | Kept; retention not decided yet |

## Failures

| Code | Status | When |
| --- | --- | --- |
| `NOTIFICATION_EMAIL_SETTINGS_INVALID` | 400 | Settings incomplete for the chosen provider, or a password with security `none` |
| `NOTIFICATION_EMAIL_NOT_CONFIGURED` | 503 | No provider chosen yet; `Retry-After` 60 seconds |
| `NOTIFICATION_EMAIL_UNAVAILABLE` | 503 | The provider refused or could not be reached; `Retry-After` 30 seconds, or the provider's wait |

## Not yet

- Brevo's delivery reports and suppressed addresses (SEC-24).
- Retention of the record of emails sent, which holds addresses.
- Emails sent later through a job queue with retries, for everything but sign-in codes.
