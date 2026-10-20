import { getTranslations } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { getStoreOffers } from "./my-sellers";
import { PostRow } from "./post-row";
import { PostToast } from "./post-toast";
import { requireStore } from "./require-store";
import { groupByTab, postTabs, readPostTab } from "./store-offers";

// The store's post tab (SEC-57, Figma Q2, S1, S2): "Đăng món", then one card holding the three lists as
// chips with their counts: on sale, sold out, and over (closed or withdrawn). A row has what the person can do
// with it: change it, or post it again once it is over. It reads the session, so it renders inside Suspense.
export async function StorePosts({
  sellerId: pendingId,
  tab: pendingTab,
  posted: pendingPosted,
}: {
  sellerId: Promise<string>;
  tab: Promise<string | undefined>;
  /** How many units were just posted, from the address; the line at the foot says so once. */
  posted?: Promise<string | undefined>;
}) {
  const sellerId = await pendingId;
  const [t, tabName, posted, offers] = await Promise.all([
    getTranslations("StorePosts"),
    pendingTab,
    pendingPosted,
    requireStore(sellerId, `/stores/${sellerId}/offers`).then(() => getStoreOffers(sellerId)),
  ]);
  const tab = readPostTab(tabName);
  const groups = groupByTab(offers);
  const shown = groups[tab];

  const postedUnits = Number(posted);

  return (
    <>
      {Number.isInteger(postedUnits) && postedUnits > 0 && (
        <PostToast
          message={t("posted", { count: postedUnits })}
          to={`/stores/${sellerId}/offers`}
        />
      )}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-page-title text-foreground">{t("title")}</h1>
        <Link href={`/stores/${sellerId}/offers/new`} className={buttonVariants({ size: "lg" })}>
          {t("post")}
        </Link>
      </div>

      <section
        aria-labelledby="store-posts"
        className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 text-card-foreground"
      >
        <h2 id="store-posts" className="text-title-lg">
          {t("today")}
        </h2>
        <nav aria-label={t("tabs")}>
          <ul className="-my-1 flex flex-wrap gap-x-2">
            {postTabs.map((name) => (
              <li key={name}>
                <Link
                  href={{
                    pathname: `/stores/${sellerId}/offers`,
                    query: name === "on_sale" ? {} : { tab: name },
                  }}
                  aria-current={name === tab ? "page" : undefined}
                  className="group/chip flex min-h-11 items-center rounded-full focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <span
                    className={cn(
                      "flex h-9 items-center rounded-full border px-3.5 text-label-strong whitespace-nowrap transition-colors",
                      name === tab
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-foreground group-hover/chip:bg-secondary",
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
            {offers.length === 0 ? t("emptyAll") : t(`empty.${tab}`)}
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
      </section>
    </>
  );
}
