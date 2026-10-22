"use client";

import { LayoutGridIcon, ListIcon } from "lucide-react";
import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import { parseAsStringLiteral, useQueryStates } from "nuqs";
import { useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Empty, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DataTable, type DataTableColumns } from "@/features/admin/data-table";
import { ListFooter } from "@/features/admin/list-footer";
import { OfferActions } from "@/features/admin-offers/offer-actions";
import { formatPrice } from "@/features/offers/format";
import { Link } from "@/i18n/navigation";
import type { OfferBody } from "@/lib/api/generated";
import { photoUrl } from "@/lib/api/photo";

import { OfferRow } from "./offer-row";

const postStatuses = ["on_sale", "sold_out", "closed", "withdrawn"] as const;
const views = ["grid", "list"] as const;

/** Which of a store's posts show and how, kept in the address beside the tab. */
const postParams = {
  posts: parseAsStringLiteral(postStatuses).withDefault("on_sale"),
  view: parseAsStringLiteral(views).withDefault("grid"),
};

/**
 * The "Bài đăng" tab of a store's page (Figma AD-QD1, AD-QD1b, AD-QD2): the posts of one status, chosen with
 * their counts, as framed boxes or as a table; a post opens its panel (AD-QD3). The page reads every post of
 * the store once, so choosing a status or a view asks the server nothing.
 */
