# Second Bite web

The web application for customers, sellers and admins: Next.js (App Router), React, TypeScript 7, Tailwind CSS 4 and shadcn/ui. Rules for this folder are in [AGENTS.md](AGENTS.md); the design tokens come from [DESIGN.md](../DESIGN.md).

## Commands

```bash
pnpm install
pnpm dev               # http://localhost:3000
pnpm check             # tokens current with DESIGN.md, Oxlint, Prettier, types
pnpm generate:tokens   # rewrite src/styles/tokens.css after DESIGN.md changes
pnpm build
```

Inter is loaded through `next/font` with the Latin and Vietnamese subsets and served from our own origin.
