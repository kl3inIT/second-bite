---
name: Second Bite
description: A second chance for good food.
colors:
  # Taken from the Figma file "Secondbite", section "Mobile v2", on 19 October 2026 (its variable in brackets).
  # Every `x` with an `x-foreground` is checked at 4.5:1 or more by web/scripts/generate-tokens.mjs, and so is
  # each `x-hover` against `x-foreground`; the ratios noted are measured.
  background: "#F2F7F5" # mint wash [brand/50]; ink on it 16:1
  foreground: "#0E1D19" # [text/ink]
  card: "#FFFFFF" # [base/white]
  card-foreground: "#0E1D19"
  popover: "#FFFFFF" # menus, selects and dialogs
  popover-foreground: "#0E1D19"
  primary: "#0B4A3D" # deep green [brand/800]: primary buttons, white on it 10.2:1
  primary-foreground: "#FFFFFF"
  primary-hover: "#062F27" # [brand/900], 14.5:1
  shell: "#FFFFFF" # the top bar: white with a hairline below
  shell-foreground: "#0E1D19"
  secondary: "#E2EDE8" # [brand/100]: segmented controls, quiet buttons, chips; deep green on it 8.5:1
  secondary-foreground: "#0B4A3D"
  muted: "#E2EDE8" # [brand/100]
  muted-foreground: "#5A6B66" # [text/muted]: 5.6:1 on white, 5.2:1 on the wash, 4.7:1 on muted
  accent: "#E2EDE8" # shadcn's hover and selected fill [brand/100]
  accent-foreground: "#0B4A3D"
  link: "#155E4E" # [brand/700]: text links and secondary actions, 7.7:1 on white, 7.1:1 on the wash
  destructive: "#B42318" # [status/error], 6.6:1 on white
  destructive-foreground: "#FFFFFF"
  destructive-hover: "#912018" # 8.7:1
  success: "#155E4E" # [brand/700]: ready and collected; always with an icon or label, 7.7:1
  success-foreground: "#FFFFFF"
  warning: "#FFF6E5" # [alert/bg]: notices such as "this address already has an account"
  warning-foreground: "#5E4200" # [alert/ink], 8.7:1
  warning-border: "#F0DBA8" # [alert/line]
  border: "#E0E8E4" # [border/line]: hairlines and card edges, decoration only
  input: "#7D8C87" # [text/faint]: field edges, 3.5:1 on white (3:1 needed for a control); never text
  ring: "#155E4E" # focus ring, 7.1:1 on the wash
  signature: "#C6E67A" # young rice [accent/lime-300]: the active tab, discount and stock chips, the step in progress
  signature-foreground: "#2C4709" # [accent/lime-ink], 7.5:1
typography:
  # Be Vietnam Pro for everything people read; Bricolage Grotesque for big titles, prices and figures
  # (70%, -63%, 45.000đ). Both cover Vietnamese; chosen on 19 October 2026 with the Mobile v2 design,
  # replacing Inter (SEC-22).
  label:
    fontFamily: "Be Vietnam Pro"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "17px"
  body-sm:
    fontFamily: "Be Vietnam Pro"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "21px"
  body-sm-strong:
    fontFamily: "Be Vietnam Pro"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: "21px"
  body:
    fontFamily: "Be Vietnam Pro"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
  title:
    fontFamily: "Be Vietnam Pro"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: "22px"
  headline:
    fontFamily: "Be Vietnam Pro"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: "25px"
  price:
    fontFamily: "Bricolage Grotesque"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: "24px"
  display:
    fontFamily: "Bricolage Grotesque"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: "34px"
rounded:
  # Named like Tailwind and shadcn: `lg` is the base radius shadcn's controls use, `xl` its cards.
  sm: "8px"
  md: "12px" # thumbnails, small icon tiles
  lg: "14px" # inputs, segmented controls
  xl: "16px" # buttons, small cards
  2xl: "20px" # cards and sheets
  3xl: "24px"
  4xl: "32px"
  full: "9999px" # pills, chips and round icon buttons
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "6": "24px"
  "8": "32px"
elevation:
  # Shadow layers, outermost first; a colour with alpha is #RRGGBBAA. White cards on the wash need none:
  # only what floats over content casts one.
  card:
    - { x: 0, y: 1, blur: 2, spread: 0, color: "#0E1D190A" }
  sheet:
    - { x: 0, y: -4, blur: 24, spread: 0, color: "#0E1D191F" }
components:
  band:
    backgroundColor: "{colors.signature}"
    textColor: "{colors.signature-foreground}"
    typography: "{typography.body-sm-strong}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  band-sold-out:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.body-sm-strong}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  band-expected:
    textColor: "{colors.link}"
    typography: "{typography.body-sm-strong}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  offer-card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.2xl}"
    padding: "14px"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.xl}"
    height: "52px"
---

<!-- This frontmatter is the source of the tokens. web/src/styles/tokens.css and the Flutter theme follow it with the same names in the same change; the Figma file mirrors it and is updated after (docs/guidelines/figma.md). Tracked in SEC-22. -->

# Design System: Second Bite

## Overview

