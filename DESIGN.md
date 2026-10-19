---
name: Second Bite
description: A second chance for good food.
palette:
  # The Figma variables of the `SecondBite` collection, one for one: `brand/800` in Figma is `brand-800` here and
  # `--brand-800` in tokens.css. Change a value in Figma and here together; screens never use these directly.
  brand-900: "#062F27"
  brand-800: "#0B4A3D"
  brand-700: "#155E4E"
  brand-500: "#3F7D6D"
  brand-300: "#8FB3A7"
  brand-200: "#C7DCD4"
  brand-100: "#E2EDE8"
  brand-50: "#F2F7F5"
  base-white: "#FFFFFF"
  text-ink: "#0E1D19"
  text-ink-2: "#30423D"
  text-muted: "#5A6B66"
  text-faint: "#7D8C87"
  text-on-brand: "#CBE0D8"
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
  status-error: "#B42318"
  status-error-bg: "#FEF3F2"
colors:
  # The roles screens use, each taking a palette colour. Every `x` with an `x-foreground` is checked at 4.5:1 or
  # more by web/scripts/generate-tokens.mjs, and so is each `x-hover` against `x-foreground`; the ratios noted
  # are the foreground on the colour.
  background: "{palette.brand-50}" # the mint ground; ink on it 16.8:1
  foreground: "{palette.text-ink}"
  card: "{palette.base-white}"
  card-foreground: "{palette.text-ink}"
  popover: "{palette.base-white}" # menus, selects and dialogs
  popover-foreground: "{palette.text-ink}"
  primary: "{palette.brand-800}" # deep leaf, 10.1:1
  primary-foreground: "{palette.base-white}"
  primary-hover: "{palette.brand-900}" # darker under the pointer so the text gains contrast, 14.4:1
  inverse-muted: "{palette.text-on-brand}" # secondary text on deep leaf or a dark photo scrim
  shell: "{palette.base-white}" # the top bar of every screen but the home: white with a hairline below
  shell-foreground: "{palette.text-ink}"
  header: "{palette.accent-lime-300}" # the home's header, under the leaf sweep
  header-foreground: "{palette.brand-900}" # the place on the header, 11.1:1
  header-raised: "{palette.base-white}" # the capsule and the search field on the header
  header-raised-foreground: "{palette.text-ink}"
  header-border: "{palette.border-line}" # the capsule's edge
  sweep: "{palette.brand-700}" # the leaf that sweeps across the header's top right
  sweep-edge: "{palette.brand-500}" # the lighter band between the leaf and the lime
  secondary: "{palette.brand-100}" # soft buttons, segmented controls, the active tab
  secondary-foreground: "{palette.brand-800}"
  secondary-hover: "{palette.brand-200}"
  muted: "{palette.brand-50}"
  muted-foreground: "{palette.text-muted}" # 5.6:1 on white, 5.2:1 on the ground
  accent: "{palette.brand-100}"
  accent-foreground: "{palette.brand-800}"
  link: "{palette.brand-700}" # text links and secondary actions ("Đổi", "Chỉ đường"), 7.7:1 on white, 7.1:1 on the ground
  fresh: "{palette.accent-lime-300}" # young rice: the stock sticker, the discount chip, the deal card's figures
  fresh-foreground: "{palette.accent-lime-ink}" # 7.4:1
  fresh-muted: "{palette.accent-lime-100}" # a quiet lime surface, such as the pickup place on a seller's draft
  rating: "{palette.rating-star}" # the star beside a rating, always next to the figure
  destructive: "{palette.status-error}" # errors, cancelled and refused states, 6.6:1
  destructive-foreground: "{palette.base-white}"
  destructive-hover: "#912018" # 8.7:1
  success: "{palette.brand-700}" # paid, ready, collected; always with an icon or label, 7.6:1
  success-foreground: "{palette.base-white}"
  warning: "{palette.alert-bg}" # allergens and waiting states; always with an icon
  warning-foreground: "{palette.alert-ink}" # 8.5:1
  warning-border: "{palette.alert-line}" # the edge of a notice
  border: "{palette.border-line}"
  input: "{palette.text-faint}" # a field edge, 3.6:1 on white (3:1 needed for a control); never text
  ring: "{palette.brand-800}" # focus ring, 10.1:1 on white
  avatar-foreground: "{palette.base-white}" # initials of a seller without a photo; each avatar-* is checked against it
  avatar-clay: "{palette.logo-clay}" # 5.8:1
  avatar-rose: "{palette.logo-rose}" # 5.9:1
  avatar-indigo: "{palette.logo-indigo}" # 7.6:1
  avatar-olive: "{palette.logo-olive}" # 6.0:1
