# Order limits

Status: built on 6 November 2026, proved on the local stack, then trimmed in Đạt's review of 8 November 2026; in pull request #212. Decided with Tuấn on 6 November 2026 and with Đạt on 8 November 2026. Tracked in Linear as SEC-158. It changes `order` ([spec](../../../specs/order.md)) and `offer` ([spec](../../../specs/offer.md)).

## The problem

Ordering needs no account and no verified phone number (SEC-76). One order takes up to 999 units of each of ten dishes (`server/internal/order/place.go`), and nothing counts what one person holds. The only cap is SEC-160's: 60 orders from one address in ten minutes, which stops a flood but not one order that takes a whole store's stock. The sponsor's sheet (persona C4) asks for a cap so that mall staff do not take everything before the cleaners and guards come.

## Decisions

- **No phone sign-in.** A verified number needs an SMS or Zalo contract and money (SEC-30, after the pilot).
- **An address is a weak key.** Customers behind the mall's Wi-Fi or a carrier's CGNAT share one public address, and turning mobile data off and on gives a new one. So the rules count units and phone numbers, and no limit counts open orders by address (Đạt, 8 November 2026): none of the products compared does, it would refuse real customers on the mall's Wi-Fi at a busy hour, and SEC-160 already stops floods from one address.
- **Two layers**, chosen by Đạt on 8 November 2026 after comparing Too Good To Go, OpenTable, Shopee's cash on delivery, Saleor and foodsharing (the comparison is on SEC-158):
  1. **Units per dish in one order.** The store sets "at most N per order" on each post. A post left without one uses the admin's default, 5 to start. The store's value wins, above or below the default: it knows its dishes and buyers ("admin đặt trần mà quán đặt cao hơn thì cần theo ý quán"). The store's field is optional, so it adds no work: Saleor does the same, a cap on each variant or the shop's default. No surplus-food product publishes a default; 5 lets a person buy for a group and is reviewed with the support programme's figures.
  2. **Open orders**, those confirmed or ready whose window is not over. At most 2 per phone number at one store, so the cap per dish is not passed by placing several orders (foodsharing bounds pickups per person likewise). A phone number that missed 3 orders in the last 30 days cannot order until the oldest of those leaves the 30 days, so the block lifts by itself. The count follows Shopee VN, which turns off cash on delivery after 3 failed deliveries in 90 days by its own blog; OpenTable suspends after 4 no-shows in 12 months. The window is shorter because the pilot runs only weeks. A missed order is what the admin's account page already counts (SEC-75): its window ended with no hand-over, or the store refused it as no answer, no show or late. A window counts in the days it ended in, and a refusal in the days it was made.
- **Ruled out: a warning to the store on large orders, and the refusal "Nghi đặt ảo"** (built on 6 November 2026, removed in Đạt's review of 8 November 2026). None of the products compared warns a store about a large order. It made work for the store, which had to read the warning, phone the customer and decide, and with the cap per dish and the open orders per phone number a large order can hardly happen. A store still refuses a doubtful order as no answer or no show.
- **Ruled out: the store confirming each large order before it holds** (asked on 6 November 2026, then dropped). A guest leaves only a name and a phone number, so the store would have to phone, at closing time when it is busiest. The units would stay held while it waits, and a deadline would cancel real customers whenever the store is busy. It also reverses SEC-15's decision that an order is confirmed when placed.
- **Every number is an admin setting.** The default cap sits with the offer settings, since `offer` serves each post's cap. The open-order and missed rules sit in new order settings. One admin page, "Đặt món", holds both.

## What a person can do

- **A customer** sees "Tối đa 5 suất mỗi đơn" under a dish that has a cap, and the stepper stops there. An order over a limit is refused in the server's words, Vietnamese or English:
  - over a dish's cap: "Món này chỉ được đặt tối đa một số suất mỗi đơn. Giảm số suất rồi đặt lại.";
  - two open orders at the store: "Số điện thoại này đang có đơn chưa lấy ở quán. Lấy hoặc huỷ đơn đó rồi đặt tiếp.";
  - missed orders: "Số điện thoại này đã bỏ không lấy nhiều đơn gần đây nên tạm chưa đặt được. Thử lại sau.".
- **A store** sets "Tối đa mỗi đơn" when posting or editing a post, or leaves it empty for the default.
- **An admin** changes the four numbers in Cài đặt › Đặt món, each change recorded in the audit trail.

## Contract

- `POST /sellers/{sellerId}/offers` and `PATCH /offers/{offerId}` take `maxPerOrder`, 1 to 999, optional; `0` in a change takes it away. It may change after units are ordered. An offer answers `perOrderMax`, the cap that applies, its own or the default, and `maxPerOrder` when the store set one. A change applies to orders placed after it. `offer.Take` refuses more units than the cap with `OFFER_OVER_ORDER_LIMIT`, in the same conditional update that takes them, which `order` answers as `ORDER_OVER_DISH_LIMIT`.
- `GET /admin/offer-settings` and `PUT` gain `defaultMaxPerOrder`, 1 to 999.
- `GET /admin/order-settings` and `PUT` with `If-Match`, as the offer settings work: `{openPerPhonePerSeller, missedLimit, missedDays}`, recorded in the audit as `order_settings.change`.
- `POST /orders` answers:

| Code | Status | When |
| --- | --- | --- |
| `ORDER_OVER_DISH_LIMIT` | 409 | A line holds more units than the dish's cap |
| `ORDER_PHONE_HOLDS_ORDERS` | 409 | The phone number already holds `openPerPhonePerSeller` open orders at the store |
| `ORDER_PHONE_MISSED_ORDERS` | 403 | The phone number missed `missedLimit` orders in the last `missedDays` |

An earlier order sent again with the same `Idempotency-Key` still answers that order, before any of these checks.

## Data

- `offer_offers.max_per_order`, null or 1 to 999.
- `offer_settings.default_max_per_order`, 1 to 999, 5 to start.
- `order_settings`, one row: `open_per_phone_per_seller` (2, from 1 to 20), `missed_limit` (3, from 1 to 20), `missed_days` (30, from 1 to 60), who changed them and when.
- A partial index on the open orders by seller and phone number, and an index on a phone number's orders by the end of their window.
- Migrations `0047_offer_add_max_per_order` and `0048_order_add_limits`.

## Failure behavior

- The checks run inside the placing transaction, after an advisory lock on the phone number, so two orders placed at once from one phone number cannot both pass the cap.
- A store's cap lower than the units already in a customer's cart refuses the order with `ORDER_OVER_DISH_LIMIT`; the web reads the offer again and lowers the stepper.

## Verification

- `TestOrderLimits`: a line over its cap, the store's cap over the default, two open orders by phone at one store and none at another, missed orders blocking and the block lifting after the days, two orders placed at once by one phone number.
- `TestOffer`: `maxPerOrder` posted, changed, taken away, and the default answered.
- The settings: validation, `412` on a stale version, the audit change.
- Web: `pnpm check` and end-to-end specs for the stepper, the post's field and the admin page.
- On the local stack against the real server: each refusal, shown to Tuấn with screenshots (6 November 2026, before the review trimmed the change).

## Open questions

None.
