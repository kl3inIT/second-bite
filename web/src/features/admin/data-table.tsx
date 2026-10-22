"use client";

import {
  metaHelper,
  tableFeatures,
  useTable,
  type ColumnDef,
  type RowData,
} from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

/**
 * A column's width, from the spacing scale (`w-32`); the one column without it takes what is left. Once a
 * column has one, the table lays its columns out fixed, so they stay put from one page to the next, and
 * scrolls sideways when narrower than `min-w-5xl`.
 */
type ColumnMeta = { width?: `w-${number}` };

// No feature of TanStack's own: the server filters, sorts and pages (SEC-75 › Lists), and the address holds
// what is asked, so the table only lays out the page it is given.
const features = tableFeatures({ columnMeta: metaHelper<ColumnMeta>() });

export type DataTableColumns<Row extends RowData> = Array<ColumnDef<typeof features, Row>>;

/** The column the server sorted the page by, and which way. */
export type Sorted = { column: string; direction: "ascending" | "descending" };

/**
 * A column's head that sorts the list by it (Figma Admin/Table › header, sortable): its arrow shows the order
 * asked, and a press asks the other way, or ascending when it sorts by another column. The table head carries
 * `aria-sort` from `sorted`.
 */
export function SortHeader({
  label,
  column,
  sorted,
  onSort,
}: {
  label: string;
  column: string;
  sorted: Sorted | null;
  onSort: (direction: Sorted["direction"]) => void;
}) {
  const direction = sorted?.column === column ? sorted.direction : null;
  const Icon =
    direction === "ascending"
      ? ArrowUpIcon
      : direction === "descending"
        ? ArrowDownIcon
        : ChevronsUpDownIcon;

  return (
    <button
      type="button"
      onClick={() => onSort(direction === "ascending" ? "descending" : "ascending")}
      className={cn(
        "-mx-1 inline-flex min-h-11 items-center gap-1 rounded-sm px-1 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        direction && "text-primary",
      )}
    >
      {label}
      <Icon aria-hidden className="size-3.5" />
    </button>
  );
}

/**
 * One page of an admin's list in Figma's Admin/Table: a framed table with a tinted head, a row per item, and
 * `empty` in place of the rows when the page has none. `busy` dims the rows while the next page loads (the table's `aria-busy`).
 */
export function DataTable<Row extends RowData>({
  label,
  columns,
  rows,
  rowKey,
  empty,
  busy = false,
  sorted = null,
  footer,
}: {
  label: string;
  columns: DataTableColumns<Row>;
  rows: Row[];
  rowKey: (row: Row) => string;
  empty: React.ReactNode;
  busy?: boolean;
  /** The column the page is sorted by, for its head's `aria-sort`. */
  sorted?: Sorted | null;
  footer?: React.ReactNode;
}) {
  const table = useTable({ features, columns, data: rows, getRowId: rowKey });
  const fixed = columns.some((column) => column.meta?.width);

  return (
    <div className="overflow-hidden rounded-md border border-border bg-card">
      <Table aria-label={label} aria-busy={busy} className={cn(fixed && "min-w-5xl table-fixed")}>
        {fixed && (
          <colgroup>
            {columns.map((column, index) => (
              <col key={column.id ?? index} className={column.meta?.width} />
            ))}
          </colgroup>
        )}
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id}>
              {group.headers.map((header) => (
                <TableHead
                  key={header.id}
                  aria-sort={sorted?.column === header.column.id ? sorted.direction : undefined}
                >
                  {header.isPlaceholder ? null : (
                    <div className={cn(fixed && "truncate")}>
                      <table.FlexRender header={header} />
                    </div>
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length}>{empty}</TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getAllCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {/* In fixed columns what is too long ends in "…" rather than pushing the next one. */}
                    <div className={cn(fixed && "truncate")}>
                      <table.FlexRender cell={cell} />
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {footer}
    </div>
  );
}
