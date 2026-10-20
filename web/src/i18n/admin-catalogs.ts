/**
 * The admin's message catalogs, one per page, in `messages/admin/<catalog>.<locale>.json` (SEC-62): the pages
 * are built side by side, so each keeps its words in its own file. `shell` holds what the sidebar, the top bar
 * and the shared admin components say. request.ts merges them under `admin`, so a page reads
 * `useTranslations("admin.sellers")`. A new catalog is added here, in app-config.d.ts and as two files.
 */
export const adminCatalogs = [
  "shell",
  "overview",
  "sellers",
  "offers",
  "orders",
  "payments",
  "issues",
  "reviews",
  "accounts",
  "promotions",
  "content",
  "notifications",
  "sponsors",
  "reports",
  "settings",
] as const;

export type AdminCatalog = (typeof adminCatalogs)[number];
