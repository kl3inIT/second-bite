# SEC-61 — Edit the display name: verification

Run on 20 October 2026 on Windows 11, on the branch before review.

## Checks

| Part | Outcome |
| --- | --- |
| Backend | `golangci-lint` 0 issues; every package's tests pass, among them `TestNormalizeDisplayName`, `TestSetDisplayName` and `TestService` › a person names their account; `go mod tidy -diff` and `sqlc diff` clean |
| Web | `pnpm check` (455 keys, 45 unit tests); e2e 96 passed, 6 skipped, with axe. New: `tests/e2e/account-settings.spec.ts` (a refused name in the server's words at the field, a saved one, a cancelled edit) |
| App | `flutter analyze --fatal-infos` clean; app 98 tests and `app_ui` 78 pass. New: the sheet saves the name; a refusal shows the server's words without a reference; untranslated messages none |

## Against the real service

The server built from the branch on its own PostGIS and Mailpit, the web's production build in Chrome, the debug app on an Android emulator.

- **API:**
  - A name sent with spaces around it comes back trimmed and the account reads it.
  - A name of spaces only is refused with `IDENTITY_DISPLAY_NAME_INVALID`, in Vietnamese and in English; so is a name of 51 characters.
  - The name is unchanged after each refusal.
  - Someone signed out is refused with 401.
- **Web:** the browser was set to Vietnamese.
  - Settings opens the field from "Sửa".
  - A name of spaces is refused at the field in the server's words; "Trần Thị Lan" saves, and the profile card, the row and the header's account capsule show it.
  - On `/en`, the refusal reads in English.
- **App:**
  - Settings opens the sheet from the row. A refusal reads in the server's Vietnamese.
  - "Lan Nguyen" saves; the profile card, the row and the account tab show it.
  - After switching the app to English, the refusal reads in English.
- **Found by the run and fixed:**
  - The web's account capsule showed Google's mark whenever an account had a name. A chosen name made a person who signed in with the emailed code look signed in with Google; the capsule now shows the person icon.
  - The app's sheet quoted the request's reference after an expected refusal; it no longer does, and the widget test checks it.
