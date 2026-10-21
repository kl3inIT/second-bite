# SEC-97 — Pickup and review: design

Status: started on 21 October 2026. Tracked in Linear as SEC-97. The owner asked for the pickup and review flow end to end, after Figma section "5 · Nhận món và đánh giá" (125:5153) on page "Mobile · Khách":

- K6 (105:3908), following an order and collecting it by QR;
- K6b (105:3848), a collected order, rated with stars;
- K8 (105:2989), "Đơn của tôi".

The web frame WK6b (185:12984) draws the collected order at 1440 in two columns.

## Decisions

| # | Decision | Why |
| --- | --- | --- |
| 1 | A customer rates a collected order once: one to five stars, any of four fixed tags, and an optional comment. The order module stores it, and the order carries it | Figma K6b; a rating is a fact about one order, so it needs no module of its own |
| 2 | The tags are a server enum (`fast_pickup`, `good_quality`, `good_variety`, `fair_portions`), translated on the web | The words can change without touching stored data |
| 3 | Rating is authorised as reading the order is: the session, or the order's access for an order placed without signing in | Ordering needs no login (SEC-76 decision 7) |
| 4 | Each seller's order is its own card in "Đơn của tôi" and its own page. A page links to the orders placed with it: "Cùng lần đặt: Panda Chef ›". This supersedes SEC-76 decision 8, which showed orders placed together as one | Figma K8 and K6, as the owner approved them on 21 October 2026 |
| 5 | The four steps map onto the statuses: a confirmed order is "Chuẩn bị", a ready one "Sẵn sàng", a collected one "Hoàn tất". Cancelled, refused and expired orders keep their receipt (Figma D5) | The backend has no separate preparing status |
| 6 | The ticket beside the QR code says only how to collect: show the code, or read out the name and phone number | Figma K6 |
| 7 | Not built: "Trợ giúp", "Nhắn quán" and "Báo vấn đề với đơn" | Nothing backs them |
| 8 | From 1024px the order page has two columns, with the order's details at the right, as in WK6b; below that it is one column | The owner asked for every width to work |
| 9 | The sellers' ratings stay as they are; real reviews do not feed them in this issue | Kept small; a follow-up on Linear |
