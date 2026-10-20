# SEC-52 — Legal, error and account screens: verification

Run on 20 October 2026 on Windows 11, on the branch before review.

## Web

| Command | Outcome |
| --- | --- |
| `pnpm check` | Tokens, catalogs (173 keys) and API client match; Oxlint, Prettier and the type check pass; 30 unit tests pass, among them `src/lib/seo.test.ts`; knip finds nothing unused. |
| `CI=1 pnpm test:e2e` | 39 passed, 3 skipped (the phone-only and desktop-only cases), on Pixel 7 and Desktop Chrome with axe. New: the legal page's title, canonical, `hreflang` `en` and `x-default`, description, `<time datetime>` and JSON-LD (`WebPage` with 8 parts, the `Organization`); the sitemap in both languages without `/account`; `robots.txt` closed and naming the sitemap; the account tab's header and `noindex`. |

### Lighthouse and PageSpeed Insights

PageSpeed Insights' API answered "Quota exceeded … Queries per day" without a key, so the same engine, Lighthouse 12.6.0, ran locally with Edge in headless mode, as PSI's mobile (simulated slow 4G, 4× CPU) and desktop presets. `main` and the branch were measured as production builds served by `next start` against the stub backend; staging as deployed from `main`.

| Page | Build | Performance (mobile / desktop) | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- | --- |
| `/vi/terms` | staging (`main`) | 95 / 97 | 100 | 100 | 63 |
| `/vi/terms` | `main`, local | 90 / 100 | 100 | 100 | 63 |
| `/vi/terms` | branch, local | 89 / 100 | 100 | 100 | 58 |
| `/vi/terms` | branch, local, `SECONDBITE_SITE_ORIGIN=http://localhost:3100` | 89 / 100 | 100 | 100 | 66 |
| `/en/privacy` | branch, local, same origin | 91 / 100 | 100 | 100 | 66 |
| `/vi/account` | `main`, local | 88 / 100 | 100 | 100 | 63 |
| `/vi/account` | branch, local | 88 / 100 | 100 | 100 | 63 |

- Performance is unchanged between `main` and the branch under the same conditions. The mobile score is held by a simulated LCP of about 3.7 s; the observed LCP is the first paint (about 0.1 s), and the simulation counts every script fetched before it, which on a local server is all of them.
- The one SEO audit left failing is `is-crawlable`: `robots.txt` disallows everything until the production address is chosen. `canonical` fails only when the page is measured on another origin than the one it names (the branch on `localhost`, naming staging); built with the measured origin, it passes. With robots opened, no SEO audit fails.
- `/vi/khong-co` cannot be scored: Lighthouse refuses a 404 answer.
- Staging's own numbers were measured before the change; measure it again once the branch is deployed.

## Mobile

| Command | Outcome |
| --- | --- |
| `flutter gen-l10n`, `dart run swagger_parser`, `dart run build_runner build --delete-conflicting-outputs`, `dart format lib/core/api` | Only the catalogs' generated classes and the typed routes changed, as committed; no key missing from a catalog. |
| `dart format --set-exit-if-changed .` | No change. |
| `flutter analyze --fatal-infos`, here and in `packages/app_ui` | No issues. |
| `flutter test` | 87 passed, among them the legal text against `web/messages` in both languages, the legal screens and scrolling to a section, the not-found screen leading home, and the account tab opening `/terms`. |
| `flutter test` in `packages/app_ui` | 76 passed, among them the blue top bar and its white back disc. |

Not checked on a device or emulator: nothing here needs the phone's own services, but the blue top bar's status bar icons are worth a look on Android and iOS before the beta.
