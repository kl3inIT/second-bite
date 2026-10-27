# SEC-145 — Every review for admins, hidden and shown again: design

Status: started on 22 October 2026. Tracked in Linear as SEC-145. The screens are Figma AD-DG1 to AD-DG3 (section "Quản trị · Web 1440", row 8), redrawn on 22 October 2026 on the admin lists' common form. The rules are SEC-75's ([design](../sec-75-admin-foundation/design.md)); the reviews belong to the `order` module ([spec](../../../specs/order.md)), where SEC-97 stores them.

## What an admin can do

- Open "Đánh giá" from the menu and see every customer's review, the latest first, 25 to a page by default, each with its store, the customer's name, the comment on one line, the order's number, the stars, whether it shows and the day it was given.
- Read three cards: the mean stars of the reviews shown, how many give one or two stars, and how many are hidden; the last two filter the list.
- Narrow the list by words (the comment, the order's number, the customer's or the store's name, marks ignored), by stars, by store and by the day of the review; every choice is in the address.
- From a row's menu: open the order; hide a review, with a reason of up to 500 characters that is optional and kept in the audit only; show a hidden review again. Each ends with a notice and the list read again.

## Decisions

- **A review is named by its order.** An order has one review at most (`order_reviews.order_id` is its key), so the actions take the order's identifier and no new identifier is made.
- **Hiding is silent and whole, as Facebook does it** (the user, 22 October 2026). A hidden review leaves every read but the admins': the customer's own order, the seller's people's, any later average. The customer is not told and cannot rate the order again. Showing it brings it back everywhere.
- **The customer's form needs to know an order was rated.** Without the review in the order, the customer's page would offer the form again, and the server would refuse it as `ORDER_ALREADY_REVIEWED`. `OrderBody` gains `canReview`, true only while the order is collected and has no review, hidden or not; the web reads it instead of `status === "collected" && !review`.
- **The reason is optional** (the user, 22 October 2026): hiding is the admin's call on content, and nobody is emailed. When given, it has at most 500 characters and is kept in the audit event.
- **Every hide and show is audited** (SEC-75: every admin change is recorded), as `review.hide` and `review.show` on a resource of the new type `order`, labelled with the order's number. The log's filter and its chips name them.
- **The numbers are measured** (DESIGN.md's Honest Number Rule): the mean is of the reviews shown that match the filters, absent when there are none; the cards carry no line of days, since nothing counts reviews by day.
- **The common form of the admin lists** (SEC-62, PR #129): `DataTable` with its fixed columns and the row's menu, `ListFooter`, `nuqs` for the address, `AlertDialog` to show again, `Dialog` with a `Textarea` to hide.

## Contract

| Call | Answers |
| --- | --- |
| `GET /admin/reviews?stars=&q=&sellerId=&visibility=&reviewedSince=&reviewedUntil=&page=&size=` | `200 {items, page, pageSize, total, counts, average?}`: each item the order's identifier and number, its seller's identifier and name, the customer's name, the stars, tags, comment, when rated, and when hidden with the reason; `counts` has each number of stars and the hidden, matching the other filters; `average` the mean stars of the shown ones matching the filters |
| `POST /admin/reviews/{orderId}/hide` `{reason?}` | `200` the review; `409 ORDER_REVIEW_ALREADY_HIDDEN` |
| `POST /admin/reviews/{orderId}/show` | `200` the review; `409 ORDER_REVIEW_NOT_HIDDEN` |

`404 ORDER_NOT_REVIEWED` for an order without a review, `400 ORDER_REVIEW_REASON_INVALID` for a reason over 500 characters, `400 ORDER_REVIEW_LIST_INVALID` for a list asked wrongly. `OrderBody` gains `canReview`.

## Storage

One migration adds `hidden_at`, `hidden_by` and `hidden_reason` to `order_reviews`, and an index on `created_at` for the list. Forward-only, since staging holds data.

## Not here

- The customer's account from a review: an order does not carry its customer's account to admins yet; a panel with it is drawn later.
- A store's public mean of stars, a seller's reply, customers reporting a review.
- The mobile client: generated again with the contract by whoever has Flutter.
