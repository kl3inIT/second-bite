# SEC-78 — Pilot phase 1 holds, the seller's Đơn tab: plan

Design: [design.md](design.md). Tracked in Linear as SEC-78.

| # | Step | State |
| --- | --- | --- |
| 1 | Research: how marketplaces and pickup apps list orders at the counter, and the date filters on Mobbin | Done, 21 October 2026 |
| 2 | Figma: the Đơn tab (Q5, Q5b to Q5f), the day calendar (Q5g), and the search and day filter on Bài đăng (Q2, Q2c, Q2d) | Done, 21 October 2026; the phone layout and an overdue state are not drawn |
| 3 | Agree the backend changes with Đức Anh (SEC-15, SEC-50): a hold without sign-in, no code, reasons, undo, the day list, expiry, and the open decisions of the design | Waiting |
| 4 | Backend: the seller's list for a day with counts and the day's total, hand over, cancel with a reason, undo | Waiting for 3 |
| 5 | Web: the Đơn tab on the store page, the search and the day filter, the cancel dialog and the undo toast | Waiting for 4 (a stub of the API in tests until then) |
| 6 | Web: the search and the day filter on Bài đăng | Waiting for the post list's new title |
| 7 | Phone layout of the tab and the calendar sheet | To draw after 5 |

Each step is a pull request of its own, with commits of one concern each; a step is merged once its checks pass.
