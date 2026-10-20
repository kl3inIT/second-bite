import { useFormatter } from "next-intl";

import { cn } from "@/lib/utils";

export type TimelineEvent = {
  key: string;
  title: string;
  at: Date | string;
  /** The dot's colour: done in green, an ordinary step in blue, a step not taken yet in grey, a failure in red. */
  tone?: "done" | "step" | "pending" | "error";
};

const dots = {
  done: "bg-success",
  step: "bg-primary",
  pending: "bg-muted-foreground",
  error: "bg-destructive",
};

/**
 * What happened, in order (Figma Admin/Timeline 243:63896, Admin/TimelineItem): a dot on a line, the step's
 * name and, at the right, its time and day. Used for an order's steps and a store's recent activity.
 */
export function Timeline({ events }: { events: TimelineEvent[] }) {
  const format = useFormatter();
  return (
    <ol className="flex flex-col">
      {events.map((event, index) => {
        const at = typeof event.at === "string" ? new Date(event.at) : event.at;
        return (
          <li key={event.key} className="relative flex items-start gap-3 pb-4 last:pb-0">
            {index < events.length - 1 && (
              <span aria-hidden className="absolute top-3 bottom-0 left-1 w-px bg-border" />
            )}
            <span
              aria-hidden
              className={cn(
                "relative mt-1.5 size-2.5 shrink-0 rounded-full",
                dots[event.tone ?? "step"],
              )}
            />
            <span className="min-w-0 flex-1 text-body-sm-strong text-foreground">
              {event.title}
            </span>
            <time dateTime={at.toISOString()} className="shrink-0 text-label text-muted-foreground">
              {format.dateTime(at, "time")}, {format.dateTime(at, "day")}
            </time>
          </li>
        );
      })}
    </ol>
  );
}
