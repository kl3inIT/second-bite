"use client";

import { ArrowLeftIcon, PrinterIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/features/offers/format";
import { Link } from "@/i18n/navigation";
import type { CountsBody, ReportOutputBody, ReportStoreBody } from "@/lib/api/generated";

import { ReportAnalysis, type Ratings } from "./report-analysis";
import type { DeepAnalysis } from "./report-deep";
import { ImpactBlock } from "./report-impact";
import { leftoverOf, periodBefore, sellThroughOf } from "./report-numbers";
import { ProductsBlock } from "./report-products";
import { Cards, DayBars, rangeOf, shareOf } from "./report-view";
import type { ReportPart } from "./search-params";

/**
 * The report laid out for paper (report-products-export increment): the parts the export dialog ticked, in the
 * report's order, on a column as wide as an A4 page. "Lưu PDF" opens the browser's print dialog, which saves it
 * as a PDF; the controls and the admin's sidebar are not printed.
 */
export function ReportPrint({
  report,
  previous,
  ratings,
  deep,
  parts,
  storeName,
  backHref,
  children,
}: {
  report: ReportOutputBody;
  previous: CountsBody | null;
  ratings: Ratings | null;
  deep: DeepAnalysis | null;
  parts: ReportPart[];
  storeName: string | undefined;
  backHref: string;
  /** The stores' feedback, which the server draws. */
  children?: React.ReactNode;
}) {
  const t = useTranslations("Admin.reports");
  const format = useFormatter();
  const has = (part: ReportPart) => parts.includes(part);
  const { days } = periodBefore(report.since, report.until);

  return (
    <article
      aria-labelledby="report-print"
      className="mx-auto flex w-full max-w-2xl flex-col gap-5"
    >
      <div className="flex flex-wrap items-center gap-3 print:hidden">
        <Link href={backHref} className={buttonVariants({ variant: "outline", size: "lg" })}>
          <ArrowLeftIcon data-icon="inline-start" />
          {t("print.back")}
        </Link>
        <Button size="lg" className="ms-auto" onClick={() => window.print()}>
          <PrinterIcon data-icon="inline-start" />
          {t("print.save")}
        </Button>
      </div>
      <header className="flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-primary pb-2">
        <h1 id="report-print" className="text-page-title text-foreground">
          {t("print.title")}
        </h1>
        <p className="text-body-sm text-muted-foreground">
          {t("print.scope", {
            range: rangeOf(report, format),
            store: storeName ?? t("print.anyStore"),
          })}
        </p>
      </header>
      {has("kpi") ? (
        <Cards
          report={report}
          previous={previous}
          days={days}
          withProducts={has("products")}
          withImpact={has("impact")}
        />
      ) : (
        <>
          {has("products") && <ProductsBlock totals={report.totals} />}
          {has("impact") && <ImpactBlock totals={report.totals} />}
        </>
      )}
      {has("days") && (
        <>
          <DayBars days={report.days ?? []} only="orders" />
          {has("products") && <DayBars days={report.days ?? []} only="units" />}
        </>
      )}
      {has("analysis") && ratings && deep && (
        <ReportAnalysis totals={report.totals} ratings={ratings} deep={deep} />
      )}
      {has("stores") && <StoresTable stores={report.stores ?? []} />}
      {children}
    </article>
  );
}

/** The stores' numbers in the columns a page holds: portions first, then orders and what was taken in. */
function StoresTable({ stores }: { stores: ReportStoreBody[] }) {
  const t = useTranslations("Admin.reports");
  const format = useFormatter();
  const share = (value: number | null) => (value === null ? t("none") : `${value}%`);
  const columns = [
    "unitsPosted",
    "unitsCollected",
    "leftover",
    "sellThrough",
    "held",
    "collected",
    "share",
    "collectedVnd",
  ] as const;
  const cell = (store: ReportStoreBody, column: (typeof columns)[number]) => {
    const c = store.counts;
    if (column === "leftover") return format.number(leftoverOf(c));
    if (column === "sellThrough") return share(sellThroughOf(c));
    if (column === "share") return share(shareOf(c));
    if (column === "collectedVnd") return formatPrice(c.collectedVnd);
    return format.number(c[column]);
  };

  return (
    <section
      aria-labelledby="report-print-stores"
      className="flex break-inside-avoid flex-col gap-3"
    >
      <h2 id="report-print-stores" className="text-title-lg text-foreground">
        {t("table")}
      </h2>
      {stores.length === 0 ? (
        <p className="text-body-sm text-muted-foreground">{t("empty.title")}</p>
      ) : (
        <div className="rounded-md border border-border bg-card">
          <Table aria-labelledby="report-print-stores">
            <TableHeader>
              <TableRow>
                <TableHead>{t("column.name")}</TableHead>
                {columns.map((column) => (
                  <TableHead key={column} className="text-end">
                    {t(`column.${column}`)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {stores.map((store) => (
                <TableRow key={store.sellerId}>
                  <TableCell>{store.name}</TableCell>
                  {columns.map((column) => (
                    <TableCell key={column} className="text-end">
                      {cell(store, column)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}
