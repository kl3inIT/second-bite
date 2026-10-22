"use client";

import { CircleCheckIcon, ClockIcon, TimerOffIcon, type LucideIcon } from "lucide-react";
import { debounce, useQueryStates } from "nuqs";
import { useFormatter, useTranslations } from "next-intl";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable, type DataTableColumns } from "@/features/admin/data-table";
import { DayRange } from "@/features/admin/day-range";
import { ListFooter } from "@/features/admin/list-footer";
import { SearchBox } from "@/features/admin/search-box";
import { StoreThumb } from "@/features/admin-sellers/seller-parts";
import { formatPrice } from "@/features/offers/format";
import { Link } from "@/i18n/navigation";
import type { OrderBody, OrderCountsBody } from "@/lib/api/generated";
import { cn } from "@/lib/utils";

import { OrderActions } from "./order-actions";
import { OrderStatusBadge } from "./order-status";
import {
  cardStates,
  orderPageSizes,
  orderSearchParams,
  serializeOrderSearchParams,
  type CardState,
} from "./search-params";

const anyStore = "all";

// Each card's icon on its tint (Figma AD-DH1 › Card): the colours of the statuses it holds, as their badges
// have them.
const cardLook: Record<CardState, { tone: string; icon: LucideIcon }> = {
  collected: { tone: "bg-fresh-muted text-success", icon: CircleCheckIcon },
  waiting: { tone: "bg-warning text-warning-foreground", icon: ClockIcon },
  expired: { tone: "bg-muted text-muted-foreground", icon: TimerOffIcon },
};

/** The count each card shows, from the API's count of each status. */
function countOf(state: CardState, counts: OrderCountsBody): number {
  return state === "waiting" ? counts.confirmed + counts.ready : counts[state];
}

const linkLook =
  "hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none";

/**
 * Every store's orders (Figma AD-DH1, SEC-135): a card for those handed over, those still to collect and
 * those not come for, each with its count, which filters the list when pressed; words, a store, the
 * collection days and the page size in the address; a page of orders the server read for them, the latest
 * window first; an order's number opens its page. Admins read orders and never act for a store: cancelling
 * is not offered.
 */
export function OrdersList({
  orders,
  total,
  counts,
  stores,
}: {
  orders: OrderBody[];
  total: number;
  counts: OrderCountsBody;
  stores: Array<{ id: string; name: string }>;
}) {
  const t = useTranslations("Admin.orders");
  const [pending, startTransition] = useTransition();
  const [params, setParams] = useQueryStates(orderSearchParams, {
    shallow: false,
    startTransition,
  });
  const columns = useColumns();
  const filtered =
    params.q !== "" || params.state !== null || params.store !== null || params.from !== null;

  return (
    <section aria-label={t("title")} className="flex flex-col gap-5">
      <fieldset className="grid min-w-0 gap-4 sm:grid-cols-3">
        <legend className="sr-only">{t("cards")}</legend>
        {cardStates.map((state) => {
          const { tone, icon: Icon } = cardLook[state];
          const selected = params.state === state;
          return (
            <button
              key={state}
              type="button"
              aria-pressed={selected}
              onClick={() => void setParams({ state: selected ? null : state, page: null })}
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
                  {t(`card.${state}`)}
                </span>
                <span className="font-display text-display text-foreground">
                  {countOf(state, counts)}
                </span>
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
        <DayRange
          label={t("collectionDay")}
          anytime={t("anytime")}
          from={params.from}
          to={params.to}
          onChange={(from, to) => void setParams({ from, to, page: null })}
        />
        <Select
          value={String(params.size)}
          items={orderPageSizes.map((size) => ({ value: String(size), label: String(size) }))}
          onValueChange={(size) =>
            void setParams({ size: Number(size) as (typeof orderPageSizes)[number], page: null })
          }
        >
          <SelectTrigger size="lg" aria-label={t("size")}>
            <span className="text-muted-foreground">{t("size")}:</span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {orderPageSizes.map((size) => (
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
        rows={orders}
        rowKey={(order) => order.id}
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
                  onClick={() =>
                    void setParams({
                      q: null,
                      state: null,
                      store: null,
                      from: null,
                      to: null,
                      page: null,
                    })
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
            hrefOf={(page) => serializeOrderSearchParams({ ...params, page })}
            onPage={(page) => void setParams({ page })}
          />
        }
      />
    </section>
  );
}

function useColumns(): DataTableColumns<OrderBody> {
  const t = useTranslations("Admin.orders");
  const format = useFormatter();
  const time = (at: string) => format.dateTime(new Date(at), "time");
  const summary = useLinesSummary();

  return [
    {
      id: "store",
      header: t("column.store"),
      meta: { width: "w-52" },
      // An order carries its store's name, not its photo, so the store shows as its initials (StoreThumb). The
      // name opens the order, as every list's first column opens its item; the order's page leads to the store.
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <StoreThumb seller={row.original.seller} />
          <Link
            href={`/admin/orders/${row.original.id}`}
            className={cn("truncate text-body-sm-strong text-foreground", linkLook)}
          >
            {row.original.seller.name}
          </Link>
        </div>
      ),
    },
    {
      id: "customer",
      header: t("column.customer"),
      meta: { width: "w-28" },
      cell: ({ row }) => row.original.customerName,
    },
    {
      id: "lines",
      header: t("column.lines"),
      meta: { width: "w-52" },
      cell: ({ row }) => <span className="text-muted-foreground">{summary(row.original)}</span>,
    },
    {
      id: "number",
      header: t("column.number"),
      meta: { width: "w-28" },
      cell: ({ row }) => (
        <Link
          href={`/admin/orders/${row.original.id}`}
          className={cn("text-body-sm-strong whitespace-nowrap text-link", linkLook)}
        >
          {row.original.number}
        </Link>
      ),
    },
    {
      id: "total",
      header: t("column.total"),
      meta: { width: "w-24" },
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{formatPrice(row.original.totalVnd)}</span>
      ),
    },
    {
      id: "status",
      header: t("column.status"),
      meta: { width: "w-48" },
      cell: ({ row }) => <OrderStatusBadge status={row.original.status} />,
    },
    {
      id: "window",
      header: t("column.window"),
      meta: { width: "w-28" },
      cell: ({ row }) =>
        t("window", { from: time(row.original.windowStart), until: time(row.original.windowEnd) }),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">{t("column.actions")}</span>,
      meta: { width: "w-16" },
      cell: ({ row }) => <OrderActions order={row.original} />,
    },
  ];
}

/** What an order holds, as AD-DH1's "Món" reads it: its first two lines, then how many more. */
export function useLinesSummary() {
  const t = useTranslations("Admin.orders");
  return (order: OrderBody) => {
    const shown = order.lines.slice(0, 2).map((l) => t("line", { name: l.name, units: l.units }));
    const more = order.lines.length - shown.length;
    return (more > 0 ? [...shown, t("moreLines", { count: more })] : shown).join(", ");
  };
}
