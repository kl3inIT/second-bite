# SEC-15 — The `order` module: design

Status: proposed on 20 October 2026, from the screens drawn in Figma (file Secondbite, sections Mobile v3 › 10–11 and `Đơn · SEC-15`); open questions below go to the founder. Tracked in Linear as SEC-15.

The rules come from the [pilot domain model](../sec-6-pilot-domain-model/design.md), the founder's [requirements](../../../brief/second-bite-app-requirements-it.md) (slides 3, 4, 8, 9, 10), the [open-source pickup models](../../../research/2026-10-16-open-source-pickup-models.md) and the customer flows read on Mobbin ([customer flows](../../../research/2026-10-19-customer-flows.md)). A rule marked *ours* has no reference and is a working assumption.

## What a person can do

**A customer** (signed in):

- orders units of one or more offers of one seller, sees the total before ordering, and gets an order confirmed at once, with no one at the seller accepting it;
- follows the order: confirmed, ready, collected, or how it ended (cancelled, refused at the counter, expired as not collected);
- sees a four-digit collection code once the seller marks the order ready or its window opens, and may send it to someone who collects for them;
- cancels free of charge until the collection window opens;
- lists their orders, those still to collect first.

**A seller's staff member** (owner or staff):

- sees the seller's orders of a day: to prepare, ready, and done;
- marks an order ready, which shows the customer the code;
- hands an order over when the collector gives the right code within the window, or refuses it with a reason when the food is no longer suitable or the order is wrong.

**An admin** reads any order.

During the pilot the customer pays the seller at the counter, in cash or by the seller's own QR code ([vision](../../../vision.md#target-architecture), decided 18 October 2026); Second Bite records no payment. Paying online is SEC-18, refunds and problem reports SEC-13, chat SEC-19.

## Boundary discovery

### 1. Domain story

1. A customer puts units of offers from one seller in a cart and orders them. The order takes the units from each offer in the same transaction; when one offer no longer has them, nothing is taken and the customer is told which ran out.
2. The order is confirmed at once. Its collection window is the part all its offers' windows share.
3. Staff prepare it and mark it ready; the customer is shown a four-digit code.
4. At the counter the collector gives the code. Staff enter it; a right code within the window hands the order over and the customer pays the seller.
5. Failure paths:
   - the customer cancels before the window opens: the units return to their offers;
   - nobody comes before the window ends: the order is expired, read from the window, and its units are not offered again;
   - staff judge the food unsuitable or the order wrong: they refuse it with a reason; the units are not offered again;
   - wrong codes: after three wrong codes the order's code is locked and staff call support (domain model); support unlocking is SEC-13;
   - the customer taps Order twice: the same idempotency key returns the first order.

### 2. Glossary

| Term | Meaning | Not to be confused with |
| --- | --- | --- |
| Order | A customer's order for units of one or more offers of one seller, with one collection window | Offer |
| Order line | The units of one offer in an order, with the name, unit and price copied from the offer when ordered | Offer |
| Collection window | The part the windows of an order's offers share | An offer's window |
| Collection code | Four digits that prove the right to collect one order | The order number |
| Order number | `SB-` and a number, which people read aloud and search for | The order's identifier |
| Collector | Whoever gives the code: the customer or someone they sent | Customer |

### 3. Commands, facts and read models

| Command | By | Fact | Consistency |
| --- | --- | --- | --- |
| Place an order | Customer | placed (confirmed at once) | One transaction with the units taken from each offer |
| Cancel an order | Customer | cancelled | One transaction with the units returned |
| Mark ready | Staff | ready | The order alone |
| Hand over with a code | Staff | collected, or a wrong attempt counted | Under the order's row lock |
| Refuse | Staff | refused | The order alone |
| — (the window ends) | — | expired | Read from the window in every query, so nothing waits for a job (as `offer` reads `closed`) |

Read models: a customer's orders; one order; a seller's orders of a day.

