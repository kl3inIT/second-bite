# Mobile guideline

How the Flutter application in `mobile/` realizes the [conventions](../conventions.md), for customers and sellers on iOS and Android. Design rules are in [DESIGN.md](../../DESIGN.md); what the product must do is in [PRODUCT.md](../../PRODUCT.md). Every choice here was decided with the team on 18 October 2026 and recorded on SEC-12 with its sources. The web's counterpart is the [web guideline](web.md); where the two can work alike, they do.

## Stack

- Flutter on its newest stable release, Dart 3, with every package at its newest release; Dependabot proposes `pub` updates weekly. A package held back records why next to it and when it can move.
- Material 3 through the `material_ui` package, the Material library split out of the framework, themed entirely by our tokens; `cupertino_ui` for the iOS behaviour people notice (swipe back, action sheets, pickers). No shadcn port: the shadcn-style kits are all before 1.0.
- State is Riverpod 3 with code generation (`@riverpod`). Routing is go_router with go_router_builder, every route typed (`@TypedGoRoute`).
- The API client is generated from `api/openapi.yaml` by swagger_parser: a dio and retrofit client with freezed models. It is never written by hand or edited.
- The session's Bearer tokens (SEC-27) live in the Keychain or Keystore through `flutter_secure_storage`, never in `shared_preferences`.
- A package arrives with its first consumer, never ahead of it. Patrol arrives with the first screen that meets a system permission dialog.

## Platforms

- The app ships to iOS and Android only. `mobile/web/` exists so the team can look at screens in a browser without an emulator: locally with `flutter run -d chrome`, and at `https://preview.secondbite.vadan.app/mobile/`, staging's address, which every release of `main` updates (`mobile/preview/`, built with `--base-href /mobile/`, never indexed). It is a preview for the team, never offered to customers, and no code is changed to make it work on the web. On a computer, `web/index.html` runs the app in a device-sized frame, with buttons above it for an iPhone (390×844), an Android phone (360×800), a small phone (320×568), a tablet (820×1180) and landscape; on a phone it fills the screen. The frame is plain HTML around the engine's host element, as in the Flutter team's `element_embedding_demo`; `device_preview` was set aside because 3.0 moved its controls into DevTools, which a release build lacks (SEC-44). Customers on the web use the Next.js application in `web/`.
- The preview at `https://preview.secondbite.vadan.app/mobile/` talks to staging's API on the same origin (`/api/`, sent on by the host's proxy), so a change merged to `main` can be checked there with staging's data and the emailed sign-in code. Staging's database holds test data only; the pilot's sellers and buyers use production at `secondbite.vadan.app` (SEC-185). A screen opens by its route after `#`, Flutter's default on the web, and the preview's nginx sends a plain path there, so `/mobile/account/settings` opens settings (SEC-94). A local `flutter run -d chrome` or a pull request's preview build still calls the stub backend.
- What the browser does differently is checked on an Android emulator or a device, never in the preview: secure storage (on the web it is browser storage), push, the camera, location and Google's sign-in, whose button the preview hides.
- The Android build asks Gradle for a 3 GB heap (`android/gradle.properties`) instead of the template's 8 GB, so it builds on a 16 GB laptop beside an emulator.

## Agent skills and documentation

- The skills vendored in `.claude/skills/` come from the Flutter team (`flutter-*`, `dart-*`) and from Very Good Ventures (`material-theming`, `ui-package`, `accessibility`, `static-security`, `testing`, `navigation`, `internationalization`); [SOURCES.md](../../.claude/skills/SOURCES.md) lists them and where each yields to this guideline. A change follows the skill of its topic.
- A package with no official skill, Riverpod among them, is written from its own documentation for the version in use, read through Context7 before writing a kind of code the app does not have yet. A skill is a summary; when it and the package's documentation disagree, the documentation wins.

## Structure

The app is organized by feature, one feature per Go module it talks to, so a change to `server/internal/offer` and its screens meet in `lib/features/offer`. Inside a feature the layers are those of the Flutter team's architecture skill: only adjacent layers talk, and the repository is the single source of truth.

