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

The stub sends no CORS headers, so the browser preview needs it behind the same origin as the page. It signs in with the code `123456` (any other is wrong), and `limit@example.com` has asked for too many codes.

## Signing in with Google

The app signs in with Google on Android and iOS through `google_sign_in` ([SEC-43](../docs/increments/completed/sec-43-app-sign-in/design.md)). The ID token is issued to the server's web client, which the app reads from `GET /auth/methods` and gives Google as `serverClientId`; the server accepts it because that client is in `SECONDBITE_GOOGLE_CLIENT_IDS`. No client ID is written in Git: they are public values, but each environment keeps its own.

In the Google Cloud project of the web client (Google Auth Platform › Clients):

- **Android**: a client of type Android with the package name `vn.secondbite.second_bite` and the SHA-1 of the certificate that signs the build (`keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android` for a debug build; the Play signing key's for a release). Nothing else: without `google-services.json`, the web client as `serverClientId` is all the Android SDK needs. Each computer's debug key needs its own SHA-1 on the client.
- **iOS**: a client of type iOS with the bundle ID `vn.secondbite.secondBite`. Copy `ios/Flutter/GoogleSignIn.xcconfig.example` to `ios/Flutter/GoogleSignIn.xcconfig` (ignored by Git) and fill in the client ID and its reversed form, which the iOS build puts in `Info.plist` as `GIDClientID` and as the URL scheme Google returns through. Build with the same file as Dart defines, so the app passes the iOS client at run time and offers Google:

  ```sh
  flutter run --dart-define-from-file=ios/Flutter/GoogleSignIn.xcconfig
  ```

  Without the file or the define, the app builds and offers only the emailed code on iOS (Google's iOS SDK would stop the app if asked to sign in without a client).
- **Server**: add the Android and iOS client IDs to `SECONDBITE_GOOGLE_CLIENT_IDS` after the web's, which stays first because `GET /auth/methods` names it.

The browser preview offers no Google button (Google allows only its own rendered button there), and the App Store asks for Sign in with Apple beside Google before the iOS app is released (guideline 4.8, SEC-38). Signing in, the kept session and the keyboard's code suggestion are checked on a device, never only in the preview.

## Generated code

- `lib/core/api/`: the API client, from `api/openapi.yaml` by `dart run swagger_parser`, then `dart format lib/core/api`.
- `*.g.dart`, `*.freezed.dart`: `dart run build_runner build --delete-conflicting-outputs`.
- `lib/l10n/gen/`: `flutter gen-l10n`.
