# identity

Owns accounts and their role, emailed sign-in codes, Google sign-in and sessions (tables `identity_*`). Decided in the [SEC-10 design](../increments/completed/sec-10-backend-foundation/design.md#identity) and the [SEC-29 design](../increments/active/sec-29-web-sign-in/design.md). Checks: [docs/tests/identity.md](../tests/identity.md).

## Operations

| Operation | Who | Answer |
| --- | --- | --- |
| `POST /auth/sign-in-codes` `{email}` | Anyone | `202 {challengeId, expiresAt}`, whether or not the address has an account |
| `POST /auth/sessions` `{challengeId, code, session}` | Anyone holding a challenge | `201 {token, expiresAt, account}`; the token is shown only here. With `"session": "cookie"` (the web) the token is in the session cookie instead of the body |
| `POST /auth/google` `{idToken, nonce, session}` | Anyone | `201 {token, expiresAt, account}`, the session handed over as for the code |
| `GET /auth/methods` | Anyone | `200 {google: {clientId}}` when Google is configured, `200 {}` otherwise |
| `DELETE /auth/sessions/current` | A signed-in caller | `204`; the session ends and its cookie is cleared |
| `GET /accounts/me` | A signed-in caller | `200 {id, email, role, displayName}` |

Published to other modules: `Authenticate` (the middleware that sets the caller), `EnsureAccount` (an account for an address, created if absent), `Accounts` (accounts by identifier), `GrantRole`.

Administrative command: `secondbite admin grant EMAIL` makes an account an admin, creating it if needed.

## Rules

- An address is one plain address, kept in lower case; every table keys on that form. An account is created at its first sign-in, or when `EnsureAccount` is called for it (a seller adding staff).
- A code is six random digits, emailed before the request is answered, and lives 15 minutes. Only HMAC-SHA-256 of the challenge and the code under `SECONDBITE_SIGN_IN_CODE_KEY` is stored. A code that could not be sent is deleted, so it neither works nor counts toward the limits.
- One live code per address: asking for a new one ends the earlier ones.
- Each guess is counted before it is compared; after five wrong guesses the code no longer works, even when right. A right code works once.
- Limits per address, checked under a lock so that requests arriving together cannot pass them: one code a minute, ten an hour, fifteen wrong guesses an hour and thirty a day.
- A session token is random (130 bits) and only its SHA-256 is stored. It is sent as `Authorization: Bearer` (the mobile application) or in the cookie `secondbite_session` (the web; `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/`, kept by the browser up to 400 days while the session's own end stays the server's). The header wins when both are sent. A cookie of an ended session is ignored, so the request goes on anonymously. A session lasts 30 days from its last use; the end moves at most once an hour. An account's expired sessions are deleted when it opens a new one.
- A header with an unknown, ended or malformed token is refused at once; it does not fall back to an anonymous request.
- Google's ID token is verified with go-oidc against Google's published keys (fetched within 5 seconds, then kept): the signature, an issuer of `https://accounts.google.com` or `accounts.google.com`, an audience among `SECONDBITE_GOOGLE_CLIENT_IDS` (comma-separated, the web's first) and the expiry. When a nonce is in the token or posted, the token's must be the hex SHA-256 of the one posted. Without client IDs Google is off.
- A Google identity is found by Google's subject, never by address. A first sign-in needs `email_verified`; it creates the account when no account has the address, links the account that has it when Google speaks for the address (`gmail.com`, or `hd` set), and otherwise is refused so that the person signs in with the code. The account's address never follows Google's. Each link records whether Google speaks for its address; a sign-in with the emailed code removes the account's links that it does not, and when it removes any, ends the account's earlier sessions, so that a Google account linked to an outside address before its owner arrived loses its way in (account pre-hijacking). The sign-ins of one identity run under a lock, so two first sign-ins make one link.
- An account's display name is empty until a Google sign-in fills it with Google's name; a name it already has is kept. The identity's name and picture follow Google's at each sign-in.

## Data

| Table | Holds | Lifecycle |
| --- | --- | --- |
| `identity_accounts` | Address (unique, lower case), role (`customer`, `admin`), display name | Kept |
| `identity_external_logins` | Provider (`google`), subject (unique with the provider), account, the address when linked and whether Google speaks for it, name and picture as last sent, when linked and last used | Deleted with the account, or by a sign-in with the emailed code when Google does not speak for its address |
| `identity_sign_in_challenges` | Address, code hash, wrong guesses, expiry | Deleted when used, ended by a newer code, or a day after it was sent |
| `identity_sessions` | Account, token hash, last use, expiry | Deleted on sign-out; expired ones when the account opens a new session |

## Failures

| Code | Status | When |
| --- | --- | --- |
| `IDENTITY_EMAIL_INVALID` | 400 | Not one plain address |
| `IDENTITY_CODE_INCORRECT` | 400 | Wrong code; the guess is spent |
| `IDENTITY_SESSION_INVALID` | 401 | Unknown, ended or malformed token; with `WWW-Authenticate: Bearer` |
| `IDENTITY_GOOGLE_TOKEN_INVALID` | 401 | Google's token fails its signature, issuer, audience, expiry or nonce, or Google's keys cannot be fetched |
| `IDENTITY_EMAIL_NOT_VERIFIED` | 403 | A first Google sign-in whose address Google has not verified |
| `IDENTITY_GOOGLE_LINK_REQUIRED` | 409 | The address has an account and Google does not speak for it |
| `IDENTITY_ACCOUNT_NOT_FOUND` | 404 | The account does not exist |
| `IDENTITY_CHALLENGE_GONE` | 410 | The code expired, was used or was ended by a newer one |
| `IDENTITY_CODE_ATTEMPTS_EXHAUSTED` | 410 | Five wrong guesses on this code |
| `IDENTITY_CODE_LIMIT_EXCEEDED` | 429 | A limit per address; `Retry-After` gives the wait |
| `IDENTITY_SESSION_UNAVAILABLE` | 503 | The session could not be checked; `Retry-After` 5 seconds |
| `IDENTITY_GOOGLE_NOT_CONFIGURED` | 503 | No Google client ID is configured |

A code that could not be emailed answers `notification`'s 503 ([notification](notification.md#failures)).

## Not yet

- Limits per client address in front of those per email address, which today can be spent by someone else to hold an address back for up to a day; with the first deployment.
- Linking Google from a signed-in session, and changing the display name; when someone needs them.
