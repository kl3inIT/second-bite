# SEC-79 — The seller's web on a phone: design

Status: started on 21 October 2026. Tracked in Linear as SEC-79, a child of [SEC-57](../sec-57-seller-web/design.md). The screens are drawn in Figma `Chủ quán · Mobile 390` (page `Mobile · Khách`), derived from `Chủ quán · Web 1440` ([SEC-53](../sec-53-seller-web-design/design.md)); the 1440 frames are unchanged.

## Decision

On a phone (below `md`, 768 px) the seller's pages look and behave like the app, not like a squeezed desktop page: the same header, the same floating bottom bar, sheets from the bottom, and screens that push with a back button. From `md` up nothing changes. The words, the rules and the data stay the same; only the layout differs, so there is no new string and no new endpoint.

The sources of the layout are the customer app's own frames (K1 home, Q2a settings, Q10 seller orders, 7a and 7b sign-in) and Mobbin (Shopify seller and Shopee seller for the store switcher and the order counts, Snoonu for the sheet rising over the header). The Figma frames were reviewed by the founder on 21 October 2026.

## The rules of the phone layout

| Part | On a phone |
| --- | --- |
| Header | Blue, no wordmark: the store switcher (avatar, name, chevron; it leads to the person's stores, as the capsule does today) and the language button, then the tab's name in white, and the page's one main action (Đăng món, Thêm món) as a `secondary` button in the same row |
| Page | A sheet with 24 px top corners that rises over the header's foot, 16 px sides, cards with 16 px padding |
| Tabs | The four tabs (Trang chủ, Bài đăng, Danh mục, Đơn) leave the header and become the floating bottom bar of the customer screens, with the seller's four tabs and their Lucide icons (`house`, `megaphone`, `utensils`, `receipt-text`); the page ends 96 px above the bottom so the bar never covers it |
| Rows | A row with two actions stacks: photo and text, then the actions as equal-width buttons. A row of an order stacks in three: photo and customer, units and amount, then the buttons |
| Search and day | Two rows: the search field, then the day bar (previous, the day, next) |
| Chips | Wrap onto a second line; none is cut |
| Drawers | A sheet from the bottom, 24 px top corners, header 16 px, body scrolling, the buttons fixed at the foot and equal width |
| Dialogs | Centred, 16 px from each side, the two buttons equal width |
| Calendar | A sheet from the bottom |
| Toasts | 16 px from the sides, above the bottom bar |
| Forms (open a store, add or edit a dish), and my stores | A pushed screen: the web's white top bar with a back button (DESIGN.md › White Shell; the app's blue Top bar of the Figma frames is the app's own), fields 16 px from the sides, the buttons fixed at the foot, equal width |
| Sign-in | Unchanged: the web's own phone layout (SEC-56) already is a top bar, the title and the form; the app's 7a and 7b are the same flow |
| Entry | A row "Mở quán" on the account screen (from `md` the header's capsule does it) leads to "Quán của tôi": the list of the person's stores, or the empty card |

Touch targets stay 44 px or more; the bottom bar and its labels follow `DESIGN.md › Bottom bar`.

## What is built

The screens `main` already has: sign-in, open a store, my stores, the store's header and tabs, home, posts (Đang bán, Đã hết, Đã đóng), posting, editing and withdrawing, the catalog and the Đơn tab with its cancel dialog and day calendar. The frames that need the backend of [SEC-54](../sec-57-seller-web/design.md#what-waits) (expected surplus: P4, P7 to P9, Q1b, Q2c, Q2d, D2, D3, E4, R2) are drawn but not built, as on the desktop; they follow the desktop.

## Not done here

The Flutter app, the customer screens, and any new capability. Search and day on Bài đăng and the weekly schedule card stay as the desktop has them.

## How it is checked

Each slice is a pull request checked by CI: `pnpm check`, and the browser tests, which already run on a phone (Pixel 7) and a desktop and check each page with axe. A test per slice opens the page on a phone and checks what the layout promises: the bottom bar is there and the tabs are not in the header; on a desktop the reverse. The founder reviews the staging site on a phone, which is the check that matters.
