# SEC-80 — The prototype's numbers: page opens, holds, pick-ups and posts, each day per store: design

Status: designed on 22 October 2026, waiting for the owner's review before any code. Tracked in Linear as SEC-80. The sponsor asks for these numbers in the [tracking sheet](../../../brief/2026-10-20-sponsor-tracking-sheet.md): O-01 for 23/10 (page opens, holds, posts) and F-04 for 31/10 (a daily table per store: posted, held, picked up), and they fill the trial checks K-01 to K-05.

## What an admin can do

The page is "Báo cáo" (`/admin/reports`), the menu's entry of that name. Figma's AD-BC1 and AD-BC2 (section "Quản trị · Web 1440") are its reference for layout only: the numbers and the rules are this design's, and the code may differ from the drawing (decided with the owner on 22 October 2026).

- Choose a range of days (the last 7 by default, at most 92) and one store or all of them; every choice is in the address.
- Read the cards for the range:
  - views and people (with how many came from the printed QR code);
  - orders held;
  - units collected ("phần cứu");
  - the share collected;
  - the orders that expired without the customer coming ("không đến").
- Read the orders held per day as bars, so the evenings of the trial compare at a glance ([NN/g](https://www.nngroup.com/articles/dashboards-preattentive/): length for quantities, no pies).
- Read one row per store, sortable by each column:
  - views and people;
  - dishes and units posted;
  - orders held, collected, cancelled, refused and expired;
  - the share collected;
  - what the collected orders came to at the counter.
- Press "Xuất CSV" for the same numbers one row per day and store, to paste into the sponsor's sheet. The sheet asks for days, so the file goes by day even when the table sums the range.

Left out of Figma's drawing until there is data for it:

- kilograms and CO₂ saved, since dishes carry no weight;
- new users;
- the weekly chart, since the trial counts in evenings;
- Excel files, since a CSV opens in Excel and Sheets.

The overview (AD-TQ, SEC-62) can later read the same views for its funnel.

## Domain story

1. A customer scans the poster or opens a link in Zalo; the browser shows a page of the site.
2. Once the page is on screen, the browser tells the server which page was opened, and from where (`utm_source`).
3. The server drops the request when it comes from a bot or a prefetch, and keeps one view: the day, the page, the store or dish it is about, the source, and a visitor key that cannot be traced back to the person.
4. The rest is already recorded by its owner: a seller posts a dish (`offer`); a customer holds it, and the order is collected, cancelled, refused or expires (`order`).
5. An admin opens "Số liệu" and reads, per day and store, the views next to the posts and the orders.

Failure paths: a view that does not arrive (closed page, no network) is lost and not retried; a broken stats request never affects the page, which neither waits for it nor shows an error.

## Glossary

| Term                 | Meaning                                                                                                                                                                                                                                        |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| View ("lượt mở")     | One page on screen in a real browser. A reload is a new view.                                                                                                                                                                                  |
| Visitor ("người mở") | One browser on one day, counted once per day. Two days are two visitors; the key cannot be linked across days.                                                                                                                                 |
| Store page view      | A view of `/sellers/{id}` or of a dish of that store (`/offers/{id}`).                                                                                                                                                                         |
| Day                  | The calendar day in Vietnam (`Asia/Ho_Chi_Minh`). For views it is the day of the view; for posts and orders it is the collection day, the window's start, as the admin's orders list counts it ([SEC-135](../sec-135-admin-orders/design.md)). |
| Source               | `utm_source` of the address that opened the site, such as `qr` on the poster; empty for everything else.                                                                                                                                       |

## Decisions

- **We count ourselves, in our PostgreSQL; no analytics service and no Umami.** The numbers the sponsor wants are per store and sit next to holds and pick-ups, which only our database has. Umami counts views well but keeps them in its own database, and no existing tool copies a self-hosted Umami into another database; we would write that sync ourselves and run two systems ([minimise SaaS](../../../conventions.md)). Umami can be added later for devices and funnels without touching this.
- **How we count follows open-source analytics, read in `.tmp/` and not copied** (GoatCounter is EUPL, Pirsch and Plausible are AGPL; Umami and isbot are MIT):
  - The browser sends the view with `navigator.sendBeacon` when the route is shown, not on prefetch, and once per navigation (Umami `src/tracker/index.ts`, Plausible `tracker/src/track.js`).
  - The server drops bots and prefetches with [`zgo.at/isbot`](https://github.com/arp242/isbot) (MIT), as GoatCounter's `handlers/count.go` does.
  - The visitor key is `sha256(daily salt ‖ IP ‖ User-Agent)`; the salt is random, stored for the day and deleted after it, so a key cannot be recomputed later (Plausible's daily salts; Umami's `uuid(website, ip, userAgent, salt)` in `src/app/api/send/route.ts`). No cookie, and no IP or User-Agent is stored.
- **Raw views, aggregated when read.** A pilot of about 100 people makes a few thousand views a day at most; one row per view with an index on the day is enough, and the numbers can be re-cut later. Views older than 400 days are deleted by the nightly job that deletes old salts.
- **The page is read from its path.** The server keeps the path's kind (`home`, `seller`, `offer`, `other`) and the id in it. A dish's store is resolved when the numbers are read, through `offer`'s published API, so the web sends only the path.
- **A new module, `stats`**, owns the views and the salts (tables `stats_*`) and answers the report. It reads posts from `offer` and orders from `order` through new published reads (counts by day and store), and store names from `seller`. It writes nothing of theirs and they do not know it: edges `stats` → `offer`, `order`, `seller`. Each module counts its own rows, so the numbers are exactly the ones the admin's other lists show.
- **The real IP comes from the proxy.** The server is reached through the proxy and Next's `/api` rewrite; it reads the first address of `X-Forwarded-For` only on the stats call, since the proxy is the only way in.
- **The CSV is made in the browser** from the same answer as the table, so there is no second endpoint.

## Contract

| Call                                           | Who                | Used for                                                                                                                                |
| ---------------------------------------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| `POST /stats/views` `{path, referrer, source}` | Anyone, no session | Keep one view; always `204`, also for a bot or a malformed body, so the page never sees an error                                        |
| `GET /admin/stats?from=&to=&sellerId=`         | Admins             | Rows per day and store, the site's totals and the home's views; `STATS_RANGE_INVALID` (400) for a range longer than 92 days or reversed |

## Not here

- Devices, browsers, referrers in detail, funnels and live visitors (Umami later, if needed).
- Counting in the Flutter app, which is not in the pilot.
- How much food each store throws away: written down by hand at the stores (Trung, SEC-7).
- Feedback after a pick-up (F-03, SEC-82).
