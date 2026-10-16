# How comparable products model an offer

Studied on 17 October 2026 for the `offer` module (SEC-11). The repositories were cloned into the git-ignored `.tmp/` for the [pickup models](2026-10-16-open-source-pickup-models.md) note and read again, not run; paths are relative to each repository. Too Good To Go is closed: its help centre refused automated reading (HTTP 403 and 429), so what is said of it comes from search summaries of the pages linked, and is read again by hand before a rule depends on it.

| Source | What it offers | Revision |
| --- | --- | --- |
| foodsharing, `src/Modules/Basket`, `FoodSharePoint` | Food baskets given away by individuals; public fridges people follow | `c4ab5f1` |
| Karrot, `karrot/offers`, `karrot/activities` | Items given away inside a group; activities announced ahead that people join | `b7a4e54` |
| Umi Feeds backend and app | Donations of dishes collected by a volunteer | `07e29de`, `aa8c7ed` |
| Open Food Network | Products with stock, sold in order cycles with pickup | `6d906ac` |
| Too Good To Go | Surprise Bags sold by shops for collection in a window | Help centre and press, October 2026 |

## What none of them has

No open-source project models what Second Bite sells: a count of units at a price per unit, with an original price, collected in a window of hours. foodsharing and Karrot give things away and let the owner choose among requests in chat; Umi Feeds lets one volunteer claim a donation; Open Food Network has stock and prices but sells planned produce in cycles of days, without an original price. The sale itself is Second Bite's design.

## Findings

**Content**

- foodsharing: free text, any number of photos, an optional weight (0 to 100 kg), a location, a lifetime of 1 to 21 days chosen once (`DTO/Basket.php:20-58`). Its category tables were dropped as unused (`migrations/20260620112307_drop_unused_tables_and_columns.php`).
- Umi Feeds: a dish has a cost, a weight and a list of allergens; a donation has lines of dish and quantity, one photo and a pickup window with a start and an end (`src/models/User/Dishes.ts`, `DonationForms.ts`).
- Open Food Network: price, unit value and unit name on the variant, one category (`primary_taxon`), properties as free name and value pairs (no structured allergens), images in png, jpeg, gif, svg or webp resized to four sizes, with no size limit (`app/models/spree/variant.rb:39-106`, `image.rb:4-11`).
- Too Good To Go: a category (bakery, meals, groceries), a vegetarian or vegan flag, a price shown against its retail value, a pickup window; it promises nothing about allergens because a bag's contents vary ([help](https://tgtg.zendesk.com/hc/en-us/articles/28997927757714-Why-can-t-I-know-what-s-inside-a-Surprise-Bag)).

**Stock**

- Open Food Network checks `on_hand >= quantity` under `SELECT … FOR UPDATE` on the variants in identifier order, again at submit, and holds `count_on_hand >= 0` in the database (`app/services/order_locker.rb:13-31`, `app/models/spree/stock_item.rb:12`). Cancelling puts the units back (`shipment.rb:213-215`).
- Karrot checks an activity's capacity under `select_for_update` when someone joins (`activities/api.py:377`).
- foodsharing has no count and no lock.

**Time**

- foodsharing filters expired baskets in every query (`until > NOW()`) and soft-deletes them with a daily job (`BasketGateway.php:284,414`, `MaintenanceService.php:166`).
- Karrot moves activities to started, done and missed with a job every minute (`activities/tasks.py:183`).
- Open Food Network refuses a checkout once the cycle has closed and empties the cart (`concerns/order_stock_check.rb:23-39`); its pickup time is free text, enforced by nothing (`db/schema.rb:293`).
- Too Good To Go: shops keep a weekly schedule of bags with one-off exceptions; a shop may cancel up to an hour before pickup, or later when it has nothing left, and the customer is refunded and told at once; customers cancel up to two hours before the window; nothing is refunded to someone who does not come ([terms](https://www.toogoodtogo.com/en-us/legal/terms-and-conditions-using-the-app), [no bags](https://tgtg.zendesk.com/hc/en-us/articles/36814654053010-Customer-arrives-with-no-Surprise-Bags-available), [not collected](https://tgtg.zendesk.com/hc/en-us/articles/27684120279186-What-happens-if-I-don-t-collect-my-Surprise-Bag)).

**Changes after publishing**

- foodsharing lets the owner change everything but the lifetime; Karrot refuses to move an activity in a series and tells participants removed by an edit, with a reason (`activities/serializers.py:587-593,725-739`).
- Open Food Network copies price, names and weight onto the order line, so a later change does not alter placed orders; a product with orders is soft-deleted and stays linked to them (`line_item.rb:107-122`, `product.rb:272-280`).

**Finding and following**

- foodsharing searches a bounding box, then the exact distance; 30 km by default, 50 km at most, the person's home as the fallback (`BasketGateway.php:375-428`, `BasketRestController.php:36,72-84`).
- foodsharing's followers of a public fridge choose email or an in-app bell (`FoodSharePointGateway.php:201-225`); Karrot members opt in to an email for every new offer (`offers/tasks.py:10-22`).
- Too Good To Go keeps sold-out bags visible and lets customers mark a shop as a favourite, to be told when bags appear ([how the app works](https://www.toogoodtogo.com/en-gb/how-does-the-app-work)).

## What Second Bite can take

- Units under a row lock, checked and decremented in one transaction, with `units_left >= 0` held by the database; units return on cancellation (Open Food Network, Karrot).
- A collection window with a start and an end, enforced: no order once it has closed (Umi Feeds' structure, Open Food Network's counter-example).
- Expiry in the query, with a job as a sweep, not the job alone (foodsharing).
- The order copies the offer's price, name and window; an offer with orders is never deleted, only withdrawn (Open Food Network).
- Sold-out offers stay visible; favourites and alerts come later (Too Good To Go).
- A shop withdrawing its offer cancels the orders at once and tells the customers (Too Good To Go; the [pilot domain model](../increments/active/sec-6-pilot-domain-model/design.md)).
- A weight per unit and a category from a fixed list for measuring food saved ([Sharing Excess](2026-10-17-sharing-excess-impact.md)).

What does not transfer: the owner choosing among requests (a sale is first come, first served), lifetimes in days, a phone number on the listing, and free-text states.
