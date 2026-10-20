import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { DishBody } from "@/lib/api/generated";
import { cn } from "@/lib/utils";

import { getStoreDishes } from "./my-sellers";
import { PostToast } from "./post-toast";
import { requireStore } from "./require-store";
import { ShowDishButton } from "./show-dish-button";

// The store's catalog tab (SEC-55, Figma Q3, Q3b): "Thêm món", then one card with the count and a row for each
// dish, the newest first. A hidden dish has a faded photo and its name in the muted ink (no text is faded, which
// would fall under the contrast the web keeps), says "Đang ẩn", and offers "Hiện lại" in place of "Đăng ngay". `children` is
// the drawer that posts a dish over the list (Figma D1). It reads the session, so it renders inside Suspense.
export async function StoreCatalog({
  sellerId: pendingId,
  notice: pendingNotice,
  children,
}: {
  sellerId: Promise<string>;
  notice?: Promise<string | undefined>;
  children?: React.ReactNode;
}) {
  const sellerId = await pendingId;
  const [t, kindName, notice, dishes] = await Promise.all([
    getTranslations("StoreCatalog"),
    getTranslations("OfferKind"),
    pendingNotice,
    requireStore(sellerId, `/stores/${sellerId}/catalog`).then(() => getStoreDishes(sellerId)),
  ]);
  const message =
    notice === "saved" || notice === "deleted" || notice === "shown"
      ? t(`notice.${notice}`)
      : undefined;

  function meta(dish: DishBody) {
    const line = `${kindName(dish.kind)} · 1 ${dish.unit}`;
    return dish.hidden ? `${line} · ${t("hidden")}` : line;
  }

  return (
    <>
      {message && <PostToast message={message} to={`/stores/${sellerId}/catalog`} />}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-page-title text-foreground">{t("title")}</h1>
        <Link href={`/stores/${sellerId}/catalog/new`} className={buttonVariants({ size: "lg" })}>
          {t("add")}
        </Link>
      </div>

      <section
        aria-labelledby="store-dishes"
        className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 text-card-foreground"
      >
        <h2 id="store-dishes" className="text-card-title">
          {dishes.length === 0 ? t("emptyTitle") : t("count", { count: dishes.length })}
        </h2>
        {dishes.length === 0 ? (
          <p className="text-body-sm text-muted-foreground">{t("empty")}</p>
        ) : (
          <ul className="flex flex-col border-t border-border">
            {dishes.map((dish) => (
              <li
                key={dish.id}
                className="flex items-center gap-4 border-b border-border py-4 last:border-b-0 last:pb-0"
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
                  <h3
                    className={cn("truncate text-title-lg", dish.hidden && "text-muted-foreground")}
                  >
                    {dish.name}
                  </h3>
                  <p className="text-body-sm text-muted-foreground">{meta(dish)}</p>
                </div>
                <Link
                  href={`/stores/${sellerId}/catalog/${dish.id}/edit`}
                  className={buttonVariants({ variant: "outline" })}
                >
                  {t("edit")}
                </Link>
                {dish.hidden ? (
                  <ShowDishButton dishId={dish.id} />
                ) : (
                  <Link
                    href={`/stores/${sellerId}/catalog/${dish.id}/post`}
                    className={buttonVariants({ variant: "outline" })}
                  >
                    {t("postNow")}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
      {children}
    </>
  );
}
