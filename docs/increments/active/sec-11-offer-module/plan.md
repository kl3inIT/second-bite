# SEC-11 — The `offer` module: plan

Design: [design.md](design.md). Tracked in Linear as SEC-11.

| # | Step | State |
| --- | --- | --- |
| 1 | Research and the business flow | Decided, 18 October 2026 ([research](../../../research/2026-10-17-offer-models.md), [design](design.md#the-flow)) |
| 2 | `media`: photo upload, two sizes without metadata, kept in PostgreSQL behind a store registry that an S3-compatible store joins later, unused photos removed; the seller's photo | Built, 18 October 2026, except removing unused photos, which waits for River (step 6) |
| 3 | `offer`: posting, changing, withdrawing, the seller's list, the settings | Not started |
| 4 | Finding offers and the seller's public page | Not started |
| 5 | Announcements: announce, confirm, skip, not confirmed | Not started |
| 6 | River; following a seller and an announcement, with emails | Not started |
| 7 | Weekly schedules | Not started |
| 8 | Specs, test matrices, architecture and verification | Not started |

The order may change after the team decides on 19 October 2026 what the prototype of 23 October must run.
