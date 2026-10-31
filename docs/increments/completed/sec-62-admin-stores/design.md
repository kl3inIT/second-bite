# SEC-62 — The admin's list of stores: design

Status: completed, 22 October 2026: every step done; the rest of the admin web stays on SEC-62. Earlier: started on 21 October 2026. Tracked in Linear as SEC-62. The screen is Figma AD-Q1 (section "Quản trị · Web 1440", frame `220:3331`), with its menu (AD-Q2, AD-Q8) and the block dialog with a reason (AD-DS4). The rules are SEC-75's ([design](../../completed/sec-75-admin-foundation/design.md)): the states, the list API and the admin web's lists and actions; the backend is the `seller` module ([spec](../../../specs/seller.md)).

## What an admin can do

- Open "Cửa hàng" from the menu and see the stores, 10 to a page by default as Figma draws it, with their photo or initials, address, phone, status and the day they last changed.
- See how many stores are active, pending and blocked, and press one of those cards to list only that status; pressing it again lists every status.
- Find a store by words of its name, address or phone, with or without marks; sort by name, address or the last change, either way; choose 10, 25 or 50 rows a page; move between pages. Every choice is in the address.
- From a row's menu: block an active store with a reason the owner is emailed, 10 to 500 characters, counted (AD-Q5); unblock a blocked one after a confirmation; approve a pending or rejected one after a confirmation; reject a pending one with a reason. Each ends with a notice, and the list reads again.
- Tell an empty list from a search that found nothing, which offers to clear the filters.

## Decisions

- **Only what the backend answers.** Figma also draws what the backend does not have; those parts wait and are not faked (as [SEC-57](../sec-57-seller-web/design.md) did):

  | In AD-Q1 | Why it waits |
  | --- | --- |
  | "Khu vực" filtering | A store has no area yet; giving one belongs to the seller's side of SEC-66. The filter is drawn now, at the user's request on 21 October 2026: it offers the 34 provinces the web reads from provinces.open-api.vn's API v2 and keeps the choice in the address, but the list does not send it until a store has a province |

- **The status says what the store is.** Figma's rows read "Hoàn tất"; the badge shows the seller's status instead: Đang hoạt động, Chờ duyệt, Bị từ chối, Bị chặn, each with its icon.
- **The cards.** Three, as Figma draws them: active, pending and blocked, from the list's `counts`, which follow the words searched. Rejected stores are counted by the server but have no card; they appear in the list with every status.
- **Approve and reject stay in the menu** for the statuses they apply to. Since SEC-57 a store opens active, so they show only for a store left pending or rejected from before; the API, its audit and its email exist (SEC-75).
- **The sparkline is measured, never drawn from nothing** (DESIGN.md's Honest Number Rule). The seller module keeps `seller_status_days`, written in the transaction of every opening and status change; `GET /admin/sellers` answers the last 14 days as `days`, beside the page, so the screen makes one call. Counting starts with the migration: the line begins on that day and is not drawn with fewer than two days.
- **"Sửa đổi" is a range of days** on a calendar, Figma `Admin/DateRange` as the log's filter has it (`features/admin/day-range.tsx`, shared with the log), sent as `changedSince` and `changedUntil`, Vietnam's midnights.
- **Wording** follows the Figma frames ("cửa hàng", "chặn", "gỡ chặn", "duyệt", "từ chối"), as SEC-75 decided.
- **Components** are the ones the accounts list uses (SEC-75 on `dathip04/sec-75-admin-accounts`): `DataTable` with `SortHeader`, `ListFooter`, `AlertDialog` for a confirmation, `Dialog` with a `Textarea` for a reason, and `toast` for the notice. `SortHeader` is taken as that branch writes it, so the two meet without conflict.

## A store's page (AD-Q3, AD-Q4)

`/admin/sellers/{id}`, opened from a row's "Xem chi tiết" or its name. The photos of its three latest posts over its photo, name and status, and its "⋯": every action on a store is in one menu, the list's (`StoreActions`), so a new one is added once (changed with the user on 21 October 2026 from Figma's separate "Chặn cửa hàng" button). Tabs: Tổng quan (the posts on sale, the address and phone, the members), Bài đăng and Thành viên, with their counts; the posts tab chooses a status (Đang bán, Hết hàng, Đã đóng, Đã gỡ, with counts) and a view, boxes or a table, both in the address, and a post opens a panel with its description, units, weight, window, place and times (AD-QD1 to AD-QD3), all from the posts the page already reads; the tab is in the address, so "Xem tất cả" is a link. A blocked store's photos fade (AD-Q4). It reads `GET /sellers/{id}`, `/members` and `/offers`, which answer admins; a post's row is the seller's own `PostRow`. An unknown store is the admin's not-found page.

## A store's orders (AD-QD6, AD-QD7)

A fourth tab, "Đơn hàng", lists the store's orders of one day, the soonest window first, as `GET /sellers/{id}/orders?day=` answers admins; the day is the seller's lists' `day` parameter, chosen with the app's `DayBar`, whose steps keep the page's `tab`. A row's "⋯" menu and its number open the order's page (SEC-135) with `?from=store`, whose crumbs then read Cửa hàng › the store › the number, each a link back. Admins read orders and never act on them.

## Contract

No new operation. The list's item, `AdminSellerBody`, embedded the unexported `sellerBody`, which huma leaves out of the document, so the generated clients knew only `ownerEmail`. It now lists its own fields, as `recordBody` does since SEC-75; the JSON on the wire is unchanged.

| Call | Used for |
| --- | --- |
| `GET /admin/sellers?status=&q=&sort=&page=&size=` | The page, its total and the counts |
| `POST /admin/sellers/{id}/block {reason}` | Block; `SELLER_REASON_INVALID` (400) is shown at the field |
| `POST /admin/sellers/{id}/approve` | Approve, and unblock |
| `POST /admin/sellers/{id}/reject {reason}` | Reject |

`SELLER_STATUS_CHANGE_NOT_ALLOWED` (409), when another admin changed the store first, is shown as the server words it and the list reads again.

## Verification

- `go test ./cmd/secondbite -run TestOpenAPIDocumentIsCurrent` with the contract written again; `pnpm generate:api`; the mobile client generated again.
- The stub backend answers the list, its filters and the three actions with the real statuses and codes.
- Playwright on a phone and a desktop: the page opens with axe clean; a card filters; words, a sort and the page size reach the address; a block asks a reason, refuses a short one and ends in a notice; an unblock asks first; an empty search offers to clear it.
- `pnpm check`.

## Open

- The store's page (AD-Q3, AD-Q4) and opening a store for its owner (AD-OS1–OS4): later steps of SEC-62.
- The sparkline, the area and the time filter need a backend of their own; who takes them is for the tech lead.
