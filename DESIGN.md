---
name: Second Bite
description: A second chance for good food.
colors:
  # Every `x` with an `x-foreground` is checked at 4.5:1 or more by web/scripts/generate-tokens.mjs, and so is
  # each `x-hover` against `x-foreground`; the ratios noted are the foreground on the colour. Values are the
  # Figma variables of the `SecondBite` collection, named here by role (Figma name in the comment).
  background: "#F2F7F5" # brand/50, the mint ground; ink on it 16.8:1
  foreground: "#0E1D19" # text/ink
  soft-foreground: "#30423D" # text/ink-2, labels under pictures; 10.4:1 on the ground
  card: "#FFFFFF"
  card-foreground: "#0E1D19"
  popover: "#FFFFFF" # menus, selects and dialogs
  popover-foreground: "#0E1D19"
  primary: "#0B4A3D" # brand/800, deep leaf, 10.1:1
  primary-foreground: "#FFFFFF"
  primary-hover: "#062F27" # brand/900, darker under the pointer so the text gains contrast, 14.4:1
  shell: "#0B4A3D" # brand/800, the header
  shell-foreground: "#FFFFFF"
  shell-raised: "#155E4E" # brand/700, chips and the capsule on the shell, 7.6:1
  shell-raised-foreground: "#FFFFFF"
  shell-border: "#3F7D6D" # brand/500, the capsule's edge and divider on the shell
  secondary: "#E2EDE8" # brand/100, soft buttons, the discount chip, the active tab
  secondary-foreground: "#0B4A3D"
  secondary-hover: "#C7DCD4" # brand/200
  muted: "#F2F7F5" # brand/50
  muted-foreground: "#5A6B66" # text/muted: 5.6:1 on white, 5.2:1 on the ground
  accent: "#E2EDE8"
  accent-foreground: "#0B4A3D"
  highlight: "#F5CF5C" # accent/amber, the sticker for stock and the collection window
  highlight-foreground: "#4A3600" # accent/amber-ink, 8.0:1
  destructive: "#B42318" # errors, cancelled and refused states, 6.6:1
  destructive-foreground: "#FFFFFF"
  destructive-hover: "#912018" # 8.7:1
  success: "#155E4E" # paid, ready, collected; always with an icon or label, 7.6:1
  success-foreground: "#FFFFFF"
  warning: "#FFF6E5" # alert/bg, allergens and waiting states; always with an icon
  warning-foreground: "#5E4200" # alert/ink, 8.5:1
  border: "#E0E8E4" # border/line
  input: "#7D8C87" # text/faint as a field edge, 3.6:1 on white (3:1 needed for a control)
  ring: "#0B4A3D" # focus ring, 10.1:1 on white
  avatar-foreground: "#FFFFFF" # initials on a seller's avatar; each avatar-* is checked against it
  avatar-clay: "#A4512A" # logo/clay, 5.8:1
  avatar-rose: "#B03B4E" # logo/rose, 5.9:1
  avatar-indigo: "#3A4F9A" # logo/indigo, 7.6:1
  avatar-olive: "#5E6B1F" # logo/olive, 6.0:1
typography:
  # Bricolage Grotesque for titles and prices (`font-display`), Be Vietnam Pro for everything else (`font-sans`);
  # both variable, with the Vietnamese subset, served from our own origin. Chosen with the Figma identity on
  # 18 October 2026, replacing Inter. Names follow the Figma text styles.
  display:
    fontFamily: "Bricolage Grotesque"
    fontSize: "40px"
    fontWeight: 800
    lineHeight: "1.1"
    letterSpacing: "-0.01em"
  h1:
    fontFamily: "Bricolage Grotesque"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: "1.15"
    letterSpacing: "-0.01em"
  banner:
    fontFamily: "Bricolage Grotesque"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: "1.1"
    letterSpacing: "-0.01em"
  h2:
    fontFamily: "Bricolage Grotesque"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: "1.15"
    letterSpacing: "-0.01em"
  h3:
    fontFamily: "Bricolage Grotesque"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: "1.2"
    letterSpacing: "-0.01em"
  price-lg:
    fontFamily: "Bricolage Grotesque"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: "1.2"
    letterSpacing: "-0.01em"
  price:
    fontFamily: "Bricolage Grotesque"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: "1.15"
    letterSpacing: "-0.01em"
  button:
    fontFamily: "Be Vietnam Pro"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: "1.2"
  title:
    fontFamily: "Be Vietnam Pro"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: "1.4"
  body:
    fontFamily: "Be Vietnam Pro"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "1.5"
  body-sm:
    fontFamily: "Be Vietnam Pro"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: "1.4"
  caption:
    fontFamily: "Be Vietnam Pro"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "1.4"
  micro:
    fontFamily: "Be Vietnam Pro"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: "1.4"
rounded:
  # Named like Tailwind and shadcn: `lg` is the base radius shadcn's controls use.
  sm: "6px"
  md: "8px" # the discount chip
  lg: "10px" # small controls inside a field
  field: "14px" # the search field and thumbnails
  xl: "16px" # buttons and the impact card
  tile: "18px" # the compact offer card of a grid
  2xl: "20px" # offer cards, banners and list rows
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
    backgroundColor: "{colors.highlight}"
    textColor: "{colors.highlight-foreground}"
    typography: "{typography.caption}"
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

Good food that someone has already started to love: a cookie with a bite taken out of it. The bite is the brand's mark, in the "o" of the wordmark and on the top right corner of every card and banner, cut out in the colour of the ground as if the food had been tasted.

