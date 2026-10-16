# SEC-10 — Backend foundation and the `seller` module: design

Status: being designed, one part at a time ([plan](plan.md)). Each part below is decided with the team before code is written for it.

## Email delivery

Decided with the team on 16 October 2026.

### What is decided

- **SMTP is the first way of sending.** The backend sends email over SMTP to whatever server the configuration names. The first emails are the sign-in codes of `identity`.
- **Mailpit in development and in tests.** Mailpit joins the local Compose file and catches every email, so a developer reads it in Mailpit's web page. Tests use it to read the code that was sent.
- **Brevo is the first real provider, reached through its SMTP relay.** Its free plan allows 300 emails a day, which covers the pilot's sign-in codes.
- **Email delivery is a vendor family from the first line**, as [interchangeable implementations](../../../conventions.md#interchangeable-implementations-strategy-behind-a-registry) prescribes: one interface for the function (`EmailSender`), one type per provider, and a registry that resolves the configured provider by key and fails at startup on an unknown or duplicate key. The first implementation is `SmtpEmailSender`. More providers are certain (the team will add Brevo's API, and SES or Resend are likely), so the family is open: a new provider is a new type and a new key, and nothing else changes.
- **Shared mechanics stay outside the providers**: the message type, address validation, timeouts and logging, so each provider only translates a message into its vendor's call.
- **Configuration from the environment.** The provider key, host, port, user, sender address and name come from `SECONDBITE_` variables. The password or API key is read from a file under `/run/secrets` ([data and security](../../../conventions.md#data-and-security)). There is no operator screen for it yet, unlike BeyondPilot's Admin › Email.

### Libraries

Checked on GitHub on 16 October 2026. None of the vendored skills names an email library.

| Use | Library | Why |
| --- | --- | --- |
| SMTP | `github.com/wneessen/go-mail` (v0.8.1, July 2026; about 1,500 stars, pushed this week) | Maintained, with context-aware sending, STARTTLS and implicit TLS, SMTP authentication and MIME built in; Kratos sends through a fork of it (`ory/mail/v3`) |
| Brevo's API, when added | `net/http` against `POST /v3/smtp/email` | Brevo's Go SDK `getbrevo/brevo-go` (v1.1.3) has had no release since February 2025 and has about 30 stars; the call is one JSON request |
| Resend, if added | `github.com/resend/resend-go` (v4.8.2, October 2026) | The vendor's own SDK, maintained |
| Amazon SES, if added | `github.com/aws/aws-sdk-go-v2/service/sesv2` | The vendor's own SDK |
| Local catcher | Mailpit (`axllent/mailpit`, about 10,700 stars, v1.31.6) | Maintained successor of MailHog, which listmonk and Kratos still run; it serves SMTP and a web page and has an API that tests read |

Not chosen: `net/smtp` (the Go team has frozen it; memos uses it), `go-gomail/gomail` (no release since 2016), `knadh/smtppool` (a connection pool built for bulk campaigns; one email at a time needs none).

### What the references do

The references were read in `.tmp/` and in BeyondPilot on 16 October 2026.

- **BeyondPilot** began with SMTP from the environment. It later moved provider choice into an operator screen with Amazon SES, Resend, SMTP and Brevo behind `EmailAdapterRegistry` (its ADR 0005, BEY-68 and BEY-128).
  - `identity` publishes the sign-in code as an event, and `notification` sends it synchronously, so the code in clear is never stored.
  - A failure answers `503` with `Retry-After`.
- **Ory Kratos** (`courier/`) has a `Channel` interface with two implementations, `smtp` and `http`.
  - Messages are stored and sent by a queue with retries.
  - The SMTP server is configured as one connection URI.
  - Tests and the quickstart use MailHog or MailSlurper.
  - It sends through `github.com/ory/mail/v3`, a fork of go-mail.
- **listmonk** sends through `github.com/knadh/smtppool/v2`, a pool of SMTP connections built for bulk campaigns. Its development Compose file runs MailHog.
- **memos** (`internal/email`) wraps the standard library's `net/smtp` in one concrete `Client`, without any interface, and gives each operation a 15-second timeout.

So the shape is common: SMTP first, mail caught locally in development, and a channel or provider family once more than one way of sending is wanted, which Second Bite already knows it wants.

### Left for the step that writes the code

- **How the sign-in code is handed over.** Either it is sent synchronously before answering, as in BeyondPilot, which keeps the code out of the database, or it goes through a River job with retries, as Kratos queues its messages. This is decided with the `identity` step.
- **Pinned versions** of Mailpit and go-mail, each at least two weeks old when pinned.

### Sources

- [Brevo review, WP Mail SMTP](https://wpmailsmtp.com/brevo-review/)
- [Best free SMTP servers compared, SendLayer](https://sendlayer.com/blog/best-free-smtp-servers/)
- [Brevo review 2026, Dreamlit](https://dreamlit.ai/blog/brevo-review)

The free limit (300 a day, Brevo branding in the footer) comes from these secondary sources. It is checked on Brevo's own pricing page when the account is created.
