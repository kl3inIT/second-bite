import { useFormatter, useTranslations } from "next-intl";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";

import type { NotificationChannel } from "./campaign";

/**
 * A notification as people will get it (Figma AD-MK6 › Xem trước thông báo): a push on a phone's lock screen with
 * its time and day, the app's "sb" and its title and text; an email shows as a message in the inbox. `day` and
 * `time` are Vietnam wall-clock values; without them the lock screen shows no clock.
 */
export function NotificationPreview({
  channel,
  title,
  body,
  day,
  time,
}: {
  channel: NotificationChannel;
  title: string;
  body: string;
  day?: string;
  time?: string;
}) {
  const t = useTranslations("admin.notifications.preview");
  const format = useFormatter();
  const shownTitle = title || t("titlePlaceholder");
  const shownBody = body || t("bodyPlaceholder");

  if (channel === "email") {
    return (
      <div className="flex w-full max-w-97.5 flex-col gap-3 rounded-4xl border-6 border-border bg-muted px-4 pt-10 pb-20">
        <Card size="sm">
          <CardHeader>
            <CardDescription>{t("emailFrom")}</CardDescription>
            <CardTitle>{shownTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line">{shownBody}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-97.5 flex-col items-center gap-2 rounded-4xl border-6 border-border bg-primary px-4 pt-10 pb-40">
      {day && time && (
        <>
          <span className="font-display text-display text-primary-foreground">{time}</span>
          <span className="text-body-sm-strong text-primary-foreground">
            {format.dateTime(new Date(`${day}T12:00:00+07:00`), "weekdayDay")}
          </span>
        </>
      )}
      <Card size="sm" className="w-full">
        <CardContent>
          <Item size="xs">
            <ItemMedia>
              <Avatar aria-hidden>
                <AvatarFallback>sb</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent className="min-w-0">
              <ItemDescription>{t("pushFrom")}</ItemDescription>
              <ItemTitle>{shownTitle}</ItemTitle>
              <ItemDescription>{shownBody}</ItemDescription>
            </ItemContent>
          </Item>
        </CardContent>
      </Card>
    </div>
  );
}
