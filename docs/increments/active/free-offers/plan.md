# Free offers: plan

The [design](design.md) holds the decisions. One pull request, for the Tasco Mall pilot of 22 November 2026.

| Step | What | State |
| --- | --- | --- |
| 1 | Server: the price rule, migration 0050, the contract (`priceVnd` from 0, `originalPriceVnd` from 1) and the HTTP-boundary check | Done |
| 2 | Clients generated again: web (`pnpm generate:api`) and app (`swagger_parser`, `build_runner`) | Done |
| 3 | Web: Miễn phí in the post drawer, and in place of 0đ on every price and total; messages in both languages; tests | Done |
| 4 | App: Miễn phí in place of 0đ on every price and total; the app posts no offers; tests | Done |
| 5 | Specs and test matrices of `offer` and `order` | Done |
| 6 | Staging after the merge; checked with a free post, a reservation and a hand-over | To do |
