# SEC-76 — The web's customer flow end to end: design

Tracked in Linear as SEC-76, under SEC-51. Plan: [plan.md](plan.md).

## Outcome

A customer goes from the home to collecting their order on the web. SEC-49 built the browsing and the cart up to the confirmation (K5). SEC-51 (PR #26) builds the order pages on SEC-15's order API (PR #25). This increment joins the two and adds only the Figma "Mobile · Khách" screens that neither has.

## What exists and what is missing

Against Figma sections 4, 5 and 10, as of 21 October 2026:

| Figma                                                                       | Where it is                                                           |
| --------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| L1–L4, signing in by email code or Google                                   | `main` (SEC-29, SEC-56), the `/sign-in` page                          |
| L5, the sign-in sheet at "Đặt món"                                          | Missing: this increment                                               |
| L6, the display name on a first order                                       | Missing: this increment, on `PUT /accounts/me` (SEC-61)               |
| K6 / O1, O2, O3, O5, O6, K8 / O8: the order, its code, cancelling, the list | SEC-51                                                                |
| K5 ordering the cart's lines                                                | Missing: this increment, on `POST /orders` (1–10 lines of one seller) |
| O7, the portions ran out at "Đặt món"                                       | Missing: this increment, a sheet over K5                              |
| O4, someone else collects; K6b, stars once collected                        | No API field yet; not built                                           |

## Decisions

1. **SEC-51 is merged into this branch.** SEC-51 carries SEC-15's backend, which conflicted with `main`. The merge renumbers the order migration to `0014`, regenerates sqlc and `api/openapi.yaml`, and gives the order failures Vietnamese and English words as `main`'s failures have. SEC-51's owner reviews these with this branch.
2. _(Superseded by decision 7.)_ **L5 is the sign-in form in a sheet over K5.** "Đặt món" signed out opens a bottom sheet titled "Đăng nhập để đặt món", which says the cart is kept. It holds the same form as `/sign-in`: Google, or an email and its code. Signing in comes back to `/cart?continue=1`, which takes the next step by itself. The cart is in `localStorage` (SEC-49 decision 7), so it survives the sign-in.
3. _(Superseded by decision 7.)_ **L6 asks the name only while the account has none.** An account's display name is empty until Google fills it or its owner sets one (identity spec). "Đặt món" signed in with no name opens "Quán gọi bạn là gì?", saves through `PUT /accounts/me`, then goes on. With a name it is never asked; the name is changed in account settings.
4. _(Superseded by decisions 6 and 7.)_ **K5 orders the whole cart in one `POST /orders`.** One Idempotency-Key per visit goes with every press. The order page (SEC-51) opens and the cart is emptied. Back from signing in, an account that needs nothing more orders at once, since "Đặt món" was already pressed.
5. **O7 names the dishes that ran out by reading them again.** `ORDER_OFFER_SOLD_OUT` and `ORDER_OFFER_UNAVAILABLE` do not say which offer. So the cart's dishes are read with `GET /offers/{id}` and each is cut to what is left. A sheet names the dish that is gone, or the one with fewer portions left, and says nothing was charged. It offers "Đặt …" for what is left, under the same key, since a refused order writes nothing, and "Xem món khác của quán". Either choice, or closing the sheet, leaves only what is left in the cart. When no dish is short (the seller closed, or the portions came back), and for any other refusal, the server's own words are shown.
6. **The cart holds dishes of any sellers** (the owner, 21 October 2026). It supersedes SEC-49's one seller per cart and K4c's "Bắt đầu giỏ mới?" sheet. A dish joins its seller's basket in the same cart. K5 shows each seller's collection point, dishes and cancellation time, with one total. "Đặt món" sends one `POST /orders` per seller, since an order holds one seller's dishes (SEC-15), each with the visit's key and the seller's id. A basket ordered leaves the cart at once, so a refusal further on never sends it again. One order opens its page, several open the list. A cart saved with one seller is read as that seller's basket.
7. **Ordering needs no account: a name and a phone number, checked once** (the owner, 21 October 2026). It supersedes decisions 2 and 3: K5 has no sign-in sheet and no name sheet.
   - **The form:** "Đặt món" opens a sheet over K5, "Người đến nhận", as the sign-in sheet was: a name of 1 to 50 characters and a Vietnamese phone number. The browser remembers both for the next order.
   - **The check:** "Đặt món" opens a dialog showing the number grouped as "0900 000 000", with "Đúng, đặt món" and "Sửa". Nothing is sent to the phone; the seller calls it only if needed. A number is not verified, so anyone can type someone else's. That risk is accepted for the pilot and left to a later limit.
   - **The API:** `POST /orders` takes `name` and `phone` from everyone, signed in or not, and attaches the account when someone is signed in. The server normalizes the number (spaces, dots, dashes, `+84`) and refuses others with `ORDER_CONTACT_INVALID`. Without an account, a key is unique to the phone number it came with.
   - **The access:** the order comes back to whoever placed it with an access, HMAC-SHA-256 of its identifier under the collection code key with its own label, never stored. `GET /orders/{id}` and `POST /orders/{id}/cancel` accept it as the `Order-Access` header, never in the address, so a "Chỉ đường" referrer cannot carry it.
   - **The web:** the web keeps each guest order's access in an httpOnly cookie (`secondbite_orders`, the newest 20, seven days), written by a server action before the order page opens. The order pages read it on the server, and "Đơn của tôi" lists those orders when no one is signed in.
   - **Who sees the number:** the seller's people and whoever placed the order; it is never logged.
   - **Removed:** `/orders/new`, SEC-51's one-offer confirmation, which nothing linked to once K5 ordered the cart.
   - **Also dropped:** K5's "Second Bite không thu hoa hồng" and "Phí bên thứ ba · Không có" lines (the owner, 21 October 2026).
