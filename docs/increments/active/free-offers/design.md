# Free offers: food a store gives away at 0 đồng

Status: in review, 21 November 2026. Linear issue: none yet; to be opened and linked by the member who directs this work.

## What a person can do

- **A store** posts a dish at 0 đồng: in the post drawer it picks **Miễn phí** under the discounts, keeps the dish's original price, and posts. The pilot at Tasco Mall on 22 November 2026 has stores give meals to the mall's cleaners and guards this way.
- **A customer** sees **Miễn phí** wherever a price or a total is shown (cards, the dish, the cart, checkout, their orders and an order's page, the chat), reserves the dish as any other, and collects it at the counter; the store hands it over as any other order.
- **An admin** sees the same word on the lists and pages of offers and orders.

## Decisions

1. **0 đồng is the only price under 1,000 đồng.** A paid price keeps its floor of 1,000 đồng, so a mistyped 500 is still refused (`OFFER_DETAILS_INVALID`); the contract says `minimum: 0` because a schema cannot say "0 or at least 1,000", and the service refuses 1 to 999.
2. **A free offer keeps its original price**, above 0 (`originalPriceVnd` now from 1 in the contract): it is what the food is worth, shown struck through, and what food saved is measured by. The minimum discount never refuses it, since 0 is 100% below any original price.
3. **An order of free food is an ordinary order at a total of 0.** Placing, the limits, making ready, handing over, taking back and the reports work unchanged; a promotion never applies (its discount is capped by the total, 0), so `payVnd` is 0 too.
4. **"Miễn phí" replaces "0đ" for prices and totals only.** Sums that are not a price stay "0đ": takings in the reports and on the store's home, budgets and payouts of promotions, discounts and savings. The web has `formatCost` and `usePrice` beside `formatPrice` (`web/src/features/offers/`), the app `formatCost` beside `formatPrice`; the word is `Price.free` on the web and `priceFree` in the app, in Vietnamese and English.
5. **Sentences that say "paid" read differently for a free order**: "nhận miễn phí" for "đã trả {total}" and "nhận tại quầy" for "trả khi nhận" (ICU `select` on `free`).
6. **The dish catalog is unchanged**: a dish's optional original price keeps its floor of 1,001 đồng; it is only where a post starts from.

## Data

Migration `0050_offer_order_allow_free.sql` relaxes three checks: `offer_offers.price_vnd` to `0 OR >= 1000`, `order_lines.price_vnd` and `order_orders.total_vnd` to `>= 0`. Nothing is converted. The previous release runs against the relaxed checks, so a rollback of the code needs no restore; the migration's Down puts the old checks back `NOT VALID`, keeping the free offers and orders made meanwhile.

## Failure behavior

A paid price of 1 to 999 đồng: `400 OFFER_DETAILS_INVALID`. A free offer without an original price above 0: `400 PLATFORM_REQUEST_INVALID` (the schema). The web form refuses the same before sending.

## Verification plan

The HTTP-boundary check `TestService` › a free offer is reserved and handed over at 0 đồng (`server/cmd/secondbite/free_offer_test.go`) against PostgreSQL with PostGIS; web unit tests for `formatCost` and the free price in `post-draft.ts`, and the Playwright test that posts a dish as Miễn phí; the app's tests for `formatCost` and a free order's card.
