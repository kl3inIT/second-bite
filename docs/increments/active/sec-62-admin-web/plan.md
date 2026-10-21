# SEC-62 — The admin web: plan

Design: [design.md](design.md). Tracked in Linear as SEC-62. Each step is one or more commits on the increment's branch, one per screen or capability. Steps 2 and 3 run in parallel, and so do steps 4 to 9, each in its own worktree. They are merged into the branch in order.

On 21 October 2026 the tech lead moved the shell, access, Figma rows 1 to 4 and the rules for admin code to SEC-75, which also settles the web libraries (`nuqs`, TanStack Table and Form with `zod`), an audit table and the store states `pending`, `active`, `rejected`, `blocked`. Steps 2, 4 and 5 below were built before that decision; the pull request offers them as a base for SEC-75 and leaves the choice to the tech lead.

| # | Step | State |
| --- | --- | --- |
| 1 | Increment: design and plan | Done, 20 October 2026 |
| 2 | Web foundation: `role` in the current account, the admin access guard, the shell (sidebar, top bar, toasts), the shared admin components, per-page admin messages, the page flag registry (every page on) | Done, 21 October 2026 |
| 3 | Backend: `GET /admin/summary` from the `seller`, `offer` and `identity` summaries, with tests, specs, OpenAPI and regenerated clients | Done, 20 October 2026 |
| 4 | Stores: list, filters, sort, row menu, block, unblock, activate, empty, loading, error, not found; a store's detail, posts, members, post sheet, blocked state | Done, 21 October 2026 |
| 5 | Settings: offer settings, email settings, the settings menu; the other settings pages (categories, areas, admins, audit log, legal, integrations), empty until their backend exists | Done, 21 October 2026 |
| 6 | Dashboard and reports: the dashboard on `GET /admin/summary`; reports and export, empty until their backend exists | Done, 21 October 2026 |
| 7 | Orders, payments and refunds, empty until SEC-15 and SEC-18 | Done, 21 October 2026 |
| 8 | Problem reports, reviews, all posts, accounts, empty until their backend exists | Done, 21 October 2026 |
| 9 | Marketing: promotions, banners and content, notifications, sponsors, empty until their backend exists | Done, 21 October 2026 |
| 10 | Coming-soon flags: the shared coming-soon page; the pages without a backend are switched to it | Done, 21 October 2026: only the overview, the stores and the offer and email settings are released |
| 11 | Verification: `pnpm check`, the backend gates, Playwright with axe on desktop and phone; `verification.md`; pull request | Done, 21 October 2026: pull request #41, CI green on b1ebe7b |
| 12 | Figma rows 12 to 14, then web behind flags: an admin opens a store for its owner (SEC-64), store review with reasons (SEC-64, SEC-65), one admin role and the audit log (SEC-75) | Done, 21 October 2026 |
