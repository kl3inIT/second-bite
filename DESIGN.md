---
name: Second Bite
description: A second chance for good food.
palette:
  # The Figma variables of the `SecondBite` collection, one for one: `brand/800` in Figma is `brand-800` here and
  # `--brand-800` in tokens.css. Change a value in Figma and here together; screens never use these directly.
  # Since 19 October 2026 the brand is Tasco Mall's blue: in Figma `brand/*` alias the `tasco/*` primitives.
  brand-900: "#004E8C"
  brand-800: "#0061AF"
  brand-700: "#1A88C9"
  brand-500: "#3CB4E7"
  brand-300: "#9EDAF3"
  brand-200: "#B1E1F5"
  brand-100: "#D8F0FA"
  brand-50: "#EEF8FD"
  base-white: "#FFFFFF"
  text-ink: "#0E1D19"
  text-ink-2: "#30423D"
  text-muted: "#5A6B66"
  text-faint: "#7D8C87"
  text-on-brand: "#D8F0FA"
  border-line: "#E0E8E4"
  accent-amber: "#F5CF5C"
  accent-amber-ink: "#4A3600"
  rating-star: "#D99A12"
  alert-bg: "#FFF6E5"
  alert-line: "#F0DBA8"
  alert-ink: "#5E4200"
  logo-clay: "#A4512A"
  logo-rose: "#B03B4E"
  logo-indigo: "#3A4F9A"
  logo-olive: "#5E6B1F"
  accent-lime-500: "#8DC63F"
  accent-lime-300: "#C6E67A"
  accent-lime-100: "#EEF7D9"
  accent-lime-ink: "#2C4709"
  status-success: "#2E6B3F"
  status-error: "#B42318"
  status-error-bg: "#FEF3F2"
