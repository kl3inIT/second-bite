# seller

Owns sellers, their status set by admins, and the people who act for them (tables `seller_*`). Decided in the [SEC-10 design](../increments/completed/sec-10-backend-foundation/design.md#seller), from Open Food Network and Spree multi-vendor. Checks: [docs/tests/seller.md](../tests/seller.md).

## Operations

| Operation | Who | Answer |
| --- | --- | --- |
| `POST /sellers` `{name, address, latitude, longitude, phone}` | Anyone signed in, owning fewer than five sellers | `201` seller, `active` at once, the caller its owner |
| `GET /sellers/mine` | Anyone signed in | `200` the sellers they own or work for, with their role |
| `GET /sellers/address?latitude&longitude` | Anyone signed in | `200` the address at a point, as people write it since July 2025 (street, ward or commune, city), from OpenStreetMap's Nominatim; empty when it is not known or the service does not answer ([SEC-110](../increments/completed/sec-110-address-from-location/design.md)) |
| `GET /sellers/places?q` | Anyone signed in | `200` up to five places in Hanoi for the words of an address, typed with or without marks, from komoot's public Photon over OpenStreetMap: each an address as people write it and its point; a house number typed first goes before a street that has none; none when nothing matches or the search does not answer (SEC-66) |
| `GET /places?q` | Anyone, signed in or not | `200` the same suggestions, for a customer looking for dishes around a place typed in the home's area sheet; bounded per client address (below) |
| `GET /sellers/{sellerId}` | Its members; admins | `200` seller |
| `PUT /sellers/{sellerId}` | Its owner | `200` seller |
| `PUT /sellers/{sellerId}/photo` `{photoId}`, `DELETE` | Its owner | `200` seller with its `photoId`; `204` |
| `POST /sellers/{sellerId}/feedback` `{text}` | Its owner and staff | `204`; what is hard or missing, told to the team, kept with the seller and not who wrote it; 1 to 1,000 characters, at most 20 a day for one seller (SEC-82) |
| `GET /sellers/{sellerId}/members` | Its members; admins | `200` owner and staff with their addresses |
| `POST /sellers/{sellerId}/members` `{email}` | Its owner | `201` the new staff member |
| `DELETE /sellers/{sellerId}/members/{accountId}` | Its owner, or a staff member removing themself | `204` |
| `GET /sellers/{sellerId}/profile` | Anyone | `200` an active seller's name, address, location and photo; `404` for one blocked |
| `PUT /sellers/{sellerId}/follow`, `DELETE` | Anyone signed in | `204`; following again, or unfollowing a seller not followed, changes nothing; following a seller that is not active answers `404` (SEC-109) |
| `GET /sellers/followed` | Anyone signed in | `200 {sellers}`: the active sellers they follow, as the public profile above, the latest followed first; one blocked since is left out (SEC-109) |
| `GET /admin/seller-feedback?since=&until=&sellerId=` | Admins | `200 {items}`: the stores' feedback sent in the days given in Vietnam (the last week by default), of one store when given, the latest first, at most 200, each with its store's name; the report page shows it (SEC-82) |
| `GET /admin/sellers?status=&q=&changedSince=&changedUntil=&sort=&page=&size=` | Admins | `200 {items, page, pageSize, total, counts, days}`: sellers in the statuses given (every one when none) whose name, address or phone holds `q`, marks ignored, last changed in `[changedSince, changedUntil)` when given (SEC-62); by default pending ones first, the oldest first, then the latest change first, or sorted by `name`, `address` or `changed` (`-` descending); `counts` gives each status matching `q` and the time range, for the cards above the list; `days` gives how many sellers stood in each status on each of the last 14 days in Vietnam, whatever the filters, from the first day counted (SEC-62); each with its owner's address; `size` 1 to 100, 25 by default; a page past the end is empty (SEC-75) |
| `GET /admin/memberships?accountId=` | Admins | `200 {memberships}`: the sellers each account given (1 to 100, the parameter repeated) owns or works at, owners first, with the seller's name and status, for the admins' accounts (SEC-75) |
| `POST /admin/sellers/{sellerId}/approve` | Admins | `200` seller, `active`, from `pending`, `rejected` or `blocked`; its owner emailed; `409 SELLER_OWNERLESS` when the owner deleted their account (SEC-65) |
| `POST /admin/sellers/{sellerId}/reject` `{reason}` | Admins | `200` seller, `rejected`, from `pending`; its owner emailed the reason |
| `POST /admin/sellers/{sellerId}/block` `{reason}` | Admins | `200` seller, `blocked`, from `active`; its owner emailed the reason |
| `POST /admin/sellers/{sellerId}/owner` `{email}` | Admins | `200 {members}`: the account of the address owns the seller, created when it never signed in; the previous owner, if any, stays on as staff; a seller left without an owner gets one this way (SEC-162) |

Published to other modules: `Publishing(seller, account)`, which `offer` calls before posting or changing: the seller's name and collection point when the account is the owner or staff of an active seller, `SELLER_NOT_FOUND` when it is not a member, `SELLER_NOT_ACTIVE` when the seller is not active; `Publics(sellers)`, what customers see of the active ones among them; `IsActiveIn(tx, seller)`, whether a seller is active, read in the caller's transaction, which `order` checks while it places an order so that it never holds one connection and waits for another (SEC-128); `Blocked()`, the sellers whose offers search leaves out; `CollectionPointOf(seller)`, where its offers are collected as it stands, which `offer` and `order` read when they follow `LocationChangedEvent`; and the events `StatusChangedEvent` and `LocationChangedEvent` (SEC-66).

## Rules

- Statuses (SEC-75): `pending`, `active`, `rejected`, `blocked`. A seller is `active` when opened (SEC-57); whether a store waits for an admin's approval is decided after the pilot (SEC-64). An admin approves a pending, rejected or blocked seller, rejects a pending one and blocks an active one; any other change answers `SELLER_STATUS_CHANGE_NOT_ALLOWED`. Each change is one conditional update, so two admins at once cannot both pass. A seller left without an owner, once its owner deleted their account, is never approved: nobody could run it (SEC-65). The approval locks the seller before reading its owner, so a deletion at the same moment either is seen or blocks the seller again after it.
- Rejecting and blocking take a reason, 10 to 500 characters once trimmed, line breaks kept, other control characters refused. The owner reads it on the seller and in the email; approving clears it. The seller keeps who set its status and when; the history is the audit trail's (`seller.approve`, `seller.reject`, `seller.block`, and `seller.unblock` for an approval of a blocked seller).
- Each change writes `seller.StatusChangedEvent` (`seller.status_changed`, the seller and the status) in its transaction. Its listener `seller.tell_owner` emails the owner, in Vietnamese then English, unless the seller changed again, is gone or has no owner. Without an email provider it gives up rather than retry; a provider's failure is retried, so an owner may rarely get one email twice.
- Admins find sellers by words without marks: a generated column folds the name, address and phone with `seller_fold` (NFC, lower case, Vietnamese marks removed, đ as d), and the query is folded by the same function. `%` and `_` are plain letters.
- One owner per seller; at most 30 people per seller, the owner included; at most five sellers owned per account. Both limits hold under concurrency (a row lock on the seller, an advisory lock on the owner).
- The photo is one the owner uploaded to `file`, which the seller claims; the seller answers `FILE_PHOTO_NOT_FOUND` for a photo someone else uploaded.
- The address lookups pass to free public services, so they are bounded (SEC-160): an account makes at most 60 in ten minutes, and a client address at most 30 customers' place searches (`GET /places`) in ten minutes (`PLATFORM_TOO_MANY_REQUESTS`, 429, past either); an answer is kept in the instance, a point's address for a day and a search's places for an hour, at most 512 of each, shared by the stores' and the customers' searches, so the same point or words do not ask again and cost no lookup; Nominatim is asked at most once a second, as its policy says, a caller waiting for its turn; a failure is logged without the request's URL, which carries the address typed or the point.
- Staff are added by email in one step and are members at once; an address that has never signed in gets its account then. The owner cannot leave.
- An admin hands a seller to another owner in one step (SEC-162): the seller's row is locked, then the new owner's advisory lock taken, so the five-sellers and 30-people limits hold under concurrency; the previous owner becomes staff before the new one becomes the owner, so one owner per seller holds at every statement; the change is recorded as `seller.change_owner`. The web's store menu opens `/stores/{id}/staff`, where the owner adds and removes staff and staff leave.
- The role in a seller is read from the database at each request, never kept in the session, so a removed member loses access at once.
- Publishing is for the owner or staff of an `active` seller.
- A seller answers 404 to anyone who is neither its member nor an admin. Admins read and set the status; they do not change a seller's details.
- The phone keeps its digits and a leading `+`, 9 to 15 digits. The location is the latitude and longitude the client pins; PostGIS keeps it as a `geography(Point, 4326)` generated from them.
- The location must fall in Hanoi's box, latitude 20.53 to 21.42 and longitude 105.25 to 106.06, about three kilometres beyond the city's edge; any other point answers `SELLER_LOCATION_OUTSIDE`, on opening and on a change. The web's map is held to the same box, so it never shows the sea, Hoàng Sa or Trường Sa ([SEC-66](../increments/completed/sec-66-store-location-pin/design.md)).
- A change that moves the collection point (the pin, the written address or both) writes `seller.LocationChangedEvent` (`seller.location_changed`, the seller's identifier only) in its transaction; a change that keeps both writes nothing. `offer` and `order` follow it and read the point through `CollectionPointOf` (SEC-66).
- A favourite is an account following an active seller: one row per pair, so following twice is one favourite; it outlives the seller's status, so a seller blocked and approved again returns to the list, and unfollowing needs no active seller (SEC-109).
- Working assumptions until the sellers' survey (SEC-9): changing an active seller's details does not send it back to `pending`; a blocked seller's owner still manages its staff.
- When identity deletes an account (`identity.AccountDeletedEvent`, listener `seller.forget_account`), the module removes its memberships and favourites. A seller it owned would be left without an owner, so it is blocked with no one named as having blocked it and the reason "Chủ cửa hàng đã xoá tài khoản": it stops showing and publishing until admins decide (SEC-37). Running it again changes nothing.

## Data

| Table | Holds | Lifecycle |
| --- | --- | --- |
| `seller_sellers` | Name, address, latitude, longitude, generated location, phone, status, its reason, who set it and when, the photo (file's identifier, no foreign key), the generated folded words admins search | Kept |
| `seller_status_days` | A day in Vietnam and how many sellers stood in each status at its last change; written in the transaction of each opening and status change, so a day with no row stands as the day before; counting started on 21 October 2026 (SEC-62) | Kept |
| `seller_feedback` | Seller, text, when sent; no author (SEC-82) | Kept; deleted with its seller |
| `seller_follows` | Identity's account identifier (no foreign key across modules), the seller, when followed | Deleted when the account unfollows, and every favourite of an account when identity deletes it |
| `seller_members` | Seller, identity's account identifier (no foreign key across modules), role `owner` or `staff`, when added | Deleted when a staff member is removed or leaves, and every membership of an account when identity deletes it |

## Failures

| Code | Status | When |
| --- | --- | --- |
| `SELLER_DETAILS_INVALID` | 400 | Blank name or address |
| `SELLER_REASON_INVALID` | 400 | A reason under 10 or over 500 characters, or with a control character |
| `SELLER_FEEDBACK_INVALID` | 400 | Feedback blank, over 1,000 characters, or with a control character but line breaks (SEC-82) |
| `SELLER_FEEDBACK_LIMIT_REACHED` | 409 | The seller already sent 20 pieces of feedback in the last day |
| `SELLER_FEEDBACK_LIST_INVALID` | 400 | A range of days that ends before it starts |
| `SELLER_LIST_INVALID` | 400 | An unknown status, a query over 100 characters, a page under 1 or a size outside 1 to 100 |
| `SELLER_PHONE_INVALID` | 400 | Not 9 to 15 digits |
| `SELLER_LOCATION_OUTSIDE` | 400 | The pin falls outside Hanoi's box (SEC-66) |
| `SELLER_NOT_ACTIVE` | 403 | Publishing for a seller that is pending, rejected or blocked |
| `SELLER_OWNER_REQUIRED` | 403 | A staff member tries what only the owner may |
| `SELLER_NOT_FOUND` | 404 | No such seller, or the caller is neither a member nor an admin |
| `SELLER_MEMBER_NOT_FOUND` | 404 | The person is not on the seller's staff |
| `SELLER_LIMIT_REACHED` | 409 | The caller already owns five sellers |
| `SELLER_STAFF_LIMIT_REACHED` | 409 | The seller already has 30 people |
| `SELLER_ALREADY_MEMBER` | 409 | The person already works for the seller |
| `SELLER_OWNER_CANNOT_LEAVE` | 409 | The owner tries to leave |
| `SELLER_STATUS_CHANGE_NOT_ALLOWED` | 409 | The action does not apply to the seller's status |
| `SELLER_OWNERLESS` | 409 | Approving a seller whose owner deleted their account (SEC-65) |
| `SELLER_ALREADY_OWNER` | 409 | Handing a seller to the account that owns it (SEC-162) |
| `SELLER_NEW_OWNER_LIMIT_REACHED` | 409 | Handing a seller to an account that already owns five (SEC-162) |

An address that is not one plain address answers `IDENTITY_EMAIL_INVALID`. Adding staff by an address whose account holds a Google link Google does not speak for answers `IDENTITY_ADDRESS_UNPROVEN` (409) until the address's owner has signed in once with the emailed code (SEC-39).

## Not yet

- An email to someone added as staff.
- The follower count on a seller's page (SEC-11, step 6).
