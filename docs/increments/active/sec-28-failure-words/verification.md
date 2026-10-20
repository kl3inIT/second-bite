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
