# Second Bite repository guide

## Where to look

- Product scope from the founder: the [requirements for the IT team](docs/brief/second-bite-app-requirements-it.md) (newest) and the [project brief](docs/brief/second-bite-project-brief.md).
- Intended outcomes and stable principles: [docs/vision.md](docs/vision.md); delivered, active and candidate work: [docs/roadmap.md](docs/roadmap.md).
- Engineering rules for all code, whatever the language: [docs/conventions.md](docs/conventions.md); topic guidelines under [docs/guidelines/](docs/guidelines/).
- What exists today: [ARCHITECTURE.md](ARCHITECTURE.md) and the module specs under `docs/specs/`.
- Why a decision was made: accepted ADRs under `docs/decisions/`.
- What the team studied before designing, with its sources: [docs/research/](docs/research/README.md).

## Area guides

- Backend work in `server/`: follow [docs/guidelines/backend.md](docs/guidelines/backend.md).
- Web work in `web/`: follow [docs/guidelines/web.md](docs/guidelines/web.md) and the checklist in [web/AGENTS.md](web/AGENTS.md).
- Mobile work in `mobile/`: follow [docs/guidelines/mobile.md](docs/guidelines/mobile.md) and the checklist in [mobile/AGENTS.md](mobile/AGENTS.md).

## Operating rules

- Classify knowledge before writing it: what exists in `ARCHITECTURE.md` or `docs/specs/`; product intent in `docs/vision.md`; reusable policy in `docs/conventions.md` or `docs/guidelines/`; change-local reasoning in the active increment; planned work only in the roadmap or an increment, never as a current fact ([operating model](docs/guidelines/operating-model.md)).
- Reuse before building: check the standard library, the installed libraries and the existing code first ([reference-based design and scope control](docs/conventions.md#reference-based-design-and-scope-control)).
- Add no speculative structure: no empty module or package, no single-implementation interface, no temporary runtime mode or convenience endpoint ([change design](docs/conventions.md#change-design)).
- A change that adds or alters a business capability starts with an increment directory holding `design.md` and `plan.md`; a new module starts with [boundary discovery](docs/conventions.md#boundary-discovery).
- Linear is the source of truth for work and progress: every piece of work has an assigned issue, kept current while it moves, with what was researched and what was delivered written on it ([Linear as the record of work](docs/guidelines/operating-model.md#linear-as-the-record-of-work)). Name the branch as the issue suggests (`<user>/sec-<n>-<slug>`) and write commit subjects as `type(scope): summary (SEC-<n>)`.
- A feature or a fix reaches `main` through a pull request, merged once its checks pass. A change that touches only documents (`docs/`, `AGENTS.md` and other Markdown) is the exception: push it to `main` at once.
- The repository is public. Never write a password, token, private key, phone number, personal address or other secret or personal value to Git, documents, Linear, logs or command history; record only where a secret is managed ([data and security](docs/conventions.md#data-and-security)).
- Write repository documents in English, and update them in the change that makes them true. A source kept as received stays in its own language.
- Record an ADR only after the decision is accepted and implementation has started. ADRs are append-only; supersede one with a new ADR.
- Clone repositories studied for reference into the git-ignored `.tmp/` folder; never commit them.

## Agent skills

Go skills from community collections are vendored under `.claude/skills/`; their sources and what was left out are in [.claude/skills/SOURCES.md](.claude/skills/SOURCES.md). They describe idiomatic Go. Where a skill asks which architecture or layout to use, the answer is already given: [boundary discovery](docs/conventions.md#boundary-discovery) and the [backend guideline](docs/guidelines/backend.md). Where a skill and this repository disagree, this repository wins.

The Figma skills (`figma-build`, `figma-codegen`) are vendored beside them and work through the Figwright server in `.mcp.json`; design rules are in the [Figma guide](docs/guidelines/figma.md). The Flutter team's skills (`flutter-*`, `dart-*`) are vendored for `mobile/`; where they assume a state-management or networking package, the [mobile guideline](docs/guidelines/mobile.md) wins. Only skills from a package's own maintainers and from Very Good Ventures are vendored.

Design exploration uses the [impeccable](https://impeccable.style/) skill, which is not vendored: each person installs it, and it reads [PRODUCT.md](PRODUCT.md) and `.impeccable/` from this repository.
