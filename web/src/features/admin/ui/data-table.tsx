"use client";

import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from "lucide-react";
import Image from "next/image";
import { useFormatter } from "next-intl";
import type { ReactNode } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export type SortDirection = "none" | "asc" | "desc";

/** How a sortable column is sorted, and what pressing its heading does: a link (`href`) or a handler. */
export type ColumnSort = { direction: SortDirection; href?: string; onSort?: () => void };

export type Column<Row> = {
  key: string;
  header: string;
  cell: (row: Row) => ReactNode;
  /** Present on a sortable column (Figma Admin/TableHeaderCell sort=sortable, asc, desc). */
  sort?: ColumnSort;
  /** Amounts sit at the end of their cell; a column of row actions too. */
  align?: "start" | "end";
  /** A column that takes the room left, such as the address (Figma `layoutGrow`). */
  grow?: boolean;
};

/**
 * The admin's table (Figma AD-Q1 › Table, Admin/TableRow 228:5353): in a white card with a hairline, the header
 * on the sky ground, rows 64px high, one line each and no second line under it, sky under the pointer. With
 * `rowHref` a press anywhere on a row opens it, as in Figma; the row's name cell links there too, for the
 * keyboard. `empty` shows in place of the rows when there are none, `footer` (the Pagination) under them.
 * `caption` names the table for the screen reader.
 */
export function DataTable<Row>({
  caption,
  columns,
  rows,
  rowKey,
  rowHref,
  empty,
  footer,
}: {
  caption: string;
  columns: Column<Row>[];
  rows: Row[];
  rowKey: (row: Row) => string;
  rowHref?: (row: Row) => string;
  empty?: ReactNode;
  footer?: ReactNode;
}) {
  const router = useRouter();

  return (
    <div className="overflow-hidden rounded-md border border-border bg-card">
      <Table variant="admin" scrollLabel={caption}>
        <caption className="sr-only">{caption}</caption>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.key}
                aria-sort={ariaSort(column.sort?.direction)}
                className={cn(column.align === "end" && "text-right", column.grow && "w-full")}
              >
                {column.sort ? <SortButton column={column} /> : column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const href = rowHref?.(row);
            return (
              <TableRow
                key={rowKey(row)}
                className={cn(href && "cursor-pointer")}
                onClick={
                  href
                    ? (event) => {
                        // A press on a control inside the row (its menu, a link) does its own thing.
                        if ((event.target as HTMLElement).closest("a, button, [role=menuitem]"))
                          return;
                        router.push(href);
                      }
                    : undefined
                }
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={cn(column.align === "end" && "text-right", column.grow && "w-full")}
                  >
                    {column.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {rows.length === 0 && empty}
      {footer}
    </div>
  );
}

function ariaSort(direction: SortDirection | undefined) {
  if (direction === "asc") return "ascending";
  if (direction === "desc") return "descending";
  return undefined;
}

// A sortable heading (Figma Admin/TableHeaderCell): ⇅ in grey until sorted, then ↑ or ↓ and its words in blue.
function SortButton<Row>({ column }: { column: Column<Row> }) {
  const sort = column.sort as ColumnSort;
  const Icon =
    sort.direction === "asc"
      ? ArrowUpIcon
      : sort.direction === "desc"
        ? ArrowDownIcon
        : ChevronsUpDownIcon;
  const className = cn(
    "-mx-1 inline-flex min-h-11 items-center gap-1 rounded-sm px-1 transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
    sort.direction !== "none" && "text-primary hover:text-primary",
  );
  const body = (
    <>
      {column.header}
      <Icon aria-hidden className="size-3.5" />
    </>
  );
  return sort.href ? (
    <Link href={sort.href} scroll={false} className={className}>
      {body}
    </Link>
  ) : (
    <button type="button" onClick={sort.onSort} className={className}>
      {body}
    </button>
  );
}

// The cells of Figma Admin/TableCell (238:24768): each one line, cut with "…" when long.

/** Plain words in the row's second ink: an address, a phone number. */
export function TextCell({ children }: { children: ReactNode }) {
  return <span className="block max-w-80 truncate text-body-sm text-foreground">{children}</span>;
}

/** The row's name, which links to the row's page when it has one. */
export function StrongCell({ children, href }: { children: ReactNode; href?: string }) {
  return href ? (
    <Link
      href={href}
      className="block max-w-80 truncate rounded-sm text-body-sm-strong text-foreground hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      {children}
    </Link>
  ) : (
    <span className="block max-w-80 truncate text-body-sm-strong text-foreground">{children}</span>
  );
}

/** A photo with rounded corners and the row's name (Style 6.1: a store's photo, not its initials). */
export function MediaCell({ src, name, href }: { src?: string; name: string; href?: string }) {
  return (
    <span className="flex min-w-56 items-center gap-2.5">
      {src ? (
        <Image
          src={src}
          alt=""
          width={36}
          height={36}
          unoptimized
          className="size-9 shrink-0 rounded-md object-cover"
        />
      ) : (
        <span aria-hidden className="size-9 shrink-0 rounded-md bg-muted" />
      )}
      <StrongCell href={href}>{name}</StrongCell>
    </span>
  );
}

/** An amount, strong and at the end of its cell: "57.000đ". The page formats it. */
export function AmountCell({ children }: { children: ReactNode }) {
  return <span className="text-body-sm-strong text-foreground tabular-nums">{children}</span>;
}

/** A day, muted: "20/10/2026". */
export function DateCell({ value }: { value: Date | string }) {
  const format = useFormatter();
  const at = typeof value === "string" ? new Date(value) : value;
  return (
    <time dateTime={at.toISOString()} className="text-body-sm text-muted-foreground">
      {format.dateTime(at, "day")}
    </time>
  );
}
