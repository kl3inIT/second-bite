---
name: Second Bite
description: A second chance for good food.
colors:
  background: "#CDAA7D"
  foreground: "#1C1A17"
  card: "#FFFFFF"
  card-foreground: "#1C1A17"
  primary: "#1F5A32"
  primary-foreground: "#FFFFFF"
  primary-hover: "#184A28"
  shell: "#1F5A32"
  shell-foreground: "#FFFFFF"
  secondary: "#E6EFE8"
  secondary-foreground: "#1C1A17"
  muted: "#F4EEE6"
  muted-foreground: "#6B635A"
  accent: "#E6EFE8"
  accent-foreground: "#1C1A17"
  destructive: "#B42318"
  destructive-foreground: "#FFFFFF"
  border: "#E4D7C5"
  input: "#857A6E"
  ring: "#1F5A32"
  signature: "#C93468"
  signature-foreground: "#FFFFFF"
typography:
  # Inter is a stand-in until the typeface is chosen (SEC-22); it covers Vietnamese.
  label:
    fontFamily: "Inter"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: "18px"
  body-sm:
    fontFamily: "Inter"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
  body-sm-strong:
    fontFamily: "Inter"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: "20px"
  body:
    fontFamily: "Inter"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
  title:
    fontFamily: "Inter"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: "24px"
  price:
    fontFamily: "Inter"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: "26px"
  headline:
    fontFamily: "Inter"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: "28px"
  display:
    fontFamily: "Inter"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: "32px"
rounded:
  sm: "6px"
  md: "10px"
  lg: "16px"
  full: "9999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "6": "24px"
  "8": "32px"
components:
  band:
    backgroundColor: "{colors.signature}"
    textColor: "{colors.signature-foreground}"
    typography: "{typography.body-sm-strong}"
    rounded: "{rounded.sm}"
    padding: "4px 12px"
  band-sold-out:
    backgroundColor: "{colors.muted-foreground}"
    textColor: "{colors.card}"
    typography: "{typography.body-sm-strong}"
    rounded: "{rounded.sm}"
    padding: "4px 12px"
  band-expected:
    textColor: "{colors.signature}"
    typography: "{typography.body-sm-strong}"
    rounded: "{rounded.sm}"
    padding: "4px 12px"
  offer-card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.lg}"
    padding: "12px 16px 16px"
---

<!-- This frontmatter is the source of the tokens. web/src/styles/tokens.css and the Flutter theme follow it with the same names in the same change; the Figma file "Second Bite — Product UI" mirrors it as `Theme` and `Scale` variables and text styles and is updated after (docs/guidelines/figma.md). Tracked in SEC-22. -->

# Design System: Second Bite

## Overview

**Creative North Star: "Gói mang về" (the take-away parcel)**

Every portion of surplus food is a Hanoi take-away parcel: wrapped in banana leaf or kraft paper, tied with a pink rubber band, price and pickup time written on it by hand. The world borrows from xôi, bánh giò and cơm hộp sold to go, so food looks like food someone packed for you tonight, never like stock on clearance.

The interface is calm and dense enough for one-handed use at the end of a shift. A banana-leaf green shell frames the screen; white cards sit on a real kraft-brown ground like labels stuck on a parcel; one pink band per card carries the two facts that matter most, the pickup window and how many portions are left.

**Key Characteristics:**
- Kraft-brown ground, white cards, banana-leaf green shell and actions.
- One pink rubber band per card, always in the same place, carrying window and stock.
- Real photographs of the food, never illustrations.
- Price hierarchy by size alone: new price large, old price small and struck through.

## Colors

Warm, material colours taken from the parcel: leaf, paper, band and ink.

### Primary
- **Banana Leaf** (`primary`, `shell`): the top bar and bottom tab bar, primary buttons, prices, links and the focus ring. `primary-hover` is the pressed or hovered leaf.

### Secondary
- **Leaf Wash** (`secondary`, `accent`): selected chips and soft highlights behind ink text.

