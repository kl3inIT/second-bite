# SEC-86 — Collect without a four-digit code: plan

Design: [design.md](design.md). Tracked in Linear as SEC-86.

| # | Step | State |
| --- | --- | --- |
| 1 | Server: hand over without a code, the access stored with the order, migration 0015, no collection code key | Done, 21 October 2026 |
| 2 | Contract and clients: `api/openapi.yaml`, the web SDK, the mobile client | Done, 21 October 2026 |
| 3 | Web: the order's ticket shows who collects instead of a code; the test stub | Done, 21 October 2026 |
| 4 | Deployment: the compose files, `deploy.sh` and the runbooks without `collection-code-key` | Done, 21 October 2026 |
| 5 | Merge, then watch the staging deployment run | Waiting for review |

One pull request.
