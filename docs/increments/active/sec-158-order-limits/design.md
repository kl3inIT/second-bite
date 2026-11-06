# Order limits

Status: design, decided with the user on 6 November 2026. Tracked in Linear as SEC-158. It changes `order` ([spec](../../../specs/order.md)) and `offer` ([spec](../../../specs/offer.md)).

## The problem

Ordering needs no account and no verified phone number (SEC-76). One order takes up to 999 units of each of ten dishes (`server/internal/order/place.go`), and nothing counts what one person holds. The only cap is SEC-160's: 60 orders from one address in ten minutes, which stops a flood but not one order that takes a whole store's stock. The sponsor's sheet (persona C4) asks for a cap so that mall staff do not take everything before the cleaners and guards come.

## Decisions

- **No phone sign-in.** A verified number needs an SMS or Zalo contract and money (SEC-30, after the pilot).
- **An address is a weak key.** Customers behind the mall's Wi-Fi or a carrier's CGNAT share one public address, and turning mobile data off and on gives a new one. So the address gets a loose cap, and the rules that matter count units and phone numbers.
- **Three layers**, chosen by the user:
  1. **Units per dish in one order.** The store sets "at most N per order" on each post. A post left without one uses the admin's default, 5 to start. The store's value wins, above or below the default: it knows its dishes and buyers ("admin đặt trần mà quán đặt cao hơn thì cần theo ý quán").
  2. **Open orders**, those confirmed or ready whose window is not over. At most 2 per phone number at one store, and at most 20 from one address across stores. A phone number that missed 2 orders in the last 7 days cannot order until the older of those leaves the 7 days, so the block lifts by itself. A missed order is what the admin's account page already counts (SEC-75): its window ended with no hand-over, or the store refused it as no answer, no show or late. A refusal as suspected (below) counts too. A window counts in the days it ended in, and a refusal in the days it was made, so a suspected order stops the number at once rather than when its window ends.
  3. **A warning to the store, which decides.** An order is large when one of its lines, of 2 units or more, reaches that dish's cap or takes more than half the units posted. It is confirmed at once like any other. The store sees it marked on its list and its page, with how many open orders the phone number holds at the store and how many it missed in the last 7 days, and a button to call. A store that suspects it refuses it as "Nghi đặt ảo", and the units go back on sale.
- **Ruled out: the store confirming each large order before it holds** (asked by the user, then dropped). A guest leaves only a name and a phone number, so the store would have to phone, at closing time when it is busiest. The units would stay held while it waits, and a deadline would cancel real customers whenever the store is busy. It also reverses SEC-15's decision that an order is confirmed when placed.
- **Every number is an admin setting.** The default cap sits with the offer settings, since `offer` serves each post's cap. The open-order and missed rules sit in new order settings. One admin page, "Đặt món", holds both.
- **The address is kept only while the order is open.** It is written on the order when placed and emptied when the order is handed over, cancelled, refused or expired. It is never logged or shown, not even to admins.

## What a person can do

- **A customer** sees "Tối đa 5 suất mỗi đơn" under a dish that has a cap, and the stepper stops there. An order over a limit is refused in the server's words, Vietnamese or English:
  - over a dish's cap: "Món này chỉ được đặt tối đa một số suất mỗi đơn. Giảm số suất rồi đặt lại.";
  - two open orders at the store: "Số điện thoại này đang có đơn chưa lấy ở quán. Lấy hoặc huỷ đơn đó rồi đặt tiếp.";
  - twenty open orders from the address: "Mạng bạn đang dùng có quá nhiều đơn chưa lấy. Thử lại sau.";
  - missed orders: "Số điện thoại này đã bỏ không lấy nhiều đơn gần đây nên tạm chưa đặt được. Thử lại sau vài ngày.".
- **A store** sets "Tối đa mỗi đơn" when posting or editing a post, or leaves it empty for the default. On its orders it sees "Đơn lớn" and, for any order whose phone number holds more than one open order at the store or missed one, a line such as "Số này: 2 đơn đang giữ · bỏ 1 đơn trong 7 ngày", with "Gọi khách". It refuses with "Nghi đặt ảo".
- **An admin** changes the five numbers in Cài đặt › Đặt món, each change recorded in the audit trail.

