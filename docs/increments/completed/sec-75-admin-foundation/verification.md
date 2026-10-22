# SEC-75 — Admin foundation: verification

Gathered on 22 October 2026 from the pull requests that delivered it and the checks recorded on SEC-75 in Linear.

## Checks

| Part | Pull request | Outcome |
| --- | --- | --- |
| Authorization net, audit, settings with `If-Match`, admins, a store's states (plan steps 2 to 6) | #42 | `go test ./...` with the contract test: every `/admin` operation answers 401 signed out and 403 to a customer, and every admin change leaves one audit event carrying its request id; concurrent revokes keep the last admin; every transition from every state |
| Web base and screens (steps 7 and 8) | #42 | `pnpm check`; Playwright `admin-shell`, `admin-sellers`, `admin-email`, `admin-audit` with axe on each page |
| Accounts and admins (step 9a) | #57 | The lists against PostgreSQL, the contract test, Playwright `admin-accounts` and `admin-admins` |
| Row menus, the repeated query parameter, initials (follow-up) | #67 | The service test asks for two accounts as the generated clients do and fails without the fix; checked on staging |

## Against the real service

Each pull request was deployed to staging and checked there; the two faults found on staging (an empty stores column, initials taking a note in brackets) were fixed in #67. On 22 October 2026 an admin opened a store's page on staging, with its posts, its members and its pin.

## Not done here

The audit screens were not drawn in Figma: the code is the frontend's source of truth, and the screen is built (`/admin/audit`).
