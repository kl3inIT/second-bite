# notification: verification matrix

Requirements of [docs/specs/notification.md](../specs/notification.md) and the checks that hold them. Paths are under `server/`.

| Requirement | Check |
| --- | --- |
| SMTP delivers through Mailpit, configured by `secondbite email configure` | `TestService` (`cmd/secondbite/main_test.go`): every sign-in check reads its email from Mailpit |
| The settings are served to admins only and never return a secret | `TestService` › only admins read the email settings |
| A save at a version read before a change is refused with 412, and one without `If-Match` with 400 | `TestService` › a stored SMTP password follows only its server (`checkStaleSettingsRefused`) |
| A stored SMTP password follows only its server and is refused without TLS | `checkSMTPPasswordFollowsServer` (`cmd/secondbite/sign_in_test.go`), run after the parallel checks of `TestService` |
| A secret sealed for one field does not open in another; two seals of one value differ | `TestSealedSecretOpensOnlyInItsField` (`internal/notification/settings_test.go`) |
| Brevo's request (path, `api-key`, body, tag) and the message id kept without angle brackets | `TestBrevoEmailSender` (`internal/notification/brevo_email_sender_test.go`) |
| Brevo's answers classified: 429 with and without `Retry-After`, other 4xx, 5xx | `TestBrevoEmailSender` |
| An unreachable Brevo is unavailable | `TestBrevoUnreachable` |
| The records of emails to a deleted account's address are gone | `TestService` › an owner deletes their account; the others forget it |

Not covered by a test: Brevo's real API (only a server answering as Brevo documents), and `NOTIFICATION_EMAIL_NOT_CONFIGURED` through the API.
