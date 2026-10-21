import { PlusIcon } from "lucide-react";
import Image from "next/image";
import { getFormatter, getTranslations } from "next-intl/server";

import { HeaderSweep } from "@/components/header-sweep";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/features/offers/format";
import { SellerAvatar } from "@/features/offers/seller-avatar";
import { Link } from "@/i18n/navigation";
import type { OfferBody, SellerBody } from "@/lib/api/generated";
import { cn } from "@/lib/utils";

import { DayBar } from "./day-filter";
import { getStoreDishes, getStoreOffers, getStoreOrders } from "./my-sellers";
import { OrderRow } from "./order-row";
import { PostRow } from "./post-row";
import { requireStore } from "./require-store";
import { ShowDishButton } from "./show-dish-button";
import { readDay, vietnamToday } from "./store-day";
import { offersOfDay } from "./store-offers";
import { groupOrders, orderTabs, readOrderTab, type OrderTab } from "./store-orders";
import { summarizeDay } from "./store-summary";
import { StoreTitleRow } from "./store-title-row";

/** How many orders, posts and dishes the home lists; each card's chips or title lead to the whole tab. */
const SHOWN = 3;

const card =
  "flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 text-card-foreground";

/** The column of a row's badge or button, as wide on every row so they stand on one axis (Figma Q1b). */
const actionColumn = "flex w-31 shrink-0 justify-center";

