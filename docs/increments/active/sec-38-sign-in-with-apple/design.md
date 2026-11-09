# SEC-38 — Sign in with Apple: design

Tracked in Linear as SEC-38. An iOS app that offers Google must also offer an equivalent login, one that collects only a name and an email, lets people hide their email and does not track them for ads (App Review Guideline 4.8). Sign in with Apple is that option, and the Vietnamese shopping apps show it beside Google ([sign-in research](../../../research/2026-10-19-sign-in-and-code.md), S1–S3). It is built now and switched on once the sponsor's Apple Developer account exists (SEC-14). Until the server is configured, it stays off and the app does not show it.

Researched on 9 November 2026 from Apple's documentation and from the code of Supabase Auth (`internal/api/provider/apple.go`, `token_oidc.go`) and Ory Kratos (`selfservice/strategy/oidc/provider_apple.go`), the two services the Google sign-in followed (SEC-29).

## 1. What changes for a person

- On an iPhone, the sign-in screen shows "Tiếp tục với Apple" beside Google when the server offers it, no smaller than Google's button (Apple's Human Interface Guidelines). Android and the web do not show it.
- A first sign-in creates the account with the address Apple gives, often a private relay address (`…@privaterelay.appleid.com`). It also takes the name the person shared, which Apple gives only that once.
- Deleting the account also tells Apple to forget the app's access, as Apple requires (§5).

## 2. The token

`POST /auth/apple` takes `{idToken, nonce, authorizationCode, givenName?, familyName?, session}` and answers as `/auth/google` does. The app gives Apple the SHA-256 of a random value and posts the value itself.

