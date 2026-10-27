# SEC-86 — Collect without a four-digit code: design

Status: started on 21 October 2026. Tracked in Linear as SEC-86. It changes the order module of [SEC-15](../sec-15-order-module/design.md) and the access of [SEC-76 decision 7](../sec-76-web-customer-flow/design.md); those designs stay as they were written, and this one supersedes them where they differ.

## Why

The staging deployment of 21 October 2026 failed: the server needs `SECONDBITE_COLLECTION_CODE_KEY`, whose secret file was never created on the host. The owner chose to drop the code rather than add the secret. The sponsor's tracking sheet already questioned it ([row 12](../../../brief/2026-10-20-sponsor-tracking-sheet.md)), and the seller's Đơn tab of [SEC-78](../../active/sec-78-pilot-holds/design.md) ends an order with one "Đã giao" button and no code. Figma section 16 (D2, D3) shows a QR code and says the customer may give their name and phone number instead.

## Decisions

| # | Decision | Why |
| --- | --- | --- |
| 1 | Staff hand an order over with "Đã giao" once they have matched the collector to it, by the QR code on the order's page or by the name and phone number on the order. `POST /orders/{orderId}/hand-over` takes no body | The owner's choice; SEC-78 › Decision; Too Good To Go, Phenix and Grab let staff confirm without typing a code |
| 2 | No wrong-code count and no lock: `wrong_code_attempts`, `ORDER_CODE_WRONG`, `ORDER_CODE_LOCKED` and the `code_wrong` event go | Nothing is typed, so nothing is guessed |
| 3 | The QR code holds the order's identifier, a random UUID; it needs no secret. The web draws it in SEC-83 | An order number (`SB-10001`, `SB-10002`, …) runs in sequence and can be guessed; the identifier cannot |
| 4 | The access that lets a guest read and cancel their order is a random token stored with the order (`order_orders.access`, 122 random bits), compared in constant time, instead of an HMAC under the code key | The idempotent replay must return the same access, so it is stored, not rotated |
| 5 | `SECONDBITE_COLLECTION_CODE_KEY` and the `collection-code-key` secret are removed from the server, both compose files, `deploy.sh` and the runbooks | The server starts with the secrets the host already has |
| 6 | A new migration (0015) drops the column and adds the access, rather than editing 0014 | 0014 never ran on staging, but it ran on the team's local databases; migrations are append-only |

## Trade-offs

- A copy of the database now grants a guest's read and cancel, which the derived access avoided. The database holds the customers' names and phone numbers already, so it is guarded as personal data either way ([data and security](../../../conventions.md#data-and-security)).
- Someone who knows a customer's name and phone number could collect for them. The window is short, the customer pays at the counter, and the seller sees the order's dishes; a code can return if the pilot shows abuse.

## Out of scope

- The web's new order page with the QR code: SEC-83.
- The seller's Đơn tab: SEC-78.
