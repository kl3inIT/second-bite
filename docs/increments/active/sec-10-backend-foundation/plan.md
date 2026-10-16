# SEC-10 — Backend foundation and the `seller` module: plan

Design: [design.md](design.md). Tracked in Linear as SEC-10.

| # | Step | State |
| --- | --- | --- |
| 1 | Email delivery: an `EmailSender` family chosen by operators at runtime, settings sealed in the database, Brevo's HTTP API and SMTP (Mailpit locally); the sign-in code sent within the request | Decided, 16 October 2026 |
| 2 | Brevo's delivery reports: webhook, bounced and complained addresses suppressed | To design |
| 3 | Foundation: entry point, configuration, database and migrations, RFC 9457 errors, boundary check in CI | Built and verified locally, 16 October 2026 ([design](design.md#foundation)); CI to pass on the branch |
| 4 | `identity`: sign-in by email with a one-time code | To design |
| 5 | `seller`: boundary discovery, then the module | To design |
