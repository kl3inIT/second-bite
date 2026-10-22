# SEC-65 — An owner-less seller cannot be approved: design

Tracked in Linear as SEC-65. It follows account deletion ([SEC-37](../../completed/sec-37-account-deletion/design.md)) and the tech lead's review of pull request 33 (21 October 2026).

## The problem

- When an owner deletes their account, `forgetAccount` removes their memberships and blocks every seller they owned, with the reason "Chủ cửa hàng đã xoá tài khoản" and no one named as having blocked it (`seller/listeners.go`).
- An admin's approve (`POST /admin/sellers/{sellerId}/approve`) takes a blocked seller back to `active` without checking that it still has an owner. The store then shows to customers and takes orders, but nobody can manage it: no one can post, hand over or cancel.

## What changes

- **Approving refuses a seller with no owner**, from any status, with `SELLER_OWNERLESS` (409) in Vietnamese and English. Nothing is recorded: no audit event, no job to tell an owner, no change to the day's counts.
- **No new table, column or migration.**
  - Why a seller was blocked is already recorded: `status_reason` holds the owner-less reason, and `status_changed_by` is empty for it but names the admin for a moderation block (SEC-75).
  - The list already marks a seller with no owner: `ownerEmail` is absent.
- **The admin web is unchanged.** Its approve and unblock actions already show the server's words in a toast. Hiding the action for an owner-less seller would be a new state in Figma and is left for the admin web (SEC-62).

## Against concurrency

The check and the change are in one transaction, which locks the seller's row first (`LockSeller`) and then reads its owner. In PostgreSQL's default isolation, each statement sees what was committed before it started.

- **The owner's account is deleted first:** after the lock, the approve sees no owner and refuses.
- **The approve commits first:** `BlockOwnerless` waits for the row lock, reads the seller as active, and blocks it again.

Either way, the seller cannot be left active without an owner.

## Left out, for another issue

- Flagging a pending store whose phone or address matches a store an admin blocked. It needs new stores to wait for approval (SEC-64), which the spec defers until after the pilot; until then every store opens `active`, so no admin reviews one. It moved to SEC-136, blocked by SEC-64.

## Verification plan

- **Go:** `TestAdmin` › every action from every status gains approving an owner-less seller from blocked, pending and rejected: refused with `SELLER_OWNERLESS`, nothing recorded, the status unchanged.
- **Through the API:** `TestService` › an owner deletes their account: approving the seller blocked by the deletion answers 409 `SELLER_OWNERLESS`, in Vietnamese and in English.
- **Against the real service:** an owner deletes their account; the admin's unblock on the admin web shows the refusal in the toast, and the store stays blocked.
