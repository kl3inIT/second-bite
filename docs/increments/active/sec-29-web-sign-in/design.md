# SEC-29 — Signing in on the web, with the emailed code and Google: design

Status: proposed on 18 October 2026; decisions taken with the team the same day ([Decisions](#decisions)); not built ([plan](plan.md)). Tracked in Linear as SEC-29, with SEC-27 (the web session in a cookie), which it needs.

## What a person can do

- **Anyone** browses the home, search and a seller's page without an account. Sign-in is asked only to order, to follow, or to post for a seller, and the person then returns to what they were doing ([vision: look first, sign in to act](../../../vision.md#product-principles)).
- **To sign in**, a person types their email address and the six-digit code they receive (already built in SEC-10), or presses **Continue with Google**.
- **One address is one account.** A Google sign-in whose address already has an account reaches that account, under the rule in [Linking](#linking-an-address-that-already-has-an-account).
- **Signing out** ends the session on the web; the page stays where it was.

Sign in with Apple is added with the iOS application (App Review Guideline 4.8 requires it once Google is offered); a phone number is SEC-30; Facebook is not offered ([SEC-29 research](https://linear.app/second-bite/issue/SEC-29)).

## The flow

```mermaid
sequenceDiagram
  participant B as Browser (Next.js page)
  participant G as Google Identity Services
  participant N as Next.js server
  participant S as Go service
  B->>B: random nonce n
  B->>G: button, nonce = SHA-256(n)
  G-->>B: ID token (popup or FedCM)
  B->>S: POST /api/auth/google {idToken, nonce: n}
  S->>S: verify signature, iss, aud, exp, nonce; find or link the account
  S-->>B: 201 account, Set-Cookie session (HttpOnly)
  B->>N: next page, with the cookie
  N->>S: API calls forwarding the cookie
```

The emailed code takes the same last steps: `POST /api/auth/sessions` answers with the cookie instead of a token in the body when the web asks for it.

## Decisions

Each was proposed with its sources and chosen by the team on 18 October 2026.

### 1. SEC-27 and SEC-29 are built as one increment

Decided with the team on 18 October 2026.

SEC-27 (the session in an httpOnly cookie, decided on 17 October 2026 as option B) has no screen to serve until sign-in exists, and sign-in on the web cannot keep a session without it. Building them together tests the whole path once.

### 2. The cookie's path is `/`, not `/api`

Decided with the team on 18 October 2026, as Gitea (`modules/setting/session.go:63`), Mattermost (`channels/web/context.go:186`), Kratos and BeyondPilot keep theirs at the site's root.

SEC-27 wrote `Path=/api`. The web renders pages on its server (`/vi/...`), and a page that shows what a signed-in person may do must send the person's cookie to the API; a browser sends a cookie only to paths under its own, so with `/api` no page would ever receive it. BeyondPilot's web forwards the cookie from its server components the same way (`web/src/lib/auth/session.ts`: `headers: { cookie: (await cookies()).toString() }`).

The rest of SEC-27 stands: `HttpOnly; Secure; SameSite=Lax`, the session's 30-day sliding life, Bearer read first and the cookie only without it, and Go's `http.CrossOriginProtection` (the `Sec-Fetch-Site` and `Origin` headers) on requests authenticated by the cookie that change state. The cookie is named `secondbite_session`; the token in it is the session token SEC-10 already issues, and one session record serves both clients.

Two details settled while building it:

- **The browser keeps the cookie up to 400 days, the most browsers allow.** The 30-day sliding end stays the server's. A cookie that lasted only as long as the session would have to be set again each time the end moves, and pages the web renders on its server cannot pass a new cookie on to the browser; a person active every day would be signed out after 30 days.
- **A cookie of an ended session is ignored, and the request goes on anonymously.** A Bearer token that fails is refused with 401. The web's server forwards the cookie to public operations too, such as `GET /offers`, and a refusal there would break the home page for anyone whose session ended.

### 3. Google signs in by its ID token, posted to one endpoint for the web and the mobile application

Decided with the team on 18 October 2026: option A.

| | Option | For | Against |
| --- | --- | --- | --- |
| **A** (decided) | The page shows Google's own button (Google Identity Services); Google hands the page an ID token, which it posts to `POST /auth/google` | One endpoint serves the web now and the Flutter application later (`google_sign_in` also hands over an ID token); no client secret on the server; Google's button and FedCM, which browsers are moving to | Google's script runs on our page; a popup or the browser's FedCM prompt |
| B | The server redirects to Google and exchanges the returned code (authorization code with PKCE) | No script of Google's on our pages; works without JavaScript | A client secret to keep; a second flow for the mobile application, which cannot use a redirect the same way |

Supabase Auth (`POST /token?grant_type=id_token`, `internal/api/token_oidc.go`) and Ory Kratos (`id_token` in the login and registration bodies, `selfservice/strategy/oidc/strategy_login.go:79-96`) accept an ID token posted by a native client; BeyondPilot and Miniflux use the redirect (B), having no mobile application.

### 4. Linking an address that already has an account

Decided with the team on 18 October 2026: link only where Google is authoritative, as Firebase does.

| Product | When Google's address matches an account |
| --- | --- |
| BeyondPilot | Links when Google says `email_verified` |
| Supabase Auth | Links when Google says `email_verified` (`internal/models/linking.go:63-160`), then removes unconfirmed identities "to prevent pre-account takeover attacks" (`internal/api/external.go:412-419`) |
| Ory Kratos | Refuses by default and asks the person to sign in the existing way first (`strategy.go:139-142`) |
| Miniflux | Refuses; linking only while signed in (`internal/ui/oauth2_callback.go:125-127`) |
| Gitea | `ACCOUNT_LINKING = login` by default: sign in the existing way first |
| Clerk | Links when the provider's address is verified ([account linking](https://clerk.com/docs/guides/configure/auth-strategies/social-connections/account-linking)) |
| Firebase Authentication | Treats Google as a trusted provider only for `@gmail.com` addresses ([users](https://firebase.google.com/docs/auth/users)) |
| Auth0 | Advises never to link by address alone, even verified, and to have the person sign in to both first: a former employee's reassigned address would join the wrong account ([email verified](https://auth0.com/docs/users/guides/email-verified)) |
| Shopee, Grab | Key accounts by phone number. Shopee lets one number belong to one account only and has the person prove the existing account before a number moves ([help 79184](https://help.shopee.vn/portal/4/article/79184), [79292](https://help.shopee.vn/portal/4/article/79292)); neither publishes how it treats a matching email |

Google says when it is authoritative for an address: an address at `gmail.com`, or `email_verified` with `hd` set (a Google Workspace account); for any other address the account's owner may no longer own it ([OpenID Connect](https://developers.google.com/identity/openid-connect/openid-connect), [Verify the ID token](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token)).

**Decided:**

- A Google identity is found by Google's `sub`, never by its address, so an address changed at Google keeps its account (Supabase, Kratos, Miniflux and BeyondPilot all do).
- A first Google sign-in needs `email_verified`. Then:
  - **no account has the address**: one is created, and the identity is linked to it;
  - **an account has it and Google is authoritative for it** (`gmail.com`, or `hd` set): the identity is linked to that account. Every way into an account here proves the address (a code sent to it), so no one can have prepared an account to catch the owner's;
  - **an account has it and Google is not authoritative** (an outside address kept on a Google account): refused with `IDENTITY_GOOGLE_LINK_REQUIRED`; the person signs in with the emailed code, which proves the address today. Linking Google from a signed-in session is added when someone needs it.
- The account's address never changes when Google's does, as in Supabase.

### 5. What is kept from Google

Decided with the team on 18 October 2026: the `sub`, the address at the time of linking, the name and the picture's address, and when the identity was linked and last used. Google asks only for `openid`, `email` and `profile`, which it grants without a verification review and which its consent screen already names to the person. The name and the picture are refreshed at each Google sign-in, as Supabase Auth refreshes `identity_data` (`internal/api/external.go:384-397`); Miniflux and BeyondPilot keep only the subject.

- The account gains a **display name**, filled from Google's name when it is empty and changed by the person afterwards. A seller calls the customer by it at the handover, and the page greets them by it. An account signed in by the emailed code has none until the person gives one (asked at the first order, SEC-15).
- The privacy policy names both and why: shown to the person and, for an order, to the seller's staff (Decree 13/2023 asks that each purpose be stated).

### 6. The nonce

Decided with the team on 18 October 2026: optional, as Supabase Auth has it. The page draws a random value, gives Google its SHA-256, and posts the value itself. When the token carries a `nonce`, the service accepts it only if that nonce is the SHA-256 of what was posted, and a nonce on one side without the other is refused (`token_oidc.go:298-305`); a token with no nonce, posted with none, passes on its signature, audience and expiry alone. Kratos leaves it optional for Google too (`provider_google.go:86-89`), Firebase requires it only for Apple, and Google's button takes it as an optional parameter. A token copied from elsewhere cannot be replayed through our web page, which always sends one.

## Boundary

All of it is `identity`'s, the owner of accounts, sessions and sign-in methods; no new module and no new edge. The web adds a sign-in page and a way to reach it.

## The contract

| Operation | Who | Answer |
| --- | --- | --- |
| `POST /auth/google` `{idToken, nonce}` | Anyone | `201 {account, expiresAt}` and the session: in the cookie for the web (`"session": "cookie"` in the body), as `token` in the body for the mobile application |
| `POST /auth/sessions` `{challengeId, code, session}` | Anyone holding a challenge | As today; `"session": "cookie"` answers with the cookie instead of the token |
| `DELETE /auth/sessions/current` | A signed-in caller | `204`, and the cookie cleared |
| `GET /auth/methods` | Anyone | `200 {google: {clientId}}` when Google is configured, so the page shows the button only then |

The OpenAPI document declares the cookie as a second security scheme beside Bearer.

**Failures**

| Code | Status | When |
| --- | --- | --- |
| `IDENTITY_GOOGLE_NOT_CONFIGURED` | 503 | No Google client is configured |
| `IDENTITY_GOOGLE_TOKEN_INVALID` | 401 | The signature, issuer, audience or expiry does not hold, or a nonce sent does not match |
| `IDENTITY_EMAIL_NOT_VERIFIED` | 403 | A first Google sign-in whose address Google has not verified |
| `IDENTITY_GOOGLE_LINK_REQUIRED` | 409 | The address has an account and Google is not authoritative for it |
| `PLATFORM_CROSS_ORIGIN_REFUSED` | 403 | A cookie-authenticated change from another origin |

## Data

| Table | Holds | Lifecycle |
| --- | --- | --- |
| `identity_external_logins` (new) | `provider` (`google`; `apple` later), `subject` exactly as issued, account, the address when linked, the name and the picture's address as last sent, when linked and last used; unique on `(provider, subject)` | Deleted with the account |
| `identity_accounts` | Gains `display_name`, empty until Google fills it or the person sets it | Kept |

The shape follows Supabase's `identities` (`UNIQUE(provider_id, provider)`) and BeyondPilot's table with `provider` and `subject`.

## Configuration

- `SECONDBITE_GOOGLE_CLIENT_IDS`: the client IDs whose tokens are accepted, comma-separated (the web's now; iOS and Android later), as Supabase and Kratos accept several audiences. Client IDs are public; there is no secret. Without it, Google is off.
- **For now** (decided with the team on 18 October 2026), the Google Cloud project and its OAuth client are the tech lead's own development client, set only in each environment's configuration, never in Git. Before the beta, they move to a Google account of Second Bite with the privacy policy's address on the consent screen; a new client ID is then added to `SECONDBITE_GOOGLE_CLIENT_IDS` beside the old one, so both work during the change. The consent screen asks only for `openid`, `email` and `profile`, which Google publishes without a verification review; while it stays in testing mode, only the test users it lists can sign in.

## Libraries

`github.com/coreos/go-oidc/v3` v3.21.0 (released 1 September 2026; about 2,500 stars; Miniflux, Supabase Auth and Kratos use it) verifies the signature against Google's keys (fetched once and fetched again on an unknown key), the issuer, the audience and the expiry. Tests sign their own tokens with a key the verifier is given, as go-oidc's `StaticKeySet` allows, so no test calls Google. On the web, Google's script `https://accounts.google.com/gsi/client` is loaded on the sign-in page only.

## Web

- `/[locale]/sign-in?returnTo=…`: the address field, then the code field (the challenge kept in the page); below, Google's button with its required wording and branding. `returnTo` is accepted only as a path on our own origin.
- The top bar gains **Sign in**, or the account's address with **Sign out**.
- The baseline headers allow Google's script, frame and FedCM on the sign-in page; `Cross-Origin-Opener-Policy`, if set later, must allow popups (`same-origin-allow-popups`) as Google requires.
- Strings in both catalogs; a Playwright test opens the page and checks it with axe; the stub backend answers the new operations.

## Failure behavior

- Google's keys unreachable: the token cannot be verified and the answer is `IDENTITY_GOOGLE_TOKEN_INVALID` after a short timeout; the emailed code still works.
- Two first sign-ins with one Google identity at once: the unique key keeps one link; the second reads it.
- A cookie and a Bearer header together: the header wins and the cookie is ignored.

## Logging

`identity.sign_in.succeeded` gains `method` (`email_code` or `google`) with the account's identifier; never the address, the token or the nonce.

## Verification plan

- In `identity`, with tokens signed by a test key: each claim refused when wrong (signature, issuer in both of Google's forms, audience, expiry, nonce); `email_verified` false on a first sign-in; a new account; linking at `gmail.com` and with `hd`; refusal for an outside address with an account; a returning `sub` after its address changed at Google; two simultaneous first sign-ins.
- The cookie: set on sign-in with its attributes, read without Bearer, ignored beside it, cleared on sign-out, a cross-origin change refused and a same-origin one accepted.
- Through the API in the composition test: a code sign-in answered with the cookie, then `GET /accounts/me` with only the cookie.
- On the web: the sign-in page with the code (stub backend), `returnTo` followed and a foreign one ignored, sign-out; Google's button shown only when the stub says it is configured.
- By hand, once: a real Google account on the deployed web, and a Workspace account.

## Open questions

| Question | Who answers | What it changes |
| --- | --- | --- |
| Which Google account of Second Bite owns the Google Cloud project from the beta, and where the privacy policy is published | Founder, before the beta | The client is moved to it (the tech lead's development client serves until then) |
