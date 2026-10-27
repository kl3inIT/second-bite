# SEC-91 — Changing the hours of a post that has orders: plan

Design: [design.md](design.md). Tracked in Linear as SEC-91.

| # | Step | State |
| --- | --- | --- |
| 1 | `offer`: the rule, `WindowChangedEvent` and `WindowsOf`; checks, spec and matrix | Built, merged (PR #56) |
| 2 | `order`: the listener that moves the orders still to collect; checks, spec and matrix | Built, same pull request |
| 3 | Web: the edit drawer keeps the hours editable with orders and says the customers collect at the new hours; the stub and the Playwright check | Built, same pull request |
| 4 | Telling the customers | Waiting for a channel (SEC-24 and later) |
