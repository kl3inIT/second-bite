# stats

Owns the pages people open on the site, counted for the prototype's numbers (SEC-80, [design](../increments/completed/sec-80-prototype-numbers/design.md)): one row per view, and the salt of each day (tables `stats_views` and `stats_salts`). No analytics service is used.

## Operations

| Operation                            | Who                               | Answers                                                                                                                                                                                                    |
| ------------------------------------ | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `POST /stats/views` `{path, source}` | Anyone, with or without a session | `204`, whether the view is kept or dropped as a bot's or a prefetch's. A body out of its contract, such as an empty path, answers `PLATFORM_REQUEST_INVALID` (400); the web ignores the answer either way. |

| `GET /admin/reports?since=&until=&sellerId=` | Admin | The report for days in Vietnam, both included: the last 7 up to today by default, at most 92. `totals`; `days`, every day of the range; `stores`, each store with numbers, the most orders first; `storeDays`, each store on each day it has numbers. Each holds, under `counts`, `views`, `people`, `homeViews`, `qrViews`, `offers`, `unitsPosted`, `held`, `unitsHeld`, `collected`, `unitsCollected`, `cancelled`, `refused`, `expired`, `collectedVnd`, `newAccounts` and `newCustomers`; and `accounts`, the accounts at the range's end. With `sellerId`, only that store, and its views are its page's and its dishes'; new users stay the site's. A range reversed or too long answers `REPORT_RANGE_INVALID` (400). |
| `GET /admin/reports/export?since=&until=&sellerId=` | Admin | The same report as a CSV file in Vietnamese, `text/csv; charset=utf-8` with a byte order mark, named `bao-cao-<since>-den-<until>.csv`: a header, then for each day a row for the whole site (`Cả trang`, without `sellerId`) and a row per store with numbers, and `Tổng` last; the share collected in whole percent, empty without orders. A store's name that starts with `=`, `+`, `-`, `@`, a tab or a carriage return is written behind an apostrophe. |

Published to other modules: nothing. It asks `identity.AccountDays`, `offer.PostDays` and `SellersOf`, `order.OrderDays` and `FirstOrderDays`, and `seller.NamesOf`.

## Rules

- A view is dropped, not refused, when its User-Agent is a bot's or missing, when it comes from a data centre's addresses, or when the browser only fetched the page ahead (`Purpose`, `Sec-Purpose`), as `zgo.at/isbot` reads them; and past 600 views from one address in ten minutes (SEC-160).
- The page is read from the path, with or without the locale: `/` is the home, `/sellers/{id}` a store and `/offers/{id}` a dish, with the id kept; anything else is `other`. A query string is ignored.
- The source is `utm_source` as the web read it, lowercased: 1 to 40 of `a-z`, `0-9`, `_` and `-`, else none.
- The day is the calendar day in Vietnam (UTC+7) when the view arrives.
- The visitor is `sha256(day's salt ‖ address ‖ User-Agent)`, so one browser counts once a day and cannot be followed from one day to the next. The salt is random, stored for its day and deleted after it. No cookie, address or User-Agent is stored.
- The address is the first of `X-Forwarded-For`, as the site is reached only through the proxy, else the connection's.
- Posts and orders count on their collection day, the day their window starts in Vietnam, as the admins' orders list goes by it. Every offer counts, whatever became of it. An order counts as held whatever became of it, and as collected, cancelled, refused or expired by how it ended; one confirmed or ready whose window is over is expired.
- A store's views are those of its page and of its dishes' pages; a browser that opened both on a day is one person. People add up over days, since a visitor's key changes every day.
- The web sends a view once a page is on screen, never for a link the router fetched ahead, and not for the admin's or a store's own pages, nor from a browser a program drives (`navigator.webdriver`); a view that fails is lost.
- **New users** (SEC-192) are the site's, whatever store is chosen, and none of a store's rows has them: `newAccounts`, the accounts created on the day in Vietnam, and `newCustomers`, the customers whose first order, told apart by phone number, is collected on the day. An order whose contact was forgotten counts for nobody, and a deleted account on no day. `accounts` is the accounts there are at the end of the range. The CSV writes them on the whole site's rows and the totals, as "Tài khoản mới" and "Khách đặt lần đầu".
- The nightly job `stats.forget_old` deletes the salts of the days that are over and the views older than 400 days. Running it again changes nothing more.

## Data

| Table         | Holds                                                                                            | Lifecycle                    |
| ------------- | ------------------------------------------------------------------------------------------------ | ---------------------------- |
| `stats_views` | The day, when, the kind of page, the store or dish (no foreign key), the source, the visitor key | Deleted after 400 days       |
| `stats_salts` | The salt of a day                                                                                | Deleted once its day is over |
