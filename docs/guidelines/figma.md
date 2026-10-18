# Figma design guide

Code is the source of truth for Second Bite's interface: the tokens in [DESIGN.md](../../DESIGN.md) and the components and screens in the web application (`web/`, Next.js) and the mobile application (`mobile/`, Flutter). Figma is where the team visualises a screen and draws it quickly before building it; when Figma and the code disagree, the code wins and the frame is updated or marked out of date. Images generated during design exploration (the impeccable comps under `.impeccable/mocks/`) are evidence for a direction, never a specification. Adapted from BeyondPilot's Figma guide (`docs/guidelines/figma.md`, revision `3825fc73`), with a mirror for Flutter added.

The file is read and written through the Figwright MCP server (`figwright` in `.mcp.json`) and the `figma-build` and `figma-codegen` skills ([sources](../../.claude/skills/SOURCES.md)). Code rules stay canonical in [docs/conventions.md](../conventions.md); when this page and that file disagree, the conventions win.

## Setup

- Figma desktop with the Figwright plugin imported from the [latest release](https://github.com/awdr74100/figwright/releases/latest) (Plugins → Development → Import plugin from manifest). Keep the plugin version equal to the server version in `.mcp.json`; the plugin's Debug tab shows both.
- Open the plugin in the file before asking an agent to read or write it. `ping` reports whether a plugin is connected.
- On the Figma Starter plan a file has three pages; organise screens with sections, not pages.

## File structure

One file, `Second Bite — Product UI`.

| Page                       | Holds                                                                                                                                            |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Foundations & Components` | Variable collections, text styles, and one component set per code component                                                                      |
| `Screens`                  | One section per area (`Customer`, `Seller`, `Admin`, `Landing`); every app screen at 390 mobile and 1440 desktop width, the landing also at 1024 |

The third page stays free until a real need appears.

The file in use today is `Secondbite`, with the pages `Mobile · Khách` (the customer screens and the `Button` and `Bottom nav` components; the home follows the `Mobile v2` section), `Brand · 3 hướng` and `Brand`. Its one variable collection, `SecondBite`, holds the identity's primitives (`brand/50`–`brand/900`, `text/*`, `accent/amber`, `accent/lime-*`, `status/error*`, `logo/*`) rather than the semantic `Theme` and `Scale` collections described below. [DESIGN.md](../../DESIGN.md) mirrors it as its `palette`, under the same names (`brand/800` is `brand-800`), and its colour roles take palette colours; its text styles are named after the Figma ones (`Tiêu đề/H1 28` is `h1-28`).

## Tokens

- Every fill, stroke, radius, gap and padding is bound to a variable. A literal colour or spacing value on a screen is a defect.
- Collection `Theme` holds the semantic roles with their light values; collection `Theme/Dark` holds the same names with dark values (the Starter plan allows one mode per collection). Names are semantic (`background`, `foreground`, `primary`, `primary-foreground`, `muted`, `muted-foreground`, `border`, `card`, `accent`, `destructive`, `success`, `warning`, …), never a colour's name.
- Tokens are defined once, in the frontmatter of [DESIGN.md](../../DESIGN.md) (the written design system that design agents read). The web's `web/src/styles/tokens.css` (CSS custom properties) and the Flutter theme (`ThemeExtension` fields in `mobile/`) follow it with the same names, and the Figma variables mirror it. A token changes in DESIGN.md, the web and the Flutter theme in one change; Figma is updated after.
- Each `Theme` variable sets its WEB code syntax to its CSS custom property (`var(--primary)`), so code generation emits the token.
- Collection `Scale` holds radius and spacing on the 4 px scale (`space/1` = 4 px, `space/2` = 8 px, …).
- Text styles are named after the utilities they produce (`text-sm/font-medium`), and use the product's chosen typeface, which must cover Vietnamese diacritics.
- Paint that no variable can express (a photograph's scrim, the bitten corner) is a named paint or component (`góc bị cắn`), never a literal fill on a screen.

## Components

- A Figma component exists only for a component that exists, or is being added, in code. Its name is the code component's name, and its variant properties are the component's props with the same names and values.
- Interaction states (`hover`, `focus-visible`, `disabled`, `pending`, `invalid`) are a `state` property for review only; code derives them.
- Screens use instances only. A detached instance becomes regenerated markup.
- Confirmed Figma-to-code pairs are recorded in `docs/figma-component-map.md` once the first components exist.

## Layout

- Every frame uses auto layout; Fill for content that stretches, Hug for controls, fixed sizes only for icons, avatars and media.
- Layers are named by meaning (`OfferCard`, `Sticker`), never `Frame 12`.
- Mobile (390) is the source frame for app screens; desktop is derived from it. The landing is designed at 1440 first.
- Touch targets are at least 44 px, even when drawn smaller.

## Content, icons and media

- Icons come from the Lucide set with their Lucide names, so they map to `lucide-react` on the web; Flutter uses the same glyphs.
- Photographs are image fills, never redrawn vectors. Sample content uses real sellers' kinds of food, prices in đồng (`40.000đ`) and collection windows in 24-hour time; it is labelled as sample until the pilot has real sellers.
- Text in the file is sample copy; the applications read their message catalogs. Design with Vietnamese copy, which runs 20–30% longer than English: text layers hug or fill and never have a fixed width. Check stacked diacritics (Ầ, Ẫ, Ổ) in buttons and badges.
- Status always comes with an icon or label, never colour alone.

## From design to code

1. Sketch a new screen in Figma from the existing components to agree on its layout and content; a sketch is not a specification.
2. Build the screen in code, one section at a time; code generated from a frame is a starting point and follows the web rules (semantic tokens only, every string in both catalogs) or, for Flutter, the theme extension and its own catalogs.
3. Review the running screen, not the frame: in the browser (Playwright with axe) and on a device or emulator.
4. When the code settles a decision the frame does not show, update the frame or mark it out of date.
