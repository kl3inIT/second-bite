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
| The API's lists of actions are the catalog's | `TestActionEnums` (`internal/audit/list_test.go`) |
| An admin's events are listed the latest first, with their reason, source and changes | `TestList` › an admin's events, the latest first, with their details |
| The list keeps the actions, words, identifier and time asked, treats `%` as itself, and pages with the total past the end | `TestList` › filters by action, words and time, and pages |
| An action outside the catalog, a page or size out of bounds, a long query, an empty time range and a customer are refused | `TestList` › filters out of bounds and customers are refused |
| A change of the offer settings keeps each field's value before and after | `TestOffer` › the settings bound every post (`checkSettingsAudited`, `internal/offer/offer_test.go`) |
| A change of the email settings keeps values, but a secret and the SMTP user by name only | `TestSettingsSaved` (`internal/notification/settings_db_test.go`) |
| Every admin change through the API records exactly one event carrying its request's identifier, or none where its entry says why; an operation missing from the table fails | `TestService` › every admin change is audited (`cmd/secondbite/admin_test.go`) |
| The modules recording events reach `audit` only through its root package, along the edges ARCHITECTURE.md lists | `TestModuleBoundaries` (`internal/boundaries_test.go`) |
