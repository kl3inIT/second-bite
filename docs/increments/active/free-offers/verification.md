# Free offers: verification

Run on 21 November 2026 on a Hypomnema worker, before the pull request.

- **Server**: `go test -count=1 ./...` in `server/` against PostgreSQL 18 with PostGIS 3.6 and Mailpit run locally, the containers' images not being reachable there (the test helpers pointed at them by a local change, not committed). Every package passed but `internal/file`'s S3 check, which needs Docker. The new check passed, and failed with `details.go` and the migration taken back. `TestOpenAPIDocumentIsCurrent` passed after `-update`.
- **Web**: `check:messages`, `check:api`, `check:tokens`, `lint`, `format:check`, `typecheck` (in a private mount namespace, as SWC refuses the worker's shared directories), `test:unit` (195 passed) and `knip` passed; `next build`, then `playwright test`: 439 passed, 15 skipped.
- **App**: `dart format --set-exit-if-changed`, `gen-l10n`, `swagger_parser` and `build_runner` left nothing to commit, no untranslated key; `flutter analyze --fatal-infos` clean here and in `packages/app_ui`; `flutter test` 324 passed, `packages/app_ui` 101 passed.