colors:
  # The roles screens use, each taking a palette colour. Every `x` with an `x-foreground` is checked at 4.5:1 or
  # more by web/scripts/generate-tokens.mjs, and so is each `x-hover` against `x-foreground`; the ratios noted
  # are the foreground on the colour.
  background: "{palette.brand-50}" # the pale sky ground; ink on it 16.2:1
  foreground: "{palette.text-ink}"
  card: "{palette.base-white}"
  card-foreground: "{palette.text-ink}"
  popover: "{palette.base-white}" # menus, selects and dialogs
  popover-foreground: "{palette.text-ink}"
  primary: "{palette.brand-800}" # Tasco blue, 6.3:1
  primary-foreground: "{palette.base-white}"
  primary-hover: "{palette.brand-900}" # darker under the pointer so the text gains contrast, 8.5:1
  inverse-muted: "{palette.text-on-brand}" # secondary text on Tasco blue or a dark photo scrim, 5.3:1 on primary
  shell: "{palette.base-white}" # the web's top bar of every screen but the home: white with a hairline below
  shell-foreground: "{palette.text-ink}"
  sky: "{palette.brand-500}" # the sign-in screen's side panel, Figma L6; white on it is 2.4:1, so only large decorative type goes there, never text a person must read
  header: "{palette.brand-800}" # the home's header, under the light sweep; Figma v3's sky #3CB4E7 held white at 2.4:1
  header-foreground: "{palette.base-white}" # the place on the header, 6.3:1
  header-raised: "{palette.base-white}" # the capsule and the search field on the header
  header-raised-foreground: "{palette.text-ink}"
  header-border: "{palette.border-line}" # the capsule's edge
  sweep: "#1C77BB" # the sweep across the header's top right: brand-300 at 18% over the header
  sweep-edge: "#4395CC" # the brighter band at its edge: brand-300 at 30% more
  deal: "{palette.brand-900}" # the deal card on the header, a step deeper than it
  deal-foreground: "{palette.base-white}" # 8.5:1; the title and figures are in `fresh`, 6.1:1
  secondary: "{palette.brand-100}" # soft buttons, segmented controls, the active tab
  secondary-foreground: "{palette.brand-900}" # 7.2:1, and 6.1:1 on the hover
  secondary-hover: "{palette.brand-200}"
  muted: "{palette.brand-50}"
  muted-foreground: "{palette.text-muted}" # 5.6:1 on white, 5.2:1 on the ground
  accent: "{palette.brand-100}"
  accent-foreground: "{palette.brand-800}"
  link: "{palette.brand-800}" # text links and secondary actions ("Đổi", "Chỉ đường"), 6.3:1 on white, 5.9:1 on the ground
  fresh: "{palette.accent-lime-300}" # young rice: the pin on the header and the deal card's title and figures
  fresh-foreground: "{palette.accent-lime-ink}" # 7.4:1
  fresh-muted: "{palette.accent-lime-100}" # a quiet lime surface, such as the pickup place on a seller's draft
  rating: "{palette.rating-star}" # the star beside a rating, always next to the figure
  sale: "{palette.status-error}" # the portions left on a card and a ticket's discount, always in words, 6.6:1 on white
  destructive: "{palette.status-error}" # errors, cancelled and refused states, 6.6:1
  destructive-foreground: "{palette.base-white}"
  destructive-hover: "#912018" # 8.7:1
  success: "{palette.status-success}" # paid, ready, collected; always with an icon or label, 7.6:1
  success-foreground: "{palette.base-white}"
  warning: "{palette.alert-bg}" # allergens and waiting states; always with an icon
  warning-foreground: "{palette.alert-ink}" # 8.5:1
  warning-border: "{palette.alert-line}" # the edge of a notice
  border: "{palette.border-line}"
  input: "{palette.text-faint}" # a field edge, 3.6:1 on white (3:1 needed for a control); never text
  ring: "{palette.brand-800}" # focus ring, 6.3:1 on white
  avatar-foreground: "{palette.base-white}" # initials of a seller without a photo; each avatar-* is checked against it
  avatar-clay: "{palette.logo-clay}" # 5.8:1
  avatar-rose: "{palette.logo-rose}" # 5.9:1
  avatar-indigo: "{palette.logo-indigo}" # 7.6:1
  avatar-olive: "{palette.logo-olive}" # 6.0:1
  sidebar: "{palette.brand-800}" # the admin sidebar (SEC-62); white on it 6.3:1
  sidebar-foreground: "{palette.base-white}"
  sidebar-primary: "{palette.base-white}" # the open item, a white pill
  sidebar-primary-foreground: "{palette.brand-800}" # 6.3:1
  sidebar-accent: "{palette.brand-900}" # an item under the pointer
  sidebar-accent-foreground: "{palette.base-white}" # 8.5:1
  sidebar-border: "{palette.brand-900}"
  sidebar-ring: "{palette.base-white}" # focus ring on the sidebar, 6.3:1
