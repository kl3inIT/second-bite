# SEC-75 — Admin foundation: design

Status: proposed on 21 October 2026 by the tech lead, for review before any code. Tracked in Linear as SEC-75. The study behind every choice is [the admin foundation research](../../../research/2026-10-21-admin-foundation.md). The decisions recorded on SEC-75 that day are taken as given here.

## Scope

**In this increment:**
- The rules every admin endpoint and screen follows:
  - authorization;
  - the audit trail;
  - granting and revoking admins;
  - the admin's side of a store's states;
  - the admin list API;
  - the admin web's structure.
- What already has a backend:
  - the admin web's shell;
  - stores, with their list, actions and detail (Figma rows 1 and 2);
  - settings (row 3);
  - the shared states (row 4).

**Not here:**
- Figma rows 5 to 11, and the screen where an admin opens a store for its owner: SEC-62.
- The owner's side of approval: SEC-64.
  - Opening a store `pending` again.
  - What a pending, rejected or blocked store shows its owner and staff.
  - An admin opening a store for an owner named by email.

  SEC-64 builds on the state machine and the audit defined here, so this increment's backend steps land first.

**Order against the prototype.** SEC-75 is not on the path of the 23 October prototype: the team opens its stores and uses the command line. The prototype waits on ordering (SEC-15, SEC-51, pull requests 25 and 26). Reviewing those comes first, and this increment's steps follow in the order of the plan.
- The flag on a store whose phone or address matches a blocked store, and the refusal to activate a seller with no owner: SEC-65.

## Who may do what

Two kinds of role, unchanged:
- an account is a `customer` or an `admin` (`identity_accounts.role`);
- a member of a seller is its `owner` or `staff` (`seller_members`).

There is one `admin` role and no permissions until some admins must be limited (research › Roles).

| | Signed out | Customer | Staff | Owner | Admin |
| --- | --- | --- | --- | --- | --- |
| Browse and search offers | ✓ | ✓ | ✓ | ✓ | ✓ |
| Post, change and withdraw a store's offers | | | ✓ while active | ✓ while active | — |
| Change a store's details, add or remove staff | | | | ✓ | — |
| Read any store, its posts and members | | | own store | own store | ✓ |
| List stores by status; approve, reject, block, unblock | | | | | ✓ |
| Change offer and email settings | | | | | ✓ |
| Grant or revoke admin | | | | | ✓, never their own and never the last |

An admin never posts for a store. `Publishing` already refuses anyone who is not a member.

## Authorization in four layers

Each layer stays even when the one after it exists.

1. **Authentication, as today.**
   - The middleware reads the cookie or the bearer token.
   - `FindSession` joins the account on every request, so the role is fresh each time (`server/internal/identity/queries.sql:70-73`).
   - `platform.Caller` goes into the context.
2. **The service decides.**
   - Every admin use case starts with `platform.RequireAdmin(ctx)`; every member use case with `requireOwner`, `roleOf` or `Publishing`.
   - A stranger to a store gets 404; a signed-in person without the role gets 403 `PLATFORM_ADMIN_REQUIRED`.
   - Change in this increment: email settings move the check from the handler (`notification/handler.go:56,88`) into `Service.EmailSettings` and `SaveEmailSettings`. The command line keeps a path of its own, `SaveEmailSettingsAsSystem`, which records the command line as the actor.
3. **One admin group for the routes.**
   - `RegisterAdminOperations(admin huma.API, s *Service)` in each module takes the group `huma.NewGroup(api, "/admin")`, built once in `cmd/secondbite`. Its operation paths are written without the prefix (`/sellers`, `/offer-settings`, `/email-settings`).
   - The group's modifier adds the tag `Admin` and the documented security to each operation.
   - It decides nothing; it keeps every admin route under one prefix, so the test in layer 4 finds them all.
   - The existing six `/admin/*` operations move to it in one change. Their paths and generated clients stay the same.
4. **A test over the whole contract** (`server/cmd/secondbite/admin_test.go`). It walks `api.OpenAPI().Paths` and, for every operation whose path starts with `/admin/`:
   - signed out, expects 401 `PLATFORM_AUTHENTICATION_REQUIRED`;
   - as a customer, expects 403 `PLATFORM_ADMIN_REQUIRED`;
   - for a method other than GET, looks the operation up in a table of happy-path calls. It makes the call as an admin, and expects exactly one new audit row whose `request_id` is the response's `X-Request-Id`. Alternatively, the table entry says `notAudited` with its reason (for example, marking a problem report read), and then expects none.

   An operation missing from the table fails the test, so a new admin endpoint cannot ship unchecked, nor unaudited without a stated reason. No operation may be `Hidden`.

