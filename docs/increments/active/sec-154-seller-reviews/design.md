# SEC-154 — The store's reviews for its sellers: design

Status: started on 26 October 2026. Tracked in Linear as SEC-154. The screens are Figma `Q1b-3` (web 1440) and `Q1b-4`, `Q1b-5` (phone 390), in the sections "Chủ quán · Web 1440" and "Chủ quán · Mobile 390". The reviews belong to the `order` module ([spec](../../../specs/order.md)), where SEC-97 stores them and SEC-145 lets admins hide them.

## What a seller can do

- On the store's home, under Bài đăng and Danh mục, read a card "Đánh giá của quán": the mean stars, how many reviews, the latest review, and "Xem tất cả" to open the page of reviews. The card does not follow the day shown above it, since a review does not expire with a post.
- On the page "Đánh giá của quán" (a pushed screen on a phone: a back button, no bottom bar), read the mean stars, how many reviews give each number of stars, and the list, the latest first: stars, the customer's name, the dish and the day, the comment and the tags. Four cells filter the list: all, 5 stars, 4 stars, 3 stars or fewer; the choice is in the address.
- A store with no review yet sees a line saying so, and no mean.

## Decisions

- **Reviews are read by store, not by post.** A review is named by its order (`order_reviews.order_id`), and an order belongs to one seller. A post is gone by the end of its day; the store stays.
- **The customer's name is shown whole.** The seller already reads it, with the phone number, on the order the review belongs to; hiding it here would protect nothing.
- **The same queries serve admins and sellers.** `ReviewsForAdmins` and `CountReviewsByStars` already take a seller, stars and a visibility; the seller's list fixes the seller to the path's and the visibility to `visible`. A review an admin hid (SEC-145) leaves the seller's reads, as SEC-145 decided for every read but the admins'.
- **Stars are a list, as for admins.** "3 stars or fewer" is `stars=1&stars=2&stars=3`; no new parameter.
- **The numbers are measured** (the Honest Number Rule): the mean is of the shown reviews, absent when there are none.
- **The dishes come from the order's lines**: their names, joined by commas (a cart holds several dishes of one seller). A review whose order has no line reads without a dish.

## Contract

| Call | Who | Answers |
| --- | --- | --- |
| `GET /sellers/{sellerId}/reviews?stars=&page=&size=` | The seller's people; admins | `200 {items, page, pageSize, total, counts, average?}`: each item the order's identifier and number, the customer's name, the dishes' names, the stars, tags, comment and when rated; `counts` has each number of stars of the shown reviews, whatever `stars` asks; `average` the mean of the shown reviews of the stars asked |

Failures: `404 SELLER_NOT_FOUND` for a store the caller may not read (the answer sellers already give), `400 ORDER_REVIEW_LIST_INVALID` for stars outside 1 to 5 or a page out of range.

## Data

No migration. The list reads `order_reviews` joined to `order_orders`, and the dishes' names from `order_lines`.

## Failure behavior

A page past the end is empty. A seller whose store was blocked still reads its reviews, like its orders.

## Verification plan

- Go: the list for a member, a stranger and an admin; stars, paging, the mean, a hidden review left out; the contract file current.
- Web: the card on the home, the page, the filter in the address, the empty state; the browser test with axe runs on CI.

## Not here

- Replying to a review, reporting one, a public mean on the customer's store page (it can read `average` later).
- The mobile client: generated again with the contract by whoever has Flutter.
