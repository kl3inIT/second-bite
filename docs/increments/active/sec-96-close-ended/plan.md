# SEC-96 — Closing what has ended, in the table: plan

Design: [design.md](design.md). Tracked in Linear as SEC-96.

| # | Step | State |
| --- | --- | --- |
| 1 | `platform`: `Events.Every`, the periodic job and its worker | Built, pull request open |
| 2 | `offer`: `closed` stored, `CloseEnded` and its schedule; migration 0019; spec and check | Built, same pull request |
| 3 | `order`: `expired` stored with its event, `ExpireEnded` and its schedule; migration 0020; spec and check | Built, same pull request |
| 4 | Telling customers an order expired | Waiting for a channel (SEC-24 and later) |
