# SEC-102 — The seller's order steps and an order's own page: design

Status: started on 21 October 2026. Tracked in Linear as SEC-102, a child of [SEC-78](../sec-78-pilot-holds/design.md), which drew the order tab with one "Đã giao" button. The screens are drawn in Figma: `Chủ quán · Web 1440` Q5h to Q5k and `Chủ quán · Mobile 390` O1 to O3 (page `Mobile · Khách`). The founder reviewed them on 21 October 2026.

## Decision

The customer sees four steps on an order: Placed, Preparing, Ready, Done. The seller's tab now has the same four, so what the seller does is what the customer sees.

| Step | Stored status | How an order gets there |
| --- | --- | --- |
| Placed, Preparing | `confirmed` | At once, when the customer places it. Nobody accepts an order, so Preparing has no button of its own |
| Ready | `ready` | The seller presses **Báo sẵn sàng** (`POST /orders/{id}/ready`), which tells the customer to come |
| Done | `collected` | The seller presses **Đã giao** (`hand-over`), once the collector is matched by name and phone number |

**Option A, decided with the founder:** "Đã giao" is offered only once the order is ready. The server still accepts a hand-over from `confirmed`; the web simply does not offer it, so the track the customer sees is never skipped. "Hủy đơn" stays at both steps.

No backend change: `markOrderReady` exists in the order module and the generated client.

## What changes

- **The list's tabs**: Chuẩn bị, Sẵn sàng, Đã giao, Đã hủy (the first replaces "Đang giữ"). The first tab is the default. A row in Chuẩn bị has Hủy đơn and Báo sẵn sàng; in Sẵn sàng, Hủy đơn and Đã giao. The title row says "Chuẩn bị 3 · sẵn sàng 1".
- **An order's own page**, `/stores/{sellerId}/orders/{orderId}`, opened by tapping a row (Figma Q5j, Q5k; O2, O3): the blue card with the status, the window in large figures, how long until it ends and the four-step track; the customer's name and phone number beside it; the lines with their prices, the saving, the total and the number; the actions in a card (a fixed bar at the foot on a phone). An order that has ended shows what ended it instead of the track, with "Hoàn tác" when the seller may take it back.
- **The track** is a row of four circles joined by lines (Receipt, Store, Shopping bag, Check): done and current in the fresh colour, the others dimmed, the current one's label strong.
- On a phone the page is a pushed screen (the white top bar with a back button to the list, no tab bar), as the dish forms are ([SEC-79](../sec-79-seller-web-phone/design.md)); the app's blue header of the Figma frame is not used, for the reason given there.

## Not changed

The search, the day bar, "Hủy đơn" with its reasons, "Hoàn tác" and the undo toast after a hand-over, and the customer's own pages.

## Open

An order can still be handed over at the counter by someone who matches its name and phone number although the seller never pressed "Báo sẵn sàng" on the web (the API allows it). The customer's track then goes from Preparing to Done.
