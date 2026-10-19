# Product

<!-- impeccable:product-schema 1 -->

> Written on 17 October 2026 with the team, from the [vision](docs/vision.md), the [pilot domain model](docs/increments/active/sec-6-pilot-domain-model/design.md) and the founder's [requirements](docs/brief/second-bite-app-requirements-it.md). This file keeps what design work needs; outcomes and principles stay canonical in the vision. Tracked in SEC-22.

## Platform

web

The web application (Next.js) and the mobile application (Flutter, the same look on iOS and Android) share one design system: the tokens in `DESIGN.md` are mirrored by the web's tokens and the Flutter theme.

## Users

Customers and seller staff are equal users. The design serves both with one consistent system; neither surface is a lesser version of the other.

- **Customers** near Tasco Mall in Việt Hưng ward, Hanoi: office workers, students, security staff and labourers on modest incomes. They look for good food at a lower price near them, usually on a phone, often late in the day when collection windows are closing. They order confirmed stock, pay in cash or by bank transfer, and collect with a code, or send someone else with it.
- **Seller staff and owners** of food and beverage outlets (in the pilot, sellers inside Tasco Mall). At the end of a busy service they post what is left by speaking, typing or photographing it, correct the draft, set price and window, then prepare orders and hand them over when a code is shown.
- **Admins** of the Second Bite team verify sellers, handle problem reports and refunds, and download reports, at a desk.

## Product Purpose

Second Bite connects sellers that have genuine edible surplus with nearby people who want good food at a lower price, so that food is eaten instead of thrown away. The product is the whole journey: a seller confirms surplus and offers it, a customer finds it, orders confirmed stock, pays, and collects it within the collection window. Success is sellers who keep posting at the end of a busy day, customers who complete their collections and come back, surplus that is genuine, and avoided disposal measured against a baseline.

## Positioning

- Non-profit, and no commission ever: Second Bite takes no share of a seller's sales. Third-party fees (payment, later delivery) are shown separately.
- Named, photographed, confirmed stock rather than a surprise bag; a seller may also announce expected surplus that customers follow but cannot order until it is confirmed.
- A one-use collection code checked by staff at the counter, rather than a swipe the staff merely watch.
- AI drafts an offer from a seller's words or photo, and searches for customers in words or voice; staff always confirm, and the AI never states that food is safe or when it expires.

## Operating Context

- **Places and moments:** a mall food court and nearby streets in the evening; a seller's counter during the last hour of service; an admin's desk.
- **Collection:** the customer shows a code at the counter, staff check the food is still suitable, hand it over and confirm. Cash orders are paid then.
- **Payment:** cash at the counter, or a VietQR bank transfer confirmed through SePay; a transfer order waits a bounded time for its payment.
- **Conversation:** one chat per order between the customer and the seller's staff.
- **Languages:** Vietnamese and English on every screen and in the AI's answers. The first language follows the device's language; people can switch. Vietnamese copy runs 20–30% longer than English and is the harder case for layout.
- **Money and time:** prices in đồng; times in Asia/Ho_Chi_Minh.

## Capabilities and Constraints

- Three roles with separate surfaces: customer, seller staff (owner or staff), admin. Access is decided by the backend, never by what a screen shows.
- States an order passes through: awaiting payment, confirmed, ready, collected, or cancelled / expired / refused with a reason. An order never looks successful before it is.
- Delivery through a partner (Grab, Xanh SM) is not in the pilot; it appears only when an agreement and a working integration exist.
- Pilot timeline: a running prototype with 30 sellers in Tasco Mall and 100 customers, then a beta around 16 November 2026 with 100 sellers and 300 customers.
- **Visual world:** "Miếng cắn thứ hai", the second bite (a Tasco blue header under a light sweep, a pale sky ground, white cards with a bitten corner, lime stickers), taken from the Figma file "Secondbite" on 18 October 2026, its "Mobile v2" home the same day and the blue of its "Mobile v3" on 19 October 2026; its tokens are in [DESIGN.md](DESIGN.md).
- **Typefaces:** Be Vietnam Pro for text, Bricolage Grotesque for prices and figures only ([DESIGN.md](DESIGN.md)).
- **Undecided:** the tone of voice, the Vietnamese form of the tagline.

## Brand Commitments

- **Name:** "Second Bite", in both languages.
- **Tagline:** "A second chance for good food." Its Vietnamese form is still to be chosen.
- **Logo:** the "second bite" wordmark, its "o" a bitten cookie (Figma "Secondbite", `logo/wordmark`).
- **Not inherited:** the founder's prototype is a reference for features and roles only. Its interface, colours, layout, font and "s." mark are not part of the identity.
- **Voice:** to be chosen from research (how Vietnamese apps address customers and merchants, and how the words for surplus food are received).

## Evidence on Hand

- No real sellers, customers, orders, ratings, photos or impact figures exist yet. Pages must not show invented statistics, testimonials, partner logos or "people saved X meals" counters until the pilot produces them.
- The founder's prototype: https://second-bite-demo.trung1223.chatgpt.site/ (features and roles only).
- Research: [similar products](docs/research/2026-10-16-similar-products.md), [open-source pickup models](docs/research/2026-10-16-open-source-pickup-models.md), and the design research of SEC-22.

## Product Principles

- **Honest at every step:** stock, price, fees, window and order state are shown as they are; nothing looks confirmed before it is.
- **Fast at the end of a shift:** a seller posts surplus and hands over an order in a few taps, with one hand, under time pressure.
- **Good food, not leftovers:** the product presents surplus as good food at a fair price, never as charity or as something lesser.
- **People check food, software does not:** no screen or AI answer claims food is safe or states when it expires.
- **Bilingual from the first screen:** every string, error and AI answer in Vietnamese and English.

## Accessibility & Inclusion

- WCAG 2.2 AA contrast and target sizes on every surface; touch targets of at least 44 px.
- Modest and older phones on mobile data: light pages, images sized for the screen.
- Vietnamese diacritics never clipped: line height of at least 1.4 for running text, no clipped text containers, stacked capitals checked in buttons and badges.
- Status is never carried by colour alone.
