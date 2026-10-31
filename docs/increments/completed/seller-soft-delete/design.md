# Deleting a store softly: design

Status: completed, 31 October 2026: merged with pull request 192 and on production. Earlier: started on 31 October 2026, at the user's request; tracked in Linear as SEC-187, where the contract below waits for the tech lead to agree it. The backend is the `seller` module ([spec](../../../specs/seller.md)), with a job in `order` ([spec](../../../specs/order.md)); the screens are the admin's stores ([SEC-62](../sec-62-admin-stores/design.md)).

## What an admin can do

- Delete a store in any status but deleted, with a reason the owner is emailed, 10 to 500 characters. The store is blocked at once: customers no longer see it and cannot order. The orders still to collect are handed over as usual; once none is left to finish, the store is deleted.
- See a store waiting to be deleted as "Chờ xóa" in the list and on its page, and the deleted stores from a "Đã xóa" button beside the filters, which the three cards of Figma AD-Q1 do not count.
- Restore a store waiting to be deleted, or deleted: it comes back blocked, and unblocking it lets it sell again.

## Decisions

- **Soft, never hard.** The user chose on 31 October 2026 to keep everything: the store, its people, followers, offers, orders and reviews stay, so a store is restored as it was. A deleted store is a status, `deleted`.
- **Wait for the orders, do not refuse or cancel them.** The user proposed it on 31 October 2026. What platforms publish was read first: Shopee refuses to delete an account with an order not finished ([Shopee PH help](https://help.shopee.ph/portal/4/article/81209-[My-Account]-Why-was-my-account-deletion-request-rejected)), and Too Good To Go's store terms let it retract pending reservations and tell the customers when it must remove a store ([marketplace terms](https://www.toogoodtogo.com/legal/terms-and-conditions-marketplace)). Second Bite takes no payment ahead, but a customer may already be on the way and a guest cannot be reached outside the app, so the store keeps handing over what was ordered and is deleted afterwards. Deleting at once, cancelling the orders, is left for when a food-safety case needs it.
- **Blocked while it waits.** Waiting reuses the blocked status, with `deletion_requested_at`, so every read that hides a blocked store (search, its page, ordering, followers) hides it with no change; the owner's staff still read it to hand over orders.
- **`order` ends the wait.** `order` already depends on `seller`, so the job that knows when no order is left (`order.finish_seller_deletions`, every minute) asks `seller` for the stores waiting and deletes each one with none left. An order is left to finish while it is still to collect, handed over or refused with its window not over, as those two can be opened again.
- **Restored, blocked.** The user chose on 31 October 2026 that a restored store stays blocked until an admin unblocks it. Restoring does not email the owner; deleting does, once.
- **A button, not a fourth card.** A fourth card squeezed the three of Figma AD-Q1 until "Đang hoạt động" took three lines at 1440 px, so the deleted stores are asked from a button beside the filters.

## Contract

| Endpoint | Who | Answers |
| --- | --- | --- |
| `POST /admin/sellers/{sellerId}/delete` `{reason}` | Admins | `200` seller, `blocked` with `deletionRequestedAt`; `409 SELLER_STATUS_CHANGE_NOT_ALLOWED` for one deleted or already waiting |
| `POST /admin/sellers/{sellerId}/restore` | Admins | `200` seller, `blocked`; `409` for one neither deleted nor waiting |

A seller's body gains `deletionRequestedAt`; `status` gains `deleted`; `GET /admin/sellers` leaves deleted sellers out unless `status=deleted`, and `counts` and `days` gain `deleted`. The trail gains `seller.delete` (with the reason) and `seller.restore`.

## Left out

- Deleting at once with the orders cancelled, and telling their customers.
- A Figma frame for the "Xóa cửa hàng" dialog, the "Chờ xóa" badge and the "Đã xóa" button: built from the block dialog and the existing badge and buttons.
