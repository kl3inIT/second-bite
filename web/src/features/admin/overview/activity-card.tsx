import { useTranslations } from "next-intl";

import { EmptyState } from "@/features/admin/ui/empty-state";
import { Timeline } from "@/features/admin/ui/timeline";

import type { Activity } from "./activity";

/**
 * What happened last (Figma AD-TQ1 › Card · Hoạt động gần đây): the newest stores and posts, newest first, each
 * with its time and day, since the summary keeps the newest whenever they were.
 */
export function ActivityCard({ activity }: { activity: Activity[] }) {
  const t = useTranslations("admin.overview.activity");

  return (
    <section
      aria-labelledby="overview-activity"
      className="flex min-w-0 flex-col gap-3 rounded-2xl border border-border bg-card px-6 pt-6 pb-5"
    >
      <h2 id="overview-activity" className="text-title-lg text-foreground">
        {t("title")}
      </h2>
      {activity.length === 0 ? (
        <EmptyState title={t("empty")} />
      ) : (
        <Timeline
          events={activity.map((item) => ({
            key: item.key,
            at: item.at,
            title:
              item.kind === "sellerOpened"
                ? t("sellerOpened", { seller: item.sellerName })
                : t("offerPosted", { seller: item.sellerName, offer: item.offerName }),
          }))}
        />
      )}
    </section>
  );
}
