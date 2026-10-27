# SEC-162 — The store's staff on the web, and a store handed to its owner: verification

Run on 27 October 2026 on Windows 11, on the branch before review.

## Checks

| Part | Outcome |
| --- | --- |
| Backend | `golangci-lint` 0 issues; every package's tests pass, `TestChangeOwner` among them, and the audit test that runs every admin change (`changeSellerOwner` records one event); `sqlc` regenerated; the contract rewritten |
| Web | `pnpm check` passes (172 unit tests, types, lint, knip). Playwright passes on a phone and a computer with axe: 377 passed, 15 skipped, `store-staff.spec.ts` and the admin's owner change among them |
| App | The API client regenerated from the contract; `flutter analyze --fatal-infos` finds nothing |

## Against the real service

The server and the web's production build ran from the branch, with PostgreSQL and Mailpit. The team member, the staff and the new owner signed in by emailed codes; the admin was granted with `secondbite admin grant`.

- **The owner:**
  - Opened "Nhân viên" from the store's menu (N1).
  - Added two addresses, then removed one after the confirm (N2).
  - The API then read `team=owner, staff=staff`.
- **Staff, on a Pixel 7:**
  - Saw the list without the form, with "Rời quán" on their own row (N3).
  - The phone's bar read "Nhân viên" and went back to the store.
- **The admin:**
  - On the members tab (AD-QD4b), handed the store to a new address (AD-QD4c).
  - The tab then read `team=staff, staff=staff, chu=owner`.
  - The audit trail held `seller.change_owner {"to": …, "from": …}`, account identifiers only.
- **Refusals:**
  - The same owner again: `409 SELLER_ALREADY_OWNER` "Người này đã là chủ của quán."
  - The previous owner trying it: `403 PLATFORM_ADMIN_REQUIRED`.
- **The new owner, on a phone (N1m):** managed the people, the previous owner listed as staff with "Xoá".
- **Staff leaving:** left on the phone, landed on their stores, and the store kept `team=staff, chu=owner`.
