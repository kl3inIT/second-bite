# SEC-108 — Withdrawing a post that has orders: plan

Design: [design.md](design.md).

1. Migration `0022` adds `withdrawn` to the refuse reasons; `order.RefuseWithdrawn`, not valid for staff, not reopenable.
2. `offer.Withdraw` stores the state and publishes `offer.withdrawn` in one transaction.
3. `order.RefuseWithdrawnOffer` listens and refuses the open orders of the offer, returning the units of the other offers; a Go check calls it twice.
4. OpenAPI, the web client and the mobile client are regenerated; the order's `refuseReason` answers `withdrawn`.
5. Web: the drawer warns that the orders end and confirms with "Rút bài và huỷ đơn"; "Quán đã rút bài" is the reason the customer and the seller read; a Playwright check of the drawer.
6. Specs: `docs/specs/offer.md` and `docs/specs/order.md`.
