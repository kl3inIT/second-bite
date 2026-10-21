# SEC-76 — The web's customer flow end to end: design

Tracked in Linear as SEC-76, under SEC-51. Plan: [plan.md](plan.md).

## Outcome

A customer goes from the home to collecting their order on the web. SEC-49 built the browsing and the cart up to the confirmation (K5). SEC-51 (PR #26) builds the order pages on SEC-15's order API (PR #25). This increment joins the two and adds only the Figma "Mobile · Khách" screens that neither has.

## What exists and what is missing

Against Figma sections 4, 5 and 10, as of 21 October 2026:

| Figma                                                                       | Where it is                                                                      |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| L1–L4, signing in by email code or Google                                   | `main` (SEC-29, SEC-56), the `/sign-in` page                                     |
| L5, the sign-in sheet at "Đặt món"                                          | Missing: this increment                                                          |
| L6, the display name on a first order                                       | Missing: this increment, on `PUT /accounts/me` (SEC-61)                          |
| K6 / O1, O2, O3, O5, O6, K8 / O8: the order, its code, cancelling, the list | SEC-51                                                                           |
| K5 ordering the cart's lines                                                | Missing: once SEC-51 is on `main`; `POST /orders` takes 1–10 lines of one seller |
| O7, the portions ran out at "Đặt món"                                       | Partly in SEC-51 (its "gone" problem); its own screen is missing                 |
| O4, someone else collects; K6b, stars once collected                        | No API field yet; not built                                                      |

## Decisions

1. **SEC-51 is reused, not merged here yet.** SEC-51 carries SEC-15's backend, which conflicts with `main` (two `0011` migrations, regenerated sqlc). Those belong to SEC-51's owner. Until SEC-51 is rebased onto `main`, this branch builds what needs no order API: L5 and L6.
2. **L5 is the sign-in form in a sheet over K5.** "Đặt món" signed out opens a bottom sheet titled "Đăng nhập để đặt món", which says the cart is kept. It holds the same form as `/sign-in`: Google, or an email and its code. Signing in comes back to `/cart?continue=1`, which takes the next step by itself. The cart is in `localStorage` (SEC-49 decision 7), so it survives the sign-in.
3. **L6 asks the name only while the account has none.** An account's display name is empty until Google fills it or its owner sets one (identity spec). "Đặt món" signed in with no name opens "Quán gọi bạn là gì?", saves through `PUT /accounts/me`, then goes on. With a name it is never asked; the name is changed in account settings.
4. **"Đặt món" with a name still sends nothing** until K5 joins SEC-51's ordering. It says so, as SEC-49 left it.
