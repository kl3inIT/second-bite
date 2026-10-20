# seller

Owns sellers, their status set by admins, and the people who act for them (tables `seller_*`). Decided in the [SEC-10 design](../increments/completed/sec-10-backend-foundation/design.md#seller), from Open Food Network and Spree multi-vendor. Checks: [docs/tests/seller.md](../tests/seller.md).

## Operations

| Operation | Who | Answer |
| --- | --- | --- |
| `POST /sellers` `{name, address, latitude, longitude, phone}` | Anyone signed in, owning fewer than five sellers | `201` seller, `pending`, the caller its owner |
| `GET /sellers/mine` | Anyone signed in | `200` the sellers they own or work for, with their role |
| `GET /sellers/{sellerId}` | Its members; admins | `200` seller |
| `PUT /sellers/{sellerId}` | Its owner | `200` seller |
| `PUT /sellers/{sellerId}/photo` `{photoId}`, `DELETE` | Its owner | `200` seller with its `photoId`; `204` |
| `GET /sellers/{sellerId}/members` | Its members; admins | `200` owner and staff with their addresses |
| `POST /sellers/{sellerId}/members` `{email}` | Its owner | `201` the new staff member |
| `DELETE /sellers/{sellerId}/members/{accountId}` | Its owner, or a staff member removing themself | `204` |
| `GET /sellers/{sellerId}/profile` | Anyone | `200` an active seller's name, address, location and photo; `404` for one pending or blocked |
| `GET /admin/sellers?status=&limit=&offset=` | Admins | `200` sellers in that status, oldest first, at most 100 |
| `POST /admin/sellers/{sellerId}/activate` | Admins | `200` seller, `active`; also lifts a block |
| `POST /admin/sellers/{sellerId}/block` | Admins | `200` seller, `blocked` |

Published to other modules: `Publishing(seller, account)`, which `offer` calls before posting or changing: the seller's name and collection point when the account is the owner or staff of an active seller, `SELLER_NOT_FOUND` when it is not a member, `SELLER_NOT_ACTIVE` when the seller is not active; `Publics(sellers)`, what customers see of the active ones among them; `Blocked()`, the sellers whose offers search leaves out.

## Rules

- Statuses: `pending` when opened, `active` or `blocked` as an admin sets them. The seller keeps who set its status and when; there is no history and no reason.
- One owner per seller; at most 30 people per seller, the owner included; at most five sellers owned per account. Both limits hold under concurrency (a row lock on the seller, an advisory lock on the owner).
- The photo is one the owner uploaded to `file`, which the seller claims; the seller answers `FILE_PHOTO_NOT_FOUND` for a photo someone else uploaded.
- Staff are added by email in one step and are members at once; an address that has never signed in gets its account then. The owner cannot leave.
- The role in a seller is read from the database at each request, never kept in the session, so a removed member loses access at once.
- Publishing is for the owner or staff of an `active` seller.
- A seller answers 404 to anyone who is neither its member nor an admin. Admins read and set the status; they do not change a seller's details.
- The phone keeps its digits and a leading `+`, 9 to 15 digits. The location is the latitude and longitude the client pins; PostGIS keeps it as a `geography(Point, 4326)` generated from them.
- Working assumptions until the sellers' survey (SEC-9): changing an active seller's details does not send it back to `pending`; a blocked seller's owner still manages its staff.
- When identity deletes an account (`identity.AccountDeletedEvent`, listener `seller.forget_account`), the module removes its memberships. A seller it owned would be left without an owner, so it is blocked with no one named as having blocked it: it stops showing and publishing until admins decide (SEC-37). Running it again changes nothing.

## Data

| Table | Holds | Lifecycle |
| --- | --- | --- |
| `seller_sellers` | Name, address, latitude, longitude, generated location, phone, status, who set it and when, the photo (file's identifier, no foreign key) | Kept |
| `seller_members` | Seller, identity's account identifier (no foreign key across modules), role `owner` or `staff`, when added | Deleted when a staff member is removed or leaves, and every membership of an account when identity deletes it |

## Failures

| Code | Status | When |
| --- | --- | --- |
| `SELLER_DETAILS_INVALID` | 400 | Blank name or address |
| `SELLER_PHONE_INVALID` | 400 | Not 9 to 15 digits |
| `SELLER_NOT_ACTIVE` | 403 | Publishing for a seller that is pending or blocked |
| `SELLER_OWNER_REQUIRED` | 403 | A staff member tries what only the owner may |
| `SELLER_NOT_FOUND` | 404 | No such seller, or the caller is neither a member nor an admin |
| `SELLER_MEMBER_NOT_FOUND` | 404 | The person is not on the seller's staff |
| `SELLER_LIMIT_REACHED` | 409 | The caller already owns five sellers |
| `SELLER_STAFF_LIMIT_REACHED` | 409 | The seller already has 30 people |
| `SELLER_ALREADY_MEMBER` | 409 | The person already works for the seller |
| `SELLER_OWNER_CANNOT_LEAVE` | 409 | The owner tries to leave |

An address that is not one plain address answers `IDENTITY_EMAIL_INVALID`. Adding staff by an address whose account holds a Google link Google does not speak for answers `IDENTITY_ADDRESS_UNPROVEN` (409) until the address's owner has signed in once with the emailed code (SEC-39).

## Not yet

- Emails to an owner when the seller is activated or blocked, and to someone added as staff.
- An admin changing a seller's owner.
- The follower count on a seller's page (SEC-11, step 6).