// The store's home (SEC-57, SEC-124, Figma Q1 and Q1b): on a computer a blue card with the store and its two ways on, on a
// phone the tab's name in the header and a round "Đăng món" over the bottom bar. Then a day's overview — the orders
// held, the cash taken at the counter, the units sold, the customers who did not come — for the day the address
// names (today when it names none), what to do now, and short lists of the day's orders, the day's posts and the
// catalog. Until the store has posted anything it invites the first post. It reads the session, so it renders
// inside Suspense.
export async function StoreHome({
  sellerId: pendingId,
  query: pendingQuery,
}: {
  sellerId: Promise<string>;
  query: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sellerId = await pendingId;
  const query = await pendingQuery;
  const one = (name: string) => (typeof query[name] === "string" ? query[name] : undefined);

  // The session is read before the clock, so the page is made for each request and never at build time.
  const store = await requireStore(sellerId, `/stores/${sellerId}`);
  const today = vietnamToday();
  const day = readDay(one("day"), today);
  const tab = readOrderTab(one("tab"));

  const [t, n, format, offers, orders, dishes] = await Promise.all([
    getTranslations("StoreHome"),
    getTranslations("StoreNav"),
    getFormatter(),
    getStoreOffers(sellerId),
    getStoreOrders(sellerId, day),
    getStoreDishes(sellerId),
  ]);

  const isToday = day === today;
  const date = format.dateTime(new Date(`${day}T12:00:00+07:00`), {
    day: "2-digit",
    month: "2-digit",
  });
  const posts = offersOfDay(offers, day);
  const summary = summarizeDay(orders, posts);
  const groups = groupOrders(orders);
  const postHref = `/stores/${sellerId}/offers/new`;
  const ordersHref = (tab: OrderTab) => ({
    pathname: `/stores/${sellerId}/orders`,
    query: { ...(isToday ? {} : { day }), ...(tab === "preparing" ? {} : { tab }) },
  });
  // A chip filters the home's own list in place, keeping the day and the place on the page.
  const filterHref = (name: OrderTab) => ({
    pathname: `/stores/${sellerId}`,
    query: { ...(isToday ? {} : { day }), ...(name === "preparing" ? {} : { tab: name }) },
  });
  const shown = groups[tab];

  return (
    <>
      <div className="md:hidden">
        <StoreTitleRow title={store.name} phoneTitle={n("home")} />
      </div>
      <StoreHero store={store} postHref={postHref} />
      <StoreStatus store={store} />

      {offers.length === 0 && (
        <section aria-labelledby="store-start" className={cn(card, "items-start")}>
          <div className="flex flex-col gap-1">
            <h2 id="store-start" className="text-card-title">
              {t("startTitle")}
            </h2>
            <p className="text-body-sm text-muted-foreground">{t("startBody")}</p>
          </div>
          <Link href={postHref} className={buttonVariants({ size: "lg" })}>
            {t("post")}
          </Link>
        </section>
      )}

      <section aria-labelledby="store-overview" className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="store-overview" className="text-card-title max-md:sr-only">
            {t("overview")}
          </h2>
          <DayBar
            pathname={`/stores/${sellerId}`}
            day={day}
            today={today}
            tab={tab}
            defaultTab="preparing"
            q=""
          />
        </div>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          <Figure
            label={t("held")}
            value={String(summary.held)}
            note={t("heldNote", { count: summary.ready })}
          />
          <Figure
            label={t("collected")}
            value={formatPrice(summary.collectedVnd)}
            note={t("collectedNote", { amount: formatPrice(summary.heldVnd) })}
          />
          <Figure
            label={t("sold")}
            value={t("soldValue", { sold: summary.unitsSold, posted: summary.unitsPosted })}
            note={t("soldNote", { count: summary.unitsLeft })}
          />
          <Figure
            label={t("missed")}
            value={String(summary.missed)}
            note={t("missedNote", { count: summary.orders })}
          />
        </ul>
      </section>

      {isToday && groups.preparing.length > 0 && (
        <section aria-labelledby="store-todo" className={card}>
          <h2 id="store-todo" className="text-card-title">
            {t("todo")}
          </h2>
          <div className="flex items-center gap-3 border-t border-border pt-4 max-md:flex-wrap md:gap-4">
            <span className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
              <Image
                src={`/api${groups.preparing[0].lines[0].photo.smallPath}`}
                alt=""
                fill
                sizes="56px"
                unoptimized
                className="object-cover"
              />
            </span>
            <div className="flex min-w-0 flex-1 flex-col">
              <h3 className="text-title-lg">
                {t("toMarkReady", { count: groups.preparing.length })}
              </h3>
              <p className="text-body-sm text-muted-foreground">
                {groups.preparing
                  .map((order) => order.lines.map((line) => line.name).join(", "))
                  .join(" · ")}
              </p>
            </div>
            <Link href={ordersHref("preparing")} className={cn(buttonVariants(), "max-md:w-full")}>
              {t("seeOrders")}
            </Link>
          </div>
        </section>
      )}

      <section aria-labelledby="store-orders" className={card}>
        <h2 id="store-orders" className="text-card-title">
          {isToday ? t("ordersToday") : t("ordersOn", { date })}
        </h2>
        <nav aria-label={t("orderTabs")}>
          <ul className="-my-1 flex flex-wrap gap-x-2 max-md:grid max-md:grid-cols-4 max-md:gap-x-1.5">
            {orderTabs.map((name) => (
              <li key={name}>
                <Link
                  href={filterHref(name)}
                  scroll={false}
                  aria-current={name === tab ? "page" : undefined}
                  className="group/chip flex min-h-11 items-center rounded-full focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none max-md:rounded-2xl"
                >
                  <span
                    className={cn(
                      "flex h-9.5 items-center gap-1.5 rounded-full border px-4 whitespace-nowrap transition-colors max-md:h-auto max-md:min-h-11 max-md:w-full max-md:flex-col max-md:justify-center max-md:gap-0 max-md:rounded-2xl max-md:px-1 max-md:py-1",
                      name === tab
                        ? "border-primary bg-primary text-body-sm-strong text-primary-foreground"
                        : "border-border bg-card text-body-sm text-foreground group-hover/chip:bg-secondary",
                    )}
                  >
                    <span className="max-md:text-note">{t(`orderTab.${name}`)}</span>
                    {/* As on the Đơn tab: the dot is read, so the link's name is "Chuẩn bị · 3"; a phone stacks the count. */}
                    <span className="max-md:sr-only">·</span>
                    <span className="max-md:text-body-sm-strong">{groups[name].length}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {shown.length === 0 ? (
          <p className="border-t border-border pt-4 text-body-sm text-muted-foreground">
            {t(`ordersEmpty.${tab}`)}
          </p>
        ) : (
          <ul className="flex flex-col border-t border-border">
            {shown.slice(0, SHOWN).map((order) => (
              <OrderRow key={order.id} order={order} tab={tab} />
            ))}
          </ul>
        )}
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <section aria-labelledby="store-posts" className={card}>
          <h2 id="store-posts" className="text-card-title">
            {isToday ? t("postsToday") : t("postsOn", { date })}
          </h2>
          {posts.length === 0 ? (
            <p className="border-t border-border pt-4 text-body-sm text-muted-foreground">
              {t("postsEmpty")}
            </p>
          ) : (
            <ul className="flex flex-col border-t border-border">
              {posts.slice(0, SHOWN).map((offer) => (
                <PostRow
                  key={offer.id}
                  offer={offer}
                  action={
                    <span className={actionColumn}>
                      <PostBadge offer={offer} />
                    </span>
                  }
                />
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="store-catalog" className={card}>
          <h2 id="store-catalog" className="text-card-title">
            {t("catalog", { count: dishes.length })}
          </h2>
          {dishes.length === 0 ? (
            <p className="border-t border-border pt-4 text-body-sm text-muted-foreground">
              {t("catalogEmpty")}
            </p>
          ) : (
            <ul className="flex flex-col border-t border-border">
              {dishes.slice(0, SHOWN).map((dish) => (
                <li
                  key={dish.id}
                  className="flex items-center gap-3 border-b border-border py-4 last:border-b-0 last:pb-0 md:gap-4"
                >
                  <span
                    className={cn(
                      "relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted",
                      dish.hidden && "opacity-50",
                    )}
                  >
                    <Image
                      src={`/api${dish.photo.smallPath}`}
                      alt=""
                      fill
                      sizes="56px"
                      unoptimized
                      className="object-cover"
                    />
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <h3 className={cn("text-title-lg", dish.hidden && "text-muted-foreground")}>
                      {dish.name}
                    </h3>
                    {dish.hidden && (
                      <p className="text-body-sm text-muted-foreground">{t("dishHidden")}</p>
                    )}
                  </div>
                  <span className={actionColumn}>
                    {dish.hidden ? (
                      <ShowDishButton dishId={dish.id} label={t("showDish")} />
                    ) : (
                      <Link
                        href={`/stores/${sellerId}/catalog/${dish.id}/post`}
                        className={buttonVariants()}
                      >
                        {t("postNow")}
                      </Link>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <Link
        href={postHref}
        aria-label={t("post")}
        className={cn(
          buttonVariants({ size: "icon-lg" }),
          "fixed right-4 bottom-24 z-40 shadow-nav md:hidden",
        )}
      >
        <PlusIcon aria-hidden className="size-6" />
      </Link>
    </>
  );
}

/** One figure of the overview (Figma Q1b): what it counts, the number, and one short line under it. */
function Figure({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <li className="flex flex-col gap-1 rounded-2xl border border-border bg-card p-4 text-card-foreground md:p-5">
      <span className="text-body-sm text-muted-foreground">{label}</span>
      <span className="text-page-title">{value}</span>
      <span className="text-body-sm text-muted-foreground">{note}</span>
    </li>
  );
}

/** Where a post of the day stands, as a word beside it: units left, sold out, over or withdrawn. */
async function PostBadge({ offer }: { offer: OfferBody }) {
  const t = await getTranslations("StoreHome");
  switch (offer.status) {
    case "on_sale":
      return <Badge variant="fresh">{t("left", { count: offer.unitsLeft })}</Badge>;
    case "sold_out":
      return <Badge variant="soldOut">{t("soldOut")}</Badge>;
    case "withdrawn":
      return <Badge variant="neutral">{t("withdrawn")}</Badge>;
    default:
      return <Badge variant="neutral">{t("closed")}</Badge>;
  }
}

// The blue card that opens the home on a computer (Figma Q1b): the store's photo, whether it is open, its name and
// address, and its two ways on, to the page customers see and to a new post. On a phone the header carries the name.
async function StoreHero({ store, postHref }: { store: SellerBody; postHref: string }) {
  const t = await getTranslations("StoreHome");
  const photo = store.photoId ? { smallPath: `/photos/${store.photoId}/400.jpg` } : undefined;

  return (
    <section className="relative isolate flex items-center justify-between gap-6 overflow-hidden rounded-2xl bg-header p-8 text-header-foreground max-md:hidden">
      <HeaderSweep />
      <div className="relative flex min-w-0 items-center gap-5">
        <SellerAvatar seller={{ ...store, photo }} size="md" />
        <div className="flex min-w-0 flex-col items-start gap-1.5">
          <Badge variant={statusBadge[store.status]}>{t(`status.${store.status}`)}</Badge>
          <h1 className="text-page-title">{store.name}</h1>
          <p className="text-body-sm">{store.address}</p>
        </div>
      </div>
      <div className="relative flex shrink-0 items-center gap-3">
        <Link
          href={`/sellers/${store.id}`}
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          {t("viewStore")}
        </Link>
        <Link href={postHref} className={buttonVariants({ variant: "secondary", size: "lg" })}>
          <PlusIcon aria-hidden data-icon="inline-start" />
          {t("post")}
        </Link>
      </div>
    </section>
  );
}

const statusBadge = {
  active: "success",
  pending: "warning",
  rejected: "danger",
  blocked: "danger",
} as const satisfies Record<SellerBody["status"], "success" | "warning" | "danger">;

/** What a store that is not open is told, with the reason an admin gave (SEC-64, SEC-71). */
async function StoreStatus({ store }: { store: SellerBody }) {
  if (store.status === "active") return null;
  const t = await getTranslations("StoreHome");
  return (
    <Alert variant={store.status === "pending" ? "warning" : "destructive"}>
      <AlertTitle>{t(`statusTitle.${store.status}`)}</AlertTitle>
      <AlertDescription>{store.statusReason ?? t(`statusBody.${store.status}`)}</AlertDescription>
    </Alert>
  );
}