The identity token is accepted when all of these hold ([Apple, Verifying a user](https://developer.apple.com/documentation/signinwithapple/verifying-a-user)):

- Its RS256 signature is made with one of Apple's keys. go-oidc fetches them from `https://appleid.apple.com/auth/keys`, within 5 seconds, and keeps them.
- Its issuer is `https://appleid.apple.com`.
- Its audience is one of `SECONDBITE_APPLE_CLIENT_IDS`, the app's bundle ID.
- It has not expired.
- Its `nonce` is the hex SHA-256 of the value posted. The nonce is **required**, unlike Google's: our app always sends one, and Kratos requires it for Apple. Supabase leaves it optional.

`email_verified` and `is_private_email` arrive either as a boolean or as the string `"true"`. Both forms are read, as Kratos (`ConvertibleBoolean`) and Supabase (a custom unmarshaler) do.

## 3. Accounts

As for Google (SEC-29 › decision 4), the identity is found by Apple's `sub`, never by address.

- **A first sign-in** needs a verified address. Without one it is refused with `IDENTITY_EMAIL_NOT_VERIFIED`, and the person uses another way in. A Work & School account may have no address.
- **No account has the address:** the account is made.
- **An account has the address:** it is linked only when Apple speaks for the address, that is `privaterelay.appleid.com`, `icloud.com`, `me.com` or `mac.com`. These are addresses Apple issues; no source lists them, so the list is ours. Any other address is refused with `IDENTITY_APPLE_LINK_REQUIRED` (409), and the app sends the person to the emailed code with the address filled in, as for Google. Supabase links on any verified address, which leaves it open to account pre-hijacking; we do not.
- **The link** records whether Apple speaks for the address (`email_trusted`). A later emailed code removes an untrusted link, as it does a Google one.
- **The name** posted on a first sign-in (`givenName`, `familyName`, written family name first, the Vietnamese order) fills an empty display name, trimmed to 200 characters. It comes from the app, not from the token, so it is only ever used as a display name.
- **The method:** the sign-in is recorded as `apple` in `last_sign_in_method`.

## 4. The refresh token

Apple revokes the app's access only with a refresh or an access token ([Revoke tokens](https://developer.apple.com/documentation/signinwithapplerestapi/revoke-tokens), [Generate and validate tokens](https://developer.apple.com/documentation/signinwithapplerestapi/generate-and-validate-tokens)). The authorization code cannot be revoked; it lasts five minutes and can be used once. So each sign-in:

- **Exchanges the authorization code** at `POST https://appleid.apple.com/auth/token`, with `grant_type=authorization_code` and the bundle ID as `client_id`. The client secret is an ES256 JWT the server signs, valid five minutes (as Kratos makes it):
  - `kid`: the key ID;
  - `iss`: the team ID;
  - `sub`: the bundle ID;
  - `aud`: `https://appleid.apple.com`.
- **Keeps the `refresh_token`** that Apple answers on the link, sealed with AES-256-GCM under `SECONDBITE_APPLE_TOKEN_KEY` (32 bytes). It must be sent back to Apple, so it cannot be hashed. Each new one replaces the one before.

If the exchange fails, the sign-in fails (`IDENTITY_APPLE_UNAVAILABLE`, 503): an identity whose access could not be revoked later is never linked.

## 5. Revoking

When a link to Apple goes, its refresh token is sent to `POST https://appleid.apple.com/auth/revoke` with `token_type_hint=refresh_token`. A link goes in two cases:

- **The account is deleted.** Apple, 24 May 2022: "If your app offers Sign in with Apple, you'll need to use the Sign in with Apple REST API to revoke user tokens when deleting an account".
- **An emailed code removes an untrusted link** (§3).

The transaction that removes the link also puts the sealed token on an event. The event's listener revokes the token, so River retries a failure. Apple answers 200 for a token that is already invalid, so a retry does no harm.

Neither Supabase nor Kratos revokes; this follows Apple's text.

## 6. Configuration

All five variables are needed, or none. Without them Apple is off, and a partial set stops the server at start.

| Variable | What | Where it comes from |
| --- | --- | --- |
| `SECONDBITE_APPLE_CLIENT_IDS` | The bundle ID, `vn.secondbite.secondBite` | Public |
| `SECONDBITE_APPLE_TEAM_ID` | The developer team's ID | Apple Developer account |
| `SECONDBITE_APPLE_KEY_ID` | The Sign in with Apple key's ID | Apple Developer › Keys |
| `SECONDBITE_APPLE_PRIVATE_KEY` | The key's `.p8` file, PEM | Apple Developer › Keys; a secret |
| `SECONDBITE_APPLE_TOKEN_KEY` | 32 random bytes, base64, sealing the refresh tokens | Generated per environment; a secret |

When Apple is on, `GET /auth/methods` adds `apple: {}`.

Email reaches a relay address only from a sending domain or address registered under "Sign in with Apple for Email Communication" that passes SPF or DKIM ([Apple](https://developer.apple.com/help/account/capabilities/configure-private-email-relay-service)). The codes come from our email provider's domain, which is registered once the account exists. Until then, a relay address cannot receive the code that deletes its account.

## Boundary

- **In:**
  - the endpoint and the token's checks;
  - the link and its sealed refresh token;
  - the code exchange and the revocation;
  - the sign-in methods and the migration;
  - the app's button on iOS.
- **Out:**
  - Apple's server-to-server notifications. They are optional outside Korea; handling `consent-revoked` and `account-deleted` can come in a later change.
  - Sign in with Apple on the web and Android, which needs a Services ID.
  - The Apple Developer setup itself (SEC-14).

## Verification plan

- **Go, without Apple:**
  - Tokens signed by a test key: the signature, the issuer, the audience, the expiry, the nonce (required and matched), and the claims as strings and as booleans.
  - The client secret's claims.
  - The code exchange and the revocation against an `httptest` server.
  - The seal.
  - The account rules: an account made; linked when Apple speaks for the address; refused otherwise; the name filled once.
  - The revocation on deletion and on a removed untrusted link.
  - A partial configuration refused.
- **The app:**
  - The button shows only on iOS and only when the server offers it.
  - The posted body.
  - The link-required path.
- **With the account (SEC-14):**
  - A real sign-in on an iPhone.
  - Deletion, after which the app is gone from the Apple ID's "Sign in with Apple" list.
