# audit: verification matrix

Requirements of [docs/specs/audit.md](../specs/audit.md) and the checks that hold them. Paths are under `server/`.

| Requirement | Check |
| --- | --- |
| An event keeps the admin's account and address, the resource, and the action's details as JSON | `TestService` › Record keeps the admin, the request and the details (`internal/audit/audit_test.go`) |
| From the command line an event has no actor and no request | `TestService` › Record from the command line has no actor |
| An event is not kept when the change it records fails | `TestService` › an event goes with its change when the change fails |
| Forgetting an account nulls the labels naming it, as actor and as resource, and keeps its identifier, other accounts' labels and a store's name | `TestService` › ForgetAccount nulls only the labels naming the account |
| Deleting an account forgets it in the trail, in the deletion's transaction | `TestDeleteAccount` (`internal/identity/deletion_test.go`) |
| Each action's name is `subject.verb` and names one action only | `TestCatalog` (`internal/audit/catalog_test.go`) |
| Every admin change through the API records exactly one event carrying its request's identifier, or none where its entry says why; an operation missing from the table fails | `TestService` › every admin change is audited (`cmd/secondbite/admin_test.go`) |
| The modules recording events reach `audit` only through its root package, along the edges ARCHITECTURE.md lists | `TestModuleBoundaries` (`internal/boundaries_test.go`) |
