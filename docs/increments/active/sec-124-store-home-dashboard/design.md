# SEC-124 — The store's home as a day's dashboard: design

Status: started on 21 October 2026, tracked in Linear as SEC-124, a child of [SEC-57](../sec-57-seller-web/design.md). The screens are drawn in Figma: `Q1b-1` and `Q1b-2 · Web 1440 · Quán · Trang chủ · Dashboard` in `Chủ quán · Web 1440`, and `Q1b-1` to `Q1b-3 · Mobile 390` in `Chủ quán · Mobile 390` (page `Mobile · Khách`). They replace the earlier Q1b, the morning "Hôm nay có dư không?" card, which stays on the post tab (Q2d) with [SEC-54](../sec-57-seller-web/design.md#what-waits). Q1, the home of a store with no post yet, is unchanged.

## Decision

The home becomes the seller's view of a day: a short overview at the top, what to do now, then a few rows each of the day's orders, posts and catalog, every card leading to its tab. It reads only what the API already serves (`GET /sellers/{id}/orders?day=`, `/offers`, `/dishes`, the seller itself), so there is no new endpoint and no figure that is not the store's own data (PRODUCT.md: no invented counters).

The sources are the research of 21 October 2026 (Linear's seller issues, the order and offer specs, the sponsor's sheet) and Mobbin: Etsy's Shop Manager for the greeting and the stats row on a computer, Shopee's My Shop for the order counts and the coloured header on a phone, eBay's Selling for one large post action.

## What the page shows

| Part | Computer (from `md`) | Phone |
| --- | --- | --- |
| Store | A blue card: the store's photo, its status (Đang mở, Chờ duyệt, Bị từ chối, Bị khóa), name and address, "Xem trang quán" (the customers' page, `/sellers/{id}`) and "+ Đăng món" | The header's "Trang chủ"; a round "+" (Button `icon-lg`, named "Đăng món") fixed over the bottom bar |
| Status | An alert when the store is not open, with the admin's reason (SEC-64, SEC-71) | The same |
| Overview | "Tổng quan trong ngày" and the day bar of the Đơn tab, then four figures in a row | The day bar alone, the figures two by two |
| What to do | Today only, when orders are being prepared: "N đơn chờ báo sẵn sàng" and "Xem đơn" | The same, the button below |
| Orders | The chips of the Đơn tab, each a link to that tab and day, and up to three orders being prepared with their buttons | The same, rows stacked as on the Đơn tab |
| Posts and catalog | Two cards side by side: up to three of the day's posts with a badge (Còn N, Đã hết, Hết giờ, Đã rút), and up to three dishes with "Đăng ngay", or "Hiện món" on a hidden one | One under the other |

The figures, for the day in the address (`?day=`, today when absent, as on the Đơn and Bài đăng tabs):

- **Đơn đang giữ**: orders being prepared or ready; under it, how many are ready.
- **Tiền đã thu**: the total of the orders handed over (cash at the counter); under it, the total of those still held.
- **Suất đã bán**: units ordered of units posted, over the day's posts that were not withdrawn; under it, the units still on sale.
- **Khách không đến**: orders refused as not come, not answering or late, and orders that expired; under it, the day's orders.

A post belongs to the day its window opens, as on the post tab (SEC-95); the old home counted the posts created that day, which could disagree with the tab.

## Not done here

Figures over several days, ratings, followers, page views and food saved in kilograms (they need the backend, SEC-80, SEC-82); the "Hôm nay có dư không?" card (SEC-54); a live update of new orders (SEC-117).

## How it is checked

`pnpm check` with a unit test of the day's sums (`store-summary.test.ts`), and a browser test (`store-home.spec.ts`) on a phone and a desktop against the stub backend: the figures of a store with orders, the links to the Đơn tab, another day with nothing to do, and the catalog's two actions, each page checked with axe.
