# SEC-83 — The orders list and the order page follow Figma section 16: design

Status: started on 21 October 2026. Tracked in Linear as SEC-83. The screens are Figma `16 · Xem đơn và chi tiết đơn`: D1 (orders to collect), D2 (an order being prepared), D3 (ready, with its QR code), D4 (ended orders), D5 (a collected order). D6 (reporting a problem) is SEC-84.

## Decisions

| # | Decision | Why |
| --- | --- | --- |
| 1 | The ticket shows the order's QR code once it is ready, a pale one before, beside the collector's name and phone number; the QR code holds the order's identifier, drawn on the server with `uqr` | Figma D2, D3; [SEC-86](../sec-86-collect-without-code/design.md) dropped the four-digit code |
| 2 | A card on D1 keeps the cart's facts in Figma's frame: each dish on its own line, the total large, then "Thanh toán khi nhận hàng" | The owner's choice |
| 3 | Ended orders are grouped under "Hôm nay", "Tuần này" and "Trước đó" by their window's day in `Asia/Ho_Chi_Minh`, the moment of reading taken after the orders are read | Figma D4; a prerendered page must not freeze a day |
| 4 | Orders placed together keep one bar titled for all of them, then each seller's part with its own heading and no back button | SEC-76 › decision 8 |
| 5 | The savings photograph shows only once something was collected | Figma D1; nothing to say before |
| 6 | Not built, nothing backs them: "Trợ giúp", "Nhắn quán", "Báo vấn đề" (SEC-84), a rating, a weight saved, paying by transfer | No operation or data exists for them |
| 7 | Figma's 40px window figure uses the `display` token (36px); the faint grey and `tasco/700` text colours are replaced by `muted-foreground` and `primary` | Contrast and the token scale |
