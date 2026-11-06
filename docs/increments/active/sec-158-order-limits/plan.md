# Plan

Design: [design.md](design.md). Tracked in Linear as SEC-158.

| #   | Step | Checks | State |
| --- | ---- | ------ | ----- |
| 1   | Design and plan | Read with the user | Done, 6 November 2026 |
| 2   | Figma: the post's "Tối đa mỗi đơn", the dish's cap, the store's warning and "Nghi đặt ảo", the refusals' words, Cài đặt › Đặt món | Reviewed by the user | To do |
| 3   | Server: the migration, the offer's cap and default, the order settings, the checks when placing, `large` and the phone's counts, `suspected` | `TestOrder`, `TestOffer`, `TestModuleBoundaries`, `golangci-lint` | To do |
| 4   | The contract, the web SDK and the mobile client generated again | `TestOpenAPIDocumentIsCurrent`, `pnpm check:api` | To do |
| 5   | Web: the customer's stepper and words, the post's field, the store's warning and refusal, the admin page, the stub | `pnpm check`, end-to-end specs | To do |
| 6   | On the local stack against the real server, with screenshots; specs and test matrices | `verification.md` | To do |
| 7   | Pull request, staging, production, then this increment moves to `completed/` | On preview and production | To do |
