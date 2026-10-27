# SEC-135 — Every order for admins, and an order's page: design

Status: started on 22 October 2026. Tracked in Linear as SEC-135, under SEC-62, on the branch it shares with [SEC-134](../sec-134-admin-posts/design.md). The screens are Figma AD-DH1 to AD-DH5 (section "Quản trị · Web 1440"), compared with the references in [the research of 21 October](../../../research/2026-10-21-admin-orders.md). The backend is the `order` module ([spec](../../../specs/order.md)).

## What an admin can do

- Open "Đơn hàng" from the menu, under "Vận hành", after "Bài đăng", and see every store's orders, the latest window first, 10 to a page by default.
- See how many orders were collected ("Đã nhận"), are still to collect ("Đang chờ nhận": confirmed and ready) and expired ("Hết hạn"), and press a card to list only those; pressing it again lists every order. The cards follow the other filters.
- Find orders by their number (`SB-24831` or `24831`), the customer's name or phone, or the store's name, with or without marks; keep one store's; keep the orders collected on a range of days ("Ngày nhận", the window's start); choose 10, 25 or 50 rows; move between pages. Every choice is in the address.
- Open an order's page from its number (AD-DH3, AD-DH5): its number and status, a link to its store, a strip with what it comes to, its units, its window and how long the store still holds it; its lines with their prices and discount; its history; who collects it, the store and where it is collected.

## Decisions

- **One read, as the stores' and the posts' lists.** `GET /admin/orders` answers a page, its total and the count of each status, with the filters as query parameters, as `GET /admin/sellers` does. The status is read as every read of an order reads it: one confirmed or ready whose window is over is expired, whether `ExpireEnded` has stored it yet or not.
- **The day is the collection day**, the window's start, as the seller's own list goes by it (`?day=`); the research found orders placed and collected the same evening.
- **The module folds its own words.** A generated `search_text` holds the number with and without `SB-`, the customer's name and phone and the seller's name through `order_fold`, the same body as `seller_fold`; a module does not call another's function. A query is matched with `LIKE` and its pattern characters escaped. The list runs across sellers by the window, so the window's start is indexed; the seller's index serves one seller only.
- **The items are the order as `GET /orders/{orderId}` answers it**, with its lines, so the list and the page read one body. The list selects `GetOrder`'s columns and converts each row to it.
- **The page reads the existing calls.** `GET /orders/{orderId}` already answers admins; the store's phone and status come from `GET /sellers/{sellerId}`. The time left is counted on the reader's clock.
- **Only what the backend allows** (as [SEC-57](../../active/sec-57-seller-web/design.md), SEC-62 and SEC-134 did):

  | In Figma | Why it is not on the web |
  | --- | --- |
  | "Huỷ đơn" with a reason and a note (AD-DH4) | No admin API: `cancelOrder` is the customer's, and the spec says admins read but never act for a seller. Drawn only |
  | "Ghi nhận vi phạm" (AD-DH5) | No such record or consequence has been decided; the research found no reference that automates it |
  | The customer's email and earlier orders (AD-DH3) | `GET /orders/{orderId}` does not return the account; the account's page (SEC-75) shows its history |
  | The trend lines under the counts (AD-DH1) | They need a series by day, a second query the list does not make |
  | Sorting by store, total or window (AD-DH2) | The list keeps one order, the latest window first |
  | The pager "‹ 1/5 ›" through the list on an order's page (AD-DH4) | The page is read from its address alone; the list is one step back |

## Contract

| Call | Used for |
| --- | --- |
| `GET /admin/orders?status=&q=&sellerId=&collectSince=&collectUntil=&page=&size=` | The page, its total and the counts; `ORDER_ADMIN_LIST_INVALID` (400) for a bad filter |
| `GET /admin/sellers?sort=name&size=100` | The stores the "Cửa hàng" filter offers |
| `GET /orders/{orderId}` | An order's page; 400 or 404 is the not-found page |
| `GET /sellers/{sellerId}` | The store's phone and status on an order's page |
