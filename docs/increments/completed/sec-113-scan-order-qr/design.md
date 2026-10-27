# SEC-113 — Scanning the customer's order QR from the Đơn tab: design

Status: started on 21 October 2026; delivered the same day (PR #79). Tracked in Linear as SEC-113, a child of [SEC-57](../../active/sec-57-seller-web/design.md). It reads the QR that [SEC-86](../../completed/sec-86-collect-without-code/design.md) draws on the customer's order page and opens the order's own page ([SEC-102](../../completed/sec-102-seller-order-steps/design.md)).

## Why

The customer's order page shows a QR, but the counter could only search by name or phone number. Scanning it opens the order at once, where the seller hands it over.

## Decisions

| # | Decision | Why |
| --- | --- | --- |
| 1 | An icon button beside the search of the Đơn tab opens a scanner: a dialog with the camera (Figma Q5l, Q5m, Q5n) | The search stays; scanning is the quick way when the customer shows the code |
| 2 | The QR holds the order's identifier as it is; a code that is that identifier is an order, anything else is not | Nothing to sign or parse: the identifier is random and the API only lets the seller's people read the order |
| 3 | An order of this store opens \`/stores/{id}/orders/{orderId}\`; an order of another store, or any other code, says "Mã này không phải đơn của quán" and the camera goes on reading | The seller's own page is the one place an order is served; another store's order must not open |
| 4 | The scanner reads the camera with jsQR (1.4.0, no dependencies), a frame every 150 ms at most 640 px wide | One path on every browser: the native BarcodeDetector is missing on Safari |
| 5 | The camera starts when the scanner opens and its tracks stop when it closes or a code is found; a refused or missing camera says so | No camera runs in the background; the search is still there |

## Trade-offs

- jsQR reads frames on the main thread; at this rate it costs little, and only while the scanner is open.
- The camera needs HTTPS and the person's permission; a desktop without a camera gets the message.

## Out of scope

Handing the order over from the scan itself (the page has its buttons); scanning on the customer's side; a flashlight or zoom control.
