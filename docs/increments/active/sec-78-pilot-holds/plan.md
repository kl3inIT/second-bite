# SEC-78 — Pilot phase 1 holds, the seller's Đơn tab: plan

Design: [design.md](design.md). Tracked in Linear as SEC-78.

| # | Step | State |
| --- | --- | --- |
| 1 | Research: how marketplaces and pickup apps list orders at the counter, and the date filters on Mobbin | Done, 21 October 2026 |
| 2 | Figma: the Đơn tab (Q5, Q5b to Q5f), the day calendar (Q5g), and the search and day filter on Bài đăng (Q2, Q2c, Q2d) | Done, 21 October 2026; the phone layout and an overdue state are not drawn |
| 3 | Settle the backend with the team: pull request 45 (SEC-76) carries the order module with a customer's name and phone and no sign-in, and supersedes pull request 25 | Done, 21 October 2026: the pilot reuses `order`; name and phone are required |
| 4 | Backend, on top of pull request 45: deliver with no code, the refusal reasons and the units that go back, reopen (migration 0015, spec, checks, contract) | Built, pull request open, based on the branch of pull request 45 |
| 5 | Web: the Đơn tab on the store page, the search and the day filter, the cancel dialog and the undo toast, with the generated clients for the web and the app | Built in the same pull request, with a Playwright check on the stub |
| 6 | Web: the search and the day filter on Bài đăng | Waiting for the post list's new title |
| 7 | Phone layout of the tab and the calendar sheet | To draw after 5 |

Steps 4 and 5 are one pull request, with commits of one concern each, merged once its checks pass.
