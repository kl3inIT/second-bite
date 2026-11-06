# Plan

Design: [design.md](design.md). Tracked in Linear as SEC-158.

| #   | Step | Checks | State |
| --- | ---- | ------ | ----- |
| 1   | Design and plan | Read with the user | Done, 6 November 2026 |
| 2   | Figma: the post's "Tối đa mỗi đơn", the dish's cap, the store's warning and "Nghi đặt ảo", the refusals' words, Cài đặt › Đặt món | Reviewed by the user | Drawn on 6 November 2026 in the section "SEC-158 · Giới hạn đặt món" (L1–L7); reviewed: the drawer's hints become tooltips, the orders page loses its counts beside the title |
| 3   | Server: the migration, the offer's cap and default, the order settings, the checks when placing, `large` and the phone's counts, `suspected` | `TestOrder`, `TestOrderLimits`, `TestOffer`, `TestService`, `TestModuleBoundaries`, `golangci-lint` | Done, 6 November 2026 |
| 4   | The contract, the web SDK and the mobile client generated again | `TestOpenAPIDocumentIsCurrent`, `pnpm check:api`, `flutter analyze`, `flutter test` | Done, 6 November 2026 |
| 5   | Web: the customer's stepper and words, the post's field with the drawer's hints as tooltips, the store's warning and refusal, the orders page without its counts beside the title, the admin page, the stub | `pnpm check`, `pnpm test:e2e` (437 passed) | Done, 6 November 2026 |
| 6   | On the local stack against the real server, with screenshots; specs and test matrices | `verification.md` | To do |
| 7   | Pull request, staging, production, then this increment moves to `completed/` | On preview and production | To do |
