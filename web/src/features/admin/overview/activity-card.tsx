import { InboxIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Item, ItemActions, ItemContent, ItemGroup, ItemTitle } from "@/components/ui/item";

import type { Activity } from "./activity";

/**
 * What happened last (Figma AD-TQ1 › Card · Hoạt động gần đây): the newest stores and posts, newest first, each
 * with its time and day, since the summary keeps the newest whenever they were.
 */
export function ActivityCard({ activity }: { activity: Activity[] }) {
  const t = useTranslations("admin.overview.activity");
  const format = useFormatter();

  return (
    <section aria-labelledby="overview-activity" className="min-w-0">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>
            <h2 id="overview-activity">{t("title")}</h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activity.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <InboxIcon aria-hidden />
                </EmptyMedia>
                <EmptyTitle>{t("empty")}</EmptyTitle>
              </EmptyHeader>
            </Empty>
          ) : (
            <ItemGroup>
              {activity.map((item) => {
                const at = new Date(item.at);
                return (
                  <Item key={item.key} render={<li />} size="sm">
                    <ItemContent>
                      <ItemTitle>
                        {item.kind === "sellerOpened"
                          ? t("sellerOpened", { seller: item.sellerName })
                          : t("offerPosted", { seller: item.sellerName, offer: item.offerName })}
                      </ItemTitle>
                    </ItemContent>
                    <ItemActions>
                      <time
                        dateTime={at.toISOString()}
                        className="text-label text-muted-foreground"
                      >
                        {format.dateTime(at, "time")}, {format.dateTime(at, "day")}
                      </time>
                    </ItemActions>
                  </Item>
                );
              })}
            </ItemGroup>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
