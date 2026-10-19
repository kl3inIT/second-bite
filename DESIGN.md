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
  soft-foreground: "{palette.text-ink-2}" # labels under pictures; 10.4:1 on the ground
  card: "{palette.base-white}"
  card-foreground: "{palette.text-ink}"
  popover: "{palette.base-white}" # menus, selects and dialogs
  popover-foreground: "{palette.text-ink}"
  primary: "{palette.brand-800}" # deep leaf, 10.1:1
  primary-foreground: "{palette.base-white}"
  primary-hover: "{palette.brand-900}" # darker under the pointer so the text gains contrast, 14.4:1
  shell: "{palette.accent-lime-300}" # the header, under the leaf sweep
  shell-foreground: "{palette.brand-900}" # the place on the header, 11.1:1
  shell-raised: "{palette.base-white}" # the capsule and the search field on the header
  shell-raised-foreground: "{palette.text-ink}"
  shell-border: "{palette.border-line}" # the capsule's edge
  sweep: "{palette.brand-700}" # the leaf that sweeps across the header's top right
  sweep-edge: "{palette.brand-500}" # the lighter band between the leaf and the lime
  secondary: "{palette.brand-100}" # soft buttons, the discount chip, the active tab
  secondary-foreground: "{palette.brand-800}"
  secondary-hover: "{palette.brand-200}"
  muted: "{palette.brand-50}"
  muted-foreground: "{palette.text-muted}" # 5.6:1 on white, 5.2:1 on the ground
  accent: "{palette.brand-100}"
  accent-foreground: "{palette.brand-800}"
  link: "{palette.brand-700}" # text links and secondary actions ("Đổi", "Chỉ đường"), 7.7:1 on white, 7.1:1 on the ground
  highlight: "{palette.accent-amber}" # the discount inside a deal strip
  highlight-foreground: "{palette.accent-amber-ink}" # 8.0:1
  fresh: "{palette.accent-lime-300}" # the stock sticker; the deal card's title on Deep Leaf
  fresh-foreground: "{palette.accent-lime-ink}" # 7.4:1
  sale: "{palette.logo-rose}" # a discount written large on white, the deal card's tickets; 5.9:1 on white
  destructive: "{palette.status-error}" # errors, cancelled and refused states, 6.6:1
  destructive-foreground: "{palette.base-white}"
  destructive-hover: "#912018" # 8.7:1
  success: "{palette.brand-700}" # paid, ready, collected; always with an icon or label, 7.6:1
  success-foreground: "{palette.base-white}"
  warning: "{palette.alert-bg}" # allergens and waiting states; always with an icon
  warning-foreground: "{palette.alert-ink}" # 8.5:1
  warning-border: "{palette.alert-line}" # the edge of a notice
  border: "{palette.border-line}"
  input: "{palette.text-faint}" # a field edge, 3.6:1 on white (3:1 needed for a control)
  ring: "{palette.brand-800}" # focus ring, 10.1:1 on white
  avatar-foreground: "{palette.base-white}" # initials on a seller's avatar; each avatar-* is checked against it
  avatar-clay: "{palette.logo-clay}" # 5.8:1
  avatar-rose: "{palette.logo-rose}" # 5.9:1
  avatar-indigo: "{palette.logo-indigo}" # 7.6:1
  avatar-olive: "{palette.logo-olive}" # 6.0:1
typography:
  # The Figma text styles, named by their role and size: `Tiêu đề/H1 28` is `h1-28` and the utility `text-h1-28`.
  # Bricolage Grotesque (`font-display`) for titles and prices, Be Vietnam Pro (`font-sans`) for the rest; both
  # variable, with the Vietnamese subset, served from our own origin. Chosen with the Figma identity on 18 October
  # 2026, replacing Inter. `deal-34`, `price-18`, `place-16`, `body-13`, `micro-11` and `overline-11` are sizes the Figma screens use
  # without a style.
  display-40: # Tiêu đề/Display 40
    fontFamily: "Bricolage Grotesque"
    fontSize: "40px"
    fontWeight: 800
    lineHeight: "1.1"
    letterSpacing: "-0.01em"
  h1-28: # Tiêu đề/H1 28
    fontFamily: "Bricolage Grotesque"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: "1.15"
    letterSpacing: "-0.01em"
  deal-34: # the largest discount on the deal card, "70%"
    fontFamily: "Bricolage Grotesque"
    fontSize: "34px"
    fontWeight: 700
    lineHeight: "1.05"
    letterSpacing: "-0.02em"
  h2-22: # Tiêu đề/H2 22
    fontFamily: "Bricolage Grotesque"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: "1.15"
    letterSpacing: "-0.01em"
  h3-20: # Tiêu đề/H3 20
    fontFamily: "Bricolage Grotesque"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: "1.2"
    letterSpacing: "-0.01em"
  price-18:
    fontFamily: "Bricolage Grotesque"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: "1.2"
    letterSpacing: "-0.01em"
  price-16: # Tiêu đề/Giá 16
    fontFamily: "Bricolage Grotesque"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: "1.15"
    letterSpacing: "-0.01em"
  place-16: # the place on the header, "Tasco Mall"
    fontFamily: "Be Vietnam Pro"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: "1.35"
  button-16: # Nội dung/Nút 16
    fontFamily: "Be Vietnam Pro"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: "1.2"
  title-15: # Nội dung/Tiêu đề 15
    fontFamily: "Be Vietnam Pro"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: "1.4"
  body-14: # Nội dung/Thân 14
    fontFamily: "Be Vietnam Pro"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "1.5"
  body-13:
    fontFamily: "Be Vietnam Pro"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: "1.4"
  caption-12: # Nội dung/Chú thích 12
    fontFamily: "Be Vietnam Pro"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "1.4"
  micro-11:
    fontFamily: "Be Vietnam Pro"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: "1.4"
  overline-11: # the label over the deal card's figure, "GIẢM ĐẾN"
    fontFamily: "Be Vietnam Pro"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: "1.3"
    letterSpacing: "0.04em"
