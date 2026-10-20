"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { pageNumbers } from "./numbers";

const square =
  "flex size-9 items-center justify-center rounded-md text-body-sm-strong transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none";

/**
 * The foot of a table (Figma Admin/Pagination 228:5371): "Hiển thị 1–10 trên 34 cửa hàng" on the left (`summary`,
 * which names the page's own things), ‹ 1 2 3 4 › on the right, the current page in blue. Each page is a link
 * (`hrefFor`) or a handler (`onPage`).
 */
export function Pagination({
  page,
  pageSize,
  total,
  summary,
  hrefFor,
  onPage,
}: {
  page: number;
  pageSize: number;
  total: number;
  summary: (range: { from: number; to: number; total: number }) => ReactNode;
  hrefFor?: (page: number) => string;
  onPage?: (page: number) => void;
}) {
  const t = useTranslations("admin.shell.pagination");
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  const go: Go = { hrefFor, onPage };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-2.5">
      <p className="text-body-sm text-muted-foreground">{summary({ from, to, total })}</p>
      {pages > 1 && (
        <nav aria-label={t("label")}>
          <ul className="flex items-center gap-1.5">
            <li>
              <Step to={page - 1} pages={pages} label={t("previous")} go={go}>
                <ChevronLeftIcon aria-hidden className="size-4.5" />
              </Step>
            </li>
            {pageNumbers(page, pages).map((n, index) => (
              <li key={n === "gap" ? `gap-${index}` : n}>
                {n === "gap" ? (
                  <span aria-hidden className={cn(square, "text-muted-foreground")}>
                    …
                  </span>
                ) : (
                  <PageLink
                    go={go}
                    page={n}
                    label={t("page", { page: n })}
                    current={n === page}
                    child={<span aria-hidden>{n}</span>}
                    className={cn(
                      square,
                      n === page
                        ? "bg-primary text-primary-foreground hover:bg-primary-hover"
                        : "text-foreground hover:bg-muted",
                    )}
                  />
                )}
              </li>
            ))}
            <li>
              <Step to={page + 1} pages={pages} label={t("next")} go={go}>
                <ChevronRightIcon aria-hidden className="size-4.5" />
              </Step>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}

type Go = { hrefFor?: (page: number) => string; onPage?: (page: number) => void };

function Step({
  to: target,
  pages,
  label,
  go,
  children,
}: {
  to: number;
  pages: number;
  label: string;
  go: Go;
  children: ReactNode;
}) {
  const className = cn(square, "border border-border bg-card text-foreground hover:bg-muted");
  if (target < 1 || target > pages) {
    return (
      <span aria-disabled="true" className={cn(className, "opacity-40")}>
        <span className="sr-only">{label}</span>
        {children}
      </span>
    );
  }
  return <PageLink go={go} page={target} label={label} className={className} child={children} />;
}

function PageLink({
  go,
  page: target,
  label,
  className,
  child,
  current = false,
}: {
  go: Go;
  page: number;
  label: string;
  className: string;
  child: ReactNode;
  current?: boolean;
}) {
  const content = (
    <>
      <span className="sr-only">{label}</span>
      {child}
    </>
  );
  if (go.hrefFor) {
    return (
      <Link
        href={go.hrefFor(target)}
        scroll={false}
        aria-current={current ? "page" : undefined}
        className={className}
      >
        {content}
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={() => go.onPage?.(target)}
      aria-current={current ? "page" : undefined}
      className={className}
    >
      {content}
    </button>
  );
}
