# SEC-43 — Signing in on the app, with the emailed code and Google: design

Status: proposed on 19 October 2026; built on the branch of SEC-43 ([plan](plan.md)). Tracked in Linear as SEC-43.

The app is a second client of what SEC-29 built for the web ([SEC-29 design](../../active/sec-29-web-sign-in/design.md)); the server and the contract do not change. Everything the person sees follows the web: the screens, their words, their order, the problems and what each one does, the resend wait, the paste rule and `returnTo` ([sign-in research](../../../research/2026-10-19-sign-in-and-code.md)). This document records only where the app differs.

## What a person can do

- From the home header's **Đăng nhập** capsule, or the account tab's **Đăng nhập** button, open `/sign-in` and come back to the screen that sent them.
- Sign in with **Tiếp tục với Google** when the server offers it (`GET /auth/methods` names a client), or with their address and the six-digit code emailed to it.
- See their address on the account tab and sign out there, or from the header's account button.

## Where the app differs from the web

### 1. The session is a Bearer token in the platform's secure store

The web asks for the cookie (`"session": "cookie"`); the app asks for the token in the body (`"session": "token"`, the contract's default) and keeps it with `flutter_secure_storage` (the Keychain on iOS, the Keystore-backed encrypted preferences on Android), as the [mobile guideline](../../../guidelines/mobile.md#stack) and SEC-27 decided. It is never written to `shared_preferences`, a log or a crash report.

- **Sent by one dio interceptor** on the generated client, as `Authorization: Bearer <token>` on every call while a session is kept.
- **A refused token is dropped.** The server refuses a header with an unknown or ended token at once, even on public operations ([identity spec](../../../specs/identity.md)), unlike the web's ended cookie, which is ignored. So on a `401` with `IDENTITY_SESSION_INVALID` to a call that carried the token, the interceptor forgets the session and sends the call once more without it: the home still loads for someone whose session ended, and they are shown as signed out.
- **At start** the app reads the stored token and asks `GET /accounts/me`; until it answers, the header shows nothing in the account's place rather than a wrong state.
- **Signing out** calls `DELETE /auth/sessions/current` and forgets the token whatever it answers, as the web refreshes whatever `signOut()` answers.

### 2. The route is `/sign-in?returnTo=`, outside the tabs

`/sign-in` is a typed route at the root, not a branch of the bottom bar, so it covers the tabs as the web's page does on a phone; its top bar's back returns to `returnTo`. `returnTo` is kept only when it is a path of the app (starts with one `/`, has no scheme or host), else it is `/`, as the web's `readReturnTo`. A signed-in person who reaches `/sign-in` is sent to `returnTo`.

### 3. Google through `google_sign_in`, with the web's client as the audience

The web shows Google's own button from Google Identity Services. The app uses the Flutter team's `google_sign_in` 7, which on Android signs in through Credential Manager and on iOS through Google's SDK, and hands back an ID token. The app gives it the client ID from `GET /auth/methods` as `serverClientId`, so the token's audience is the web client the server already accepts in `SECONDBITE_GOOGLE_CLIENT_IDS`; no server change and no client ID in the app's code. Android needs an Android OAuth client in the same Google Cloud project, matched to the package name and the signing certificate's SHA-1, and no `google-services.json` ([setup](../../../../mobile/README.md#signing-in-with-google)).

- **The nonce** is drawn as on the web (32 random bytes, hex), its SHA-256 given to Google and the value itself posted with the token to `POST /auth/google` (SEC-29 decision 6). `google_sign_in` 7 takes the nonce once, at `initialize`, which may run only once in the app's life; the app therefore draws one per launch, the first time the button is pressed.
- **The button** is drawn by the app (`AppGoogleButton`), since only the web has Google's rendered button: white, a 1 px grey edge, Google's "G" from its branding kit, Google's wording ("Tiếp tục với Google", "Continue with Google") in Roboto Medium, full width like the email button, as [Google's branding guidelines](https://developers.google.com/identity/branding-guidelines) allow for a custom button. Its colours are Google's and stay in the widget, not in DESIGN.md.
- **Where `authenticate()` is not supported** (the browser preview, whose Google sign-in would need Google's rendered button), the button is not shown; the preview is not offered to customers ([mobile guideline › Platforms](../../../guidelines/mobile.md#platforms)).
- **`IDENTITY_GOOGLE_LINK_REQUIRED`** turns the screen into the web's "send a code to this address" step, with the warning and the address from the token.
- **iOS** needs an iOS OAuth client, and its reversed ID as the URL scheme Google's SDK returns through. Both come from `ios/Flutter/GoogleSignIn.xcconfig`, ignored by Git and included by `Debug.xcconfig` and `Release.xcconfig` with `#include?`, so a build without it still succeeds. The same file is passed as Dart defines (`--dart-define-from-file`), because the iOS plugin honours a `serverClientId` from Dart only when the client ID comes from Dart too, and because the app must know whether it has a client: Google's iOS SDK stops the app when asked to sign in without one, so without the define the iOS app offers only the emailed code. Sign in with Apple is required beside Google before the iOS app is released (App Store guideline 4.8, SEC-38), outside this change.
- **Android** needs no file in the app: an Android OAuth client in the same project, matched to the package name and the signing certificate's SHA-1, and the web client as `serverClientId` (the `google_sign_in_android` integration notes).
- **Signing out** also forgets the Google account chosen on the phone, so the next Google sign-in asks which account again.

### 4. The code field is one field drawn as six boxes

As the web's `input-otp`: one real `TextField` under six drawn slots, so paste and the keyboard's one-time-code suggestion (`AutofillHints.oneTimeCode`) fill all six at once. Whatever arrives keeps only its digits, at most six, and six digits submit.

## Boundary

The app's `identity` feature (`lib/features/identity`): the session store, the repository over `SignInClient` and `AccountsClient`, the session notifier, the sign-in screen and the account tab. `core/api.dart` gains the interceptor. No server, contract or web change, beyond the stub backend answering a token and reading the Bearer header as the contract says.

## Packages

| Package | Version | Why |
| --- | --- | --- |
| `flutter_secure_storage` | 11.2 | The guideline's store for the session token; Android 6 (API 23) and up, below the app's 24 |
| `google_sign_in` | 7.2 | The Flutter team's Google sign-in; an ID token on Android and iOS |
| `crypto` | 3.0 | The Dart team's SHA-256 for the nonce |
| `lucide_icons_flutter` | 4.0.0, held | Lucide, the web's icon set, in `app_ui`; moved by hand with the web's `lucide-react` so a renamed glyph changes in both at once |

Android's backup is turned off (`allowBackup="false"`): the token is encrypted with a Keystore key that never leaves the phone, so a restored copy could not be read, and a session stays on the phone that opened it. A store that cannot be read counts as signed out.

## Verification plan

- Unit: the repository with a fake client (token stored on sign-in, cleared on sign-out and on a refused token), the interceptor (header sent, a refused token dropped and the call sent again without it), `returnTo`, the paste filter, the nonce's hash.
- Widget: the email step, the code step, each problem's words, the wrong code clearing the field, the resend countdown, the Google button shown only with a client, the link-required step, the header capsule and the account tab in both states.
- Browser preview against the stub backend: sign in with 123456, a wrong code, sign out.
- On an Android device or emulator, before the beta: the token kept across a restart in the Keystore, the keyboard's code suggestion, and Google with the Android client. Not done in this change: the machine it was built on runs no emulator.