rounded:
  # Named like Tailwind and shadcn: `lg` is the base radius shadcn's controls use.
  sm: "6px"
  md: "8px" # the discount chip
  lg: "10px" # small controls inside a field
  field: "14px" # the search field and thumbnails
  xl: "16px" # buttons
  tile: "18px" # the compact offer card of a grid
  2xl: "20px" # offer cards, the deal card and list rows
  3xl: "24px" # the bottom edge of the header
  4xl: "32px"
  full: "9999px" # pills, stickers, avatars
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "6": "24px"
  "8": "32px"
elevation: {}
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.button-16}"
    rounded: "{rounded.xl}"
    height: "52px"
    padding: "0 24px"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    typography: "{typography.button-16}"
    rounded: "{rounded.xl}"
    height: "52px"
    padding: "0 24px"
  sticker:
    backgroundColor: "{colors.fresh}"
    textColor: "{colors.fresh-foreground}"
    typography: "{typography.caption-12}"
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
- Lime stickers for stock on the photograph; amber only for the discount in a deal strip.
- Real photographs of the food, never illustrations.
- Price hierarchy by size and face: new price in Bricolage, old price small and struck through, and the discount as a soft chip.

## Colors

A green family from deep leaf to mint, a fresh lime for the header and stock, warm amber and rose for discounts, and ink text.

Two layers, as in Figma. The **palette** is the `SecondBite` collection under the same names (`brand-50` to `brand-900`, `text-ink`, `accent-amber`, `logo-clay`…), and only the roles refer to it. The **roles** below (`primary`, `shell`, `highlight`…) are what screens use, so a role can move to another palette colour without touching a screen.

### Primary

- **Deep Leaf** (`primary`): primary buttons, the deal card, prices, links and the focus ring. `primary-hover` is the pressed leaf.
- **Lime Shell** (`shell`, `shell-foreground`): the header, with the place in the darkest leaf. **Leaf Sweep** (`sweep`, `sweep-edge`) crosses its top right.
- **Raised** (`shell-raised`, `shell-border`): the white capsule and search field on the header.
- **Leaf Link** (`link`): text links and secondary actions, on white or the ground.

### Secondary

- **Leaf Wash** (`secondary`, `accent`): soft buttons, the discount chip, the active tab indicator and quiet controls. Text on it is Deep Leaf.

### Highlight

- **Lime Sticker** (`fresh`): stock ("Còn 2") on a photograph, with lime ink text; the deal card's title and figure on Deep Leaf.
- **Amber** (`highlight`): the discount inside a deal strip on Deep Leaf.
- **Rose** (`sale`): a discount written large on white, the deal card's tickets.

### Neutral

- **Mint Ground** (`background`, `muted`): the page under the cards. The bite of each card is cut in this colour.
- **White** (`card`): cards, sheets, the search field, dialogs.
- **Ink** (`foreground`): body text; **Soft Ink** (`soft-foreground`) for labels under pictures.
- **Muted** (`muted-foreground`): secondary text, old prices and placeholders.
- **Line** (`border`): hairlines and dividers.
- **Field Edge** (`input`): input outlines, 3.6:1 against white.
- **Seller avatars** (`avatar-clay`, `avatar-rose`, `avatar-indigo`, `avatar-olive`): a seller without a logo gets their initials on one of these, chosen from the seller's id so it never changes.

### Status

