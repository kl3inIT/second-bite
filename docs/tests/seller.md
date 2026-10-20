# seller: verification matrix

Requirements of [docs/specs/seller.md](../specs/seller.md) and the checks that hold them. Paths are under `server/`. `TestSeller` (`internal/seller/seller_test.go`) runs its checks in parallel against one migrated PostGIS.

| Requirement | Check |
| --- | --- |
| A new seller is `pending`, its opener the owner; publishing only for members of an active seller; a block stops it and activation lifts it; a removed member loses the right at once | `TestSeller` › publishing follows status and membership (through `Publishing`) |
| A stranger gets 404; staff neither change the seller nor add staff; nobody is added twice; a customer does not activate; the owner does not leave; staff do leave; an address must be one address | `TestSeller` › only the right people act on a seller |
| An owner opens at most five sellers | `TestSeller` › an owner opens at most five sellers |
| Phone and name are checked | `TestSeller` › details are checked |
| A hundred additions at once leave exactly 30 people | `TestSeller` › additions arriving together keep the cap (the first version left 98) |
| The flow through the API: open, add staff who then signs in by code and finds the seller; staff refused a change; a stranger answered 404; a customer refused activation; the admin lists pending sellers and activates | `TestService` › a seller is opened, staffed and activated (`cmd/secondbite/seller_test.go`) |
| The owner sets only a photo they uploaded; staff cannot; the photo is removed | `TestSeller` › the owner sets a photo they uploaded; through the API, `TestService` › a photo is uploaded, set on a seller and served |
| When an account is deleted, its memberships are removed and the seller it owned is blocked, naming no one; a seller it only staffed keeps its status; delivered twice, nothing more changes | `TestDeletedAccountIsForgotten` (`internal/seller/listeners_test.go`); end to end in `TestService` › an owner deletes their account; the others forget it |
| The summary counts the sellers in each status now and those opened in the range, and lists the five opened last, newest first; admins alone read it | `TestSummary` (`internal/seller/summary_test.go`), on a database of its own |

Not covered by a test: the limit of five under concurrency (held by the same kind of lock as the staff cap), and pagination of the admins' list.
