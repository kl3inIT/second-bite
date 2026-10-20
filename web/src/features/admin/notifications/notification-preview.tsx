import { useFormatter, useTranslations } from "next-intl";

import type { NotificationChannel } from "./campaign";

/**
 * A notification as people will get it (Figma AD-MK6 › Xem trước thông báo): a push on a phone's blue lock
 * screen with its time and day, the app's "sb" and its title and text; an email shows as a message in the
 * inbox. `day` and `time` are Vietnam wall-clock values; without them the lock screen shows no clock.
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
        <div className="flex flex-col gap-1 rounded-2xl bg-card p-4">
          <span className="text-label text-muted-foreground">{t("emailFrom")}</span>
          <span className="text-body-sm-strong text-foreground">{shownTitle}</span>
          <p className="text-body-sm whitespace-pre-line text-foreground">{shownBody}</p>
        </div>
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
      <div className="flex w-full gap-2.5 rounded-xl bg-card p-3">
        <span
          aria-hidden
          className="flex size-9 shrink-0 items-center justify-center rounded-sm bg-fresh text-label-strong text-primary"
        >
          sb
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-label text-muted-foreground">{t("pushFrom")}</span>
          <span className="text-body-sm-strong text-foreground">{shownTitle}</span>
          <p className="line-clamp-2 text-body-sm text-foreground">{shownBody}</p>
        </div>
      </div>
    </div>
  );
}
