# Web guideline

How the web application in `web/` realizes the [conventions](../conventions.md). Design rules are in [DESIGN.md](../../DESIGN.md) and the [Figma guide](figma.md); what the product must do is in [PRODUCT.md](../../PRODUCT.md). Adapted from the Frontend section of BeyondPilot's `docs/conventions.md` (revision `173f8789`), keeping only what Second Bite has decided. The checklist that points into this page is [web/AGENTS.md](../../web/AGENTS.md).

## Stack

- Next.js 16 App Router with Cache Components, React 19, TypeScript 7 in strict mode, Tailwind CSS 4, shadcn/ui (`base-nova` style on Base UI primitives) and next-intl. Scaffolding comes from the official CLIs (`create-next-app`, `shadcn`).
- Every dependency is taken at its newest release; Dependabot proposes updates weekly. A dependency held back records why next to it and when it can move (see TypeScript 6 below).
- pnpm is installed directly, not through Corepack; `packageManager` in `web/package.json` records the version. `web/pnpm-workspace.yaml` denies install scripts unless a package is listed under `allowBuilds`.
- A library arrives with its first consumer, never ahead of it. TanStack Query arrives with the first screen that keeps server data in the browser; Testing Library and jsdom with the first component test.
- Linting is Oxlint only, with type-aware rules (tsgolint, on TypeScript 7) and `@shadcn/lint` as a JS plugin, as Reactive Resume and Rallly do. ESLint is not used: `typescript-eslint` does not support TypeScript 7.
- Hey API needs the TypeScript compiler API, which TypeScript 7 removed (hey-api/hey-api#4235). It runs in the `web/tools/openapi` workspace package on Microsoft's `@typescript/typescript6`, as VS Code, Grafana and AFFiNE do. Delete that package once Hey API supports TypeScript 7.

## Structure

- Every page lives under `src/app/[locale]/`, the root layout; there is no `src/app/layout.tsx`.
- `src/components/ui` holds shadcn primitives, which are our source code; `src/components` holds Second Bite's own components (`Band`, `OfferCard`, `TopBar`), built on those primitives.
- `src/lib/api` holds the generated client (`generated/`, never edited) and its configuration; `src/i18n` the locale routing; `src/styles/tokens.css` the design tokens; `messages/` the two catalogs.
- Pages are thin: metadata, one data read, then one page component.

## Data and the backend

- The browser calls the Go server as `/api/...` on the web's own origin. In development `next.config.ts` forwards it to `SECONDBITE_API_ORIGIN` (`web/.env.development`) without the prefix; when deployed, the reverse proxy does. Server code calls `SECONDBITE_API_ORIGIN` directly.
- Every call goes through the generated SDK. A failed call rejects with `ApiError` (`src/lib/api/client.ts`); code branches on `error.code` and shows a translated message, never the problem's own text. `error.requestId` is what a person reports.
- The web session is an httpOnly cookie set by the Go server (SEC-27); a token never sits in browser storage. Access is decided by the backend, never by what a screen shows.

## Internationalization

- Vietnamese and English on every page. Every address names its language (`/vi/…`, `/en/…`); `/` follows the locale cookie, then the device's language, then Vietnamese. The language icon switches the same page, and the cookie keeps the choice for a year.
- The locale comes from `next/root-params` in `src/i18n/request.ts`; pages do not call `setRequestLocale`.
- Every string a person reads is in both `messages/vi.json` and `messages/en.json`. `vi.json` is the reference for the types; `pnpm check:messages` fails on a key missing from one catalog or an empty message.
- Times are in `Asia/Ho_Chi_Minh`, prices in đồng (`39.000đ`), windows on the 24-hour clock.
- Links between pages use `Link` from `@/i18n/navigation`, which keeps the locale.

## Design tokens and styling

- Tokens are defined once, in the frontmatter of `DESIGN.md`. `pnpm generate:tokens` writes `src/styles/tokens.css`; never edit that file. The generator refuses a colour pair under 4.5:1 for text or 3:1 for an outline or focus ring, and `pnpm check:tokens` fails when the file falls behind.
- Components use semantic tokens only (`bg-primary`, `text-muted-foreground`, `rounded-xl`, `shadow-card`, `text-price`). Raw colours, inline styles, arbitrary values, unknown classes and dynamically built class names are lint errors outside `src/components/ui`, through `@shadcn/lint`. A value several components repeat becomes a token in DESIGN.md.
- A solid action darkens under the pointer, to its `*-hover` token, so its text keeps its contrast; a fill is never lightened by lowering its opacity.
- shadcn primitives are adapted to DESIGN.md in place (targets, hover, variants), with a short comment on each change. `shadcn init` or `shadcn add` writes its own palette, radius formula and fonts into `globals.css`; remove them, so DESIGN.md stays the only source.

## Components and accessibility

- Touch targets are at least 44 px; the default Button is 44 px high.
- Status is never carried by colour alone: it comes with an icon or a label.
- An icon-only control has an accessible name from the catalogs (`aria-label`).
- A link styled as a button is a `Link` with `buttonVariants`, never a `Button` wrapping an anchor.
- Icons come from `lucide-react` under their Lucide names, as in Figma.

## Quality gates

- `pnpm check` runs the token, message and API-client drift checks, Oxlint, Prettier, the type check (after `next typegen`) and the unit tests. CI runs it with `pnpm build`.
- Unit tests sit next to what they test as `*.test.ts` and run in Node with Vitest; they cover logic, such as the API client's failures.
- Browser tests live in `tests/e2e/` and run with Playwright against the production build, on a phone (Pixel 7) and a desktop browser. Each page a test opens is checked with `expectNoSeriousA11yViolations` (axe, WCAG 2.2 A and AA; no rule excluded). CI runs them in Microsoft's Playwright image, pinned by digest; bump it with `@playwright/test`.
- On Windows, `@swc/core` (pulled in by next-intl) refuses its native cache when the user profile lets another account modify it. Point `SWC_NATIVE_BINDING_CACHE` at a folder only you can write.