```
mobile/
├─ lib/
│  ├─ core/                  app shell, router, theme wiring, the generated API client
│  ├─ features/<feature>/    offer, seller, identity, …
│  │  ├─ data/               repositories over the generated client
│  │  ├─ domain/             freezed models; use cases only when logic outgrows a notifier
│  │  └─ ui/                 screens, their widgets and their Riverpod notifiers
│  └─ l10n/                  arb/app_vi.arb and app_en.arb; gen/ is written by gen-l10n
├─ packages/app_ui/          the design system: tokens, ThemeData, shared widgets
├─ test/  integration_test/
└─ AGENTS.md                 the checklist before finishing a change
```

- A notifier is the view model of the architecture skill: `@riverpod` classes, not `ChangeNotifier`. Riverpod providers inject repositories and the client; there is no service locator.
- A repository calls the generated client directly. No interface is written for a single implementation; a test replaces a repository with Riverpod's `overrides`.
- `packages/app_ui` follows VGV's `ui-package` skill: one barrel (`package:app_ui/app_ui.dart`) and nothing imported from `src/`, one widget per file with an `App` prefix, a widget test for each widget pumped through `pumpApp`. Screens style nothing themselves.

## Design tokens and theming

- Tokens are defined once, in the frontmatter of `DESIGN.md`. `web/scripts/generate-tokens.mjs` writes both the web's `tokens.css` and `app_ui`'s `tokens.g.dart`, with the same contrast gate; never edit either file. Token names follow the web's (`primary`, `signature`, `muted-foreground`).
- `ThemeData` is built from the tokens and is the only source of colour, type and component style, as VGV's `material-theming` skill asks. Colours Material has a role for go into `ColorScheme`; the rest (`fresh`, `link`, `success`, `warning`, the `*-hover` colours) into the `AppColors` extension. The eighteen type roles fill Material's fifteen `TextTheme` slots and the `AppTextStyles` extension, under the web's names. `tokens.g.dart` holds only the values; which role takes which Material slot is written by hand in `AppTheme`, so a role added to DESIGN.md reaches the app once someone maps it there. Material's defaults that do not belong to the design (ripple colour, surface tint, tonal fills) are set explicitly in the component themes.
- The typefaces are bundled in `app_ui` (Be Vietnam Pro, and Bricolage Grotesque as a variable font whose weight is set as an axis), with their licences registered by `registerFontLicenses()`; a text style names its family with `package: 'app_ui'`.
- There is no dark theme until DESIGN.md defines one.
- Touch targets are at least 44 points; status is never carried by colour alone; text scales with the system setting.

## Data, session and language

- Repositories call the generated client; the client is configured once in `core/` with the API's address and the session's token. A failure's words are the server's `detail` (SEC-28); the app branches on its `code` only where the screen does something different.
- Vietnamese and English through gen-l10n (`flutter_localizations`, `intl`, ARB files), read as `context.l10n`. The first language follows the device; a choice made in the app is kept in `shared_preferences` and sent as `Accept-Language` on every call. Every key is in both catalogs.
- Times are shown in `Asia/Ho_Chi_Minh` on the 24-hour clock, prices in đồng (`39.000đ`), as on the web.
- The terms and the privacy policy are read inside the app from a copy of the web's text in the ARB catalogs (`legalTerms*`, `legalPrivacy*`); `test/features/legal/legal_text_test.dart` reads `web/messages` and fails when the two differ, so a change to the legal text is made on the web and copied here in the same change (SEC-52).

## Quality gates

- Lint is `very_good_analysis` with `riverpod_lint`; a warning fails the build.
- Unit and widget tests with `flutter_test`, mocks with `mocktail`, goldens for `app_ui`'s widgets, integration tests with `integration_test`. There is no coverage threshold.
- The Flutter version is pinned once, as `environment.flutter` in `pubspec.yaml`, which every workflow reads. CI runs, on every pull request, the analyzer, the formatter, the tests, the catalog check, the generated-client and token drift checks and an Android build; on `main`, an iOS build on macOS. The Flutter version is pinned there.