### Tertiary
- **Rubber Band Pink** (`signature`): the band on each offer card and nothing else. White text on it reaches 5:1.

### Neutral
- **Kraft Paper** (`background`): the page ground under the cards. It is a real brown, not a cream.
- **Label White** (`card`): cards, sheets, inputs, dialogs.
- **Marker Ink** (`foreground`, `card-foreground`): all body text.
- **Pencil** (`muted-foreground`): secondary text, on white only.
- **Paper Fold** (`border`): hairlines and dividers on white.
- **Field Edge** (`input`): input outlines, 4:1 against white.
- **Tissue** (`muted`): quiet fills inside cards.
- **Stamp Red** (`destructive`): errors, cancelled and refused states, always with an icon or label.

### Named Rules
**The Label Rule.** Secondary text (`muted-foreground`) sits only on white; on kraft it falls to 2.7:1. Text placed directly on kraft is `foreground` ink.

**The One Band Rule.** Pink appears once per card, as the band. Never as a button, a link, a badge or a text colour on kraft.

**The Real Kraft Rule.** The ground stays a true kraft brown. Lightening it toward cream turns the world into the generic warm-beige app.

## Typography

**Body Font:** Inter (stand-in until the typeface is chosen; it must cover Vietnamese diacritics)

**Character:** a plain, legible sans that lets the photographs and the band carry the personality.

### Hierarchy
- **Display** (700, 24px, 32px): screen titles.
- **Headline** (700, 20px, 28px): section titles on home and order screens.
- **Price** (700, 18px, 26px): the new price on a card, in Banana Leaf.
- **Title** (600, 16px, 24px): the dish name, at most two lines.
- **Body** (400, 16px, 24px): running text.
- **Body small** (400 or 600, 14px, 20px): the old price, the band label, supporting lines.
- **Label** (500, 12px, 18px): the seller name and floor above the dish name.

### Named Rules
**The Diacritics Rule.** Line height is at least 1.4 for running text, and no text box clips stacked marks (Ầ, Ẫ, Ổ).

## Layout

Mobile at 390px is the source frame for app screens; desktop is derived from it. Spacing follows a 4px scale (`spacing` 1–8). Text layers hug or fill and never take a fixed width, because Vietnamese runs 20–30% longer than English. Touch targets are at least 44px.

## Elevation & Depth

Depth is a label stuck on paper: cards lift slightly off the kraft with one soft warm shadow (0 2px 6px, brown at 18%). The band has its own small shadow and a 1px highlight on its top edge, so it reads as rubber wrapped over the card. Nothing else casts a shadow.

## Shapes

Generous rounding on cards (`rounded.lg`, 16px), small rounding on the band (`rounded.sm`, 6px), full rounding on chips. Photographs fill the top of a card and share its top corners.

## Components

### Band (signature)
The rubber band on an offer card. Variants: **Available** (pink, white text: "Lấy 21:00–21:45 · còn 3"), **Sold out** (Pencil fill, white text: "Đã hết"), **Expected** (dashed pink outline, pink text on white: the seller has announced surplus that cannot be ordered yet). The label is always text, never colour alone.

### Offer card
White card on kraft: photograph (150px tall), then seller and floor (Label, Pencil), dish name (Title, two lines at most), price row (Price in Banana Leaf, old price struck through), and the Band. Padding 12px top, 16px sides and bottom; 8px between rows.

## Do's and Don'ts

### Do:
- **Do** bind every colour, radius and gap to a token; a literal value on a screen is a defect.
- **Do** keep window and stock in the band, in the same place on every card.
- **Do** use real photographs of real kinds of food from the pilot's sellers, labelled as samples until the pilot has its own.

### Don't:
- **Don't** put `muted-foreground` text, `primary` body text or anything pink on the kraft ground.
- **Don't** use more than one band per card, or pink for anything but the band.
- **Don't** show discount badges or "save X%"; the struck-through old price is enough.
- **Don't** describe food as thừa, tồn, thanh lý or giải cứu anywhere in the interface.
