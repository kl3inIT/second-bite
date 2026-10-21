# SEC-113 — Scanning the customer's order QR from the Đơn tab: plan

Design: [design.md](design.md).

1. `jsqr` joins the web's dependencies.
2. `order-code.ts` reads an order's identifier from a code, with its unit check.
3. `scan-order.tsx`: the button and the scanner dialog; the day filter takes it as what stands beside the search.
4. Words in both languages; a Playwright check of the dialog with no camera.
