import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { AdminTopBar } from "@/features/admin/admin-top-bar";
import { ReviewsList } from "@/features/admin-reviews/reviews-list";
import { loadReviewSearchParams, starsAsked } from "@/features/admin-reviews/search-params";
import { vietnamMidnight } from "@/features/audit/search-params";
import { requireAdmin } from "@/features/identity/current-account";
import { sessionHeaders } from "@/features/identity/session";
import { listReviewsForAdmins, listSellersForAdmins } from "@/lib/api/generated";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Admin.reviews");
  return { title: t("title") };
}

// Every customer's review (Figma AD-DG1, SEC-145): a page read on the server for the filters in the address,
// and the stores the "Cửa hàng" filter offers, at most a hundred as the pilot has.
export default async function ReviewsPage({ searchParams }: PageProps<"/[locale]/admin/reviews">) {
  await requireAdmin("/admin/reviews");
  const filter = loadReviewSearchParams(await searchParams);
  const [t, headers] = await Promise.all([getTranslations("Admin"), sessionHeaders()]);

  const [{ data: page }, { data: sellers }] = await Promise.all([
    listReviewsForAdmins({
      headers,
      query: {
        stars: starsAsked(filter.card, filter.stars),
        visibility: filter.card === "hidden" ? "hidden" : undefined,
        q: filter.q || undefined,
        sellerId: filter.store ?? undefined,
        reviewedSince: filter.from ? vietnamMidnight(filter.from) : undefined,
        reviewedUntil: filter.from ? vietnamMidnight(filter.to ?? filter.from, 1) : undefined,
        page: filter.page,
        size: filter.size,
      },
    }),
    listSellersForAdmins({ headers, query: { sort: "name", size: 100 } }),
  ]);

  return (
    <>
      <AdminTopBar crumbs={[{ label: t("group.operations") }, { label: t("reviews.title") }]} />
      <div className="flex flex-1 flex-col gap-5 px-4 py-6 md:px-8">
        <h1 className="text-page-title text-foreground">{t("reviews.title")}</h1>
        <ReviewsList
          reviews={page.items}
          total={page.total}
          counts={page.counts}
          average={page.average}
          stores={(sellers.items ?? []).map((s) => ({ id: s.id, name: s.name }))}
        />
      </div>
    </>
  );
}
