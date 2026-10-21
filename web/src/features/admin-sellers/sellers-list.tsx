"use client";

import { SearchIcon } from "lucide-react";
import { debounce, useQueryStates } from "nuqs";
import { useFormatter, useTranslations } from "next-intl";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DataTable,
  SortHeader,
  type DataTableColumns,
  type Sorted,
} from "@/features/admin/data-table";
import { DayRange } from "@/features/admin/day-range";
import { ListFooter } from "@/features/admin/list-footer";
import { Link } from "@/i18n/navigation";
import type { AdminSellerBody, StatusCountsBody, StatusDayBody } from "@/lib/api/generated";
import { cn } from "@/lib/utils";

import {
  cardStatuses,
  sellerPageSizes,
  sellerSearchParams,
  serializeSellerSearchParams,
  sortedOf,
  sortOf,
  type SellerSortColumn,
} from "./search-params";
import { shownPhone, statusLook, StatusBadge, StoreThumb } from "./seller-parts";
import type { Province } from "./provinces";
import { Sparkline } from "./sparkline";
import { StoreActions } from "./store-actions";

const anywhere = "all";

// Each card's icon on its tint (Figma AD-Q1 › Card): the status's colours, as its badge has them.
const cardTone = {
  active: "bg-fresh-muted text-success",
  pending: "bg-warning text-warning-foreground",
  blocked: "bg-destructive-muted text-destructive",
} as const;

/**
 * The stores (Figma AD-Q1, SEC-62): a card per status with its count, which filters the list when pressed,
 * words and the page size in the address, a page of stores the server read for them, sorted by the head
 * pressed, and each row's actions. The cards follow the words searched, as the server counts them.
 */
