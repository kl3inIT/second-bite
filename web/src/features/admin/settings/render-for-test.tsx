import { NextIntlClientProvider } from "next-intl";
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { formats } from "@/i18n/formats";

import settings from "../../../../messages/admin/settings.vi.json";
import shell from "../../../../messages/admin/shell.vi.json";

/**
 * A settings component's HTML with sample data, in Vietnamese, as the admin's catalogs give it (admin-qa: a page
 * without a backend is checked with sample rows here, its empty state in the browser). Tests mock
 * `@/i18n/navigation`, which needs Next's router.
 */
export function renderSettings(element: ReactElement, now = new Date("2026-10-20T03:00:00Z")) {
  return renderToStaticMarkup(
    <NextIntlClientProvider
      locale="vi"
      timeZone="Asia/Ho_Chi_Minh"
      now={now}
      formats={formats}
      messages={{ admin: { shell, settings } }}
    >
      {element}
    </NextIntlClientProvider>,
  );
}
/** The words of some HTML, without its tags, to compare with what a person reads. */
export function textOf(html: string) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}