typography:
  # Thirteen roles, normalised on 19 October 2026 from the 45 size, weight and leading combinations the Figma
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
  title: # field labels, block titles, the name on a card, the place on the header
    fontFamily: "Be Vietnam Pro"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: "21px"
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
  headline: # section and sheet titles, a page's heading
    fontFamily: "Be Vietnam Pro"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: "25px"
  figure-sm: # the discount chip (-63%)
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
  price-lg: # the price on an offer and at checkout, totals, the digits of the sign-in code
    fontFamily: "Bricolage Grotesque"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: "25px"
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
  lg: "14px" # inputs, the search field, segmented controls
  xl: "16px" # buttons
  2xl: "20px" # cards, the deal card, sheets and list rows
  3xl: "24px" # the bottom edge of the header, a sheet's top corners
  4xl: "32px"
  full: "9999px" # pills, stickers, chips, avatars, icon buttons
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "6": "24px"
  "8": "32px"
elevation:
  # Cards are flat on the mint ground; only what floats over content, a sheet or a dialog, casts a shadow.
  sheet:
    - { x: 0, y: -4, blur: 24, spread: 0, color: "#0E1D191F" }
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.button}"
    rounded: "{rounded.xl}"
    height: "52px"
    padding: "0 24px"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    typography: "{typography.button}"
    rounded: "{rounded.xl}"
    height: "52px"
    padding: "0 24px"
  sticker:
    backgroundColor: "{colors.fresh}"
    textColor: "{colors.fresh-foreground}"
    typography: "{typography.label-strong}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  offer-card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.2xl}"
    padding: "12px 14px 14px"
---

<!-- This frontmatter is the source of the tokens. web/src/styles/tokens.css and the Flutter theme follow it with the same names in the same change; the Figma file "Secondbite" holds the same values as the `SecondBite` variables and text styles (docs/guidelines/figma.md). Changed to the Figma identity on 18 October 2026, replacing "Gói mang về". -->

# Design System: Second Bite

## Overview

**Creative North Star: "Miếng cắn thứ hai" (the second bite)**

Good food that someone has already started to love: a cookie with a bite taken out of it. The bite is the brand's mark, in the "o" of the wordmark and on the top right corner of every card, cut out in the colour of the ground as if the food had been tasted.

The interface opens on a fresh lime header swept by a deep-leaf green, over a pale mint ground, with white cards that carry real photographs of the food. One lime sticker per card says how many are left at a glance. Dense enough for one-handed use at the end of a shift, generous with photographs so food looks like food.

**Key Characteristics:**

- Lime header under a deep-leaf sweep, holding the place, the search, the language and tonight's deal card.
- Mint ground, white cards with a bitten top right corner.
- Lime for stock and discounts: one sticker on the photograph, one discount chip; amber only in alerts.
- Real photographs of the food, never illustrations.
- Price hierarchy by size and face: new price in Bricolage, old price small and struck through, and the discount as a lime chip.

## Colors

A green family from deep leaf to mint, a fresh lime for the header, stock and discounts, amber only for alerts, and ink text.

Two layers, as in Figma. The **palette** is the `SecondBite` collection under the same names (`brand-50` to `brand-900`, `text-ink`, `accent-amber`, `logo-clay`…), and only the roles refer to it. The **roles** below (`primary`, `header`, `fresh`…) are what screens use, so a role can move to another palette colour without touching a screen.

### Primary

- **Deep Leaf** (`primary`): primary buttons, the deal card, prices, links and the focus ring. `primary-hover` is the pressed leaf.
- **Lime Header** (`header`, `header-foreground`): the home's header, with the place in the darkest leaf. **Leaf Sweep** (`sweep`, `sweep-edge`) crosses its top right.
- **Raised** (`header-raised`, `header-border`): the white capsule and search field on the header.
- **White Shell** (`shell`, `shell-foreground`): the top bar of every other screen, white with a hairline below.
- **Soft on Leaf** (`inverse-muted`): secondary text on Deep Leaf or a dark photo scrim.
- **Leaf Link** (`link`): text links and secondary actions, on white or the ground.

### Secondary

- **Leaf Wash** (`secondary`, `accent`): soft buttons, segmented controls, the active tab indicator and quiet controls. Text on it is Deep Leaf.

### Fresh

- **Lime** (`fresh`, `fresh-foreground`): the stock sticker on a photograph and the discount chip, with lime ink text; the deal card's title and figures on Deep Leaf. `fresh-muted` is its quiet surface.
- **Star** (`rating`): the star beside a rating, never on its own.

### Neutral

- **Mint Ground** (`background`, `muted`): the page under the cards. The bite of each card is cut in this colour.
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

**The One Sticker Rule.** A card carries one lime sticker, on its photograph: how many are left.

**The One Discount Rule.** A discount is always the lime chip (`figure-sm` on `fresh`); the best discount tonight may be written large in lime on Deep Leaf (`display`). No amber, rose or soft-green discount.

**The Faint Rule.** `input` reaches only 3.6:1 on white: field edges only, never text.

**The Bite Rule.** The bitten corner is cut in the colour of what is behind the card. It sits on cards on the mint ground, never on a control.

**The Honest Number Rule.** No figure appears that the product did not measure: no invented counters, ratings or "meals saved" until the pilot produces them.

## Typography

