# SEC-28 — Failure messages translated by the server: verification

Run on 20 October 2026 on Windows 11, on the branch before review.

## Backend

| Command | Outcome |
| --- | --- |
| `golangci-lint run ./...` | 0 issues |
| `go test ./...` | Every package passes. New in `internal/platform`: `TestProblemsAnswerInTheRequestsLanguage` (11 cases through the real handler: nothing asked, `vi`, `en-US,en;q=0.9`, `fr`, quality values, French then English, an unreadable header, an unknown route, a panic and a malformed body; each with `Content-Language` and `Vary`), `TestViolationsAreTranslated`, `TestViolationDetail`, `TestViolationWordsKeepHumasValues`, `TestAFailureNeedsItsWordsInEveryLanguage`, `TestEveryPlatformCodeHasWords` |
| `go mod tidy -diff`, `govulncheck ./...` | No difference; no vulnerability the code reaches |

All 43 module failures and the platform's own load with both languages, since `NewFailure` refuses words missing one.

## Web

| Command | Outcome |
| --- | --- |
| `pnpm check` | Catalogs (449 keys) match; lint, format, types, 45 unit tests and knip pass. New: the client asks in the page's language, keeps a language the caller chose, and gives a screen the server's sentence and the reference |
| `CI=1 pnpm test:e2e` | 90 passed, 6 skipped (the phone-only and desktop-only cases), with axe. The forms show the server's Vietnamese, read by the stub backend from the Go declarations; new: the English sign-in page shows the server's English while the browser asks for Vietnamese |

## App

| Command | Outcome |
| --- | --- |
| `dart format --set-exit-if-changed .`, `flutter gen-l10n`, `swagger_parser`, `build_runner` | No change; no untranslated message |
| `flutter analyze --fatal-infos` (app and `packages/app_ui`) | No issues |
| `flutter test` | App: 96 passed, among them the sign-in screen showing the server's words, the reference after an unexpected failure, and its own sentence without an answer. `app_ui`: 78 passed |

## Against the real service

The server built from the branch, on its own PostGIS and Mailpit (`docker compose -p sec28proof`), with the web's production build in front of it and the debug app on an Android emulator:

- **API, 17 requests.** An invalid address answers Vietnamese with no `Accept-Language`, with `vi` and with `fr`; English with `en-US,en;q=0.9` and with `vi;q=0.2, en;q=0.8`; `Content-Language` names the language each time. Likewise in both languages:
  - a missing member, as a translated violation ("Thiếu trường bắt buộc email." / huma's English);
  - an unknown route;
  - a missing session;
  - a wrong code;
  - a phone too short.
- **Web.** On `/vi/sign-in` and `/en/sign-in`, with the browser asking for Vietnamese both times, an address the server refuses and a wrong code show the server's sentence in the page's language. The requests carried `Accept-Language: vi` and `en`.
- **App.** In Vietnamese, then after the app's language button switched it to English, the same two failures show the server's sentence in the app's language.
- **Found by the run and fixed.** The contract's `minLength: 9` on a seller's phone answered a short phone with a generic validation failure before the module's rule could. The form then showed "Yêu cầu chưa hợp lệ…" at its top instead of marking the phone. The length rule left the contract; the module's 9-to-15-digit rule answers `SELLER_PHONE_INVALID` with its words, and the form marks the field. `TestService` now checks it in both languages.
