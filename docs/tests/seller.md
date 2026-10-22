# seller: verification matrix

Requirements of [docs/specs/seller.md](../specs/seller.md) and the checks that hold them. Paths are under `server/`. `TestSeller` (`internal/seller/seller_test.go`) runs its checks in parallel against one migrated PostGIS.

| Requirement | Check |
| --- | --- |
| A new seller is `pending`, its opener the owner; publishing only for members of an active seller; a block stops it and approving lifts it; a removed member loses the right at once | `TestSeller` › publishing follows status and membership (through `Publishing`) |
| A stranger gets 404; staff neither change the seller nor add staff; nobody is added twice; a customer does not approve; the owner does not leave; staff do leave; an address must be one address | `TestSeller` › only the right people act on a seller |
| An owner opens at most five sellers | `TestSeller` › an owner opens at most five sellers |
| Phone and name are checked | `TestSeller` › details are checked |
| A hundred additions at once leave exactly 30 people | `TestSeller` › additions arriving together keep the cap (the first version left 98) |
| The flow through the API: open, add staff who then signs in by code and finds the seller; staff refused a change; a stranger answered 404; a customer refused activation; the admin lists pending sellers and activates | `TestService` › a seller is opened, staffed and activated (`cmd/secondbite/seller_test.go`) |
| The owner sets only a photo they uploaded; staff cannot; the photo is removed | `TestSeller` › the owner sets a photo they uploaded; through the API, `TestService` › a photo is uploaded, set on a seller and served |
| Following is idempotent; the list shows the latest followed first and only the caller's own; unfollowing is idempotent, also for a seller not followed; an unknown, pending or blocked seller cannot be followed; a blocked seller drops out of the list; signing in is required | `TestSeller` › customers follow sellers and list them (`internal/seller/follow_test.go`) |
| When an account is deleted, its memberships and favourites are removed and the seller it owned is blocked, naming no one; a seller it only staffed keeps its status; delivered twice, nothing more changes; through the API, approving that seller answers 409 `SELLER_OWNERLESS` in Vietnamese and English and it stays blocked (SEC-65) | `TestDeletedAccountIsForgotten` (`internal/seller/listeners_test.go`); end to end in `TestService` › an owner deletes their account; the others forget it |
| Every action from every status: approve from pending, rejected and blocked (recorded as `seller.unblock` from blocked), reject from pending, block from active, each with one audit event and one job to tell the owner; the others refused with nothing recorded; a seller with no owner not approved from blocked, pending or rejected, its status kept and nothing recorded (SEC-65); a customer refused; an unknown seller not found | `TestAdmin` › every action from every status (`internal/seller/admin_test.go`) |
| A reason too short, too long, blank or with a control character is refused | `TestAdmin` › a reason is checked |
| The list finds words without marks, capitals and phone digits, filters by status, reads `%` as a letter, puts pending sellers first, counts past the end, names the owner, sorts by name both ways, counts each status whatever status is asked; bad filters, an unknown sort and customers are refused | `TestAdmin` › the list filters, searches and pages |
| Admins read the sellers some accounts own or work at, owners first, an unknown account having none; a customer is refused, and more than 100 accounts at once | `TestSeller` › admins read who belongs to which seller |
| The owner's email names the seller on one line, carries the reason in both languages, and escapes it in HTML | `TestStatusEmail` (`internal/seller/status_email_test.go`) |
| Without an email provider, the job that tells the owner ends | `TestOwnerToldWithoutEmail` (`internal/seller/listeners_test.go`) |
| Through the API: a block with a reason, found by words without marks among the blocked, the owner emailed the reason through Mailpit, a second block refused with 409, a short reason with 400, approved again with the reason cleared | `TestService` › a seller is opened active, staffed and blocked |
| A pin outside Hanoi's box (Ho Chi Minh City, Hoàng Sa, Hải Phòng, just past the north and west edges, the origin) is refused on opening and on a change, the box's corner taken; a change publishes `seller.location_changed` only when the pin or the address moved; `CollectionPointOf` reads the point as it stands and answers not found for an unknown seller; through the API, a move out of Hanoi answers 400 `SELLER_LOCATION_OUTSIDE` | `TestSeller` › the location is Hanoi and a move is told (`internal/seller/location_test.go`); `TestService` › a seller is opened, staffed and activated |

| The list keeps the sellers last changed in a range, the cards following, and refuses a range ending before it starts; after a block today's counts are the sellers' as they stand, a day with no change stands as the day before and no day comes before the first counted | `TestAdmin` › the list filters by the last change; the list counts each day |

Not covered by a test: the limit of five under concurrency (held by the same kind of lock as the staff cap).
| A written address is the street, the ward or commune, the city: the ward named Phường, Xã, Thị trấn or Đặc khu wins over a quarter beside it | `TestWritten` (`internal/seller/locate_test.go`) |
| Suggested places: inside Hanoi only, each address once, at most five; a house number typed first goes before a street without one; a place keeps its name and its own number | `TestPlaces`, `TestLeadingNumber`, `TestSearchAsksInHanoiWithAUserAgent`, `TestSearchFailsOnAnErrorStatus` (`internal/seller/places_test.go`) |
| Suggestions need a caller and two letters | `TestService` › `checkPlacesNeedACaller` (`cmd/secondbite/seller_test.go`) |
