# Web guideline

How the web application in `web/` realizes the [conventions](../conventions.md). Design rules are in [DESIGN.md](../../DESIGN.md) and the [Figma guide](figma.md); what the product must do is in [PRODUCT.md](../../PRODUCT.md). Adapted from the Frontend section of BeyondPilot's `docs/conventions.md` (revision `173f8789`), keeping only what Second Bite has decided. The checklist that points into this page is [web/AGENTS.md](../../web/AGENTS.md).

## Stack

- Next.js 16 App Router with Cache Components and the React Compiler, React 19, TypeScript 7 in strict mode, Tailwind CSS 4, shadcn/ui (`base-nova` style on Base UI primitives) and next-intl. Scaffolding comes from the official CLIs (`create-next-app`, `shadcn`).
- Every dependency is taken at its newest release; Dependabot proposes updates weekly. A dependency held back records why next to it and when it can move (see TypeScript 6 below).
- pnpm is installed directly, not through Corepack; `packageManager` in `web/package.json` records the version. `web/pnpm-workspace.yaml` denies install scripts unless a package is listed under `allowBuilds`.
- A library arrives with its first consumer, never ahead of it, with one exception: every shadcn primitive is installed in `src/components/ui`, with the libraries they need (Embla, Recharts, cmdk, react-day-picker, react-resizable-panels), decided by the tech lead on 19 October 2026 so screens and the Figma components draw from one complete set (SEC-40). Each was adapted as the others were: the repo's `cn`, DESIGN.md's type roles, and jsx-a11y; Shiki and its highlighter were left out, as nothing shows code. TanStack Query arrives with the first screen that keeps server data in the browser; Testing Library and jsdom with the first component test.
- Linting is Oxlint only, with type-aware rules (tsgolint, on TypeScript 7) and `@shadcn/lint` as a JS plugin, as Reactive Resume and Rallly do. ESLint is not used: `typescript-eslint` does not support TypeScript 7.
- Hey API needs the TypeScript compiler API, which TypeScript 7 removed (hey-api/hey-api#4235). It runs in the `web/tools/openapi` workspace package on Microsoft's `@typescript/typescript6`, as VS Code, Grafana and AFFiNE do. Delete that package once Hey API supports TypeScript 7.

## Structure

- Every page lives under `src/app/[locale]/`, the root layout; there is no `src/app/layout.tsx`.
- `src/components/ui` holds shadcn primitives, which are our source code; `src/components` holds Second Bite's own components shared across areas (`AppHeader`, `ScrollRow`, `BiteCorner`), built on those primitives; a shadcn primitive gains a Second Bite variant in its own file (`Badge` `fresh` and `discount`, `Avatar` `seller`) rather than being restyled where it is used, which `@shadcn/lint` enforces.
- `src/lib/api` holds the generated client (`generated/`, never edited) and its configuration; `src/i18n` the locale routing; `src/styles/tokens.css` the design tokens; `messages/` the two catalogs.
- `src/features/<area>` holds what one area of the product needs: its components, its reads from the API and their tests (`features/offers`, `features/home`).
- Pages are thin: metadata, one data read, then one page component.

## Data and the backend

- The browser calls the Go server as `/api/...` on the web's own origin. In development `next.config.ts` forwards it to `SECONDBITE_API_ORIGIN` (`web/.env.development`) without the prefix; when deployed, the reverse proxy does. Server code calls `SECONDBITE_API_ORIGIN` directly.
- Every call goes through the generated SDK. A failed call rejects with `ApiError` (`src/lib/api/client.ts`); code branches on `error.code` only where the screen does something different, such as showing the failure at a field. `error.requestId` is what a person reports.
- The words for a failure are the Go server's, not the web's: the web and the Flutter app call the same API, and one place keeps a code's words in step for both (decided 18 October 2026; Mattermost and Karrot translate on the server too). The client sends the page's locale as `Accept-Language`, from the browser and from the server, and a screen shows `error.detail` (`failureOf` in `src/lib/api/client.ts`), followed by the reference for a failure it does not expect; its own sentence is for a request that got no answer. The catalogs word no failure code (SEC-28). The error boundary receives only Next's `digest`, so it keeps its own words.
- The web session is an httpOnly cookie set by the Go server (SEC-27); a token never sits in browser storage. Access is decided by the backend, never by what a screen shows.

## Errors and logging

- `src/app/[locale]/error.tsx` shows safe words, Next's `digest` as the reference a person reports, and `retry()`, which fetches the page's data again. `src/app/global-error.tsx` replaces the root layout when it fails; it has no translations, so its words are written inline in both languages.
- `src/instrumentation.ts` logs every server rendering error as one line of JSON (`event` `web.render.failed`, the error's type, its `digest` and the route pattern), never the error's text, the query string or headers, and with no third-party service.

## Internationalization

- Vietnamese and English on every page. Every address names its language (`/vi/…`, `/en/…`); `/` follows the locale cookie, then the device's language, then Vietnamese. The language icon switches the same page, and the cookie keeps the choice for a year.
- The locale comes from `next/root-params` in `src/i18n/request.ts`; pages do not call `setRequestLocale`.
- Every string a person reads is in both `messages/vi.json` and `messages/en.json`. `vi.json` is the reference for the types; `pnpm check:messages` fails on a key missing from one catalog or an empty message.
- Times are in `Asia/Ho_Chi_Minh`, prices in đồng (`39.000đ`), windows on the 24-hour clock. A date is formatted by a named format of `src/i18n/formats.ts` (`format.dateTime(at, "time")`), never by options written on a page.
- Links between pages use `Link` from `@/i18n/navigation`, which keeps the locale.

## Search and answer engines

- Every page's metadata comes from `pageMetadata` (`src/lib/seo.ts`): its title, which the layout's template ends in "· Second Bite", its description, its canonical address and the same page in the other language with `x-default` the Vietnamese one, and Open Graph. A page that is someone's own or passing (account, sign-in, errors) passes `index: false` and gets `noindex` instead.
- Absolute addresses are built on `SECONDBITE_SITE_ORIGIN`, read at build time; until the production address exists it falls back to staging's.
- Structured data is JSON-LD through `JsonLd` (`src/components/json-ld.tsx`), escaped as the Next.js guide shows. The layout describes the `Organization` and the `WebSite`; a page adds what it is, as the legal pages add a `WebPage` with its sections as parts an answer engine can cite.
- A page with sections gives each a heading and an `id`, lists them in a contents `nav`, and marks dates with `<time datetime>`.
- `src/app/sitemap.ts` lists the public pages in both languages with their alternates; `src/app/robots.ts` names it and keeps crawlers out until the production address is chosen.
- Measure with Lighthouse, the engine of PageSpeed Insights, on the production build and on staging (docs/increments/completed/sec-52-legal-error-account-screens/verification.md shows how).

## Design tokens and styling

- Tokens are defined once, in the frontmatter of `DESIGN.md`. `pnpm generate:tokens` writes `src/styles/tokens.css`; never edit that file. The generator refuses a colour pair under 4.5:1 for text or 3:1 for an outline or focus ring, and `pnpm check:tokens` fails when the file falls behind.
- Components use semantic tokens only (`bg-primary`, `text-muted-foreground`, `rounded-2xl`, `text-price`); the palette under them (`--brand-800`) is for DESIGN.md's roles, never for a screen. Raw colours, inline styles, arbitrary values, unknown classes and dynamically built class names are lint errors outside `src/components/ui`, through `@shadcn/lint`. A value several components repeat becomes a token in DESIGN.md.
- A solid action darkens under the pointer, to its `*-hover` token, so its text keeps its contrast; a fill is never lightened by lowering its opacity.
- shadcn primitives are adapted to DESIGN.md in place (targets, hover, variants), with a short comment on each change. `shadcn init` or `shadcn add` writes its own palette, radius formula and fonts into `globals.css`; remove them, so DESIGN.md stays the only source.

## Components and accessibility

- Touch targets are at least 44 px; the default Button is 44 px high.
- Status is never carried by colour alone: it comes with an icon or a label.
- An icon-only control has an accessible name from the catalogs (`aria-label`).
- A link styled as a button is a `Link` with `buttonVariants`, never a `Button` wrapping an anchor.
- Icons come from `lucide-react` under their Lucide names, as in Figma.
- Maps (SEC-66) are `src/components/map`: MapLibre through `react-map-gl/maplibre`, loaded with `next/dynamic` and `ssr: false` where a map is shown, never in a page's first bundle. The style is Protomaps' light flavor with Vietnamese names, read from `/map/` on the site's own origin; nothing calls a map service. The map is held to Hanoi's box (`maxBounds`, `minZoom`), the server's served area, so it never shows the sea, Hoàng Sa or Trường Sa. A map is not a primitive's restyle: its colours come from its style, not from tokens. A text field with suggestions is `Autocomplete` (`src/components/ui/autocomplete.tsx`, Base UI's), its list drawn as the combobox's; a store's address is `AddressInput`. A place in a form is `LocationField` inside `form.AppField`, taking its ids and validity from `useFieldValidity` like any composed control. Leaflet was left out: it draws raster tiles, and vector tiles only through plugins.

## Forms

Adapted from the Forms section of BeyondPilot's `docs/conventions.md` (revision `5fd043a8`) and its `src/components/form`, with Second Bite's rule that the server words a failure (SEC-106).

- Every form that sends data to the server is built with `useAppForm` (`src/components/form/app-form.ts`), on TanStack Form, whether it has one field or many. Its rules are a zod schema under `validationLogic: revalidateLogic()` and `validators: { onDynamic: schema }`, never checks written by hand or the native `required`.
- The element is `<form id={form.formId} noValidate>`. A refused submit moves the focus to the first field in error and brings it into view; `useAppForm` does it for every form.
- Text fields are `form.AppField` with `field.TextField` or `field.TextareaField`. The submit is `form.SubmitButton`: it shows a spinner and takes no second press while the form is sent. A control the set lacks (a choice of chips, a photo, a number, a toggle group) is composed from the `field` parts inside `form.AppField`, with `useFieldValidity` for its ids, `data-invalid` and `aria-invalid`.
- A refusal from the server goes through `refuse(formApi, error, fieldOfCode)`. Each refused member (`errors[].pointer`) lands under its field, and a code the screen ties to a field lands there too. What no field can say, a request that got no answer included, shows above the buttons in `form.FormError`, with the server's sentence and its reference. The screen never words a failure code itself.
- A form in several steps is one form holding every step's values, with a zod schema per step. Fields that several forms draw the same way are a field group (`withFieldGroup`), added to the kit with the first form that needs it.
- Not a form: a search box and list filters (they are the address, below), and a switch or a button that acts at once. The emailed code is a form field (`CodeField` in `src/features/identity/code-field.tsx`), whose sixth digit submits the sign-in form.

## Data from outside

The idea is anti-slop's ([dmmulroy/anti-slop](https://github.com/dmmulroy/anti-slop), studied in Comp AI's CRM): text from outside is parsed into a typed value once, where it arrives, so no file checks a shape by hand with `typeof`.

- A value kept in browser storage is `stored(key, schema, fallback)` from `src/lib/stored.ts`, its schema in zod. It reads the fallback when storage is blocked, empty or holds something the schema refuses, and on the server and before hydration; another tab's change arrives through the `storage` event. zod and React's `useSyncExternalStore` already do the work, so no storage library is added.
- Other JSON text from outside (a cookie, a token's claims) goes through `parseJson(text, schema)` from `src/lib/json.ts`.
- Two rules of the repository's Oxlint plugin (`web/tools/oxlint/second-bite.mjs`) hold this: `no-raw-storage` and `no-raw-json-parse`. JSON that a module wrote itself and reads back is not from outside; the line says so beside an `oxlint-disable-next-line`.
- Responses from the Go server are typed by the client generated from `api/openapi.yaml` and are not parsed again; `check:api` keeps the client in step with the contract.

## Lists and filters

- A list's search, filters, sort and page are the address, written with nuqs: a `search-params.ts` beside the list declares the parsers, the server page reads them with `createLoader`, and the client changes them with `useQueryStates(parsers, { shallow: false, startTransition })`, so the server reads the list again. A value at its default stays out of the address; changing the search or a filter returns to page 1; a search waits 300 ms after the last keystroke (`limitUrlUpdates: debounce(300)`).
- A filter that is a link, a chip or a tab the server draws, is built with `createSerializer` from the same parsers, so it works before the page's script has loaded and reads the address as the list does. A rule across several keys (a range in order, a radius only around a place) is one small step after the loader, not a second reader of the address.
- A value whose default the server knows only at request time (today) has no default in its parser: the page reads `value ?? today`, and a link to that default leaves the key out.
- The server filters, sorts and pages. A list is not read whole to be filtered in the browser.
- A table of rows is `DataTable` (`src/features/admin/data-table.tsx`) with `SortHeader` and `ListFooter`; rows on a phone that are cards are drawn as a list. A row's actions are a "⋯" menu at its end (`account-row-menu.tsx` is the pattern), and the one action the row waits for may sit beside it as a labelled button.
- `NuqsAdapter` is mounted once, in the root layout.

## Feedback

- What an action did is said in a toast from `@/components/ui/toast` (`toast.add({ type, title, description })`); the one `Toaster` is in the root layout. An undo is the toast's action. No screen builds its own toast from state and a timer.
- A failed request shown in place, above a form or under an action, is `FailureAlert` (`src/components/failure-alert.tsx`) with `failureOf(error)`: the server's sentence, or the screen's fallback when no answer came, then the reference. A `catch` that drops a failure says why in a comment; otherwise the person is told.
- A confirmation is the registry `alert-dialog`, opened controlled (`open`, `onOpenChange`) so it closes once the action succeeds.

## Shared parts

- Before writing markup, look for the primitive: a card is `Card`, an empty list or page is `Empty`, a status is `Badge` with a variant, a loading block is `Skeleton`, a rule is `Separator`, a message in place is `Alert`, a link drawn as a button is `Link` with `buttonVariants`. A look the primitive lacks becomes a variant in its own file, never a colour or type class where it is used.
- A photo the backend serves is `photoUrl(path)` (`src/lib/api/photo.ts`), never an address written by hand.
- A price is `formatPrice` (`src/features/offers/format.ts`); a date, a time or a number is a named format of `src/i18n/formats.ts` (`dayMonth`, `calendarDay`, `oneDecimal`…), added there when a screen needs a new one.
- A helper or a component a second feature needs moves to `src/components` or the feature that owns it, and the copy is deleted.

## The admin

- Admin pages live under `src/app/[locale]/admin/` and their parts under `src/features/admin*`. Each page starts with `requireAdmin(returnTo)` (`src/features/identity/current-account.ts`): someone signed out signs in first, anyone else gets the site's not-found page. The layout only draws the frame for an admin; hiding a link is never the protection, the server's `/admin` group is (backend guideline).
- The sidebar lists only screens that exist. An admin address no page answers shows the admin's not-found page (`admin/[...slug]`); no screen runs on made-up data.
- Admins are one role with the same session as everyone. They are granted and revoked in Cài đặt › Quản trị viên or by `secondbite admin grant|revoke` ([backend runbook](../runbooks/backend.md#administrative-commands)); nobody revokes themselves or the last admin (SEC-75).

## Building and serving

- `web/Dockerfile` builds the standalone output (`output: "standalone"`) on `node:24-slim`, pinned by digest and kept current by Dependabot, and runs it as the `node` user on port 3000. The image is built from `web/` alone: the API client and `tokens.css` are committed. `SECONDBITE_API_ORIGIN` is set where it runs; the reverse proxy in front routes `/api` to the Go server.
- `next.config.ts` sets the baseline security headers on every page: `nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy` and a `Permissions-Policy` that leaves only location to this site. A Content Security Policy with nonces is a decision of its own.

## Quality gates

- `pnpm check` runs the token, message and API-client checks, Oxlint, Prettier, the type check (after `next typegen`), the unit tests and knip, which fails on a file, export or dependency nothing uses. CI runs it with `pnpm build`, and builds the image.
- Unit tests sit next to what they test as `*.test.ts` and run in Node with Vitest; they cover logic, such as the API client's failures.
- Browser tests live in `tests/e2e/` and run with Playwright against the production build and a stub backend (`tests/e2e/stub-backend.mjs`, also `pnpm stub:backend` for working on a screen whose endpoint is not built), on a phone (Pixel 7) and a desktop browser. Each page a test opens is checked with `expectNoSeriousA11yViolations` (axe, WCAG 2.2 A and AA; no rule excluded). A test waits for `hydrated()` before it presses or types into an element, since the server's HTML takes a press without doing anything until React has hydrated it. CI runs them in Microsoft's Playwright image, pinned by digest; bump it with `@playwright/test`.
- On Windows, `@swc/core` (pulled in by next-intl) refuses its native cache when the user profile lets another account modify it. Point `SWC_NATIVE_BINDING_CACHE` at a folder only you can write. knip runs with `KNIP_DISABLE_RAW_TRANSFER=1` (pnpm's `shellEmulator` makes that work on Windows), because oxc-parser's raw transfer reserves a buffer of several GB that a machine short of memory refuses.
