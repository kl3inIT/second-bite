import { Fragment } from "react";
import { useFormatter, useTranslations } from "next-intl";

import { BackButton } from "@/components/back-button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { StoreMap } from "@/components/map/store-map";
import { formatPrice } from "@/features/offers/format";
import { directionsHref } from "@/features/offers/offer";
import { customerOf, dishesOf, savingOf, unitsOf, type Order } from "@/features/orders/order";
import { Photo } from "@/features/orders/order-parts";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

// What the two chat screens are built from (Figma K7, Q7, WK8, Q5m): the order's card at the head of the chat,
// the order's details in the column beside it on a wide screen, the breadcrumb and the frame.

/**
 * The order's card at the head of a chat (Figma K7, WK8): its first dish's photo, the dishes and the window, and
 * what it costs above what it would have cost. A seller's phone names the order instead of the dishes (Figma Q7).
 */
export function ChatOrderCard({ order, phoneTitle }: { order: Order; phoneTitle?: string }) {
  const t = useTranslations("Chat");
  const orders = useTranslations("Orders");
  const format = useFormatter();
  const dishes = dishesOf(order);

  return (
    <div className="flex h-21 shrink-0 items-center gap-3 rounded-2xl bg-card p-3.5 text-card-foreground">
      <Photo path={order.lines[0]?.photo.smallPath} sizes="56px" className="size-14 rounded-md" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="truncate text-body-sm-strong">
          {phoneTitle ? (
            <>
              <span className="md:hidden">{phoneTitle}</span>
              <span className="max-md:hidden">{dishes}</span>
            </>
          ) : (
            dishes
          )}
        </p>
        <p className="truncate text-label text-muted-foreground">
          {t("cardMeta", {
            units: unitsOf(order),
            from: format.dateTime(new Date(order.windowStart), "time"),
            until: format.dateTime(new Date(order.windowEnd), "time"),
          })}
        </p>
      </div>
      <p className="flex shrink-0 flex-col items-end">
        <span className="font-display text-price">{formatPrice(order.payVnd)}</span>
        <s className="text-label text-muted-foreground">
          <span className="sr-only">{orders("originalPrice")}</span>
          {formatPrice(order.payVnd + savingOf(order))}
        </s>
      </p>
    </div>
  );
}

/** The card of the details beside a chat: the order's number above what the screen's reader needs of it. */
function DetailsCard({ order, children }: { order: Order; children: React.ReactNode }) {
  const orders = useTranslations("Orders");
  const t = useTranslations("Chat");

  return (
    <section
      aria-label={t("details")}
      className="flex flex-col gap-4 rounded-3xl bg-card p-6 text-card-foreground shadow-card"
    >
      <h2 className="font-display text-headline">
        {orders("orderNumber", { number: order.number })}
      </h2>
      {children}
    </section>
  );
}

/** The seller of an order beside the customer's chat (Figma WK8): the map, the counter, when to collect and the way. */
export function SellerDetails({ order }: { order: Order }) {
  const t = useTranslations("Chat");
  const orders = useTranslations("Orders");
  const format = useFormatter();

  return (
    <DetailsCard order={order}>
      <div className="flex items-center gap-3 rounded-lg border border-border px-3.5 py-3">
        <StoreMap
          point={order.seller}
          label={orders("mapTitle", { seller: order.seller.name })}
          className="size-16 shrink-0 rounded-md"
        />
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="truncate text-title">{order.seller.name}</p>
          <p className="truncate text-note text-muted-foreground">{order.seller.address}</p>
          <p className="text-note font-medium">
            {t("pickup", {
              from: format.dateTime(new Date(order.windowStart), "time"),
              until: format.dateTime(new Date(order.windowEnd), "time"),
            })}
          </p>
          <a
            href={directionsHref(order.seller)}
            target="_blank"
            rel="noopener noreferrer"
            className="relative w-fit rounded-xs text-note font-semibold text-primary after:absolute after:-inset-2 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            {orders("directions")}
            <span className="sr-only">{orders("opensMaps")}</span>
          </a>
        </div>
      </div>
      <CancelPolicy />
    </DetailsCard>
  );
}

/** The cancellation rule, as the checkout words it (Figma WK8 › Chính sách huỷ). */
function CancelPolicy() {
  const t = useTranslations("Cart");

  return (
    <section aria-labelledby="chat-cancel" className="flex flex-col gap-1">
      <h3 id="chat-cancel" className="text-label-strong text-muted-foreground uppercase">
        {t("cancelTitle")}
      </h3>
      <p className="text-note text-muted-foreground">{t("cancelBody")}</p>
    </section>
  );
}

