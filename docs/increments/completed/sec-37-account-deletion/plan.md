# SEC-37 — Account deletion: plan

Design: [design.md](design.md). Tracked in Linear as SEC-37.

| # | Step | State |
| --- | --- | --- |
| 1 | Design: boundary discovery, the outbox, the contract | Done, 20 October 2026 |
| 2 | Platform: River, its migrations, `Publish` and `Listen` | Done, 20 October 2026 |
| 3 | Identity: deletion codes, `POST /accounts/me/deletion-codes` and `/deletion`, `AccountDeletedEvent`; `notification` forgets the address | Done, 20 October 2026 |
| 4 | Seller and file: their listeners | Done, 20 October 2026 |
| 5 | Web: the account tab's entry and `/delete-account` | Done, 20 October 2026 |
| 6 | Mobile: the account tab's entry and the deletion screen | Done, 20 October 2026 |
| 7 | Privacy policy, specs, test matrices, architecture, guidelines; verification | Done, 20 October 2026 |
| 8 | Account settings: the account menu and tab lead to it, deletion at its foot (web and app) | Done, 20 October 2026 |
| 9 | Review, then merge through a pull request and move this increment to `completed/` | Done, 20 October 2026 (PR #33) |
