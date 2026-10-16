# How Sharing Excess measures food rescued

Studied on 17 October 2026 as input to SEC-7 (what is measured before and during the pilot) and to the `offer` design (SEC-11).

## The source

[Sharing Excess](https://sharingexcess.com) is a non-profit in Philadelphia that moves surplus food from farms, wholesalers and retailers to food banks and other community organizations. Its first application, `sharingexcess/food_rescue_app` on GitHub, no longer exists: the address answers 404. Its organization's profile (updated August 2026) says the platform, "Surplus", now lives in a monorepo `sharingexcess/sharingexcess`, which is not public. The code could not be read.

What is public is its documentation, [docs.sharingexcess.com](https://docs.sharingexcess.com). It is a single-page application, so its pages were read from the Markdown bundled in its scripts: *Impact measurement*, *Terminology* and *Domain model*.

Sharing Excess is logistics between organizations: drivers collect from donors, sort at warehouses ("hubs") and deliver to recipients. It is not a marketplace and sells nothing, so its routes, hubs and inventory are not a model for Second Bite. Its way of measuring is.

## How it measures

- **Weight is the base of every measure**, in pounds, recorded at each step: collected, sorted, distributed.
- **Only food that reached a recipient counts.** Food collected but still in a warehouse, or sent to a staging partner, is left out of the headline numbers, so nothing is counted twice.
- **Every measure is derived from weight by a published factor**, with its source:

| Measure | Formula | Source |
| --- | --- | --- |
| Meals made possible | weight ÷ 1.2 lb (0.54 kg) | Feeding America |
| Retail value | weight × a price per pound per category ($1.81 produce to $7.67 prepared food) | ReFED conversion factors, adjusted by USDA food prices |
| Fair market value | weight × $1.92 | Feeding America's valuation study |
| Emissions prevented in landfill | weight × a factor per category (0.25 to 1.09 lb CO₂e per lb) | EPA WARM v16 |
| Emissions of production kept in use | weight × 3.66 lb CO₂e per lb | EPA WARM v16 |
| Waste cost saved | weight × $0.05 | Their partners' average |

- **Categories exist for the factors**: fresh produce, dairy, bakery, meat and fish, non-perishable, prepared and frozen, mixed, other. A pound of bread kept from landfill prevents four times the emissions of a pound of produce.
- **Composted food counts for the environment, not for people**: it counts toward weight, emissions and waste cost, not toward meals or value.
- Their glossary names the states of an item of inventory: `active`, `allocated` (reserved for a delivery, not yet moved), `distributed`, `composted`. A cancelled event releases what it had reserved.

## What Second Bite can take

- **Count what was collected, not what was offered.** The measure of food saved is the units of collected orders. Units offered, ordered and expired are recorded too, as the [pilot domain model](../increments/active/sec-6-pilot-domain-model/design.md) already assumes (assumption 9), but they are not food saved.
- **An offer needs a weight per unit and a category from a fixed list** for any measure beyond units. The domain model keeps the weight optional; Sharing Excess shows that every measure people understand (meals, value, emissions) is derived from weight and category. Whether the weight becomes required is a question for the `offer` design.
- **A measure states its formula and its source.** The pilot's report to the sponsor can publish its factors as Sharing Excess does, rather than a number without a method.
- **The factors are American.** Feeding America's meal, USDA prices and EPA's landfill model describe the United States. Before the report uses one, a Vietnamese or international source is looked for (for example, a published factor for landfills in Vietnam); until then, units and kilograms are reported without conversion.

## What it does not answer

Sharing Excess reports food moved, not waste reduced: it has no baseline of what its donors threw away before. The question SEC-7 keeps for the founder (what is measured before the pilot, by whom, per seller and per kind of food) is not answered by this source.
