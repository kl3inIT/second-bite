# SEC-78 — Pilot phase 1 holds, the seller's Đơn tab: design

Status: completed, 21 October 2026: merged; the phone layout came with SEC-79. Earlier: started on 21 October 2026. Tracked in Linear as SEC-78, a child of [SEC-57](../sec-57-seller-web/design.md). The screens are drawn in Figma `Chủ quán · Web 1440`, section Đơn (Q5, Q5b to Q5g) and the same search and day filter on Bài đăng (Q2, Q2c, Q2d). The sponsor's task is S-03 of the [tracking sheet](../../../brief/2026-10-20-sponsor-tracking-sheet.md): who holds a dish.

## Decision

For the prototype of 23 October 2026 there is no online payment. A customer holds a dish, comes to the counter and pays the seller in cash, so one button, "Đã giao", ends an order: the dish is handed over and paid at the same moment. The seller's Đơn tab is a list of the day's holds that answers three questions at the counter: who holds what, how much to collect, and who to call when they do not come.

The Đơn tab drawn for SEC-15 (its increment is in pull request 25, not merged yet; Figma W8: a four-digit code entered at the counter, a "ready" step, refusing with reasons) fits a payment-and-code flow, not this phase. It is not built. The tab is redrawn as below, and the order module is changed to match (see "What the backend gives").

## What a hold shows

One row per order, in this order:

| Part | Content |
| --- | --- |
| Photo, dish | The dish's photo (72 px) and name, `card-title`; the dish's own words, not the unit |
| Customer | Name and phone on one line, `body`, muted, with a button that copies the phone (the staff call a customer who does not come) |
| Units | A pill in the dish's own unit: "1 suất", "2 túi", "1 hộp" |
| Total | "Số tiền" and the amount to collect at the counter, `title-lg` |
| Buttons | "Hủy đơn" (outline) and "Đã giao" (primary) |

No code, no collection time, no payment state. The seller made the post, so they know its window; the server ends a hold whose window has passed (below).

## The tab

- Tabs **Đang giữ**, **Đã giao**, **Đã hủy**, each with its count for the chosen day. "Không đến" and "Hủy giữ" are one tab, Đã hủy.
- **Hủy đơn** opens a dialog (Q5c) with a reason to choose: *Không nghe máy*, *Khách không đến*, *Quá giờ*, *Hết món*, *Lý do khác* (with a field for the text). The units go back to the post.
- A row in **Đã hủy** shows its reason: the staff's choice, or "Khách tự hủy trên trang người dùng" when the customer cancelled on the user site.
- **Đã giao** shows the day's total, "Hôm nay 2 đơn · 144.000đ" (an example), so the seller can match the cash.
- **Hoàn tác** after "Đã giao" (a toast, Q5d) and on a row in Đã giao or Đã hủy (Q5e, Q5f): the order goes back to Đang giữ, and the units are taken again if they are still there.
- A **search** by customer name, phone or dish, and a **day filter**: previous and next day, today, yesterday, and a month calendar (Q5g). Orders belong to a day, so the page shows one day. The same pair sits on Bài đăng, where its search is by dish name.

The Figma frames were researched on Mobbin (Apple Music, Klaviyo and Vercel for the calendar, Square for the day bar, Glovo and Talabat for the row).

## What the backend gives

The `order` module as `main` has it: a customer holds with a name and a phone number, signed in or not ([SEC-76](../../completed/sec-76-web-customer-flow/design.md)); `GET /sellers/{id}/orders?day=` lists a seller's orders of a day with the customer's name and phone; and `POST /orders/{id}/hand-over` ends an order with no code ([SEC-86](../../completed/sec-86-collect-without-code/design.md)), which is the tab's "Đã giao". SEC-78 adds to it, in its own migration and operation (spec: [order](../../../specs/order.md)):

- **Refusal reasons** for a seller's cancelling: `no_answer`, `no_show`, `late`, `sold_out` and `other` (with a note) join `not_suitable` and `wrong_items`. For the first three the customer did not come, so the units go back to the offer; for `sold_out` and the others they do not.
- **Reopen**: `POST /orders/{id}/reopen` takes a hand-over or a refusal back while the window is not over; the units a refusal had returned are taken again, and `ORDER_OFFER_SOLD_OUT` answers when they are gone. A customer's own cancelling is not taken back.
- **The cancelled tab** reads three states of the order: `cancelled` (the customer), `refused` (the seller, with a reason) and `expired` (the window ran out, read from the window, so nothing waits for a job; it shows as *Quá giờ lấy*).
- **Counts, the day's total and the search** are computed by the web from the day's orders, which are few: a store has at most five hundred a day, the list's limit.

Decided with the build: the pilot reuses the `order` module rather than a second one; name and phone are both required, as the module already asks; the seller may cancel for "Hết món" and then the units are not offered again. A hand-over is refused before the order's window opens (`ORDER_OUTSIDE_WINDOW`), so a customer who comes early waits for it.

## Open

1. **Limits against abuse** of a hold without sign-in: a cap per phone number and per address. The order module's own plan has it ("Not yet").
2. **The customer's side**: how a customer cancels and what they are told when the seller cancels with a reason. The customer's words for the new reasons are in the web's order page; the flow is SEC-51 and SEC-76.

## Not here

- The phone layout of the tab and of the calendar (a sheet from the bottom edge): not drawn yet; stall staff will likely use phones.
- A history of changes to an order, blocking a phone, and a state for payment: not needed in phase 1.
- The post list card on Bài đăng is titled by the day it shows ("Hôm nay", or "Bài đăng ngày 21/10"), since the filter on that page is built (SEC-95).

## Rules the screens follow

- Strings in `vi` and `en`, semantic tokens only, the generated SDK, a Playwright test per page with the accessibility check ([web guideline](../../../guidelines/web.md)).
- The phone number is personal data: it is shown to the staff of the seller that holds the order and to nobody else, and it is never written to logs or to Git (examples in tests and documents are made up) ([data and security](../../../conventions.md#data-and-security)).
