# SEC-11 — The `offer` module: plan

Design: [design.md](design.md). Tracked in Linear as SEC-11.

| # | Step | State |
| --- | --- | --- |
| 1 | Research and the business flow | Decided, 18 October 2026 ([research](../../../research/2026-10-17-offer-models.md), [design](design.md#the-flow)) |
| 2 | `file`: the system's files in PostgreSQL or an S3-compatible store behind a registry; photo upload in two sizes without metadata, unused photos removed; the seller's photo | Built, 18 October 2026, except removing unused photos, which waits for River (step 6) |
| 3 | `offer`: posting, changing, withdrawing, the seller's list, the settings | Built, 18 October 2026 ([spec](../../../specs/offer.md)); the seller's list filters by `status` (`on_sale`, `sold_out`, `closed`, `withdrawn`) until announcements add theirs |
| 4 | Finding offers and the seller's public page | Built, 18 October 2026 ([design](design.md#5-finding-offers)); the follower count waits for step 6 |
| 5 | Announcements: announce, confirm, skip, not confirmed | Moved to SEC-54, with the rules for editing live offers |
| 6 | River; following a seller and an announcement, with emails | River runs the event outbox (SEC-37); following a store is SEC-109; following an announcement goes with SEC-54; emails to followers are SEC-190 |
| 7 | Weekly schedules | Moved to SEC-190 |
| 8 | Specs, test matrices, architecture and verification | Done for what was built: `docs/specs/offer.md`, `docs/specs/file.md` and their checks |

The order may change after the team decides on 19 October 2026 what the prototype of 23 October must run.
