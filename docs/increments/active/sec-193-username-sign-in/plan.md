# SEC-193 — Sign in and register with a username and a password: plan

Design: [design.md](design.md). Tracked in Linear as SEC-193. The app follows in its own issue after the web.

| # | Step | State |
| --- | --- | --- |
| 1 | Design and plan | Done, 4 November 2026 |
| 2 | Migration 0045: an account may have no email; username and password hash; `password` as a sign-in method; the admins' search words | Done, 4 November 2026 |
| 3 | `identity`: the username and password rules, argon2id hash and verify | Done, 4 November 2026 |
| 4 | `identity`: register and sign in with a password, with the limits per address and per username | Done, 4 November 2026 |
| 5 | `identity`: accounts without an email (the body, deleting with the password, no deletion code, the admins' list); `seller` sends no status email to them | Done, 4 November 2026 |
| 6 | Contract `api/openapi.yaml` and the web's generated client, the module spec and its test matrix, `ARCHITECTURE.md` | Done, 4 November 2026 |
| 6b | The app's generated client (swagger_parser, build_runner): no Flutter on this machine, so it comes from the CI's diff | To do |
| 7 | Web: the client generated, the sign-in page, the emailed-code page and the register page, the strings in both catalogs, the account shown by its username, deleting with the password, and the specs | Done, 4 November 2026 |
| 8 | Proof against the real service ([verification.md](verification.md)) | To do |
| 9 | Review, then merge through a pull request and move this increment to `completed/` | To do |
