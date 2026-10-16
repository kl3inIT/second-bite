# seller: verification matrix

Requirements of [docs/specs/seller.md](../specs/seller.md) and the checks that hold them. Paths are under `server/`. `TestSeller` (`internal/seller/seller_test.go`) runs its checks in parallel against one migrated PostGIS.

| Requirement | Check |
| --- | --- |
| A new seller is `pending`, its opener the owner; publishing only for members of an active seller; a block stops it and activation lifts it; a removed member loses the right at once | `TestSeller` › publishing follows status and membership |
| A stranger gets 404; staff neither change the seller nor add staff; nobody is added twice; a customer does not activate; the owner does not leave; staff do leave; an address must be one address | `TestSeller` › only the right people act on a seller |
| An owner opens at most five sellers | `TestSeller` › an owner opens at most five sellers |
| Phone and name are checked | `TestSeller` › details are checked |
| A hundred additions at once leave exactly 30 people | `TestSeller` › additions arriving together keep the cap (the first version left 98) |
| The flow through the API: open, add staff who then signs in by code and finds the seller; staff refused a change; a stranger answered 404; a customer refused activation; the admin lists pending sellers and activates | `TestService` › a seller is opened, staffed and activated (`cmd/secondbite/seller_test.go`) |

Not covered by a test: the limit of five under concurrency (held by the same kind of lock as the staff cap), and pagination of the admins' list.
