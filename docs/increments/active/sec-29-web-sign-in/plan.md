# SEC-29 — Signing in on the web: plan

Design: [design.md](design.md). Tracked in Linear as SEC-29, with SEC-27.

| # | Step | State |
| --- | --- | --- |
| 1 | Research and the decisions: one increment with SEC-27, the cookie's path, Google by ID token, linking, what is kept, the nonce | Decided, 18 October 2026 ([design](design.md#decisions)) |
| 2 | The session cookie (SEC-27): set by sign-in on request, read without Bearer, cleared on sign-out, cross-origin changes refused, the security scheme in the contract | Built, 18 October 2026 |
| 3 | Google: `identity_external_logins`, `POST /auth/google` verified with go-oidc, linking, `GET /auth/methods`, configuration | Built, 18 October 2026 |
| 4 | Web: the sign-in page (code and Google), `returnTo`, the top bar's sign-in and sign-out, headers for Google's script, the stub backend and browser tests | Built, 19 October 2026: `/[locale]/sign-in` from shadcn's login-05 block with `InputOTP`; the home header's account capsule; the baseline headers needed no change (no CSP or COOP is set, and FedCM is allowed to this site by default). The screen words its own states (wrong code, expired code, too many codes, Google needs the emailed code) in the catalogs, as the server's words are English until SEC-28 |
| 5 | Specs (`identity`, `platform`), test matrices, the web guideline, runbook (Google client IDs), a real Google account by hand | Not started |
