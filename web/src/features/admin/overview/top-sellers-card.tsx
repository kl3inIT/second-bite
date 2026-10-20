import { useFormatter, useTranslations } from "next-intl";

import { adminHref } from "@/features/admin/pages";
import { EmptyState } from "@/features/admin/ui/empty-state";
import { Link } from "@/i18n/navigation";
import type { TopSellerBody } from "@/lib/api/generated";

/**
 * The stores that posted most in the span (Figma AD-TQ1 › Card · Cửa hàng bán tốt): rank, name and posts. Figma
 * ranks them by portions saved, which needs orders (SEC-15); until then the backend ranks them by posts, and the
 * column says so.
 */
export function TopSellersCard({ sellers }: { sellers: TopSellerBody[] }) {
  const t = useTranslations("admin.overview.top");
  const format = useFormatter();

  return (
    <section
      aria-labelledby="overview-top"
      className="flex min-w-0 flex-col rounded-2xl border border-border bg-card px-6 pt-6 pb-3"
    >
      <h2 id="overview-top" className="pb-3 text-title-lg text-foreground">
        {t("title")}
      </h2>
      {sellers.length === 0 ? (
        <EmptyState title={t("empty")} />
      ) : (
        <table className="w-full table-fixed">
          <caption className="sr-only">{t("title")}</caption>
          <thead>
            <tr className="h-9 text-left text-muted-foreground">
              <th scope="col" className="w-8 text-label-strong">
                {t("rank")}
              </th>
              <th scope="col" className="text-label-strong">
                {t("seller")}
              </th>
              <th scope="col" className="w-24 text-right text-label-strong">
                {t("posts")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((seller, index) => (
              <tr key={seller.sellerId} className="h-14 border-t border-border">
                <td className="text-label-strong text-muted-foreground">{index + 1}</td>
                <td className="min-w-0">
                  <Link
                    href={adminHref("sellerDetail", { sellerId: seller.sellerId })}
                    className="block truncate rounded-sm py-3 text-body-sm-strong text-foreground hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    {seller.name}
                  </Link>
                </td>
                <td className="text-right text-body-sm-strong text-foreground tabular-nums">
                  {format.number(seller.offers)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
