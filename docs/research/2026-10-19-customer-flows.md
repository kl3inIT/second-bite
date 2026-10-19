# Customer flows: what Keeta, foodpanda and Zomato do (19 October 2026)

Date of research: 19 Oct 2026. Flows were read on Mobbin (iOS captures) through its search; the app pages on mobbin.com refuse unauthenticated fetches, so each flow below links to its own Mobbin page. Screenshots are not committed (third-party products). Tracked in Linear as SEC-8.

The question: which flows a customer of Second Bite walks through, from opening the app to collecting a dish, and which parts of the large delivery apps fit a pickup-first, no-commission surplus marketplace that sells by dish.

## Sources

| Source | Flow | Screens | Status |
| --- | --- | --- | --- |
| Keeta | [Ordering a food](https://mobbin.com/flows/cc60d59d-9719-400a-98db-2d1b10ffcb92) | 17 | verified |
| Keeta | [Adding an item to cart](https://mobbin.com/flows/13b158ce-d5d9-4f86-af45-4159ffbde363) | 8 | verified |
| Keeta | [Searching Keeta](https://mobbin.com/flows/a1bfe222-bc91-4b2d-bbf4-961dc79bd53e) | 5 | verified |
| Keeta | [Home](https://mobbin.com/flows/9a486f2f-465c-4695-8f27-8265867336e5) | 7 | verified |
| Keeta | [Onboarding](https://mobbin.com/flows/9e3b1a7c-9409-44db-b448-3d9b69959bea) | 11 | verified |
| Keeta | [Adding an address](https://mobbin.com/flows/5cce5f3f-6cc1-46c0-985c-cb9f81d4bed1) | 15 | verified |
| foodpanda | [Pick-up](https://mobbin.com/flows/aa038bbb-9e4e-4f3e-b1df-cbcd95e859bd) | 5 | verified |
| foodpanda | [Placing an order (pickup)](https://mobbin.com/flows/8c636502-d1e1-4c2f-b5e7-0909e6342c4d) | 13 | verified |
| foodpanda | [Completing a pickup order](https://mobbin.com/flows/72ee53af-62ef-4119-973c-b5349f4c1794) | 2 | verified |
| foodpanda | [Switching to a pickup order](https://mobbin.com/flows/33168a00-a777-4f1e-809c-f868d9aa7eb1) | 2 | verified |
| foodpanda | [Canceling an order](https://mobbin.com/flows/f981cc14-759d-4de3-862a-d7f89f168044) | 6 | verified |
| foodpanda | [Cancel an order](https://mobbin.com/flows/c1078b67-4f29-4e4d-a88f-6732673bd5fb) | 3 | verified |
| foodpanda | [Get help with orders](https://mobbin.com/flows/ed081ede-ec5e-4a70-bbfa-d590738c44a8) | 4 | verified |
| Zomato | [Searching a restaurant menu](https://mobbin.com/flows/c4861a3c-1576-4e10-b9f8-1c9456c97df6) | 3 | verified |
| Zomato | [Placing an order](https://mobbin.com/flows/80668eea-5489-46ff-95ed-061ece3e501c) | 17 | verified |
| Zomato | [Restaurant menu](https://mobbin.com/flows/b3873262-5352-4803-bb3e-7b67ceebae86) | 11 | verified |
| Zomato | [Orders](https://mobbin.com/flows/4c643c2b-a694-4d49-a95f-dcf6a7d7c64d), [Past food orders](https://mobbin.com/flows/6b2f8720-c0a1-45a7-85e9-c7d49c9bb327) | 3, 5 | verified |
| Zomato | [Rating a restaurant](https://mobbin.com/flows/616fd97d-7392-4d86-bfe4-df2ebf8d4afc) | 6 | verified |
| Zomato | [Chatting with rider](https://mobbin.com/flows/4e3ee3fa-b1da-4967-a4fc-f8233937cb7f) | 6 | verified |

None of the three has a flow for the seller's side on Mobbin; they are customer apps.

## Findings

| Flow | Keeta | foodpanda | Zomato |
| --- | --- | --- | --- |
| Entry | Splash, then sign-up by phone or email before anything else, then a profile form (skippable) | — | — |
| Home | Search field, category grid, "Offers for you" cards with the old price struck and a -50% tag, bottom tabs Home / Orders / Account | A **Pick-up** tile opens a home of its own: nearby restaurants with "8 min · 260 m away" and a discount tag | — |
| Search | Recent and popular searches, popular brands; results grouped by restaurant, each with a row of its dishes and their prices | Filter chips: sort, offers, rating | Results split into **Restaurants / Dishes** tabs; chips Sort, Nearest, Rating |
| Store page | Header with time, fee and voucher strip; menu tabs; dish sheet with required choices and a special request; a cart bar at the bottom | Header with a **delivery ↔ pick-up switch**; in pick-up it shows "Pick-up 5 min · No min. order", the address and the distance | Search inside the menu, a floating Menu button, "Report an issue with the menu" and the food licence at the foot |
| Checkout | Totals, payment method, a tip, "Place order", then "Payment successful" | Pick-up options **Standard / Scheduled**, payment method, order summary, terms, **"Place pick-up order"** | Coupons, time, contact, bill; a **cancellation policy** stated before payment ("help us reduce food waste") |
| After ordering | Arrival time and a four-step progress bar, courier, store, total, help | A time ("09:19 PM"), **"Pick-up: 1344"**, a map with **Get directions**, "How to pick up your order" in three steps (go to the restaurant, show your order number, self-collect), the paid total, and a swipe **"Order collected"**; then "Picked up!" | Status header, map, a call button for the restaurant, help, "Cancel order" |
| Chat | — | — | One conversation per order with the rider: text, photo, location, sent and read marks, typing indicator |
| Cancel and help | — | Cancel with a reason; "You can cancel an order anytime before it is accepted"; after that, cancelling means no refund. Help lists **Upcoming / Past orders**, then topics per order: wrongly marked as picked up, an issue with my order, poor condition, payment or refund | Cancel from the order page |
| Orders | — | Upcoming / Past tabs with a status tag | Cards with the store, the items, the date, the total, the status ("Delivered", "Payment failed … refunded in 3–5 working days") and **Reorder** |
| Rating | — | — | Stars for the restaurant after delivery, a line of text, an optional photo |

Things all three carry that Second Bite has no use for: vouchers and paid memberships (PRO, Gold), tips, advertising inside the order screen, scratch cards, "popular with your order" upsells, group orders, dish customisation and courier tracking.

## What fits Second Bite

Read against the [vision](../vision.md) (look first, sign in to act; collection first; no commission; honest prices) and the founder's [requirements](../brief/second-bite-app-requirements-it.md), slides 4, 8, 9 and 10.

1. **Look first.** Keeta's sign-in before the home is the opposite of the vision; the home opens without an account, located at Tasco Mall by default with "use my location". No delivery address book in the pilot.
2. **Home.** Keeta's offer cards with foodpanda's pick-up facts: each card is a dish with its photo, discount tag, struck old price, store, distance, **collection time** and "x left". Expected surplus that can be followed sits in a section of its own.
3. **Search.** Keeta's recent and popular searches; Zomato's Dishes / Stores tabs; filters for distance, price, collection time and kind.
4. **Store page.** foodpanda's pick-up header (address, distance, collection window, follow); the dishes on offer; a cart bar as Keeta's. A cart holds one store's dishes. No customisation sheet: surplus is already made, so only a quantity bounded by what is left.
5. **Checkout.** foodpanda's pick-up checkout: the store on a small map, the window, payment by **cash at the counter or VietQR transfer**, the dish total, any third-party fee and the total, no tip and no voucher, and Zomato's short cancellation policy. Sign-in is asked here, returning to the checkout; the first order asks for a display name.
6. **Waiting for a transfer.** The QR code and a countdown of the payment wait; paid, the order waits for the seller; not paid in time, it ends.
7. **Following the order and collecting.** foodpanda's pick-up screen: status (waiting, confirmed, ready, completed, or cancelled / expired), **the collection code shown large**, the last time to collect, directions, the three steps. One difference: the customer does not swipe "collected"; **the seller's staff enter the code**, which works once.
8. **Chat per order.** Zomato's conversation, with the store instead of a rider: text and photo, sent time and state, and a note that changing the order is a separate action (slide 8).
9. **Cancel and report.** foodpanda's rule: the customer cancels alone before the seller confirms; after that, a cancellation request or a problem report goes to admins, with foodpanda's topics (wrong dish, store out of the dish, marked collected but not collected, payment or refund).
10. **My orders.** foodpanda's Upcoming / Past tabs with Zomato's cards; "order again" only while the store offers the dish.
11. **Rating** is not in the founder's requirements; if wanted later, Zomato's stars and one line after collection.

The seller's flows (posting with a photo or by voice, the order queue from new to handed over with the customer's code, stopping a dish at once) are not covered by these apps and still need a reference.