**Body Font:** Be Vietnam Pro, `font-sans`, drawn for Vietnamese, weights 400, 600 and 700.
**Figure Font:** Bricolage Grotesque, `font-display`, for prices and figures only, tracked -1%.

### Hierarchy

Thirteen roles, normalised on 19 October 2026 from the 45 size, weight and leading combinations the Mobile v2 frames had used (SEC-22). A role's token, its Figma text style and its Flutter style share one name, which names its purpose, not its size.

| Role             | Face          | Size / line | Use                                                                                |
| ---------------- | ------------- | ----------- | ---------------------------------------------------------------------------------- |
| `display`        | Bricolage 700 | 36 / 40     | Big figures only: the pickup code, the best discount tonight                       |
| `price-lg`       | Bricolage 700 | 22 / 25     | The price on an offer card and at checkout, totals, the digits of the sign-in code |
| `price`          | Bricolage 700 | 16 / 18     | The price on a compact card                                                        |
| `figure-sm`      | Bricolage 700 | 12 / 16     | The discount chip                                                                  |
| `headline`       | 600           | 18 / 25     | Section and sheet titles, a page's heading                                         |
| `bar-title`      | 600           | 17 / 22     | The top bar's title                                                                |
| `button`         | 600           | 16 / 20     | Button labels                                                                      |
| `title`          | 600           | 15 / 21     | Field labels, block titles, the name on a card, the place on the header            |
| `body`           | 400           | 16 / 24     | Running text and input values                                                      |
| `body-sm-strong` | 600           | 14 / 21     | Names in lists, small actions                                                      |
| `body-sm`        | 400           | 14 / 21     | Supporting lines, item details, messages                                           |
| `label-strong`   | 600           | 12 / 17     | Stock and status chips, the active tab, counters, initials                         |
| `label`          | 400           | 12 / 17     | Times, ratings, helper and legal lines, tab labels                                 |

### Named Rules

**The Diacritics Rule.** Running text has a line height of at least 1.4, and no text box clips stacked marks (Ầ, Ẫ, Ổ).

**The Floor Rule.** Nothing is set below 12px, for modest phones read in the evening.

**The Figure Rule.** Bricolage sets prices and figures only; a dish, a seller, initials or a screen title are Be Vietnam Pro. Screens carry no large titles: the top bar names the screen.

## Layout

Mobile at 390px is the source frame for app screens; desktop is derived from it. Pages run 16px from the edge, sections 12px apart, and horizontal rows of cards scroll to the edge with 12px between items. Text layers hug or fill and never take a fixed width, because Vietnamese runs 20–30% longer than English. Touch targets are at least 44px.

## Elevation & Depth

Flat. Cards separate from the mint ground by colour alone; photographs get a soft dark scrim where text sits on them. Only what floats over content, a sheet or a dialog, casts a shadow (`elevation.sheet`).

## Shapes

Generous rounding from one scale: 20px (`2xl`) on cards, the deal card, sheets and list rows; 16px (`xl`) on buttons; 14px (`lg`) on inputs, the search field and segmented controls; 12px (`md`) on thumbnails; 24px (`3xl`) on the bottom of the header and a sheet's top corners; full rounding on stickers, chips, avatars and icon buttons. Photographs fill the top of a card and share its corners. No other radius is used.

## Components

### Button

Primary (Deep Leaf, white text) and Secondary (Leaf Wash, Deep Leaf text), 52px high, 16px radius, 24px sides. The 44px default stays for compact actions.

### Sticker

A lime pill on a photograph: stock ("Còn 2", or "Đã hết" on muted when sold out).

### Offer card

White, 20px radius, bitten corner. Photograph (92px) with the stock sticker and the seller's avatar, then the seller (`title`), the dish (`body-sm`, muted), the window and place with a clock (`label`), and the price row: the discount chip on the left, the old price struck through and the new price (`price-lg`, Deep Leaf) on the right.

### Compact offer card

For two-column grids: 20px radius, photograph (132px) with the stock sticker and a Deep Leaf deal strip ("-58%" in lime, "Lấy 19:30–20:30" in white), then the dish, the price, and the seller with a small avatar.

### Deal card

Deep Leaf, 20px radius, at the bottom of the header without a filter: the title in lime, "Giảm đến" over the largest discount (`display`, lime), and up to three white tickets with the discount chip, the seller and when collection opens. Under it, a white strip with how many bags are open and when the last window closes links to the list. A mint sheet with rounded top corners rises behind their lower half to start the page.

## Do's and Don'ts

### Do:

- **Do** bind every colour, radius and gap to a token; a literal value on a screen is a defect.
- **Do** keep stock or the window on the sticker, in the same place on every card.
- **Do** use real photographs of real kinds of food, labelled as samples until the pilot has its own.

### Don't:

- **Don't** show a rating, a counter or any figure the product has not measured.
- **Don't** put amber anywhere but the alert box, or lime anywhere but the header, stickers, discount chips and the deal card.
- **Don't** set text below 12px, or a title in Bricolage.
- **Don't** describe food as thừa, tồn, thanh lý or giải cứu anywhere in the interface.
