# SEC-10 — Backend foundation and the `seller` module: design

Status: being designed, one part at a time ([plan](plan.md)). Each part below is decided with the team before code is written for it.

## Email delivery

Decided with the team on 16 October 2026.

### What is decided

- **SMTP first, and only SMTP.** The backend sends email over SMTP to whatever server the configuration names. The first emails are the sign-in codes of `identity`.
- **Mailpit in development and in tests.** Mailpit joins the local Compose file and catches every email, so a developer reads it in Mailpit's web page. Tests use it to read the code that was sent.
- **Brevo is the first real provider, reached through its SMTP relay.** Its free plan allows 300 emails a day, which covers the pilot's sign-in codes. Changing provider means changing the SMTP host and credentials, not the code.
- **No provider interface yet.** With one way of sending, an interface would have one implementation ([change design](../../../conventions.md#change-design)). The registry of [interchangeable implementations](../../../conventions.md#interchangeable-implementations-strategy-behind-a-registry) arrives with the first provider that SMTP cannot serve, for example Brevo's HTTP API and its delivery reports, as BeyondPilot added in BEY-128.
- **Configuration from the environment.** Host, port, user, sender address and name come from `SECONDBITE_` variables. The password is read from a file under `/run/secrets` ([data and security](../../../conventions.md#data-and-security)). There is no operator screen for it yet, unlike BeyondPilot's Admin › Email.

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

So the shape is common: start with SMTP and a concrete client, catch mail locally, and add a channel or provider family only when a second way of sending exists.

### Left for the step that writes the code

- **The Go library.** The candidates are the standard `net/smtp` (frozen; memos uses it), `github.com/wneessen/go-mail` (maintained; Kratos uses a fork of it) and `smtppool` (built for bulk). The choice is made against the latest releases when the code is written, and recorded here.
- **How the sign-in code is handed over.** Either it is sent synchronously before answering, as in BeyondPilot, which keeps the code out of the database, or it goes through a River job with retries, as Kratos queues its messages. This is decided with the `identity` step.
- **Pinned versions** of the Mailpit image and the library.

### Sources

- [Brevo review, WP Mail SMTP](https://wpmailsmtp.com/brevo-review/)
- [Best free SMTP servers compared, SendLayer](https://sendlayer.com/blog/best-free-smtp-servers/)
- [Brevo review 2026, Dreamlit](https://dreamlit.ai/blog/brevo-review)

The free limit (300 a day, Brevo branding in the footer) comes from these secondary sources. It is checked on Brevo's own pricing page when the account is created.
