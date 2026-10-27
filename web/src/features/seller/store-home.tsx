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
import { photoUrl } from "@/lib/api/photo";

import { DayBar } from "./day-filter";
import { getStoreDishes, getStoreOffers, getStoreOrders, getStoreReviews } from "./my-sellers";
import { OrderRow } from "./order-row";
import { PostRow } from "./post-row";
import { requireStore } from "./require-store";
import { ShowDishButton } from "./show-dish-button";
import {
  dayOrNull,
  loadHomeSearchParams,
  serializeHomeSearchParams,
  serializeOrderSearchParams,
} from "./search-params";
import { vietnamToday } from "./store-day";
import { offersOfDay } from "./store-offers";
import { groupOrders, orderTabs, type OrderTab } from "./store-orders";
import { BoxSection, DishBox, PostBox } from "./store-home-boxes";
import { StorePanel } from "./store-panel";
import { StatusTabs } from "./status-tabs";
import { StoreReviewsCard } from "./store-reviews-card";
import { summarizeDay } from "./store-summary";
import { StoreTitleRow } from "./store-title-row";

/** How many orders, posts and dishes the home lists; each card's chips or title lead to the whole tab. */
const SHOWN = 3;

/** How many of the latest reviews the home's card reads; a phone shows the first. */
const REVIEWS_SHOWN = 3;

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

  // The session is read before the clock, so the page is made for each request and never at build time.
  const store = await requireStore(sellerId, `/stores/${sellerId}`);
  const today = vietnamToday();
  const view = loadHomeSearchParams(query);
  const day = view.day ?? today;
  const tab = view.tab;

  const [t, n, format, offers, orders, dishes, reviews] = await Promise.all([
    getTranslations("StoreHome"),
    getTranslations("StoreNav"),
    getFormatter(),
    getStoreOffers(sellerId),
    getStoreOrders(sellerId, day),
    getStoreDishes(sellerId),
    getStoreReviews(sellerId, [], REVIEWS_SHOWN),
  ]);

  const isToday = day === today;
  const date = format.dateTime(new Date(`${day}T12:00:00+07:00`), "dayMonth");
  const posts = offersOfDay(offers, day);
  const summary = summarizeDay(orders, posts);
  const groups = groupOrders(orders);
  const postHref = `/stores/${sellerId}/offers/new`;
  const ordersHref = (tab: OrderTab) =>
    `/stores/${sellerId}/orders${serializeOrderSearchParams({ day: dayOrNull(day, today), tab })}`;
  // A chip filters the home's own list in place, keeping the day and the place on the page.
  const filterHref = (name: OrderTab) =>
    `/stores/${sellerId}${serializeHomeSearchParams({ day: dayOrNull(day, today), tab: name })}`;
  const shown = groups[tab];

  return (
    <>
      <div className="md:hidden">
        <StoreTitleRow title={store.name} phoneTitle={n("home")} />
      </div>
      <StoreHero store={store} postHref={postHref} />
      <StoreStatus store={store} />

      {offers.length === 0 && (
        <StorePanel labelledBy="store-start" className="items-start">
          <div className="flex flex-col gap-1">
            <h2 id="store-start" className="text-card-title">
              {t("startTitle")}
            </h2>
            <p className="text-body-sm text-muted-foreground">{t("startBody")}</p>
          </div>
          <Link href={postHref} className={buttonVariants({ size: "lg" })}>
            {t("post")}
          </Link>
        </StorePanel>
      )}

      <section aria-labelledby="store-overview" className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="store-overview" className="text-card-title max-md:sr-only">
            {t("overview")}
          </h2>
          <DayBar pathname={`/stores/${sellerId}`} list="home" today={today} />
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

      {/* A phone leaves it out: the orders card under it opens on the same orders (Figma Q1b-1). */}
      {isToday && groups.preparing.length > 0 && (
        <div className="max-md:hidden">
          <StorePanel labelledBy="store-todo">
            <h2 id="store-todo" className="text-card-title">
              {t("todo")}
            </h2>
            <div className="flex items-center gap-3 border-t border-border pt-4 max-md:flex-wrap md:gap-4">
              <span className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image
                  src={photoUrl(groups.preparing[0].lines[0].photo.smallPath)}
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
              <Link
                href={ordersHref("preparing")}
                className={cn(buttonVariants(), "max-md:w-full")}
              >
                {t("seeOrders")}
              </Link>
            </div>
          </StorePanel>
        </div>
      )}

      <StorePanel labelledBy="store-orders">
        <h2 id="store-orders" className="text-card-title">
          {isToday ? t("ordersToday") : t("ordersOn", { date })}
        </h2>
        <StatusTabs
          label={t("orderTabs")}
          selected={tab}
          scroll={false}
          nameOnly
          tabs={orderTabs.map((name) => ({
            name,
            href: filterHref(name),
            label: t(`orderTabName.${name}`),
            count: groups[name].length,
          }))}
        />
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
      </StorePanel>

      <div className="flex flex-col gap-4 md:hidden">
        <BoxSection
          id="store-posts-phone"
          title={isToday ? t("postsToday") : t("postsOn", { date })}
          empty={posts.length === 0 ? t("postsEmpty") : undefined}
        >
          {posts.slice(0, SHOWN).map((offer) => (
            <PostBox key={offer.id} offer={offer} />
          ))}
        </BoxSection>
        <BoxSection
          id="store-catalog-phone"
          title={t("catalog", { count: dishes.length })}
          empty={dishes.length === 0 ? t("catalogEmpty") : undefined}
        >
          {dishes.slice(0, SHOWN).map((dish) => (
            <DishBox key={dish.id} dish={dish} sellerId={sellerId} />
          ))}
        </BoxSection>
      </div>

      <div className="grid gap-4 max-md:hidden md:grid-cols-2">
        <StorePanel labelledBy="store-posts">
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
        </StorePanel>

        <StorePanel labelledBy="store-catalog">
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
                      src={photoUrl(dish.photo.smallPath)}
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
        </StorePanel>
      </div>

      <StoreReviewsCard sellerId={sellerId} reviews={reviews} />

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
