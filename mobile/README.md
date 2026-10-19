# Second Bite for iOS and Android

The rules are in the [mobile guideline](../docs/guidelines/mobile.md) and the checklist in [AGENTS.md](AGENTS.md).

## Run against the stub backend

```sh
# in web/: sample offers at http://localhost:3190
STUB_BACKEND_PORT=3190 node tests/e2e/stub-backend.mjs
# here: an Android emulator reaches the computer at 10.0.2.2, the default origin
flutter run
# the browser preview needs an origin the browser can reach
flutter run -d chrome --dart-define=SECONDBITE_API_ORIGIN=http://localhost:3190
```

The stub sends no CORS headers, so the browser preview needs it behind the same origin as the page.

## Generated code

- `lib/core/api/`: the API client, from `api/openapi.yaml` by `dart run swagger_parser`, then `dart format lib/core/api`.
- `*.g.dart`, `*.freezed.dart`: `dart run build_runner build --delete-conflicting-outputs`.
- `lib/l10n/gen/`: `flutter gen-l10n`.
