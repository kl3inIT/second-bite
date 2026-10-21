# SEC-78 — Pilot phase 1 holds, the seller's Đơn tab: design

Status: started on 21 October 2026. Tracked in Linear as SEC-78, a child of [SEC-57](../sec-57-seller-web/design.md). The screens are drawn in Figma `Chủ quán · Web 1440`, section Đơn (Q5, Q5b to Q5g) and the same search and day filter on Bài đăng (Q2, Q2c, Q2d). The sponsor's task is S-03 of the [tracking sheet](../../../brief/2026-10-20-sponsor-tracking-sheet.md): who holds a dish.

## Decision

For the prototype of 23 October 2026 there is no online payment. A customer holds a dish, comes to the counter and pays the seller in cash, so one button, "Đã giao", ends an order: the dish is handed over and paid at the same moment. The seller's Đơn tab is a list of the day's holds that answers three questions at the counter: who holds what, how much to collect, and who to call when they do not come.

The Đơn tab drawn for SEC-15 (its increment is in pull request 25, not merged yet; Figma W8: a four-digit code entered at the counter, a "ready" step, refusing with reasons) fits a payment-and-code flow, not this phase. It is not built. The tab is redrawn as below, and the order module is changed to match (see "What the backend must give").

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

## What the backend must give

The `order` module of SEC-15 (pull request 25, Đức Anh) is the home of this; nothing here is built until the two of us agree. What the screens need from it:

- **A hold without sign-in**: the customer gives a name and a phone, no account, no code. Today an order needs a signed-in customer and a four-digit code (shown when the seller marks it ready, locked after three wrong tries).
- **Cash at the counter** as the only payment, with no state for it: "Đã giao" is the whole of collection.
- **Statuses**: held, handed over, cancelled; and for a cancelled order, *who* cancelled (the seller or the customer) and a reason from a fixed list, or free text for "other".
- **Undo**: from handed over or cancelled back to held; the units are taken again, and the call is refused when they are gone.
- **The seller's list for one day**, with the counts per status, the day's total handed over, and a search by name, phone or dish. The day is the day of the hold, in the pilot's time zone.
- **Expiry**: a hold whose post's window has ended is cancelled by the server with the reason *Quá giờ* and the units are returned; the seller does not have to press anything.
- **Limits against abuse** of a hold without sign-in: a cap per phone and per address, as the research of the team proposed; the numbers are for the order module's design.

## Open decisions

Not settled; the plan waits on them.

1. Reuse the `order` module (the same table, a guest customer) or a separate, smaller `hold` module for the pilot. Reusing avoids a second source of truth; a separate module avoids bending a payment-and-code design.
2. Whether name and phone are both required on a hold. The screens show both.
3. Whether the seller may also cancel for "Hết món" after the hold, and what the customer is told.
4. The customer's side: how a customer cancels (a link, a phone number lookup), and what the confirmation shows. This is SEC-51's and Việt's work, and must agree with the above.

## Not here

- The phone layout of the tab and of the calendar (a sheet from the bottom edge): not drawn yet; stall staff will likely use phones.
- A history of changes to an order, blocking a phone, and a state for payment: not needed in phase 1.
- The title of the post list card on Bài đăng, "Hôm nay và sắp tới", no longer matches a one-day filter; its new name is to be decided with the day filter on that page.

## Rules the screens follow

- Strings in `vi` and `en`, semantic tokens only, the generated SDK, a Playwright test per page with the accessibility check ([web guideline](../../../guidelines/web.md)).
- The phone number is personal data: it is shown to the staff of the seller that holds the order and to nobody else, and it is never written to logs or to Git (examples in tests and documents are made up) ([data and security](../../../conventions.md#data-and-security)).
