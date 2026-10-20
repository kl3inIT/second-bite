import { NextIntlClientProvider } from "next-intl";
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { formats } from "@/i18n/formats";

import orders from "../../../../messages/admin/orders.vi.json";
import payments from "../../../../messages/admin/payments.vi.json";
import shell from "../../../../messages/admin/shell.vi.json";

/**
 * Renders an admin screen's component to HTML in Node, in Vietnamese and Vietnam time, so a unit test can give
 * it sample rows and read what it shows (SEC-62: the screens without a backend are checked this way; Vitest has
 * no DOM). A test mocks `@/i18n/navigation` itself, since `vi.mock` applies to the file it is written in.
 * Portals (dialogs, sheets) do not render on the server, so their bodies are tested on their own.
 */
export function renderAdmin(element: ReactElement): string {
  return renderToStaticMarkup(
    <NextIntlClientProvider
      locale="vi"
      timeZone="Asia/Ho_Chi_Minh"
      formats={formats}
      messages={{ admin: { shell, orders, payments } }}
    >
      {element}
    </NextIntlClientProvider>,
  );
}

/** The page's words without its markup, spaces folded, for `toContain`. */
export function textOf(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ");
}
