# order

Owns what customers order: units of one seller's offers, collected at the counter within one window, by a named customer with a phone number, signed in or not (tables `order_*`). Decided in the [SEC-15 design](../increments/active/sec-15-order-module/design.md); ordering without an account in [SEC-76 decision 7](../increments/active/sec-76-web-customer-flow/design.md); collecting without a code in [SEC-86](../increments/active/sec-86-collect-without-code/design.md). The sources: the pilot domain model for confirming an order when it is placed, as Too Good To Go, Karrot and Open Food Network do; Open Food Network for copying the name and price onto the order line and logging every transition; foodpanda and Keeta for one cart per seller; offer's own rule of reading expiry from the window, so nothing waits for a job. Checks: [docs/tests/order.md](../tests/order.md).

During the pilot the customer pays the seller at the counter; the module records no payment.

## Operations

| Operation                                                                                        | Who                                                                     | Answer                                                                                         |
| ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `POST /orders` `{lines: [{offerId, units}], name, phone, checkoutId?}`, header `Idempotency-Key` | Anyone; for the account when signed in                                  | `201` the order, confirmed, with its access                                                    |
| `GET /orders?state=open\|ended&checkout=&limit=&offset=`                                         | The customer                                                            | `200` their orders, newest first, at most 50 a page; of one checkout when given                |
| `GET /orders/{orderId}`, header `Order-Access` without an account                                | Its customer, signed in or with its access; the seller's people; admins | `200` the order; the access only to its customer                                               |
| `POST /orders/{orderId}/cancel` `{reason?}`, header `Order-Access` without an account            | Its customer, signed in or with its access                              | `200` the order, cancelled                                                                     |
| `GET /sellers/{sellerId}/orders?day=YYYY-MM-DD`                                                  | The seller's people; admins                                             | `200` the orders whose window starts that day in Vietnam time, today by default, soonest first |
| `POST /orders/{orderId}/ready`                                                                   | The seller's people                                                     | `200` the order, ready; again, the same                                                        |
| `POST /orders/{orderId}/hand-over`                                                               | The seller's people                                                     | `200` the order, collected                                                                     |
| `POST /orders/{orderId}/reopen`                                                                  | The seller's people                                                     | `200` the order, open again after a hand-over or a refusal (SEC-78)                            |
| `POST /orders/{orderId}/refuse` `{reason, note?}`                                                | The seller's people                                                     | `200` the order, refused                                                                       |

An order carries its number (`SB-` and a number), status, seller (name, address, collection point), lines (offer, name, unit, price, original price, units, photo), total, window, the time of each transition, the cancel or refusal reason, its checkout, who collects (name and phone number) and, to its customer, the access.

Published to other modules: `Service` alone.

## Rules

