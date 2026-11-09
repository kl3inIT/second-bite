# SEC-196 — Sign in and register with a username in the app: design

Tracked in Linear as SEC-196. SEC-193 gave the server and the web a third way in, a username and a password, and made it the way the web's sign-in opens on ([SEC-193 design](../../completed/sec-193-username-sign-in/design.md)). The app follows here, so that it matches the web's customer flow (SEC-204). The server does not change: every operation below already serves the web, and the app's generated client has them since PR #200.

## 1. What changes for a person

The app's screens are the web's, at the web's paths:

| Path | Screen | As the web's |
| --- | --- | --- |
| `/sign-in` | A username and a password; under the button, "hoặc", "Đăng nhập bằng email", "Tiếp tục với Google" when the server offers it, "Chưa có tài khoản? Đăng ký", the legal line | `PasswordSignInForm` |
| `/sign-in/email` | The emailed code as the app had it, without Google, with "Đăng nhập bằng tên đăng nhập" back | `SignInForm` |
| `/register` | A username, a password, the password again; "Đã có tài khoản? Đăng nhập" | `RegisterForm` |

- The fields are checked as the web checks them, on the first try and then as they change: sign-in asks for both fields; register checks the username's rule (`^[A-Za-z0-9][A-Za-z0-9._-]{1,28}[A-Za-z0-9]$`), 8 to 128 characters counted as the server counts them (runes), and the two passwords alike.
- A refusal is in the server's words (SEC-28). On sign-in, it goes above the button and the password is cleared; on register, a username refused or taken goes under the username, a password refused under the password, anything else above the button; a field's refusal goes when that field changes.
- The password fields hide what is typed, and the fields carry autofill hints (`username`, `password`, `newUsername`, `newPassword`) in one autofill group, closed after a sign-in so a password manager offers to keep it.
- Each screen leaves as soon as someone is signed in, as sign-in did (SEC-69): back to the screen that opened it, or to `returnTo`. A screen opened above another (the emailed code above sign-in, register above sign-in) leaves, then the one below follows the account and leaves too.

## 2. Where the app differs from the web

- **Google's address that needs the code.** On the web, Google's refusal (`IDENTITY_GOOGLE_LINK_REQUIRED`) shows its alert on the sign-in page and the person then opens "Đăng nhập bằng email". The app opens `/sign-in/email` at once with the address Google gave (`google-email`), filled in under the alert, as the app's one screen did before: one step fewer, the same words.
- The heading of the sign-in screen stays the app's "Đăng nhập để đặt món".

## 3. Accounts without an email

An account made with a username has an empty `email` (SEC-193 › 2):

- The account tab, the header's menu and account settings name it by its username where they named the address (`AccountHandle.handle`, the web's `accountHandle`); settings shows a "Tên đăng nhập" row instead of the email row.
- Deleting it asks for its password (`POST /accounts/me/password-deletion`) instead of an emailed code, as the web's `DeleteAccountWithPasswordForm`: the password, then the final button; a wrong password (`IDENTITY_PASSWORD_INCORRECT`) is said under the field and cleared. The owner's warning and the wait for their stores stay as for the code.

## Boundary

- **In:** the three screens, their routes and strings in both catalogs, the repository's three calls, the account's name and deletion for accounts without an email, in `mobile/lib/features/identity/`.
- **Out:** any server change; Sign in with Apple (SEC-38, next); a way back from a forgotten password (none exists, SEC-193 › 6).

## Verification plan

- Unit tests of the repository's three calls.
- Widget tests: sign-in (fields, the rules, a wrong password cleared, the limit, the links to the other screens, Google and its address that needs the code), register (the rules, a taken username until it changes, back to sign-in), the emailed code on its own screen, deleting with the password, settings naming the username.
- On a device with the beta (SEC-204 step 16): register, sign out, sign in, delete.
