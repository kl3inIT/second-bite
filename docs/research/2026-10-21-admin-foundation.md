# How marketplaces and Go servers build their admin

Studied on 21 October 2026 for the admin foundation (SEC-75), which sets the rules every admin screen and endpoint follows. The questions: one role or permissions, where the check lives and how a forgotten one is caught, the shape of the admin API, the audit trail, granting and revoking admins, an admin opening a store for its owner, the states of a store's approval, the admin inside the main web or apart, and the libraries. BeyondPilot is read for engineering practice only ([conventions](../conventions.md#reference-based-design-and-scope-control)); the business rules come from the marketplaces. Each repository was cloned shallowly into the git-ignored `.tmp/` (BeyondPilot lives beside this repository) and read, not run. Paths are relative to each repository. **Verified** means read in its code or documents at the path given; **reported** means taken from a reading that could not be repeated here, because the sparse clone no longer holds the file.

| Repository | Revision | What it is |
| --- | --- | --- |
| BeyondPilot (GenAI Fund) | `4b09fb3` read; `9ee5bc3` on 21 Oct 2026 | Spring and Next.js; its admin role is `operator`, at `/[locale]/admin` |
| [Medusa](https://github.com/medusajs/medusa) | `906433a`, 2026-10-16 | Headless commerce, Node; separate admin dashboard |
| [Saleor](https://github.com/saleor/saleor) | `9ae360a`, 2026-10-20 | Commerce in Django and GraphQL; staff and permission groups |
| [Spree](https://github.com/spree/spree) 6 | `06fc8b0`, 2026-10-20 | Rails commerce with a native multi-vendor `Seller` |
| [Spree multi-vendor](https://github.com/spree-contrib/spree_multi_vendor) | `4465f26`, 2026-09-22 | The older vendor extension: pending, active, blocked |
| [Open Food Network](https://github.com/openfoodfoundation/openfoodnetwork) | `6d906ac`, 2026-10-15 | Food hubs on a vendored Spree; super admin and shop managers |
| [Mattermost](https://github.com/mattermost/mattermost) | `356bdc7`, 2026-10-16 | Go server; system console, roles, audit records |
| [Gitea](https://github.com/go-gitea/gitea) | `6b252ca`, 2026-10-16 | Go forge; a new audit log |
| [Zitadel](https://github.com/zitadel/zitadel) | `5cd91e0`, 2026-10-16 | Go identity server built on an event store |
| [miniflux](https://github.com/miniflux/v2), [listmonk](https://github.com/knadh/listmonk), [memos](https://github.com/usememos/memos) | `c317f84`, `a729a4a`, `e051129` | Go servers with admin lists and roles |

## Roles

- **One admin role, no permissions, is what most keep at this size.**
  - Open Food Network grants an admin everything, `can :manage, :all` (`app/models/spree/ability.rb:26-31`). It moved from a roles table back to a boolean (`db/migrate/20250107014617_copy_admin_attribute_to_users.rb`). Shop managers are per-shop rows (`enterprise_roles`), not global roles. Verified.
  - Medusa's role-based permissions exist but are off by default (`packages/medusa/src/feature-flags/rbac.ts:4-6`, applied at `packages/core/framework/src/http/router.ts:184-191`). Verified.
- **Permissions appear only when some admins must be limited.**
  - Saleor keeps staff in the customers' table (`saleor/account/models.py:178`) and grants permission codes through groups (`account/models.py:443-468`, `permission/enums.py`). Its sample groups are "Full Access" and "Customer Support". Verified.
  - Spree 6 keeps staff in their own `AdminUser` table, with `read_x`/`write_x` permissions stored as data (`spree/core/app/models/spree/ability.rb:1-13,89-97`). Verified.
  - Mattermost delegates `system_user_manager`, `system_manager` and `system_read_only_admin` (`server/public/model/role.go:383-388`). Verified.

## Where the check lives, and how a forgotten one is caught

- **A gate on the whole admin prefix, closed by default.**
  - Medusa authenticates every `/admin` route as a `user` (`router.ts:521-525`); a route opts out with `export const AUTHENTICATE = false`.
  - Spree's admin API inherits one base controller with `authenticate_admin!` (`spree/api/app/controllers/spree/api/v3/admin/base_controller.rb:12-14`), with a spec of its scoping.
  - Open Food Network gates both routes and controllers (`config/routes/admin.rb:7`, `app/controllers/spree/admin/base_controller.rb:20,49-60`).
  - All verified.
- **Saleor is open by default**, which is the trap to avoid. A mutation that declares no permissions passes (`saleor/graphql/core/mutations.py:499-524`). Verified.
- **BeyondPilot checks in the service.**
  - Every method of an `*Administration` service starts with `identity.requireOperator(actor)`, which reads the role from the database on each call. Verified.
  - The filter chain fails closed for anything under `/api` that is not opened. Verified.
  - A forgotten check is caught per module: `IdentityAccountsTest` loops over every command and expects 401 signed out, 403 for a plain user, and no audit event (`backend/src/test/java/ai/genaifund/beyondpilot/identity/IdentityAccountsTest.java`). Verified.
- **Mattermost checks in each handler body** (`server/channels/api4/user.go:1798`), behind a wrapper that only requires a session (`api4/handlers.go:50`). Verified.
- **Second Bite today.** `platform.RequireAdmin` is called in the service for sellers and offer settings (`server/internal/seller/admin.go:19,49`, `server/internal/offer/settings.go:32,41`), but only in the handler for email settings (`server/internal/notification/handler.go:56,88`). huma's `Security` field documents an operation and enforces nothing. Verified.

## The admin API

- **A separate prefix everywhere.** Medusa has `/admin` and `/store` (`router.ts:521-548`); Spree has `api/v3/admin/*`; Open Food Network has `namespace :admin`. Saleor is the exception, with one GraphQL schema checked per field. Verified.
- **Status changes are actions, never a writable field.** Spree exposes approve, reject and suspend as their own endpoints (`spree/api/.../v3/admin/sellers_controller.rb:5-12,134-162`). Verified.
- **Lists:**
  - BeyondPilot pages by `?q=&<filters>&sort=key|-key&page=&size=1..100` and answers `{items, page, pageSize, total}` (`identity/dto/AccountListRequest.java`, `AccountListResponse.java`). A page past the end is empty, an unknown sort key falls back to the default, and tables default to 25. Verified.
  - Its audit log pages by a cursor, `before`/`after` returning `{items, newer, older}`. Verified.
  - Medusa pages by offset, limit and `count` (`packages/medusa/src/api/utils/validators.ts:60-90`). Mattermost uses `page` and `per_page`, default 60, max 200 (`server/channels/web/params.go:19-20`). Saleor uses cursors capped at 100 (`saleor/settings.py:896`). Verified.
- **The total in the same query.** listmonk (`queries/lists.sql:11-45`) and miniflux take the total with `count(*) OVER ()`. When a page past the first comes back empty, miniflux counts separately (`internal/storage/entry_query_builder.go:278-300`), so the total is never wrongly 0. Verified.

## Audit

| Project | Actions named by | Written with the change? | Details | When the person is deleted |
| --- | --- | --- | --- | --- |
| BeyondPilot | A Java enum; each value lists the detail fields it allows, checked at run time (`backend/src/main/java/ai/genaifund/beyondpilot/audit/AuditAction.java`) | Yes, in the change's transaction (`AuditTrail.java`, ADR 0003) | A map; actor and resource labels kept as they were, no foreign key, the request id; a trigger refuses UPDATE and DELETE (`backend/src/main/resources/db/migration/V2__audit_create_events.sql`) | Never deletes accounts |
| Gitea | A registry of action names (reported) | No; written after commit, and a failed insert is only logged (reported). Off by default, kept 30 days (`modules/setting/audit.go:13-26`, verified) | Key/value pairs (reported) | Not read |
| Mattermost | String constants (`server/public/model/audit_events.go`) | No; a deferred record sent to log targets (`server/channels/web/context.go:60`) | Each model whitelists its safe fields through `Auditable() map[string]any` (`server/public/model/audit_record.go:65-70`) | Its older `Audits` rows are deleted (`server/channels/app/user.go:2255`) |
| Zitadel | Typed event constants; every command is an event | Yes; one push writes all of a command's events in a transaction (reported) | `Payload()`, a Go struct (reported) | Old events keep personal data (reported) |
| Saleor | A `CustomerEvent` row per staff action (`saleor/account/events.py:11-30`) | With the change | Parameters | Not read |
| Spree 6 | `seller.approved`, `seller.rejected`, `seller.suspended` events, in memory, no table (`spree/core/app/models/spree/event.rb`) | — | The reason in `metadata` "for the applicant and the audit trail" (`spree/core/app/workflows/spree/sellers/reject.rb`, `suspend.rb`) | — |
| Open Food Network | PaperTrail versions of a shop's `owner_id` and `sells` (`app/models/enterprise.rb:30`) | With the change | The changed columns | Not read |
| Medusa, PocketBase, memos, listmonk, miniflux | None beyond request logs | — | — | — |

Only BeyondPilot and Zitadel guarantee a complete trail, both by writing in the change's transaction. Mattermost's `Auditable()` and Zitadel's typed `Payload()` are the Go way to do what BeyondPilot checks at run time: the type itself decides which details can be stored.

Five ways to write it were weighed for Second Bite:

- **A. A typed action written in the change's transaction:** `audit.Record(ctx, tx, resource, action)`.
  - Each action is a struct satisfying an interface only the audit package can implement, so a detail field the type does not declare cannot be passed at all. This replaces BeyondPilot's run-time check with the compiler.
  - It is atomic, the same guarantee as `platform.Publish`.
  - Its risk is a call forgotten in a new use case.
- **B. An outbox listener writing the audit row.**
  - River may run a job twice, and the labels would be read after the fact, not as they were.
  - The actor and request id would have to travel in every event, and a settings change publishes no event.
  - The audit module would import every module's events, closing a cycle with identity. BeyondPilot's ADR 0003 kept this only as a fallback.
- **C. PostgreSQL triggers on the changed tables**, with the actor passed through `set_config` in the transaction.
  - It records which row changed, not why ("blocked: fraud").
  - It would copy the sealed SMTP password and Brevo key columns of `notification_email_settings` unless every trigger excluded them.
  - Every write path must still remember to set the actor.
- **D. A huma middleware auditing every mutating `/admin` operation.**
  - It runs outside the transaction and knows neither the resource's label nor the reason.
  - Reading request bodies to learn them is what the [logging rules](../conventions.md#logging) forbid.
- **E. A, plus a test that walks the OpenAPI document** (`api.OpenAPI().Paths` in huma v2.39). Every `/admin` operation must:
  - answer 401 signed out and 403 to a customer;
  - for a mutating one, called from a table of happy paths, leave exactly one audit row whose `request_id` is the response's `X-Request-Id`.

  An operation missing from the table fails the test, which is the check BeyondPilot leaves to review. Operations marked `Hidden` are not in the document.

An audit entry and a domain event are kept apart:
- Events here carry identifiers only and are written only when a listener exists ([events between modules](../conventions.md#events-between-modules)).
- An audit entry is written for every admin action, with the labels of that moment, and kept.

**Personal data.** Second Bite deletes accounts (App Store 5.1.1(v)); the references fall into three camps:
- Mattermost deletes the rows.
- Zitadel keeps everything.
- BeyondPilot never meets the case.

The middle way: when an account is deleted, null the labels that name it and keep its identifier and the actions. Keep the details free of personal data, so nothing in them needs scrubbing. What Vietnamese law lets an operator keep after deletion was not checked here.

## Admin accounts

- **Grant and revoke:**
  - BeyondPilot grants operators from an environment list at sign-in (audited with `source=configuration`) and from its admin screens (`identity/AccountAdministration.java:160-187`). It refuses to withdraw a configured operator and refuses to act on one's own account, which "could leave an environment without a way in" (line 225). Verified.
  - Saleor refuses to deactivate oneself or a superuser (`saleor/graphql/account/mutations/staff/staff_update.py:123-137`). It promotes an existing customer without an email (`staff_create.py:114-115,210-224`). Verified.
  - Medusa invites by email with a token valid 24 hours (`packages/modules/user/src/models/invite.ts`, `services/user-module.ts:37`). Verified.
- **The last-admin guard under concurrency:**
  - memos locks the admins with `SELECT … FOR UPDATE` before counting (`store/db/postgres/user.go:126-162`). Verified.
  - Gitea and Mattermost check and then act without a lock, so two demotions at once can both pass. Reported.
- **Sessions:**
  - Mattermost uses one session length for every role, 30 days by default (`server/public/model/config.go:768-787`), with MFA as a global switch, off by default (`config.go:437,606-607`). Verified.
  - Open Food Network keeps everyone for a month (`config/initializers/session_store.rb:23`); BeyondPilot keeps everyone 30 days. Verified.
  - None of the references asks admins for MFA alone, or for re-authentication before blocking, approving or changing settings.
- **Revoking without ending sessions.** Second Bite reads the role from the database on every request (`server/internal/identity/queries.sql:70-73`), so a revoked admin is refused on the next request. Kratos also invalidates lazily (reported).

## An admin opening a store for its owner

- **Open Food Network:**
  - An admin may set any `owner_id` when creating a shop, while anyone else owns what they create (`app/controllers/admin/enterprises_controller.rb:14,380-381`). Only the owner or an admin changes the owner (`:392-395`).
  - The owner becomes a manager (`app/models/enterprise.rb:151,588-589`), up to five shops each (`db/schema.rb:965`).
  - Inviting a manager with no account creates a placeholder user and mails an invitation (`app/forms/user_invitation.rb:20-38`).
  - Verified.
- **Spree 6:**
  - `Sellers::Invite` creates an invitation (email, role, inviter, target) and sets the seller `invited`; re-inviting is allowed while pending (`spree/core/app/workflows/spree/sellers/invite.rb`).
  - An invitation lasts two weeks with a secure token, and links at once to an existing account of that email (`spree/core/app/models/spree/invitation.rb:7,18-21,172-176`).
  - Accepting fails when expired, already accepted, or with no account yet (`workflows/spree/invitations/accept.rb:34-40`).
  - Verified.
- **The closest fit.** Second Bite already keeps a privilege given by address pending until that address signs in with its code (SEC-39). That is Spree's design without a placeholder account.

## The states of a store's approval

- **Spree multi-vendor** has `pending → active` and `block` from any state, with no reason and no email on a change (`app/models/spree/vendor.rb:38-48`). It is the model Second Bite started from. Verified.
- **Spree 6** keeps `pending, invited, canceled, onboarding, ready_for_review, approved, rejected, suspended` (`spree/core/app/models/spree/seller.rb:31-42`). Verified.
  - It rejects only a seller never admitted and suspends only an admitted one.
  - Approval reinstates either, and a rejected seller may be approved later.
  - Reject and suspend take an optional reason and the acting staff member (`workflows/spree/sellers/{approve,reject,suspend}.rb`).
- **Open Food Network has no approval at all.** A shop is live once it chooses what it sells, with a welcome mail (`app/models/enterprise.rb:4,158,163`). Verified.

## The admin inside the main web, or apart

- **Inside the main application:**
  - Open Food Network, Spree multi-vendor and Mattermost's system console keep the admin in the main application. Verified for the first two; reported for Mattermost.
  - BeyondPilot keeps it under `web/src/app/[locale]/admin/`, with its own `layout.tsx`, `not-found.tsx` and `error.tsx`. Verified.
- **Apart:** Medusa (`packages/admin/dashboard`, a Vite SPA, verified) and Saleor (a separate dashboard repository, reported) ship their admin as a product of its own.
- **Moving back to the same origin:** Spree 6 moved its admin to a separate React application served from the same origin, "so cookies stay `SameSite=Lax` and no CORS is needed" (`spree/dashboard/README.md`). Verified.
- **BeyondPilot's web guard:**
  - It runs in each page, not in the layout, because Next.js does not render a layout again between its pages (`web/src/app/[locale]/admin/layout.tsx`).
  - `requireAccount` redirects to sign-in, and `requireRole` answers with the site's own not-found page, so a refusal reveals nothing about the admin area (`web/src/lib/auth/session.ts:45,67`).
  - With no `loading.tsx` or Suspense above the check, the response is a real 307 or 404 rather than a streamed 200.
  - Verified. Second Bite reads the account inside a Suspense boundary under Cache Components (`web/src/features/identity/current-account.ts`), so this point needs its own decision.
- **BeyondPilot's other admin conventions** (`docs/conventions.md` sections "Admin page frame", "Lists", "Forms", "Actions"):
  - Every page opens with a page header.
  - An empty list and "no results" are different states.
  - An action is chosen by how reversible it is:

    | The action | How it asks |
    | --- | --- |
    | Restorable and silent | Done at once, with an Undo |
    | Emails someone | A dialog with a reason |
    | Irreversible | A confirmation |

  - Verified.

## Libraries

**Web**

| Need | BeyondPilot | Medusa, Spree dashboards | Second Bite has |
| --- | --- | --- | --- |
| Table | `@tanstack/react-table` 9.3, manual mode, behind `DataTableView` (`web/src/components/composites/data-table-view.tsx`) | `@tanstack/react-table` 8.20 and 9.3 | shadcn `table`, `pagination` |
| Filters in the address | `nuqs` 2.10, one parser object per list (`web/src/features/identity/accounts-search.ts`) | — | nothing |
| Forms | `@tanstack/react-form` 1.33 with `zod` 4.6, problem fields mapped to inputs (`web/src/components/form/app-form.ts`) | react-hook-form with zod | hand-written forms |
| Server data in the browser | TanStack Query only in two wizard files; admin writes call the SDK and then `router.refresh()` | `@tanstack/react-query` | nothing |
| Notices | sonner behind `useNotify` (`web/src/hooks/use-notify.ts`) | — | Base UI toast |
| Dates, charts | next-intl formats; recharts | — | the same |

All verified in each project's `package.json` and the files named.

**Backend.** No reference Go server uses a policy engine (casbin, OPA, Cerbos, Oso) for its admin.
- Mattermost builds dynamic SQL with squirrel and Gitea with xorm's builder (verified). Both would take the SQL out of sqlc's check against the schema, which the [persistence guideline](../guidelines/persistence.md) keeps.
- The `offer` module already filters and orders lists in sqlc with `sqlc.narg` and `CASE` (`server/internal/offer/queries.sql:85-101`).
- **huma v2.39 already provides the rest:**
  - `huma.NewGroup` for a prefix, with operation modifiers and middleware (`group.go:79,127`);
  - validation tags and `Resolve` for checks across fields;
  - the `conditional` package for `If-Match` on settings (`conditional/params.go:36,66`).

  All verified in the module cache.

## What Second Bite takes

| Rule | From |
| --- | --- |
| One `admin` role, no permissions until some admins must be limited | Open Food Network `ability.rb:26-31`; Medusa's RBAC off by default |
| Every admin endpoint under `/admin`, through one group; the check is `RequireAdmin` in the service | Medusa `router.ts:521-525`, Spree `base_controller.rb:12`, BeyondPilot `requireOperator` |
| A test walks every `/admin` operation: 401 signed out, 403 for a customer, one audit row per change | BeyondPilot `IdentityAccountsTest`, extended to the whole document; Saleor's open default as what to avoid |
| Each status change is its own action, with the actor, the time and a reason; reject only a store never admitted, block only an admitted one, approve reinstates | Spree 6 `sellers_controller.rb`, `workflows/spree/sellers/*` |
| Lists: `page`, `size` 1–100 (25 by default), `total` from `count(*) OVER ()`, a separate count for an empty page past the end | BeyondPilot `AccountListRequest`, listmonk, miniflux |
| An append-only audit table written in the change's transaction, labels kept as they were, the request id | BeyondPilot ADR 0003 and `V2__audit_create_events.sql`; Zitadel |
| The audit's catalog as Go types the compiler closes, not names checked at run time | Zitadel `Payload()`, Mattermost `Auditable()` |
| A deleted account's labels nulled in the audit, its identifier and actions kept | Between Mattermost (deletes) and Zitadel (keeps) |
| An admin cannot revoke themselves or the last admin, checked under a lock | Saleor `staff_update.py:123-137`, BeyondPilot `accountOfAnother`, memos `user.go:126-162` |
| Admins sign in and stay signed in as everyone does; no MFA in the pilot | Mattermost `config.go`, Open Food Network, BeyondPilot |
| An admin opening a store names the owner by email; the role waits for that address's code; the invitation expires after two weeks | Spree 6 `invitation.rb`, `sellers/invite.rb`; Open Food Network `enterprises_controller.rb:380-395` |
| The admin inside the main web on the same origin; the role checked in each page; a non-admin gets the site's not-found | Spree 6 `dashboard/README.md`, Open Food Network, BeyondPilot `session.ts` |
| An action asks according to how reversible it is | BeyondPilot conventions, "Actions" |
| nuqs, TanStack Table and TanStack Form with zod for the admin web | BeyondPilot's admin; Medusa and Spree for TanStack Table and zod |

| Avoid | Seen in |
| --- | --- |
| A permission check that passes when none is declared | Saleor `mutations.py:499-524` |
| Audit written after commit, its failure only logged | Gitea (reported) |
| Check-then-act on the last admin without a lock | Gitea, Mattermost (reported) |
| A status set by writing the field | Spree multi-vendor's `state`, Second Bite's current `SetStatus` (`server/internal/seller/queries.sql:44-47`) |
| A row-diff trigger as the audit | Weighed above (C) |
