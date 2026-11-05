# Buyer discount: promotions an admin runs

The two-week support programme (the [chat of 31 October](../../../brief/meetings/2026-10-31-support-programme.md)) pays buyers 10,000 VND off a new customer's first order and 5,000 VND off each later one. Collecting it in person by hand cannot be counted or settled with the stores, so the discount is taken by the app when the order is placed. The founder's team asked to run several such programmes, each edited by an admin, not coded.

## Decisions

Decided with the user on 31 October 2026, each against how Medusa, Spree and Saleor do it (code read in `.tmp/`, the admin screens in `.tmp/medusa-dashboard` and `.tmp/saleor-dashboard`):

1. **A promotion is a programme with offers inside it.** The promotion holds the name, the time it runs, the stores it applies to, a budget and a limit per phone number and day, as Medusa's campaign holds dates and a budget (`packages/modules/promotion/src/models/campaign-budget.ts`). Each offer inside it, a *rule*, is conditions and a reward, as Medusa's promotion has rules and an application method, Spree's promotion has rules and actions (`spree/core/app/models/spree/promotion.rb`) and Saleor's promotion has rules with a reward (`saleor/discount/models.py`).
2. **Conditions are fixed building blocks, all of which must hold.** A condition is an attribute, an operator and values, as Medusa's `promotion-rule.ts`: the customer is new or returning; the store is or is not one of a list; the order's dishes cost at least or less than an amount. All must hold, as Medusa's "AND" and Spree's `match_policy: all`; Saleor joins its conditions with OR, which is not taken. No free-form rule.
3. **The reward is a fixed amount or a percentage of the order's dishes, with a cap for a percentage**, as Medusa's `ApplicationMethodType` and Saleor's `RewardValueType`; it is taken off the whole order (one store's order).
4. **One promotion per order, the largest discount.** Of the rules that match, across every promotion running for the store, the order takes the one that takes the most off, as Saleor's `get_best_rule` (`saleor/discount/utils/promotion.py:272`). Discounts never add up.
5. **A new customer is a phone number with no order handed over**, as Spree's `FirstOrder` counts completed orders only (`spree/core/app/models/spree/promotion/rules/first_order.rb`). An order cancelled or refused does not make a customer returning.
6. **The budget is money and stops the promotion.** Budget used is the discount of the orders still to collect and of those handed over; when what is left is less than an order's discount, that order is not discounted, as Medusa's campaign budget of type `spend`. An order cancelled, refused or expired gives its discount back, since the store did not collect less.
7. **At most N discounts per phone number and day per promotion** (1 in the programme; 0 for no limit), counted the same way, as GrabFood and ShopeeFood vouchers limit "1 lần/ngày" (public, not verified in code); Medusa limits per customer over the whole campaign (`use_by_attribute`), which does not fit 5,000 VND off every later order.
8. **The amount shows on the order only after it is placed.** Showing before placing whether a number gets 10,000 or 5,000 would tell anyone who types a number whether that person has bought before; the cart shows the running promotions' amounts, the order the discount it took.
9. **Second Bite pays the stores back.** A store collects the order's dishes less the discount; admins see, per store and week, the discount of the orders handed over, and mark it paid once transferred outside the app.
10. **Changes apply to orders placed after them.** An order keeps the promotion, the rule and the discount it was placed with.

## Domain

The discount belongs to the order: it is decided in the transaction that places the order, and what counts against the budget and the daily limit is read from the orders' states, which `order` owns. So the promotions are tables of the `order` module (`order_promotions`), not a module of their own: a separate module would need the order's states back to count its budget, a cycle (conventions: prefer fewer modules while the evidence is incomplete).

- **Promotion**: name, start and end, all stores or a list, budget in VND, discounts per phone and day, enabled, rules.
- **Rule**: name, conditions, reward (fixed VND, or a percentage with a cap).
- **Discount of an order**: the promotion, the rule's name, whether the customer was new, and the amount, copied when placed.
- **Payout**: a store, a week (Monday, Vietnam time), when it was marked paid and by whom.

Placing locks the promotions running for the store (`FOR UPDATE`, in order of identifier), after the offers and the seller, so two orders never take the same last part of a budget, and an admin's change waits for them.

## The programme's figures (step 4, SEC-200)

Decided on 5 November 2026: the stores' rewards and the programme's targets are read from the admin's report (SEC-80, SEC-192) over the days the admin chooses, not from a page of their own. The programme lasts 14 days and has about 15 stores. The team works the rewards out from the numbers and checks the Facebook or Zalo introduction by eye, so the server holds no reward. The rules, against the sponsor's message of 31 October 2026:

1. **A day posted** is a collection day in Vietnam on which the store has at least one post, whatever became of it, as the report already counts posts. Reward: "posting on at least 10 of the 14 days".
2. **A full day** is a day posted with at least 7 portions posted that day. Reward: "7 to 10 portions a day". The upper figure is what the sponsor expects, not a limit. 7 is the programme's figure, kept as a constant of the report beside its rule.
3. **Portions sold** are the portions of the orders handed over (`unitsCollected`): the customer pays at the counter on handover, so an order held and never collected sells nothing. Rewards: "about 50 portions over the two weeks" and "the store that sells the most portions each week". The admin chooses Monday to Sunday and sorts the stores by it. A tie is shown as it is, and the team decides.
4. **A customer** is a phone number with an order handed over whose collection day is in the range, as new customers are told apart by phone (SEC-192). **A returning customer** is one of them who had orders handed over on at least two different collection days up to the range's end, earlier days included. This follows Shopify's returning customer rate, customers of the period who have ordered more than once (its help centre's definition, not read in code). Days, not orders, so that one checkout across two stores is one purchase. Target: "at least 30% of customers buying a second time". Both are the site's, whatever store is chosen, like new users.

The screen adds three columns to the stores' table ("Ngày đăng", "Ngày đủ 7 phần", "Phần đã lấy") and a card "Khách mua lại" with its share. The CSV adds the same three columns, filled on a total row per store after the site's total, and the customers and returning customers on the site's total.

## Out of scope

Codes a customer types, discounts on one dish, gifts, buy X get Y: none of the team needs them; a reward type or a condition attribute is added when one does. Paying the stores in the app.