Every transition is written to `order_events`, never deleted (domain model, section 4; Open Food Network's `spree_state_changes`).

### 4. Data and invariant owner

`order` owns `order_orders`, `order_lines` and `order_events`. Units belong to `offer`: `order` takes and returns them through `offer`'s published API inside its own transaction (domain model, section 4), never by writing `offer_offers`.

### 5. Context map

- `order` → `offer` (call, same transaction): take units of an offer and read what an order copies; return units on cancellation.
- `order` → `seller` (call): is the seller active; is the caller one of its people.
- No event. Withdrawing an offer leaves its orders standing: the seller still serves what was ordered, or refuses it at the counter. This departs from the domain model, which cancels open orders on `offer.WithdrawnEvent`: no event infrastructure exists yet (River is SEC-11 step 6), and a listener is not worth adding for the pilot's handful of orders. Revisit with River.

Allowed edges added to [ARCHITECTURE.md](../../../../ARCHITECTURE.md): `order` → `offer`, `seller`.

## The rules

| Rule | Source |
| --- | --- |
| An order holds 1 to 10 lines, each a different offer of the same seller, each 1 or more units | Figma K4c: one cart per seller; foodpanda and Keeta |
| An offer can be ordered while it is on sale, its window not over, and its seller active | Domain model, synchronous invariants |
| Units are taken by a conditional update; when two customers take the last unit, one order is placed | Founder's slide 9; persistence guideline |
| The order's window is the overlap of its offers' windows, and it must not be over; offers whose windows do not meet cannot be ordered together | *Ours* |
| An order is confirmed when it is placed; staff never accept it | Domain model decision, as Too Good To Go, Karrot and Open Food Network |
| Placing takes an `Idempotency-Key` header; the same key from the same customer returns the first order | Conventions, API discovery rule 7 |
| The customer cancels until the window opens, free of charge, and the units return | Domain model; Figma O2 (*the cut-off is an open question*) |
| Staff mark an order ready while it is confirmed and its window not over | Founder's slide 3 |
| The code is shown to the customer once the order is ready or its window has opened, until it ends | Figma O1, O4; Too Good To Go shows the code in the window |
| The code works only inside the window, once; three wrong codes lock it | Conventions, data and security; domain model |
| The code is derived, not stored: HMAC-SHA-256 of the order's identifier under `SECONDBITE_COLLECTION_CODE_KEY`, reduced to four digits | Conventions ("stored only as a hash"); identity keys its sign-in codes the same way |
| Staff refuse an order with a reason: `not_suitable`, `wrong_items` or `other`, with an optional note | Domain model; Figma Q15 |
| An order still confirmed or ready when its window ends is expired; its units are not returned | Domain model |
| Prices are copied onto the lines; the total is the sum; no fee | Open Food Network copies the price onto the line; no commission |

## The contract

| Operation | Who | Answer |
| --- | --- | --- |
| `POST /orders` `{lines: [{offerId, units}]}` with `Idempotency-Key` | A signed-in customer | `201` the order |
| `GET /orders?state=open\|ended&limit=&offset=` | The customer | `200` their orders, newest first |
| `GET /orders/{orderId}` | Its customer; the seller's people; admins | `200` the order; the code only to its customer |
| `POST /orders/{orderId}/cancel` `{reason?}` | Its customer | `200` the order |
| `GET /sellers/{sellerId}/orders?day=` | The seller's people; admins | `200` the orders whose window starts that day (Vietnam time; today by default) |
| `POST /orders/{orderId}/ready` | The seller's people | `200` the order |
| `POST /orders/{orderId}/hand-over` `{code}` | The seller's people | `200` the order, collected |
| `POST /orders/{orderId}/refuse` `{reason, note?}` | The seller's people | `200` the order |

An order carries its number, status (`confirmed`, `ready`, `collected`, `cancelled`, `refused`, `expired`), seller (name, address, collection point), lines, total, window, the times of each transition, the code when the caller may see it, and how many code attempts remain.

### Failures

| Code | Status | When |
| --- | --- | --- |
| `ORDER_LINES_INVALID` | 400 | No line, more than ten, a repeated offer, or offers of different sellers |
| `ORDER_IDEMPOTENCY_KEY_INVALID` | 400 | No key, or one of more than 255 characters |
| `ORDER_WINDOWS_DO_NOT_MEET` | 400 | The offers' windows share no time still to come |
| `ORDER_DAY_INVALID` | 400 | A seller's list asked for a day that does not exist |
| `ORDER_REFUSAL_INVALID` | 400 | An unknown refusal reason, or a note of more than 200 characters |
| `ORDER_OFFER_SOLD_OUT` | 409 | An offer has fewer units left than asked; nothing is taken |
| `ORDER_OFFER_UNAVAILABLE` | 409 | An offer is withdrawn, closed, or its seller not active |
| `ORDER_NOT_FOUND` | 404 | No such order, or one the caller may not see |
| `ORDER_CANCEL_TOO_LATE` | 409 | The window has opened, or the order has ended |
| `ORDER_TRANSITION_NOT_ALLOWED` | 409 | Ready, hand over or refuse an order that has ended; ready again answers the order as it is, so a double tap is harmless |
| `ORDER_OUTSIDE_WINDOW` | 409 | Handing over before the window opens |
| `ORDER_CODE_WRONG` | 409 | A wrong code; the order says how many attempts remain |
| `ORDER_CODE_LOCKED` | 409 | Three wrong codes were given; staff call support |

## Data

| Table | Holds | Lifecycle |
| --- | --- | --- |
| `order_orders` | Number (identity), customer and seller (no foreign key across modules), the seller's name and collection point copied, state (`confirmed`, `ready`, `collected`, `cancelled`, `refused`), window, total, idempotency key (unique per customer), wrong attempts, cancel and refuse reasons, the time and actor of each transition | Kept: the pilot's measures and the seller's history read it |
| `order_lines` | Order, offer, the name, unit, price and original price copied, units | Kept with its order |
| `order_events` | Order, what happened, who, when | Append-only |

`expired` is not stored: it is read from the window's end, as `offer` reads `closed`.

## Failure behaviour

- Placing runs in one transaction: lines checked, each offer's units taken by a conditional update, the order written. Any failure rolls everything back.
- Handing over locks the order row, so two staff entering codes at once count every wrong attempt.
- The collection code never reaches a log; logs carry the order's identifier only.

## Verification plan

- Unit: the window overlap, the code's derivation and its four digits, the status read from state and window.
- PostgreSQL (container, real migrations): placing takes units and two customers racing for the last unit get one order; idempotency; cancelling returns units; ready, hand-over with right, wrong and locked codes, outside the window; refuse; expiry read from the window; who may read and act.
- HTTP (assembled service): one customer flow from placing to collection through the API, and the problem codes.
- Web: Playwright on a phone and a desktop, with axe, for the pages the plan adds.

## Open questions

| Question | Who answers |
| --- | --- |
| Does the pilot only take payment at the counter, or also transfers by SePay before collection (domain model)? | Founder |
| Is an order one offer (domain model) or a cart of one seller's offers (Figma K4c)? Built as a cart. | Founder |
| Is cancelling free until the window opens, or until the seller marks the order ready? Built until the window opens. | Founder |
| Are a customer's units per day limited (domain model, assumption 4), and are customers who leave orders uncollected blocked? Not built. | Founder |
| Should withdrawing an offer cancel its open orders, which needs an event and River? Not built. | Team |
