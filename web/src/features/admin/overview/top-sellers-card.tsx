import { InboxIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adminHref } from "@/features/admin/pages";
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
    <section aria-labelledby="overview-top" className="min-w-0">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>
            <h2 id="overview-top">{t("title")}</h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sellers.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <InboxIcon aria-hidden />
                </EmptyMedia>
                <EmptyTitle>{t("empty")}</EmptyTitle>
              </EmptyHeader>
            </Empty>
          ) : (
            <Table aria-label={t("title")}>
              <TableHeader>
                <TableRow>
                  <TableHead scope="col">{t("rank")}</TableHead>
                  <TableHead scope="col" className="w-full">
                    {t("seller")}
                  </TableHead>
                  <TableHead scope="col" className="text-right">
                    {t("posts")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sellers.map((seller, index) => (
                  <TableRow key={seller.sellerId}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Link
                        href={adminHref("sellerDetail", { sellerId: seller.sellerId })}
                        className="block rounded-sm py-3 text-body-sm-strong text-foreground hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                      >
                        {seller.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="tabular-nums">{format.number(seller.offers)}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
