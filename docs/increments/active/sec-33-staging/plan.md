# SEC-33 — Staging at secondbite.vadan.app: plan

Design: [design.md](design.md). Tracked in Linear as SEC-33.

| # | Step | Who | State |
| --- | --- | --- | --- |
| 1 | Design and decisions: copy BeyondPilot's deployment, automatic deployment, files in PostgreSQL | Team | Proposed, 18 October 2026 |
| 2 | `server/Dockerfile`, its health check, and the image built in backend CI on pull requests | Agent | Not started |
| 3 | `infrastructure/deployment/`: `compose.base.yaml`, `compose.staging.yaml`, `compose.local.yaml` with a local proxy, `staging.env.example`, `deploy.sh` | Agent | Not started |
| 4 | Release CI on `main`: build, start together, check routes, push to GHCR, publish `release-<sha>` | Agent | Not started |
| 5 | `deploy.yml` and `deploy-staging.yml`; the nightly backup; `robots.txt` closed | Agent | Not started |
| 6 | `docs/runbooks/ci-cd.md`: releases, deployment, host provisioning, proxy, GitHub configuration, failure and recovery; `ARCHITECTURE.md` | Agent | Not started |
| 7 | DNS, host provisioning, GitHub environment, proxy host | Administrator | Not started |
| 8 | First deployment; the date recorded in the persistence guideline; SEC-24 (Brevo) and SEC-35 (preview) can follow | Team | Not started |
