# identity: verification matrix

Requirements of [docs/specs/identity.md](../specs/identity.md) and the checks that hold them. Paths are under `server/`. `TestService` runs the assembled service against PostGIS and Mailpit and reads each code from Mailpit's API.

| Requirement | Check |
| --- | --- |
| A code is emailed and signs in; the session reads the account; sign-out ends it; an address in mixed case is the same account | `TestService` › sign in with an emailed code, then sign out |
| The web's sign-in puts the session in an `HttpOnly`, `Secure`, `SameSite=Lax` cookie and not in the body; the cookie alone reads the account; a Bearer header beside it wins; a cross-site sign-out is refused and a same-origin one clears the cookie; an ended cookie is ignored | `TestService` › sign in with the session in a cookie, as the web does |
| Google's token is refused for a wrong signature, issuer, audience or expiry, a missing subject, or a nonce on one side only or not matching; both issuer forms and any configured client ID pass | `internal/identity` `TestGoogleVerify` |
| Google speaks for `gmail.com` and for a Workspace account (`hd`), not for an outside address | `TestGoogleAuthoritative` |
| A first Google sign-in creates the account with Google's name; a returning subject keeps its account and address and refreshes the identity's name; an account is linked at `gmail.com` and with `hd`; an outside address with an account is refused (seen to fail with the rule taken out); an unverified address is refused; four first sign-ins at once make one link; an emailed code removes a link to an outside address and the session opened through it, after which that Google account is refused, and keeps links at `gmail.com` and Workspace addresses (seen to fail with the removal taken out); without client IDs Google is off | `TestSignInWithGoogle` |
| Without client IDs the API offers no Google method and answers `IDENTITY_GOOGLE_NOT_CONFIGURED` | `TestService` › without client IDs Google is offered nowhere |
| A wrong code spends a guess; the fifth ends the code | `TestService` › a wrong code spends a guess and the fifth ends the code |
| A second code within a minute is refused with the wait | `TestService` › a second code within a minute is refused with a wait |
| A code works once | `TestService` › a code works once |
| A new code ends the earlier one | `TestService` › a new code ends the earlier one (seen to fail with the rule taken out) |
| An unknown or malformed token is refused with 401 and `WWW-Authenticate` | `TestService` › an unknown or malformed token is refused with 401 |
| Admin operations are refused to a customer and served to an admin | `TestService` › only admins read the email settings |
| The limits' waits per hour and per day | `TestLimitWait` (`internal/identity/sign_in_test.go`) |
| An address is one plain address, kept in lower case | `TestNormalizeEmail` |
| The stored code depends on the challenge and the key | `TestCodeHashDependsOnChallengeAndKey` |
| An account is created for an address added as staff | `TestSeller` › publishing follows status and membership (`internal/seller/seller_test.go`) |

Not covered by a test: the limits of ten codes an hour and of wrong guesses per hour and per day through the API (their waits are unit-tested), and the expiry of a session after 30 days.