The interface is a calm, deep-leaf green shell over a pale mint ground, with white cards that carry real photographs of the food. One warm amber sticker per card says what matters most at a glance, how many are left or when to collect. Dense enough for one-handed use at the end of a shift, generous with photographs so food looks like food.

**Key Characteristics:**

- Deep-leaf green header with rounded bottom corners, holding the place, the search and the language.
- Mint ground, white cards with a bitten top right corner.
- Amber stickers for stock and collection window, on the photograph.
- Real photographs of the food, never illustrations.
- Price hierarchy by size and face: new price in Bricolage, old price small and struck through, and the discount as a soft chip.

## Colors

A green family from deep leaf to mint, warm amber for attention, and ink text.

### Primary

- **Deep Leaf** (`primary`, `shell`): the header, primary buttons, prices, links and the focus ring. `primary-hover` is the pressed leaf.
- **Raised Leaf** (`shell-raised`, `shell-border`): chips and the capsule that sit on the shell.

### Secondary

- **Leaf Wash** (`secondary`, `accent`): soft buttons, the discount chip, the active tab indicator and quiet controls. Text on it is Deep Leaf.

### Highlight

- **Amber Sticker** (`highlight`): stock ("Còn 2") and the collection window on a photograph or a banner, with amber ink text. Inside a deal strip on Deep Leaf the discount is written in amber.

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
- **Alert** (`warning`): allergens and waiting states, a pale amber box with amber ink and an icon.

### Named Rules

**The One Sticker Rule.** A card carries one amber sticker, on its photograph: stock, or the window when stock is not the point.

**The Bite Rule.** The bitten corner is cut in the colour of what is behind the card. It sits on cards and banners on the mint ground, never on a control.

**The Honest Number Rule.** No figure appears that the product did not measure: no invented counters, ratings or "meals saved" until the pilot produces them.

## Typography

**Display Font:** Bricolage Grotesque (titles, prices, initials), `font-display`.
**Body Font:** Be Vietnam Pro, `font-sans`, drawn for Vietnamese.

**Character:** a characterful grotesque for what should be read first, and a sturdy Vietnamese-first sans for everything else.

### Hierarchy

- **Display** (Bricolage 800, 40px): rare, large statements.
- **H1** (Bricolage 700, 28px): screen titles.
- **Banner** (Bricolage 700, 24px): the title on a banner photograph.
- **H2** (Bricolage 700, 22px): the heading inside the header.
- **H3** (Bricolage 600, 20px): section titles.
- **Price large** (Bricolage 700, 18px) and **Price** (Bricolage 700, 16px): the new price.
- **Button** (600, 16px).
- **Title** (600, 15px): seller name or dish name on a card.
- **Body** (400, 14px): running text and the search field.
- **Body small** (400, 13px): the dish under the seller, the old price, links beside a section title.
- **Caption** (400, 12px): meta lines; with weight 500 to 700 for chips, stickers and labels.
- **Micro** (500, 11px): tab labels, the deal strip, the seller under a compact card.

### Named Rules

**The Diacritics Rule.** Running text has a line height of at least 1.4; titles may go to 1.1 only where no text box clips stacked marks (Ầ, Ẫ, Ổ).

## Layout

Mobile at 390px is the source frame for app screens; desktop is derived from it. Pages run 16px from the edge, sections 18px apart, and horizontal rows (banners, cards) scroll to the edge with 12px between items. Text layers hug or fill and never take a fixed width, because Vietnamese runs 20–30% longer than English. Touch targets are at least 44px.

## Elevation & Depth

Flat. Cards separate from the mint ground by colour alone; photographs get a soft dark scrim where text sits on them. Nothing casts a shadow.

## Shapes

Generous rounding: 20px on cards, banners and list rows, 18px on compact grid cards, 16px on buttons, 14px on the search field and thumbnails, 24px on the bottom of the header, full rounding on stickers, chips and avatars. Photographs fill the top of a card and share its corners.

## Components

### Button

Primary (Deep Leaf, white text) and Secondary (Leaf Wash, Deep Leaf text), 52px high, 16px radius, 24px sides. The 44px default stays for compact actions.

### Sticker

An amber pill on a photograph: stock ("Còn 2", "Đã hết" on muted when sold out) or the window ("Tối nay · 20:00–22:00").

### Offer card

White, 20px radius, bitten corner. Photograph (148px) with the stock sticker and the seller's avatar, then the seller (Title), the dish (Body small, muted), the window and place with a clock, and the price row: the discount chip on the left, the old price struck through and the new price (Price large, Deep Leaf) on the right.

### Compact offer card

For two-column grids: 18px radius, photograph (132px) with the stock sticker and a Deep Leaf deal strip ("-58%" in amber, "Lấy 19:30–20:30" in white), then the dish, the price, and the seller with a small avatar.

### Banner

A photograph with a dark scrim, 20px radius, the window as a sticker and the dish as a Banner title; banners scroll sideways with dots below.

## Do's and Don'ts

### Do:

- **Do** bind every colour, radius and gap to a token; a literal value on a screen is a defect.
- **Do** keep stock or the window on the sticker, in the same place on every card.
- **Do** use real photographs of real kinds of food, labelled as samples until the pilot has its own.

### Don't:

- **Don't** show a rating, a counter or any figure the product has not measured.
- **Don't** put amber anywhere but stickers, the discount inside a deal strip, the header's chip icons and focus rings on the shell, where Deep Leaf would not show.
- **Don't** describe food as thừa, tồn, thanh lý or giải cứu anywhere in the interface.
