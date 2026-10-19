# app_ui

Second Bite's design system for Flutter, built from the tokens in [DESIGN.md](../../../DESIGN.md). The rules are in the [mobile guideline](../../../docs/guidelines/mobile.md#design-tokens-and-theming).

## What it holds

- `lib/src/theme/tokens.g.dart`: DESIGN.md's colour roles, type roles, radii, spacing and shadows as constants. It is written by `web/scripts/generate-tokens.mjs` (`pnpm generate:tokens` in `web/`) and checked by the web's `pnpm check`; never edit it.
- `AppTheme.light`, the app's one theme. Material's `ColorScheme` and `TextTheme` take the roles they have a slot for, and the component themes follow DESIGN.md's components. There is no dark theme until DESIGN.md defines one.
- Theme extensions, read from the context:
  - `context.appColors`: the colour roles Material has no slot for (`fresh`, `link`, `header`, the `*-hover` colours…).
  - `context.appTextStyles`: the thirteen type roles under the web's names (`bodySm`, `price`…).
  - `context.appSpacing`: the spacing steps (`space4` is the web's `p-4`).
- Be Vietnam Pro and Bricolage Grotesque, with the Vietnamese marks, under the SIL Open Font License. `registerFontLicenses()` adds their licences to the app's licence page.
- `AppButton`, DESIGN.md's button.

## Usage

```dart
void main() {
  registerFontLicenses();
  runApp(MaterialApp(theme: AppTheme.light, home: const HomeScreen()));
}
```

## Tests

```sh
flutter test
```
