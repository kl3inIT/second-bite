import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import type { BadgeTone } from "./badge";

const surfaces: Record<BadgeTone, { card: string; title: string }> = {
  error: { card: "bg-destructive-muted", title: "text-destructive" },
  warning: { card: "bg-warning", title: "text-warning-foreground" },
  success: { card: "bg-fresh-muted", title: "text-success" },
  info: { card: "bg-secondary", title: "text-primary" },
  neutral: { card: "bg-muted", title: "text-foreground" },
};

const inks: Record<BadgeTone, string> = {
  error: "text-destructive",
  warning: "text-warning-foreground",
  success: "text-success",
  info: "text-primary",
  neutral: "text-muted-foreground",
};

export type StatusLine = { icon: LucideIcon; text: string; tone?: BadgeTone };

/**
 * What a state means, at the head of a detail page's right column (Figma Admin/StatusCard 228:6259, AD-Q4): a
 * title in the tone's colour, "Cửa hàng đang bị chặn", then each consequence with its icon, "Không hiện với khách",
 * its icon coloured by the line's own tone. No "since" line. It replaces a banner across the page.
 */
export function StatusCard({
  title,
  tone,
  lines,
}: {
  title: string;
  tone: BadgeTone;
  lines: StatusLine[];
}) {
  return (
    <section
      className={cn("flex flex-col gap-3 rounded-2xl px-6 pt-5 pb-5.5", surfaces[tone].card)}
    >
      <h2 className={cn("text-title-lg", surfaces[tone].title)}>{title}</h2>
      <ul className="flex flex-col gap-3">
        {lines.map(({ icon: Icon, text, tone: lineTone = tone }) => (
          <li key={text} className="flex gap-2.5 text-body-sm text-foreground">
            <Icon aria-hidden className={cn("mt-0.5 size-4.5 shrink-0", inks[lineTone])} />
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
