# SEC-49 — Flow 1 "open the app, look around" on the web: design

Status: decided with the owner on 20 October 2026 and built the same day ([plan](plan.md)). Tracked in Linear as SEC-49, stacked on SEC-48 (the Tasco blue tokens).

## What a person can do

- **Open the home** and see tonight's dishes at Tasco Mall: the deal card, "Sắp hết giờ nhận" as a row of large cards, then "Tất cả món quanh đây". Each card names the dish, never the seller (Figma Mobile v3 K1, K1b).
- **Choose where to look** from the place on the header (Figma K1a): Tasco Mall, the default, or their own place. The browser asks permission itself; on the phone this is the system prompt of Figma K1c. Around their place the cards show how far each dish is, and when nothing is posted there the home says so and shows what Tasco Mall has (Figma K1e).
- **Search** on a page of its own (`/search`, Figma K2): the words typed in the header land there. Dishes are grouped by seller, with or without words, one large card and three more, a seller with one dish a small card two to a row (Figma K1f); there are no "Món / Quán" tabs (owner, 20 October 2026). Chips narrow by distance (around their place only), a price range, a time range or collect now, and kind, and a short link changes the order. While the field is empty and focused, the recent searches and the kinds open under it (Figma K2a).
- **Open a dish** (`/offers/{id}`, Figma K4) from any card: its photograph, the seller with "Xem quán", the kind and portion, the window, the seller's rating, the description and the seller's other dishes tonight, and a fixed bar with the price and "Thêm vào giỏ".
- **Open a seller** (`/sellers/{id}`, Figma K4b) from "Xem quán": their dishes tonight as photographs, their rating, tonight's window and how to get there, tabs by kind when they sell more than one, and each dish with a − and + that stops at the portions left; "Quán chưa có món tối nay" when nothing is posted.
- **Fill a cart and confirm it** (`/cart`, Figma K5): one seller's dishes, where and when to collect them, how to pay at the counter, the totals and the cancellation policy. Adding a dish of another seller asks first (Figma K4c).

## Decisions

### 1. Cards follow Figma Mobile v3

Decided with the owner on 20 October 2026. The discount is a Deal Blue label in the photograph's corner and the portions left are red words under it ("Còn 2 phần"). This replaces the lime stock sticker and discount chip of SEC-22; DESIGN.md's One Label and One Discount rules say so, and `sale` is the red role, kept apart from `destructive` because it means "hurry", not "error".

### 2. Built only from what `GET /offers` gives

Every element shows a value the API returns, as the [Honest Number Rule](../../../../DESIGN.md#named-rules) asks. Left out until their backend exists: "Sắp có tối nay" with its bell and the K1d sheet (announcements and following, SEC-11 steps 5 and 6), "Gợi ý cho bạn", the heart and Yêu thích, the rating badge, the floor ("Tầng 3"), the seller's page ("Xem quán"), and K2a's "Phổ biến ở Tasco Mall", whose popularity nothing measures; the kinds take its place.

### 3. The place and the filters live in the address

`near` (three decimals of a degree, about 110 m) and the chips' values are query parameters, as the kinds already were: a filtered page can be shared, works with the back button and renders on the server. The recent searches are a per-browser convenience in `localStorage`.

### 4. One set of components

The screens are composed from shared pieces: `OfferCard` (with `showSeller`), `OfferRow`, `OfferList`, `DiscountLabel`, `UnitsLeft`, `OfferPhoto`, `DishTile` and `SellerGroup` in `features/offers`; `AreaSheet` in `features/home`; `SearchBar`, `FilterMenu`, `SearchFilters` and `SearchResults` in `features/search`; `DishDetails`, `SellerPage`, `SellerLogo` and `DishLink` in `features/offers`; the cart, its `QuantityStepper`, `CartBar` and `Checkout` in `features/cart`; `BackButton` and `ChoiceOption` in `components`. shadcn primitives gained the variants the design needs (the chip and inline menu triggers, the chip button, the sky search field, the sheet's corners and title) rather than being restyled where they are used.

### 5. The rest of flow 1 is drawn against the test backend

Decided with the owner on 20 October 2026, replacing decision 2 for these parts: "Sắp có tối nay" with its bell and the K1d sheet, "Gợi ý cho bạn", the rating, the heart and the seller's place on a search card. The contract is generated from the Go server, so the web does not add to it: the fields the backend lacks are one hand-written type, `features/offers/proposed.ts`, as SEC-11 already describes them (announcements join `GET /offers` with `status: "announced"` and `estimatedUnits`; a seller's `rating` has no step yet). The stub backend returns them. Every element they feed shows only when its field is there, so staging and production show none of it until the backend returns them, and the Honest Number Rule holds. Following an announcement and hearting a dish are kept in the browser until SEC-11 step 6 and accounts keep them. "Gợi ý cho bạn" is the best-rated sellers' dishes that can still be ordered. The seller's place is the `address` `GET /offers` already returns. The home's chips are the search's own, and each choice opens the search.

### 6. Price and time are ranges

Decided with the owner on 20 October 2026: fixed price steps ("Dưới 30.000đ") are not how people choose. The price and the time to collect are each a range, "từ … đến …", either end optional. `GET /offers` gained `minPrice` beside `maxPrice` (SEC-11's search, 400 when the lowest is above the highest). The times are times of day tonight in Vietnam, sent as `collectFrom` and `collectTo`. In the address they are `minPrice`, `maxPrice`, `from` and `to`; a range out of order is ignored.


### 7. Dish, seller and a cart kept in the browser

Decided with the owner on 20 October 2026. K4, K4b, K4c and K5 are built from what the API returns today:

- K4 reads `GET /offers/{id}` for the seller, then `GET /offers?sellerId=` for the seller's name, place and other dishes, since the offer itself carries only `sellerId`. K4b reads the same search; `GET /sellers/{id}` is for the seller's own people. A seller with nothing tonight has no page to show but "Quán chưa có món tối nay".
- The cart is kept in `localStorage` until orders exist (SEC-15): one seller per cart, and never more of a dish than its portions left. Adding a dish of another seller opens K4c's sheet, which empties the cart or keeps it. "Xem giỏ hàng" opens K5; "Đặt món" is shown but sends nothing, as there is no endpoint for an order and signing in at checkout (L5) is not built.
- Left out because nothing returns them: the review count and "Khách nói gì về món này", "Theo dõi", the seller's own menu sections (tabs follow the kinds instead), and the map picture on K5. The seller's rating stays, as decision 5 has it. The Figma frames keep the full design.
