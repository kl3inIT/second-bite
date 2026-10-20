import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { formats } from "@/i18n/formats";

import shell from "../../../../messages/admin/shell.vi.json";
import { AdminCrumbsProvider } from "../admin-crumbs";

/**
 * An admin screen's HTML with its Vietnamese words, for a unit test that gives it sample data (admin-qa: the
 * screens without a backend are checked this way). `catalogs` are the screen's own, under `admin`; `shared` are
 * the site's namespaces it borrows, such as `OfferKind`. The test mocks `@/i18n/navigation`, which needs Next's
 * router.
 */
export function renderAdmin(
  node: ReactNode,
  catalogs: Record<string, unknown>,
  shared: Record<string, unknown> = {},
): string {
  return renderToStaticMarkup(
    <NextIntlClientProvider
      locale="vi"
      messages={{ ...shared, admin: { shell, ...catalogs } }}
      timeZone="Asia/Ho_Chi_Minh"
      formats={formats}
    >
      <AdminCrumbsProvider>{node}</AdminCrumbsProvider>
    </NextIntlClientProvider>,
  );
}