typography:
  # Eighteen roles, normalised on 19 October 2026 from the 45 size, weight and leading combinations the Figma
  # "Mobile v2" frames used (SEC-22). Named by purpose, not size; each has a Figma text style of the same name.
  # Be Vietnam Pro (`font-sans`) for everything people read; Bricolage Grotesque (`font-display`) only for
  # prices and figures, tracked -1%. Nothing is set below 12px.
  label: # times, ratings, helper and legal lines, tab labels
    fontFamily: "Be Vietnam Pro"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "17px"
  label-strong: # stock and status chips, the active tab, counters, initials
    fontFamily: "Be Vietnam Pro"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: "17px"
  body-sm: # supporting lines, item details, messages
    fontFamily: "Be Vietnam Pro"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "21px"
  body-sm-strong: # names in lists, small actions ("Đổi", "Xem tất cả")
    fontFamily: "Be Vietnam Pro"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: "21px"
  body: # running text and input values
    fontFamily: "Be Vietnam Pro"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
  title: # field labels, block titles, the place on the header
    fontFamily: "Be Vietnam Pro"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: "21px"
  title-lg: # the dish on a large card
    fontFamily: "Be Vietnam Pro"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: "22px"
  card-title: # the heading of a card on the seller's screens, and of the open-store form
    fontFamily: "Be Vietnam Pro"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: "25px"
  note: # a hint under a field, and what a photo box says under its call
    fontFamily: "Be Vietnam Pro"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: "19px"
  button: # button labels
    fontFamily: "Be Vietnam Pro"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: "20px"
  bar-title: # the title in the top bar
    fontFamily: "Be Vietnam Pro"
    fontSize: "17px"
    fontWeight: 600
    lineHeight: "22px"
  headline: # section and sheet titles, a page's heading; 20/28 bold since Mobile v3
    fontFamily: "Be Vietnam Pro"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: "28px"
  page-title: # the heading of a form page, such as the sign-in screen's
    fontFamily: "Be Vietnam Pro"
    fontSize: "28px"
    fontWeight: 600
    lineHeight: "36px"
  hero: # the headline of a panel that carries no other content, such as the sign-in screen's on a wide screen
    fontFamily: "Be Vietnam Pro"
    fontSize: "44px"
    fontWeight: 700
    lineHeight: "54px"
  figure-sm: # small figures on lime: the discount badge, the steps' numbers
    fontFamily: "Bricolage Grotesque"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: "16px"
    letterSpacing: "-0.01em"
  price: # the price on a card
    fontFamily: "Bricolage Grotesque"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: "18px"
    letterSpacing: "-0.01em"
  price-lg: # the price on a large card and at checkout, totals, the digits of the sign-in code; 20/24 since Mobile v3
    fontFamily: "Bricolage Grotesque"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: "24px"
    letterSpacing: "-0.01em"
  display: # big figures only: the pickup code, the best discount tonight
    fontFamily: "Bricolage Grotesque"
    fontSize: "36px"
    fontWeight: 700
    lineHeight: "40px"
    letterSpacing: "-0.01em"
rounded:
  # Named like Tailwind and shadcn: `lg` is the base radius shadcn's controls use. No other radius is used; in
  # Figma each is a `radius/*` variable of the `Scale` collection, bound on every frame.
  sm: "8px" # small badges
  md: "12px" # photo thumbnails, small tiles
  lg: "14px" # inputs, segmented controls
  xl: "16px"
  2xl: "20px" # cards, the deal card, sheets and list rows
  3xl: "24px" # the bottom edge of the header, a sheet's top corners
  4xl: "32px"
  full: "9999px" # buttons, the search field, the bottom bar, pills, chips, avatars, icon buttons
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "6": "24px"
  "8": "32px"
elevation:
  # Cards are flat on the sky ground; only what floats over content, a sheet, a dialog or the bottom bar, casts a shadow.
  sheet:
    - { x: 0, y: -4, blur: 24, spread: 0, color: "#0E1D191F" }
  nav: # the floating bottom bar (Figma Bottom nav, 105:2515)
    - { x: 0, y: 8, blur: 24, spread: 0, color: "#05122924" }
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    height: "52px"
    padding: "0 24px"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    height: "52px"
    padding: "0 24px"
  deal-label:
    backgroundColor: "{colors.deal}"
    textColor: "{colors.deal-foreground}"
    typography: "{typography.label-strong}"
    padding: "4px 10px"
  offer-card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.xl}"
    padding: "10px 14px 12px"
  dish-card:
    width: "132px"
    rounded: "{rounded.lg}"
  bottom-nav:
    height: "64px"
    rounded: "{rounded.full}"
---

<!-- This frontmatter is the source of the tokens. web/src/styles/tokens.css and the Flutter theme follow it with the same names in the same change; the Figma file "Secondbite" holds the same values as the `SecondBite` variables and text styles (docs/guidelines/figma.md). Changed to the Figma identity on 18 October 2026, replacing "Gói mang về"; turned from green to Tasco Mall's blue on 19 October 2026 after Figma "Mobile v3" (SEC-48). -->

# Design System: Second Bite

