# order: verification matrix

Requirements of [docs/specs/order.md](../specs/order.md) and the checks that hold them. Paths are under `server/`. `TestOrder` (`internal/order/order_test.go`) runs its checks in parallel against one migrated PostGIS, each with accounts, sellers and offers of its own; a check that needs time to pass moves an order's window in the table.

| Requirement | Check |
| --- | --- |
| A cart of two offers is confirmed with its total, the window both offers share and its number; the units are taken; the same key returns the same order and takes nothing more; no key and nobody signed in are refused | `TestOrder` › placing takes units and confirms at once |
| Too many units, two sellers, an offer twice, no unit, no line, windows that do not meet and an unknown offer are refused and take nothing; a withdrawn offer and a blocked seller cannot be ordered | `TestOrder` › a cart refused takes nothing |
| Two customers ordering the last unit at once: one order | `TestOrder` › two customers race for the last unit |
| The customer reads the order, with no code until it is ready or its window opens; staff and admins read it without the code; a stranger gets 404; an admin does not act for the seller | `TestOrder` › who reads an order and its code |
| The customer cancels before the window opens and the units return; the seller cannot cancel; not twice; not once the window has opened | `TestOrder` › cancelling until the window opens |
| The code is shown once the window opens; a stranger cannot hand over; a wrong code is counted; the right code collects the order; nothing after; not before the window | `TestOrder` › handing over against the code |
| The third wrong code locks the order, the right code then too, and the customer no longer sees it | `TestOrder` › three wrong codes lock it |
| Staff refuse with a known reason and a note; the customer cannot; the units are not offered again; nothing after | `TestOrder` › staff refuse an order |
| Staff deliver an order with no code, before its window opens; a stranger and the customer cannot; not twice; the units stay taken | `TestOrder` › the counter delivers without a code |
| Refusing for no answer, no show or too late gives the units back; for out of food or another reason it does not | `TestOrder` › no answer or no show gives units back |
| A delivery is taken back; a refusal that returned its units is taken back only while they are still there; what its customer cancelled, an open order and one whose window is over cannot be reopened; a stranger gets 404 | `TestOrder` › a mistake is taken back |
| An order whose window is over reads as expired without its code and cannot be handed over, made ready or cancelled | `TestOrder` › expiry is read from the window |
| A seller's people list the orders of today, not of tomorrow, without codes; a stranger cannot | `TestOrder` › a seller lists the orders of a day |
| The customer lists all, open and ended orders, newest first; another account sees none of them | `TestOrder` › the customer lists open and ended orders |
| Through the API: no key is a problem; an order is placed with its number and code, sent again with the same key; too many units is refused; a wrong code, then ready without the code for staff, then handed over; the customer's ended orders | `TestService` › an order is placed, made ready and handed over (`cmd/secondbite/order_test.go`) |
| The module depends only on the edges ARCHITECTURE.md allows | `TestModuleBoundaries` (`internal/boundaries_test.go`) |
| The operations are in the contract | `TestOpenAPIDocumentIsCurrent` (`cmd/secondbite/openapi_test.go`) |

Not covered by a test: the same key arriving twice at once (held by the unique index, then read back), and two staff entering codes at once (held by the row lock).
