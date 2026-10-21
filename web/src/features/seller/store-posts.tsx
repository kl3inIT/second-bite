import { getFormatter, getTranslations } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { DayFilter } from "./day-filter";
import { getStoreOffers } from "./my-sellers";
import { PostRow } from "./post-row";
import { PostToast } from "./post-toast";
import { requireStore } from "./require-store";
import {
  dayOrNull,
  loadPostSearchParams,
  searchOf,
  serializePostSearchParams,
} from "./search-params";
import { vietnamToday } from "./store-day";
import { groupByTab, matchesName, offersOfDay, postTabs } from "./store-offers";
import { StorePanel } from "./store-panel";
import { StoreTitleRow, titleActionPhone } from "./store-title-row";

/** The line at the foot for what was just done, or nothing when the address carries nothing known. */
function noticeMessage(
  notice: string | undefined,
  t: Awaited<ReturnType<typeof getTranslations<"StorePosts">>>,
): string | undefined {
  if (notice === "saved") return t("saved");
  if (notice === "withdrawn") return t("withdrawn");
  const units = Number(/^posted:(\d+)$/.exec(notice ?? "")?.[1]);
  return units > 0 ? t("posted", { count: units }) : undefined;
}

// The store's post tab (SEC-57, Figma Q2, S1, S2): "Đăng món", then one card holding the three lists as
// chips with their counts: on sale, sold out, and over (closed or withdrawn). A row has what the person can do
// with it: change it, or post it again once it is over. It reads the session, so it renders inside Suspense.
export async function StorePosts({
  sellerId: pendingId,
  query: pendingQuery,
}: {
  sellerId: Promise<string>;
  /** The address's query: the tab, the day, the search, and what was just done (`posted:3`, `saved`, `withdrawn`), which the line at the foot says once. */
  query: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sellerId = await pendingId;
  const query = await pendingQuery;
  const one = (name: string) => (typeof query[name] === "string" ? query[name] : undefined);

  const [t, format, offers] = await Promise.all([
    getTranslations("StorePosts"),
    getFormatter(),
    requireStore(sellerId, `/stores/${sellerId}/offers`).then(() => getStoreOffers(sellerId)),
  ]);
  // The session is read before the clock, so the page is made for each request and never at build time.
  const today = vietnamToday();
  const filter = loadPostSearchParams(query);
  const day = filter.day ?? today;
  const { tab } = filter;
  const search = searchOf(filter.q);
  const notice = one("notice");

  // A store's posts are few in a day, so the day and the search read them here rather than asking the server again.
  const ofDay = offersOfDay(offers, day);
  const found = ofDay.filter((offer) => matchesName(offer, search));
  const groups = groupByTab(found);
  const shown = groups[tab];
  const searching = search !== "";
  // The view in the address, without what is as the page opens: today, the first tab, no search.
  const view = serializePostSearchParams({ day: dayOrNull(day, today), tab, q: search });
  const title =
    day === today
      ? t("today")
      : t("onDay", {
          date: format.dateTime(new Date(`${day}T12:00:00+07:00`), "dayMonth"),
        });

  const message = noticeMessage(notice, t);

  return (
    <>
      {message && <PostToast message={message} to={`/stores/${sellerId}/offers${view}`} />}
      <StoreTitleRow
        title={t("title")}
        aside={
          <Link
            href={`/stores/${sellerId}/offers/new`}
            className={cn(buttonVariants({ size: "lg" }), titleActionPhone)}
          >
            {t("post")}
          </Link>
        }
      />

      <DayFilter
        pathname={`/stores/${sellerId}/offers`}
        list="posts"
        today={today}
        label={t("searchLabel")}
        placeholder={t("searchPlaceholder")}
      />

      <StorePanel labelledBy="store-posts">
        <h2 id="store-posts" className="text-card-title">
          {title}
        </h2>
        <nav aria-label={t("tabs")}>
          <ul className="-my-1 flex flex-wrap gap-x-2">
            {postTabs.map((name) => (
              <li key={name}>
                <Link
                  href={`/stores/${sellerId}/offers${serializePostSearchParams({ day: dayOrNull(day, today), tab: name, q: search })}`}
                  aria-current={name === tab ? "page" : undefined}
                  className="group/chip flex min-h-11 items-center rounded-full focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <span
                    className={cn(
                      "flex h-9.5 items-center rounded-full border px-4 whitespace-nowrap transition-colors",
                      name === tab
                        ? "border-primary bg-primary text-body-sm-strong text-primary-foreground"
                        : "border-border bg-card text-body-sm text-foreground group-hover/chip:bg-secondary",
                    )}
                  >
                    {t(`tab.${name}`, { count: groups[name].length })}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {shown.length === 0 ? (
          <p className="border-t border-border pt-4 text-body-sm text-muted-foreground">
            {searching
              ? t("emptySearch", { query: search })
              : ofDay.length === 0
                ? t(day === today ? "emptyAll" : "emptyDay")
                : t(`empty.${tab}`)}
          </p>
        ) : (
          <ul className="flex flex-col border-t border-border">
            {shown.map((offer) => (
              <PostRow
                key={offer.id}
                offer={offer}
                action={
                  tab === "closed" ? (
                    <Link
                      href={{
                        pathname: `/stores/${sellerId}/offers/new`,
                        query: { from: offer.id },
                      }}
                      className={buttonVariants({ variant: "outline" })}
                    >
                      {t("postAgain")}
                    </Link>
                  ) : (
                    <Link
                      href={`/stores/${sellerId}/offers/${offer.id}/edit`}
                      className={buttonVariants({ variant: "outline" })}
                    >
                      {t("edit")}
                    </Link>
                  )
                }
              />
            ))}
          </ul>
        )}
      </StorePanel>
    </>
  );
}
