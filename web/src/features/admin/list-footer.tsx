"use client";

import { useTranslations } from "next-intl";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

/** The pages to show around the current one, with gaps as null: 1 … 4 5 6 … 12. */
export function pagesAround(page: number, pages: number): Array<number | null> {
  const shown = new Set([1, pages, page - 1, page, page + 1].filter((p) => p >= 1 && p <= pages));
  const sorted = [...shown].sort((a, b) => a - b);
  return sorted.flatMap((p, index) => (index > 0 && p - sorted[index - 1] > 1 ? [null, p] : [p]));
}

/**
 * The foot of an admin's list (Figma Admin/Table › footer): which rows of how many are shown, and the pages.
 * Each page is a link to its own address, so it opens in a new tab too; `onPage` takes it in place.
 */
export function ListFooter({
  page,
  pageSize,
  total,
  noun,
  hrefOf,
  onPage,
}: {
  page: number;
  pageSize: number;
  total: number;
  /** What the list counts, for "1–25 of 248 actions". */
  noun: string;
  hrefOf: (page: number) => string;
  onPage: (page: number) => void;
}) {
  const t = useTranslations("Admin.list");
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const first = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const last = Math.min(total, page * pageSize);

  const go = (target: number) => (event: React.MouseEvent) => {
    event.preventDefault();
    onPage(target);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3">
      <p className="text-body-sm text-muted-foreground">
        {t("range", { first, last, total, noun })}
      </p>
      {pages > 1 && (
        <Pagination aria-label={t("pages")} className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                text={t("previous")}
                href={hrefOf(page - 1)}
                aria-disabled={page <= 1}
                tabIndex={page <= 1 ? -1 : undefined}
                onClick={go(page - 1)}
              />
            </PaginationItem>
            {pagesAround(page, pages).map((p, index) => (
              <PaginationItem key={p ?? `gap-${index}`}>
                {p === null ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink href={hrefOf(p)} isActive={p === page} onClick={go(p)}>
                    {p}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                text={t("next")}
                href={hrefOf(page + 1)}
                aria-disabled={page >= pages}
                tabIndex={page >= pages ? -1 : undefined}
                onClick={go(page + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