## Contract

- `POST /sellers/{sellerId}/offers` and `PATCH /offers/{offerId}` take `maxPerOrder`, 1 to 999, optional; `0` in a change takes it away. It may change after units are ordered. An offer answers `perOrderMax`, the cap that applies, its own or the default, and `maxPerOrder` when the store set one. A change applies to orders placed after it. `offer.Take` refuses more units than the cap with `OFFER_OVER_ORDER_LIMIT`, in the same conditional update that takes them, which `order` answers as `ORDER_OVER_DISH_LIMIT`.
- `GET /admin/offer-settings` and `PUT` gain `defaultMaxPerOrder`, 1 to 999.
- `GET /admin/order-settings` and `PUT` with `If-Match`, as the offer settings work: `{openPerPhonePerSeller, openPerAddress, missedLimit, missedDays}`, recorded in the audit as `order_settings.change`.
- An order answers its seller's people and admins `large`, and on its page and the seller's list `phone: {open, missed}`: the phone number's open orders at the store, this one included, and its missed orders in the last `missedDays`. Its customer reads `large` false and no `phone`.
- `POST /orders/{orderId}/refuse` takes the reason `suspected`; the units go back to their offers.
- `POST /orders` answers:

| Code | Status | When |
| --- | --- | --- |
| `ORDER_OVER_DISH_LIMIT` | 409 | A line holds more units than the dish's cap |
| `ORDER_PHONE_HOLDS_ORDERS` | 409 | The phone number already holds `openPerPhonePerSeller` open orders at the store |
| `ORDER_ADDRESS_HOLDS_ORDERS` | 429 | The address already holds `openPerAddress` open orders |
| `ORDER_PHONE_MISSED_ORDERS` | 403 | The phone number missed `missedLimit` orders in the last `missedDays` |

An earlier order sent again with the same `Idempotency-Key` still answers that order, before any of these checks.

## Data

- `offer_offers.max_per_order`, null or 1 to 999.
- `offer_settings.default_max_per_order`, 1 to 999, 5 to start.
- `order_settings`, one row: `open_per_phone_per_seller` (2, from 1 to 20), `open_per_address` (20, from 1 to 500), `missed_limit` (2, from 1 to 20), `missed_days` (7, from 1 to 60), who changed them and when.
- `order_orders.large` (false for every order placed before) and `order_orders.placed_from` (the address as text, null once the order is handed over, cancelled, refused or expired; an order reopened after that is no longer counted by address). Partial indexes on the open orders by seller and phone number and by address, and an index on a phone number's orders by the end of their window.
- Migrations `0047_offer_add_max_per_order` and `0048_order_add_limits`; `0048` also lets `refuse_reason` be `suspected`.

## Failure behavior

- The checks run inside the placing transaction, after an advisory lock on the phone number and then on the address, so two orders placed at once from one phone number cannot both pass the cap.
- An order placed outside a request (a test of the service) has no address and is not counted by address, as SEC-160's limiter does.
- A store's cap lower than the units already in a customer's cart refuses the order with `ORDER_OVER_DISH_LIMIT`; the web reads the offer again and lowers the stepper.

## Verification

- `TestOrder`: a line over its cap, the store's cap over the default, two open orders by phone at one store and none at another, the address cap, missed orders blocking and the block lifting after the days, `suspected` returning units and counting as missed, `large` at the cap and at more than half, the counts answered to the store and not to the customer, two orders placed at once by one phone number.
- `TestOffer`: `maxPerOrder` posted, changed, taken away, and the default answered.
- The settings: validation, `412` on a stale version, the audit change.
- Web: `pnpm check` and end-to-end specs for the stepper, the post's field, the store's warning and refusal, and the admin page.
- On the local stack against the real server: each refusal and the store's warning, shown to the user with screenshots.

## Open questions

None.
