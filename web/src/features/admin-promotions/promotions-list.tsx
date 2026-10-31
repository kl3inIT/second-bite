"use client";

import { EllipsisIcon, EyeIcon, TagIcon } from "lucide-react";
import { debounce, useQueryStates } from "nuqs";
import { useFormatter, useTranslations } from "next-intl";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Empty, EmptyContent, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable, type DataTableColumns } from "@/features/admin/data-table";
import { ListFooter } from "@/features/admin/list-footer";
import { SearchBox } from "@/features/admin/search-box";
import { formatPrice } from "@/features/offers/format";
import { Link } from "@/i18n/navigation";
import type { PromotionBody, PromotionCountsBody } from "@/lib/api/generated";
import { cn } from "@/lib/utils";

import { PromotionStatusBadge, statusLook } from "./promotion-status";
import {
  cardStatuses,
  promotionPageSizes,
  promotionSearchParams,
  serializePromotionSearchParams,
} from "./search-params";

const anyStore = "all";

const linkLook =
  "hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none";

/**
 * The promotions (buyer-discount increment), drawn as every admin list is: a card for those running, scheduled and
 * ended, each with its count, which filters the list when pressed; words, a store and the page size in the address;
 * a page the server read for them, the latest start first, each with what its budget has spent. A promotion's name
 * opens it.
 */
export function PromotionsList({
  promotions,
  total,
  counts,
  stores,
}: {
  promotions: PromotionBody[];
  total: number;
  counts: PromotionCountsBody;
  stores: Array<{ id: string; name: string }>;
}) {
  const t = useTranslations("Admin.promotions");
  const [pending, startTransition] = useTransition();
  const [params, setParams] = useQueryStates(promotionSearchParams, {
    shallow: false,
    startTransition,
  });
  const columns = useColumns(stores);
  const filtered = params.q !== "" || params.status !== null || params.store !== null;

  return (
    <section aria-label={t("title")} className="flex flex-col gap-5">
      <fieldset className="grid min-w-0 gap-4 sm:grid-cols-3">
        <legend className="sr-only">{t("cards")}</legend>
        {cardStatuses.map((status) => {
          const { tone, icon: Icon } = statusLook[status];
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
                className={cn("flex size-11 shrink-0 items-center justify-center rounded-md", tone)}
              >
                <Icon aria-hidden className="size-5.5" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-body-sm-strong text-muted-foreground">
                  {t(`status.${status}`)}
                </span>
                <span className="font-display text-display text-foreground">{counts[status]}</span>
              </span>
            </button>
          );
        })}
      </fieldset>
      <div className="flex flex-wrap items-center gap-3">
        <SearchBox
          label={t("search")}
          className="sm:w-auto sm:flex-1"
          value={params.q}
          onChange={(q) =>
            void setParams(
              { q, page: null },
              { limitUrlUpdates: q === "" ? undefined : debounce(300) },
            )
          }
        />
        <Select
          value={params.store ?? anyStore}
          items={[
            { value: anyStore, label: t("anyStore") },
            ...stores.map((s) => ({ value: s.id, label: s.name })),
          ]}
          onValueChange={(store) =>
            void setParams({ store: store === anyStore ? null : store, page: null })
          }
        >
          <SelectTrigger size="lg" aria-label={t("store")}>
            <span className="text-muted-foreground">{t("store")}:</span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={anyStore}>{t("anyStore")}</SelectItem>
              {stores.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          value={String(params.size)}
          items={promotionPageSizes.map((size) => ({ value: String(size), label: String(size) }))}
          onValueChange={(size) =>
            void setParams({
              size: Number(size) as (typeof promotionPageSizes)[number],
              page: null,
            })
          }
        >
          <SelectTrigger size="lg" aria-label={t("size")}>
            <span className="text-muted-foreground">{t("size")}:</span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {promotionPageSizes.map((size) => (
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
        rows={promotions}
        rowKey={(promotion) => promotion.id}
        busy={pending}
        empty={
          <Empty>
            <EmptyHeader>
              <EmptyTitle>{filtered ? t("noResults.title") : t("empty.title")}</EmptyTitle>
            </EmptyHeader>
            {filtered && (
              <EmptyContent>
                <Button
                  variant="outline"
                  onClick={() => void setParams({ q: null, status: null, store: null, page: null })}
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
            hrefOf={(page) => serializePromotionSearchParams({ ...params, page })}
            onPage={(page) => void setParams({ page })}
          />
        }
      />
    </section>
  );
}

function useColumns(stores: Array<{ id: string; name: string }>): DataTableColumns<PromotionBody> {
  const t = useTranslations("Admin.promotions");
  const format = useFormatter();
  const day = (at: string) => format.dateTime(new Date(at), "dayMonth");
  const names = new Map(stores.map((s) => [s.id, s.name]));

  return [
    {
      id: "name",
      header: t("column.name"),
      meta: { width: "w-56" },
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-fresh-muted text-success">
            <TagIcon aria-hidden className="size-4.5" />
          </span>
          <Link
            href={`/admin/promotions/${row.original.id}`}
            className={cn("truncate text-body-sm-strong text-foreground", linkLook)}
          >
            {row.original.name}
          </Link>
        </div>
      ),
    },
    {
      id: "stores",
      header: t("column.stores"),
      meta: { width: "w-40" },
      cell: ({ row }) =>
        row.original.allSellers
          ? t("allStores")
          : row.original.sellerIds.length === 1
            ? (names.get(row.original.sellerIds[0] ?? "") ?? t("someStores", { count: 1 }))
            : t("someStores", { count: row.original.sellerIds.length }),
    },
    {
      id: "time",
      header: t("column.time"),
      meta: { width: "w-32" },
      cell: ({ row }) =>
        t("range", { from: day(row.original.startsAt), until: day(row.original.endsAt) }),
    },
    {
      id: "rules",
      header: t("column.rules"),
      meta: { width: "w-24" },
      cell: ({ row }) => t("ruleCount", { count: row.original.rules.length }),
    },
    {
      id: "budget",
      header: t("column.budget"),
      meta: { width: "w-48" },
      cell: ({ row }) => {
        const { budgetVnd, use } = row.original;
        const used = use.spentVnd + use.heldVnd;
        return (
          <div className="flex flex-col gap-1">
            <span className="whitespace-nowrap">
              {t("used", { used: formatPrice(used), budget: formatPrice(budgetVnd) })}
            </span>
            <Progress
              value={Math.min(100, (used / budgetVnd) * 100)}
              aria-label={t("usedLabel", { name: row.original.name })}
              className="w-36"
            />
          </div>
        );
      },
    },
    {
      id: "status",
      header: t("column.status"),
      meta: { width: "w-36" },
      cell: ({ row }) => <PromotionStatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      header: () => <span className="sr-only">{t("column.actions")}</span>,
      meta: { width: "w-16" },
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={t("actions", { name: row.original.name })}
                />
              }
            >
              <EllipsisIcon aria-hidden />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem render={<Link href={`/admin/promotions/${row.original.id}`} />}>
                <EyeIcon aria-hidden />
                {t("view")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];
}
