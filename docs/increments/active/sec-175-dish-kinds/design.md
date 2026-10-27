# SEC-175 — More kinds of dish, and a name for the kind Khác: design

## What a seller can do

- Choose among nine kinds when adding a dish or posting one: the six that exist, and three more, `dessert` (Tráng miệng), `snacks` (Ăn vặt) and `produce` (Rau củ quả). The chips run on to a second row, so the last one no longer leaves a gap.
- Choose "Khác" and name the dish's kind in a field that opens under the chips, up to 30 characters ("Chè", "Mứt tết"). The name stands where the kind's name stood: in the catalog, in the drawer's summary and in the withdraw sheet.

## Decisions

- **The name is a column, not a new kind per word.** `kind_label` on `offer_dishes` and `offer_offers`, empty by default. It holds a text only when the kind is `other` (a check in the database and a rule in `kindLabelValid`), so no other kind carries a stray word.
- **A change of kind takes the name away.** A change that moves a dish to another kind without a `kindLabel` empties the name; one that gives a name keeps it for the validation to judge.
- **The filters stay on the kinds.** Search and the home's picker filter by the nine kinds; the name is shown, never searched or filtered by.
- **Pictures are reused.** The three new kinds borrow the pictures of cakes, noodles and vegetables until the design draws their own.

## Contract

`kind` gains `dessert`, `snacks` and `produce` in every body that has it and in `GET /offers?kind=`. Dish and offer bodies gain `kindLabel` (text, up to 30, empty unless the kind is `other`); the create and change bodies take it, and a change leaves it as it is when absent.

## Data

Migration `0038_offer_add_kinds_and_kind_label.sql` widens the kind check of both tables and adds `kind_label`.

## Failure behavior

A name on another kind, or one over 30 characters, answers `OFFER_DETAILS_INVALID`.

## Verification plan

`TestOffer` › sellers name the kind other; `TestOpenAPIDocumentIsCurrent`; the browser test of a dish of the kind Khác on CI.

## Not here

Pictures of the three new kinds, and searching by the name.