## Overview

**Creative North Star: "Miếng cắn thứ hai" (the second bite)**

Good food that someone has already started to love: a cookie with a bite taken out of it. The bite is the brand's mark, in the "o" of the wordmark and on the top right corner of every card, cut out in the colour of the ground as if the food had been tasted.

The interface opens on a Tasco blue header crossed by a light sweep, over a pale sky ground, with white cards that carry real photographs of the food. One blue label on each photograph gives the discount, and red words under it say how many portions are left. Dense enough for one-handed use at the end of a shift, generous with photographs so food looks like food.

**Key Characteristics:**

- Tasco blue header under a light sweep, holding the place, the search, the language and tonight's deal card on a deeper blue.
- Pale sky ground, white cards with a bitten top right corner.
- A Deal Blue discount label on the photograph and the portions left in red words; lime for the figures on blue; amber only in alerts.
- Real photographs of the food, never illustrations.
- Price hierarchy by size and face: new price in Bricolage, old price small and struck through, and the discount as the label on the photograph.

## Colors

A blue family from Tasco Mall's deep blue to a pale sky, a fresh lime for stock, discounts and the figures on blue, amber only for alerts, and ink text. The blues are Tasco Mall's own (tascomall.com), so the app reads as part of the mall.

Two layers, as in Figma. The **palette** is the `SecondBite` collection under the same names (`brand-50` to `brand-900`, `text-ink`, `accent-amber`, `logo-clay`…), and only the roles refer to it. The **roles** below (`primary`, `header`, `fresh`…) are what screens use, so a role can move to another palette colour without touching a screen.

### Primary

- **Tasco Blue** (`primary`): primary buttons, prices, links and the focus ring. `primary-hover` is the pressed, deeper blue.
- **Blue Header** (`header`, `header-foreground`): the home's header, the same blue as `primary`, with the place in white, a lime pin and the district in `inverse-muted`. **Light Sweep** (`sweep`, `sweep-edge`) crosses its top right: Figma draws it as `brand-300` at 18% and 30% over the header, written here as the solid colours that makes. Figma v3 had a sky header (`brand-500`), but white on it reaches only 2.4:1.
- **Deal Blue** (`deal`, `deal-foreground`): the deal card on the header, one step deeper than it so it stands apart.
- **Raised** (`header-raised`, `header-border`): the white capsule and search field on the header.
- **White Shell** (`shell`, `shell-foreground`): on the web, the top bar of every other screen, white with a hairline below, and the bottom bar. In the app, every screen but the home has the Blue Header's colours instead, its name in `header-foreground` and the back button a `header-raised` disc with the arrow in `primary`, as Figma Mobile v3 draws it (K5); decided by the team on 20 October 2026 (SEC-52).
- **Soft on Blue** (`inverse-muted`): secondary text on Tasco blue, the deal card or a dark photo scrim.
- **Blue Link** (`link`): text links and secondary actions, on white or the ground. Figma v3 uses `brand-700`, which reaches only 3.9:1 on white, so links take `brand-800`.

### Secondary

- **Blue Wash** (`secondary`, `accent`): soft buttons, segmented controls, the active tab indicator and quiet controls. Text on it is Tasco blue, and the deepest blue on a soft button.

### Fresh

- **Lime** (`fresh`, `fresh-foreground`): the pin on the header and the deal card's title and figures. `fresh-muted` is its quiet surface, with lime ink text.
- **Sale Red** (`sale`): the portions left on a card ("Còn 2 phần") and a ticket's discount on the deal card, always as words or figures, never as a dot or a fill.
- **Star** (`rating`): the star beside a rating, never on its own.

### Neutral

