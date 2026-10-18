# Mobile application

Rules for `mobile/` are in the [mobile guideline](../docs/guidelines/mobile.md); design in [DESIGN.md](../DESIGN.md). Follow the skill of each topic in `.claude/skills/` ([SOURCES.md](../.claude/skills/SOURCES.md) says where one yields to the guideline). Before finishing a change here:

- [ ] Every string is in `lib/l10n/arb/app_vi.arb` and `app_en.arb` and read as `context.l10n`; widgets in `app_ui` take their text as parameters.
- [ ] Screens style nothing themselves: colours, type and spacing come from `app_ui`'s theme; a new value went into DESIGN.md and the token generator.
- [ ] Routes are typed (`@TypedGoRoute`), with paths that match the web's; no `extra`.
- [ ] Code written with Riverpod, go_router, swagger_parser or freezed was checked against that package's documentation for the version in use.
- [ ] After changing an annotated file, `dart run build_runner build --delete-conflicting-outputs` was run and the generated files committed.
- [ ] `flutter analyze` and `flutter test` pass here and in `packages/app_ui`.
- [ ] Anything that needs a real phone (secure storage, push, camera, location, sign-in) was checked on an Android emulator or device, never only in the browser preview.
