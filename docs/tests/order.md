# order: verification matrix

Requirements of [docs/specs/order.md](../specs/order.md) and the checks that hold them. Paths are under `server/`. `TestOrder` (`internal/order/order_test.go`) runs its checks in parallel against one migrated PostGIS, each with accounts, sellers and offers of its own; a check that needs time to pass moves an order's window in the table.

| Requirement | Check |
| --- | --- |
| A cart of two offers is confirmed with its total, the window both offers share and its number; the units are taken; the same key returns the same order and takes nothing more; no key and nobody signed in are refused | `TestOrder` › placing takes units and confirms at once |
| Too many units, two sellers, an offer twice, no unit, no line, windows that do not meet and an unknown offer are refused and take nothing; a withdrawn offer and a blocked seller cannot be ordered | `TestOrder` › a cart refused takes nothing |
| Two customers ordering the last unit at once: one order | `TestOrder` › two customers race for the last unit |
| The customer reads the order with its access; staff and admins read it without the access; a stranger gets 404; an admin does not act for the seller | `TestOrder` › who reads an order |
| The customer cancels and the units return; the seller cannot cancel; not twice; still once the window has opened; not once ready | `TestOrder` › cancelling until the order is ready |
| A stranger cannot hand over; the seller's people collect the order; nothing after; not before the window | `TestOrder` › handing over |
| Staff refuse with a known reason and a note; the customer cannot; the units are not offered again; nothing after | `TestOrder` › staff refuse an order |
| Refusing for no answer, no show or too late gives the units back; for out of food or another reason it does not | `TestOrder` › no answer or no show gives units back |
| A hand-over is taken back; a refusal that returned its units is taken back only while they are still there; a stranger gets 404 | `TestOrder` › a mistake is taken back |
| What its customer cancelled, an order whose window is over and one still open cannot be reopened | `TestOrder` › some orders are not reopened |
| The orders still to collect follow the new window of their offer, twice delivered changing nothing more, and one handed over keeps its own | `TestOrder` › orders follow their offer's window |
| The job stores `expired` with an event on the orders still to collect whose window is over, and leaves one handed over and one still running; run twice it changes nothing more; an expired order is not reopened | `TestOrder` › ended orders expire in the table |
| The customer rates a collected order once, signed in or with its access; an order not collected, a stranger, the seller, a second review, stars out of range, an unknown or repeated tag and a long comment are refused; the review is listed with the order | `TestOrder` › a collected order is rated once |
| An order whose window is over reads as expired and cannot be handed over, made ready or cancelled | `TestOrder` › expiry is read from the window |
| A seller's people list the orders of today, not of tomorrow, without the access; a stranger cannot | `TestOrder` › a seller lists the orders of a day |
| The customer lists all, open and ended orders, newest first; another account sees none of them | `TestOrder` › the customer lists open and ended orders |
| Admins read what an account ordered: placed, handed over, missed (a lapsed window and a no-show, not a refusal for the food), the latest five with their lines and without their access; a customer is refused | `TestOrder` › admins read what an account ordered |
| Through the API: no key is a problem; an order is placed with its number and access, sent again with the same key; too many units is refused; ready without the access for staff, then handed over; the customer's ended orders | `TestService` › an order is placed, made ready and handed over (`cmd/secondbite/order_test.go`) |
| A message is trimmed, numbered and read back with both sides' seen marks and `unreadMessages`, beyond-the-last counts as the last, and seen never lowers | `TestOrder` › the two sides of an order talk |
| Only the customer (session or access) and the seller's people read, write, mark seen and get tickets; a stranger, an admin, another seller's owner and a wrong access get 404 | `TestOrder` › who takes part in a chat |
| A cancelled, refused or expired order's chat locks at once; a collected one stays writable 2 hours; a resend after closing returns the first message | `TestOrder` › a chat closes with its order |
| Empty, blank and over-long messages and bad keys are refused; the same key returns the first message; 20 a minute with a wait; 500 in a chat | `TestOrder` › a chat is bounded |
| Concurrent senders get numbers 1 to n with no gap | `TestOrder` › messages are numbered in commit order |
| Tickets are minted for who may, work once, expire and are purged, and are stored only as a hash | `TestOrder` › live tickets work once, for who may |
| Every path that changes an order notifies, and a failed placing notifies nothing | `TestOrder` › every change of an order notifies |
| Chats are forgotten 30 days after the window, run twice; a deleted account's chats go through the outbox, twice, and another customer's stay | `TestOrder` › old chats are forgotten; `TestDeletedCustomerChatsAreForgotten` |
| The hub: a notice reaches a socket on another instance; a rollback and other topics reach nobody; a ticket works once; 20 topics; 40 subscribe attempts and 10 idle seconds; 1008, 1009, 1013, a missed pong, 4000, `resync` after the listening connection is killed, a socket outliving the server's timeouts, 1001 on stop | `TestLive` (`internal/platform/live_test.go`) |
| Through the assembled service: a customer follows an order with a ticket and hears it turn ready; a stranger gets no ticket | `TestService` › an order's live socket carries its changes |
| The module depends only on the edges ARCHITECTURE.md allows | `TestModuleBoundaries` (`internal/boundaries_test.go`) |
| The operations are in the contract | `TestOpenAPIDocumentIsCurrent` (`cmd/secondbite/openapi_test.go`) |
| A seller's moved point is copied onto its order to collect, not onto one handed over; delivered twice, nothing more changes; an unknown seller is ignored | `TestOrder` › orders and offers follow their seller |

Not covered by a test: the same key arriving twice at once (held by the unique index, then read back), and two staff handing over at once (held by the row lock).