- **Sky Ground** (`background`, `muted`): the page under the cards. The bite of each card is cut in this colour.
- **White** (`card`): cards, sheets, the search field, dialogs.
- **Ink** (`foreground`): body text and labels under pictures.
- **Muted** (`muted-foreground`): secondary text, old prices and placeholders.
- **Line** (`border`): hairlines and dividers.
- **Field Edge** (`input`): input outlines, 3.6:1 against white; never text, placeholders included.
- **Seller avatars** (`avatar-clay`, `avatar-rose`, `avatar-indigo`, `avatar-olive`): a seller without a photo gets their initials on one of these, chosen from the seller's id so it never changes; a seller's photo replaces them.

### Status

- **Stamp Red** (`destructive`): errors, cancelled and refused states, always with an icon or label.
- **Leaf Stamp** (`success`): paid, ready and collected orders, always with an icon or label.
- **Alert** (`warning`, `warning-border`): allergens, waiting states and notices to read before going on, a pale amber box with amber ink, its edge and an icon.

### Named Rules

**The One Label Rule.** A card's photograph carries one label, at its top left in Deal Blue: the discount ("Giảm 55%"). How many portions are left is written under the photograph in Sale Red, as words ("Còn 2 phần"), never as a colour alone. Taken from Figma Mobile v3 with the owner on 20 October 2026, in place of the lime stock sticker (SEC-49).

**The One Discount Rule.** On a card the discount is the Deal Blue label; on a deal card's ticket it is a red figure (`price-lg` in `sale`); the best discount tonight may be written large in lime on the deal card (`display`). No amber, rose or soft-green discount.

**The Faint Rule.** `input` reaches only 3.6:1 on white: field edges only, never text.

**The Bite Rule.** The bitten corner is cut in the colour of what is behind the card. It sits on cards on the sky ground, never on a control.

**The Honest Number Rule.** No figure appears that the product did not measure: no invented counters, ratings or "meals saved" until the pilot produces them.

## Typography

**Body Font:** Be Vietnam Pro, `font-sans`, drawn for Vietnamese, weights 400, 600 and 700.
**Figure Font:** Bricolage Grotesque, `font-display`, for prices and figures only, tracked -1%.

### Hierarchy

Eighteen roles, normalised on 19 October 2026 from the 45 size, weight and leading combinations the Mobile v2 frames had used (SEC-22); `hero` and `page-title` were added for the sign-in screen (SEC-56); `headline` grew to 20/28 bold with Mobile v3 (SEC-48), when `price-lg` became 20/24 and `title-lg` was added (SEC-49); `card-title` and `note` were added for the seller's screens (SEC-57), whose Figma frames use 18/25 and 13/19. A role's token, its Figma text style and its Flutter style share one name, which names its purpose, not its size.

| Role             | Face          | Size / line | Use                                                                               |
| ---------------- | ------------- | ----------- | --------------------------------------------------------------------------------- |
| `display`        | Bricolage 700 | 36 / 40     | Big figures only: the pickup code, the best discount tonight                      |
| `price-lg`       | Bricolage 700 | 20 / 24     | The price on a large card and at checkout, totals, the digits of the sign-in code |
| `price`          | Bricolage 700 | 16 / 18     | The price on a compact card                                                       |
| `figure-sm`      | Bricolage 700 | 12 / 16     | Small figures on lime: the discount badge, the steps' numbers                     |
| `page-title`     | 600           | 28 / 36     | The heading of a form page, the sign-in screen's                                  |
| `hero`           | 700           | 44 / 54     | The headline of a panel with no other content, the wide sign-in screen's           |
| `headline`       | 700           | 20 / 28     | Section and sheet titles, a page's heading                                        |
| `bar-title`      | 600           | 17 / 22     | The top bar's title                                                               |
| `button`         | 600           | 16 / 20     | Button labels                                                                     |
| `title-lg`       | 600           | 16 / 22     | The dish on a large card                                                          |
| `card-title`     | 600           | 18 / 25     | The heading of a card on the seller's screens, and of the open-store form         |
| `note`           | 400           | 13 / 19     | A hint under a field, and what a photo box says under its call                    |
| `title`          | 600           | 15 / 21     | Field labels, block titles, the place on the header                               |
| `body`           | 400           | 16 / 24     | Running text and input values                                                     |
| `body-sm-strong` | 600           | 14 / 21     | Names in lists, small actions                                                     |
| `body-sm`        | 400           | 14 / 21     | Supporting lines, item details, messages                                          |
| `label-strong`   | 600           | 12 / 17     | The discount label, portions left, status chips, the active tab, initials         |
| `label`          | 400           | 12 / 17     | Times, ratings, helper and legal lines, tab labels                                |