The web checks the role only to decide what to show (section *Web*). The server is the gate.

## The audit trail

### Log and audit

The audit records only the admin actions of a closed catalog, as BeyondPilot's does. It does not record every request or every change.

| | Log | Audit |
| --- | --- | --- |
| Read by | Developers and whoever runs the server | Admins, and whoever answers a complaint |
| Answers | What a request did, why it failed, how long it took | Who did what to which store or account, when and why |
| Records | Every request, failure and technical event | The eight admin actions below, and those added to the catalog later |
| Lives | JSON on stdout, kept as the host keeps logs | `audit_events` in PostgreSQL, kept |
| Losing one | Acceptable | Not acceptable: written in the change's transaction |
| Personal data | None: identifiers only ([logging](../../../conventions.md#logging)) | The admin's and the resource's label at that moment, nulled when that account is deleted |

They meet at the request id. Each audit row keeps the `request_id` of the request that made it. Recording it also writes one log line, `audit.event.recorded`, with identifiers only. A developer goes from an admin's "blocked at 20:15" to the request's log lines, and back.

Not recorded: customers' and members' actions (ordering, posting, adding staff), an admin only reading a list or a store, and signing in or out. Those are the log's.

### Module and edges

- **A new module `audit`** (`internal/audit`). It owns the table `audit_events` and the catalog of actions. The admins' read API comes with its first screen (SEC-62 row 11, Nhật ký), not here.
- **New edges** in ARCHITECTURE.md: `identity → audit`, `seller → audit`, `offer → audit`, `notification → audit`.
- **`audit` depends only on `platform`.** It needs no edge to `identity`, for two reasons:
  - the actor comes from the context;
  - `audit` reads the log for admins through `platform.RequireAdmin`.

### Table

Migration `0014_audit_create_events.sql`.

| Column | Type | Holds |
| --- | --- | --- |
| `id` | `uuid` primary key, `uuidv7()` | The event |
| `occurred_at` | `timestamptz` | When, `now()` |
| `action` | `text`, `CHECK (action ~ '^[a-z_]+\.[a-z_]+$')` | `subject.verb` from the catalog |
| `actor_id` | `uuid` null | The admin. NULL for the command line. No foreign key, since an account can be deleted |
| `actor_label` | `text` null | The admin's email at that moment. NULL once the account is forgotten |
| `resource_type` | `text` | `seller`, `account`, `offer_settings`, `email_settings` |
| `resource_id` | `text` | The resource's identifier; `current` for a singleton |
| `resource_label` | `text` null | The store's name or the account's email at that moment. NULL once forgotten |
| `details` | `jsonb`, an object | The action's fields; never personal data |
| `request_id` | `text` null, at most 64 characters | `platform.RequestID(ctx)`; NULL for the command line |

- **Indexes:** `(occurred_at DESC, id DESC)` for the log, `(resource_type, resource_id, occurred_at DESC)` for a store's history, and `(actor_id, occurred_at DESC)`.
- **Append-only by its code, not by a trigger** (decided 21 October 2026). The module's queries are one insert, one update that nulls the labels naming a deleted account, and the reads to come; no other query touches the table. A trigger with that one exception would have to compare every other column, which is easy to get wrong. It would not stop anyone who can run SQL by hand, since the application has a single database user. None of the Go references keeps one.

### The catalog

Each action is a struct of a sealed interface. Only `audit` can satisfy it, so a detail a type does not declare cannot be recorded. This is the compile-time form of BeyondPilot's run-time check (research › Audit).

```go
// Action is one kind of thing an admin did. The catalog is closed: only this
// package's types satisfy it, and a recorded name never changes meaning.
type Action interface {
	AuditAction() string // subject.verb
	sealed()
}

type SellerApproved struct{}
type SellerRejected struct{ Reason string `json:"reason"` }
type SellerBlocked struct{ Reason string `json:"reason"` }
type SellerUnblocked struct{}
type OfferSettingsChanged struct{ Fields []string `json:"fields"` }
type EmailSettingsChanged struct{ Provider string `json:"provider"`; Fields []string `json:"fields"` } // names, never a secret
type AdminGranted struct{ Source string `json:"source"` }            // "admin" or "command_line"
type AdminRevoked struct{ Source string `json:"source"` }
```

| Action | Name | Resource |
| --- | --- | --- |
| `SellerApproved` | `seller.approve` | seller |
| `SellerRejected` | `seller.reject` | seller |
| `SellerBlocked` | `seller.block` | seller |
| `SellerUnblocked` | `seller.unblock` | seller |
| `OfferSettingsChanged` | `offer_settings.change` | offer_settings |
| `EmailSettingsChanged` | `email_settings.change` | email_settings |
| `AdminGranted` | `admin.grant` | account |
| `AdminRevoked` | `admin.revoke` | account |

A reason is the admin's words to the owner: required, 10 to 500 characters, shown to the owner and emailed. It is about the store, so it is not personal data of the admin.

### Functions

```go
type Resource struct{ Type, ID, Label string }

// Record writes one event in tx, the transaction of the change, so the event
// and the change succeed or fail together. The actor and the request come from
// ctx; it also logs audit.event.recorded with identifiers only.
func (s *Service) Record(ctx context.Context, tx pgx.Tx, r Resource, a Action) error

// ForgetAccount nulls the labels that name the account and keeps its
// identifier and actions. identity calls it inside DeleteAccount's transaction.
func (s *Service) ForgetAccount(ctx context.Context, tx pgx.Tx, accountID uuid.UUID) error
```

- **The actor's label.** `FindSession` already joins the account, so it selects `a.email` too, and `platform.Caller` gains `Label string`. A test lists every catalog type and checks each name is unique and matches the pattern.
- **Audit entries and domain events stay separate types.** An event carries identifiers only and is written only when something listens. An audit entry is written for every admin action, with the labels of that moment.

## Granting and revoking admins

- **The command line:** `secondbite admin grant EMAIL` stays, and `secondbite admin revoke EMAIL` is new. Both record `AdminGranted` or `AdminRevoked` with `Source: "command_line"` and no actor.
- **The API**, for SEC-62's "Quản trị viên" screen; built here, with no screen yet:
  - `GET /admin/admins`;
  - `POST /admin/admins {email}`, granting by address, so a person who never signed in can be named (changed while building, 21 October 2026);
  - `POST /admin/admins/{accountId}/revoke`.

  These are commands, not `DELETE`, after BeyondPilot.
- **Granting** an address that has no account creates the account, waiting for that address's code (SEC-39).
- **Revoking:**
  - It refuses the caller's own account (`IDENTITY_ADMIN_SELF`) and the last admin (`IDENTITY_LAST_ADMIN`).
  - The admins are counted under `pg_advisory_xact_lock(hashtextextended('identity:admins', 0))`, so two revokes at once cannot both pass. This is the repository's own idiom (`seller/queries.sql:1-3`).
  - Sessions are not deleted: the role is read on every request, so a revoked admin is refused on their next one. A test asserts it.
- **Session length:** admins sign in and stay signed in as everyone does (30 days sliding), with no MFA in the pilot (research › Admin accounts).

## A store's states

`pending`, `active`, `rejected`, `blocked` (SEC-75 decision 2, after Spree 6).

| Action | From | To | Reason | Owner emailed | Audit |
| --- | --- | --- | --- | --- | --- |
| `POST /admin/sellers/{id}/approve` | `pending`, `rejected`, `blocked` | `active` | — | yes | `seller.approve`, or `seller.unblock` from `blocked` |
| `POST /admin/sellers/{id}/reject` | `pending` | `rejected` | required | yes | `seller.reject` |
| `POST /admin/sellers/{id}/block` | `active` | `blocked` | required | yes | `seller.block` |

- **Conditional transitions:**
  - Each action is one conditional update, `UPDATE … WHERE id = @id AND status = ANY(@from)`. It replaces `SetStatus`, which today writes any status (`seller/queries.sql:44-47`).
  - From any other state the action answers 409 `SELLER_STATUS_CHANGE_NOT_ALLOWED`, translated as every failure is.
  - `activate` is renamed `approve`; this increment makes the generated clients follow.
- **New columns** (migration `0015_seller_add_status_reason.sql`):
  - `status` gains `rejected`;
  - `status_reason text` null, set by reject and block, cleared by approve.

  `status_changed_at` and `status_changed_by` stay. Existing stores keep their status.
- **Telling the owner:**
  - Each change publishes `seller.StatusChangedEvent{SellerID, Status}` in the transaction. Its listener `seller.tell_owner` reads the owner's address through `identity.Accounts` and sends the email through `notification.SendEmail`.
  - The new edge is `seller → notification`. `notification` cannot listen to `seller` itself, since notification → seller → identity → notification would be a cycle.
  - When email is not configured the job ends (`river.JobCancel`) rather than retrying. Delivery is at least once, so an owner may rarely get the same email twice.
  - The email's words: "Cửa hàng {name} đã được duyệt", "chưa được duyệt: {reason}", "đã bị tạm khoá: {reason}", in both languages.
- **The blocked owner-less seller of SEC-37:** its block keeps the reason "Chủ cửa hàng đã xoá tài khoản" and no actor. SEC-65 then refuses to approve it while it has no owner.

## The admin list API

- **Request:** `GET /admin/sellers?status=pending,active&q=&page=1&size=25`.
  - `status` takes several values; with none, every status.
  - `q` matches a store's name, address or phone.
  - `page` starts at 1; `size` runs from 1 to 100, 25 by default.
- **Answer:** `{items, page, pageSize, total}`.
- **Order:** fixed, pending first, then the newest change, then `id`. A page past the end is empty, not an error.
- **In sqlc** (research › The admin API):
  - `status = ANY(sqlc.narg(statuses)::text[])` when the list is given, and `count(*) OVER () AS total`;
  - when a page past the first comes back empty, a separate count, so the total is never a wrong 0.
- **Search** without accents works as offer search does: the store's name and address are folded by `offer/search_text.go`'s rule into a generated column. If sharing that rule would need a new edge, the rule moves to `platform`.
- **Each item** carries the store's name, address, phone, location, status, reason, created and changed times, and its owner's email for admins.

## Settings

- Offer settings and email settings keep their endpoints under the group.
- **Saving needs `If-Match`** with the version read, the `updated_at` of the settings row, through huma's `conditional` package. Two admins saving at once: the second gets 412 and reloads.
- Each save records `OfferSettingsChanged` (the names of the fields changed) or `EmailSettingsChanged` (the provider, never a key or a password).

## Web

### Where the code lives

```text
web/src/app/[locale]/admin/
  layout.tsx            sidebar frame for an admin; the page alone for anyone else
  not-found.tsx         the site's 404 for a non-admin; a 404 inside the frame for an admin
  error.tsx             keeps the sidebar when a page fails
  page.tsx              redirects to /admin/sellers until the overview exists (SEC-62 row 5)
  sellers/page.tsx      row 1: the list by status
  sellers/[sellerId]/page.tsx   row 2: the detail, posts (read only), members
  settings/page.tsx     row 3: offer settings, email settings
  [...slug]/page.tsx    the coming-soon screen for the menu's other entries; 404 otherwise
web/src/features/admin/ the admin's components, reads and search parsers
```

### Guard

- `features/identity/current-account.ts` keeps `role` and gains two functions, after BeyondPilot (`web/src/lib/auth/session.ts`):
  - `requireAccount(returnTo)` sends a signed-out person to sign in and back;
  - `requireRole("admin", returnTo)` answers the site's not-found page for anyone else.
- They run in each page, not in the layout, because Next.js does not render a layout again between its pages.
- Every admin page is `noindex`.

**Open: the guard and Suspense.** Under Cache Components the account is read inside a Suspense boundary (`current-account.ts:17`). Then a refusal is a streamed `notFound()` under a 200 status, where BeyondPilot gets a real 404. The options:

1. **Admin pages have no Suspense above the guard:** the page awaits `requireRole` first, then renders.
   - The status is a real 404 or 307.
   - The cost: the admin page cannot stream its shell before the account read, about one API round trip.
2. **The guard in `proxy.ts`** (Next 16's middleware): forward the cookie to `GET /accounts/me` before rendering `/admin/*`.
   - A real status for every admin route in one place.
   - The cost: one more API call per admin request, and the page still checks for its data.
3. **Accept the streamed refusal:** the guard inside Suspense, with `noindex`. The server already refuses every admin API call, so nothing leaks.
   - Simplest.
   - The cost: a non-admin sees a 200 that renders "not found".

Proposed: **option 1**, verified on the built site with a test that expects status 404 for a customer and 307 for a signed-out person. If Cache Components refuses an uncached read outside Suspense on these routes, fall back to option 3 and record why.

### Shell

- The shadcn `sidebar` with `collapsible="icon"`, its state in the `sidebar_state` cookie.
- A skip link, and a header with the trigger and a breadcrumb.
- The menu as one typed list, from Figma `Admin/Sidebar`. An entry whose screen is not built shows "Sắp ra mắt" and opens the coming-soon screen; the list of those paths is typed in `features/admin/coming-soon.ts`.
- Every page opens with `AdminPageHeader`: back link, title with status, actions, tabs.

### Lists, forms and actions

- **Libraries** (SEC-75 decision 4):

  | Library | For |
  | --- | --- |
  | `nuqs` | `status`, `q` and `page` in the address, read by the server component through `createLoader` |
  | `@tanstack/react-table` | Manual mode behind one `DataTable` (frame, empty, no results, pagination); the server pages and sorts |
  | `@tanstack/react-form` with `zod` | The settings forms and the reason dialog; a problem's `errors` mapped to their fields, focus on the first invalid field |

  A write calls the generated SDK and then `router.refresh()`. TanStack Query and sonner are not added.
- **States:** an empty list ("Chưa có cửa hàng chờ duyệt") and no results ("Không tìm thấy", with one action that clears the filters) are different.
- **An action asks according to how reversible it is** (BeyondPilot conventions › Actions):

  | Action | How it asks |
  | --- | --- |
  | Approve | A confirmation, since it emails the owner |
  | Reject, block | `ReasonDialog`, a reason required |
  | Unblock | A confirmation |

  Each answers with a toast through `useNotify`, a wrapper of the Base UI toast that takes message keys only.
- **Words** follow the Figma terms: "cửa hàng", "gỡ do vi phạm", "chặn", "duyệt", "từ chối".

### Figma to code

| Figma (section "Quản trị · Web 1440") | Code |
| --- | --- |
| `Admin/Sidebar`, `Admin/Breadcrumb` | `features/admin/admin-sidebar.tsx`, the layout |
| `Admin/PageHeader` | `features/admin/admin-page-header.tsx` |
| `Admin/StatCard` | Not in this increment (row 5) |
| `Admin/Table`, `Admin/Pagination`, `Admin/Empty` | `features/admin/data-table.tsx` on shadcn `table`, `pagination`, `empty` |
| `Admin/StatusBadge` | `Badge` variants `pending`, `active`, `rejected`, `blocked`, each with an icon |
| `Admin/ConfirmDialog`, `Admin/ReasonDialog` | `features/admin/confirm-dialog.tsx`, `reason-dialog.tsx` on `alert-dialog` and `dialog` |
| Row 1 to row 4 frames | The pages above |

Each component's exact names are read from Figma with `get_design_context` when it is built, as the [Figma guide](../../../guidelines/figma.md) asks.

## Tests

- **Server:**
  - the contract test of layer 4;
  - for each transition, from every state, the expected status or 409, one audit row and one queued email;
  - revoking oneself and the last admin, with two revokes at once;
  - `ForgetAccount` nulling the labels that name the account and nothing else;
  - the list's filters, search without accents, pages and total;
  - settings' `If-Match`.
- **Web:**
  - unit tests of the search parsers and the problem-to-field mapping;
  - Playwright, against the stub backend:
    - the guard (status 404 for a customer, 307 signed out);
    - the store list with its filters;
    - approve, reject and block with their dialogs;
    - the detail;
    - both settings forms;
    - the coming-soon screen.

  Every page is checked with `expectNoSeriousA11yViolations`. The stub answers with the real statuses and codes (SEC-67's lesson).

## Documents this changes, in the change that makes them true

- **`docs/conventions.md`**, a section *Admin*:
  - one role;
  - the check in the service;
  - the `/admin` group and its contract test;
  - the audit catalog;
  - lists;
  - actions by reversibility.
- **`docs/guidelines/backend.md`:** registering an admin operation, recording an audit event.
- **`docs/guidelines/web.md`:** the admin area, the guard, `DataTable`, forms, `useNotify`, coming soon.
- **Specs and ARCHITECTURE.md:**
  - `docs/specs/seller.md`: the states, the actions, the reason, the email;
  - `docs/specs/identity.md`: grant, revoke, last admin;
  - `docs/specs/audit.md`: new;
  - ARCHITECTURE.md: the module, its edges and the statuses.
- **An ADR, `docs/decisions/0001-…`:** an admin approves a store before customers see it. It reverses SEC-57's choice; it is recorded once SEC-64 starts, as the operating rules ask.

## Open

1. Where the web's guard sits under Cache Components (*Web › Guard*); option 1 is proposed.
2. What the audit may keep once an account is deleted: the lawyer's view through SEC-32. Until then, labels are nulled and identifiers kept.
3. Whether SEC-64 or this increment moves `POST /sellers` back to `pending`. Proposed: SEC-64, since it also changes the owner's screens; this increment gives it the states and the transitions.
