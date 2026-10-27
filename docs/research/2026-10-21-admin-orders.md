# Orders for admins: the list, the detail and what an admin may do

Studied on 21 October 2026, before the admin's orders screens (SEC-13, first part). The founder asks that admins "xem đơn" and handle problems ([requirements](../brief/second-bite-app-requirements-it.md), slides 2 and 10); Figma draws five frames, AD-DH1 to AD-DH5, in the section "Quản trị · Web 1440". This note compares them with what `order` serves today and with how comparable products let their staff see and act on orders.

Each repository was cloned into the git-ignored `.tmp/` and read, not run; paths are relative to each repository. **Verified** means read in its code at the path given. **Not verified** means it was looked for and not reached.

| Repository | Revision | What it is |
| --- | --- | --- |
| [Open Food Network](https://github.com/openfoodfoundation/openfoodnetwork) | `6d906ac`, 2026-10-15 | Food hubs with collection, Rails |
| [Saleor](https://github.com/saleor/saleor) | `9ae360a`, 2026-10-20 | Commerce, Django GraphQL |
| [Medusa](https://github.com/medusajs/medusa) | `906433a`, 2026-10-16 | Commerce, Node |
| [Karrot](https://github.com/karrot-dev/karrot-backend) | `b7a4e54`, 2026-09-22 | Food-saving groups, Django |
| [foodsharing](https://gitlab.com/foodsharing-dev/foodsharing) | `c4ab5f1`, 2026-10-16 | Food rescue, PHP |

## What Second Bite has today

- **An admin reads one order:** `GET /orders/{orderId}` answers admins, with its lines, window, the time of each transition, reasons and review ([order spec](../specs/order.md)).
- **An admin reads one seller's orders for one day:** `GET /sellers/{sellerId}/orders?day=`.
- **An admin reads what one account ordered:** `GET /admin/accounts/{accountId}/orders`. It gives placed, collected and missed counts, and the latest five (SEC-75).
- **No list across sellers.** SEC-75 left out "Xem tất cả đơn" because "admins have no orders list to open".
- **The order's events** (`order_events`: placed, ready, collected, cancelled, refused, reopened, expired, with who and when) are stored but not served.
- **The rule:** "Admins read but never act for a seller" (order spec, Reading).
- **Indexes** serve lists by customer (`customer_id, created_at`) and by seller (`seller_id, window_start`), not across sellers by day (`server/migrations/0014_order_create_orders.sql:45-48`).

## What Figma draws

| Frame | What it shows |
| --- | --- |
| AD-DH1 · Danh sách | Three counts with a trend line (Đã nhận, Đang chờ nhận, Hết hạn). A search over the number, the customer's name or the store. Filters: a store, the collection day ("Hôm nay, 21/10"), rows per page. Columns: store, customer, dishes, number, total, status, window. A pager ("Hiển thị 1–10 trên 113 đơn") |
| AD-DH2 · Lọc Khách không đến | The third count is selected and filters the list to orders the customer did not come for. Columns sortable by store, total and window |
| AD-DH3 · Chi tiết đơn | The lines with their prices and discount. The history: placed, ready, collected, "quá hạn nếu chưa nhận". The customer: name, phone, email, earlier orders ("5 đã nhận · 0 hết hạn"). The store: name, place, phone, status. The collection: window, place, payment. "Xem cửa hàng" |
| AD-DH4 · Chi tiết · Huỷ đơn | **An admin cancels the order.** A required reason: "Cửa hàng hết hàng hoặc món không còn đạt", "Khách yêu cầu huỷ qua hỗ trợ", "Lý do khác". A note "cho khách và cửa hàng". A pager "‹ 1/5 ›" through the list |
| AD-DH5 · Chi tiết · Khách không đến | A notice: no money taken, the units not sold again, "Lần thứ 2 trong 30 ngày của khách", "Có thể ghi nhận vi phạm". **An action "Ghi nhận vi phạm"** |

AD-DH4 and AD-DH5 go beyond the rule that admins only read.

## How the references list orders

- **Open Food Network:**
  - its admin list searches through `SearchOrders`, which applies the request's filters to the orders the user may edit (`app/services/search_orders.rb:18-21,30-32`);
  - the filters are the completion date range, the status, the number, the email, the first and last name, the distributor and the order cycle (`app/views/spree/admin/orders/_filters.html.haml:12-49`);
  - it pages with `per_page` (`app/controllers/concerns/pagination_data.rb:13`);
  - verified.
- **Saleor:**
  - its `OrderFilter` takes status, customer, a created date range, a search, channels, click-and-collect and numbers (`saleor/graphql/order/filters.py:361-391`);
  - the search covers the number, the identifier, the emails and the customer's names (`saleor/order/search.py:40-61`);
  - sorts are by number, created, customer, payment and status (`saleor/graphql/order/sorters.py:10-18`);
  - verified.
- **Medusa:** its admin list takes `q`, status, sales channel, region, customer and a `created_at` range, paged with limit and offset (`packages/medusa/src/api/admin/orders/validators.ts:49-64`). Verified.

What all three share: one list across every shop, searched by number and customer; filtered by status, shop and a date; paged with a total.

Second Bite's day is the collection day (the window), not the day the order was placed. Orders are placed and collected the same evening, and the seller's own list already goes by that day (`?day=`).

## What the references let staff do

- **Staff cancel orders in all three.**
  - **Open Food Network:** an admin fires `cancel` on an order, choosing whether to email the customer and whether to restock (`app/controllers/spree/admin/orders_controller.rb:69-81`). Verified.
  - **Saleor:** `orderCancel` needs the `MANAGE_ORDERS` permission and refuses an order that cannot be cancelled (`saleor/graphql/order/mutations/order_cancel.py:21-24,40-43`). Verified.
  - **Medusa:** `POST /admin/orders/{id}/cancel` runs the cancel workflow with `canceled_by` set to the admin (`packages/medusa/src/api/admin/orders/[id]/cancel/route.ts:22-25`). Verified.
- **Staff notes on an order:** Saleor records `note_added` and `note_updated` events (`saleor/order/__init__.py:144-145`). Verified.
- **No-shows are recorded, never punished automatically.**
  - **Karrot:** participants report who did not come (`FeedbackNoShow`, `karrot/activities/models.py:633-642`). A job marks an activity missed (`models.py:331-334`). Verified; nothing acts on either automatically ([earlier note](2026-10-16-open-source-pickup-models.md)).
  - **foodsharing:** people report a no-show (`ReportReason::NO_SHOW`), and a person handles the report ([earlier note](2026-10-16-open-source-pickup-models.md)).
- **Consumer apps.**
  - **Too Good To Go:** its reply to a consumer complaint says a booking becomes a purchase once the window ends, so no refund is owed ([DECO PROteste](https://www.deco.proteste.pt/reclamar/todas-as-reclamacoes/encomenda-recusada-a-ser-entre/a320e92c2541c31286)). Not verified against its terms: the page answered 429.
  - **GrabFood:** reported to penalise unclaimed orders in the Philippines in 2019 ([ABS-CBN](https://abs-cbn.com/business/06/19/19/grabfood-users-with-unclaimed-orders-may-face-penalties-soon)). Not verified: the page answered 403.
  - **ShopeeFood and GrabFood in Vietnam:** no published rule on "bom hàng" was found.

## What this means for Second Bite

- **The list and the detail are reading,** and the references agree on their shape:
  - **Search:** the number, the customer's name or phone, the store's name.
  - **Filters:** status, store and collection day.
  - **Sort:** by window, total and store.
  - **Paging:** pages with a total, as the admin's stores list already does (`page`, `size`, `total` in `listSellersForAdmins`).
  - **The detail:** it adds the events the module already stores, and the customer's history the account page already serves.
- **Cancelling by an admin is what every reference allows,** recorded with who did it. Two things change:
  - the order spec's rule that admins only read;
  - the audit log (SEC-75) records it, as it records blocking a store.
  The reasons Figma draws correspond to cases a seller already has: "sold out" is `sold_out`; "the customer asked through support" is new. The units return to the offer, as for a customer's cancel.
- **No-shows:**
  - Second Bite already records them by itself when the window ends (`expired`), and the seller records `no_show`, `no_answer` and `late`;
  - the account's history counts them as missed;
  - "Ghi nhận vi phạm" would add a person's judgement, and a consequence (a lock, a limit) that no reference automates and that no issue has decided;
  - the facts can be shown without the action: the misses in the last 30 days.
- **The trend lines on the counts** need a series by day. The counts for the chosen day are cheap; the lines are a second query, and the dashboard (SEC-62) draws the same kind of series.