### Named Rules

**The Diacritics Rule.** Running text has a line height of at least 1.4, and no text box clips stacked marks (Ầ, Ẫ, Ổ).

**The Floor Rule.** Nothing is set below 12px, for modest phones read in the evening.

**The Figure Rule.** Bricolage sets prices and figures only; a dish, a seller, initials or a screen title are Be Vietnam Pro. Screens carry no large titles: the top bar names the screen.

## Layout

Mobile at 390px is the source frame for app screens; desktop is derived from it. Pages run 16px from the edge, sections 12px apart, and horizontal rows of cards scroll to the edge with 12px between items. Text layers hug or fill and never take a fixed width, because Vietnamese runs 20–30% longer than English. Touch targets are at least 44px.

## Elevation & Depth

Flat. Cards separate from the sky ground by colour alone; photographs get a soft dark scrim where text sits on them. Only what floats over content casts a shadow: a sheet or a dialog (`elevation.sheet`), and the bottom bar (`elevation.nav`).

## Shapes

Generous rounding from one scale: 20px (`2xl`) on the deal card, sheets and list rows; 16px (`xl`) on offer cards; 14px (`lg`) on inputs, segmented controls and a dish card's photograph; 12px (`md`) on thumbnails and the inner corner of a discount label; 24px (`3xl`) on the bottom of the header and a sheet's top corners; full rounding on buttons, the search field and its filter button, the bottom bar, chips, avatars and icon buttons. Photographs fill the top of a card and share its corners. No other radius is used.

## Components

### Button

Primary (Tasco blue, white text) and Secondary (Blue Wash, deepest blue text), 52px high, fully rounded, 24px sides. The 44px default, also fully rounded, stays for compact actions.

### Discount label

Deal Blue with white `label-strong` ("Giảm 55%"), in the photograph's top left corner: that corner takes the photograph's radius, the opposite one 12px (`md`), the other two are square.

### Offer card

The large card of "Sắp hết giờ nhận" (264px wide in a row) and of the list (the full width), after Figma Mobile v3 (`card/…`, `thẻ nổi bật`). White, 16px radius, bitten corner. A photograph 136px high with the discount label, and a dark scrim along its foot carrying the window with a clock, and the distance when a place is known, in white `label-strong` ("20:30–21:30 · 350 m"). Under it, 10px 14px 12px: the dish only, never the seller (`title-lg`, one line, cut with "…"), then a row with the portions left in Sale Red (`label-strong`, "Còn 2 phần", or "Đã hết" muted) on the left, and the old price struck through (`label`, muted) beside the new price (`price-lg`, Tasco blue) on the right. A sold out card dims its photograph.

The home's "Tất cả món quanh đây" lays its cards two abreast (Figma `lưới món`, K1b, K1b2, K1d): 12px apart both ways, three columns from `sm`, four from `lg`, five from `xl`. A grid card keeps the white, the 16px radius and the label, but its photograph is 120px high with a 44px scrim, and under it, 10px 10px 12px: the dish (`title`, one line, cut with "…"), the old price struck through beside the new one (`price-lg`) on their own line, then the portions left; it has no bitten corner, no seller and no rating. Its heart waits for Yêu thích.

### Dish card

The small card of the sideways rows (Figma `rec/…`): 132px wide with no surface of its own. A photograph 96px high with a 14px radius and the discount label; 8px under it the dish (`body-sm-strong`, one line, cut with "…"), then 2px under that a clock and the window (`label`, muted, "20:00–21:00"). It names the dish only, never the seller.

