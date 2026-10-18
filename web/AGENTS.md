# Web application

Rules for `web/` are in the [web guideline](../docs/guidelines/web.md); design in [DESIGN.md](../DESIGN.md). Before finishing a change here:

- [ ] Every string is in `messages/vi.json` and `messages/en.json`; links use `Link` from `@/i18n/navigation`.
- [ ] Styling uses semantic tokens only; a new value went into DESIGN.md and `pnpm generate:tokens`, never into `src/styles/tokens.css` by hand.
- [ ] API calls go through the generated SDK; after the backend's contract changed, `pnpm generate:api` was run and its output committed.
- [ ] Targets are 44 px or more, status carries a label or icon, icon-only controls have an accessible name.
- [ ] A changed page has a Playwright test that opens it and checks it with `expectNoSeriousA11yViolations`.
- [ ] `pnpm check` and `pnpm test:e2e` pass.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
