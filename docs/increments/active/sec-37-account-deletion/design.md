# SEC-37 — Account deletion: design

Status: proposed and built on 20 October 2026 on the branch `tuandev2111/sec-37-account-deletion-from-the-app-and-the-web-as-the-app-store`, for review. Tracked in Linear as SEC-37; needed before the first store submission (SEC-14).

## What a person can do

- **A customer or a seller member, in the app or on the web,** opens Account settings (from the account tab, or on a desktop from the header's account menu) and, at its foot, Delete account; reads what is deleted and what is kept, asks for a code emailed to their address, types it, and their account is gone: they are signed out everywhere, cannot sign in with it again, and their address, name, sessions, Google link, unused photos and the record of emails sent to them no longer exist. Signing in again later with the same address makes a new, empty account.
- **Anyone, on the web,** opens `/delete-account` without an app (Google Play's "web link"), reads the same explanation and how long it takes (at once, the rest within minutes), and signs in to start the same flow.
- **The owner of a seller** is told before they confirm that deleting their account closes the seller they own: its staff lose it and it stops showing to customers until admins decide what becomes of it.

## What the stores ask

Read on 19 October 2026 and summarised on SEC-37: Apple (Guideline 5.1.1(v), "Offering account deletion in your app") asks for deletion started in the app, the whole account deleted, legal retention explained, a stated time and a confirmation; Google Play asks for an in-app path and a web link. Both are met above; Sign in with Apple does not exist yet (SEC-38 revokes its tokens when it is built).

## Account settings

Added on 20 October 2026 while reviewing the pull request: deletion is not offered beside sign-out, since a destructive action does not belong next to an everyday one. Account management is one flow instead.

- **Entry point.** The header's account menu on a desktop holds only "Cài đặt tài khoản" and "Đăng xuất". The account tab, on a phone or in the app, holds the sign-out button and a "Cài đặt tài khoản" row.
- **Account settings shows the account's own data, read-only:**
  - its name and email;
  - its display name, or that it has none;
  - the sellers it owns or works for, with its role;
  - the language, which opens the same page in the other language.
- **Deletion.** At the foot of settings, a short explanation and an outline button in the danger colour open the deletion. "Giữ tài khoản" in the deletion leads back to settings.
- **Web:** `/[locale]/account/settings`, a server page beside `/account`. It is personal, so it is not indexed. Signed out, it sends the person to sign in and back.
- **App:** a typed route `/account-settings` over the tabs, as `/delete-account` is.
- **Nothing new on the server.** The page reads what `GET /accounts/me` and `GET /sellers/mine` already answer. Editing the display name needs an endpoint that does not exist yet, and stays candidate work.

Designed in Figma, Secondbite file, section "Quản lý tài khoản cá nhân (SEC-37)":

| Step | Web desktop | App |
| --- | --- | --- |
| Account menu or account tab | Q1 | Q1a |
| Account settings | Q2 | Q2a |
| Deletion: confirm | Q3 | Q3a |
| Deletion: code | Q4 | Q4a |
| Deletion: done | Q5 | Q5a |

## Boundary discovery

**Domain story.** A signed-in person asks to delete their account → Second Bite emails a code to the account's address → the person types it → the account and everything that names the person are removed at once, and modules that keep something about the account forget it → the person sees that it is done. Failures: a wrong or expired code (try again, ask a new one, the sign-in limits apply); the address cannot receive email (nothing is deleted); the person is the owner of a seller (told before, and the seller is closed after).

**Glossary.** *Account deletion*: removing the account record and every piece of personal data tied to it; not a deactivation. *Deletion code*: an emailed code whose only use is to confirm one account's deletion; it cannot sign anyone in, and a sign-in code cannot delete. *Forgetting an account*: what another module does when told the account is gone.

**Commands and facts.** `RequestDeletionCode` (signed-in caller) → code emailed. `DeleteAccount(challenge, code)` → fact `identity.AccountDeletedEvent{AccountID}`. Reactions: `seller` removes the account's memberships and blocks the sellers it owned; `file` deletes the photos it uploaded that nothing uses.

**Data and invariant owners.**

| Personal data | Owner | On deletion |
| --- | --- | --- |
| Address, display name, role (`identity_accounts`) | `identity` | Deleted in the transaction |
| Sessions, Google links (`identity_sessions`, `identity_external_logins`) | `identity` | Deleted with the account (foreign keys cascade) |
| Codes sent to the address (`identity_sign_in_challenges`) | `identity` | Deleted in the transaction |
| Emails sent to the address (`notification_emails.recipient`) | `notification` | Deleted by a call before the transaction, since afterwards no one knows the address |
| Memberships (`seller_members`) | `seller` | Deleted by its listener; a seller the account owned is blocked, as a seller always has an owner |
| Photos uploaded and never used (`file_files`, their objects) | `file` | Deleted by its listener |
| Photos an offer or a seller uses, offers posted (`uploaded_by`, `posted_by`) | `file`, `offer` | Kept: they are the seller's; the account identifier left in them names no one once the account is gone |

**Context map.** `identity` → `notification` (exists): a call, since the address is needed and is a secret of the account that must not be stored in an event. `seller` → `identity` (exists) and `file` → `identity` (new): listeners of `identity.AccountDeletedEvent`. An event and not a call, because `seller` already depends on `identity` (a call back would be a cycle) and because forgetting may fail and be retried without undoing the deletion ([call or event](../../../conventions.md#call-or-event)).

**Module.** No new module; `identity` owns the command and its rules.

## The outbox

This is the first event between modules, so the mechanics the [backend guideline](../../../guidelines/backend.md#events) chose arrive with it, in `internal/platform`:

- **River** (v0.49) on the same PostgreSQL. Its tables are created by its own migrations, run after goose at start-up inside a transaction holding an advisory lock, so several instances start safely and a River upgrade brings its schema.
- `platform.Publish` writes the event inside the publisher's transaction, as one River job per listener. A rolled-back change publishes nothing; a committed one is never lost.
- `platform.Listen` registers a listener under a stable name. Each runs after the commit in a transaction of its own, retried with River's backoff until it succeeds, and must be idempotent. The event carries identifiers only.
- One River job kind, `platform.event`, carries every event to its listener, since River binds one worker to a kind and an event can have several listeners. The event's key (`identity.account_deleted`) and the listener's name are in the job.
- `serve` starts the workers and stops them on shutdown after the HTTP server; the command-line commands only insert.

## The contract

| Operation | Who | Answer |
| --- | --- | --- |
| `POST /accounts/me/deletion-codes` | A signed-in caller | `202 {challengeId, expiresAt}`; a code is emailed to the account's address |
| `POST /accounts/me/deletion` `{challengeId, code}` | A signed-in caller holding a deletion challenge of their own address | `204`; the session cookie is cleared |

A POST command rather than `DELETE /accounts/me`: the deletion takes a body (the code), which a `DELETE` does not carry reliably through the generated clients.

New failure: `IDENTITY_CHALLENGE_GONE` (410) also answers a code of the wrong purpose or another address, so a challenge says nothing about who asked for it. The existing code failures, limits and `notification`'s 503 apply as for sign-in.

## Data

- `identity_sign_in_challenges.purpose` (`sign_in` or `delete_account`, default `sign_in`): a sign-in spends only sign-in codes, a deletion only deletion codes. Codes of both purposes share an address's limits and its one live code.
- River's tables (`river_job`, `river_leader`, …), owned by `platform`.

## Failure behavior

- The address cannot receive email: `notification`'s 503, nothing deleted.
- Forgetting the address in `notification` succeeds and the deletion then fails: the records of emails are gone, the account stays; the person tries again.
- A listener fails: River retries it; the account is already deleted and cannot sign in.
- Two deletions of the same account race: the second finds the challenge used (`IDENTITY_CHALLENGE_GONE`).

## Verification plan

- Go: the deletion end to end through HTTP (code, deletion, signed out, the session refused, a new sign-in makes a new account), the purposes kept apart, the listeners (memberships removed, an owned seller blocked, unused photos deleted, used ones kept, idempotent), the outbox (nothing published on rollback), the boundary check with the new edge, the contract check.
- Web: unit and browser tests of `/delete-account` signed out and signed in, reached through account settings from the account tab and the account menu, the flow against the stub backend, axe.
- Mobile: widget tests of the account tab's entry, account settings and the deletion screen.

## Open questions

- Which order and payment records the law keeps, and for how long, anonymised (the lawyer reviewing SEC-32); the order module (SEC-15) follows the event when it exists.
- Whether an owner with open orders should be refused rather than their seller closed, once orders exist (the team, with SEC-15): it needs a check `identity` cannot make without a cycle, so it would come with the order module's own listener or a change of who owns the command.
- Sign in with Apple's token revocation (SEC-38).
