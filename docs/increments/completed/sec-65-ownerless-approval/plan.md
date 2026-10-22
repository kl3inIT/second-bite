# SEC-65 — An owner-less seller cannot be approved: plan

Design: [design.md](design.md). Tracked in Linear as SEC-65.

| # | Step | State |
| --- | --- | --- |
| 1 | Server: approving locks the seller and refuses one with no owner, with `SELLER_OWNERLESS` in both languages | Done, 22 October 2026 |
| 2 | Tests: the transition table and the API flow | Done, 22 October 2026 |
| 3 | Spec and test matrix; the flag at approval moved to SEC-136, blocked by SEC-64 | Done, 22 October 2026 |
| 4 | Proof against the real service, with the admin web ([verification.md](verification.md)) | Done, 22 October 2026 |
| 5 | Review, then merge through a pull request and move this increment to `completed/` | Done, 22 October 2026 (PR #117) |