### Bottom bar

The four tabs on a phone (Figma Bottom nav, 105:2515), floating 16px from the sides and the bottom: 64px high, fully rounded, one layer of liquid glass, alike on every ground: white at 45% over a 24px blur that also deepens the colours behind it, a single hairline of white at 60% and `elevation.nav`; no second edge inside it. The active tab is a Blue Wash pill with its icon and label in Tasco blue (`label-strong`); the others are muted (`label`). A tab without a screen yet is shown at 85% and cannot be pressed. Every page shows the bar, the search lighting the home's tab, and ends with a space as tall as the bar so nothing is left under it.

### Splash

The first page of a visit on a phone opens on the splash (Figma K0): the white wordmark, 48px high, over the tagline (`body-sm-strong`, white at 80%) on the header's blue. The other letters stand still while the bitten "o" falls into its place from above the screen, turning as it falls and bouncing twice (1 second); the tagline rises in after it. At 1.7 seconds the splash fades in 0.3 seconds to the page already drawn beneath it. With reduced motion it is gone at once, and a wide screen does not show it.

While a page's list is fetched, the pale ground covers the screen with the blue wordmark (40px) in its middle, its letters hopping in a wave, still for reduced motion.

### Header foot and kind picker

The page's pale ground rises over the header's foot as a 28px sheet with 24px top corners (Figma header › sheet); the sweep scales with the header, so its pale bands always reach that foot. Under it, the kinds are 60px round photographs, each a dish of a Tasco Mall shop cropped so the food fills the circle, with their names (`label`) on one line, and a short track (36px, `secondary-hover`, its blue half following the row) replaces the browser's scrollbar on every row that scrolls sideways.

### Search top bar

The search's own bar (Figma K2): white with a hairline below, a plain back arrow, and the search field fully rounded on the sky ground (`muted`) without an edge. While the field is focused and empty, the recent searches (kept in the browser) and the kinds open under it as a white panel (Figma K2a).

### Filter chip

A 34px pill on the sky ground without an edge (`body-sm`, ink, a small chevron), with a 44px target around it; once chosen it shows its value on Blue Wash in Tasco blue (`body-sm-strong`). Each opens its options as a menu, and every option is a link over the address. A suggestion chip (the kinds in Figma K2a) has the same shape without the chevron.

### Result tabs

Two halves over a hairline (Figma K2 "Món (12)" / "Quán (2)"): the open one in Tasco blue over a 3px line, the other muted, both `title`.

### Seller block

One seller's dishes in the search, white, 20px radius, bitten corner. Either the seller's avatar, name (`title-lg`) and window (`label`, muted) (Figma K2c), or their first dish as an offer card (Figma K1f); then up to three dish tiles: a photograph 84px high with a 12px radius, the price (`price`) beside the old one struck through, and the dish (`label`) on one line.

### Deal card

Deal Blue, 20px radius, at the bottom of the header without a filter: the title in lime, "Giảm đến" over the largest discount (`display`, lime), and two white coupons 72px high (Figma 105:2666): the discount in red (`price-lg` in `sale`), a dashed cut with a 10px notch in the deal card's blue at each edge, then the seller (`body-sm-strong`, one line). It sits on the header's blue; the header's foot (below) starts the page under it.

## Do's and Don'ts

### Do:

- **Do** bind every colour, radius and gap to a token; a literal value on a screen is a defect.
- **Do** keep the discount on the label and the portions left under the photograph, in the same place on every card.
- **Do** use real photographs of real kinds of food, labelled as samples until the pilot has its own.

### Don't:

- **Don't** show a rating, a counter or any figure the product has not measured.
- **Don't** put amber anywhere but the alert box, lime anywhere but the header's pin and the deal card, or red anywhere on a card but the portions left.
- **Don't** set text below 12px, or a title in Bricolage.
- **Don't** describe food as thừa, tồn, thanh lý or giải cứu anywhere in the interface.