export function SellerPosts({ offers }: { offers: OfferBody[] }) {
  const t = useTranslations("Admin.sellers.detail");
  const [{ posts: status, view }, setParams] = useQueryStates(postParams);
  const [open, setOpen] = useState<OfferBody | null>(null);
  const shown = offers.filter((offer) => offer.status === status);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ToggleGroup
          variant="segment"
          aria-label={t("postStatus.label")}
          value={[status]}
          onValueChange={(chosen: string[]) => {
            const next = postStatuses.find((s) => s === chosen[0]);
            if (next) void setParams({ posts: next === "on_sale" ? null : next });
          }}
          className="flex-wrap"
        >
          {postStatuses.map((s) => (
            <ToggleGroupItem key={s} value={s}>
              {t(`postStatus.${s}`, { count: offers.filter((o) => o.status === s).length })}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <ToggleGroup
          variant="segment"
          aria-label={t("view.label")}
          value={[view]}
          onValueChange={(chosen: string[]) => {
            const next = views.find((v) => v === chosen[0]);
            if (next) void setParams({ view: next === "grid" ? null : next });
          }}
        >
          <ToggleGroupItem value="list" aria-label={t("view.list")}>
            <ListIcon aria-hidden />
          </ToggleGroupItem>
          <ToggleGroupItem value="grid" aria-label={t("view.grid")}>
            <LayoutGridIcon aria-hidden />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      {view === "list" ? (
        <PostsTable offers={shown} onOpen={setOpen} />
      ) : (
        <Card size="lg">
          <CardContent className="@container">
            {shown.length === 0 ? (
              <NoPosts />
            ) : (
              <ul className="grid gap-4 @xl:grid-cols-2 @4xl:grid-cols-3 @6xl:grid-cols-4">
                {shown.map((offer) => (
                  <OfferRow key={offer.id} offer={offer} onOpen={() => setOpen(offer)} />
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}
      <PostPanel offer={open} onClose={() => setOpen(null)} />
    </div>
  );
}

function NoPosts() {
  const t = useTranslations("Admin.sellers.detail");

  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>{t("noneInStatus")}</EmptyTitle>
      </EmptyHeader>
    </Empty>
  );
}

// The posts as Figma AD-QD1b draws them: the dish, its price, the discount, what is left and the window, and
// an eye that opens the post's panel.
function PostsTable({
  offers,
  onOpen,
}: {
  offers: OfferBody[];
  onOpen: (offer: OfferBody) => void;
}) {
  const t = useTranslations("Admin.sellers.detail");
  const format = useFormatter();
  const time = (at: string) => format.dateTime(new Date(at), "time");

  const sellers = useTranslations("Admin.sellers");
  const columns: DataTableColumns<OfferBody> = [
    {
      id: "post",
      header: t("column.post"),
      meta: { width: "w-72" },
      cell: ({ row }) => (
        <span className="flex items-center gap-3">
          <span className="relative size-9 shrink-0 overflow-hidden rounded-md bg-muted">
            <Image
              src={photoUrl(row.original.photo.smallPath)}
              alt=""
              fill
              sizes="36px"
              unoptimized
              className="object-cover"
            />
          </span>
          <span className="truncate text-body-sm-strong">{row.original.name}</span>
        </span>
      ),
    },
    {
      id: "price",
      header: t("column.price"),
      meta: { width: "w-24" },
      cell: ({ row }) => formatPrice(row.original.priceVnd),
    },
    {
      id: "discount",
      header: t("column.discount"),
      meta: { width: "w-20" },
      cell: ({ row }) => t("discount", { discount: row.original.discountPercent }),
    },
    {
      id: "left",
      header: t("column.left"),
      meta: { width: "w-28" },
      cell: ({ row }) =>
        t("unitsLeft", {
          left: row.original.unitsLeft,
          units: row.original.units,
          unit: row.original.unit,
        }),
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
      header: () => <span className="sr-only">{sellers("column.actions")}</span>,
      meta: { width: "w-16" },
      cell: ({ row }) => <OfferActions offer={row.original} onOpen={onOpen} />,
    },
  ];

  return (
    <DataTable
      label={t("postsTable")}
      columns={columns}
      rows={offers}
      rowKey={(offer) => offer.id}
      empty={<NoPosts />}
      footer={
        offers.length > 0 && (
          <ListFooter
            page={1}
            pageSize={offers.length}
            total={offers.length}
            noun={t("postNoun")}
            hrefOf={() => ""}
            onPage={() => {}}
          />
        )
      }
    />
  );
}

// A post in full, beside the store's page (Figma AD-QD3) or the posts of every store (AD-BD2): its photo,
// dish and price, what it says of itself, then its status, units, weight, window, place and when it was
// posted and last changed. Beside every store's posts it ends with a way to the store's page.
export function PostPanel({
  offer,
  onClose,
  withStore = false,
}: {
  offer: OfferBody | null;
  onClose: () => void;
  withStore?: boolean;
}) {
  const t = useTranslations("Admin.sellers.detail");

  return (
    <Sheet open={offer !== null} onOpenChange={(next) => !next && onClose()}>
      <SheetContent side="right" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{t("panel.title")}</SheetTitle>
        </SheetHeader>
        {offer && <PostFacts offer={offer} />}
        {offer && withStore && (
          <SheetFooter>
            <Link
              href={`/admin/sellers/${offer.sellerId}`}
              className={buttonVariants({ variant: "outline" })}
            >
              {t("panel.store")}
            </Link>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

function PostFacts({ offer }: { offer: OfferBody }) {
  const t = useTranslations("Admin.sellers.detail");
  const format = useFormatter();
  const time = (at: string) => format.dateTime(new Date(at), "time");
  const moment = (at: string) =>
    t("panel.at", { day: format.dateTime(new Date(at), "day"), time: time(at) });
  const start = new Date(offer.windowStart);

  const facts: Array<[string, string]> = [
    [t("panel.status"), t(`panel.state.${offer.status}`)],
    [
      t("panel.units"),
      t("panel.unitsLeft", { left: offer.unitsLeft, units: offer.units, unit: offer.unit }),
    ],
    ...(offer.weightGrams
      ? [[t("panel.weight"), t("panel.grams", { grams: offer.weightGrams })] as [string, string]]
      : []),
    [
      t("panel.window"),
      t("panel.windowDay", {
        from: time(offer.windowStart),
        until: time(offer.windowEnd),
        day: format.dateTime(start, "dayOfMonth"),
        month: format.dateTime(start, "monthOfYear"),
      }),
    ],
    [t("panel.place"), offer.collectionPoint.address],
    [t("panel.created"), moment(offer.createdAt)],
    [t("panel.updated"), moment(offer.updatedAt)],
  ];

  return (
    <div className="flex flex-col gap-4 px-4 pb-6">
      <span className="relative aspect-video overflow-hidden rounded-xl bg-muted">
        <Image
          src={photoUrl(offer.photo.largePath)}
          alt=""
          fill
          sizes="560px"
          unoptimized
          className="object-cover"
        />
      </span>
      <div className="flex flex-col gap-1">
        <h3 className="text-title-lg text-foreground">{offer.name}</h3>
        <p className="flex items-baseline gap-2">
          <span className="font-display text-price text-primary">
            {formatPrice(offer.priceVnd)}
          </span>
          <span className="text-label text-muted-foreground line-through">
            {formatPrice(offer.originalPriceVnd)}
          </span>
        </p>
        <p className="text-label-strong text-sale">
          {t("offerLeft", {
            discount: offer.discountPercent,
            left: offer.unitsLeft,
            units: offer.units,
            unit: offer.unit,
          })}
        </p>
      </div>
      {offer.description && (
        <div className="flex flex-col gap-1">
          <h4 className="text-body-sm-strong text-foreground">{t("panel.description")}</h4>
          <p className="text-body-sm text-muted-foreground">{offer.description}</p>
        </div>
      )}
      <Separator />
      <dl className="flex flex-col gap-2 text-body-sm">
        {facts.map(([term, value]) => (
          <div key={term} className="flex justify-between gap-4">
            <dt className="text-muted-foreground">{term}</dt>
            <dd className="text-end text-body-sm-strong">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
