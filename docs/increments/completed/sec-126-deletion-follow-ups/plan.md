# SEC-126 — Account deletion, the low-risk follow-ups: plan

Design: [design.md](design.md). Tracked in Linear as SEC-126.

| # | Step | State |
| --- | --- | --- |
| 1 | Platform: `PublishAfter`; identity delivers `AccountDeletedEvent` again two minutes later | Done, 22 October 2026 |
| 2 | Notification: the index on `lower(recipient)` (migration 0031) | Done, 22 October 2026 |
| 3 | Identity: limits and the live code per purpose, three deletion codes an hour | Done, 22 October 2026 |
| 4 | File: unused photos forgotten in a set order; the part-way failure tested | Done, 22 October 2026 |
| 5 | Specs and test matrices | Done, 22 October 2026 |
| 6 | Proof against the real service ([verification.md](verification.md)) | Done, 22 October 2026 |
| 7 | Review, then merge through a pull request and move this increment to `completed/` | Done, 22 October 2026 (PR #118) |
