# SEC-96 — Closing what has ended, in the table: design

Status: started on 21 October 2026; delivered the same day (PR #63). Tracked in Linear as SEC-96, a child of [SEC-57](../../active/sec-57-seller-web/design.md).

## Why

A post's `closed` and an order's `expired` were read from the window's end in every query and never stored. Every read was right at the second the window ended, but the tables said otherwise: a report straight on them saw an order still `confirmed` hours after its window, and nothing happened at the moment a window ended, so there was no fact for a later message to customers to follow.

## Decisions

| # | Decision | Why |
| --- | --- | --- |
| 1 | A job every minute closes what is over: `offer_offers` still `on_sale` whose `window_end` has passed become `closed`; `order_orders` still `confirmed` or `ready` whose `window_end` has passed become `expired`, each with an `expired` row in `order_events` | The table follows the clock, and an order's end has a fact with a time |
| 2 | The reads keep comparing the window | Nothing waits for the job: a post is closed and an order expired to every reader the moment the window ends, up to a minute before the table says so |
| 3 | The schedule is a River periodic job, `Events.Every(name, interval, run)`, on the same PostgreSQL as the event outbox; each module registers its own | River elects one leader to enqueue, so instances do not double a run; no new dependency or process |
| 4 | A run that fails is not retried | The next run is a minute away and does the same work; the run is idempotent |
| 5 | The units of an expired order are not offered again, as before, and customers are not told | The post is closed anyway; there is still no channel to tell them |
| 6 | Two migrations, 0020 (the offer's `closed`) and 0021 (the order's `expired` and its event) | The tables' own checks name the stored states |

## Trade-offs

- A change to the rule that ends a window (an offer's window moved later, SEC-91) must come before the job closes it, as it does: it is refused once the offer is closed or withdrawn, and the job only closes what has ended.
- `closed` in the table is a cache of what the window says, never read in its place.

## Out of scope

Telling customers that an order expired; returning units of an expired order; a screen for the job's runs.
