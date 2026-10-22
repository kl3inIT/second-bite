# stats: verification matrix

Requirements of [docs/specs/stats.md](../specs/stats.md) and the checks that hold them. Paths are under `server/`.

| Requirement                                                                                                                                          | Check                                                                                     |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| The home, a store and a dish are read from the path with or without the locale; a bad id, an order and the cart are other                            | `TestPageOf` (`internal/stats/stats_test.go`)                                             |
| One browser has one key a day, another key the next day; the address and the browser never run into each other                                       | `TestVisitorKey`                                                                          |
| The address is the first forwarded one, else the connection's                                                                                        | `TestClientAddress`                                                                       |
| The day is Vietnam's, past midnight there                                                                                                            | `TestDayOf`                                                                               |
| A view keeps its page, store and source; a source out of its pattern is none; one browser is one visitor, also after a restart                       | `TestService` › a view keeps its page, store and source, and one browser is one visitor   |
| Bots, a missing User-Agent and a prefetch are not counted                                                                                            | `TestService` › a bot and a prefetch are not counted                                      |
| Salts of past days and views older than 400 days are forgotten; yesterday's views stay                                                               | `TestService` › old salts and views are forgotten                                         |
| Through the API a view is counted without a session, with the forwarded address; a bot's is answered the same and not kept; an empty path is refused | `TestService` › a page view is counted without a session (`cmd/secondbite/stats_test.go`) |
| `stats` reaches no other module                                                                                                                      | `TestModuleBoundaries` (`internal/boundaries_test.go`)                                    |
