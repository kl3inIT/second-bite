# seller

Owns sellers, their status set by admins, and the people who act for them (tables `seller_*`). Decided in the [SEC-10 design](../increments/completed/sec-10-backend-foundation/design.md#seller), from Open Food Network and Spree multi-vendor. Checks: [docs/tests/seller.md](../tests/seller.md).

## Operations

| Operation | Who | Answer |
| --- | --- | --- |
| `POST /sellers` `{name, address, latitude, longitude, phone}` | Anyone signed in, owning fewer than five sellers | `201` seller, `active` at once, the caller its owner |
| `GET /sellers/mine` | Anyone signed in | `200` the sellers they own or work for, with their role |
| `GET /sellers/address?latitude&longitude` | Anyone signed in | `200` the address at a point, as people write it, from OpenStreetMap's Nominatim; empty when it is not known or the service does not answer ([SEC-110](../increments/active/sec-110-address-from-location/design.md)) |
| `GET /sellers/{sellerId}` | Its members; admins | `200` seller |
| `PUT /sellers/{sellerId}` | Its owner | `200` seller |
| `PUT /sellers/{sellerId}/photo` `{photoId}`, `DELETE` | Its owner | `200` seller with its `photoId`; `204` |
| `GET /sellers/{sellerId}/members` | Its members; admins | `200` owner and staff with their addresses |
| `POST /sellers/{sellerId}/members` `{email}` | Its owner | `201` the new staff member |
| `DELETE /sellers/{sellerId}/members/{accountId}` | Its owner, or a staff member removing themself | `204` |
| `GET /sellers/{sellerId}/profile` | Anyone | `200` an active seller's name, address, location and photo; `404` for one blocked |
| `GET /admin/sellers?status=&q=&sort=&page=&size=` | Admins | `200 {items, page, pageSize, total, counts}`: sellers in the statuses given (every one when none) whose name, address or phone holds `q`, marks ignored; by default pending ones first, the oldest first, then the latest change first, or sorted by `name`, `address` or `changed` (`-` descending); `counts` gives each status matching `q`, for the cards above the list; each with its owner's address; `size` 1 to 100, 25 by default; a page past the end is empty (SEC-75) |
| `GET /admin/memberships?accountId=` | Admins | `200 {memberships}`: the sellers each account given (1 to 100, the parameter repeated) owns or works at, owners first, with the seller's name and status, for the admins' accounts (SEC-75) |
| `POST /admin/sellers/{sellerId}/approve` | Admins | `200` seller, `active`, from `pending`, `rejected` or `blocked`; its owner emailed |
| `POST /admin/sellers/{sellerId}/reject` `{reason}` | Admins | `200` seller, `rejected`, from `pending`; its owner emailed the reason |
| `POST /admin/sellers/{sellerId}/block` `{reason}` | Admins | `200` seller, `blocked`, from `active`; its owner emailed the reason |

Published to other modules: `Publishing(seller, account)`, which `offer` calls before posting or changing: the seller's name and collection point when the account is the owner or staff of an active seller, `SELLER_NOT_FOUND` when it is not a member, `SELLER_NOT_ACTIVE` when the seller is not active; `Publics(sellers)`, what customers see of the active ones among them; `Blocked()`, the sellers whose offers search leaves out.

## Rules

- Statuses (SEC-75): `pending`, `active`, `rejected`, `blocked`. A seller is `active` when opened (the pilot has no approval step yet, SEC-57; SEC-64 brings it back). An admin approves a pending, rejected or blocked seller, rejects a pending one and blocks an active one; any other change answers `SELLER_STATUS_CHANGE_NOT_ALLOWED`. Each change is one conditional update, so two admins at once cannot both pass.
- Rejecting and blocking take a reason, 10 to 500 characters once trimmed, line breaks kept, other control characters refused. The owner reads it on the seller and in the email; approving clears it. The seller keeps who set its status and when; the history is the audit trail's (`seller.approve`, `seller.reject`, `seller.block`, and `seller.unblock` for an approval of a blocked seller).
- Each change writes `seller.StatusChangedEvent` (`seller.status_changed`, the seller and the status) in its transaction. Its listener `seller.tell_owner` emails the owner, in Vietnamese then English, unless the seller changed again, is gone or has no owner. Without an email provider it gives up rather than retry; a provider's failure is retried, so an owner may rarely get one email twice.
- Admins find sellers by words without marks: a generated column folds the name, address and phone with `seller_fold` (NFC, lower case, Vietnamese marks removed, đ as d), and the query is folded by the same function. `%` and `_` are plain letters.
- One owner per seller; at most 30 people per seller, the owner included; at most five sellers owned per account. Both limits hold under concurrency (a row lock on the seller, an advisory lock on the owner).
- The photo is one the owner uploaded to `file`, which the seller claims; the seller answers `FILE_PHOTO_NOT_FOUND` for a photo someone else uploaded.
- Staff are added by email in one step and are members at once; an address that has never signed in gets its account then. The owner cannot leave.
- The role in a seller is read from the database at each request, never kept in the session, so a removed member loses access at once.
- Publishing is for the owner or staff of an `active` seller.
- A seller answers 404 to anyone who is neither its member nor an admin. Admins read and set the status; they do not change a seller's details.
- The phone keeps its digits and a leading `+`, 9 to 15 digits. The location is the latitude and longitude the client pins; PostGIS keeps it as a `geography(Point, 4326)` generated from them.
- Working assumptions until the sellers' survey (SEC-9): changing an active seller's details does not send it back to `pending`; a blocked seller's owner still manages its staff.
- When identity deletes an account (`identity.AccountDeletedEvent`, listener `seller.forget_account`), the module removes its memberships. A seller it owned would be left without an owner, so it is blocked with no one named as having blocked it and the reason "Chủ cửa hàng đã xoá tài khoản": it stops showing and publishing until admins decide (SEC-37). Running it again changes nothing.

## Data

| Table | Holds | Lifecycle |
| --- | --- | --- |
| `seller_sellers` | Name, address, latitude, longitude, generated location, phone, status, its reason, who set it and when, the photo (file's identifier, no foreign key), the generated folded words admins search | Kept |
| `seller_members` | Seller, identity's account identifier (no foreign key across modules), role `owner` or `staff`, when added | Deleted when a staff member is removed or leaves, and every membership of an account when identity deletes it |

## Failures

| Code | Status | When |
| --- | --- | --- |
| `SELLER_DETAILS_INVALID` | 400 | Blank name or address |
| `SELLER_REASON_INVALID` | 400 | A reason under 10 or over 500 characters, or with a control character |
| `SELLER_LIST_INVALID` | 400 | An unknown status, a query over 100 characters, a page under 1 or a size outside 1 to 100 |
| `SELLER_PHONE_INVALID` | 400 | Not 9 to 15 digits |
| `SELLER_NOT_ACTIVE` | 403 | Publishing for a seller that is pending, rejected or blocked |
| `SELLER_OWNER_REQUIRED` | 403 | A staff member tries what only the owner may |
| `SELLER_NOT_FOUND` | 404 | No such seller, or the caller is neither a member nor an admin |
| `SELLER_MEMBER_NOT_FOUND` | 404 | The person is not on the seller's staff |
| `SELLER_LIMIT_REACHED` | 409 | The caller already owns five sellers |
| `SELLER_STAFF_LIMIT_REACHED` | 409 | The seller already has 30 people |
| `SELLER_ALREADY_MEMBER` | 409 | The person already works for the seller |
| `SELLER_OWNER_CANNOT_LEAVE` | 409 | The owner tries to leave |
| `SELLER_STATUS_CHANGE_NOT_ALLOWED` | 409 | The action does not apply to the seller's status |

An address that is not one plain address answers `IDENTITY_EMAIL_INVALID`. Adding staff by an address whose account holds a Google link Google does not speak for answers `IDENTITY_ADDRESS_UNPROVEN` (409) until the address's owner has signed in once with the emailed code (SEC-39).

## Not yet

- An email to someone added as staff.
- An admin changing a seller's owner.
- The follower count on a seller's page (SEC-11, step 6).