export function SellersList({
  sellers,
  total,
  counts,
  days,
  provinces,
}: {
  sellers: AdminSellerBody[];
  total: number;
  counts: StatusCountsBody;
  days: StatusDayBody[];
  provinces: Province[];
}) {
  const t = useTranslations("Admin.sellers");
  const [pending, startTransition] = useTransition();
  const [params, setParams] = useQueryStates(sellerSearchParams, {
    shallow: false,
    startTransition,
  });
  const sorted = sortedOf(params.sort);
  const columns = useColumns(
    sorted,
    (column, direction) => void setParams({ sort: sortOf(column, direction), page: null }),
  );
  const filtered = params.q !== "" || params.status !== null || params.from !== null;

  return (
    <section aria-label={t("title")} className="flex flex-col gap-5">
      <fieldset className="grid min-w-0 gap-4 sm:grid-cols-3">
        <legend className="sr-only">{t("cards")}</legend>
        {cardStatuses.map((status) => {
          const Icon = statusLook[status].icon;
          const selected = params.status === status;
          return (
            <button
              key={status}
              type="button"
              aria-pressed={selected}
              onClick={() => void setParams({ status: selected ? null : status, page: null })}
              className={cn(
                "flex items-center gap-4 rounded-2xl border border-border bg-card p-4 text-start transition-colors hover:border-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                selected && "border-primary ring-1 ring-primary",
              )}
            >
              <span
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-md",
                  cardTone[status],
                )}
              >
                <Icon aria-hidden className="size-5.5" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-body-sm-strong text-muted-foreground">
                  {t(`status.${status}`)}
                </span>
                <span className="font-display text-display text-foreground">{counts[status]}</span>
              </span>
              <Sparkline status={status} days={days} />
            </button>
          );
        })}
      </fieldset>
      <div className="flex flex-wrap items-center gap-3">
        <SearchBox
          value={params.q}
          onChange={(q) =>
            void setParams(
              { q, page: null },
              { limitUrlUpdates: q === "" ? undefined : debounce(300) },
            )
          }
        />
        <Select
          value={String(params.province ?? anywhere)}
          items={[
            { value: anywhere, label: t("anyArea") },
            ...provinces.map((p) => ({ value: String(p.code), label: p.name })),
          ]}
          // The province is kept in the address only: the list filters by it once a seller has one (SEC-66).
          onValueChange={(code) =>
            void setParams({ province: code === anywhere ? null : Number(code), page: null })
          }
        >
          <SelectTrigger size="lg" aria-label={t("area")}>
            <span className="text-muted-foreground">{t("area")}:</span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={anywhere}>{t("anyArea")}</SelectItem>
              {provinces.map((p) => (
                <SelectItem key={p.code} value={String(p.code)}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <DayRange
          label={t("changed")}
          anytime={t("anytime")}
          from={params.from}
          to={params.to}
          onChange={(from, to) => void setParams({ from, to, page: null })}
        />
        <Select
          value={String(params.size)}
          items={sellerPageSizes.map((size) => ({ value: String(size), label: String(size) }))}
          onValueChange={(size) =>
            void setParams({ size: Number(size) as (typeof sellerPageSizes)[number], page: null })
          }
        >
          <SelectTrigger size="lg" aria-label={t("size")}>
            <span className="text-muted-foreground">{t("size")}:</span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {sellerPageSizes.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <DataTable
        label={t("title")}
        columns={columns}
        rows={sellers}
        rowKey={(seller) => seller.id}
        busy={pending}
        sorted={sorted}
        empty={
          <Empty>
            <EmptyHeader>
              <EmptyTitle>{filtered ? t("noResults.title") : t("empty.title")}</EmptyTitle>
            </EmptyHeader>
            {filtered && (
              <EmptyContent>
                <Button
                  variant="outline"
                  onClick={() =>
                    void setParams({ q: null, status: null, from: null, to: null, page: null })
                  }
                >
                  {t("noResults.clear")}
                </Button>
              </EmptyContent>
            )}
          </Empty>
        }
        footer={
          <ListFooter
            page={params.page}
            pageSize={params.size}
            total={total}
            noun={t("noun")}
            hrefOf={(page) => serializeSellerSearchParams({ ...params, page })}
            onPage={(page) => void setParams({ page })}
          />
        }
      />
    </section>
  );
}

function SearchBox({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const t = useTranslations("Admin.sellers");
  const [text, setText] = useState(value);

  return (
    <InputGroup className="h-11 w-full sm:w-auto sm:flex-1">
      <InputGroupAddon>
        <SearchIcon aria-hidden />
      </InputGroupAddon>
      <InputGroupInput
        type="search"
        aria-label={t("search")}
        placeholder={t("search")}
        value={text}
        maxLength={100}
        onChange={(event) => {
          setText(event.target.value);
          onChange(event.target.value.trim());
        }}
      />
    </InputGroup>
  );
}

function useColumns(
  sorted: Sorted | null,
  onSort: (column: SellerSortColumn, direction: Sorted["direction"]) => void,
): DataTableColumns<AdminSellerBody> {
  const t = useTranslations("Admin.sellers");
  const format = useFormatter();
  const sortable = (column: SellerSortColumn, label: string) => (
    <SortHeader
      label={label}
      column={column}
      sorted={sorted}
      onSort={(direction) => onSort(column, direction)}
    />
  );

  return [
    {
      id: "name",
      header: () => sortable("name", t("column.store")),
      cell: ({ row }) => (
        <div className="flex min-w-48 items-center gap-2.5">
          <StoreThumb seller={row.original} />
          <Link
            href={`/admin/sellers/${row.original.id}`}
            className="text-body-sm-strong text-foreground hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            {row.original.name}
          </Link>
        </div>
      ),
    },
    {
      id: "address",
      header: () => sortable("address", t("column.address")),
      cell: ({ row }) => <span className="min-w-48">{row.original.address}</span>,
    },
    {
      id: "phone",
      header: t("column.phone"),
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{shownPhone(row.original.phone)}</span>
      ),
    },
    {
      id: "status",
      header: t("column.status"),
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: "changed",
      header: () => sortable("changed", t("column.changed")),
      cell: ({ row }) => (
        <time dateTime={row.original.updatedAt} className="whitespace-nowrap">
          {format.dateTime(new Date(row.original.updatedAt), "day")}
        </time>
      ),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">{t("column.actions")}</span>,
      cell: ({ row }) => <StoreActions seller={row.original} />,
    },
  ];
}
