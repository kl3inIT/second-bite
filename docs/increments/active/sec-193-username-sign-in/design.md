# SEC-193 — Sign in and register with a username and a password: design

Tracked in Linear as SEC-193. Asked for on 3 November 2026 by the person who runs the web: a third way to sign in beside the emailed code and Google, and the way the sign-in screen opens on. The register form has exactly three fields (username, password, the password again), drawn in Figma on 3 November 2026 (`L10` register, `L11` sign in, `L12` sign in by email, in the file `Secondbite`). This increment builds the API and the web; the app follows in its own issue.

## 1. What changes for a person

- **Sign in** opens on a username and a password. Under the button: "Đăng nhập bằng email" (the emailed code, as today, on a screen of its own), "Tiếp tục với Google", and "Chưa có tài khoản? Đăng ký".
- **Register** takes a username and a password twice, and signs the person in at once.
- **An account made this way has no email.** The form does not ask for one, on purpose. The consequences are stated in section 6, so they are chosen and not discovered.

## 2. Accounts without an email

**Problem:** `identity_accounts.email` is `NOT NULL UNIQUE` and is the key every sign-in and every gift by address uses (an admin granted by address, a store's staff added by address, the codes sent to it).

**Chosen:** `email` may be empty (`NULL`); an account has an email, or a username with a password, or both in a later increment. A check keeps at least one way in.

- `Account.Email` stays a `string` for the other modules, empty for these accounts, so no module's types change. Four places outside `identity` read it: the store owner's email in two admin lists (shown empty, the username is shown instead), the status email to a store's owner (not sent when there is no address), and adding staff by email (an address that has no account is created as before; a username is never found by it).
- Nothing is emailed to an account without an address.
- A username account cannot be made an admin or given a seller membership by address, since both are given by address. It can open a store and own it.

**Not chosen:**

- **A made-up address such as `name@users.secondbite.invalid` in the same column:** it would need a rule at every place that sends email or accepts an address, and one forgotten place sends mail to an address that cannot exist, or lets someone type it and find the account. A column that says "no email" cannot be mistaken for one.
- **A second table for these accounts:** sessions, roles, display names, deletion events, the admins' list and every module that names an account identifier would then have two kinds of account to join. One table with two ways in is the smaller change.

## 3. Username and password

- **Username:** 3 to 30 characters, lower case letters `a`–`z`, digits, `.`, `_` and `-`; the first and the last a letter or a digit; unique, kept as typed in lower case (the form lower-cases it, so `Lan` and `lan` are one name). The web lower-cases it before sending, the server refuses the rest.
- **Password:** 8 to 128 characters, anything, spaces included; not equal to the username. No composition rules and no forced changes, as NIST SP 800-63B advises; length is what protects it. A list of breached passwords is not checked: it needs a call to another service on every registration, and the throttles below bound guessing.
- **Storage:** argon2id (`golang.org/x/crypto/argon2`, already in the module graph), memory 19 MiB, 2 passes, 1 lane, a 16-byte random salt, a 32-byte hash: OWASP's minimum set. Kept as one PHC string, parameters included, so a later change of parameters verifies old hashes and can rehash on sign-in. The password is never logged, never in an error, and not in the audit trail.
- **Both answers alike:** an unknown username and a wrong password get the same failure, `IDENTITY_CREDENTIALS_INCORRECT`, and the same time: an unknown username is checked against a fixed hash so that the answer does not come sooner.
- **Registering reveals that a username is taken** (`IDENTITY_USERNAME_TAKEN`, 409). No form can hide that and still work; the address throttle bounds a script asking.

## 4. Limits on guessing

Passwords can be guessed offline-free and online, so the online way is bounded twice, in memory as the per-address limits of SEC-160 are:

- **Per client address:** 30 registrations and sign-ins in ten minutes, the bound of the codes, generous for the people behind one mall's Wi-Fi.
- **Per username:** 5 wrong passwords in 15 minutes; the sixth try within the window is refused with `IDENTITY_SIGN_IN_LIMIT_EXCEEDED` (429, `Retry-After`) **without comparing the password**, even a right one, so the limit cannot be used to test it. The count is kept for a username that does not exist as well, so the refusal tells nothing about whether it does. A right password does not clear the count, which keeps its window.
- The counts live in this instance's memory, as SEC-160's do: several instances each count their own, and a restart forgets them. The pilot runs one instance. A shared count in PostgreSQL is a later change if the service is ever scaled out.

## 5. Interfaces

All under `identity`, in the contract `api/openapi.yaml`, regenerated by the backend.

| Operation | Who | Answer |
| --- | --- | --- |
| `POST /auth/accounts` `{username, password, session}` | Anyone | `201 {token, expiresAt, account}`: the account is made and signed in, the session handed over as the emailed code does (`session: cookie` for the web, a token for the app) |
| `POST /auth/password-sessions` `{username, password, session}` | Anyone | `201`, the same |
| `POST /accounts/me/password-deletion` `{password}` | A signed-in caller whose account has a password | `204`; the account is deleted as with the emailed code and the cookie cleared |
| `GET /accounts/me` | A signed-in caller | now also `username`; `email` is empty without one |

Failures added: `IDENTITY_USERNAME_INVALID` (400), `IDENTITY_PASSWORD_INVALID` (400), `IDENTITY_USERNAME_TAKEN` (409), `IDENTITY_CREDENTIALS_INCORRECT` (400, like a wrong code, so a client does not read it as an ended session), `IDENTITY_SIGN_IN_LIMIT_EXCEEDED` (429), `IDENTITY_NO_EMAIL` (409: a deletion code, which is emailed, asked for by an account that has none), `IDENTITY_PASSWORD_INCORRECT` (400: the password that confirms a deletion). Each in Vietnamese and English beside its code.

The session is the one every sign-in opens (30 days from its last use, the cookie or the Bearer token). `last_sign_in_method` gains `password`, which the admins' list shows.

## 6. What this does not give, and what it costs

- **No way back from a forgotten password.** There is no address to send a link or a code to. An admin cannot reset it either, in this increment: that is a feature with its own audit design. A person who forgets it makes a new account. The three-field form was chosen knowing this; the sponsor should hear it before the beta, since it is a cost to their customers.
- **No email later:** adding an address to such an account, and linking Google to it, wait until someone needs them; both need the proof of an address that this account never gave.
- **Deleting the account asks for the password** instead of an emailed code. A stolen session alone cannot delete it.
- **A weak password is the person's to avoid:** nothing checks it against a breach list (section 3).

## 7. Data

Migration `0045_identity_add_username_password.sql`, forward-only like those since staging (SEC-33):

- `email` loses `NOT NULL`; its lower-case check and uniqueness stay (a unique index allows many `NULL`s).
- `username text UNIQUE`, with the form above as a `CHECK`; `password_hash text`; a check that they are both set or both empty, and one that an account has an email or a username.
- `last_sign_in_method` allows `password`.
- The words the admins search by (`search_text`) are made again from the address, the username and the name.

`identity_sign_in_challenges` is untouched: no code is sent to these accounts.

## 8. Web

The three screens as drawn: the sign-in page of `L11` at the address of today's sign-in, the emailed code on its own page of `L12` (the screen of today with the Google button and the divider taken out), and `L10` for registering; every sign-in entry (the order dialog, the account tab, the seller screens) opens the new default. Strings in both message catalogs. The password field is `type="password"` with `autocomplete="current-password"` on sign-in and `new-password` on register, and the username `autocomplete="username"`, so password managers work. The `Sign in with Google` button and the emailed code behave exactly as before.

## Verification plan

- **Go:** username and password rules; hash and verify, including a hash made with other parameters; registering signs in, a taken username (any case) is refused, the sixth wrong password in the window is refused even with the right one, an unknown username is refused the same way and counted, the address limit; a username account is deleted with the password and refused a deletion code; no email is sent to it (the status email of a store it owns); the admins' list shows the username and finds it by words.
- **Migration:** the checks (`both or none`, `email or username`) hold; the existing accounts are untouched; applied to a copy of staging's data.
- **Through the API** (`TestService`) and **against the real service:** register with the cookie and with the token, sign in, `GET /accounts/me`, wrong passwords until the limit with `Retry-After`, delete with the password.
- **Web:** Playwright with axe on the three screens at 390 and 1440 (the CI runs the suite; it is not run on a developer's machine).
