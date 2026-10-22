# stats

Owns the pages people open on the site, counted for the prototype's numbers (SEC-80, [design](../increments/active/sec-80-prototype-numbers/design.md)): one row per view, and the salt of each day (tables `stats_views` and `stats_salts`). No analytics service is used.

## Operations

| Operation                            | Who                               | Answers                                                                                                                                                                                                    |
| ------------------------------------ | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `POST /stats/views` `{path, source}` | Anyone, with or without a session | `204`, whether the view is kept or dropped as a bot's or a prefetch's. A body out of its contract, such as an empty path, answers `PLATFORM_REQUEST_INVALID` (400); the web ignores the answer either way. |

Published to other modules: nothing yet.

## Rules

- A view is dropped, not refused, when its User-Agent is a bot's or missing, when it comes from a data centre's addresses, or when the browser only fetched the page ahead (`Purpose`, `Sec-Purpose`), as `zgo.at/isbot` reads them.
- The page is read from the path, with or without the locale: `/` is the home, `/sellers/{id}` a store and `/offers/{id}` a dish, with the id kept; anything else is `other`. A query string is ignored.
- The source is `utm_source` as the web read it, lowercased: 1 to 40 of `a-z`, `0-9`, `_` and `-`, else none.
- The day is the calendar day in Vietnam (UTC+7) when the view arrives.
- The visitor is `sha256(day's salt ‖ address ‖ User-Agent)`, so one browser counts once a day and cannot be followed from one day to the next. The salt is random, stored for its day and deleted after it. No cookie, address or User-Agent is stored.
- The address is the first of `X-Forwarded-For`, as the site is reached only through the proxy, else the connection's.
- The nightly job `stats.forget_old` deletes the salts of the days that are over and the views older than 400 days. Running it again changes nothing more.

## Data

| Table         | Holds                                                                                            | Lifecycle                    |
| ------------- | ------------------------------------------------------------------------------------------------ | ---------------------------- |
| `stats_views` | The day, when, the kind of page, the store or dish (no foreign key), the source, the visitor key | Deleted after 400 days       |
| `stats_salts` | The salt of a day                                                                                | Deleted once its day is over |
