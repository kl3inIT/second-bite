# SEC-108 — Withdrawing a post that has orders: design

Status: started on 21 October 2026. Tracked in Linear as SEC-108, a child of [SEC-57](../sec-57-seller-web/design.md). It supersedes the rule in [SEC-57 › What waits](../sec-57-seller-web/design.md) and in the [order spec](../../../specs/order.md) that withdrawing a post leaves its orders standing.

## Why

A post with orders could not be withdrawn from the web: the drawer sent the seller to the Đơn tab to cancel each order first. Only the web held that rule; the API withdrew such a post and left its orders untouched, so the customers kept an order on a post that had left every page. The seller asked that withdrawing end the orders itself.

## Decisions

| #   | Decision                                                                                                                                                                                | Why                                                                                                                                                        |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Withdrawing a post with orders is allowed; the orders still to collect on it end with it. The drawer says so, and its button reads "Rút bài và huỷ đơn"                                 | The seller decides to stop selling the dish; cancelling order by order is the same decision made again for each                                            |
| 2   | `offer.Withdraw` publishes `offer.withdrawn` in the transaction that stores the state, through the outbox on River                                                                      | `order` may use `offer`, and `offer` may not use `order`; the same path as `offer.window_changed` ([SEC-91](../sec-91-change-hours-with-orders/design.md)) |
| 3   | `order` listens (`RefuseWithdrawnOffer`) and refuses each open order of the offer with the reason `withdrawn`, in its own transaction, and records the `refused` event without an actor | The customer reads the order's reason on its page; no actor, since the system ended it                                                                     |
| 4   | The units an order held of the seller's other offers go back to them; those of the withdrawn offer are not offered again                                                                | A cart of several offers is refused whole; only the withdrawn offer's food is off sale                                                                     |
| 5   | `withdrawn` is the system's reason: staff cannot choose it (it is not in the reasons a refusal takes), and an order refused for it cannot be reopened                                   | Reopening would put units back on an offer that is withdrawn                                                                                               |
| 6   | The customer's pick-up rate is untouched: `withdrawn` is a refusal, not a "missed" order                                                                                                | The customer did nothing wrong                                                                                                                             |
| 7   | Orders handed over, cancelled, refused or expired stay as history; the listener delivered twice changes nothing more                                                                    | Same rule as the window follow                                                                                                                             |

## Trade-offs

- The orders end a moment after the offer, when the listener runs, not in the same transaction; a customer who reads the order in between sees it still open.
- The customers are not told by message (SEC-24 and later); they read the reason on their order, as they do for a window that was moved.

## Out of scope

The reasons for withdrawing that Figma asks for; a message to the customers.