**Creative North Star: "Bữa tối còn nóng" (tonight's food, still warm)**

Adopted on 19 October 2026 from the Mobile v2 design in the team's Figma file ("Secondbite"), which replaced the earlier kraft-and-rubber-band direction. The interface borrows what Vietnamese customers already know from ShopeeFood, foodpanda and Grab, so nothing has to be learnt: a white top bar, white cards on a pale mint wash, one deep green for actions, and young-rice lime only where the eye should land.

**Key Characteristics:**
- Pale mint ground, white cards, deep green actions, lime accents used sparingly.
- Each offer card has one bitten corner at its top right, the product's mark, and never more than one.
- Real photographs of the food, never illustrations or decorative stickers.
- Price hierarchy: new price large in Bricolage Grotesque, old price small and struck through, the discount in a lime chip.

## Colors

### Primary
- **Deep Green** (`primary`): primary buttons and the bottom bar's active label. `primary-hover` is the pressed button.
- **Leaf Link** (`link`, `success`, `ring`): text links, secondary actions ("Đổi", "Chỉ đường"), completed steps, the focus ring.

### Accent
- **Young Rice** (`signature`): the active tab of the bottom bar, the step in progress, discount and stock chips, the send button. Never a large fill.

### Neutral
- **Mint Wash** (`background`): the page ground.
- **White** (`card`, `shell`, `popover`): cards, the top bar, sheets, inputs, dialogs.
- **Ink** (`foreground`): all body text.
- **Muted** (`muted-foreground`): secondary text, on white, the wash or `muted`.
- **Quiet Green** (`secondary`, `muted`, `accent`): segmented controls, chips, quiet buttons, and the hover fill of menus and outline buttons.
- **Hairline** (`border`): dividers and card edges, decoration only.
- **Field Edge** (`input`): input outlines. It is too weak for text, placeholders included; they use `muted-foreground`.

### Status
- **Error** (`destructive`): wrong codes, refused and cancelled states, always with an icon or label.
- **Notice** (`warning`, `warning-foreground`, `warning-border`): explanations the person must read before going on.

### Named Rules
**The Lime Rule.** Lime marks the one thing to look at; it never covers a large area.

**The Faint Rule.** `input` (the Figma `text/faint`) reaches only 3.5:1 on white: field edges only, never text.

## Typography

**Body Font:** Be Vietnam Pro, static weights 400, 500, 600 and 700 with the Vietnamese subset.
**Display Font:** Bricolage Grotesque, variable, for big titles, prices and figures.

### Hierarchy
- **Display** (Bricolage 700, 28px, 34px): screen titles such as "Đăng nhập để đặt món".
- **Headline** (600, 18px, 25px): section titles; the top bar's title.
- **Price** (Bricolage 700, 18px, 24px): the new price.
- **Title** (600, 16px, 22px): the dish name, at most two lines.
- **Body** (400, 16px, 24px): running text and input values.
- **Body small** (400 or 600, 14px, 21px): supporting lines, the old price, chip labels.
- **Label** (400, 12px, 17px): helper text, timestamps, the legal line.

### Named Rules
**The Diacritics Rule.** Line height is at least 1.4 for running text, and no text box clips stacked marks (Ầ, Ẫ, Ổ).

## Layout

Mobile at 390px is the source frame; desktop is derived from it. Side margins 16px (20px on forms), 12–14px between blocks. Spacing follows a 4px scale. Text layers hug or fill and never take a fixed width, because Vietnamese runs 20–30% longer than English. Touch targets are at least 44px; primary buttons are 52px tall and full width.

## Elevation & Depth

Flat: white cards on the mint wash need no shadow beyond a 1px hint (`elevation.card`). Only what floats over content, a bottom sheet, casts a real one (`elevation.sheet`).

## Shapes

Cards and sheets 20px (`rounded.2xl`), buttons 16px (`rounded.xl`), inputs and segmented controls 14px (`rounded.lg`), chips and icon buttons fully round.

## Components

### Band (stock chip)
The lime chip on an offer card. Variants: **Available** ("Còn 2"), **Sold out** (quiet green, muted text: "Đã hết"), **Expected** (link-coloured text: the seller has announced surplus that cannot be ordered yet). The label is always text, never colour alone.

### Offer card
White card, 20px corners, one bitten corner at the top right: photograph with the discount chip, seller with a round avatar and rating, dish name (Title), pickup window and floor (Body small, Muted), price row (Price, old price struck through), and the Band.

### Primary button
Deep green, white label, 52px tall, full width, 16px corners. One per screen, in the content or in a white bottom bar.

## Do's and Don'ts

### Do:
- **Do** bind every colour, radius and gap to a token; a literal value on a screen is a defect.
- **Do** give every seller a round avatar, never initials alone where a photo exists.
- **Do** use real photographs of real kinds of food from the pilot's sellers, labelled as samples until the pilot has its own.

### Don't:
- **Don't** set text in `input` (`text/faint`).
- **Don't** cover large areas in lime, or put more than one bitten corner on a card.
- **Don't** use decorative stickers, dotted textures or busy patterns.
- **Don't** describe food as thừa, tồn, thanh lý or giải cứu anywhere in the interface.
