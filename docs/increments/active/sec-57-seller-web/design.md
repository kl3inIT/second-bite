# SEC-57 — The seller's web screens: design

Status: started on 20 October 2026. Tracked in Linear as SEC-57; the screens are drawn in [SEC-53](../sec-53-seller-web-design/design.md) (Figma `Chủ quán · Web 1440`); the backend is the `seller` and `offer` modules ([seller](../../../specs/seller.md), [offer](../../../specs/offer.md)).

## Decision

Build the seller's side of the web, screen by screen as Figma draws it, for what the backend does today; the screens that need rules the backend lacks wait for their own issue and are not faked.

## What is built here

| Part | Figma | Backend it uses |
| --- | --- | --- |
| Open a store: name, phone, address, photo; the limit of five | O1, O1b, O1c | `POST /sellers`, `PUT /sellers/{id}/photo`, `POST /photos` |
| My stores, and none yet | S0 | `GET /sellers/mine` |
| The store's header and its tabs, home with today's posts | Q1, Q2 | `GET /sellers/{id}/offers` |
| The tabs Đang bán, Đã hết, Đã đóng | Q2, S1, S2 | the same, by `status` |
| Posting: kind, dish, how it sells, the result; a one-off dish; the errors on price and hours | P1, P2, P2b, P3, P3b, P3e, P5 | `POST /sellers/{id}/offers` |
| Post again from a closed post | R1 | the same, with the earlier offer's photo |
| Edit a post; the price locked once ordered; withdraw, refused once ordered | E1, E2, E2e, E3, E3b, K1 | `PATCH /offers/{id}`, `POST /offers/{id}/withdraw` |

## What waits

- **Expected surplus and the morning prompt** (P4, P7 to P9, Q1b, Q2c, Q2d, D2, D3, E4, R2): the backend has no announcement yet (SEC-54).
- **The catalog** (Q3, Q3b, Q3c, C1, C2, D1, the dish step of P2) was built in [SEC-55](../../completed/sec-55-seller-catalog/design.md), after this increment first held it back.
- **The Đơn tab** (Q4) and "withdraw refused once ordered": the `order` module (SEC-15, SEC-51). Until it lands, a post never has orders, so E2, E2e, E3b are built and tried against a stub in tests only.
- **In the edit and withdraw drawers** (E1 to E3b): "Hết hàng ngay" (the backend has no way to set the units left to zero while nothing is ordered), the reasons for withdrawing (the backend keeps none), and changing the hours once units are ordered (the backend allows only more units; the design of SEC-54 lifts it). The drawers lock the price and the hours then, and say so.
- The calendar and the custom time (P6, T1) were lost from Figma and are to be redrawn.

## Rules the screens follow

- Anyone signed in may open a store; it is active at once (PR #31). The coordinates are the mall's until a map exists; the form has no map.
- The store being managed is in the address (`/store/{sellerId}/...`); a person with one store goes straight to it, with several to the list (S0), and with none to the open-store form.
- Strings in `vi` and `en`, semantic tokens only, the generated SDK, a Playwright test per page with the accessibility check.