- **Stamp Red** (`destructive`): errors, cancelled and refused states, always with an icon or label.
- **Leaf Stamp** (`success`): paid, ready and collected orders, always with an icon or label.
- **Alert** (`warning`, `warning-border`): allergens, waiting states and notices to read before going on, a pale amber box with amber ink, its edge and an icon.

### Named Rules

**The One Sticker Rule.** A card carries one lime sticker, on its photograph: how many are left.

**The Bite Rule.** The bitten corner is cut in the colour of what is behind the card. It sits on cards on the mint ground, never on a control.

**The Honest Number Rule.** No figure appears that the product did not measure: no invented counters, ratings or "meals saved" until the pilot produces them.

## Typography

**Display Font:** Bricolage Grotesque (titles, prices, initials), `font-display`.
**Body Font:** Be Vietnam Pro, `font-sans`, drawn for Vietnamese.

**Character:** a characterful grotesque for what should be read first, and a sturdy Vietnamese-first sans for everything else.

### Hierarchy

- **Display** (`display-40`, Bricolage 800, 40px): rare, large statements.
- **H1** (`h1-28`, Bricolage 700): screen titles.
- **Deal** (`deal-34`, Bricolage 700): the largest discount on the deal card.
- **H2** (`h2-22`, Bricolage 700): large headings.
- **Place** (`place-16`, 700): the place on the header.
- **H3** (`h3-20`, Bricolage 600): section titles.
- **Price** (`price-18` on an offer card, `price-16` on a compact card, Bricolage 700): the new price.
- **Button** (`button-16`, 600).
- **Title** (`title-15`, 600): seller name or dish name on a card.
- **Body** (`body-14`, 400): running text and the search field.
- **Body small** (`body-13`, 400): the dish under the seller, the old price, links beside a section title.
- **Caption** (`caption-12`, 400): meta lines; with weight 500 to 700 for chips, stickers and labels.
- **Micro** (`micro-11`, 500): tab labels, the deal strip, the seller under a compact card, the deal card's tickets.
- **Overline** (`overline-11`, 600, tracked, upper case): the label over the deal card's figure.

### Named Rules

**The Diacritics Rule.** Running text has a line height of at least 1.4; titles may go to 1.1 only where no text box clips stacked marks (Ầ, Ẫ, Ổ).

## Layout

Mobile at 390px is the source frame for app screens; desktop is derived from it. Pages run 16px from the edge, sections 12px apart, and horizontal rows of cards scroll to the edge with 12px between items. Text layers hug or fill and never take a fixed width, because Vietnamese runs 20–30% longer than English. Touch targets are at least 44px.

## Elevation & Depth

Flat. Cards separate from the mint ground by colour alone; photographs get a soft dark scrim where text sits on them. Nothing casts a shadow.

## Shapes

Generous rounding: 20px on cards, the deal card and list rows, 18px on compact grid cards, 16px on buttons, 14px on the search field and thumbnails, 24px on the bottom of the header, full rounding on stickers, chips and avatars. Photographs fill the top of a card and share its corners.

## Components

### Button

Primary (Deep Leaf, white text) and Secondary (Leaf Wash, Deep Leaf text), 52px high, 16px radius, 24px sides. The 44px default stays for compact actions.

### Sticker

A lime pill on a photograph: stock ("Còn 2", or "Đã hết" on muted when sold out).

### Offer card

White, 20px radius, bitten corner. Photograph (92px) with the stock sticker and the seller's avatar, then the seller (Title), the dish (Body small, muted), the window and place with a clock, and the price row: the discount chip on the left, the old price struck through and the new price (Price large, Deep Leaf) on the right.

### Compact offer card

For two-column grids: 18px radius, photograph (132px) with the stock sticker and a Deep Leaf deal strip ("-58%" in amber, "Lấy 19:30–20:30" in white), then the dish, the price, and the seller with a small avatar.

### Deal card

Deep Leaf, 20px radius, at the bottom of the header without a filter: the title in lime, "Giảm đến" over the largest discount (Deal, lime), and up to three white tickets with the discount in rose, the seller and when collection opens. Under it, a white strip with how many bags are open and when the last window closes links to the list. A mint sheet with rounded top corners rises behind their lower half to start the page.

## Do's and Don'ts

### Do:

- **Do** bind every colour, radius and gap to a token; a literal value on a screen is a defect.
- **Do** keep stock or the window on the sticker, in the same place on every card.
- **Do** use real photographs of real kinds of food, labelled as samples until the pilot has its own.

### Don't:

- **Don't** show a rating, a counter or any figure the product has not measured.
- **Don't** put amber anywhere but the discount inside a deal strip and the alert box, or lime anywhere but the header, stickers and the deal card.
- **Don't** describe food as thừa, tồn, thanh lý or giải cứu anywhere in the interface.
