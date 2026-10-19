# SEC-43 — Signing in on the app: plan

Design: [design.md](design.md). Tracked in Linear as SEC-43.

| # | Step | State |
| --- | --- | --- |
| 1 | Lucide icons in place of Material's, each the web's own at the web's size | Built, 19 October 2026 |
| 2 | Design and plan | Written, 19 October 2026 |
| 3 | The session: the secure store, the Bearer interceptor that drops a refused token, the repository, the current account; the stub backend answers a token and reads the header | Built, 19 October 2026 |
| 4 | The sign-in screen (`/sign-in?returnTo=`), the header's capsule and account menu, the account tab signed in and out; `app_ui`'s code field, alert and Google button | Built, 19 October 2026 |
| 5 | Google on Android and iOS: `google_sign_in` with the web client as `serverClientId`, the nonce, the link-required step; iOS client from an ignored xcconfig; setup in `mobile/README.md` | Built, 19 October 2026; not run on a device |
| 6 | Checked in the browser preview against the stub: the code, a wrong code, too many codes, the session kept across a reload and sent as Bearer, sign-out | Done, 19 October 2026 |
| 7 | On an Android device: the token kept across a restart, the keyboard's code suggestion, focus back in the code field after a wrong code, Google with the Android client. On an iPhone: Google with the iOS client | Not started: no emulator or Mac on the machine it was built on |
