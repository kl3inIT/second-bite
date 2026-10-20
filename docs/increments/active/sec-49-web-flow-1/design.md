# SEC-49 — Flow 1 "open the app, look around" on the web: design

Status: decided with the owner on 20 October 2026 and built the same day ([plan](plan.md)). Tracked in Linear as SEC-49, stacked on SEC-48 (the Tasco blue tokens).

## What a person can do

- **Open the home** and see tonight's dishes at Tasco Mall: the deal card, "Sắp hết giờ nhận" as a row of large cards, then "Tất cả món quanh đây". Each card names the dish, never the seller (Figma Mobile v3 K1, K1b).
- **Choose where to look** from the place on the header (Figma K1a): Tasco Mall, the default, or their own place. The browser asks permission itself; on the phone this is the system prompt of Figma K1c. Around their place the cards show how far each dish is, and when nothing is posted there the home says so and shows what Tasco Mall has (Figma K1e).
- **Search** on a page of its own (`/search`, Figma K2): the words typed in the header land there. Dishes with words are large cards naming their seller; without words they are grouped by seller, one large card and three more (Figma K1f); the "Quán" tab opens each seller's block (Figma K2c). Chips narrow by distance (around their place only), highest price, collect now and kind, and a short link changes the order. While the field is empty and focused, the recent searches and the kinds open under it (Figma K2a).

## Decisions

### 1. Cards follow Figma Mobile v3

Decided with the owner on 20 October 2026. The discount is a Deal Blue label in the photograph's corner and the portions left are red words under it ("Còn 2 phần"). This replaces the lime stock sticker and discount chip of SEC-22; DESIGN.md's One Label and One Discount rules say so, and `sale` is the red role, kept apart from `destructive` because it means "hurry", not "error".

### 2. Built only from what `GET /offers` gives

Every element shows a value the API returns, as the [Honest Number Rule](../../../../DESIGN.md#named-rules) asks. Left out until their backend exists: "Sắp có tối nay" with its bell and the K1d sheet (announcements and following, SEC-11 steps 5 and 6), "Gợi ý cho bạn", the heart and Yêu thích, the rating badge, the floor ("Tầng 3"), the seller's page ("Xem quán"), and K2a's "Phổ biến ở Tasco Mall", whose popularity nothing measures; the kinds take its place.

### 3. The place and the filters live in the address

`near` (three decimals of a degree, about 110 m) and the chips' values are query parameters, as the kinds already were: a filtered page can be shared, works with the back button and renders on the server. The recent searches are a per-browser convenience in `localStorage`.

### 4. One set of components

The screens are composed from shared pieces: `OfferCard` (with `showSeller`), `OfferRow`, `OfferList`, `DiscountLabel`, `UnitsLeft`, `OfferPhoto`, `DishTile` and `SellerGroup` in `features/offers`; `AreaSheet` in `features/home`; `SearchBar`, `FilterMenu`, `SearchFilters`, `ResultTabs` and `SearchResults` in `features/search`. shadcn primitives gained the variants the design needs (the chip and inline menu triggers, the chip button, the sky search field, the sheet's corners and title) rather than being restyled where they are used.

### 5. The rest of flow 1 is drawn against the test backend

Decided with the owner on 20 October 2026, replacing decision 2 for these parts: "Sắp có tối nay" with its bell and the K1d sheet, "Gợi ý cho bạn", the rating, the heart and the seller's place on a search card. The contract is generated from the Go server, so the web does not add to it: the fields the backend lacks are one hand-written type, `features/offers/proposed.ts`, as SEC-11 already describes them (announcements join `GET /offers` with `status: "announced"` and `estimatedUnits`; a seller's `rating` has no step yet). The stub backend returns them. Every element they feed shows only when its field is there, so staging and production show none of it until the backend returns them, and the Honest Number Rule holds. Following an announcement and hearting a dish are kept in the browser until SEC-11 step 6 and accounts keep them. "Gợi ý cho bạn" is the best-rated sellers' dishes that can still be ordered. The seller's place is the `address` `GET /offers` already returns. The home's chips are the search's own, and each choice opens the search.
