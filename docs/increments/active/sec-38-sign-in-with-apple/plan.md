# SEC-38 — Sign in with Apple: plan

Design: [design.md](design.md). Tracked in Linear as SEC-38.

| # | Step | State |
| --- | --- | --- |
| 1 | Design and plan, from the research of 9 November 2026 | Written, 9 November 2026 |
| 2 | Migration 0049: Apple as a provider and a sign-in method, the sealed refresh token on the link | Built, 9 November 2026 |
| 3 | `identity`: the identity token's checks, the client secret, the code exchange, the seal, the find-or-link shared with Google | Built, 9 November 2026 |
| 4 | `identity`: the revocation on deletion and on an untrusted link removed, through an event and its listener | Built, 9 November 2026 |
| 5 | `POST /auth/apple`, `apple` in `GET /auth/methods`, the configuration; the contract, the web's and the app's clients, the spec, its test matrix, the runbook | Built, 9 November 2026 |
| 6 | The app: "Tiếp tục với Apple" on iOS when the server offers it, the posted body, the link-required path; the Sign in with Apple entitlement | Built, 9 November 2026: `sign_in_with_apple` (a Flutter Favorite), Apple's own button 52 px tall as the others, the emailed code opened with the token's address when Apple did not issue it |
| 7 | Review, merge through a pull request | Not started |
| 8 | Switched on and checked on an iPhone, with the Apple Developer account (SEC-14) | Waiting for the account |
