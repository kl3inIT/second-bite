# SEC-91 — Changing the hours of a post that has orders: design

Status: started on 21 October 2026. Tracked in Linear as SEC-91, a child of [SEC-57](../sec-57-seller-web/design.md). It is the part of SEC-54 (expected surplus and editing live offers) that concerns the hours; SEC-54 keeps the rest. It supersedes the rule in [SEC-57 › What waits](../sec-57-seller-web/design.md) that locked the hours once units are ordered.

## Why

A seller who has posted a dish and taken orders may need to move the hours (the food is ready later, the counter closes early). The edit drawer greyed the hour chips with a line saying so, and the only way out was to cancel every order and post again.

## Decisions

| # | Decision | Why |
| --- | --- | --- |
| 1 | Once units are ordered, `PATCH /offers/{id}` also changes the collection window, under the settings' rules on a window (length, how soon it starts, not over). The name, kind, unit, weight and prices stay locked | An order keeps the price and the name it was placed at (Open Food Network copies them onto the order line); the window is what it must follow, since it says when the customer comes |
| 2 | A change of the window of an offer with orders publishes `offer.window_changed` in the same transaction, through the outbox on River | `order` may use `offer`, and `offer` may not use `order`; an event is how the offer says it without knowing who holds its units |
| 3 | `order` listens, and for each order still to collect that holds units of the offer, reads the windows of its offers again (`offer.WindowsOf`) and moves the order to the part they share. Orders handed over, cancelled or refused, and an order whose offers no longer share a time, are left as they were | Reading again instead of applying the event's values makes a delivery twice harmless, and a cart of several offers keeps the window all of them share |
| 4 | The customers are not told | They leave a name and a phone number, no address; the drawer says "Hãy báo họ". A message waits for a channel (SEC-24 and later). The order's page shows the new hours at once |

## Trade-offs

- The orders move a moment after the offer, when the listener runs, not in the same transaction; a customer who reads the order in between sees the old hours.
- A customer who could cancel free of charge until the old window opened now may until the new one opens, since the rule reads the order's window.

## Out of scope

Changing the price, the name or the kind of a post with orders; telling the customers; the rest of SEC-54 (expected surplus, "Hết hàng ngay", the reasons for withdrawing).
