# SEC-62 — The admin web: design

Status: started on 20 October 2026. Tracked in Linear as SEC-62, under SEC-17. The screens are drawn in Figma, section `Quản trị · Web 1440` (page `Mobile · Khách`, file Secondbite): the row "Style 6.1" (AD-Q1 to AD-Q4), eleven rows of flows (AD-Q5 to AD-CD7) and the `Admin/*` components beside them. The backend it calls is the `seller`, `offer`, `identity` and `notification` modules ([seller](../../../specs/seller.md), [offer](../../../specs/offer.md), [identity](../../../specs/identity.md), [notification](../../../specs/notification.md)).

## Decision

Build every admin screen Figma draws, as SEC-57 built the seller's web. The screens call the admin API the backend already has. One read API is added for the dashboard, built only from data that exists today. A screen whose backend does not exist yet is built in full against a typed data source that returns nothing, so it shows its empty state. It never shows invented data. Afterwards, a flag per page keeps an unreleased page's code and makes its route render the shared coming-soon page. The founder asked for the whole menu first, and the pages to hide are chosen later.

## What is built here

| Part | Figma | Backend it uses |
| --- | --- | --- |
| Access: admin only; signed out to sign-in and back; a non-admin gets the customer not-found page | — | `GET /accounts/me` (`role`) |
| Shell: collapsible sidebar with the full menu, breadcrumb top bar, toasts | every row | — |
| Stores: summary cards, filter bar, sortable table, row menu, pagination; block (with a confirmation), unblock, activate; empty, loading, error, not found | AD-Q1, AD-Q2, AD-Q5 to AD-Q11, AD-TT1 to AD-TT5 | `GET /admin/sellers`, `POST /admin/sellers/{id}/block`, `…/activate`, `GET /admin/summary` (new) |
| A store: profile header, tabs Tổng quan, Bài đăng (by status), Thành viên; a post in a side sheet; blocked state | AD-Q3, AD-Q4, AD-QD1 to AD-QD4 | `GET /sellers/{id}`, `/members`, `/offers?status=`, `GET /offers/{id}` |
| Settings: offer settings and email settings, with the settings menu | AD-CS1 to AD-CS7 | `GET`, `PUT /admin/offer-settings`, `/admin/email-settings` |
| Dashboard: figures, orders chart, to-do list, top stores, recent activity | AD-TQ1, AD-TQ2 | `GET /admin/summary` (new); orders and payments are empty until their modules exist |
| Built in full, empty until their backend exists | AD-QD5, AD-BC*, AD-DH*, AD-HT*, AD-BL*, AD-DG*, AD-BD*, AD-TK*, AD-MK*, AD-CD* | none yet: SEC-15, SEC-18, SEC-13 and modules without an issue |
| Coming-soon flag per page; the shared coming-soon page | AD-TT6, AD-TT7 | — |

## The dashboard read API

- **Consumer and goal**: an admin opens the dashboard once or twice a day to see the pilot at a glance. The data may be a few seconds old. Strict consistency between the figures is not needed.
- **Shape**: one `GET /admin/summary?from=&to=`, `admin` only. It holds sections owned by their modules: stores by status and the stores opened in the range (`seller`); posts and units posted, on sale, sold out, per day, and the top stores by posts (`offer`, which keeps the store's name copied on each offer); accounts and new accounts per day (`identity`). Each module publishes a summary function in its root package and owns its query. The handler composes them, so no module reads another's tables.
- **Where it lives**: in `offer`, decided after reading `server/internal/*/handler.go`. The admin API is spread over `seller`, `offer` and `notification`, and only `offer` may read both `seller` and `identity` under the allowed edges, so no edge or module is added; `seller` could not, since `offer` already depends on it. A reporting module belongs to SEC-13.
- **Bounds**: `from` and `to` are days in Vietnam time, both included; the range is at most 90 days and defaults to the 30 that end today. The per-day series hold every day of the range, zeros included. Lists are capped: top sellers 5, the newest sellers and offers 5, whenever they were posted. A bad range answers `OFFER_SUMMARY_RANGE_REVERSED` or `OFFER_SUMMARY_RANGE_TOO_LONG` with `errors[].parameter` `query.from` ([API errors](../../../conventions.md#api-errors)); a module's failure can name a parameter since this change.
- **What "now" means**: on sale and sold out count the offers open at the moment of the request, a blocked seller's left out as search leaves them; the sellers by status are those of the moment too. Posted, opened and new accounts are counted in the range.
- **What it does not return**: orders, units collected, payments, refunds and problem reports. Their modules do not exist. The dashboard shows those cards empty, without zeros that look like measurements.

## Rules the screens follow

- Terms and copy as Figma: "cửa hàng" (never "quán"); "Đã gỡ" for a store's withdrawn post and "Gỡ do vi phạm" for an admin's removal; no subtitle or helper lines; notices are one-line toasts; number inputs clamp to their bounds (and the minimum and maximum pickup window bound each other) instead of showing range errors; choosing no encryption disables the SMTP password.
- Admin strings in `vi` and `en`, split per page under `web/messages/admin/` so pages can be built in parallel. Pages are `noindex`. Semantic tokens only. The generated SDK. A Playwright test per page with the accessibility check, on desktop and phone widths. Sample data appears only in tests.
- The seller detail keeps the joined date (`createdAt`). The list's time column is the change date (`updatedAt`).

## What waits

- The 14-day trend on the store cards needs a history of status changes, which `seller` does not keep. The chart is drawn empty until it does.
- Backends for orders (SEC-15), payments and refunds (SEC-18), problem reports and reports (SEC-13), and reviews, promotions, banners, broadcast notifications, sponsors, categories, areas, store documents, legal content, integrations, admin roles, account locking, the audit log and removing a post for a violation. These have no issue or decision yet.
- Open questions are kept in Linear SEC-62: where VietQR money lands, what happens to held orders when a post is removed or an account locked, and whether admin roles are split.
