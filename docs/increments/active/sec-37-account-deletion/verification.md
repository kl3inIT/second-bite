# SEC-37 — Account deletion: verification

Run on 20 October 2026 on Windows 11, on the branch before review.

## Backend

| Command | Outcome |
| --- | --- |
| `golangci-lint run ./...` (v2.15.0) | 0 issues |
| `go test ./...` | Every package passes against PostGIS and Mailpit in containers. New: `TestService` › an owner deletes their account; the others forget it; `TestDeleteAccount`; `TestDeletedAccountIsForgotten`; `TestDeletedUploaderIsForgotten`; `TestEvents` |
| `go mod tidy -diff`, `sqlc diff` | No difference |
| `govulncheck ./...` | No vulnerability the code reaches |

## Web

| Command | Outcome |
| --- | --- |
| `pnpm check` | Tokens, catalogs (269 keys) and API client match; lint, format and types pass; 30 unit tests pass; knip finds nothing unused |
| `CI=1 pnpm test:e2e` | 55 passed, 5 skipped (the phone-only and desktop-only cases), with axe. New: `tests/e2e/delete-account.spec.ts` |

Lighthouse 12.6.0, as PageSpeed Insights' presets, on a production build against the stub backend, built with the measured origin:

| Page | Performance (mobile / desktop) | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- |
| `/vi/delete-account` | 85 / 99 | 100 | 100 | 66 |
| `/en/delete-account` | 86 / 100 | 100 | 100 | 66 |
| `/vi/privacy` | 86 / 100 | 100 | 100 | 66 |

SEO fails only `is-crawlable`, from the robots closed until the production address is chosen, as on every page. The mobile performance is held by the simulated LCP of a local server, as measured in SEC-52.

## Mobile

| Command | Outcome |
| --- | --- |
| `flutter analyze --fatal-infos` (app and `packages/app_ui`) | No issues |
| `flutter test` | App: 91 passed; `app_ui`: 77 passed. New: the deletion screen signed out, the flow with a wrong then the right code, the owner's warning; the account tab offers the deletion only signed in; the destructive button |
| `flutter gen-l10n`, `swagger_parser`, `build_runner` | Generated code unchanged; no untranslated message |

## Against the real service

The server built from the branch, on its own PostGIS and Mailpit (`docker compose -p sec37check`), with the web's production build in front of it:

- A new address signs in on the web with the emailed code and creates a seller through the API.
- The account tab leads to `/delete-account`, which names the seller in the owner's warning. The deletion email is a separate message ("Mã xác nhận xoá tài khoản Second Bite"); a sign-in code is refused while it is live (429).
- A wrong code is refused; the right one deletes; `GET /accounts/me` then answers 401, no session cookie is left, and the account tab is signed out.
- In the database: no account, code or session for the address, no record of the emails to it, the seller `blocked` with no one in `status_changed_by` and no members; River ran `seller.forget_account` and `file.forget_uploader` once each, both `completed` at the first attempt.

The app, as a debug APK built against the same server, on an Android 16 emulator (Pixel 7, system image `android-36.1` with Google APIs, in Vietnamese), driven through `adb` and the accessibility tree:

- A new address signs in from the account tab with the emailed code.
- Tài khoản → Xoá tài khoản names the address and warns the owner of the seller made for it.
- The emailed deletion code deletes the account and shows "Đã xoá tài khoản". Another session of the same account then answers 401, and the account tab is signed out.
- In the database the seller is `blocked` and both listeners completed, as on the web.
