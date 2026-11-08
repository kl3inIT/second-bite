# Plan

Design: [design.md](design.md). Tracked in Linear as SEC-158.

| #   | Step | Checks | State |
| --- | ---- | ------ | ----- |
| 1   | Design and plan | Read with the user | Done, 6 November 2026 |
| 2   | Figma: the post's "Tối đa mỗi đơn", the dish's cap, the refusals' words, Cài đặt › Đặt món | Reviewed by the user | Drawn on 6 November 2026 in the section "SEC-158 · Giới hạn đặt món" (L1–L7); reviewed: the drawer's hints become tooltips, the orders page loses its counts beside the title. L2–L4 (the store's warning and "Nghi đặt ảo") were dropped in Đạt's review of 8 November 2026 |
| 3   | Server: the migration, the offer's cap and default, the order settings, the checks when placing | `TestOrder`, `TestOrderLimits`, `TestOffer`, `TestService`, `TestModuleBoundaries`, `golangci-lint` | Done, 6 November 2026; trimmed on 8 November 2026 |
| 4   | The contract, the web SDK and the mobile client generated again | `TestOpenAPIDocumentIsCurrent`, `pnpm check:api`, `flutter analyze`, `flutter test` | Done, 6 November 2026; again on 8 November 2026 |
| 5   | Web: the customer's stepper and words, the post's field with the drawer's hints as tooltips, the orders page without its counts beside the title, the admin page, the stub | `pnpm check`, `pnpm test:e2e` | Done, 6 November 2026; trimmed on 8 November 2026 |
| 6   | On the local stack against the real server, with screenshots; specs and test matrices | `verification.md` | Done, 6 November 2026 |
| 7   | Đạt's review of 8 November 2026: the address cap and the large-order warning with "Nghi đặt ảo" removed; missed orders counted 3 in 30 days | `verification.md` | Done, 8 November 2026 |
| 8   | Pull request, staging, production, then this increment moves to `completed/` | On preview and production | To do |
