# notification: verification matrix

Requirements of [docs/specs/notification.md](../specs/notification.md) and the checks that hold them. Paths are under `server/`.

| Requirement | Check |
| --- | --- |
| SMTP delivers through Mailpit, configured by `secondbite email configure` | `TestService` (`cmd/secondbite/main_test.go`): every sign-in check reads its email from Mailpit |
| The settings are served to admins only and never return a secret | `TestService` › only admins read the email settings |
| A save at a version read before a change is refused with 412, a first save over saved settings with 412, and one with neither header with 400 `PLATFORM_VERSION_REQUIRED` | `TestService` › a stored SMTP password follows only its server (`checkStaleSettingsRefused`) |
| The first settings are saved by an admin, a second first save is refused, and a change at the version read is recorded | `TestSettingsSaved` (`internal/notification/settings_db_test.go`) |
| The test email reaches the admin's own address, or the address named, and records no audit event | `TestService` › every admin change is audited › `sendTestEmail` (`cmd/secondbite/admin_test.go`) |
| A failed test email says whether the provider refused or could not be reached | `TestSettingsSaved` › `checkTestEmail` (`internal/notification/settings_db_test.go`) |
| A stored SMTP password follows only its server and is refused without TLS | `checkSMTPPasswordFollowsServer` (`cmd/secondbite/sign_in_test.go`), run after the parallel checks of `TestService` |
| A secret sealed for one field does not open in another; two seals of one value differ | `TestSealedSecretOpensOnlyInItsField` (`internal/notification/settings_test.go`) |
| Brevo's request (path, `api-key`, body, tag) and the message id kept without angle brackets | `TestBrevoEmailSender` (`internal/notification/brevo_email_sender_test.go`) |
| Brevo's answers classified: 429 with and without `Retry-After`, other 4xx, 5xx | `TestBrevoEmailSender` |
| An unreachable Brevo is unavailable | `TestBrevoUnreachable` |
| The records of emails to a deleted account's address are gone | `TestService` › an owner deletes their account; the others forget it |
| Subscribing needs Web Push on, a known push service's HTTPS endpoint on the default port, and tickets that redeem | `TestPush` › subscribing is checked (`internal/notification/push_test.go`) |
| A push reaches the browsers following its topic with TTL, Urgency, Topic, `aes128gcm` and VAPID; a browser whose service says gone is forgotten | `TestPush` › a push reaches its topic's browsers |
| A push service down fails the delivery and the retry skips the browsers reached; a push too old is dropped | `TestPush` › a push service down is tried again |
| A push nobody follows, or one whose change rolled back, is not written | `TestPush` › a push nobody follows is not written |
| The payload is Declarative Web Push in the subscription's language, opening the page on the site | `TestPush` › a push is written in the language asked |
| Lapsed topics and the subscriptions left with none are purged, once | `TestPushesPurged` |
| A browser subscribes through the HTTP API as the web sends it, with keys made by `secondbite push keys`; a spent ticket is refused | `TestService` › a browser follows an order by Web Push (`cmd/secondbite/push_test.go`) |
| The order page offers notices from its button, then follows each later order without asking; a refusal says how to undo it; an iPhone in Safari gets the Home Screen steps | `web/tests/e2e/order.spec.ts` › notices of an order |
| The Đơn tab turns on a store's notices and renews them at each visit | `web/tests/e2e/store-orders.spec.ts` › turns on notices of new orders |

Not covered by a test: Brevo's real API (only a server answering as Brevo documents), and `NOTIFICATION_EMAIL_NOT_CONFIGURED` through the API.
