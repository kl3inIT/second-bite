import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { pageMetadata } from "@/lib/seo";

import { type AdminNamedPage, type AdminPageKey, isReleased, lineage } from "./pages";
import { AdminComingSoon } from "./ui/coming-soon";

/**
 * A page's flag at work: an open page renders its content; one whose `released` is off in the registry (pages.ts)
 * renders the shared coming-soon page instead, its code kept. Every admin page wraps its content in it:
 *
 *   export default function OrdersPage() {
 *     return <AdminPageGate page="orders"><Orders /></AdminPageGate>;
 *   }
 *
 * A detail page names its own key (`orderDetail`) and shows the coming-soon page of its parent when closed.
 */
export function AdminPageGate({ page, children }: { page: AdminPageKey; children: ReactNode }) {
  if (isReleased(page)) return children;
  const named = lineage(page).find((key): key is AdminNamedPage => !key.endsWith("Detail"));
  return <AdminComingSoon page={named ?? "overview"} />;
}

/**
 * An admin page's metadata: its name from the registry's catalog, or `title` for a detail page, and never indexed
 * (the admin pages are not in the sitemap either).
 */
export async function adminMetadata(
  params: Promise<{ locale: string }>,
  page: AdminNamedPage | { title: string },
): Promise<Metadata> {
  const [{ locale }, t] = await Promise.all([params, getTranslations("admin.shell")]);
  const title = typeof page === "string" ? t(`pages.${page}.label`) : page.title;
  return pageMetadata({ locale, title: `${title} · ${t("title")}`, index: false });
}
