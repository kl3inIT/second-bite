# SEC-33 — Staging at secondbite.vadan.app: plan

Design: [design.md](design.md). Tracked in Linear as SEC-33.

| # | Step | Who | State |
| --- | --- | --- | --- |
| 1 | Design and decisions: copy BeyondPilot's deployment (`deploy.sh` over SSH, compared with Kamal, Docker contexts and Coolify), automatic deployment, files in PostgreSQL | Team | Decided, 18 October 2026 |
| 2 | `server/Dockerfile`, its health check, and the image built in backend CI on pull requests | Agent | Done (PR #12) |
| 3 | `infrastructure/deployment/`: `compose.base.yaml`, `compose.staging.yaml`, `compose.local.yaml` with a local proxy, `staging.env.example` | Agent | Done (PR #12) |
| 4 | Release on `main`: images built side by side and pushed, started together and checked, `release-<sha>` published | Agent | Done |
| 5 | `deploy.sh`, `deploy.yml` and `deploy-staging.yml`; the nightly backup; `robots.txt` closed | Agent | Done |
| 6 | `docs/runbooks/ci-cd.md`: releases, deployment, host provisioning, proxy, GitHub configuration, failure and recovery; `ARCHITECTURE.md` | Agent | Done |
| 7 | DNS, host provisioning, GitHub environment, proxy host and certificate, nightly backup | Administrator, agent | Done, 18 October 2026 |
| 8 | First deployment (done 18 October 2026, then automatic); the first admin; the date of the first data recorded in the persistence guideline; SEC-24 (Brevo) and SEC-35 (preview) follow | Team | In progress |