- **A cart**: one to ten different offers of one active seller, each one or more units. The units are taken from each offer in the order's transaction, in one order of identifiers; when one offer has too few, nothing is taken.
- **The window** is the part all the offers' windows share; it must still be to come.
- **Confirmed at once**; staff never accept an order.
- **The checkout**: the orders placed together from one cart, one per seller, share an identifier the client gives, or a new one; it groups them for their customer and changes nothing else.
- **Who collects**: a name of 1 to 50 characters and a Vietnamese phone number, `0` and nine digits; spaces, dots, dashes and `+84` are taken out or written as `0`. Never logged.
- **Idempotency**: the same `Idempotency-Key` from the same account, or without an account with the same phone number, returns the order placed first, also when both arrive at once.
- **The access**: 122 random bits stored with the order, compared in constant time. It proves the order is theirs to whoever placed it without signing in; it is sent as a header, never in an address.
- **Status**: `confirmed`, `ready`, `collected`, `cancelled` and `refused` are stored; `expired` is read in every query when an order still confirmed or ready has its window over. Expired units are not offered again.
- **Cancelling**: by the customer, signed in or with the access, free of charge, until the window opens; the units return to their offers.
- **Ready**: by the seller's people while the order is open; tells its customer to come.
- **Handing over**: by the seller's people, within the window, once they have matched the collector to the order by its QR code (the order's identifier) or by the name and phone number on it.
- **Refusing**: by the seller's people while the order is open, with `not_suitable`, `wrong_items`, `no_answer`, `no_show`, `late`, `sold_out` or `other` and a note of up to 200 characters. For `no_answer`, `no_show` and `late` the customer did not come, so the units go back to their offers; for the others they are not offered again.
- **Reopening**: by the seller's people, for an order that was handed over or refused and whose window is not over; it is confirmed again. The units a refusal had returned are taken again, and `ORDER_OFFER_SOLD_OUT` answers when they are gone. An order its customer cancelled stays cancelled.
- **Reading**: its customer, signed in or with the access, the seller's people and admins; anyone else gets 404. Admins read but never act for a seller.
- **Withdrawing an offer** leaves its orders standing; the seller serves them or refuses them at the counter ([why](../increments/active/sec-15-order-module/design.md#5-context-map)).

## Data

| Table          | Holds                                                                                                                                                                                                                                                                                                                                                                                                                              | Lifecycle           |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `order_orders` | Number (identity from 10001), customer (none without an account) and seller (no foreign key across modules), checkout, the customer's name and phone number, the seller's name and collection point copied, state, window, total, idempotency key (unique per account, or per phone number without one), the access, cancel reason, refuse reason and note, when placed, ready, collected, cancelled and refused | Kept                |
| `order_lines`  | Order, offer, the name, unit, prices and photo copied, units                                                                                                                                                                                                                                                                                                                                                                       | Kept with its order |
| `order_events` | Order, `placed`, `ready`, `collected`, `cancelled`, `refused` or `reopened`, who (none for a customer without an account), when                                                                                                                                                                                                                                                                                                  | Append-only         |

## Failures

| Code                            | Status | When                                                                                                                     |
| ------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------ |
| `ORDER_LINES_INVALID`           | 400    | No line, more than ten, a repeated offer, no unit, or offers of different sellers                                        |
| `ORDER_CONTACT_INVALID`         | 400    | No name, a name longer than 50 characters, or a phone number that is not Vietnamese                                      |
| `ORDER_IDEMPOTENCY_KEY_INVALID` | 400    | A key of more than 255 characters, or none (the header is required, so the API answers `PLATFORM_REQUEST_INVALID` first) |
| `ORDER_WINDOWS_DO_NOT_MEET`     | 400    | The offers' windows share no time still to come                                                                          |
| `ORDER_DAY_INVALID`             | 400    | A day that does not exist                                                                                                |
| `ORDER_REFUSAL_INVALID`         | 400    | An unknown reason, or a note too long                                                                                    |
| `ORDER_NOT_FOUND`               | 404    | No such order, or one the caller may not see or act on                                                                   |
| `ORDER_OFFER_SOLD_OUT`          | 409    | An offer has fewer units left than asked; nothing is taken                                                               |
| `ORDER_OFFER_UNAVAILABLE`       | 409    | An offer is withdrawn, closed or unknown, or its seller is not active                                                    |
| `ORDER_CANCEL_TOO_LATE`         | 409    | The window has opened, or the order has ended                                                                            |
| `ORDER_TRANSITION_NOT_ALLOWED`  | 409    | Ready, hand over or refuse an order that has ended                                                                       |
| `ORDER_OUTSIDE_WINDOW`          | 409    | Handing over before the window opens                                                                                     |
| `SELLER_NOT_FOUND`              | 404    | Listing the orders of a seller the caller is not one of the people of                                                    |

## Not yet

Per the [plan](../increments/active/sec-15-order-module/plan.md): a limit of units per customer and day, and of orders per phone number, since a number is not verified; telling people what happened (SEC-24 and later); cancelling the orders of a withdrawn offer, which needs an event; paying online (SEC-18).
