# SEC-10 — Backend foundation and the `seller` module: plan

Design: [design.md](design.md). Tracked in Linear as SEC-10.

| # | Step | State |
| --- | --- | --- |
| 1 | Email delivery: an `EmailSender` family with SMTP first (go-mail), Mailpit locally, Brevo's relay as the first provider | Decided, 16 October 2026 |
| 2 | Foundation: entry point, configuration, database and migrations, RFC 9457 errors, boundary check in CI | To design |
| 3 | `identity`: sign-in by email with a one-time code | To design |
| 4 | `seller`: boundary discovery, then the module | To design |
