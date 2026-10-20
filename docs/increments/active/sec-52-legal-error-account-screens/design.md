# SEC-52 — Legal, error and account screens: design

Status: proposed on 20 October 2026, built on the branch `tuandev2111/sec-52-figma-legal-error-and-account-screens-as-web-desktop-and` for review. Tracked in Linear as SEC-52; follows SEC-32 (the legal text), SEC-40 (the account tab) and SEC-29 (signing in).

The screens were redrawn in Figma first (`Secondbite`, page `Mobile · Khách`, sections "Pháp lý, lỗi, tài khoản · Web desktop 1440" and "Pháp lý, lỗi, tài khoản · Mobile app"). This change makes the code follow them, and makes the web's public pages findable and quotable by search engines and answer engines.

## What a person can do

- **Anyone, on the web**, reads the terms and the privacy policy under the same header as the seller screens: the wordmark back to the home and the language capsule, then a page heading, the draft notice and the text in white cards, with a contents list that jumps to each section. A search engine or an assistant finds each page in both languages, knows which one is the other's translation, and can quote a section by its heading.
- **Anyone, on the web**, who opens an address that does not exist or meets a failure sees the same header and a card with what happened and one way on: back to the home, or try again with a reference to report.
- **A customer, on the web**, opens the account tab under that header: who is signed in and sign-out, or a way to sign in, then the two legal pages.
- **A customer, in the app**, reads the terms and the privacy policy inside the app instead of a browser, from the account tab and from the sign-in screen's agreement line. An address the app does not know shows a not-found screen with the way home.
- **In the app**, every screen but the home has the blue top bar of Figma Mobile v3 (K5): the screen's name in white and a white round back button. Decided by the team on 20 October 2026; the web keeps the White Shell.

## Boundaries

No module, table or API operation changes. The web and the app read the same `GET /accounts/me` as before. The legal text stays in the catalogs: `web/messages/*.json` for the web and `mobile/lib/l10n/arb/*.arb` for the app, which keeps its own translations ([mobile guideline](../../../guidelines/mobile.md#data-session-and-language)). A test in `mobile/` fails when the app's copy of the legal text differs from the web's, so the two cannot drift.

## Search and answer engines (web)

What a crawler and an answer engine need, taken from the Next.js guides in `node_modules/next/dist/docs` (metadata, `sitemap.ts`, JSON-LD) and Google Search Central:

- **One public origin.** `SECONDBITE_SITE_ORIGIN` names it at build time, so canonical addresses, language alternates, Open Graph addresses and the sitemap are absolute. Until a production address is chosen it falls back to staging's, the only public host.
- **Per page metadata.** A title template (`%s · Second Bite`), a description of its own, `alternates.canonical` and `alternates.languages` for `vi`, `en` and `x-default`, and Open Graph with the locale and its alternate.
- **Structured data.** The layout describes the site (`WebSite`) and who runs it (`Organization`, no commission, Tasco Mall); the legal pages are `WebPage`s with their language, `dateModified`, a `BreadcrumbList` and their sections as named parts, so an answer engine can cite one. JSON-LD is escaped as the Next.js guide shows.
- **What is listed.** `sitemap.ts` lists the home and the two legal pages in both languages with their alternates. The account, sign-in, not-found and error pages carry `noindex`.
- **Semantic HTML.** One `h1` per page, a contents `nav` whose entries link to `section` ids, `<time datetime>` on the update date.
- **Robots stay closed.** `robots.ts` keeps disallowing everything until the production address exists (docs/runbooks/ci-cd.md); it now also names the sitemap, so opening it later is one line.

## Failure behavior

Unchanged: the error page shows Next's digest as the reference and retries; the account panel renders the signed-out card when the session has ended. A missing `SECONDBITE_SITE_ORIGIN` falls back to staging's origin rather than to `localhost`.

## Verification plan

- Web: `pnpm check`, `pnpm build`, the Playwright suites for the legal pages, the account tab and the language switch (phone and desktop, axe), plus checks of the canonical, alternate and JSON-LD tags; Lighthouse on the production build, and PageSpeed Insights on staging before the change as the baseline.
- Mobile: `flutter analyze` and `flutter test` in `mobile/` and `packages/app_ui`, widget tests for the legal screens, the not-found screen, the account tab and the top bar, and the drift test of the legal text.

## Open questions

- The production address, which decides `SECONDBITE_SITE_ORIGIN` and opens `robots.ts` (the team).
- Whether the legal pages should load their text from the server once the founder and a lawyer have approved it, instead of two catalogs (the founder).