/** A name's first and last letters in capitals: "Lê Thu Hà" is "LH". */
function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/);
  const letters = words.length > 1 ? [words[0], words.at(-1)] : words;
  return letters.map((word) => word?.[0]?.toLocaleUpperCase("vi") ?? "").join("");
}

/** The customer of an order beside the seller's chat (Figma Q5m): who, their number, where the order stands. */
export function CustomerDetails({ order }: { order: Order }) {
  const t = useTranslations("Chat");
  const customer = customerOf(order, useTranslations("Orders")("customerGone"));
  const format = useFormatter();
  const time = (value: string) => format.dateTime(new Date(value), "time");
  const open = order.status === "confirmed" || order.status === "ready";

  return (
    <DetailsCard order={order}>
      <div className="flex items-center gap-3 rounded-lg border border-border px-3.5 py-3">
        <span
          aria-hidden
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted text-title-lg text-primary"
        >
          {initialsOf(customer)}
        </span>
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="truncate text-title">
            {t("who", { name: customer, units: unitsOf(order) })}
          </p>
          <p className="truncate text-note text-muted-foreground">
            {order.customerPhone
              ? t("placedAt", { phone: order.customerPhone, time: time(order.createdAt) })
              : t("placedAtTime", { time: time(order.createdAt) })}
          </p>
          <p className="text-note font-medium">
            {open
              ? `${t(`state.${order.status}`)} · ${t("window", { from: time(order.windowStart), until: time(order.windowEnd) })}`
              : t(`state.${order.status}`)}
          </p>
          <Link
            href={`/stores/${order.seller.id}/orders/${order.id}`}
            className="relative w-fit rounded-xs text-note font-semibold text-primary after:absolute after:-inset-2 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            {t("seeOrder")}
          </Link>
        </div>
      </div>
    </DetailsCard>
  );
}

/** The blue bar of a seller's chat on a phone (Figma Q7): the round back button and the customer's name. */
export function ChatBar({ title, back }: { title: string; back: string }) {
  return (
    <header className="bg-header text-header-foreground md:hidden">
      <div className="mx-auto flex h-16 w-full max-w-xl items-center gap-3 px-4">
        <BackButton fallback={back} />
        <h1 className="truncate text-bar-title">{title}</h1>
      </div>
    </header>
  );
}

export type Crumb = { label: string; href?: string };

/**
 * One chat screen: the header the page brings, then on a wide screen the breadcrumb and the chat in its frame with
 * the details beside it from 1024px; on a phone the chat fills what is left of the screen under the bar
 * (Figma K7, WK8, Q5m). The page marks itself `data-no-footer`: the chat is a screen of its own. `className`
 * lets a seller's phone take back the padding the store's layout puts round its pages.
 */
export function ChatScreen({
  header,
  crumbs,
  aside,
  main = true,
  className,
  children,
}: {
  header: React.ReactNode;
  crumbs: Crumb[];
  aside: React.ReactNode;
  /** Whether the screen is the page's `main`; a store's pages have the layout's. */
  main?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const t = useTranslations("Chat");
  const Content = main ? "main" : "div";

  return (
    <div
      data-no-footer
      className={cn("flex h-dvh min-h-120 flex-col md:block md:h-auto md:min-h-0", className)}
    >
      {header}
      <Content className="mx-auto flex min-h-0 w-full max-w-248 flex-1 flex-col md:gap-6 md:px-4 md:py-8">
        <Breadcrumb aria-label={t("breadcrumb")} className="max-md:hidden">
          <BreadcrumbList>
            {crumbs.map(({ label, href }, index) => (
              <Fragment key={label}>
                {index > 0 ? <BreadcrumbSeparator /> : null}
                <BreadcrumbItem>
                  {href ? (
                    <BreadcrumbLink render={<Link href={href} />}>{label}</BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex min-h-0 flex-1 items-start gap-8">
          <div className="flex min-h-0 min-w-0 flex-1 flex-col self-stretch overflow-hidden bg-card md:h-160 md:self-auto md:rounded-3xl md:border md:border-border">
            {children}
          </div>
          <aside className="hidden w-87 shrink-0 flex-col gap-4 lg:flex">{aside}</aside>
        </div>
      </Content>
    </div>
  );
}
